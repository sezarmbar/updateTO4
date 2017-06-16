import { UpdateprojectPage } from './app.po';

describe('updateproject App', () => {
  let page: UpdateprojectPage;

  beforeEach(() => {
    page = new UpdateprojectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
