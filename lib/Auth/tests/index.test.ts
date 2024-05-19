import { BuildFirebaseAuth } from "@src/Auth/index.js"
import { BuildServicesTest } from "@src/tests/helpers/build-services.js"
import { describe, expect, it } from "vitest"

describe("FIREBASE WEB Auth", async () => {
  const { AUTH_WEB } = await BuildServicesTest()

  it("should instantiate Firebase Auth", async () => {
    const auth = BuildFirebaseAuth(AUTH_WEB)
    expect(auth).toHaveProperty("signInWithEmail")
    expect(auth).toHaveProperty("signOut")
    expect(auth).toHaveProperty("isLoggedIn")
  })
})
