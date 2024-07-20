"use client";

import React from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { StyledPasswordInput, StyledTextInput } from "@/components/input";
import { Divider } from "@mantine/core";
import Link from "next/link";
import StyledButton from "@/components/button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { loginSchema, type LoginSchema } from "@/types/auth";
import { authenticatedRoutes, publicRoutes } from "@/config/routes";

const Login = () => {
  const form = useForm<LoginSchema>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const router = useRouter();

  const loginMutation = api.auth.login.useMutation({
    onSuccess: () => {
      router.push(authenticatedRoutes.categories.link);
    },
    onError: (error) => {
      toast.error(error.message);

      if (error.data?.code === "FORBIDDEN") {
        router.push(
          `${publicRoutes.verifyOtp.link}?email=${form.getValues().email}`,
        );
      }
    },
  });

  const handleSubmit = (values: LoginSchema) => {
    loginMutation.mutate(values);
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
            disabled={loginMutation.isPending}
          />

          <StyledPasswordInput
            label="Password"
            placeholder="Enter your password"
            error={form.errors?.password}
            key={form.key("password")}
            {...form.getInputProps("password", { type: "input" })}
            disabled={loginMutation.isPending}
          />
        </div>

        <StyledButton type="submit" disabled={loginMutation.isPending}>
          login
        </StyledButton>
      </form>

      <Divider className="h-[1px] w-full bg-border-light" />

      <p className="mt-8 text-center">
        Don&apos;t Have an Account?{" "}
        <Link href={publicRoutes.sigup.link} className="font-medium uppercase">
          sign up
        </Link>
      </p>
    </>
  );
};

export default Login;
