import express from 'express';
import cors from 'cors';
import equipmentRoutes from './routes/equipmentRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'afrisciencenet-backend' });
});

app.use('/api/equipment', equipmentRoutes);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
