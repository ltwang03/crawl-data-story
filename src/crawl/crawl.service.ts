import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser, Page } from 'puppeteer';

@Injectable()
export class CrawlService {
  constructor(
    @InjectBrowser() private readonly browser: Browser,
    private configService: ConfigService,
  ) {}
  logger = new Logger(CrawlService.name);
  async getSuggestStory() {
    const page: Page = await this.browser.newPage();
    await page.goto(this.configService.get('END_POINT'));
    //root dom
    const stories = await page.$$('#list_suggest>li');
    const result = [];
    for (const story of stories) {
      await page.waitForSelector('#list_suggest li');
      const bookInfo = await story.$('.book_info');
      const title = await bookInfo.$eval(
        '.book_name>h3>a',
        (el) => el.textContent,
      );
      // wait for loading tag
      //get thumbnail
      const thumb = await story.$eval('.book_avatar>a>img', (el) =>
        el.getAttribute('src'),
      );

      const lastChapter = await bookInfo.$eval(
        '.last_chapter>a',
        (el) => el.textContent,
      );
      const host = this.configService.getOrThrow('HOST');
      const hrefStory = await story.$eval('.book_avatar>a', (el) =>
        el.getAttribute('href'),
      );
      const changeHref = hrefStory.replace(
        `${this.configService.get('END_POINT')}truyen-tranh/`,
        `${host}api/stories/story/`,
      );
      result.push({
        title,
        thumb,
        lastChapter,
        href: changeHref,
      });
    }

    return result;
  }
  async getDetailStory(detail) {
    const HOST = this.configService.get('HOST');
    const END_POINT = this.configService.get('END_POINT');
    const page: Page = await this.browser.newPage();
    await page.goto(`${END_POINT}truyen-tranh/${detail}`);

    const book_detail = await page.$('.book_detail');
    const book_info = await book_detail.$('.book_info');

    const result = [];
    const list_chapter = [];
    const categories = [];
    //get avatar
    const avatar = await book_info.$eval('.book_avatar>img', (el) =>
      el.getAttribute('src'),
    );
    //get title
    const title = await book_info.$eval(
      '.book_other>h1',
      (el) => el.textContent,
    );
    // get author
    await page.waitForSelector('.org');
    const authors = await page.$$eval(
      '.org',
      (options, { HOST, END_POINT }) => {
        return options.map((el) => {
          const link = el.getAttribute('href');
          const changeHref = link.replace(
            `${END_POINT}tac-gia/`,
            `${HOST}api/stories/author/`,
          );
          return { author: el.textContent, href: changeHref };
        });
      },
      { HOST, END_POINT },
    );
    // get cotegories
    const types = await book_info.$$('.book_other>.list01>.li03');
    for (const ele of types) {
      const type = await ele.$eval('a', (el) => el.textContent);
      categories.push(type);
    }
    //get description
    const descriptionElement = await page.$('.detail-content>p');
    const description = descriptionElement
      ? await descriptionElement.evaluate((el) => el.textContent)
      : '';
    //get chapter
    const chapters = await page.$$('.works-chapter-item');
    for (const el of chapters) {
      await page.waitForSelector('.name-chap');

      const chapter = await el.$eval('.name-chap>a', (el) => el.textContent);
      const link = await el.$eval(
        '.name-chap>a',
        (el, { HOST, END_POINT }) => {
          return el.href.replace(
            `${END_POINT}truyen-tranh/`,
            `${HOST}api/stories/chapter/`,
          );
        },
        { HOST, END_POINT },
      );
      list_chapter.push({ chapter, link });
    }

    result.push({
      avatar,
      title,
      categories,
      authors,
      description,
      list_chapter,
    });
    return result[0];
  }
  async getChapter(chapter) {
    const HOST = this.configService.get('HOST');
    const END_POINT = this.configService.get('END_POINT');
    const page = await this.browser.newPage();
    await page.goto(`${END_POINT}truyen-tranh/${chapter}`);
    const imageChapter = await page.$$eval(
      '.page-chapter>.lazy',
      (options: HTMLInputElement[]) => {
        return options.map((el) => {
          return el.getAttribute('src');
        });
      },
    );
    const chapter_control = await page.$$eval(
      '.chapter-control:last-child>div:last-child>a',
      (options, { HOST, END_POINT }) => {
        return options.map((el) => {
          const href = el.getAttribute('href');
          return href.replace(
            `${END_POINT}truyen-tranh/`,
            `${HOST}api/stories/chapter/`,
          );
        });
      },
      { HOST, END_POINT },
    );

    return {
      image: imageChapter,
      chapter_control,
    };
  }
  async searchStory(story) {
    const HOST = this.configService.get('HOST');
    const END_POINT = this.configService.get('END_POINT');
    const page: Page = await this.browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );
    await page.goto(`${END_POINT}tim-kiem.html?q=${story}`);
    const [avatarList, linkList] = await Promise.all([
      page.$$eval('.book_avatar>a>img', (options) => {
        return options.map((el) => {
          const avatar = el.getAttribute('src');
          const name = el.getAttribute('alt');
          return { avatar, name };
        });
      }),
      page.$$eval('.book_avatar>a', (options) => {
        return options.map((el) => {
          const link = el.getAttribute('href');
          return { link };
        });
      }),
    ]);

