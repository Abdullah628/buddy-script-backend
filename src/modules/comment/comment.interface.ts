import { Types } from "mongoose";

export interface IAuthorSnapshot {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface IComment {
  _id?: Types.ObjectId;
  postId: Types.ObjectId;
  authorId: Types.ObjectId;
  authorSnapshot: IAuthorSnapshot;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
  likesCount?: number;
  parentCommentId?: Types.ObjectId | null;
  isDeleted?: boolean;
}
