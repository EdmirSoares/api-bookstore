import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Book, BookCategory } from '../entities/Book';
import { BaseController } from './BaseController';
import { CreateBookDTO, UpdateBookDTO, BookResponseDTO } from '../dtos/BookDTO';
import { compressBookCover } from '../config/multer';
import * as fs from 'fs';
import * as path from 'path';

export class BookController extends BaseController<Book> {
  constructor() {
    super(Book);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const books = await this.repository.find({
        relations: ['loans'],
      });
      const bookDTOs = BookResponseDTO.fromEntityArray(books);
      return res.json(bookDTOs);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const bookId = parseInt(id);
      
      if (isNaN(bookId)) {
        return res.status(400).json({ error: 'Livro não encontrado' });
      }
      
      const book = await this.repository.findOne({
        where: { id: bookId },
        relations: ['loans', 'loans.client'],
      });
      
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      const bookDTO = BookResponseDTO.fromEntity(book);
      return res.json(bookDTO);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      console.info('Request body:', JSON.stringify(req.body, null, 2));
      console.info('File info:', req.file || 'No file uploaded');
      
      const createDTO = req.body as CreateBookDTO;
      
      const bookData: any = { ...createDTO };

      if (req.file) {
        const compressedPath = await compressBookCover(req.file.path, 'webp');
        bookData.coverImage = compressedPath;
      }
      
      const book = this.repository.create(bookData);
      console.info('Book created:', book);
      
      const savedBook = await this.repository.save(book);
      console.info('Book saved:', savedBook);

      const responseDTO = BookResponseDTO.fromEntity(savedBook);
      return res.status(201).json(responseDTO);
    } catch (error) {
      console.error('Error in BookController.create:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const bookId = parseInt(id);
      
      if (isNaN(bookId)) {
        return res.status(400).json({ error: 'Livro inválido' });
      }
      
      const book = await this.repository.findOne({ where: { id: bookId } });
      
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      const updateDTO = req.body as UpdateBookDTO;
      const updateData: any = { ...updateDTO };
            // Se houver novo arquivo, comprimir e deletar o antigo
      if (req.file) {
        if (book.coverImage) {
          const oldImagePath = path.join(process.env.UPLOAD_PATH || './uploads', book.coverImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        const compressedPath = await compressBookCover(req.file.path, 'webp');
        updateData.coverImage = compressedPath;
      }
      
      this.repository.merge(book, updateData);
      const updatedBook = await this.repository.save(book);
      
      const responseDTO = BookResponseDTO.fromEntity(updatedBook);
      return res.json(responseDTO);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const bookId = parseInt(id);
      
      if (isNaN(bookId)) {
        return res.status(400).json({ error: 'Livro inválido' });
      }
      
      const book = await this.repository.findOne({ where: { id: bookId } });
      
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      if (book.coverImage) {
        const imagePath = path.join(process.env.UPLOAD_PATH || './uploads', 'covers', book.coverImage);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      await this.repository.remove(book);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateStock(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { qttEstoque } = req.body;
      
      const bookId = parseInt(id);
      
      if (isNaN(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
      }
      
      const book = await this.repository.findOne({ where: { id: bookId } });
      
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      book.qttEstoque = qttEstoque;
      book.rented = book.qttAlugados >= book.qttEstoque;
      
      const updatedBook = await this.repository.save(book);
      const responseDTO = BookResponseDTO.fromEntity(updatedBook);
      return res.json(responseDTO);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchByTitle(req: Request, res: Response): Promise<Response> {
    try {
      const { title } = req.query;
      
      if (!title) {
        return res.status(400).json({ error: 'Título é obrigatório' });
      }
      
      if (typeof title !== 'string') {
        return res.status(400).json({ error: 'Erro no tipo do título' });
      }
      
      const books = await this.repository
        .createQueryBuilder('book')
        .where('LOWER(book.title) LIKE LOWER(:title)', { title: `%${title}%` })
        .getMany();
      
      const bookDTOs = BookResponseDTO.fromEntityArray(books);
      return res.json(bookDTOs);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchByAuthor(req: Request, res: Response): Promise<Response> {
    try {
      const { author } = req.query;
      
      if (!author) {
        return res.status(400).json({ error: 'Nome do autor é obrigatório' });
      }
      
      if (typeof author !== 'string') {
        return res.status(400).json({ error: 'Erro no tipo do autor' });
      }
      
      const books = await this.repository
        .createQueryBuilder('book')
        .where('LOWER(book.author) LIKE LOWER(:author)', { author: `%${author}%` })
        .getMany();
      
      const bookDTOs = BookResponseDTO.fromEntityArray(books);
      return res.json(bookDTOs);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categories = Object.values(BookCategory).map(category => ({
        key: Object.keys(BookCategory).find(key => BookCategory[key as keyof typeof BookCategory] === category),
        value: category
      }));
      
      return res.json({
        categories,
        total: categories.length
      });
    } catch (error) {
      console.error('Error getting categories:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { category } = req.query;
      
      if (!category) {
        return res.status(400).json({ error: 'Categoria é obrigatória' });
      }
      
      if (typeof category !== 'string') {
        return res.status(400).json({ error: 'Erro no tipo da categoria' });
      }

      const validCategories = Object.values(BookCategory);
      if (!validCategories.includes(category as BookCategory)) {
        return res.status(400).json({ 
          error: 'Categoria inválida',
          validCategories 
        });
      }
      
      const books = await this.repository.find({
        where: { gender: category as BookCategory },
        relations: ['loans']
      });
      
      const bookDTOs = BookResponseDTO.fromEntityArray(books);
      return res.json(bookDTOs);
    } catch (error) {
      console.error('Error searching by category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}