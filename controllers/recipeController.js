import {isUserOfGroup} from "../util/util.js";
import supabase from "../lib/supabase.js";
export const table = "recipes"; 
export const createRecipe = async (req, res) => {
    // const {group_id, name, content, image_url} = req.body;
    // Example:
    // const {data, error} = await supabase.from().insert();
    // res.json({data, error});

    const {group_id, name, content, image_url} = req.body;
    if (!group_id) return res.status(400).json({error: "group_id là bắt buộc"});
    if (!name) return res.status(400).json({error: "name là bắt buộc"});
    if (!content) return res.status(400).json({error: "content là bắt buộc"});
    let newRecipe = {
        group_id: group_id,
        name: name,
        image_url: image_url,
        content: content,
        created_at: new Date().toISOString()
    }
    
    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: 'User không thuộc group'});
    }
    const {data, error} = await supabase.from(table).insert(newRecipe).select().single();
    return res.json({data, error});
};

export const getRecipes = async (req, res) => {
    // const {group_id} = req.query;
    // Get recipes by group_id
    // If !group_id, return error = Group id must be provided

    const {group_id} = req.query;

    // If !group_id, return error = Group id must be provided
    if (!group_id) return res.status(500).json({error: 'Group id must be provided'});

    // kiểm tra user thuộc group
    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: 'User không thuộc group'});
    }

    // getRecipes by group_id
    const {data, error} = await supabase.from(table).select().eq('group_id', group_id);
    return res.json({data, error});
};

export const getRecipeDetails = async (req, res) => {
    const {id} = req.params;
    if (!id) return res.status(500).json({error: 'id must be provided'});
    const {data, error} = await supabase.from(table).select().eq('id', id).select();
    if (data && data.length > 0) {
        const validate = await isUserOfGroup(req.principle.user.id, data[0].group_id);
        if (!validate) {
            return res.status(500).json({error: 'User không thuộc group'});
        }
    }
    return res.json({data, error});
};

export const updateRecipe = async (req, res) => {
    const {id} = req.params;
    const {group_id, name, content, image_url} = req.body;

    if (!group_id) return res.status(400).json({error: "group_id là bắt buộc"});
    if (!name) return res.status(400).json({error: "name là bắt buộc"});
    if (!content) return res.status(400).json({error: "content là bắt buộc"});
    
    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: 'User không thuộc group'});
    }

    // kiểm tra sản phảm có thuộc group của user hiện tại không
    const {data : oldRecipe, error : errorOldRecipe} = await supabase.from(table).select().eq('id', id);
    if (error || !oldRecipe || !oldRecipe.length) return res.json({data : oldRecipe, error : errorOldRecipe});
    const validate2 =  await isUserOfGroup(req.principle.user.id, oldRecipe[0].group_id);
    if (!validate2) {
        return res.status(500).json({error: 'Bạn không có quyền với Recipe này'});
    }

    let newRecipe = {
        group_id: group_id,
        name: name,
        image_url: image_url,
        content: content,
        created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
        .from(table)
        .update(newRecipe)
        .eq('id', id)
        .select()
    return res.json({data, error});
};

export const deleteRecipe = async (req, res) => {
    const {id} = req.params;
    if (!id) return res.status(400).json({error: "id là bắt buộc"});
    const {data : oldRecipe, error : errorOldRecipe} = await supabase.from(table).select().eq('id', id);
    if (errorOldRecipe ) return res.json({data : null, error : errorOldRecipe});
    if (!oldRecipe || !oldRecipe.length) return res.json({data : null, error : "Recipe không tồn tại"});

    const validate2 =  await isUserOfGroup(req.principle.user.id, oldRecipe[0].group_id);
    if (!validate2) {
        return res.status(500).json({error: 'Bạn không có quyền với Recipe này'});
    }
    const { error } = await supabase
        .from('Recipees')
        .delete()
        .eq('id', id);
    if (error) return res.json({error});
    else return res.json({data : "Xoá thành công!", error});
};
