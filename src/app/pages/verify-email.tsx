import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const VerifyEmail: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const router = useRouter();

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async () => {
    if (otp === "") {
      setErrorMsg("Please enter the OTP.");
      return;
    }

    setIsVerifying(true);
    try {
      // Replace this with your actual backend API endpoint
      const response = await axios.post("/api/verify-otp", { otp });

      if (response.data.success) {
        alert("OTP Verified!");
        router.push("/dashboard"); // Redirect to the dashboard or other page
      } else {
        setErrorMsg("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      // Replace this with your actual API endpoint to resend the OTP
      const response = await axios.post("/api/resend-otp");

      if (response.data.success) {
        alert("New OTP sent to your email.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  return (
    <div className="verify-email-container">
      <h2>Email Verification</h2>
      <p>Enter the OTP code sent to your email:</p>
      <input
        type="text"
        value={otp}
        onChange={handleOtpChange}
        placeholder="Enter OTP"
      />
      <button onClick={handleVerifyOtp} disabled={isVerifying}>
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </button>
      <button onClick={handleResendOtp}>Resend OTP</button>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </div>
  );
};

export default VerifyEmail;
