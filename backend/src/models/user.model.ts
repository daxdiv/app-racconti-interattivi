import mongoose, { Schema } from "mongoose";

import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);

    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password, err => {
    if (err) throw new Error(err.message);
  });
};
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.flowsId;
  delete user.password;
  delete user.__v;

  return user;
};

export default mongoose.model("user", userSchema);
