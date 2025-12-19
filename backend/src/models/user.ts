import mongoose from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 30,
      default: 'Ё-мое',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    tokens: {
      type: [{ token: { type: String, required: true } }],
      default: [],
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model<IUser>('user', userSchema);
