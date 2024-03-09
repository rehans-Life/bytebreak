import { atom } from "jotai";
import { TagWithConfig } from "../app/interfaces";
import { Option } from "../app/components/select";

export const languageAtom = atom<Option<string> | undefined>(undefined);
export const languagesAtom = atom<TagWithConfig[]>([]);

export const selectLanguageAtom = atom(null, (get, set, lang: TagWithConfig, force: boolean = false) => {
    set(languageAtom, {
        label: lang.name,
        value: lang.slug
    });

    const codes = get(codeAtom)

    if(!(lang.slug in codes) || force){ 
        set(codeAtom, {...codes, [lang.slug]: lang.defaultConfiguration})
    }
})

export const codeAtom = atom<{[key: string]: string}>({})