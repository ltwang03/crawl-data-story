import { Module } from '@nestjs/common';
import { CrawlController } from './crawl.controller';
import { CrawlService } from './crawl.service';
import { PuppeteerModule } from 'nest-puppeteer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PuppeteerModule.forRoot({})],
  controllers: [CrawlController],
  providers: [CrawlService, ConfigService],
})
export class CrawlModule {}
