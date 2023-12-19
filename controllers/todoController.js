import supabase from "../lib/supabase.js";
import {isUserOfGroup} from "../util/util.js";

export const table = "todos";
export const createTodo = async (req, res) => {
    const {name, amount, checked = false, date, group_id} = req.body;
    if (!group_id) return res.status(400).json({error: "group_id là bắt buộc"});
    if (!name) return res.status(400).json({error: "name là bắt buộc"});
    if (!amount) return res.status(400).json({error: "amount là bắt buộc"});
    if (!date) return res.status(400).json({error: "date là bắt buộc"});
    let newTodo = {
        group_id: group_id,
        name: name,
        amount: amount,
        checked : checked ,
        date : date,
        created_at: new Date().toISOString()
    }
    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: `User không thuộc group ${group_id}`});
    }
    const {data, error} = await supabase.from(table).insert(newTodo).select().single();
    
    res.json({data, error});
};

export const getTodos = async (req, res) => {
    const {group_id} = req.query;

    // If !group_id, return error = Group id must be provided
    if (!group_id) return res.status(500).json({error: 'Group id must be provided'});

    // kiểm tra user thuộc group
    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: `User không thuộc group ${group_id}`});
    }

    // getTodos by group_id
    const {data, error} = await supabase.from(table).select().eq('group_id', group_id);
    return res.json({data, error});
};

export const updateTodo = async (req, res) => {
    const {id} = req.params;
    const {name, amount, checked = false, date, group_id} = req.body;

    if (!group_id) return res.status(400).json({error: "group_id là bắt buộc"});
    if (!name) return res.status(400).json({error: "name là bắt buộc"});
    if (!amount) return res.status(400).json({error: "amount là bắt buộc"});
    if (!date) return res.status(400).json({error: "date là bắt buộc"});

    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: `User không thuộc group ${group_id}`});
    }

    // kiểm tra sản phảm có thuộc group của user hiện tại không
    const {data : oldTodo, error : errorOldTodo} = await supabase.from(table).select().eq('id', id);
    if (errorOldTodo || !oldTodo || !oldTodo.length) return res.json({data : oldTodo, error : errorOldTodo});
    const validate2 =  await isUserOfGroup(req.principle.user.id, oldTodo[0].group_id);
    if (!validate2) {
        return res.status(500).json({error: 'Bạn không có quyền với Todo này'});
    }

    let newTodo = {
        group_id: group_id,
        name: name,
        amount: amount,
        checked : checked ,
        date : date,
        created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
        .from(table)
        .update(newTodo)
        .eq('id', id)
        .select()
    return res.json({data, error});
};

export const deleteTodo = async (req, res) => {
    const {id} = req.params;
    if (!id) return res.status(400).json({error: "id là bắt buộc"});
    const {data : oldTodo, error : errorOldTodo} = await supabase.from(table).select().eq('id', id);
    if (errorOldTodo ) return res.json({data : null, error : errorOldTodo});
    if (!oldTodo || !oldTodo.length) return res.json({data : null, error : "Todo không tồn tại"});

    const validate2 =  await isUserOfGroup(req.principle.user.id, oldTodo[0].group_id);
    if (!validate2) {
        return res.status(500).json({error: 'Bạn không có quyền với Todo này'});
    }
    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
    if (error) return res.json({error});
    else return res.json({data : "Xoá thành công!", error});
};
