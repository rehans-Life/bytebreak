import { IUser, userAtom } from "@/atoms/userAtom";
import { getMe } from "@/utils/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAtom, } from "jotai";

const useUser = () => {
    const [user, setUser] = useAtom(userAtom);


    const { } = useSuspenseQuery({
        meta: {
            onSuccess: (user: false | IUser) => {
                if (user) setUser(user)
            }
        },
        queryKey: ['user'],
        queryFn: getMe,
    })


    return [user, setUser] as const;
}

export default useUser;