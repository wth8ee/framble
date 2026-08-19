import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      balance: {
        type: "number",
        defaultValue: 0,
      },
      role: {
        type: "string",
        defaultValue: "user",
      }
    }
  }
});
