import { connectToDatabase } from "../config/dbConfig";
import { generateJWT, hashPassword, verifyPassword } from "../helper";
import type { UserInput } from "../../../../packages/types/src";

// Function to create a new user
export const createUserService = async (user: UserInput) => {
  const { db } = await connectToDatabase();
  const hashedPassword = await hashPassword(user.password);
  const existingUser = await db
    .collection("users")
    .findOne({ email: user.email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = await db.collection("users").insertOne({
    email: user.email,
    password: hashedPassword,
  });
  return { newUser };
};

// Function to login a user
export const loginUserService = async (user: UserInput) => {
  const { db } = await connectToDatabase();
  const storedUser = await db
    .collection("users")
    .findOne({ email: user.email });
  if (!storedUser) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await verifyPassword(
    user.password,
    storedUser.password
  );
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateJWT(storedUser._id.toString(), storedUser.email);
  return { token };
};
