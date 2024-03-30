import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import {
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import { capitalize, filter, isEmpty, map } from "lodash";
import { Delete, Folder, Category } from "@mui/icons-material";
import { axiosCall } from "@/utils/apiMethods";

const defaultTheme = createTheme();

export default function BuyerDashboard() {
  const [listings, setListings] = React.useState([]);
  const [purchases, setPurchases] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const selectedProductToBuy = React.useRef(null);

  const onBuyProduct = (event) => {
    event.preventDefault();
    const _id = selectedProductToBuy.current;
    const data = new FormData(event.currentTarget);

    axiosCall(
      process.env.NEXT_PUBLIC_SERVER_URL + "/product/buy",
      "POST",
      {
        _id,
        nameOnCard: data.get("nameOnCard"),
        cardNumber: data.get("cardNumber"),
        cvv: data.get("cvv"),
      },
      {},
      { sendToken: true }
    )
      .then((res) => {
        alert("Item bought and added to your purchases");
        setListings(res?.data?.products);
        setPurchases(res?.data?.purchases);
        selectedProductToBuy.current = null;
        setIsModalOpen(false);
      })
      .catch((error) => {
        error?.message && alert(error?.message);
      });
  };

  React.useEffect(() => {
    const getListings = async () => {
      axiosCall(
        process.env.NEXT_PUBLIC_SERVER_URL + "/product/get-all",
        "GET",
        null,
        {},
        { sendToken: true }
      )
        .then((res) => {
          setListings(res?.data?.products);
          setPurchases(res?.data?.purchases);
        })
        .catch((error) => {
          error?.message && alert(error?.message);
        });
    };

    getListings();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 9,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Buyer Dashboards
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid>
                {!isEmpty(listings) && (
                  <>
                    <Typography
                      sx={{ mt: 4, mb: 2 }}
                      variant="h6"
                      component="div"
                    >
                      Product Listings
                    </Typography>
                    <List dense={true}>
                      {map(listings, (listing) => {
                        return (
                          <>
                            <ListItem
                              key={listing._id}
                              secondaryAction={
                                <>
                                  <IconButton
                                    title="Buy"
                                    edge="end"
                                    onClick={() => {
                                      selectedProductToBuy.current =
                                        listing._id;
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    <LocalMallIcon />
                                  </IconButton>
                                </>
                              }
                            >
                              <ListItemAvatar>
                                <Avatar>
                                  <Category />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={listing.title}
                                secondary={`${capitalize(
                                  listing.category
                                )} | CA$${listing.price}`}
                              />
                            </ListItem>
                          </>
                        );
                      })}
                    </List>
                  </>
                )}
                {!isEmpty(purchases) && (
                  <>
                    <Typography
                      sx={{ mt: 4, mb: 2 }}
                      variant="h6"
                      component="div"
                    >
                      Your Purchases
                    </Typography>
                    <List dense={true}>
                      {map(purchases, (purchase) => {
                        return (
                          <>
                            <ListItem key={purchase._id}>
                              <ListItemAvatar>
                                <Avatar>
                                  <Category />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={purchase.title}
                                secondary={`${capitalize(
                                  purchase.category
                                )} | CA$${purchase.price}`}
                              />
                            </ListItem>
                          </>
                        );
                      })}
                    </List>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Modal open={isModalOpen} onClose={setIsModalOpen.bind(this, false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
            component="form"
            onSubmit={onBuyProduct}
            noValidate
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Your credit card details
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nameOnCard"
              label="Name on card"
              name="nameOnCard"
              autoFocus
              type="text"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="cardNumber"
              label="Card Number"
              name="cardNumber"
              type="number"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="cvv"
              label="CVV"
              name="cvv"
              type="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Buy
            </Button>
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
}
