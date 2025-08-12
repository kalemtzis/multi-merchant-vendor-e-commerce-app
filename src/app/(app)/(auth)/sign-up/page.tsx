import SignUpView from "@/modules/auth/ui/views/sign-up-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const { user } = await caller.auth.session();

  if (user) redirect("/");
  
  return <SignUpView />;
};

export default SignUpPage;
