import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    const payload = { id: userId };
    const token = jwt.sign(payload, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return token;
};