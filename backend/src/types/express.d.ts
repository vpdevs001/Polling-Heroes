export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser | null;
    }
  }
}

export {};
