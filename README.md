# 🚧 [WIP] 🚧
# 🔥 Simple Firebase [WIP]

A wrapper to simplify, give some more functions and validation to Firebase SDK.

## ✅ Services
- [WIP] Authentication
- [WIP] Firestore
- [ToDo] Realtime Database
- [ToDo] Storage
- [ToDo] Cloud Functions

## 📝 Documentation
### 🚧 [WIP] 🚧

## 👀 How to use [WIP]

```typescript
// 1. Set firebase configs
const config: FirebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER_ID",
  appId: "APP_ID"
};

// 2. Instantiate a Firebase Services:
const {
  AUTH_WEB,
  CLOUD_FUNCTIONS_WEB,
  FIRESTORE_WEB
} = await BuildFirebase(
  config, // configs
  "Simple Firebase", // App name
  "test" // Environment (if "test" will try to connect on emulator)
);

// 3. Build a Service
const repository = BuildFirestore(FIRESTORE_WEB);

// 4. Create a Type Model
interface User {
  name: string;
  email: string;
};

// 5. Create a Model
const UserModel = repository.model<User>("user");

// 6. Use functions
const aNewUser = await UserModel.create({
  name: "EVA 01",
  email: "yui_ikari@email.com"
});

console.log(aNewUser)
/* output:
{
  _id: "firestore_generated_id",
  name: "EVA 01",
  email: "yui_ikari@email.com"
}
*/
```
