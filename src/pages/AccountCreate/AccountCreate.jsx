import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import styles from './AccountCreate.module.css';

export default function AccountCreate() {
  const navigate = useNavigate();
  const { createAccount } = useAccount();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const n = name.trim();
    const p = phone.trim();

    if (!n) { setError('請輸入姓名'); return; }
    if (n.length < 2) { setError('姓名至少2個字符'); return; }
    if (!p) { setError('請輸入手機號'); return; }
    if (!/^1\d{10}$/.test(p)) { setError('手機號格式不正確（11位以1開頭）'); return; }

    createAccount(n, p);
    navigate('/home');
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link to="/account" className={styles.back}>← 返回</Link>
        <h1 className={styles.title}>創建新賬戶</h1>
        <p className={styles.subtitle}>輸入基本信息即可開始學習</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>真實姓名</label>
            <input
              className={styles.input}
              type="text"
              placeholder="請輸入你的姓名"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              maxLength={20}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>手機號碼</label>
            <input
              className={styles.input}
              type="tel"
              placeholder="請輸入11位手機號"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              maxLength={11}
            />
            <span className={styles.hint}>僅用於賬戶識別，不會上傳到服務器</span>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>
            創建並開始學習
          </button>
        </form>
      </div>
    </div>
  );
}
