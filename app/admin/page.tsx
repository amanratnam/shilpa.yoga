import { redirect } from "next/navigation";

/** The panel opens on the client repository. */
export default function AdminIndexPage() {
  redirect("/admin/clients");
}
