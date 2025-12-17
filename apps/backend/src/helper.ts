import * as argon from "argon2";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRATION = "1h";

// Hash password using Argon2
export const hashPassword = async (password: string): Promise<string> => {
  return await argon.hash(password);
};

// Verify password using Argon2
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await argon.verify(hash, password);
};

// Generate JWT Token
export const generateJWT = (id: string, email: string): string => {
  const payload = { id, email };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
};

export const decodeToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error(`Invalid token: ${error}`);
  }
};
