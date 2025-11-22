import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})


const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    
    role: {
        type: String,
        required: true,
        default: Role.ADMIN,
    },
    bio: { type: String },
    avatarUrl: { type: String },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE,
    },

    auths: [authProviderSchema],

    isAvailable: {
      type: Boolean,
      default: true
    },
}, {
    timestamps: true,
    versionKey: false
})


export const User = model<IUser>("User", userSchema)