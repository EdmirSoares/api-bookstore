import { Router } from 'express';
import bookRoutes from './bookRoutes';
import clientRoutes from './clientRoutes';
import loanRoutes from './loanRoutes';

const router = Router();

/**
 * @route /api/books/*
 * @description Monta as rotas de livros
 */
router.use('/books', bookRoutes);

/**
 * @route /api/clients/*
 * @description Monta as rotas de clientes
 */
router.use('/clients', clientRoutes);

/**
 * @route /api/loans/*
 * @description Monta as rotas de empréstimos
 */
router.use('/loans', loanRoutes);

/**
 * @route GET /api/health
 * @description Endpoint de verificação de saúde
 * @returns {Object} Status da API e timestamp
 */
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;