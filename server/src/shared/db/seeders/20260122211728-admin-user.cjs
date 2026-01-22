"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return;

    const passwordHash = await bcrypt.hash(password, 10);

    const now = new Date();

    await queryInterface.bulkInsert(
      "User",
      [
        {
          email,
          password_hash: passwordHash,
          role: "ADMIN",
          token_version: 0,
          created_at: now,
          updated_at: now,
        },
      ],
      {
        ignoreDuplicates: true,
      },
    );

    const userId = await queryInterface.rawSelect(
      "User",
      { where: { email } },
      "user_id",
    );
    if (!userId) return;

    const profileId = await queryInterface.rawSelect(
      "Profile",
      { where: { user_id: userId } },
      "profile_id",
    );

    if (profileId) return;

    await queryInterface.bulkInsert("Profile", [
      {
        user_id: userId,
        full_name: "PlanYU Admin",
        avatar_url: `https://robohash.org/${userId}?set=set4&size=100x100`,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    const email = process.env.ADMIN_EMAIL;
    if (!email) return;
    await queryInterface.bulkDelete("User", { email });
  },
};
