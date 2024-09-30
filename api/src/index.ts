import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import taskRouter from './routes/task.routes';
import projectRoutes from './routes/projects.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRouter);
app.use('/projects', projectRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
