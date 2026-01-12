// Lightweight request validation helpers to avoid adding dependencies.
// These enforce required auth fields and basic shapes before hitting controllers.

const isEmail = (value) =>
  typeof value === "string" &&
  value.includes("@") &&
  value.trim().length >= 5 &&
  value.trim().length <= 254;

export const validateAuth = (type) => (req, res, next) => {
  const { email, password, username } = req.body || {};

  if (type === "register") {
    if (
      !username ||
      typeof username !== "string" ||
      username.trim().length < 2 ||
      username.trim().length > 50
    ) {
      return res
        .status(400)
        .json({ message: "Username must be 2-50 characters" });
    }
  }

  if (!isEmail(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  if (
    !password ||
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 128
  ) {
    return res
      .status(400)
      .json({ message: "Password must be 6-128 characters" });
  }

  next();
};
