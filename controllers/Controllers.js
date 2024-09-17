const bcrypt = require("bcryptjs");
const db = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const result = await db.client.query("SELECT * FROM users");
    const users = result.rows;
    console.log("All users:", users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const RegisterUsers = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("Register API");
    const emailExists = await db.client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Email address already exists. Please provide a different email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.client.query(
      "INSERT INTO users (email, password, username) VALUES ($1, $2, $3)",
      [email, hashedPassword, username]
    );

    const MainData = { email, username, hashedPassword };
    res.status(201).json({
      success: true,
      message: "User registration successful",
      data: MainData,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};



const addUserController = async (req, res) => {
  const { first_name, last_name, email, phonenumber } = req.body;

  if (!first_name || !last_name || !email || !phonenumber) {
    return res.status(400).send({
      success: false,
      message: "Please provide all the required fields",
    });
  }

  try {
    const query = `
      INSERT INTO portfolio (first_name, last_name, email, phonenumber)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [first_name, last_name, email, phonenumber];

    const result = await db.client.query(query, values);

    res.status(201).send({
      success: true,
      message: "User added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding user:", error);

    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { getAllUsers, RegisterUsers, addUserController };
