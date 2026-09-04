import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

let userId;

const movies = [
{
    title: "The Matrix",
    overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseYear: 1999,
    genres: ["Action", "Sci-Fi"],
    runtime: 136,
    posterUrl:"https://example.com/matrix.jpg",
    createdBy: userId,
},
{
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: 2010,
    genres: ["Action", "Sci-Fi"],
    runtime: 148,
    posterUrl:"https://example.com/inception.jpg",
    createdBy: userId,
},
{
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    posterUrl:"https://example.com/interstellar.jpg",
    createdBy: userId,
},
{
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    genres: ["Drama"],
    runtime: 142,
    posterUrl:"https://example.com/shawshank-redemption.jpg",
    createdBy: userId,
},
{
    title: "The Dark Knight",
    overview: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseYear: 2008,
    genres: ["Action", "Crime", "Drama"],
    runtime: 152,
    posterUrl:"https://example.com/the-dark-knight.jpg",
    createdBy: userId,
},
{
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    genres: ["Crime", "Drama"],
    runtime: 154,
    posterUrl:"https://example.com/pulp-fiction.jpg",
    createdBy: userId,
},
{
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseYear: 1972,
    genres: ["Crime", "Drama"],
    runtime: 175,
    posterUrl:"https://example.com/the-godfather.jpg",
    createdBy: userId,
},
{
    title: "The Godfather Part II",
    overview: "The early life and career of Vito Corleone in 1920s New York is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
    releaseYear: 1974,
    genres: ["Crime", "Drama"],
    runtime: 202,
    posterUrl:"https://example.com/the-godfather-part-ii.jpg",
    createdBy: userId,
},
{
    title: "The Lord of the Rings: The Fellowship of the Ring",
    overview: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    releaseYear: 2001,
    genres: ["Adventure", "Drama", "Fantasy"],
    runtime: 178,
    posterUrl:"https://example.com/the-lord-of-the-rings-the-fellowship-of-the-ring.jpg",
    createdBy: userId,
},
{
    title:"Goodfellas",
    overview:"The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
    releaseYear:1990,
    genres: ["Crime", "Drama"],
    runtime: 129,
    posterUrl:"https://example.com/goodfellas.jpg",
    createdBy: userId,
},
{
    title:"Fight Club",
    overview:"An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.",
    releaseYear:1999,
    genres: ["Drama"],
    runtime: 139,
    posterUrl:"https://example.com/fight-club.jpg",
    createdBy: userId,
},
];

const main = async () => {
    const user = await prisma.user.findFirst({
        select: { id: true },
    });

    if (!user) {
        throw new Error("Create a user before seeding movies.");
    }

    userId = user.id;
    console.log("Seeding database with movies...");
    for (const movie of movies) {
        await prisma.movie.create({
            data: { ...movie, createdBy: userId },
        });
        console.log(`Created movie: ${movie.title}`);
    }
    console.log("Seeding completed.");
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
