import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Middleware para validar DTOs usando class-validator
 * @param dtoClass - Classe do DTO a ser validada
 * @param skipMissingProperties - Permite propriedades ausentes
 */
export function validateDTO(dtoClass: any, skipMissingProperties = false) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      const dtoInstance = plainToInstance(dtoClass, req.body);

      const errors: ValidationError[] = await validate(dtoInstance, {
        skipMissingProperties,
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const formattedErrors = errors.map(error => ({
          field: error.property,
          constraints: error.constraints,
          value: error.value,
        }));

        return res.status(400).json({
          error: 'Error na validação',
          details: formattedErrors,
        });
      }

      req.body = dtoInstance;
      next();
    } catch (error) {
      console.error('Erro de validação:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
