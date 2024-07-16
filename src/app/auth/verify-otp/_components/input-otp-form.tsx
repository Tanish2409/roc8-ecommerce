"use client";

import { maskEmail } from "@/utils/mask-email";
import StyledButton from "@/components/button";
import { StyledOTPInput } from "@/components/input";
import { api } from "@/trpc/react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  email: string;
};

const InputOtpForm: React.FC<Props> = ({ email }) => {
  const [otp, setOtp] = useState("");

  const router = useRouter();

  const verifyOtp = api.auth.verifyOtp.useMutation({
    onSuccess: async () => {
      console.log("user verified");
      router.replace("/login");
    },
    onError: (error) => {
      toast.error(error.message);
      setOtp("");
    },
  });

  const handleSubmit = () => {
    verifyOtp.mutate({ email, otp });
  };
  return (
    <>
      <p className="mb-11 text-center text-base">
        Enter the 8 digit code you have received on
        <br />
        <span className="font-medium">{maskEmail(email)}</span>
      </p>

      <StyledOTPInput value={otp} onChange={setOtp} />

      <StyledButton className="mt-16" onClick={handleSubmit}>
        Verify
      </StyledButton>
    </>
  );
};

export default InputOtpForm;
