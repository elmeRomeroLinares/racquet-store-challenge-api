import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Headers,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './enums/user-role.enum';
import { SignUpUserResponseDto } from './dto/signup-user-response.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { SignInUserResponse } from './dto/signin-user-response.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('signup')
  async signUp(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Headers('Store-Key') storeKey?: string,
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

  @Post('signin')
  async signIn(
    @Body(new ValidationPipe()) signInUserDto: SignInUserDto,
  ): Promise<SignInUserResponse> {
    const user = await this.authService.validateUser(signInUserDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.authService.createAccessToken(user.id);
    return { accessToken };
  }
}
