import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "agent" | "admin";
  comparePassword: (enteredPassword: string) => Promise<boolean>;
  avatar?: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  this: IUser,
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password!);
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
