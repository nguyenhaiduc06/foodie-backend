import supabase from "../lib/supabase.js";
import {isUserOfGroup} from "../util/util.js"

export const createDish = async (req, res) => {
    const {group_id, name, image_url, date, meal} = req.body;
    let newDish = {
        group_id: group_id,
        name: name,
        image_url: image_url,
        date: date,
        meal: meal,
        created_at: new Date().toISOString()
    }
    if (!group_id) return res.status(400).json({error: "group_id là bắt buộc"});
    if (!name) return res.status(400).json({error: "name là bắt buộc"});
    if (!meal) return res.status(400).json({error: "meal là bắt buộc"});
    if (!date) return res.status(400).json({error: "date là bắt buộc"});
    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: 'User không thuộc group'});
    }
    const {data, error} = await supabase.from("dishes").insert(newDish).select().single();
    return res.json({data, error});
};

export const getDishes = async (req, res) => {
  const {group_id} = req.query;

  // If !group_id, return error = Group id must be provided
  if (!group_id) return res.status(500).json({error: 'Group id must be provided'});

  // kiểm tra user thuộc group
  const validate = await isUserOfGroup(req.principle.user.id, group_id);
  if (!validate) {
    return res.status(500).json({error: 'User không thuộc group'});
  }

  // Get dishes by group_id
  const {data, error} = await supabase.from("dishes").select().eq('group_id', group_id);
  return res.json({data, error});
};

export const getDishDetails = async (req, res) => {
    const {id} = req.params;
    if (!id) return res.status(500).json({error: 'id must be provided'});
    const {data, error} = await supabase.from("dishes").select().eq('id', id).select();
    if (data && data.length > 0) {
        const validate = await isUserOfGroup(req.principle.user.id, data[0].group_id);
        if (!validate) {
            return res.status(500).json({error: 'User không thuộc group'});
        }
    }
    return res.json({data, error});
};

export const updateDish = async (req, res) => {
    const {id} = req.params;
    const {group_id, name, image_url, date, meal} = req.body;

    if (!id) return res.status(400).json({error: "id là bắt buộc"});
    if (!group_id) return res.status(400).json({error: "group_id là bắt buộc"});
    if (!name) return res.status(400).json({error: "name là bắt buộc"});
    if (!meal) return res.status(400).json({error: "meal là bắt buộc"});
    if (!date) return res.status(400).json({error: "date là bắt buộc"});
    // kiểm tra group mới có phải của user hiện tại không
    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: `User không thuộc group ${group_id}`});
    }
    // kiểm tra sản phảm có thuộc group của user hiện tại không
    const {data : oldDish, error : errorOldDish} = await supabase.from("dishes").select().eq('id', id);
    if (error || !oldDish || !oldDish.length) return res.json({data : oldDish, error : errorOldDish});
    const validate2 =  await isUserOfGroup(req.principle.user.id, oldDish[0].group_id);
    if (!validate2) {
        return res.status(500).json({error: 'Bạn không có quyền với dish này'});
    }
    let newDish = {
        group_id: group_id,
        name: name,
        image_url: image_url,
        date: date,
        meal: meal
    }

    const { data, error } = await supabase
        .from('dishes')
        .update(newDish)
        .eq('id', id)
        .select()
    return res.json({data, error});
};

export const deleteDish = async (req, res) => {
    const {id} = req.params;
    if (!id) return res.status(400).json({error: "id là bắt buộc"});
    const {data : oldDish, error : errorOldDish} = await supabase.from("dishes").select().eq('id', id);
    if (errorOldDish ) return res.json({data : null, error : errorOldDish});
    if (!oldDish || !oldDish.length) return res.json({data : null, error : "Dish không tồn tại"});
    
    const validate2 =  await isUserOfGroup(req.principle.user.id, oldDish[0].group_id);
    if (!validate2) {
        return res.status(500).json({error: 'Bạn không có quyền với dish này'});
    }
    const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', id);
    if (error) return res.json({error});
    else return res.json({data : "Xoá thành công!", error});
};
