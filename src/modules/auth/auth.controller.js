import Auth from "./auth.model";

export const signUp = async (req, res) => {
  req.assert("username", "Username is required!").exists();
  req.assert("email", "Email is required").exists();
  req.assert("email", "Email is not valid").isEmail();
  req
    .assert("password", "Password must be at least 4 characters long")
    .len({ min: 4 });
  req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.status(412).json({
      status: "error",
      data: null,
      error: errors
    });
  }

  try {
    const { username, email, password } = req.body;
    const user = await Auth.create({ username, email, password });

    if (!user) {
      return res.status(500).json({
        status: "error",
        data: null,
        error: "Oops, Can not create user."
      });
    }

    return res.json({});
  } catch (err) {
    return res.status(500).json({
      status: "error",
      data: null,
      error: String(err)
    });
  }
};
