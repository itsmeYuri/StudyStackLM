"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveSettings(formData:FormData){
 const supabase=await createClient();if(!supabase)redirect("/login");const{data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const displayName=String(formData.get("display_name")||"").trim();const themeMode=String(formData.get("theme_mode")||"system");const accentTheme=String(formData.get("accent_theme")||"rose");
 if(displayName.length<2)redirect("/app/settings?error=Display name is too short");
 if(!["light","dark","system"].includes(themeMode)||!["rose","violet","ocean","forest"].includes(accentTheme))redirect("/app/settings?error=Choose a valid theme");
 const{error}=await supabase.from("profiles").update({display_name:displayName,locale:String(formData.get("locale")||"en"),reduce_motion:formData.get("reduce_motion")==="on",large_study_text:formData.get("large_study_text")==="on",theme_mode:themeMode,accent_theme:accentTheme,updated_at:new Date().toISOString()}).eq("id",user.id);
 if(error)redirect(`/app/settings?error=${encodeURIComponent(error.message)}`);const{error:authError}=await supabase.auth.updateUser({data:{...user.user_metadata,display_name:displayName}});if(authError)redirect(`/app/settings?error=${encodeURIComponent(authError.message)}`);revalidatePath("/app","layout");redirect("/app/settings?saved=1");
}
export async function submitSuggestion(formData:FormData){const supabase=await createClient();if(!supabase)redirect("/login");const{data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");const message=String(formData.get("message")||"").trim();if(message.length<10)redirect("/app/settings?error=Please add a little more detail to your suggestion");const{error}=await supabase.from("suggestions").insert({user_id:user.id,category:String(formData.get("category")||"other"),message});if(error)redirect(`/app/settings?error=${encodeURIComponent(error.message)}`);redirect("/app/settings?suggestion=1")}
