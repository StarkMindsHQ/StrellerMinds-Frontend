import { useState } from 'react';
import styles from './verification.module.css'; 

const VerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerify = () => {
    if (otp.length !== 6) { // Assuming OTP length is 6 digits
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    // Placeholder for OTP verification logic
    alert('OTP Verified!');
  };

  const handleRequestNewCode = () => {
    // Placeholder for requesting a new OTP
    alert('A new OTP has been sent to your email!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Email Verification</h2>
        <p>Please enter the OTP sent to your email address:</p>
        
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          maxLength={6}
          placeholder="Enter OTP"
          className={styles.input}
        />
        
        {error && <div className={styles.error}>{error}</div>}
        
        <button onClick={handleVerify} className={styles.verifyButton}>Verify</button>
        <button onClick={handleRequestNewCode} className={styles.requestButton}>Request New Code</button>
      </div>
    </div>
  );
};

export default VerificationPage;
