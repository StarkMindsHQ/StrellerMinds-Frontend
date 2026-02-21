"use client";

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/schemas/otp.schema";
import { verifyOtp, resendOtp } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { z } from "zod";

type FormData = z.infer<typeof otpSchema>;

export default function OtpPage() {
  /* ================= ROUTER ================= */
  const router = useRouter();

  /* ================= REFS ================= */
  const inputsRef = useRef<(HTMLInputElement | null)[]>(
    Array(6).fill(null)
  );

  /* ================= STATE ================= */
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  /* ================= FORM ================= */
  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  /* ================= EFFECTS ================= */

  // Countdown Timer (Optimized: single interval)
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ================= HANDLERS ================= */

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const otpArray = inputsRef.current.map(
      (input) => input?.value || ""
    );

    otpArray[index] = value;

    const otpString = otpArray.join("");
    setValue("otp", otpString);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .slice(0, 6);

    if (!/^\d+$/.test(pasted)) return;

    pasted.split("").forEach((digit, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index]!.value = digit;
      }
    });

    setValue("otp", pasted);
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      setResending(true);
      await resendOtp();
      setTimer(60);
      setCanResend(false);
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await verifyOtp(data.otp);
      router.replace("/dashboard");
    } catch (err: any) {
      setError("otp", { message: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* ================= JSX ================= */

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md transition-all duration-300 ease-in-out">
      <h1 className="text-xl font-semibold mb-2 text-center">
        Verify OTP
      </h1>

      <p className="text-sm text-gray-500 text-center mb-6">
        Enter the 6-digit code sent to your email
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between gap-2 mb-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              maxLength={1}
              inputMode="numeric"
              className="w-12 h-12 text-center border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-black transition"
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              onPaste={handlePaste}
            />
          ))}
        </div>

        {errors.otp && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errors.otp.message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="mt-4 text-center text-sm">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-black font-medium hover:underline disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-gray-500">
              Resend available in{" "}
              <span className="font-medium text-black">
                {timer}s
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
