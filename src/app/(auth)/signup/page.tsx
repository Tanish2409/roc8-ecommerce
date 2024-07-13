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
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
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
      name: "",
    },
    validate: zodResolver(schema),
  });

  type FormValues = typeof form.values;

  const handleSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <>
      <h2 className="text-center text-3xl font-semibold">
        Create your account
      </h2>
      <form onSubmit={form.onSubmit(handleSubmit)} className="pb-7 pt-8">
        <div className="flex flex-col gap-8">
          <StyledTextInput
            type="text"
            label="Name"
            placeholder="Enter your name"
            error={form.errors?.name}
            key={form.key("name")}
            {...form.getInputProps("name", { type: "input" })}
          />

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

        <StyledButton type="submit">create account</StyledButton>
      </form>

      <Divider className="h-[1px] w-full bg-border-light" />

      <p className="mt-8 text-center">
        Have an Account?{" "}
        <Link href="/login" className="font-medium uppercase">
          login
        </Link>
      </p>
    </>
  );
};

export default Signup;
