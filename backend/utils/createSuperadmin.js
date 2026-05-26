require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("../db");

async function main() {
  const name = process.env.ADMIN_NAME || "Superadmin";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    `
    INSERT INTO users (name, email, password, role, approved)
    VALUES (?, ?, ?, 'superadmin', TRUE)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      password = VALUES(password),
      role = 'superadmin',
      approved = TRUE
    `,
    [name, email, hashedPassword]
  );

  console.log(`Superadmin siap: ${email}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
