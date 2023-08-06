import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CrawlService } from './crawl.service';

@Controller('stories')
export class CrawlController {
  constructor(private readonly crawlService: CrawlService) {}
  @Get('suggest')
  async getSuggest() {
    return this.crawlService.getSuggestStory();
  }
  @Get(':detail')
  async getDetailStory(@Param('detail') detail) {
    return this.crawlService.getDetailStory(detail);
  }
  @Get('chapter/:chapter')
  async getChapter(@Param('chapter') chapter) {
    return this.crawlService.getChapter(chapter);
  }
  @Post('search')
  async searchStory(@Query('q') story: string) {
    return this.crawlService.searchStory(story);
  }
  @Post('new')
  async newStory(@Query('page') page: number) {
    return this.crawlService.newStory(page);
  }
}
