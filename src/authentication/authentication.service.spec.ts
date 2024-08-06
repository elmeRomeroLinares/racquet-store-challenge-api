import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUpUserResponseDto } from './dto/signup-user-response.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { ConflictException } from '@nestjs/common';
import { UserRole } from './enums/user-role.enum';
import * as bcrypt from 'bcryptjs';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should create a new user and return the user UUID and role', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        role: UserRole.Customer,
      };
      const hashedPassword = (await bcrypt.hash(
        createUserDto.password,
        10,
      )) as string;
      const savedUser: User = {
        id: '1',
        username: createUserDto.username,
        password: hashedPassword,
        role: createUserDto.role,
        createdAt: new Date(),
        cart: null,
        orders: [],
        likedProducts: [],
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(savedUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

      const result: SignUpUserResponseDto = await service.signUp(createUserDto);

      expect(result).toEqual({ createdUserUuid: '1', role: UserRole.Customer });
    });

    it('should throw a ConflictException if username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        role: UserRole.Customer,
      };

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(createUserDto as User);

      await expect(service.signUp(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return the user if credentials are valid', async () => {
      const signInUserDto: SignInUserDto = {
        username: 'testuser',
        password: 'testpassword',
      };
      const hashedPassword = await bcrypt.hash(signInUserDto.password, 10);
      const user: User = {
        id: '1',
        username: 'testuser',
        password: hashedPassword,
        role: UserRole.Customer,
        createdAt: new Date(),
        cart: null,
        orders: [],
        likedProducts: [],
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(signInUserDto);

      expect(result).toEqual(user);
    });

    it('should return null if credentials are invalid', async () => {
      const signInUserDto: SignInUserDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser(signInUserDto);

      expect(result).toBeNull();
    });
  });

  describe('createAccessToken', () => {
    it('should return a JWT token', async () => {
      const userId = '1';
      const userRole = UserRole.Customer;

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token');

      const result = await service.createAccessToken(userId, userRole);

      expect(result).toBe('jwt_token');
    });
  });
});
