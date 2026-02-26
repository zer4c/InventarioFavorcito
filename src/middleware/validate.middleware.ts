import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res.status(400).send({
          status: 400,
          ok: false,
          detail: errorMessages,
        });
      } else {
        res.status(500).send({
          status: 500,
          ok: true,
          detail: 'Internal Server Error',
        });
      }
    }
  };
}
