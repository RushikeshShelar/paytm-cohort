const jwt = require("jsonwebtoken");

const { JWT_SECRET_TOKEN } = require("./config");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        };

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET_TOKEN);

        const userId = decoded.userId;

        req.userId = userId;

        next();
    } catch (error) {
        console.log("[AUTH_MIDDLEWARE_ERROR]", error);
    }
};

module.exports = authMiddleware;