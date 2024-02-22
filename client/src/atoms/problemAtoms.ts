import { Problem } from "@/app/create-problem/interfaces";
import { ProblemStatus } from "@/app/interfaces";
import { atom } from "jotai";

export const problemAtom = atom<Problem | null>(null);
export const hasLikedAtom = atom<boolean>(false);
export const submissionStatusAtom = atom<ProblemStatus | null>(null);
