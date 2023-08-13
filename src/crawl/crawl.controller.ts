import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CrawlService } from './crawl.service';

@Controller('stories')
export class CrawlController {
  constructor(private readonly crawlService: CrawlService) {}
  @Get('suggest')
  async getSuggest(): Promise<any> {
    return this.crawlService.getSuggestStory();
  }
  @Get('story/:detail')
  async getDetailStory(@Param('detail') detail: string) {
    return this.crawlService.getDetailStory(detail);
  }
  @Get('chapter/:chapter')
  async getChapter(@Param('chapter') chapter: string) {
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
  @Get('categories')
  async allCategory(): Promise<any> {
    return this.crawlService.getCategories();
  }
  @Post('category/:category/:param')
  async storyCategory(
    @Param('category') category: string,
    @Param('param') param: string,
    @Query('sheet') sheet: number,
    @Query('status') status: number,
    @Query('country') country: number,
    @Query('sort') sort: number,
  ) {
    return this.crawlService.storyCategory(category, {
      status,
      country,
      sort,
      sheet,
    });
  }
  @Get('author/:author')
  async authorStory(@Param('author') author: string) {
    return this.crawlService.authorStory(author);
  }
}
