import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import { User } from "../user/user.model";
import { IAuthProvider } from "../user/user.interface";
import { hashPassword, verifyPassword } from "../../utils/hash";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};



const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError(404, "User not found");
  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set your password. Now you can change the password from your profile password update"
    );
  }

  const hashedPassword = await hashPassword(plainPassword);

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;
  user.auths = auths;

  await user.save();
  
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  if (!user || !user.password) throw new AppError(404, "User not found");

  const isOldPasswordValid = await verifyPassword(oldPassword, user.password);

  if (!isOldPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
  }

  user.password = await hashPassword(newPassword);

  await user.save();
 
};

export const AuthServices = {
  getNewAccessToken,
  changePassword,
  setPassword,
};
