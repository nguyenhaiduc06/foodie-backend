import supabase from "../lib/supabase.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();
export const signUp = async (req, res) => {
    // validate
    const {username, password, name, avatarUrl} = req.body;
    if (username == null || username == "") return res.status(400).json({error: "username là bắt buộc"});
    if (password == null || password == "") return res.status(400).json({error: "password là bắt buộc"});
    if (name == null || name == "") return res.status(400).json({error: "name là bắt buộc"});

    const {data, error2} = await supabase
        .from('users')
        .select()
        .eq('username', username);
    if (data != null && data.length) return res.status(400).json({error: "username đã tồn tại"});


    let hashedPassword;
    try {
        hashedPassword = bcrypt.hashSync(password, 10);
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Không thể mã hoá mật khẩu'});
    }
    // create a new user
    let newUser = {
        created_at: new Date(),
        name: name,
        username: username,
        password: hashedPassword,
        avatar_url: avatarUrl
    }
    const {error} = await supabase.from("users").insert(newUser);
    // Create token
    const token = createJwt({username: newUser.username, name: newUser.name});
    res.json({token});
};

export const signIn = async (req, res) => {
    const {username, password} = req.body;
  if (username == null || username == "") return res.status(400).json({error: "username là bắt buộc"});
  if (password == null || password == "") return res.status(400).json({error: "password là bắt buộc"});

  const {data, error} = await supabase
      .from('users')
      .select()
      .eq('username', username);
  if (data == null || data.length == 0) return res.status(400).json({error: "username không tồn tại"});
  const user = data[0];
  try {
    const result = bcrypt.compareSync(password, user.password);
    if (!result) return res.status(400).json({error: "Mật khẩu không khớp"});
  } catch (error) {
    console.error('Lỗi so sánh mật khẩu:', error);
    return res.status(500).json({error: 'Không thể so sánh mật khẩu'});
  }
  const token = createJwt({username: user.username, name: user.name});
  res.json({token});
};

export const getUser = async (req, res) => {
    console.log(req);
    const {id} = req.params;
    if (id  == null) return res.status(400).json({error: "id là bắt buộc"});
    const {data, error2} = await supabase
        .from('users')
        .select()
        .eq('id', id);

    if (data)
        for (let i = 0; i < data.length; i++) {
            delete data[i].password;
        }
    res.json({data});
};

const createJwt = function(payload) {
  const secret_key = process.env.SECRET_KEY;
  const token = jwt.sign(
      payload,
      secret_key,
      {
        expiresIn: "2h",
      }
  );
  return token;
}