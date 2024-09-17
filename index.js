const express = require("express");
const userRoutes = require("./routes/Authroutes");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const portFolioRoutes = require("./routes/PortfolioRoutes");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const Session = require("express-session");
const { Pool } = require("pg");
const session = require("express-session");
const { authRoutes } = require("./routes/middleWare");
const PgSession = require("connect-pg-simple")(session);

dotenv.config();
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const app = express();

// CSRF Protection
const csrfProtection = csrf({ cookie: true });

// Use middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  Session({
    store: new PgSession({
      pool: pool,
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

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

app.use(csrfProtection);

// Routes
app.use("/users", userRoutes);
app.use("/portfolio", portFolioRoutes);

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get("/protected",authRoutes , (req, res) => {
  res.status(200).json({
    success: true,
    message: "This is a protected route",
    user: req.user, 
  });
});

// Root route
app.use("/",  (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).json({ success: false, message: "Invalid CSRF Token" });
  } else {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
