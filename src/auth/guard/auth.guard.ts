import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);

    console.log("DEBUG REQUEST: ", request);
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request["user"] = payload;
    } catch (err) {
      throw new UnauthorizedException("Invalid token");
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
    console.log("DEBUG HEADER: ", request);
    const [type, token] = request?.headers?.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
