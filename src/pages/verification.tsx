import { useState } from 'react';
import styles from './verification.module.css';

const VerificationPage = () => {
  // State to hold the OTP code, user input, and verification status
  const [otp, setOtp] = useState<string>(''); // The OTP to be verified
  const [userOtp, setUserOtp] = useState<string>(''); // User input for OTP
  const [isVerified, setIsVerified] = useState<boolean>(false); // Whether OTP is verified or not
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message if OTP is wrong
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false); // Flag to check if OTP was sent
  const [timer, setTimer] = useState<number>(30); // Timer for OTP expiration (in seconds)

  // Function to generate a random OTP
  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
    setOtp(newOtp);
    setIsOtpSent(true);
    setIsVerified(false);
    setErrorMessage('');
    setTimer(30); // Reset the timer each time a new OTP is generated

    // Start countdown for OTP expiration
    let countdown = 30;
    const countdownInterval = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        setIsOtpSent(false); // Disable OTP after expiration
      } else {
        setTimer(countdown);
        countdown -= 1;
      }
    }, 1000);
  };

  // Function to verify the OTP
  const verifyOtp = () => {
    if (userOtp === otp) {
      setIsVerified(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Verify Your Email</h1>

      {isOtpSent ? (
        <div>
          <p>Please enter the OTP sent to your email</p>
          <input
            type="text"
            maxLength={6}
            value={userOtp}
            onChange={(e) => setUserOtp(e.target.value)}
            placeholder="Enter OTP"
            className={styles.input}
          />
          <button onClick={verifyOtp} className={styles.verifyButton}>
            Verify
          </button>
          <p className={styles.timer}>Expires in: {timer}s</p>
        </div>
      ) : (
        <div>
          <button onClick={generateOtp} className={styles.generateButton}>
            Send OTP
          </button>
        </div>
      )}

      {isVerified && (
        <p className={styles.successMessage}>OTP Verified Successfully!</p>
      )}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default VerificationPage;
