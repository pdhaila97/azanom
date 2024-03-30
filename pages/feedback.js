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

export default function FeedbackPage() {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axiosCall(process.env.NEXT_PUBLIC_SERVER_URL + '/feedback', 'POST', {
      email: data.get('email'),
      name: data.get('name'),
      comment: data.get('comment')
    }).then(data => {
      data?.message && alert(data.message);
      location.href = '/'
    }).catch(error => {
      error?.message && alert(error.message);
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
            Feedback Forum
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
            <textarea placeholder="Please share your feedback" name="comment" id="comment" style={{width: '100%', height: '200px'}} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Share Feedback
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
