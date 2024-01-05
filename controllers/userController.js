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
    return res.json({ error: "Existed" });
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
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("username", username);
  if (!data || data.length == 0) {
    return res.json({ error: "User not existed" });
  }
  const account = data[0];
  if (!bcrypt.compareSync(password, account.password)) {
    return res.json({ error: "Invalid password" });
  }
  const token = createToken(account);
  res.json({ account, token });
};

export const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { name, username } = req.body;
  const { data, error } = await supabase
    .from("accounts")
    .update({
      name,
      username,
    })
    .eq("id", id);
  res.json({ data, error });
};

export const getAccount = async (req, res) => {
  const { token } = req.body;
  jwt.verify(token, JWT_SECRET, (error, data) => {
    if (error) return res.json({ error });
    res.json({ account: data.account });
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
