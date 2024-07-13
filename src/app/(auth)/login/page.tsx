"use client";

import React from "react";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import { StyledPasswordInput, StyledTextInput } from "@/components/input";
import { Divider } from "@mantine/core";
import Link from "next/link";
import StyledButton from "@/components/button";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters." }),
});

const Signup = () => {
  const form = useForm<z.infer<typeof schema>>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(schema),
  });

  type FormValues = typeof form.values;

  const handleSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <>
      <h2 className="mb-9 text-center text-3xl font-semibold">Login</h2>
      <h3 className="mb-3 text-center text-2xl font-medium">
        Welcome back to ECOMMERCE
      </h3>
      <p className="text-center text-base">The next gen business marketplace</p>
      <form onSubmit={form.onSubmit(handleSubmit)} className="pb-7 pt-8">
        <div className="flex flex-col gap-8">
          <StyledTextInput
            type="text"
            label="Email"
            placeholder="Enter your email"
            error={form.errors?.email}
            key={form.key("email")}
            {...form.getInputProps("email", { type: "input" })}
          />

          <StyledPasswordInput
            label="Password"
            placeholder="Enter your password"
            error={form.errors?.password}
            key={form.key("password")}
            {...form.getInputProps("password", { type: "input" })}
          />
        </div>

        <StyledButton type="submit">login</StyledButton>
      </form>

      <Divider className="h-[1px] w-full bg-border-light" />

      <p className="mt-8 text-center">
        Don&apos;t Have an Account?{" "}
        <Link href="/signup" className="font-medium uppercase">
          sign up
        </Link>
      </p>
    </>
  );
};

export default Signup;
