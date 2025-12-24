import ResetPasswordClient from "@/components/ResetPassword";

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;   // ✅ unwrap promise
  const contact = params?.contact || "";   // safe access

  return <ResetPasswordClient contact={contact} />;
}
