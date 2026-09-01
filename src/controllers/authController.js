import { prisma } from "../config/db.js";

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            return res.status(400).json({
                error: "User already exists with this email",
            });
        }
}


export { register };