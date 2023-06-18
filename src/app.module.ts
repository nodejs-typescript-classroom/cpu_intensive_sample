import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FourWorkerCreateService } from './four-worker.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FourWorkerCreateService],
})
export class AppModule {}
