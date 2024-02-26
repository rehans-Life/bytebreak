import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react"

const useShowMore = (): [
    boolean,
    Dispatch<SetStateAction<boolean>>,
    MutableRefObject<HTMLDivElement | null>] => {
    const showMoreState = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    function getChildrenHeight(children: NodeListOf<ChildNode>, heightType: "scrollHeight" | "clientHeight") {
        return Array.from(children).reduce((acc, curr) => acc += (curr as Element)[heightType], 0);
    }

    function setBtn(moreBtn: Element) {
        if (!containerRef.current) return;

        const scrollHeight = getChildrenHeight(containerRef.current.childNodes, "scrollHeight");
        const clientHeight = getChildrenHeight(containerRef.current.childNodes, "clientHeight");

        if (scrollHeight <= clientHeight) {
            moreBtn?.remove();
            return;
        }

        if (moreBtn && !containerRef.current.contains(moreBtn)) {
            containerRef.current.appendChild(moreBtn);
        }
    }

    useEffect(() => {
        if (!containerRef.current) return;

        const moreBtn = containerRef.current.querySelector("#more");

        if (!moreBtn) return;

        const observer = new MutationObserver(() => setBtn(moreBtn))

        observer.observe(containerRef.current, { childList: true })
        setBtn(moreBtn);
    }, []);

    return [...showMoreState, containerRef]
}

export default useShowMore;