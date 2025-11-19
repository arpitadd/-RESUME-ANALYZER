import fs from "fs";
import "dotenv/config";
import path from "path";
import { pool } from "../src/db.js";

// Use absolute path
const rolesPath = path.resolve("scripts", "roles_seed.json");

async function seed() {
  try {
    if (!fs.existsSync(rolesPath)) {
      throw new Error(`Could not find file at ${rolesPath}`);
    }

    const roles = JSON.parse(fs.readFileSync(rolesPath, "utf8"));
    console.log(`Found ${roles.length} roles to insert...`);

    for (const r of roles) {
      const query = `
        INSERT INTO roles (company_name, role_title, description, required_skills)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (company_name, role_title) DO UPDATE
        SET 
          description = EXCLUDED.description,
          required_skills = EXCLUDED.required_skills
        RETURNING id;
      `;

      await pool.query(query, [
        r.company_name,
        r.role_title,
        r.description,
        JSON.stringify(r.required_skills)   // 🔥 IMPORTANT for JSONB column
      ]);

      console.log(`✅ Upserted: ${r.role_title} at ${r.company_name}`);
    }

    console.log("🎉 Seeding complete!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding Failed:", error.message);
    process.exit(1);

  } finally {
    await pool.end();
  }
}

seed();
