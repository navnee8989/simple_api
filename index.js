const express = require("express");
const userRoutes = require("./routes/Authroutes");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors"); // Import cors package

dotenv.config();

const app = express();
app.use(morgan("dev"));

app.use(express.json());

// Enable CORS for all routes and all origins
app.use(cors({ origin: '*' }));

app.use("/", (req, res, next) => {
  console.log("Done");
  res.send("<h1>Hello World</h1>");
});

app.use("/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
