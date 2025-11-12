import { AppDataSource } from '../config/database';
import { Book, BookCategory } from '../entities/Book';
import { Client } from '../entities/Client';
import { Loan, LoanStatus } from '../entities/Loan';

/**
 * Popula o banco de dados com dados de exemplo
 * Usa TypeORM Repository - SEM SQL INJECTION
 * Usa prepared statements automaticamente
 */
export async function seedDatabase(): Promise<void> {
  try {
    console.info('Iniciando povoamento do banco de dados...');
    
    const bookRepository = AppDataSource.getRepository(Book);
    const clientRepository = AppDataSource.getRepository(Client);
    const loanRepository = AppDataSource.getRepository(Loan);
    
    const bookCount = await bookRepository.count();
    if (bookCount > 0) {
      console.warn('Banco de dados já povoado, pulando...');
      return;
    }

    console.info('Criando livros de exemplo...');
    const books = await bookRepository.save([
      {
        title: '1984',
        author: 'George Orwell',
        category: BookCategory.SCIENCE_FICTION,
        stock: 3,
        isbn: '978-0451524935'
      },
      {
        title: 'Dom Casmurro',
        author: 'Machado de Assis',
        category: BookCategory.ROMANCE,
        stock: 5,
        isbn: '978-8535908770'
      },
      {
        title: 'Harry Potter e a Pedra Filosofal',
        author: 'J.K. Rowling',
        category: BookCategory.FANTASY,
        stock: 4,
        isbn: '978-8532530787'
      },
      {
        title: 'O Código Da Vinci',
        author: 'Dan Brown',
        category: BookCategory.THRILLER,
        stock: 2,
        isbn: '978-8599296004'
      },
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        category: BookCategory.BIOGRAPHY,
        stock: 3,
        isbn: '978-8535919158'
      }
    ]);
    console.info(`Número de livros criados: ${books.length}`);
    
    console.log('Criando clientes de exemplo...');
    const clients = await clientRepository.save([
      {
        name: 'João Silva',
        email: 'joao.silva@email.com',
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321'
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        cpf: '987.654.321-00',
        phone: '(11) 91234-5678'
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        cpf: '456.789.123-00',
        phone: '(11) 99999-8888'
      }
    ]);
    console.info(` Número de clientes criados: ${clients.length}`);

    console.log('Criando empréstimos de exemplo...');
    const loans = await loanRepository.save([
      {
        book: books[0],
        client: clients[0],
        loanDate: new Date('2024-01-15'),
        dueDate: new Date('2024-01-29'),
        status: LoanStatus.ACTIVE
      },
      {
        book: books[2],
        client: clients[1],
        loanDate: new Date('2024-01-10'),
        dueDate: new Date('2024-01-24'),
        returnDate: new Date('2024-01-23'),
        status: LoanStatus.RETURNED
      },
      {
        book: books[3],
        client: clients[2],
        loanDate: new Date('2024-01-05'),
        dueDate: new Date('2024-01-19'),
        status: LoanStatus.OVERDUE
      }
    ]);
    console.info(`Número de empréstimos criados: ${loans.length}`);
    
    console.info('Seed inserido no banco de dados');
    
  } catch (error) {
    console.error('Falha ao inserir seed no banco de dados:', error);
    throw error;
  }
}

/**
 * Limpa todos os dados do banco
 * Útil para testes - também usa TypeORM
 */
export async function clearDatabase(): Promise<void> {
  try {
    console.log('🗑️  Clearing database...');
    
    const loanRepository = AppDataSource.getRepository(Loan);
    const bookRepository = AppDataSource.getRepository(Book);
    const clientRepository = AppDataSource.getRepository(Client);
    
    // Deletar na ordem correta (por causa das foreign keys)
    await loanRepository.delete({});
    await bookRepository.delete({});
    await clientRepository.delete({});
    
    console.log('✅ Database cleared successfully');
    
  } catch (error) {
    console.error('❌ Database clearing failed:', error);
    throw error;
  }
}
