import { VerityEmailTemplate } from "@/components/email-templates";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";

import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const sendVerifyEmail = async ({
  name,
  otp,
  email,
}: {
  name: string;
  otp: string;
  email: string;
}) => {
  try {
    const { error } = await resend.emails.send({
      from: env.SENDER_EMAIL,
      to: email,
      subject: "Verify Email",
      react: VerityEmailTemplate({ name, otp }),
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error(error);

    throw new TRPCError({
      message: "Otp could not be generated. Please try again later.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};
