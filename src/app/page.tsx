import StyledButton from "@/components/button";
import { publicRoutes } from "@/config/routes";
import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <h2 className="mb-9 text-center text-3xl font-semibold">
        👋 Hi, Welcome to Roc8 Ecommerce
      </h2>
      <p className="text-center text-base">The next gen business marketplace</p>

      <div className="flex gap-7">
        <Link href={publicRoutes.login.link} className="grow">
          <StyledButton className="border border-black bg-white text-black">
            Login
          </StyledButton>
        </Link>
        <Link href={publicRoutes.login.link} className="grow">
          <StyledButton>Signup</StyledButton>
        </Link>
      </div>
    </div>
  );
}
