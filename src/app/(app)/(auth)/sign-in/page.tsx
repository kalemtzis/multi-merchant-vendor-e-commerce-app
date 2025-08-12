import SignInView from "@/modules/auth/ui/views/sign-in-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const { user } = await caller.auth.session();

  if (user) redirect("/");

  return <SignInView />;
};

export default SignInPage;
