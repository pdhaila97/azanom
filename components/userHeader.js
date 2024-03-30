import { deleteUserInfo, getUserInfo } from "@/utils/helperMethods";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const UserHeaderAndFooter = (props) => {
  const [userInfo, setUserInfo] = React.useState({});
  const router = useRouter();

  const onLogoutClick = () => {
    deleteUserInfo();
  };

  const onChangePasswordClick = () => {
    router.push("/change-password");
  };

  const onHeaderLogoClick = () => {
    router.push("/dashboard");
  };

  const onContactUsClick = () => {
    window.open("/contact-us", "_blank");
  };

  const onFeedbackClick = () => {
    window.open("/feedback", "_blank");
  };

  React.useEffect(() => {
    const userInfo = getUserInfo();
    setUserInfo(userInfo);
  }, []);

  if(isEmpty(userInfo)) {
    return null;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar style={{justifyContent: 'space-between'}}>
            <Box display={"flex"} alignItems={"center"}>
              <Image onClick={onHeaderLogoClick} style={{ cursor: "pointer", marginRight: 24 }} src={'/logo.png'} alt="logo" width={150} height={35} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" textAlign={"end"}>
                {userInfo.name}
              </Typography>
              <Button onClick={onChangePasswordClick} color="inherit">
                Change Password
              </Button>
              <>|</>
              <Button onClick={onLogoutClick} color="inherit">
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {props.children}
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation style={{ justifyContent: "space-around" }} showLabels>
          <BottomNavigationAction
            label="Contact Us"
            onClick={onContactUsClick}
          />
          <BottomNavigationAction
            label="Share Feedback"
            onClick={onFeedbackClick}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default UserHeaderAndFooter;
