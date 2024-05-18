const bcrypt = require("bcrypt");
const db = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const result = await db.client.query("SELECT * FROM users");
    const users = result.rows;
    console.log("All users:", users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const RegisterUsers = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emailExists = await db.client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email address already exists. Please provide a different email.",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    await db.client.query(
      "INSERT INTO users (email, password, username) VALUES ($1, $2, $3)",
      [email, hashedPassword, username]
    );

    const MainData = {email,password,username}
    res.status(201).json({
      success: true,
      message: "User registration successful",
      data: MainData
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


const LoginUser = async (req,res)=>{
    const {email,password}= req.body
    try {
        const userEmail = await db.client.query('SELECT * FROM users WHERE email =$1',[email])
        if (userEmail.length === 0) {
            res.status(404).send({
                success: false,
                massege: "Invalid Email Address",

            })
        }
        const match = await bcrypt.compare(password,userEmail.rows[0].password)
        if (!match) {
            res.status(404).send({
                success: false,
                massege: "password has wrong"
            })
        }
        const MainData = {email,password}
        res.status(200).send({
            success:true,
            massege: "User Login Successfull",
            data: MainData
        })

    } catch (error) {
        console.error("Error Logging User",error)
            res.status(500).json({error: "internal server from Login"})

    }
}



module.exports = { getAllUsers, RegisterUsers,LoginUser };
