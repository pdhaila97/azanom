import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getUserInfo } from "@/utils/helperMethods";
import { Backdrop, CircularProgress } from "@mui/material";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userInfo = getUserInfo();
    if (!isEmpty(userInfo)) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, []);

  return (
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
