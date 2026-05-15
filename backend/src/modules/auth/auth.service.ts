import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { users } from "../../common/db/schema.js";
import type { z } from "zod";
import crypto from "crypto";
import { sendVerificationEmail } from "../../common/utils/email.util.js";
import type { loginSchema, registerSchema } from "./auth.schema.js";

const SALT_ROUNDS = 10;

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

const getJwtSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not configured");
  return s;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string) {
  const signOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRY ?? "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ sub: userId }, getJwtSecret(), signOptions);
}

export async function createUser(input: RegisterInput) {
  const hashed = await hashPassword(input.password);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const [created] = await db
    .insert(users)
    .values({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      password: hashed,
      verificationToken,
      verificationTokenExpiresAt,
    })
    .returning({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    });

  // Send verification email
  await sendVerificationEmail(created.email, verificationToken);

  return created;
}

export async function findUserByEmail(email: string) {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return row ?? null;
}

export async function findUserById(id: string) {
  const [row] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return row ?? null;
}

export async function findUserWithPasswordByEmail(email: string) {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return row ?? null;
}

export async function registerUser(input: RegisterInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    return { error: "EMAIL_TAKEN" as const };
  }
  const user = await createUser(input);
  const token = generateToken(user.id);
  return { user, token };
}

export async function loginUser(input: LoginInput) {
  const row = await findUserWithPasswordByEmail(input.email);
  if (!row?.password) {
    return { error: "INVALID_CREDENTIALS" as const };
  }
  const ok = await comparePassword(input.password, row.password);
  if (!ok) {
    return { error: "INVALID_CREDENTIALS" as const };
  }
  // isVerified check removed here, will be handled at feature level

  const user = {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    isVerified: row.isVerified,
    createdAt: row.createdAt,
  };
  const token = generateToken(row.id);
  return { user, token };
}

export async function verifyEmailToken(token: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.verificationToken, token))
    .limit(1);

  if (!user) {
    return { error: "INVALID_TOKEN" as const };
  }

  if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()) {
    return { error: "TOKEN_EXPIRED" as const };
  }

  await db
    .update(users)
    .set({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
    })
    .where(eq(users.id, user.id));

  return { success: true };
}

export async function resendVerificationToken(email: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    return { error: "USER_NOT_FOUND" as const };
  }

  if (user.isVerified) {
    return { error: "ALREADY_VERIFIED" as const };
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db
    .update(users)
    .set({
      verificationToken,
      verificationTokenExpiresAt,
    })
    .where(eq(users.id, user.id));

  await sendVerificationEmail(user.email, verificationToken);

  return { success: true };
}
