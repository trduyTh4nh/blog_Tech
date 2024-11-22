import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("/hello")
  sayHi() {
    return {
      message: "HOSTED SERVER SUCCESSFULLY 💗🍵🔥!",
      message2: "Thêm 1 message để test nè",
    };
  }
}
