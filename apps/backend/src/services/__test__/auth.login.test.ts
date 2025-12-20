import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginUserService } from "../authService";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { connectToDatabase } from "../../config/dbConfig";

vi.mock("../../config/dbConfig", () => ({
  connectToDatabase: vi.fn(),
}));

vi.mock("argon2", () => ({
  verify: vi.fn(),
  hash: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  sign: vi.fn(),
}));

const findOne = vi.fn();

const mockedConnectToDatabase = connectToDatabase as unknown as vi.Mock;

mockedConnectToDatabase.mockResolvedValue({
  db: {
    collection: () => ({
      findOne,
    }),
  },
} as any);

const mockedArgon2Verify = argon2.verify as unknown as vi.Mock;
const mockedJwtSign = jwt.sign as unknown as vi.Mock;

describe("loginUserService (argon2)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs in user with valid credentials", async () => {
    findOne.mockResolvedValue({
      _id: "user-1",
      email: "test@test.com",
      password: "hashed-password",
    });

    mockedArgon2Verify.mockResolvedValue(true);
    mockedJwtSign.mockReturnValue("jwt-token" as any);

    const result = await loginUserService({
      email: "test@test.com",
      password: "password123",
    });

    expect(mockedArgon2Verify).toHaveBeenCalledWith(
      "hashed-password",
      "password123"
    );
    expect(result.token).toBe("jwt-token");
  });

  it("throws error if password is invalid", async () => {
    findOne.mockResolvedValue({
      email: "test@test.com",
      password: "hashed-password",
    });

    mockedArgon2Verify.mockResolvedValue(false);

    await expect(
      loginUserService({
        email: "test@test.com",
        password: "wrong-password",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  it("throws error if user does not exist", async () => {
    findOne.mockResolvedValue(null);

    await expect(
      loginUserService({
        email: "missing@test.com",
        password: "password123",
      })
    ).rejects.toThrow("Invalid credentials");
  });
});
