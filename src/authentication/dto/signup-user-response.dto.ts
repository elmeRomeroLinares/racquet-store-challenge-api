import { UserRole } from '../enums/user-role.enum';

export class SignUpUserResponseDto {
  createdUserUuid: string;
  role: UserRole;
}
