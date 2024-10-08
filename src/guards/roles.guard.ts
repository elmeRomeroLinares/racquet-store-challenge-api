import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../authentication/enums/user-role.enum';
import { JWTPayload } from '@src/authentication/dto/jwt-payload.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JWTPayload;

    if (!user) {
      return false;
    }

    const userRole = user.role as UserRole;
    const hasAccess = roles.includes(userRole);
    return hasAccess;
  }
}
