import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) throw new UnauthorizedException("Token missing");

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret && process.env.NODE_ENV === "production") {
        throw new UnauthorizedException("JWT_SECRET not configured");
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      request.user = {
        id: payload.sub,
        email: payload.email,
        orgId: payload.orgId,
        role: payload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
