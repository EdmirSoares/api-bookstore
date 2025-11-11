import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, Min, IsEnum } from 'class-validator';
import { Loan } from './Loan';

export enum BookCategory {
  ROMANCE = 'Romance',
  FICTION = 'Ficção',
  SCIENCE_FICTION = 'Ficção Científica',
  FANTASY = 'Fantasia',
  MYSTERY = 'Mistério',
  THRILLER = 'Thriller',
  HORROR = 'Terror',
  BIOGRAPHY = 'Biografia',
  AUTOBIOGRAPHY = 'Autobiografia',
  HISTORY = 'História',
  SCIENCE = 'Ciência',
  PHILOSOPHY = 'Filosofia',
  PSYCHOLOGY = 'Psicologia',
  SELF_HELP = 'Autoajuda',
  BUSINESS = 'Negócios',
  TECHNOLOGY = 'Tecnologia',
  COOKING = 'Culinária',
  TRAVEL = 'Viagem',
  POETRY = 'Poesia',
  DRAMA = 'Drama',
  COMEDY = 'Comédia',
  CHILDREN = 'Infantil',
  YOUNG_ADULT = 'Jovem Adulto',
  EDUCATION = 'Educação',
  RELIGION = 'Religião',
  HEALTH = 'Saúde',
  SPORTS = 'Esportes',
  ART = 'Arte',
  MUSIC = 'Música',
  OTHER = 'Outros'
}

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column({ length: 150 })
  @IsNotEmpty()
  @IsString()
  author: string;

  @Column({ name: 'publication_year' })
  @IsNumber()
  @Min(1000)
  publicationYear: number;

  @Column({
    type: 'enum',
    enum: BookCategory,
    default: BookCategory.OTHER
  })
  @IsNotEmpty()
  @IsEnum(BookCategory)
  gender: BookCategory;

  @Column({ name: 'qtt_estoque', default: 0 })
  @IsNumber()
  @Min(0)
  qttEstoque: number;

  @Column({ name: 'qtt_alugados', default: 0 })
  @IsNumber()
  @Min(0)
  qttAlugados: number;

  @Column({ default: false })
  rented: boolean;

  @Column({ type: 'text', nullable: true })
  sobre: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage: string;

  @OneToMany(() => Loan, loan => loan.book)
  loans: Loan[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}