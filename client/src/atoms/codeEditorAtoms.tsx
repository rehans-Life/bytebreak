import { Option } from "@/app/components/select";
import { ProblemConfig } from "@/app/create-problem/interfaces";
import generateCodeConfig from "@/utils/generateCodeConfig";
import { atom } from "jotai";
import { langs } from "lang-code-configuration/data";

export interface LangConfig {
    restrictedLines: number[],
    code: string
}

export const setRestrictedLines = (code: string) => {
    return code.split("\n").reduce<number[]>((acc, curr, i) => curr.trim().length ? [...acc, i + 1] : acc, []);
}

export const langAtom = atom<Option<langs> | undefined>(undefined);
export const codesAtom = atom<{ [key: string]: LangConfig }>({});

export const setLangAtom = atom(null, (get, set, option: Option<langs>, config: ProblemConfig) => {
    set(langAtom, option)

    const codesMap = get(codesAtom);

    if (!(option.value in codesMap)) {
        const code = generateCodeConfig(option.value as langs, config);
        const restrictedLines = setRestrictedLines(code);

        set(codesAtom, {
            ...codesMap,
            [option.value]: {
                code,
                restrictedLines
            }
        })
    }
});