const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select("-password");

            // 🔥 SAFETY CHECK
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            // 🔥 ROLE HANDLING
            if (user.role === "staff") {
                req.user = {
                    _id: user._id,
                    role: user.role,
                    staffId: user._id
                };
            } else {
                req.user = {
                    _id: user._id,
                    role: user.role,
                    staffId: user.staffId || user._id   // fallback safety
                };
            }

            next();

        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Not authorized" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };