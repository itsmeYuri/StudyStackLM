"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
export async function manageUser(formData:FormData){const access=await requireAdmin();if(!access)redirect("/app");const id=String(formData.get("user_id")),action=String(formData.get("action")),email=String(formData.get("email"));if(action==="ban")await access.admin.auth.admin.updateUserById(id,{ban_duration:"876000h"});if(action==="unban")await access.admin.auth.admin.updateUserById(id,{ban_duration:"none"});if(action==="reset")await access.admin.auth.resetPasswordForEmail(email,{redirectTo:`${process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"}/auth/callback?next=/app/settings`});revalidatePath("/app/admin")}
export async function updateSuggestion(formData:FormData){const access=await requireAdmin();if(!access)redirect("/app");await access.admin.from("suggestions").update({status:String(formData.get("status"))}).eq("id",String(formData.get("id")));revalidatePath("/app/admin")}
