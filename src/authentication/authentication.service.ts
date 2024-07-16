import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';

@Injectable()
export class AuthenticationService {
  private users = []; // This should be replaced with a database connection

  async signUp(createUserDto: CreateUserDto): Promise<SignupUserResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = {
      id: uuidv4(),
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role,
      likedProducts: [],
      createdAt: new Date(),
    };
    this.users.push(user);
    return { createdUserUuid: user.id };
  }
}
