import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const email = req.body.email; // Get the user's email from the request body (you may want to secure this step)

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com", // Replace with your email
        pass: "your-email-password",  // Replace with your email password or use OAuth2
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      storedOtp = otp.toString(); // Store the OTP temporarily, or in a session
      res.status(200).json({ success: true, message: "OTP sent" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error sending OTP" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
