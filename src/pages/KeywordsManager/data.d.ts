export interface KeywordsRule {
  _id: string;
  name: string;
  disabled: bool;
  keywords: string[];
  recall: bool;
  mute_time: number;
  unmute_list: number[];
  suitable_group: number[];
}
