import { prisma } from "../config/db.js";

export const addToWatchlist = async (req, res) => {
  const { movieId: rawMovieId, status, rating: rawRating, notes, userId: rawUserId } = req.body;
  const movieId = Number(rawMovieId);
  const userId = Number(rawUserId);
  const rating = rawRating === undefined || rawRating === null
    ? undefined
    : Number(rawRating);
  const validStatuses = ['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'];

  if (!Number.isInteger(movieId) || movieId <= 0 ||
    !Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'userId and movieId must be positive integers' });
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