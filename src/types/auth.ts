import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters." }),
});

export type SignupSchema = z.infer<typeof signupSchema>;
