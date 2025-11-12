import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { AppDataSource } from './config/database';
import routes from './routes';

/**
 * Carrega variáveis de ambiente do arquivo .env
 */
dotenv.config();

const app = express();

/**
 * Middleware: Habilita CORS para todas as rotas
 */
app.use(cors());

/**
 * Middleware: Analisa corpos de requisição JSON
 */
app.use(express.json());

/**
 * Middleware: Analisa corpos de requisição URL-encoded
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Serve arquivos estáticos para capas de livros enviadas
 * @route GET /uploads/*
 * @description Acessa arquivos enviados (capas de livros)
 */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * Monta as rotas da API
 * @route /api/*
 * @description Todos os endpoints da API são prefixados com /api
 */
app.use('/api', routes);

/**
 * Middleware global de tratamento de erros
 * @description Captura e trata erros de todas as rotas
 * @param {Error} err - O objeto de erro
 * @param {express.Request} req - Objeto de requisição do Express
 * @param {express.Response} res - Objeto de resposta do Express
 * @param {express.NextFunction} next - Função next do Express
 */
app.use((err: Error | any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  
  if (err.message.includes('Tipo de arquivo não suportado')) {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE' || err.message.includes('File too large')) {
    return res.status(413).json({ error: 'Arquivo muito grande. Tamanho máximo: 15MB' });
  }
  
  if (err.message.includes('Falha ao processar imagem')) {
    return res.status(400).json({ error: 'Não foi possível processar a imagem. Verifique se o arquivo está corrompido.' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * Manipulador 404 - Captura todas as rotas indefinidas
 * @route * (qualquer rota indefinida)
 * @description Retorna erro 404 para rotas inexistentes
 */
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;