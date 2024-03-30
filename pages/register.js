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
import Link from "next/link";
import { FormControl, Radio, RadioGroup } from "@mui/material";
import { axiosCall } from "@/utils/apiMethods";
import { getUserInfo } from "@/utils/helperMethods";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";

const defaultTheme = createTheme();

export default function SignUp() {
  const router = useRouter();
  const [allowRegister, setAllowRegister] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if(data.get('password') !== data.get('confirmPassword')) {
      alert('Password and Confirm Password do not match');
      return;
    }
    axiosCall(process.env.NEXT_PUBLIC_SERVER_URL + '/auth/register', 'POST', {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      type: data.get('type')
    }).then(data => {
      alert(data?.message);
      router.push('/login');
    }).catch(error => {
      alert(error?.message);
    })
  };

  React.useEffect(() => {
    const userInfo = getUserInfo();
    if (!isEmpty(userInfo)) {
      router.replace("/dashboard");
    }
  }, []);

  return (
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="type"
                    name="type"
                    defaultValue={"buyer"}
                  >
                    <FormControlLabel
                      value="buyer"
                      control={<Radio />}
                      label="Buyer"
                    />
                    <FormControlLabel
                      value="seller"
                      control={<Radio />}
                      label="Seller"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <ReCAPTCHA 
                sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
                onChange={() => {
                  setAllowRegister(true)
                }}
              />
            </Grid>
            <Button
              type="submit"
              disabled={!allowRegister}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
