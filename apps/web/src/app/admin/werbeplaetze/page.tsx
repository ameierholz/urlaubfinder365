import { redirect } from "next/navigation";

// Ad-Slots sind jetzt unter /admin/werbung/?tab=adslots
export default function WerbeplaetzeRedirect() {
  redirect("/admin/werbung/?tab=adslots");
}
