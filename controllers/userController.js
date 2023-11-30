export const signUp = async (req, res) => {
  const { username, password } = req.body;
  // create a new user
  // create jwt token and return
  res.json({ token: "", error: null });
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;
  // return jwt if credentials is valid
  res.json({ token: "", error: null });
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  // find user by id and return
  res.json({ user: {}, error: null });
};
