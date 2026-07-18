import { redirect } from "next/navigation";

export default function NewWatchRedirect() {
  redirect("/admin/watches");
}
