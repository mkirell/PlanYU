import bcrypt from "bcrypt";
import User from "../../infrastructure/models/userModel.js";

export async function createAD() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const hash = await bcrypt.hash(password, 10);

  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: { password_hash: hash, role: "ADMIN" },
  });

  if (!created && user.role !== "ADMIN") {
    user.role = "ADMIN";
    await user.save();
  }
}
