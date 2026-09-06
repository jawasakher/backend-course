import { prisma } from "../config/db.js";

export const addToWatchlist = async (req, res) => {
  const { movieId: rawMovieId, status, rating: rawRating, notes } = req.body;
  const movieId = Number(rawMovieId);
  const rating = rawRating === undefined || rawRating === null
    ? undefined
    : Number(rawRating);
  const validStatuses = ['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'];

  if (!Number.isInteger(movieId) || movieId <= 0 ||
    !Number.isInteger(req.user.id) || req.user.id <= 0) {
    return res.status(400).json({ error: 'movieId must be a positive integer' });
  }

  if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 10)) {
    return res.status(400).json({ error: 'rating must be an integer between 1 and 10' });
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid watchlist status' });
  }

   //    Verify movieId is provided
   const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }  

  // Check if already added
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
         userId_movieId: { 
        userId:req.user.id, 
        movieId: movieId,
     },
     },
  });

  if (existingInWatchlist) {
    return res.status(400).json({ error: 'Movie already in watchlist' });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
        userId: req.user.id,
        movieId,
        status: status || "PLANNED",
        rating,
        notes,
    },
  });
    
    res.status(201).json({
        status: 'Success',
        data: {
            watchlistItem,
        },
    });
} ;

export const updateWatchlistItem = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  const { status, rating, notes } = req.body;
  const validStatuses = ['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'];

  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid watchlist status' });
  }

  if (rating !== undefined) {
    const numericRating = Number(rating);
    if (rating !== null && (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 10)) {
      return res.status(400).json({ error: 'rating must be an integer between 1 and 10' });
    }
  }

  const existingItem = await prisma.watchlistItem.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!existingItem) {
    return res.status(404).json({ error: 'Watchlist item not found' });
  }

  const watchlistItem = await prisma.watchlistItem.update({
    where: { id },
    data: { status, rating: rating === undefined ? undefined : rating === null ? null : Number(rating), notes },
  });

  return res.json({ status: 'Success', data: { watchlistItem } });
};

export const removeFromWatchlist = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  const existingItem = await prisma.watchlistItem.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!existingItem) {
    return res.status(404).json({ error: 'Watchlist item not found' });
  }

  await prisma.watchlistItem.delete({ where: { id } });
  return res.status(204).send();
};