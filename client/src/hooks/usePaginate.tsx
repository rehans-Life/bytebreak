import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const usePaginate = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const setQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            router.push(pathname + "?" + params.toString());

            return params.toString();
        },
        [searchParams],
    )

    const nextPage = () => {
        const currPage = searchParams.get("page") || "1";
        setQueryString("page", (Number(currPage) + 1).toString());
    }

    const previousPage = () => {
        if (!searchParams.has("page") || searchParams.get("page") === "1")
            return;

        setQueryString("page", (Number(searchParams.get("page")) - 1).toString());
    }

    const setPage = (value: number) => {
        setQueryString("page", value.toString());
    }

    const setPerPageLimit = (value: number) => {
        setQueryString("perPage", value.toString());
    }

    const setField = (name: string, value: any) => {
        const params = new URLSearchParams(searchParams);
        params.delete(name);

        if (value instanceof Array) {
            const queryArr = value.map((val) => `${name}=${val}`).join("&");
            router.push(pathname + "?" + params.toString() + "&" + queryArr)
            return;
        }

        if (value !== null && typeof value === 'object') {
            const queryStr = Object.entries(value).map(([key, value]) => {
                return `${name}[${key}]=${value}`
            }).join("&");
            router.push(pathname + "?" + params.toString() + "&" + queryStr)
            return;
        }

        setQueryString(name, value);
    }

    const deleteField = (name: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(name);

        router.push(pathname + "?" + params.toString());

        return params.toString();
    }

    return {
        searchParams, previousPage, setPage, nextPage, setPerPageLimit, setField, deleteField
    }

}

export default usePaginate;