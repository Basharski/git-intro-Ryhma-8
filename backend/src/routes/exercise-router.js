import express from 'express';
import { getDailyRecommendations } from '../controllers/exercise-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';

const exerciseRouter = express.Router();

exerciseRouter.use(authenticateToken);

exerciseRouter.get('/recommendations', getDailyRecommendations);

export default exerciseRouter;
