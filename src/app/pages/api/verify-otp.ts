import type { NextApiRequest, NextApiResponse } from "next";

let storedOtp = ""; // Temporarily store the OTP, replace this with a DB or session storage in production.

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { otp } = req.body;

    if (otp === storedOtp) {
      return res.status(200).json({ success: true, message: "OTP verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
