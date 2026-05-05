const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔥 REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, role, adminEmail } = req.body;

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 ADMIN (creates group)
    if (role === "admin") {
      const admin = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      // admin owns group
      admin.staffId = admin._id;
      await admin.save();

      const token = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const safeUser = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        staffId: admin.staffId,
      };

      return res.json({ user: safeUser, token });
    }

    // 🔹 STAFF (joins admin group)
    if (role === "staff") {
      if (!adminEmail) {
        return res.status(400).json({
          message: "Admin email required",
        });
      }

      const admin = await User.findOne({ email: adminEmail });

      if (!admin || admin.role !== "admin") {
        return res.status(400).json({
          message: "Invalid admin email",
        });
      }

      const staff = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        staffId: admin.staffId, // 🔥 join same group
      });

      const token = jwt.sign(
        { id: staff._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const safeUser = {
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        staffId: staff.staffId,
      };

      return res.json({ user: safeUser, token });
    }

    return res.status(400).json({ message: "Invalid role" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Register failed" });
  }
};

// 🔥 LOGIN
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
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      staffId: user.staffId,
    };

    return res.json({ user: safeUser, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed" });
  }
};

// 🔥 GET CURRENT USER
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// EXPORT
module.exports = {
  register,
  login,
  getMe,
};