import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserService } from "../authService";
import * as argon2 from "argon2";
import { connectToDatabase } from "../../config/dbConfig";

vi.mock("../../config/dbConfig", () => ({
  connectToDatabase: vi.fn(),
}));

vi.mock("argon2", () => ({
  hash: vi.fn(),
  verify: vi.fn(),
}));

const insertOne = vi.fn();
const findOne = vi.fn();

const mockedConnectToDatabase = connectToDatabase as unknown as vi.Mock;

mockedConnectToDatabase.mockResolvedValue({
  db: {
    collection: () => ({
      findOne,
      insertOne,
    }),
  },
} as any);

const mockedArgon2Hash = argon2.hash as unknown as vi.Mock;

describe("createUserService (argon2)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new user with hashed password", async () => {
    findOne.mockResolvedValue(null);
    insertOne.mockResolvedValue({ insertedId: "user-1" });
    mockedArgon2Hash.mockResolvedValue("hashed-password");

    const result = await createUserService({
      email: "test@test.com",
      password: "password123",
    });

    expect(mockedArgon2Hash).toHaveBeenCalledWith("password123");
    expect(insertOne).toHaveBeenCalled();
    expect(result.newUser).toBeDefined();
  });

  it("throws error if user already exists", async () => {
    findOne.mockResolvedValue({ email: "test@test.com" });

    await expect(
      createUserService({
        email: "test@test.com",
        password: "password123",
      })
    ).rejects.toThrow("User already exists");
  });
});
