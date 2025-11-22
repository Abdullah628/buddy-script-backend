/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { hashPassword } from "../../utils/hash";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IGenericResponse } from "../../interfaces/common";

const getMe = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password")
    .populate({
      path: "org",
      populate: { path: "plan" },
    });

  return {
    data: user,
  };
};

// keep your uniq
const uniq = <T extends string | number>(arr: (T | undefined)[]) =>
  Array.from(new Set((arr || []).filter(Boolean))) as T[];

// Sanitize payload coming from the frontend for user.featureAccess.
// Accept 'any' so we don't tie it to the Feature model interface.
// Now handles new action object structure with {description, value, isActive}
const sanitize = (features: any[] = []): any[] =>
  (features || [])
    .map((f) => {
      const cleanedSubs = (f.subFeatures || [])
        .map((sf: any) => {
          // Handle both old string format and new object format for actions
          const actions = (sf.actions || []).map((action: any) => {
            if (typeof action === "string") {
              // Convert old string format to new object format
              return {
                description: action.charAt(0).toUpperCase() + action.slice(1),
                value: action,
                isActive: true,
              };
            }
            // Already in new object format, validate structure
            return {
              description: String(
                action.description || action.value || "Unknown"
              ),
              value: String(action.value || action.description || "unknown"),
              isActive: Boolean(
                action.isActive !== undefined ? action.isActive : true
              ),
            };
          }); // Include all actions regardless of isActive status

          return {
            name: String(sf.name),
            key: String(sf.key),
            actions,
          };
        })
        .filter((sf: any) => (sf.actions?.length || 0) > 0);

      // Handle both old string format and new object format for parent actions
      const actions = (f.actions || []).map((action: any) => {
        if (typeof action === "string") {
          // Convert old string format to new object format
          return {
            description: action.charAt(0).toUpperCase() + action.slice(1),
            value: action,
            isActive: true,
          };
        }
        // Already in new object format, validate structure
        return {
          description: String(action.description || action.value || "Unknown"),
          value: String(action.value || action.description || "unknown"),
          isActive: Boolean(
            action.isActive !== undefined ? action.isActive : true
          ),
        };
      }); // Include all actions regardless of isActive status

      const cleaned = {
        name: String(f.name),
        key: String(f.key),
        actions,
        subFeatures: cleanedSubs,
      };

      return cleaned;
    })
    .filter(
      (f: any) =>
        (f.actions?.length || 0) > 0 || (f.subFeatures?.length || 0) > 0
    );



const createUser = async (payload: Partial<IUser>, logActor?: JwtPayload) => {
  const {
    email,
    password,
    role: incomingRole,
    ...rest
  } = payload;

  if (!email) throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  if (!password)
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");

  const isUserExist = await User.findOne({ email });
  if (isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");

  // Validate the role exists if provided
  const roleUpper = String(incomingRole || Role.USER)
    .trim()
    .toUpperCase();
 

  const hashedPassword = await hashPassword(password as string);
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };


  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    role: roleUpper,
    ...rest,
  });
 

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
  logActor?: JwtPayload
) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (payload.role === Role.ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await hashPassword(payload.password as string);
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  // Log user update
  ////console.log("--------------------------------------------", userId);
  if (userId) {
    try {
      const actor = (logActor as any) || decodedToken;
      const actorId = (logActor as any)?.userId || decodedToken?.userId || null;
      const actorPayload = logActor || decodedToken;
      //console.debug("[DEBUG] addLog - User Updated", {
      //   action: "User Updated",
      //   actor,
      //   actorUserId: actorId,
      //   targetUserId: userId,
      //   fields: Object.keys(payload || {}),
      // });
      // Only create a log if we have an actorId or a configured system fallback will handle it
      // Prefer a human-friendly actor label (name or email) when available
      const actorLabel =
        (actor && (actor.name || actor.email)) || actorId || "system";
      // Prefer displaying updated user's name/email instead of raw id when available
      const targetLabel =
        (newUpdatedUser as any)?.name ||
        (newUpdatedUser as any)?.email ||
        userId;
      
    } catch (e) {
      // console.error("Failed to log user update:", e);
    }
  }

  return newUpdatedUser;
};

const getAllUsers = async (
  query: Record<string, string>
): Promise<IGenericResponse<IUser[]>> => {
  const modifiedQuery = { ...query };

  // Extract orgId from query if present
  const { orgId, ...restQuery } = modifiedQuery;

  // Build base query with orgId filter if provided
  const baseQuery = orgId
    ? User.find({ org: orgId }).populate("org", "orgName")
    : User.find().populate("org", "orgName");

  const queryBuilder = new QueryBuilder(baseQuery, restQuery)
    .filter()
    .search(["name", "email", "phone"])
    .sort()
    .fields()
    .paginate();

  const allUsers = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return {
    data: allUsers,
    meta,
  };
};

const updateMe = async (
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
  logActor?: JwtPayload
) => {
  const ifUserExist = await User.findById(decodedToken?.userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.password) {
    payload.password = await hashPassword(payload.password as string);
  }

  const newUpdatedUser = await User.findByIdAndUpdate(
    decodedToken?.userId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );


  return newUpdatedUser;
};


const getUserById = async (id: string) => {
  const user = await User.findById(id).lean();
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};


export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
  updateMe,
  getUserById,
};
