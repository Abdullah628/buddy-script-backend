import { Types } from "mongoose";

export interface IMediaMeta {
  width?: number;
  height?: number;
  duration?: number;
  [key: string]: any;
}

export interface IMedia {
  url: string;
  type: string; // e.g., "image/jpeg", "image/png", "video/mp4"
  meta?: IMediaMeta;
}

export interface IAuthorSnapshot {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export type Visibility = "public" | "private";

export interface IPost {
  _id?: Types.ObjectId;
  authorId: Types.ObjectId;
  authorSnapshot: IAuthorSnapshot;
  text: string;
  media?: IMedia[];
  visibility: Visibility;
  createdAt?: Date;
  updatedAt?: Date;
  likesCount?: number;
  commentsCount?: number;
  isDeleted?: boolean;
  tags?: string[];
  pinned?: boolean;
}
