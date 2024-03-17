import React from 'react'
import SignIn from './signIn';

export interface GoogleUser {
    email: string,
    name: string,
    picture: string,
    userId: string

}

export default async function Page() {

    return <SignIn />
}
