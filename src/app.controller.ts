import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  nonBlockRoute(): string {
    return this.appService.nonBlocking();
  }

  @Get('/blocking-route')
  async blockingRoute() {
    return await this.appService.blocking();
  }
}
