import { Module } from '@nestjs/common';
import { CrawlModule } from './crawl/crawl.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CrawlModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
