import { connectToDatabase } from "../config/dbConfig";
import { generateJWT, hashPassword, verifyPassword } from "../helper";

interface User {
  email: string;
  password: string;
}

// Function to create a new user
export const createUserService = async (user: User) => {
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
export const loginUserService = async (user: User) => {
  const { db } = await connectToDatabase();
  const storedUser = await db
    .collection("users")
    .findOne({ email: user.email });
  if (!storedUser) {
    throw new Error("User not found");
  }

  const isPasswordValid = await verifyPassword(
    user.password,
    storedUser.password
  );
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = generateJWT(storedUser._id.toString(), storedUser.email);
  return { token };
};
