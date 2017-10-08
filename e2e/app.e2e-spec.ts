import { BasicCodePage } from './app.po';

describe('basic-code App', () => {
  let page: BasicCodePage;

  beforeEach(() => {
    page = new BasicCodePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
