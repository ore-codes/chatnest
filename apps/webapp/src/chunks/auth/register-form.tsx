"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormError from "@/components/form-error";
import Textbox from "@/components/textbox";
import Button from "@/components/button";
import { ApolloError, useMutation } from "@apollo/client";
import { RegisterMutation } from "@/lib/auth/auth.gql";
import { authService } from "@/lib/auth/AuthService";
import { useRouter } from "next/navigation";

const RegisterForm: FC = () => {
  const router = useRouter();
  const form = useForm({
    resolver: yupResolver(
      Yup.object({
        username: Yup.string().required().label("Username"),
        password: Yup.string().min(6).required().label("Password"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required()
          .label("Confirm Password"),
      }).required(),
    ),
  });

  const [registerFn, mutation] = useMutation(RegisterMutation, {
    async onCompleted(data) {
      await Promise.all([
        authService.user.setData(data.register.user),
        authService.token.setData(data.register.token),
      ]);
      router.replace("/dashboard");
    },
  });

  const handleSubmit = form.handleSubmit(() => {
    const { username, password } = form.getValues();
    registerFn({ variables: { username, password } });
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border flex flex-col gap-8 rounded-xl px-11 py-9 lg:border"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <h2 className="text-dark">Create an account to get started.</h2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <label className="text-sm" htmlFor="username">
            Username
          </label>
          <Textbox
            type="text"
            id="username"
            placeholder="Choose a unique username"
            {...form.register("username")}
          />
          <FormError message={form.formState.errors.username?.message} />
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="password">
            Password
          </label>
          <Textbox
            type="password"
            id="password"
            placeholder="Choose a password"
            {...form.register("password")}
          />
          <FormError message={form.formState.errors.password?.message} />
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <Textbox
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            {...form.register("confirmPassword")}
          />
          <FormError message={form.formState.errors.confirmPassword?.message} />
        </div>
      </div>
      {mutation.error instanceof ApolloError && (
        <div className="rounded-md border border-danger bg-danger/20 p-2 text-sm capitalize text-danger">
          {mutation.error.message}
        </div>
      )}
      <Button type="submit" disabled={mutation.loading}>
        Sign Up
      </Button>
    </form>
  );
};

export default RegisterForm;
