import { authSchema, passwordSchema, usernameSchema } from "../lib/zod";

import FlowModel from "../models/flow.model";
import { JWT_EXPIRES_IN } from "../constants";
import UserModel from "../models/user.model";
import { auth } from "../middlewares";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userRouter = express.Router();

userRouter.get("/", auth, async (_req, res) => {
  const { verified } = res.locals;

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(verified._id as string) } },
      {
        $lookup: {
          from: "flows",
          localField: "_id",
          foreignField: "userId",
          as: "flows",
        },
      },
      {
        $project: {
          username: 1,
          flows: {
            $map: {
              input: "$flows",
              as: "flow",
              in: {
                label: "$$flow.label",
                nodesLength: { $size: "$$flow.nodes" },
                createdAt: "$$flow.createdAt",
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          flows: { $first: "$flows" },
        },
      },
      { $project: { username: 1, flows: 1 } },
    ]);

    if (user.length === 0) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    res.status(200).json(user[0]);
  } catch (error) {
    console.error(error);
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

userRouter.put("/:userId/username", auth, async (req, res) => {
  const { verified } = res.locals;
  const { userId } = req.params;
  const { username } = req.body;

  if (verified._id !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const schema = usernameSchema.safeParse({ username });

  if (!schema.success) {
    res.status(400).json({ message: schema.error.issues.map(i => i.message).join("\n") });
    return;
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      username: schema.data.username,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    res.status(200).json({ message: "Nome utente aggiornato correttamente" });
  } catch (error) {
    res.status(500).json({ message: "Errore lato server" });
  }
});
userRouter.put("/:userId/password", auth, async (req, res) => {
  const { verified } = res.locals;
  const { userId } = req.params;
  const { password, newPassword } = req.body;

  if (verified._id !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const schema = passwordSchema.safeParse({ password, newPassword });

  if (!schema.success) {
    res.status(400).json({ message: schema.error.issues.map(i => i.message).join("\n") });
    return;
  }

  try {
    const newHashedPassword = await bcrypt.hash(schema.data.newPassword, 10);
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { password: newHashedPassword }
    );

    console.log(updatedUser);

    if (!updatedUser) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    res.status(200).json({ message: "Password aggiornata correttamente" });
  } catch (error) {
    res.status(500).json({ message: "Errore lato server" });
  }
});

userRouter.delete("/:userId", auth, async (req, res) => {
  const { verified } = res.locals;
  const { userId } = req.params;

  if (verified._id !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  try {
    const deletedUser = await UserModel.findByIdAndDelete(verified._id);

    if (!deletedUser) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    await FlowModel.deleteMany({ userId: verified._id });

    res.cookie("user", "", { maxAge: 0 });
    res.status(200).json({ message: "Successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore lato server" });
  }
});

export default userRouter;
