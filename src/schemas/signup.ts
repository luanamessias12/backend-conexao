import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, { message: 'Precisa ter 2 ou mais caracteres' }),

  email: z
    .string({ required_error: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' }),

  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(4, { message: 'Precisa ter 4 ou mais caracteres' }),
});
