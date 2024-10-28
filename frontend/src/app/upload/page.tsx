import { Upload } from "@/components/Upload";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function () {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  return <Upload id={session.user?.image as string} />;
}
