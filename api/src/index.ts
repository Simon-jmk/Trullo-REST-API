import dotenv from 'dotenv';

dotenv.config();

import express from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/users', userRoutes);

app.get('/test', (req, res) => {
  res.send('Hello, Trullo API is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${port}`);
});
