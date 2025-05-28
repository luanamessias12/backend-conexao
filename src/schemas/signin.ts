import { z } from "zod";

export const signinSchema = z.object({

  email: z
    .string({ required_error: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' }),

  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(4, { message: 'Precisa ter 4 ou mais caracteres' }),
});
