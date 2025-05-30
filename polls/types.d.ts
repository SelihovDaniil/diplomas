declare module "next-auth" {
  interface User {
    id: string;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
