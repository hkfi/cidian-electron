export interface IDictionaryItem {
  id: number; // id
  s: string; // simplified
  t: string; // traditional
  pn: string; // pinyin numeric
  pd: string; // pinyin diacritic
  d: string[]; // definition(s)
}

export interface ISidebarMenuItem {
  route: string; // eg. "/search"
  text: string; // eg. "Search"
}

export interface IBookmarksModuleState {
  bookmarksSearchInput: string;
  bookmarks: number[];
  bookmarkedDictionaryItems: IDictionaryItem[];
  currentBookmarkedDictionaryItem: IDictionaryItem | null;
}
