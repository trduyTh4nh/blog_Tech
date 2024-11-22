import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "DUMA HOST EC2 ĐƯỢC RỒI PHÊ QUÁ 🥺!";
  }
}
