import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import Link from "next/link";
import { getUserInfo, setUserInfo } from "@/utils/helperMethods";
import { isEmpty } from "lodash";
import { axiosCall } from "@/utils/apiMethods";
import ReCAPTCHA from "react-google-recaptcha";

const defaultTheme = createTheme();

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [allowedLogin, setAllowLogin] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axiosCall(process.env.NEXT_PUBLIC_SERVER_URL + "/auth/login", "POST", {
      email: data.get("email"),
      password: data.get("password"),
    })
      .then((data) => {
        setUserInfo(data);
        router.replace("/dashboard");
      })
      .catch((error) => {
        alert(error?.message);
      });
  };

  React.useEffect(() => {
    const userInfo = getUserInfo();
    if (!isEmpty(userInfo)) {
      router.replace("/dashboard");
    }
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <></>
  ) : (
    <>
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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
                onChange={() => {
                  setAllowLogin(true);
                }}
              />
              <Button
                type="submit"
                fullWidth
                disabled={!allowedLogin}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default LoginPage;
