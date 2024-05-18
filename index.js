const express = require('express');
const userRoutes = require('./routes/Authroutes');
const dotenv = require('dotenv');
const morgan = require('morgan');


dotenv.config();

const app = express();
app.use(morgan('dev'))
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
