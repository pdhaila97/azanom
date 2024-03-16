import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  TextareaAutosize,
  TextField
} from "@mui/material";
import { axiosCall } from "@/utils/apiMethods";

const defaultTheme = createTheme();

export default function ContactUsPage() {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axiosCall(process.env.NEXT_PUBLIC_SERVER_URL + '/contact-us', 'POST', {
      email: data.get('email'),
      name: data.get('name'),
      mobileNumber: data.get('mobileNumber')
    }).then(data => {
      data?.message && alert(data.message);
    });

  };

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
          <Typography component="h1" variant="h5">
            Contact Us Page
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              name="name"
              label="Name"
              type="text"
              id="name"
              autoComplete="name"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="mobileNumber"
              label="Mobile Number"
              type="tel"
              id="mobileNumber"
              maxLength={10}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Request Callback
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
