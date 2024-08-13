import {
  ForbiddenException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../enums/user-role.enum';
import { SignUpUserResponseDto } from '../dto/signup-user-response.dto';
import { SignInUserDto } from '../dto/signin-user.dto';
import { SignInUserResponse } from '../dto/signin-user-response.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { RolesGuard } from '@src/guards/roles.guard';
import { JwtAuthenticationGuard } from '../jwt/jwt-authentication.guard';
import { Roles } from '@src/decorators/roles.decorator';

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authService: AuthenticationService) {}

  @Mutation(() => SignUpUserResponseDto)
  async signUp(
    @Args('createUserInput') createUserDto: CreateUserDto,
    @Args('storeKey', { nullable: true }) storeKey?: string,
  ): Promise<SignUpUserResponseDto> {
    const adminStoreKey = process.env.ADMIN_STORE_KEY;

    if (storeKey) {
      if (storeKey === adminStoreKey) {
        createUserDto.role = UserRole.Admin;
      } else {
        throw new ForbiddenException('Invalid store key provided');
      }
    } else {
      createUserDto.role = UserRole.Customer;
    }

    return this.authService.signUp(createUserDto);
  }

  @Query(() => [User])
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async getUsers(): Promise<User[]> {
    return await this.authService.getUsers();
  }

  @Mutation(() => SignInUserResponse)
  async signIn(
    @Args('signInUserInput') signInUserDto: SignInUserDto,
  ): Promise<SignInUserResponse> {
    const user = await this.authService.validateUser(signInUserDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.authService.createAccessToken(
      user.id,
      user.role,
    );
    return { accessToken };
  }
}
