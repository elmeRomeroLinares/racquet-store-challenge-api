import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUpUserResponseDto } from './dto/signup-user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './enums/user-role.enum';
import { JWTPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<SignUpUserResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const newUser = await this.usersRepository.save(user);
    return { createdUserUuid: newUser.id, role: newUser.role };
  }

  async validateUser(signInUserDto: SignInUserDto): Promise<User | null> {
    const username = signInUserDto.username;
    const password = signInUserDto.password;
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async createAccessToken(userId: string, userRole: UserRole): Promise<string> {
    const payload: JWTPayload = { sub: userId, role: userRole };
    return this.jwtService.sign(payload);
  }
}
