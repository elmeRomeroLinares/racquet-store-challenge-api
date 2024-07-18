import { UserRole } from '../enums/user-role.enum';

export class JWTPayload {
  sub: string;
  role: UserRole;
}
