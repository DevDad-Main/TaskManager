import { User } from "@prisma/client";
import { SafeUser } from "./user.types";

declare global {
  namespace Express {
    interface Request {
      // NOTE: Re-made a new user type as the original one was requiring the password due t ohow our model was setup.
      // user?: User;
      user?: SafeUser;
    }
  }
}

// NOTE: Export it as a module not a script
export {};
