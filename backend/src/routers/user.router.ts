import { JWT_EXPIRES_IN } from "../constants";
import UserModel from "../models/user.model";
import { auth } from "../middlewares";
import { authSchema } from "../lib/zod";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

userRouter.get("/", auth, async (_req, res) => {
  const { verified } = res.locals;

  try {
    const user = await UserModel.findById(verified._id);

    if (!user) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Errore lato server" });
  }
});
userRouter.post("/sign-in", async (req, res) => {
  const { type, username, password } = req.body;
  const schema = authSchema.safeParse({ type, username, password });

  if (!schema.success) {
    res.status(400).json({ message: schema.error.issues.map(i => i.message).join("\n") });
    return;
  }

  try {
    const user = await UserModel.findOne({ username: schema.data.username });

    if (!user) {
      res.status(404).json({ message: `Utente con username "${username}" non trovato` });
      return;
    }

    const passwordMatch = await bcrypt.compare(schema.data.password, user.password);

    if (!passwordMatch) {
      res
        .status(400)
        .json({ message: `Password errata per username "${user.username}"` });
      return;
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);

    res.cookie("user", token, { httpOnly: true, maxAge: JWT_EXPIRES_IN });
    res.status(200).json({ message: "Successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore lato server" });
  }
});
userRouter.post("/sign-up", async (req, res) => {
  const { type, username, password } = req.body;
  const schema = authSchema.safeParse({ type, username, password });

  if (!schema.success) {
    res.status(400).json({ message: schema.error.issues.map(i => i.message).join("\n") });
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
      res.status(409).json({ message: "Username già esistente" });
      return;
    }

    res.status(500).json({ message: "Errore lato server" });
  }
});
userRouter.post("/sign-out", async (_req, res) => {
  res.cookie("user", "", { maxAge: 0 });
  res.status(200).json({ message: "Successo" });
});

export default userRouter;
