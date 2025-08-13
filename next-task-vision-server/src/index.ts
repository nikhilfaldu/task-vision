import express from 'express';
import listRoutes from './routes/listRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();

app.use(express.json());

app.use('/api/lists', listRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Next Task Vision API');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
