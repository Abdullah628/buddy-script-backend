import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  ENC_KEY: string;
  ALGORITHM: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  BACKEND_URL: string;
  JWT_RESET_EXPIRES: string;
  JWT_RESET_SECRET: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "ENC_KEY",
    "ALGORITHM",
    "JWT_ACCESS_EXPIRES",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
    "BACKEND_URL",
    "JWT_RESET_EXPIRES",
    "JWT_RESET_SECRET",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variabl ${key}`);
    }
  });

  return {
    PORT: process.env.PORT!,
    ENC_KEY: process.env.ENC_KEY as string,
    ALGORITHM: process.env.ALGORITHM as string,
    DB_URL: process.env.DB_URL!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    GOOGLE_CLIENT_SECRET:  process.env.GOOGLE_CLIENT_SECRET!,
    GOOGLE_CLIENT_ID:  process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL:  process.env.FRONTEND_URL!,
    BACKEND_URL: process.env.BACKEND_URL!,
    JWT_RESET_EXPIRES: process.env.JWT_RESET_EXPIRES as string,
    JWT_RESET_SECRET: process.env.JWT_RESET_SECRET as string,
  };
};

export const envVars = loadEnvVariables();
