import { IsNotEmpty, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { LoanStatus } from '../entities/Loan';

/**
 * DTO para criação de um novo empréstimo
 * @description Valida os dados do empréstimo ao criar uma nova entrada
 */
export class CreateLoanDTO {
  @IsNotEmpty({ message: 'O ID do livro é obrigatório' })
  @IsNumber({}, { message: 'O ID do livro deve ser um número' })
  bookId: number;

  @IsNotEmpty({ message: 'O ID do cliente é obrigatório' })
  @IsNumber({}, { message: 'O ID do cliente deve ser um número' })
  clientId: number;

  @IsNotEmpty({ message: 'A data de devolução é obrigatória' })
  @IsDateString({}, { message: 'Data de devolução inválida' })
  returnDate: string;
}

/**
 * DTO para atualização de um empréstimo existente
 * @description Valida os dados do empréstimo ao atualizar uma entrada
 * @note Todos os campos são opcionais para atualizações parciais
 */
export class UpdateLoanDTO {
  @IsOptional()
  @IsDateString({}, { message: 'Data de devolução inválida' })
  returnDate?: string;

  @IsOptional()
  @IsEnum(LoanStatus, { message: 'Status inválido' })
  status?: LoanStatus;
}

/**
 * DTO para respostas de empréstimo
 * @description Define a estrutura dos dados de empréstimo enviados aos clientes
 * @note Pode opcionalmente incluir informações do livro e cliente
 */
export class LoanResponseDTO {
  id: number;
  bookId: number;
  clientId: number;
  loanDate: Date;
  returnDate: Date;
  actualReturnDate?: Date;
  status: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
  
  /** Informações do livro (se incluídas) */
  book?: {
    id: number;
    title: string;
    author: string;
    gender: string;
  };
  
  /** Informações do cliente (se incluídas) */
  client?: {
    id: number;
    name: string;
    email: string;
  };

  /**
   * Converte uma entidade Loan para LoanResponseDTO
   * @param {any} loan - Entidade Loan do banco de dados
   * @param {boolean} includeRelations - Se deve incluir informações do livro e cliente
   * @returns {LoanResponseDTO} Resposta formatada do empréstimo
   */
  static fromEntity(loan: any, includeRelations = false): LoanResponseDTO {
    const dto = new LoanResponseDTO();
    dto.id = loan.id;
    dto.bookId = loan.bookId;
    dto.clientId = loan.clientId;
    dto.loanDate = loan.loanDate;
    dto.returnDate = loan.returnDate;
    dto.actualReturnDate = loan.actualReturnDate;
    dto.status = loan.status;
    dto.createdAt = loan.createdAt;
    dto.updatedAt = loan.updatedAt;

    if (includeRelations) {
      if (loan.book) {
        dto.book = {
          id: loan.book.id,
          title: loan.book.title,
          author: loan.book.author,
          gender: loan.book.gender,
        };
      }
      
      if (loan.client) {
        dto.client = {
          id: loan.client.id,
          name: loan.client.name,
          email: loan.client.email,
        };
      }
    }

    return dto;
  }

  /**
   * Converte um array de entidades Loan para LoanResponseDTOs
   * @param {any[]} loans - Array de entidades Loan do banco de dados
   * @param {boolean} includeRelations - Se deve incluir informações do livro e cliente
   * @returns {LoanResponseDTO[]} Array de respostas formatadas de empréstimos
   */
  static fromEntityArray(loans: any[], includeRelations = false): LoanResponseDTO[] {
    return loans.map(loan => this.fromEntity(loan, includeRelations));
  }
}

