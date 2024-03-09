import { atom } from "jotai";


export interface IUser {
    username: string,
    email: string,
    role: 'admin'  | 'user',
    photo: string,
    _id: string,
}

export interface UserInfo extends IUser {
    solvedByLang: {
        language: string,
        solved: number
    }[]
}

export interface IGoogleUser {
    username: string,
    email: string,
    userId: string,
    photo: string,
}

export const userAtom = atom<IUser | undefined>(undefined)
export const googleUserAtom = atom<IGoogleUser | undefined>(undefined);