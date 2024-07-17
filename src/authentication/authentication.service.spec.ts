import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './enums/user-role.enum';
import { SignUpUserResponseDto } from './dto/signup-user-response.dto';

jest.mock('bcryptjs');
jest.mock('uuid');

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationService],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should hash the password and save the user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpass',
        role: UserRole.Customer,
      };
      const hashedPassword = 'hashedPassword';
      const uuid = 'test-uuid';

      const signupUserResponse: SignUpUserResponseDto = {
        createdUserUuid: uuid,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (uuidv4 as jest.Mock).mockReturnValue(uuid);

      const result = await service.signUp(createUserDto);

      expect(result).toEqual(signupUserResponse);
      expect(bcrypt.hash).toHaveBeenCalledWith('testpass', 10);
      expect(service['users']).toHaveLength(1);
    });
  });
});
