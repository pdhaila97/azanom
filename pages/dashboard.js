import * as React from "react";
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { deleteUserInfo, getUserInfo } from "@/utils/helperMethods";
import { get, isEmpty } from "lodash";
import { useRouter } from "next/router";
import BuyerDashboard from "@/components/buyerDashboard";
import SellerDashboard from "@/components/sellerDashboard";
import UserHeaderAndFooter from "@/components/userHeader";

export default function DashboardPage() {
  const [userInfo, setUserInfo] = React.useState({});

  const router = useRouter();

  React.useEffect(() => {
    const userInfo = getUserInfo();
    if (!isEmpty(userInfo)) {
      setUserInfo(userInfo);
    } else {
      router.replace("/login");
    }
  }, []);

  return (
    <UserHeaderAndFooter>
      {isEmpty(userInfo) ? (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          {get(userInfo, "type", "seller") === "buyer" ? (
            <BuyerDashboard />
          ) : (
            <SellerDashboard />
          )}
        </>
      )}
    </UserHeaderAndFooter>
  );
}
