import { Problem } from "@/app/create-problem/interfaces";
import { atom } from "jotai";

export const problemAtom = atom<Problem | null>(null);