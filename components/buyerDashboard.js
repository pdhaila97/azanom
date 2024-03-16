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

  const onBuyProduct = (_id, event) => {
    event.preventDefault();
    axiosCall(
      process.env.NEXT_PUBLIC_SERVER_URL + "/product/buy",
      "POST",
      {
        _id,
      },
      {},
      { sendToken: true }
    )
      .then((res) => {
        alert("Item bought and added to your purchases");
        setListings(res?.data?.products);
        setPurchases(res?.data?.purchases);
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Buyer Dashboard
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
                              secondaryAction={
                                <>
                                  <IconButton
                                    title="Buy"
                                    edge="end"
                                    onClick={onBuyProduct.bind(
                                      this,
                                      listing._id
                                    )}
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
                            <ListItem>
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
      </Container>
    </ThemeProvider>
  );
}
