import { Like } from '@/app/interfaces';
import { hasLikedAtom, problemAtom } from '@/atoms/problemAtoms';
import { getLike, likeDoc, unlikeDoc } from '@/utils/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import React from 'react'
import { AiOutlineLike } from "@react-icons/all-files/ai/AiOutlineLike";
import { AiFillLike } from "@react-icons/all-files/ai/AiFillLike";
import { BsChat } from "@react-icons/all-files/bs/BsChat";
import { FaRegStar } from "@react-icons/all-files/fa/FaRegStar";
import { RiShareBoxLine } from "@react-icons/all-files/ri/RiShareBoxLine";
import { FaRegQuestionCircle } from "@react-icons/all-files/fa/FaRegQuestionCircle";
import FormatNumber from '@/app/components/formatNumber';
import Tooltip from "../../../components/tooltip";
import VertDivider from "../../../components/vert-divider";
import { userAtom } from '@/atoms/userAtom';
import { showSignInToast } from '@/toasts/signInReminder';

export default function LeftFooter({
    problemId
}: { problemId: string }) {

    const user = useAtomValue(userAtom);
    const [problem, setProblem] = useAtom(problemAtom);
    const [hasLiked, setHasLiked] = useAtom(hasLikedAtom);

    const isLiked = useQuery({
        meta: {
            onSuccess: (_: Like) => {
                setHasLiked(true);
            }
        },
        retry: false,
        throwOnError: false,
        queryKey: ['problems', problemId, 'like'],
        queryFn: getLike,
    })

    const like = useMutation({
        onMutate() {
            return {
                errorMsg: "An Error when liking the problem please try again"
            }
        },
        meta: {
            onSuccess: (_: boolean) => {
                if (!problem) return;
                setProblem({
                    ...problem,
                    likes: problem.likes + 1,
                });
                setHasLiked(true);
            }
        },
        mutationFn: likeDoc,
    })

    const unLike = useMutation({
        onMutate() {
            return {
                errorMsg: "An Error when unliking the problem please try again"
            }
        },
        meta: {
            onSuccess: (_: boolean) => {
                if (!problem) return;
                setProblem({
                    ...problem,
                    likes: problem.likes - 1,
                });
                setHasLiked(false);
            }
        },
        mutationFn: unlikeDoc,
    })

    return (
        <div className='flex items-center gap-x-3 gap-y-2'>
            <div className='flex items-center gap-x-3'>
                <button
                    disabled={like.isPending || unLike.isPending || isLiked.isFetching} onClick={() => {
                        if (!user) {
                            showSignInToast('Sign in to like or dislike this problem')
                            return;
                        }

                        if (hasLiked) {
                            unLike.mutate({ id: problem?._id || "", resource: "problems" })
                            return;
                        }
                        like.mutate({ id: problem?._id || "", resource: "problems" })
                    }}
                    className="text-dark-label-1 py-1 px-2 rounded-lg font-medium flex justify-center text-sm items-center gap-x-2.5 bg-dark-fill-2 hover:bg-dark-fill-3"
                    type="button">
                    {hasLiked ? <div className='text-dark-green-s'><AiFillLike /></div> : <AiOutlineLike />}<FormatNumber num={problem?.likes || 0}></FormatNumber>
                </button>
                <button type='button' className='text-dark-label-1 py-1 px-2 rounded-lg flex items-center gap-x-2 font-medium text-sm hover:bg-dark-fill-2'>
                    <BsChat />
                    {256}
                </button>
            </div>
            <VertDivider />
            <div className='flex items-center gap-x-2 text-dark-label-1'>
                <Tooltip message='Star' children={
                    <div className=' hover:bg-dark-fill-2 py-1.5 px-1.5 rounded-md'>
                        <FaRegStar />
                    </div>
                }></Tooltip>
                <Tooltip message='Share' children={
                    <div className=' hover:bg-dark-fill-2 py-1.5 px-1.5 rounded-md'>
                        <RiShareBoxLine />
                    </div>
                }></Tooltip>
                <Tooltip message='Feedback' children={
                    <div className=' hover:bg-dark-fill-2 py-1.5 px-1.5 rounded-md'>
                        <FaRegQuestionCircle />
                    </div>
                }></Tooltip>
            </div>
        </div>
    )
}
