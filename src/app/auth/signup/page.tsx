"use client";

import React from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { StyledPasswordInput, StyledTextInput } from "@/components/input";
import { Divider } from "@mantine/core";
import Link from "next/link";
import StyledButton from "@/components/button";
import { signupSchema, type SignupSchema } from "@/types/auth";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { publicRoutes } from "@/config/routes";

const Signup = () => {
  const form = useForm<SignupSchema>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    validate: zodResolver(signupSchema),
  });

  const router = useRouter();

  const signupMutation = api.auth.signup.useMutation({
    onSuccess: async (data) => {
      router.replace(`${publicRoutes.verifyOtp.link}?email=${data.email}`);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (values: SignupSchema) => {
    signupMutation.mutate(values);
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
        <Link href={publicRoutes.login.link} className="font-medium uppercase">
          login
        </Link>
      </p>
    </>
  );
};

export default Signup;
