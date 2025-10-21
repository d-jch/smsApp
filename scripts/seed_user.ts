import {
  authenticateUser,
  createUser,
  deleteUserByEmail,
} from "../src/auth.ts";

const EMAIL = `ci_test_${Date.now()}@example.com`;
const PASSWORD = "TestPass123!";

async function run() {
  console.log("Seeding test user:", EMAIL);
  try {
    const user = await createUser(EMAIL, PASSWORD);
    console.log("Created user id:", user.id);
    const auth = await authenticateUser(EMAIL, PASSWORD);
    if (!auth) throw new Error("authentication failed");
    console.log("Authenticated user id:", auth.id);
  } finally {
    await deleteUserByEmail(EMAIL);
    console.log("Deleted test user");
  }
}

if (import.meta.main) {
  run().catch((e) => {
    console.error(e);
    Deno.exit(1);
  });
}
