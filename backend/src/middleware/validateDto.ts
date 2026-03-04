import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware factory que valida req.body con un schema Zod.
 *
 * Uso en rutas:
 *   router.post('/', validateBody(CreateTransactionSchema), createTransaction)
 *
 * Si la validación falla → responde 400 con los errores por campo.
 * Si pasa → req.body queda reemplazado con el valor parseado/coercionado.
 */
export const validateBody = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'Validación fallida',
        // .issues contiene un array con cada error, incluyendo en qué campo ocurrió
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'body',
          message: issue.message,
        })),
      });
    }

    // Sobreescribimos req.body con el valor ya parseado y con los tipos correctos
    req.body = result.data;
    next();
  };
};

/**
 * Middleware factory que valida req.query con un schema Zod.
 *
 * Uso en rutas:
 *   router.get('/', validateQuery(GetTransactionsSchema), getTransactions)
 */
export const validateQuery = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        message: 'Validación fallida',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'query',
          message: issue.message,
        })),
      });
    }

    // Attach parsed query to req so controllers can use it typed
    (req as Request & { parsedQuery: z.infer<T> }).parsedQuery = result.data;
    next();
  };
};

/**
 * Middleware factory que valida req.params con un schema Zod.
 *
 * Uso en rutas:
 *   router.patch('/:uuid', validateParams(UuidParamSchema), updateTransaction)
 */
export const validateParams = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        message: 'Parámetros inválidos',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'params',
          message: issue.message,
        })),
      });
    }

    req.params = result.data as Record<string, string>;
    next();
  };
};
