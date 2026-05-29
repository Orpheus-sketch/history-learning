import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import styles from './ProfileSettings.module.css';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { activeAccount, updateProfile, AVATARS } = useAccount();
  const [nickname, setNickname] = useState(activeAccount?.nickname || '');
  const [avatar, setAvatar] = useState(activeAccount?.avatar || '👤');
  const [saved, setSaved] = useState(false);

  if (!activeAccount) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>請先登錄賬戶</p>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile(activeAccount.id, {
      nickname: nickname.trim() || activeAccount.name,
      avatar,
    });
    setSaved(true);
    setTimeout(() => navigate('/home'), 800);
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>個人設置</h1>
        <p className={styles.subtitle}>自定義你的學習賬戶</p>

        <div className={styles.section}>
          <label className={styles.label}>頭像</label>
          <div className={styles.avatarGrid}>
            {AVATARS.map((a) => (
              <button
                key={a}
                className={`${styles.avatarBtn} ${avatar === a ? styles.avatarActive : ''}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>暱稱</label>
          <input
            className={styles.input}
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={12}
            placeholder="設定你的暱稱"
          />
        </div>

        <div className={styles.info}>
          <p>姓名：{activeAccount.name}</p>
          <p>手機：{activeAccount.phone}</p>
        </div>

        <button className={styles.saveBtn} onClick={handleSave} disabled={saved}>
          {saved ? '✓ 已保存' : '保存設置'}
        </button>
      </div>
    </div>
  );
}
