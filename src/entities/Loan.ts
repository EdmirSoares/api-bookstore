import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsDateString } from 'class-validator';
import { Book } from './Book';
import { Client } from './Client';

export enum LoanStatus {
  ACTIVE = 'active',
  RETURNED = 'returned',
  OVERDUE = 'overdue'
}

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, book => book.loans)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ name: 'book_id' })
  bookId: number;

  @ManyToOne(() => Client, client => client.loans)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'loan_date', type: 'date' })
  @IsNotEmpty()
  @IsDateString()
  loanDate: Date;

  @Column({ name: 'return_date', type: 'date' })
  @IsNotEmpty()
  @IsDateString()
  returnDate: Date;

  @Column({ name: 'actual_return_date', type: 'date', nullable: true })
  actualReturnDate: Date;

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.ACTIVE
  })
  status: LoanStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}