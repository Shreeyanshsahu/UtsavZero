import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const REVIEWER_EMAIL = "utsavzeroauth@gmail.com";

export default async function AuthorizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Verify the current user's session on the server.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Only the designated reviewer email is allowed.
  if (user.email?.toLowerCase() !== REVIEWER_EMAIL) {
    redirect("/civic");
  }

  // The reviewer must also have the civic_demo_admin role.
  const { data: roles, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  if (
    roleError ||
    !roles?.some((item) => item.role === "civic_demo_admin")
  ) {
    redirect("/civic");
  }

  return <>{children}</>;
}