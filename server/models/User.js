import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    phone: { type: String, default: '' },
    birthday: { type: String, default: '' },
    gender: { type: String, default: '' },
    passwordHash: { type: String, required: true },

    // Password recovery (6-digit code emailed to the user, single use, short-lived)
    resetCodeHash: { type: String, default: null },
    resetCodeExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret.email;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.resetCodeHash;
        delete ret.resetCodeExpires;
        return ret;
      },
    },
  }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
