import TestCase, { testcaseSchema } from "../models/TestCase";
import AppError from "../utils/appError";
import { applyType } from "../utils/applyType";
import z from 'zod';
import Problem from "../models/Problem";
import { batchSubmission } from "./judge0Controller";
import Submission from "../models/Submission";
import { getAll, getOne } from "./handlerFactory";
import catchAsync from "../utils/catchAsync";
import mongoose from "mongoose";

const testCasesSchema = z.array(testcaseSchema)

const SubmitBodySchema = z.object({
    code: z.string(),
    languageId: z.number(),
    problemId: z.string(),    
})

const RunBodySchema = SubmitBodySchema.extend({
    testcases: testCasesSchema
})

export const run = applyType(
        RunBodySchema, 
        async (req, res, next) => {
            const { languageId, code, testcases, problemId } = req.body;
            const problem = await Problem.findById(problemId).select("config solution");

            if(!problem) throw new AppError("No problem found associated with the given execution", 404);
            
            const executedSubmissions = await batchSubmission(problem.solution.code, problem.solution.languageId, problem.config, testcases);

            for (let i = 0; i < executedSubmissions.length; i++) {
                const submission = executedSubmissions[i];
                const testcase = testcases[i];

                if(submission.status.id === 4) {
                    return res.status(409).json({
                        status: "fail",
                        testcaseNo: i,
                        testcase,
                        message: 'Solution does not exist for the given testcase'
                    })
                }

                if(submission.status.id >= 5) {
                    return res.status(409).json({
                        status: "fail",
                        testcaseNo: i,
                        testcase,
                        message: submission.stderr || submission.compile_output
                    })
                }
            }

            const executedUserSubmissions = await batchSubmission(code, languageId, problem.config, testcases);
            
            for (let i = 0; i < executedUserSubmissions.length; i++) {
                const submission = executedUserSubmissions[i];
                
                if(submission.status.id >= 5) {
                    throw new AppError(submission.stderr || submission.compile_output || "Please fix your code and run again", 417)
                }

            }

            return res.status(200).json({
                status: "success",
                data: {
                    submissions: executedUserSubmissions,
                }
            })
            
        }
    )

export const submit = applyType(
    SubmitBodySchema,
    async (req, res) => {
       const { code, languageId, problemId } = req.body;
       const problem = await Problem.findById(problemId)

       if(!problem) throw new AppError("No problem found associated with the given execution", 404);

        const testcases = await TestCase.find({
            problem: problem._id
        })

        const submissions = await batchSubmission(code, languageId, problem.config, testcases)

        let testCasesPassed = 0;
        let submission
        let memory = 0;
        let runtime = 0;
        let error: string | null = null;
        const submissionsLength = submissions.length

        for (var i = 0; i < submissions.length; i++) {
            submission = submissions[i];

            if(submission.status.id === 3) {
                memory += submission.memory
                runtime += parseFloat(submission.time)
                testCasesPassed += 1
                continue
            }
            error = submission.stderr || submission.compile_output; 
            break
        }

        const submissionDoc = await Submission.create({
            language: languageId,
            problem: problemId,
            user: req.user._id,
            code,
            status: submission!.status.description,
            testCasesPassed,
            error,
            lastExecutedTestcase: submission!.status.id !== 3 ?  testcases[i]._id : null,
            memory: submission!.status.id !== 3 ? 'N/A' : `${((memory / 1000) / submissionsLength).toFixed(1)} MB`,
            runtime: submission?.status.id !== 3 ? 'N/A' : `${Math.round((runtime * 1000) / submissionsLength)} ms`,
        }) 

        return res.status(201).json({
            status:"success",
            data: {
                submission: submissionDoc
            }
        })
    }
);

export const getSubmissionStatus = catchAsync(async (req, res, next) => {
    const problemId = req.params.id;
    const userId = req.user._id;

    const submissions = await Submission.find({
        $and: [
            { user: userId },
            { problem: new mongoose.Types.ObjectId(problemId) } 
        ]
    });

    let status: 'todo' | 'attempted' | 'solved' = !submissions.length ? "todo" : "attempted";

    function helper(i = 0) {
        if(i === submissions.length || status === 'solved') return;

        const submission = submissions[i];

        if(submission.status === 'Accepted') {
            status = 'solved';
            return;
        }

        helper(i+1);
    }

    helper();

    return res.status(200).json({
        status: "success",
        data: {
            status
        }
    })
})

export const getSubmissions = getAll(Submission, [
    {
        path: "language",
    }, 
    { 
        path: "lastExecutedTestcase" 
    }
])

export const getSubmission = getOne(Submission, [
    {
        path: "language",
    }, 
    { 
        path: "lastExecutedTestcase" 
    }
])