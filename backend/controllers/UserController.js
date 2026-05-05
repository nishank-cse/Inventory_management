const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
    try {
        const { name, email, password, role, staffEmail } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 STAFF
        if (role === "staff") {
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role
            });

            user.staffId = user._id;
            await user.save();

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET
            );

            return res.json({ user, token });
        }

        // 🔹 ADMIN
        if (role === "admin") {

            if (!staffEmail) {
                return res.status(400).json({ message: "Staff email required" });
            }

            const staff = await User.findOne({ email: staffEmail });

            if (!staff || staff.role !== "staff") {
                return res.status(400).json({ message: "Invalid staff email" });
            }

            const admin = await User.create({
                name,
                email,
                password: hashedPassword,
                role,
                staffId: staff._id
            });

            const token = jwt.sign(
                { id: admin._id },
                process.env.JWT_SECRET
            );

            return res.json({ user: admin, token });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Register failed" });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        return res.json({ user, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Login failed" });
    }
};
const getMe = (req, res) => {
    res.json({ user: req.user });
};
// 👇 MUST BE OUTSIDE
module.exports = {
    register,
    login,
    getMe
};