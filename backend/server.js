const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const miscRoutes = require("./routes/miscellaneous");

const app = express();
const port = 3001;

main().catch((err) => console.log(err));

async function main() {
  try {
    console.log("DB connection starting");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connection finished successfully");

    const allowedOrigins = [
      "http://localhost:3000"
    ];

    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin) return callback(null, true);
          if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
          }
          return callback(new Error("Origin not allowed by CORS"));
        },
        credentials: true 
      })
    );

    app.use("/auth", authRoutes);
    app.use("/product", productRoutes);
    app.use(miscRoutes);

    // Handle any other routes as needed
    app.use("*", (req, res) => {
      res.status(404).send("Not Found");
    });

    app.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}