    return avatarList.map((item, index) => {
      return {
        avatar: item.avatar,
        name: item.name,
        link: linkList[index].link.replace(
          `${END_POINT}truyen-tranh/`,
          `${HOST}api/stories/story/`,
        ),
      };
    });
  }
  async newStory(query) {
    const HOST = this.configService.get('HOST');
    const END_POINT = this.configService.get('END_POINT');
    const page: Page = await this.browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );
    await page.goto(`${END_POINT}truyen-moi-cap-nhat/trang-${query}.html`);
    const [avatarList, nameList, last_chapter] = await Promise.all([
      page.$$eval('.book_avatar>a>img', (options) => {
        return options.map((el) => {
          const avatar = el.getAttribute('src');
          return { avatar };
        });
      }),
      page.$$eval('.book_info>.book_name>h3>a', (options) => {
        return options.map((el) => {
          const name = el.textContent;
          const link = el.href;
          return { name, link };
        });
      }),
      page.$$eval('.last_chapter>a', (options) => {
        return options.map((el) => {
          const last_chapter = el.textContent;
          return { last_chapter };
        });
      }),
    ]);
    return avatarList.map((item, index) => {
      return {
        avatar: item.avatar,
        story_name: nameList[index].name,
        story_detail: nameList[index].link.replace(
          `${END_POINT}truyen-tranh/`,
          `${HOST}api/stories/story/`,
        ),
        last_chap: last_chapter[index].last_chapter,
      };
    });
  }
  async getCategories(): Promise<any> {
    const HOST = this.configService.get('HOST');
    const END_POINT = this.configService.get('END_POINT');
    const page: Page = await this.browser.newPage();
    await page.goto(END_POINT);
    const book_tags_content = await page.$$('.book_tags_content');
    const [categories] = await Promise.all([
      book_tags_content[0].$$eval('p>a', (options) => {
        return options.map((el) => {
          const content: string = el.textContent;
          const link: string = el.href;
          return { content, link };
        });
      }),
    ]);
    return categories.map((values) => {
      const linkOffical = values.link.replace(
        `${END_POINT}the-loai`,
        `${HOST}api/stories/category`,
      );
      const replaceLink = linkOffical.replace('.html', '/trang-1.html');
      return {
        content: values.content,
        link: replaceLink,
      };
    });
  }
  async storyCategory(
    category,
    { status, country, sort, sheet },
  ): Promise<any> {
    const HOST = this.configService.get('HOST');
    const END_POINT = this.configService.get('END_POINT');
    const page: Page = await this.browser.newPage();
    await page.goto(
      `${END_POINT}the-loai/${category}/trang-${sheet}.html?status=${status}&country=${country}&sort=${sort}`,
    );
    const [avatarList, nameList, last_chapter] = await Promise.all([
      page.$$eval('.book_avatar>a>img', (options) => {
        return options.map((el) => {
          const avatar = el.getAttribute('src');
          return { avatar };
        });
      }),
      page.$$eval('.book_info>.book_name>h3>a', (options) => {
        return options.map((el) => {
          const name = el.textContent;
          const link = el.href;
          return { name, link };
        });
      }),
      page.$$eval('.last_chapter>a', (options) => {
        return options.map((el) => {
          const last_chapter = el.textContent;
          return { last_chapter };
        });
      }),
    ]);
    return avatarList.map((item, index) => {
      return {
        avatar: item.avatar,
        story_name: nameList[index].name,
        story_detail: nameList[index].link.replace(
          `${END_POINT}truyen-tranh/`,
          `${HOST}api/stories/story/`,
        ),
        last_chap: last_chapter[index].last_chapter,
      };
    });
  }
  async authorStory(author) {
    const HOST = this.configService.get('HOST');
    const END_POINT = this.configService.get('END_POINT');
    const page: Page = await this.browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );
    await page.goto(`${END_POINT}tac-gia/${author}`);

    const [avatarList, nameList, last_chapter] = await Promise.all([
      page.$$eval('.book_avatar>a>img', (options) => {
        return options.map((el) => {
          const avatar = el.getAttribute('src');
          return { avatar };
        });
      }),
      page.$$eval('.book_info>.book_name>h3>a', (options) => {
        return options.map((el) => {
          const name = el.textContent;
          const link = el.href;
          return { name, link };
        });
      }),
      page.$$eval('.last_chapter>a', (options) => {
        return options.map((el) => {
          const last_chapter = el.textContent;
          return { last_chapter };
        });
      }),
    ]);
    return avatarList.map((item, index) => {
      return {
        avatar: item.avatar,
        story_name: nameList[index].name,
        story_detail: nameList[index].link.replace(
          `${END_POINT}truyen-tranh/`,
          `${HOST}api/stories/story/`,
        ),
        last_chap: last_chapter[index].last_chapter,
      };
    });
  }
}
