import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubject, SUBJECTS } from '../../context/SubjectContext';
import { useAccount } from '../../context/AccountContext';
import styles from './SubjectSelect.module.css';

export default function SubjectSelect() {
  const navigate = useNavigate();
  const { setSubject } = useSubject();
  const { activeAccount, accounts, switchAccount, deleteAccount, createAccount, AVATARS } = useAccount();
  const [accountMode, setAccountMode] = useState(null); // null | 'select' | 'create'
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // If no active account, show account selection by default
  const showSubjects = activeAccount && accountMode === null;
  const showAccountSelect = !activeAccount || accountMode === 'select';
  const showAccountCreate = accountMode === 'create';

  // Select account → show subject cards
  const handleSelectAccount = (id) => {
    switchAccount(id);
    setAccountMode(null);
  };

  // Create account
  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    createAccount(newName, newPhone);
    setNewName('');
    setNewPhone('');
    setAccountMode(null);
  };

  // Delete account
  const handleDelete = (id) => {
    deleteAccount(id);
    setDeleteId(null);
  };

  // Select subject → enter learning
  const handleSelectSubject = (subjectId) => {
    setSubject(subjectId);
    setTimeout(() => navigate('/home'), 300);
  };

  // Logout → back to account selection
  const handleLogout = () => {
    // Just clear mode to show account list
    setAccountMode('select');
  };

  // ===== Account Selection View =====
  const renderAccountSelect = () => (
    <div className={styles.accountPanel}>
      <h2 className={styles.panelTitle}>选择账户</h2>
      <p className={styles.panelSubtitle}>选择已有账户或创建新账户开始学习</p>

      {accounts.length === 0 ? (
        <div className={styles.emptyAccounts}>
          <span className={styles.emptyIcon}>📭</span>
          <p>暂无账户，请先创建</p>
        </div>
      ) : (
        <div className={styles.accountList}>
          {accounts.map((acc) => (
            <div key={acc.id} className={styles.accountCard}>
              <button
                className={styles.accountMain}
                onClick={() => handleSelectAccount(acc.id)}
              >
                <span className={styles.accountAvatar}>{acc.avatar}</span>
                <div className={styles.accountInfo}>
                  <span className={styles.accountNickname}>{acc.nickname}</span>
                  <span className={styles.accountDetails}>{acc.name} · {acc.phone}</span>
                </div>
                <span className={styles.accountArrow}>→</span>
              </button>
              <button
                className={styles.accountDelete}
                onClick={(e) => { e.stopPropagation(); setDeleteId(acc.id); }}
                title="删除账户"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.accountActions}>
        <button className={styles.createAccountBtn} onClick={() => setAccountMode('create')}>
          + 创建新账户
        </button>
        {activeAccount && (
          <button className={styles.backToSubjectsBtn} onClick={() => setAccountMode(null)}>
            ← 返回科目选择
          </button>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <p>确定要删除此账户吗？</p>
            <p className={styles.modalWarn}>学习进度将一并清除，不可恢复</p>
            <div className={styles.modalBtns}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>取消</button>
              <button className={styles.confirmBtn} onClick={() => handleDelete(deleteId)}>确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ===== Account Creation View =====
  const renderAccountCreate = () => (
    <div className={styles.accountPanel}>
      <h2 className={styles.panelTitle}>创建新账户</h2>
      <p className={styles.panelSubtitle}>填写信息，开启学习之旅</p>

      <form className={styles.createForm} onSubmit={handleCreate}>
        <div className={styles.formField}>
          <label>姓名</label>
          <input
            type="text"
            placeholder="请输入你的姓名"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
        </div>
        <div className={styles.formField}>
          <label>手机号</label>
          <input
            type="tel"
            placeholder="请输入你的手机号"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!newName.trim() || !newPhone.trim()}
        >
          创建并进入
        </button>
      </form>

      <button className={styles.backBtn} onClick={() => setAccountMode('select')}>
        ← 返回账户列表
      </button>
    </div>
  );

  // ===== Subject Cards =====
  const renderSubjects = () => (
    <>
      {activeAccount && (
        <div className={styles.userBar}>
          <button className={styles.userBtn} onClick={() => setAccountMode('select')}>
            <span className={styles.userAvatar}>{activeAccount.avatar}</span>
            <span className={styles.userName}>{activeAccount.nickname}</span>
            <span className={styles.userArrow}>▾</span>
          </button>
        </div>
      )}
      <div className={styles.cardsHeader}>
        <h1 className={styles.title}>选择学习科目</h1>
        <p className={styles.subtitle}>选择一个科目，开始你的学习之旅</p>
      </div>

      <div className={styles.cards}>
        {SUBJECTS.map((subj, i) => (
          <button
            key={subj.id}
            className={styles.card}
            onClick={() => handleSelectSubject(subj.id)}
            style={{
              '--card-color': subj.color,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className={styles.cardGlow} />
            <span className={styles.cardIcon}>{subj.icon}</span>
            <h2 className={styles.cardTitle}>{subj.name}</h2>
            <p className={styles.cardDesc}>{subj.desc}</p>
            <span className={styles.cardAction}>
              进入学习
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className={styles.page}>
      {/* Background decoration */}
      <div className={styles.bgOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <div className={styles.content}>
        {showAccountSelect && renderAccountSelect()}
        {showAccountCreate && renderAccountCreate()}
        {showSubjects && renderSubjects()}

        {(showSubjects || showAccountSelect) && (
          <p className={styles.footer}>覆盖初中历史、地理、生物 · 部编版教材同步</p>
        )}
      </div>
    </div>
  );
}
