"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogInStore } from "../store/login";

const useAuthRedirect = () => {
  const accessToken = useLogInStore((state) => state.blue_admin_token);
  // const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken, router]);
};

export default useAuthRedirect;
