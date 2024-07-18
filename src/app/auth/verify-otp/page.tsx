import { redirect } from "next/navigation";
import InputOtpForm from "./_components/input-otp-form";
import { publicRoutes } from "@/config/routes";
import { emailSchema } from "@/types/auth";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

const VerifyOTP: React.FC<Props> = ({ searchParams }) => {
  const { email } = searchParams;

  const isEmailValid = emailSchema.safeParse(email);

  if (!isEmailValid.success) {
    redirect(publicRoutes.sigup.link);
  }

  return (
    <>
      <h2 className="mb-8 text-center text-3xl font-semibold">
        Verify your email
      </h2>

      <InputOtpForm email={email as string} />
    </>
  );
};

export default VerifyOTP;
