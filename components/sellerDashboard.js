import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
} from "@mui/material";
import { capitalize, filter, isEmpty, map } from "lodash";
import { Delete, Category } from "@mui/icons-material";
import { axiosCall } from "@/utils/apiMethods";

const defaultTheme = createTheme();

export default function SellerDashboard() {
  const [listingType, setListingType] = React.useState("current");
  const [openModal, setOpenModal] = React.useState(false);
  const [listings, setListings] = React.useState([]);

  const onAddListing = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axiosCall(
      process.env.NEXT_PUBLIC_SERVER_URL + "/product/add",
      "POST",
      {
        title: data.get("title"),
        price: data.get("price"),
        category: data.get("category"),
      },
      {},
      { sendToken: true }
    )
      .then((res) => {
        alert("Item added and published for selling");
        setListings(res?.data);
        setOpenModal(false);
      })
      .catch((error) => {
        error?.message && alert(error?.message);
      });
  };

  const onDeleteProductListing = (_id, event) => {
    event.preventDefault();
    axiosCall(
      process.env.NEXT_PUBLIC_SERVER_URL + "/product/delete",
      "POST",
      {
        _id
      },
      {},
      { sendToken: true }
    )
      .then((res) => {
        alert("Item deleted and delisted for selling");
        setListings(res?.data);
      })
      .catch((error) => {
        error?.message && alert(error?.message);
      });
  }

  const toggleListingType = () => {
    setListingType((val) => (val === "current" ? "sold" : "current"));
  };

  React.useEffect(() => {
    const getListings = async () => {
      axiosCall(
        process.env.NEXT_PUBLIC_SERVER_URL + "/product/get",
        "GET",
        null,
        {},
        { sendToken: true }
      )
        .then((res) => {
          setListings(res?.data);
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
            Seller Dashboard
          </Typography>
          <Box sx={{ mt: 3 }}>
            {!isEmpty(listings) && <Grid container spacing={2}>
              <Grid container>
                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                  Your {listingType === "current" ? "Current" : "Sold"} Listings
                </Typography>
                <List dense={true}>
                  {map(
                    filter(listings, (listing) =>
                      listingType === "current" ? !listing.isSold : listing.isSold
                    ),
                    (listing) => {
                      return (
                        <>
                          <ListItem
                            secondaryAction={
                              listingType === "current" && (
                                <IconButton onClick={onDeleteProductListing.bind(this, listing._id)} edge="end" aria-label="delete">
                                  <Delete />
                                </IconButton>
                              )
                            }
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <Category />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={listing.title}
                              secondary={`${capitalize(listing.category)} | CA$${
                                listing.price
                              }`}
                            />
                          </ListItem>
                        </>
                      );
                    }
                  )}
                </List>
              </Grid>
            </Grid>}
            <Button
              onClick={setOpenModal.bind(this, true)}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Listing
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={toggleListingType}
            >
              Show {listingType === "current" ? "Sold" : "Current"} Listings
            </Button>
          </Box>
        </Box>
        <Modal open={openModal} onClose={setOpenModal.bind(this, false)}>
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
            onSubmit={onAddListing}
            noValidate
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Listing
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoFocus
              type="text"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Price (CA$)"
              name="price"
              type="number"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="category"
              label="Category"
              name="category"
              type="text"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add
            </Button>
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
}
