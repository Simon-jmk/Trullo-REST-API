import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

// Middleware för att parsa JSON
app.use(express.json());

// En enkel route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Trullo API!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
