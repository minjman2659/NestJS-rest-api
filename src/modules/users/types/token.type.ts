export interface AccessTokenPayload {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  isSeceder: boolean;
}

export interface RefreshTokenPayload {
  id: number;
  email: string;
}
