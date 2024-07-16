import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './enums/user-role.enum';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('signup')
  async signUp(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Headers('Store-Key') storeKey?: string,
  ): Promise<SignupUserResponseDto> {
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
}
