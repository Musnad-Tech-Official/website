export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: "admin" | "user";
    };
  }

  interface UserPublicMetadata {
    role?: "admin" | "user";
  }
}
