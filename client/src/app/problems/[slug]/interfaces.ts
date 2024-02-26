import z from 'zod';

export type CodeType = {
    code: string,
}

export const TestCasesSchema = z.object({
    testcases: z.array(z.object({
        input: z.record(z.number(), z.string()),
        output: z.string()
    }))
});

export type FormTestCaseType = {
    input: {
        [key: number]: string
    },
    output: string
}

export type TestCasesType = {
    testcases: FormTestCaseType[]
}

