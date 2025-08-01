import {z} from 'zod';

export const checkbody = z.object({
    item: z.string().min(3),
    quantity: z.number().min(1).max(10)
})