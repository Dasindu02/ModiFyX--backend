import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // EXTRA PROFILE FIELDS
    phone: { type: String },
    age: { type: Number },
    district: { type: String },
    vehicleModel: { type: String },
    registrationDate: { type: String }
  },
  { timestamps: true }
);

// PASSWORD HASHING
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// PASSWORD CHECK
UserSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
