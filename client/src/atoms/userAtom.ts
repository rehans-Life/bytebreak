import { atom } from "jotai";

interface User {
    "username": string,
    "email": string,
    "role": 'admin'  | 'user',
    "photo": string,
    "_id": string,
}

export const userAtom = atom<User>({
    _id: "65c0d2d653bad783b5dc41bc",
    username: "rehdfgdfrreran",
    email: "rehantosiererf4@gmail.com",
    role: "user",
    photo: "https://firebasestorage.googleapis.com/v0/b/tesla-clone-a0f5d.appspot.com/o/avatars%2Fdefault.jpg?alt=media&token=0aa62cc6-2260-4ce6-a595-4ae5f809dad3",
});