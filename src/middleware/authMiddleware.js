import jst from 'jsonwebtoken';
import { prisma } from '../config/db.js';

// Read the token from the request headers
// Check if the token is valid and decode it
export const authMiddleware = async (req, res, next) => {
    console.log("Auth Middleware reached");
    let token;

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt){
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jst.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({ error: "User no longer exists" });
        }

        req.user = user;
        next();
    } catch (err) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
    }
};