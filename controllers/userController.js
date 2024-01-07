import supabase from "../lib/supabase.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = "secret";
const ROUNDS = 10;

export const signUp = async (req, res) => {
  const { name, username, password } = req.body;
  const { data: existedAccount } = await supabase
    .from("accounts")
    .select("*")
    .eq("username", username)
    .single();
  if (existedAccount) {
    return res.json({ error: "Username existed" });
  }

  const hashedPassword = await bcrypt.hash(password, ROUNDS);
  const { data: createdAccount, error } = await supabase
    .from("accounts")
    .insert({
      name,
      username,
      password: hashedPassword,
    })
    .select()
    .single();
  const token = createToken(createdAccount);
  res.json({ account: createdAccount, token, error });
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;
  const { data: account, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("username", username)
    .single();
  if (!account) {
    return res.json({ error: "User not existed" });
  }
  if (!bcrypt.compareSync(password, account.password)) {
    return res.json({ error: "Invalid password" });
  }
  const token = createToken(account);
  res.json({ account, token });
};

export const signInWithToken = async (req, res) => {
  const { token } = req.body;
  jwt.verify(token, JWT_SECRET, async (error, data) => {
    if (error) return res.json({ error });
    const account_id = data.account.id;
    const { data: account } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", account_id)
      .single();
    res.json({ account: account, token });
  });
};

export const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { name, username, avatar_url, push_token } = req.body;
  // const { data: existedAccount } = await supabase
  //   .from("accounts")
  //   .select("*")
  //   .eq("username", username)
  //   .single();
  // if (existedAccount) {
  //   return res.json({ error: "Username already taken" });
  // }
  const { data: updatedAccount, error } = await supabase
    .from("accounts")
    .update({
      name,
      username,
      avatar_url,
      push_token,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) return res.json({ error });

  const token = createToken(updatedAccount);
  res.json({ account: updatedAccount, token });
};

export const getAccount = async (req, res) => {
  const { token } = req.body;
  jwt.verify(token, JWT_SECRET, async (error, data) => {
    if (error) return res.json({ error });
    const account_id = data.account.id;
    const { data: account } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", account_id)
      .single();
    res.json({ account: account });
  });
};

export const getUser = async (req, res) => {
  const { username } = req.query;
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("username", username)
    .single();
  res.json({ data, error });
};

const createToken = function (data) {
  const token = jwt.sign({ account: data }, JWT_SECRET);
  return token;
};
