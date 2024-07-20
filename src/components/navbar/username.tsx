"use client";

import { publicRoutes } from "@/config/routes";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RiLogoutCircleLine } from "react-icons/ri";

const Username = () => {
  const router = useRouter();

  const { data: getUserData } = api.auth.getUser.useQuery(undefined, {
    retry: false,
  });

  const logoutMutation = api.auth.logout.useMutation({
    onSuccess: async () => {
      toast.success("Successfully logged out");
      router.replace(publicRoutes.homepage.link);
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {getUserData?.name ? (
        <div className="group relative">
          {`Hi, ${getUserData.name.split(" ")[0]}`}

          <ul className="absolute right-0 top-full hidden w-28 rounded-md border-2 bg-white px-4 py-3 shadow-xl group-hover:block">
            <li className="flex items-center gap-2" onClick={handleLogout}>
              <RiLogoutCircleLine className="text-base" />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      ) : (
        "Hi, User"
      )}
    </>
  );
};

export default Username;
