import z from 'zod';
import { OptionSchema } from '../../create-problem/schemas';
import { Option } from '@/app/components/select';

const CodeScehma = z.object({
    code: z.string(),
})

export type CodeType = {
    code: string,
}