import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}


export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
  _id?: Types.ObjectId
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  bio?: string;
  isActive?: IsActive;
  auths: IAuthProvider[];
  isAvailable: boolean;
  role: Role;
}