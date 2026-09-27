import type { SupabaseClient } from "@supabase/supabase-js";

export async function isGroupOwner(supabase:SupabaseClient,groupId:string,userId:string){
 const{data}=await supabase.from("group_members").select("role").eq("group_id",groupId).eq("user_id",userId).maybeSingle();
 return data?.role==="owner";
}
