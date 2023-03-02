import { LRLanguage, LanguageSupport } from "@codemirror/language";
declare const AbsMacLanguage: LRLanguage;
declare const AbsMacCompletion: import("@codemirror/state").Extension;
declare function AbsMac(): LanguageSupport;
export { AbsMacLanguage, AbsMacCompletion, AbsMac };
