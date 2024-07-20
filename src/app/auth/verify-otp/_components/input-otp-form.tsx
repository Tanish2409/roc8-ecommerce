"use client";

import { maskEmail } from "@/utils/mask-email";
import StyledButton from "@/components/button";
import { StyledOTPInput } from "@/components/input";
import { api } from "@/trpc/react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authenticatedRoutes, publicRoutes } from "@/config/routes";
import { useTimer } from "@/utils/useTimer";
import cn from "@/utils/class-names";
import Link from "next/link";

type Props = {
  email: string;
};

const InputOtpForm: React.FC<Props> = ({ email }) => {
  const [otp, setOtp] = useState("");
  const { time, resetTimer } = useTimer(10);

  const resentOtpMutation = api.auth.resendOtp.useMutation({
    onSuccess: async () => {
      resetTimer();
    },
    onError: (error) => {
      resetTimer();
      toast.error(error.message);
      setOtp("");
    },
  });

  const router = useRouter();

  const verifyOtp = api.auth.verifyOtp.useMutation({
    onSuccess: async () => {
      router.push(authenticatedRoutes.categories.link);
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message);
      setOtp("");
    },
  });

  const handleSubmit = () => {
    verifyOtp.mutate({ email, otp });
  };

  const handleResentOtp = () => {
    if (time > 0) return;
    resentOtpMutation.mutate({ email });
  };

  return (
    <>
      <p className="mb-11 text-center text-base">
        Enter the 8 digit code you have received on
        <br />
        <span className="font-medium">{maskEmail(email)}</span>
      </p>

      <StyledOTPInput value={otp} onChange={setOtp} />

      <StyledButton
        className="mt-16"
        onClick={handleSubmit}
        disabled={verifyOtp.isPending || otp.length < 8}
      >
        {verifyOtp.isPending ? "Verifying..." : "Verify"}
      </StyledButton>

      <div className="mt-6 flex items-center justify-between">
        <p
          className={cn(
            "cursor-pointer text-sm text-blue-500",
            time > 0 && "cursor-not-allowed text-gray-400",
          )}
          onClick={handleResentOtp}
        >
          Resend OTP? {time > 0 ? `(${time})` : ""}
        </p>

        <Link href={publicRoutes.sigup.link} className="text-sm">
          {"<-"} Go back to signup?
        </Link>
      </div>
    </>
  );
};

export default InputOtpForm;
