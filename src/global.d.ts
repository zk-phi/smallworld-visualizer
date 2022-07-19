// package @types/wanakana is NOT up-to-date, so hand-declare here
declare module "wanakana" {
  type WanakanaOptions = {
    convertLongVowelMark?: boolean;
  };
  export const toHiragana: (str: string, options: WanakanaOptions) => string;
}
