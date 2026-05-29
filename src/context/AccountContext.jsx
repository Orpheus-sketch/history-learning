import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AccountContext = createContext();

const AVATARS = [
  '👤', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '📚', '🏛️', '⚔️', '👑',
  '🐉', '🦅', '🐯', '🦊', '🐼', '🌟', '🎯', '🔥',
  '🌊', '⛰️', '🌸', '🍀', '🎨', '🎵', '💡', '🚀',
  '📖', '✒️', '🗺️', '⚓', '🏴‍☠️',
];

function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem('hl-accounts') || '[]');
  } catch { return []; }
}

function saveAccounts(accounts) {
  localStorage.setItem('hl-accounts', JSON.stringify(accounts));
}

function loadActiveId() {
  return localStorage.getItem('hl-active-account') || null;
}

function saveActiveId(id) {
  if (id) localStorage.setItem('hl-active-account', id);
  else localStorage.removeItem('hl-active-account');
}

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState(loadAccounts);
  const [activeId, setActiveId] = useState(loadActiveId);

  const activeAccount = accounts.find((a) => a.id === activeId) || null;

  const refresh = useCallback(() => {
    setAccounts(loadAccounts());
    setActiveId(loadActiveId());
  }, []);

  const createAccount = (name, phone) => {
    const account = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      phone: phone.trim(),
      nickname: name.trim(),
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      createdAt: new Date().toISOString(),
    };
    const updated = [...loadAccounts(), account];
    saveAccounts(updated);
    saveActiveId(account.id);
    refresh();
    return account;
  };

  const updateProfile = (id, updates) => {
    const all = loadAccounts();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return;
    all[idx] = { ...all[idx], ...updates };
    saveAccounts(all);
    refresh();
  };

  const switchAccount = (id) => {
    saveActiveId(id);
    refresh();
  };

  const deleteAccount = (id) => {
    const all = loadAccounts().filter((a) => a.id !== id);
    saveAccounts(all);
    // Remove progress for this account
    localStorage.removeItem(`hl-progress-${id}`);
    if (activeId === id) {
      const next = all.length > 0 ? all[0].id : null;
      saveActiveId(next);
    }
    refresh();
  };

  const logout = () => {
    saveActiveId(null);
    refresh();
  };

  return (
    <AccountContext.Provider value={{
      accounts, activeAccount, activeId,
      createAccount, updateProfile, switchAccount, deleteAccount, logout,
      AVATARS,
    }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
