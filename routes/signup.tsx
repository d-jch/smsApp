import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import SignupForm from "../islands/SignupForm.tsx";

export default define.page(function Signup(_ctx) {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen flex items-center justify-center">
      <Head>
        <title>Sign up</title>
      </Head>
      <div class="w-full max-w-md">
        <h1 class="text-2xl font-bold mb-4">Create an account</h1>
        <SignupForm />
      </div>
    </div>
  );
});
