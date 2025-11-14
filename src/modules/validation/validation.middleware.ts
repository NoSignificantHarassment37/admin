
import type { Request, Response, NextFunction } from "express";
import type { ZodType, ZodIssue } from "zod";

// Middleware genérico que acepta un esquema Zod y valida una parte de la
// request (por defecto `body`). Devuelve middleware de Express.
// Uso:
// app.post('/ruta', validateSchema(myZodSchema), handler)
// o para params/query: validateSchema(schema, 'params')

export const validateSchema = (
	schema: ZodType,
	target: "body" | "params" | "query" = "body"
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const data = (req as any)[target];

		const result = schema.safeParse(data);

			if (!result.success) {
				// Normalizar errores mínimos para el cliente
				const errors = result.error.issues.map((e:ZodIssue) => ({
					path: e.path,
					message: e.message,
				}));

				return res.status(422).json({
					error: "Validation error",
					details: errors,
				});
			}

		// Reemplazamos la parte validada con los datos parseados (útil para transforms/coercions)
		(req as any)[target] = result.data;
		return next();
	};
};

// Helpers convenientes
export const validateBody = (schema: ZodType) => validateSchema(schema, "body");
export const validateParams = (schema: ZodType) => validateSchema(schema, "params");
export const validateQuery = (schema: ZodType) => validateSchema(schema, "query");

// Nota: este middleware no lanza excepciones; responde con 422 en caso de
// fallos de validación. Si prefieres manejar errores mediante un error-handler
// global, cambia `return res.status(422)...` por `next(result.error)`.

