import { Request, Response } from 'express';
import { Repository, EntityTarget } from 'typeorm';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';

export abstract class BaseController<T extends Record<string, any>> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const entities = await this.repository.find();
      return res.json(entities);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id);
      const entity = await this.repository.findOne({ where: { id: parsedId } as any });
      
      if (!entity) {
        return res.status(404).json({ error: 'Não encontrado' });
      }
      
      return res.json(entity);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const entity = this.repository.create(req.body);
      const errors = await validate(entity as any);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors.map(err => err.constraints) });
      }
      
      const savedEntity = await this.repository.save(entity);
      return res.status(201).json(savedEntity);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id);
      const entity = await this.repository.findOne({ where: { id: parsedId } as any });
      
      if (!entity) {
        return res.status(404).json({ error: 'Não encontrado' });
      }
      
      this.repository.merge(entity, req.body);
      const errors = await validate(entity as any);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors.map(err => err.constraints) });
      }
      
      const updatedEntity = await this.repository.save(entity);
      return res.json(updatedEntity);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id);
      const entity = await this.repository.findOne({ where: { id: parsedId } as any });
      
      if (!entity) {
        return res.status(404).json({ error: 'Não encontrado' });
      }
      
      await this.repository.remove(entity);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}