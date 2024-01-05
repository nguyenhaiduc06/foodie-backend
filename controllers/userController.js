import supabase from "../lib/supabase.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
export const signUp = async (req, res) => {
  // validate
  const { username, password, name, avatarUrl } = req.body;
  if (username == null || username == "")
    return res.status(400).json({ error: "username là bắt buộc" });
  if (password == null || password == "")
    return res.status(400).json({ error: "password là bắt buộc" });
  if (name == null || name == "")
    return res.status(400).json({ error: "name là bắt buộc" });

  const { data, error: error2 } = await supabase
    .from("users")
    .select()
    .eq("username", username);
  if (data != null && data.length)
    return res.status(400).json({ error: "username đã tồn tại" });

  let hashedPassword;
  try {
    hashedPassword = bcrypt.hashSync(password, 10);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Không thể mã hoá mật khẩu" });
  }
  // create a new user
  let newUser = {
    created_at: new Date().toISOString(),
    name: name,
    username: username,
    password: hashedPassword,
    avatar_url: avatarUrl,
  };
  let { data: x, error: y } = await supabase
    .from("groups")
    .select()
    .eq("name", "abcd");
  let { data: user, error } = await supabase
    .from("users")
    .insert(newUser)
    .select()
    .single();
  delete user.password;
  let { data: group, error: errorGroup } = await supabase
    .from("groups")
    .insert({
      created_at: new Date().toISOString(),
      name: username + "Group",
    })
    .select()
    .single();
  let { data: member, error: errorMember } = await supabase
    .from("members")
    .insert({
      created_at: new Date().toISOString(),
      user_id: user.id,
      group_id: group.id,
    })
    .select()
    .single();

  const token = createJwt({ user });
  res.json({ token });
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;
  if (username == null || username == "")
    return res.status(400).json({ error: "username là bắt buộc" });
  if (password == null || password == "")
    return res.status(400).json({ error: "password là bắt buộc" });

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("username", username);
  if (data == null || data.length == 0)
    return res.status(400).json({ error: "username không tồn tại" });
  const user = data[0];
  try {
    const result = bcrypt.compareSync(password, user.password);
    if (!result) return res.status(400).json({ error: "Mật khẩu không khớp" });
  } catch (error) {
    console.error("Lỗi so sánh mật khẩu:", error);
    return res.status(500).json({ error: "Không thể so sánh mật khẩu" });
  }
  delete user.password;
  const token = createJwt({ user });
  res.json({ token });
};

export const getUser = async (req, res) => {
  const { email } = req.query;
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("email", email)
    .single();
  res.json({ data, error });
};

const createJwt = function (payload) {
  const secret_key = process.env.SECRET_KEY;
  const token = jwt.sign(payload, secret_key, {
    expiresIn: "2h",
  });
  return token;
};
