import { IsNotEmpty, IsNumber, IsString, Min, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { BookCategory } from '../entities/Book';

/**
 * DTO para criação de um novo livro
 * @description Valida os dados do livro ao criar uma nova entrada
 */
export class CreateBookDTO {
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser uma string' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres' })
  title: string;

  @IsNotEmpty({ message: 'O autor é obrigatório' })
  @IsString({ message: 'O autor deve ser uma string' })
  @MaxLength(255, { message: 'O autor deve ter no máximo 255 caracteres' })
  author: string;

  @IsNumber({}, { message: 'O ano de publicação deve ser um número' })
  @Min(1000, { message: 'O ano de publicação deve ser maior que 1000' })
  publicationYear: number;

  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @IsEnum(BookCategory, { message: 'Categoria inválida' })
  gender: BookCategory;

  @IsNumber({}, { message: 'A quantidade em estoque deve ser um número' })
  @Min(0, { message: 'A quantidade em estoque não pode ser negativa' })
  qttEstoque: number;

  @IsOptional()
  @IsString()
  sobre?: string;
}

/**
 * DTO para atualização de um livro existente
 * @description Valida os dados do livro ao atualizar uma entrada
 * @note Todos os campos são opcionais para atualizações parciais
 */
export class UpdateBookDTO {
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'O autor deve ser uma string' })
  @MaxLength(255, { message: 'O autor deve ter no máximo 255 caracteres' })
  author?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O ano de publicação deve ser um número' })
  @Min(1000, { message: 'O ano de publicação deve ser maior que 1000' })
  publicationYear?: number;

  @IsOptional()
  @IsEnum(BookCategory, { message: 'Categoria inválida' })
  gender?: BookCategory;

  @IsOptional()
  @IsNumber({}, { message: 'A quantidade em estoque deve ser um número' })
  @Min(0, { message: 'A quantidade em estoque não pode ser negativa' })
  qttEstoque?: number;

  @IsOptional()
  @IsString()
  sobre?: string;
}

/**
 * DTO para atualização da quantidade em estoque do livro
 * @description Valida atualizações de quantidade em estoque
 */
export class UpdateStockDTO {
  @IsNumber({}, { message: 'A quantidade em estoque deve ser um número' })
  @Min(0, { message: 'A quantidade em estoque não pode ser negativa' })
  qttEstoque: number;
}

/**
 * DTO para respostas de livro
 * @description Define a estrutura dos dados de livro enviados aos clientes
 * @note Filtra dados sensíveis e formata a resposta
 */
export class BookResponseDTO {
  id: number;
  title: string;
  author: string;
  publicationYear: number;
  gender: BookCategory;
  qttEstoque: number;
  qttAlugados: number;
  rented: boolean;
  sobre?: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Converte uma entidade Book para BookResponseDTO
   * @param {any} book - Entidade Book do banco de dados
   * @returns {BookResponseDTO} Resposta formatada do livro
   */
  static fromEntity(book: any): BookResponseDTO {
    const dto = new BookResponseDTO();
    dto.id = book.id;
    dto.title = book.title;
    dto.author = book.author;
    dto.publicationYear = book.publicationYear;
    dto.gender = book.gender;
    dto.qttEstoque = book.qttEstoque;
    dto.qttAlugados = book.qttAlugados;
    dto.rented = book.rented;
    dto.sobre = book.sobre;
    dto.coverImage = book.coverImage;
    dto.createdAt = book.createdAt;
    dto.updatedAt = book.updatedAt;
    return dto;
  }

  /**
   * Converte um array de entidades Book para BookResponseDTOs
   * @param {any[]} books - Array de entidades Book do banco de dados
   * @returns {BookResponseDTO[]} Array de respostas formatadas de livros
   */
  static fromEntityArray(books: any[]): BookResponseDTO[] {
    return books.map(book => this.fromEntity(book));
  }
}

