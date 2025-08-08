import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 5 }, // Give 5 free credits on signup
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
