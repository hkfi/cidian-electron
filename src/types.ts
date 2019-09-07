export interface IDictionaryItem {
  id: number; // id
  s: string; // simplified
  t: string; // traditional
  pn: string; // pinyin numeric
  pd: string; // pinyin diacritic
  d: string[]; // definition(s)
}

export interface IList {
  name: string;
  list: number[];
}

export interface ISidebarMenuItem {
  route: string; // eg. "/search"
  text: string; // eg. "Search"
  icon: string; // eg. "search"
}

export interface IBookmarksModuleState {
  bookmarksSearchInput: string;
  bookmarks: number[];
  lists: IList[];
  bookmarkedDictionaryItems: IDictionaryItem[];
  currentBookmarkedDictionaryItem: IDictionaryItem | null;
}

export interface ITranslatorModuleState {
  translatorInput: string;
  translatorDictionaryItems: IDictionaryItem[];
  translatorResults: (IDictionaryItem | string)[];
  currentTranslatorDictionaryItem: IDictionaryItem | null;
}
