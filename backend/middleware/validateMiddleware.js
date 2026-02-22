exports.validateRegister = (req, res, next) => {
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email))
    return res.status(400).json({ message: "Invalid email format" });

  if (password.length < 6)
    return res.status(400).json({ message: "Weak password" });

  next();
};