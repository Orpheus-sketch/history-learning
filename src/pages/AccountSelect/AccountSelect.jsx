import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import styles from './AccountSelect.module.css';

export default function AccountSelect() {
  const navigate = useNavigate();
  const { accounts, switchAccount, deleteAccount } = useAccount();
  const [deleteId, setDeleteId] = useState(null);

  const handleSelect = (id) => {
    switchAccount(id);
    navigate('/home');
  };

  const handleDelete = (id) => {
    deleteAccount(id);
    setDeleteId(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>選擇賬戶</h1>
        <p className={styles.subtitle}>選擇已有賬戶或創建新賬戶開始學習</p>

        {accounts.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <p>暫無賬戶，請先創建</p>
          </div>
        ) : (
          <div className={styles.list}>
            {accounts.map((acc) => (
              <div key={acc.id} className={styles.card}>
                <button className={styles.cardMain} onClick={() => handleSelect(acc.id)}>
                  <span className={styles.avatar}>{acc.avatar}</span>
                  <div className={styles.info}>
                    <span className={styles.nickname}>{acc.nickname}</span>
                    <span className={styles.name}>{acc.name} · {acc.phone}</span>
                  </div>
                  <span className={styles.arrow}>→</span>
                </button>
                <button
                  className={styles.delBtn}
                  onClick={(e) => { e.stopPropagation(); setDeleteId(acc.id); }}
                  title="刪除賬戶"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button className={styles.createBtn} onClick={() => navigate('/account/create')}>
          + 創建新賬戶
        </button>

        {deleteId && (
          <div className={styles.modal}>
            <div className={styles.modalBox}>
              <p>確定要刪除此賬戶嗎？</p>
              <p className={styles.modalWarn}>學習進度將一併清除，不可恢復</p>
              <div className={styles.modalBtns}>
                <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>取消</button>
                <button className={styles.confirmBtn} onClick={() => handleDelete(deleteId)}>確認刪除</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
