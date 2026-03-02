import { z } from 'zod';

// ─── Create ──────────────────────────────────────────────────────────────────
// z.coerce convierte strings → número/fecha automáticamente,
// lo que es común cuando los datos vienen de formularios HTML o JSON loosely typed.
export const CreateTransactionSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: 'amount debe ser un número' })
    .positive({ message: 'amount debe ser mayor a 0' }),

  date: z.coerce
    .date({ invalid_type_error: 'Fecha inválida' })
    .optional(),

  description: z.string().optional(),

  typeId: z.coerce
    .number({ invalid_type_error: 'typeId debe ser un número' })
    .int({ message: 'typeId debe ser un entero' }),

  categoryId: z.coerce
    .number({ invalid_type_error: 'categoryId debe ser un número' })
    .int({ message: 'categoryId debe ser un entero' })
    .optional(),

  documentId: z
    .string({ required_error: 'documentId es obligatorio' })
    .min(1, { message: 'documentId no puede estar vacío' }),
});

// El tipo TypeScript se infiere AUTOMÁTICAMENTE del schema — nunca los desincronizas.
export type CreateTransactionDTO = z.infer<typeof CreateTransactionSchema>;

// ─── Update ──────────────────────────────────────────────────────────────────
// Todos los campos son opcionales en un PATCH, pero al menos uno debe estar presente.
export const UpdateTransactionSchema = z
  .object({
    amount: z.coerce
      .number({ invalid_type_error: 'amount debe ser un número' })
      .positive({ message: 'amount debe ser mayor a 0' })
      .optional(),

    date: z.coerce
      .date({ invalid_type_error: 'Fecha inválida' })
      .optional(),

    description: z.string().optional(),

    typeId: z.coerce
      .number({ invalid_type_error: 'typeId debe ser un número' })
      .int()
      .optional(),

    categoryId: z.coerce
      .number({ invalid_type_error: 'categoryId debe ser un número' })
      .int()
      .optional(),
  })
  // .refine valida lógica de negocio que no encaja en un solo campo
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'Se requiere al menos un campo para actualizar',
  });

export type UpdateTransactionDTO = z.infer<typeof UpdateTransactionSchema>;

// ─── Get ─────────────────────────────────────────────────────────────────────
export const GetTransactionsSchema = z.object({
  documentId: z
    .string({ required_error: 'documentId es obligatorio' })
    .min(1, { message: 'documentId no puede estar vacío' }),
});

export type GetTransactionsDTO = z.infer<typeof GetTransactionsSchema>;

// ─── Delete ──────────────────────────────────────────────────────────────────
export const DeleteTransactionSchema = z.object({
  uuid: z
    .string({ required_error: 'uuid es obligatorio' })
    .uuid({ message: 'uuid debe tener formato UUID válido' }),
});

export type DeleteTransactionDTO = z.infer<typeof DeleteTransactionSchema>;
