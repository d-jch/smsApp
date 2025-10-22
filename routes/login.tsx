import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import LoginForm from "../islands/LoginForm.tsx";

export default define.page(function Login(_ctx) {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen flex items-center justify-center">
      <Head>
        <title>Login</title>
      </Head>
      <div class="w-full max-w-md">
        <h1 class="text-2xl font-bold mb-4">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
});
