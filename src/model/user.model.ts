import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../interface/user.interface";
import bcrypt from "bcrypt"
// Define the User schema
const UserSchema: Schema<IUser> = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        photoUrl: { type: String, default: "" },
        role: { type: String, required: true, default: "user" }
    },
    { timestamps: true }
);
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})
UserSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};
// Create the User model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
