import dotenv from 'dotenv';
import DB_PROPERTIES from '../cols.json';
import {
  ItemCategory,
  NotionPropTypesEnum,
  type NotionRichTextPropType,
  type NotionTitlePropType,
  type NotionFilesPropType,
  type NotionSelectPropType,
  type NotionDatePropType,
  type NotionMultiSelectPropType,
  type NotionNumberPropType,
  type NotionUrlPropType,
  type NotionColPropTypes,
} from './types';

dotenv.config();

export function getDataSourceId(category: ItemCategory): string {
  const databasesMap = {
    [ItemCategory.Movie]: process.env.NOTION_MOVIE_DATABASE_ID,
    [ItemCategory.Music]: process.env.NOTION_MUSIC_DATABASE_ID,
    [ItemCategory.Book]: process.env.NOTION_BOOK_DATABASE_ID,
    [ItemCategory.Game]: process.env.NOTION_GAME_DATABASE_ID,
    [ItemCategory.Drama]: process.env.NOTION_DRAMA_DATABASE_ID,
  };
  return databasesMap[category] as string;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function buildPropertyValue(value: any, type: NotionPropTypesEnum, key: string): NotionColPropTypes | undefined {
  switch (type) {
    case NotionPropTypesEnum.TITLE:
      return {
        type: NotionPropTypesEnum.TITLE,
        title: [{ text: { content: value } }],
      } as NotionTitlePropType;
    case NotionPropTypesEnum.FILES:
      return {
        type: NotionPropTypesEnum.FILES,
        files: [{ name: value, type: 'external', external: { url: value } }],
      } as NotionFilesPropType;
    case NotionPropTypesEnum.SELECT:
      return {
        type: NotionPropTypesEnum.SELECT,
        select: value ? { name: value.toString() } : null,
      } as NotionSelectPropType;
    case NotionPropTypesEnum.DATE:
      return {
        type: NotionPropTypesEnum.DATE,
        date: { start: value },
      } as NotionDatePropType;
    case NotionPropTypesEnum.MULTI_SELECT:
      const items = Array.isArray(value) ? value : (value ? [String(value)] : []);
      return {
        type: NotionPropTypesEnum.MULTI_SELECT,
        multi_select: items.map((g: string) => ({ name: g })),
      } as NotionMultiSelectPropType;
    case NotionPropTypesEnum.RICH_TEXT:
      return {
        type: NotionPropTypesEnum.RICH_TEXT,
        rich_text: [{ type: 'text', text: { content: value || '' } }],
      } as NotionRichTextPropType;
    case NotionPropTypesEnum.NUMBER:
      return {
        type: NotionPropTypesEnum.NUMBER,
        number: value ? Number(value) : null,
      } as NotionNumberPropType;
    case NotionPropTypesEnum.URL:
      return {
        type: NotionPropTypesEnum.URL,
        url: value,
      } as NotionUrlPropType;
    default:
      break;
  }
}
