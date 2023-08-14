import { Page } from 'puppeteer';

export class CrawlUtil {
  async getDataStory(page: Page, HOST, END_POINT): Promise<any> {
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
