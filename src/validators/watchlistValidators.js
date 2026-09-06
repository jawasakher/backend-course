import {z} from 'zod';

const addToWatchlistSchema = z.object({
    movieId: z.coerce.number().int().positive(),
    status: z.enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'],{
        error: () => ({
            message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED",
        }),
    })
    .optional(),
    rating: z.coerce
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(10, "Rating cannot exceed 10")
    .optional(),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});


export {   addToWatchlistSchema };