import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = this.getRequest(context);

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    request["user"] = payload;

    if (requiredRoles && !requiredRoles.includes(payload.role)) {
      throw new UnauthorizedException("You do not have permission");
    }

    return true;
  }

  private getRequest(context: any) {
    // Handle GraphQL context
    if (context.getType() === "graphql") {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      return gqlContext.req;
    }
    // Handle HTTP requests
    return context.switchToHttp().getRequest();
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request?.headers?.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
