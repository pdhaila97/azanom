import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextareaAutosize, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { getUserInfo } from "@/utils/helperMethods";
import { isEmpty } from "lodash";
import { axiosCall } from "@/utils/apiMethods";
import UserHeaderAndFooter from "@/components/userHeader";

const defaultTheme = createTheme();

export default function ContactUsPage() {
  const router = useRouter();

  React.useEffect(() => {
    const userInfo = getUserInfo();
    if (isEmpty(userInfo)) {
      router.replace("/login");
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userInfo = getUserInfo();

    if(data.get("newPassword") !== data.get("confirmNewPassword")) {
      alert('New Password and Confirm New Password do not match')
      return;
    }

    axiosCall(
      process.env.NEXT_PUBLIC_SERVER_URL + "/auth/change-password",
      "POST",
      {
        email: userInfo.email,
        currentPassword: data.get("currentPassword"),
        newPassword: data.get("newPassword"),
      },
      {},
      { sendToken: true }
    )
      .then((data) => {
        alert(data?.message);
        router.push("/dashboard");
      })
      .catch((error) => {
        alert(error?.message);
      });
  };

  return (
    <UserHeaderAndFooter>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Change Password
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="currentPassword"
                type="password"
                label="Current Password"
                name="currentPassword"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmNewPassword"
                label="Confirm New Password"
                type="password"
                id="confirmNewPassword"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Change Password
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </UserHeaderAndFooter>
  );
}
