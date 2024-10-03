import { JWT_EXPIRES_IN } from "../constants";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import express from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { userSchema } from "../lib/zod";

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  const cookie = req.cookies["jwt"];

  if (!cookie) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const verified = jwt.verify(cookie, process.env.JWT_SECRET!) as JwtPayload;

  if (!verified) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const user = await UserModel.findById(verified._id);

    if (!user) {
      res.status(404).json({ messsage: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;
  const schema = userSchema.safeParse({ username, password });

  if (!schema.success) {
    res.status(400).json(schema.error.issues.map(i => i.message).join("\n"));
    return;
  }

  try {
    const user = await UserModel.findOne({ username: schema.data.username });

    if (!user) {
      res.status(404).json({ message: `User with username "${username}" not found` });
      return;
    }

    const passwordMatch = await bcrypt.compare(schema.data.password, user.password);

    if (!passwordMatch) {
      res.status(400).json({ message: `Wrong password for username "${user.username}"` });
      return;
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);

    res.cookie("user", token, { httpOnly: true, maxAge: JWT_EXPIRES_IN });
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.post("/sign-up", async (req, res) => {
  const { username, password } = req.body;
  const schema = userSchema.safeParse({ username, password });

  if (!schema.success) {
    res.status(400).json(schema.error.issues.map(i => i.message).join("\n"));
    return;
  }

  try {
    const newUser = new UserModel({
      username: schema.data.username,
      password: schema.data.password,
    });

    await newUser.save();

    res.status(200).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.post("/sign-out", async (_req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.status(200).json({ message: "success" });
});

export default userRouter;
