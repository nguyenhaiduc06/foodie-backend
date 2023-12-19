import supabase from "../lib/supabase.js";

export const isUserOfGroup  = async function isUserOfGroup(userId, groupId) {
    const {data, error} = await supabase.from("members").select().eq('user_id', userId).eq('group_id', groupId).single();
    if (error) {console.log(error); return false;}
    if (data ) {return true;}

}
