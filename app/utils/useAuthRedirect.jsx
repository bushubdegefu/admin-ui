"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogInStore } from "../store/login";

const useAuthRedirect = () => {
  const accessToken = useLogInStore((state) => state.access_token);
  // const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (accessToken == "anonymous") {
      router.push("/login");
    }
  }, [accessToken, router]);
};

export default useAuthRedirect;
