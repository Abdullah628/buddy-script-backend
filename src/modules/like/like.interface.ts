import { Types } from "mongoose";

export type TargetType = "post" | "comment";

export interface ILike {
  _id?: Types.ObjectId;
  targetType: TargetType;
  targetId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt?: Date;
}
