"use client";

import StyledButton from "@/components/button";
import { StyledOTPInput } from "@/components/input";
import { maskEmail } from "@/utils/mask-email";
import { useState } from "react";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");

  const handleSubmit = () => {
    console.log(otp);
  };

  return (
    <>
      <h2 className="mb-8 text-center text-3xl font-semibold">
        Verify your email
      </h2>
      <p className="mb-11 text-center text-base">
        Enter the 8 digit code you have received on
        <br />
        <span className="font-medium">{maskEmail("tanish2409@gmail.com")}</span>
      </p>

      <StyledOTPInput value={otp} onChange={setOtp} />

      <StyledButton className="mt-16" onClick={handleSubmit}>
        Verify
      </StyledButton>
    </>
  );
};

export default VerifyOTP;
