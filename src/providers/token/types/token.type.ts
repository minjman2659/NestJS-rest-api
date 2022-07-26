export interface TokenPayload {
  id: number;
  email: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
  iss?: string;
}
