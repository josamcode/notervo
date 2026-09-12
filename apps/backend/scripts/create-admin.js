const { validateEnvironment } = require("../config/env");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

async function main() {
  const { mongoUri } = validateEnvironment();
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } = process.env;
  if (
    ![ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD].every(Boolean) ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(ADMIN_PASSWORD) ||
    Buffer.byteLength(ADMIN_PASSWORD) > 72
  )
    throw new Error(
      "Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE and a strong ADMIN_PASSWORD (8–72 bytes)"
    );
  await mongoose.connect(mongoUri);
  try {
    if (
      await User.exists({
        $or: [{ email: ADMIN_EMAIL.toLowerCase() }, { phone: ADMIN_PHONE }],
      })
    )
      throw new Error("Account already exists; no changes made");
    await User.create({
      username: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password: await bcrypt.hash(ADMIN_PASSWORD, 12),
      role: "admin",
      isVerified: true,
    });
    console.log("Admin account created");
  } finally {
    await mongoose.disconnect();
  }
}
main().catch(() => {
  console.error(
    "Admin creation failed. Verify the inputs, account uniqueness and database connection."
  );
  process.exitCode = 1;
});
