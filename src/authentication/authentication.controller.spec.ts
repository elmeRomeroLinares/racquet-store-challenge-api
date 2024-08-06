import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as dotenv from 'dotenv';
import { SignUpUserResponseDto } from './dto/signup-user-response.dto';
import { UserRole } from './enums/user-role.enum';
import { User } from './entities/user.entity';
import { SignInUserDto } from './dto/signin-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '@src/cart/entities/cart.entity';
import { Order } from '@src/orders/entities/order.entity';
import { Product } from '@src/products/entities/product.entity';

dotenv.config();

describe('AuthenticationController', () => {
  let authenticationController: AuthenticationController;
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            signUp: jest.fn(),
            validateUser: jest.fn(),
            createAccessToken: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Cart),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    authenticationController = module.get<AuthenticationController>(
      AuthenticationController,
    );
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
  });

  it('should be defined', () => {
    expect(authenticationController).toBeDefined();
  });

  describe('signUp', () => {
    it('should sign up a user as Admin if Store-Key matches', async () => {
      const result: SignUpUserResponseDto = {
        createdUserUuid: 'test-uuid',
        role: UserRole.Admin,
      };
      jest.spyOn(authenticationService, 'signUp').mockResolvedValue(result);

      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpass',
      };
      expect(
        await authenticationController.signUp(
          createUserDto,
          'RavnRagnarok205!',
        ),
      ).toBe(result);
    });

    it('should sign up a user as Customer if Store-Key is not provided', async () => {
      const result: SignUpUserResponseDto = {
        createdUserUuid: 'test-uuid',
        role: UserRole.Customer,
      };
      jest.spyOn(authenticationService, 'signUp').mockResolvedValue(result);

      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpass',
      };
      expect(await authenticationController.signUp(createUserDto)).toBe(result);
    });

    it('should throw an error if an invalid Store-Key is provided', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpass',
      };

      await expect(
        authenticationController.signUp(createUserDto, 'wrong-key'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const signInUserDto: SignInUserDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      const user: User = {
        id: '1',
        username: 'testuser',
        password: 'hashedpassword',
        role: UserRole.Customer,
        createdAt: new Date(),
        cart: null,
        orders: [],
        likedProducts: [],
      };

      jest.spyOn(authenticationService, 'validateUser').mockResolvedValue(user);
      jest
        .spyOn(authenticationService, 'createAccessToken')
        .mockResolvedValue('access_token');

      const result = await authenticationController.signIn(signInUserDto);

      expect(result).toEqual({ accessToken: 'access_token' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const signInUserDto: SignInUserDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      jest.spyOn(authenticationService, 'validateUser').mockResolvedValue(null);

      await expect(
        authenticationController.signIn(signInUserDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
