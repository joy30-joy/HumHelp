import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ message: "All required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "30d" });
  user.password = undefined;
  res.status(201).json({ ...user.toObject(), token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Wrong email or password" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Wrong email or password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "30d" });
  user.password = undefined;
  res.json({ ...user.toObject(), token });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

export const getUsersByRole = async (req, res) => {
  const { role } = req.query;
  const users = await User.find({ role }).select("name email role");
  res.json(users);
};

export const listUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    if (!role) return res.status(400).json({ message: "Role required" });

    const users = await User.find({ role }).select("_id name email");
    res.json(users);
  } catch (err) {
    next(err);
  }
};
