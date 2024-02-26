import { Option } from "@/app/components/select";
import { Problem } from "@/app/create-problem/interfaces";
import { ProblemStatus } from "@/app/interfaces";
import { fontSizes, tabSpaces } from "@/app/problems/[slug]/components/header";
import { atom } from "jotai";

export const problemAtom = atom<Problem | null>(null);
export const hasLikedAtom = atom<boolean>(false);
export const submissionStatusAtom = atom<ProblemStatus | null>(null);

export const fontSizeAtom = atom<Option<number>>(fontSizes[1]);
export const tabSpaceAtom = atom<Option<number>>(tabSpaces[0]);