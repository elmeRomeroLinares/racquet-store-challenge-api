import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as dotenv from 'dotenv';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';

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
          },
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
      const result: SignupUserResponseDto = {
        createdUserUuid: 'test-uuid',
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
      const result: SignupUserResponseDto = {
        createdUserUuid: 'test-uuid',
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

    // it('should throw an error if extra data is provided', async () => {
    //   const createUserDto: any = {
    //     username: 'testuser',
    //     password: 'testpass',
    //     extraField: 'extra',
    //   };

    //   await expect(
    //     authenticationController.signUp(createUserDto, 'customer-key'),
    //   ).rejects.toThrow(BadRequestException);
    // });

    // it('should throw an error if incorrect data is provided', async () => {
    //   const createUserDto: any = { user: 'testuser', pass: 'testpass' };

    //   await expect(
    //     authenticationController.signUp(createUserDto, 'customer-key'),
    //   ).rejects.toThrow(BadRequestException);
    // });
  });
});
