const express = require("express");
const userRoutes = require("./routes/Authroutes");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(morgan("dev"));

app.use(express.json());

// Enable CORS for all routes and all origins
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  exposedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));

// Move the root route handler to the end to avoid it overriding other routes
app.use("/users", userRoutes);

app.use("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
