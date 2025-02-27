"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormError from "@/components/form-error";
import Textbox from "@/components/textbox";
import Button from "@/components/button";
import { ApolloError, useMutation } from "@apollo/client";
import { LoginMutation } from "@/lib/auth/auth.gql";
import { authService } from "@/lib/auth/AuthService";
import { useRouter } from "next/navigation";

const LoginForm: FC = () => {
  const router = useRouter();
  const form = useForm({
    resolver: yupResolver(
      Yup.object({
        username: Yup.string().required().label("Username"),
        password: Yup.string().required().label("Password"),
      }).required(),
    ),
  });

  const [loginFn, mutation] = useMutation(LoginMutation, {
    async onCompleted(data) {
      await Promise.all([
        authService.userStorage.setData(data.login.user),
        authService.tokenStorage.setData(data.login.token),
      ]);
      router.replace("/dashboard");
    },
  });

  const handleSubmit = form.handleSubmit(() => {
    loginFn({ variables: form.getValues() });
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border flex flex-col gap-8 rounded-xl px-11 py-9 lg:border"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <h2 className="text-dark">
          Welcome. Enter your credentials to log in to your account.
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <label className="text-sm" htmlFor="username">
            Username
          </label>
          <Textbox
            type="username"
            id="username"
            placeholder="Enter your username"
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
            placeholder="Enter your password"
            {...form.register("password")}
          />
          <FormError message={form.formState.errors.password?.message} />
        </div>
      </div>
      {mutation.error instanceof ApolloError && (
        <div className="rounded-md border border-danger bg-danger/20 p-2 text-sm capitalize text-danger">
          {mutation.error.message}
        </div>
      )}
      <Button type="submit" disabled={mutation.loading}>
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;
