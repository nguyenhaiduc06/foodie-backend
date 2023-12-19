import {isUserOfGroup} from "../util/util.js";
import supabase from "../lib/supabase.js";

export const table = "storages";
export const createStorage = async (req, res) => {
    const {group_id, name, amount, image_url, stored_at, expire_date} = req.body;
    if (!group_id) return res.status(400).json({error: "group_id là bắt buộc"});
    if (!name) return res.status(400).json({error: "name là bắt buộc"});
    if (!amount) return res.status(400).json({error: "amount là bắt buộc"});
    if (!stored_at) return res.status(400).json({error: "stored_at là bắt buộc"});
    if (!expire_date) return res.status(400).json({error: "expire_date là bắt buộc"});
    let newStorage = {
        group_id: group_id,
        name: name,
        amount: amount,
        stored_at : stored_at ,
        expire_date : expire_date,
        image_url: image_url,
        created_at: new Date().toISOString()
    }
    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: `User không thuộc group ${group_id}`});
    }
    const {data, error} = await supabase.from(table).insert(newStorage).select().single();
    return res.json({data, error});
};

export const getStorages = async (req, res) => {

    const {group_id} = req.query;

    // If !group_id, return error = Group id must be provided
    if (!group_id) return res.status(500).json({error: 'Group id must be provided'});

    // kiểm tra user thuộc group
    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: `User không thuộc group ${group_id}`});
    }

    // getStorages by group_id
    const {data, error} = await supabase.from(table).select().eq('group_id', group_id);
    return res.json({data, error});
};

export const getStorageDetails = async (req, res) => {
    const {id} = req.params;
    if (!id) return res.status(500).json({error: 'id must be provided'});
    const {data, error} = await supabase.from(table).select().eq('id', id).select();
    if (data && data.length > 0) {
        const validate = await isUserOfGroup(req.principle.user.id, data[0].group_id);
        if (!validate) {
            return res.status(500).json({error: `User không thuộc group ${data[0].group_id}`});
        }
    }
    return res.json({data, error});
};

export const updateStorage = async (req, res) => {
    const {id} = req.params;
    const {group_id, name, amount, image_url, stored_at, expire_date} = req.body;

    if (!group_id) return res.status(400).json({error: "group_id là bắt buộc"});
    if (!name) return res.status(400).json({error: "name là bắt buộc"});
    if (!amount) return res.status(400).json({error: "amount là bắt buộc"});
    if (!stored_at) return res.status(400).json({error: "stored_at là bắt buộc"});
    if (!expire_date) return res.status(400).json({error: "expire_date là bắt buộc"});

    const validate = await isUserOfGroup(req.principle.user.id, group_id);
    if (!validate) {
        return res.status(500).json({error: `User không thuộc group ${group_id}`});
    }

    // kiểm tra sản phảm có thuộc group của user hiện tại không
    const {data : oldStorage, error : errorOldStorage} = await supabase.from(table).select().eq('id', id);
    if (errorOldStorage || !oldStorage || !oldStorage.length) return res.json({data : oldStorage, error : errorOldStorage});
    const validate2 =  await isUserOfGroup(req.principle.user.id, oldStorage[0].group_id);
    if (!validate2) {
        return res.status(500).json({error: 'Bạn không có quyền với Storage này'});
    }

    let newStorage = {
        group_id: group_id,
        name: name,
        amount: amount,
        stored_at : stored_at ,
        expire_date : expire_date,
        image_url: image_url,
        created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
        .from(table)
        .update(newStorage)
        .eq('id', id)
        .select()
    return res.json({data, error});
};

export const deleteStorage = async (req, res) => {
    const {id} = req.params;
    if (!id) return res.status(400).json({error: "id là bắt buộc"});
    const {data : oldStorage, error : errorOldStorage} = await supabase.from(table).select().eq('id', id);
    if (errorOldStorage ) return res.json({data : null, error : errorOldStorage});
    if (!oldStorage || !oldStorage.length) return res.json({data : null, error : "Storage không tồn tại"});

    const validate2 =  await isUserOfGroup(req.principle.user.id, oldStorage[0].group_id);
    if (!validate2) {
        return res.status(500).json({error: 'Bạn không có quyền với Storage này'});
    }
    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
    if (error) return res.json({error});
    else return res.json({data : "Xoá thành công!", error});
};
