import express from 'express';
import { addToWatchlist } from '../controllers/watchlistController.js';

const router = express.Router();

router.post('/', addToWatchlist);

//router.post('/login', login);

//router.post('/logout', logout);

export default router;