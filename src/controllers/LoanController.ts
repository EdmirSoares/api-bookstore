import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Loan, LoanStatus } from "../entities/Loan";
import { Book } from "../entities/Book";
import { Client } from "../entities/Client";
import { BaseController } from "./BaseController";
import { LoanResponseDTO } from "../dtos/LoanDTO";

export class LoanController extends BaseController<Loan> {
    private bookRepository = AppDataSource.getRepository(Book);
    private clientRepository = AppDataSource.getRepository(Client);

    constructor() {
        super(Loan);
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const loans = await this.repository.find({
                relations: ["book", "client"],
            });

            const loanDTOs = LoanResponseDTO.fromEntityArray(loans, true);
            return res.json(loanDTOs);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async findById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const loanId = parseInt(id);

            if (isNaN(loanId)) {
                return res.status(400).json({ error: "Empréstimo inválido" });
            }

            const loan = await this.repository.findOne({
                where: { id: loanId },
                relations: ["book", "client"],
            });

            if (!loan) {
                return res
                    .status(404)
                    .json({ error: "Empréstimo não encontrado" });
            }

            const loanDTO = LoanResponseDTO.fromEntity(loan, true);
            return res.json(loanDTO);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { bookId, clientId, returnDate } = req.body;

            const book = await this.bookRepository.findOne({
                where: { id: bookId },
            });
            if (!book) {
                return res.status(404).json({ error: "Livro não encontrado" });
            }

            if (book.qttAlugados >= book.qttEstoque) {
                return res
                    .status(400)
                    .json({ error: "Livro não disponível para empréstimo" });
            }

            const client = await this.clientRepository.findOne({
                where: { id: clientId },
            });
            if (!client) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            const loan = this.repository.create({
                bookId,
                clientId,
                loanDate: new Date(),
                returnDate: new Date(returnDate),
                status: LoanStatus.ACTIVE,
            });

            const savedLoan = await this.repository.save(loan);

            book.qttAlugados += 1;
            book.rented = book.qttAlugados >= book.qttEstoque;
            await this.bookRepository.save(book);

            const loanWithRelations = await this.repository.findOne({
                where: { id: savedLoan.id },
                relations: ["book", "client"],
            });

            const loanDTO = LoanResponseDTO.fromEntity(
                loanWithRelations!,
                true
            );
            return res.status(201).json(loanDTO);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async returnBook(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { actualReturnDate } = req.body;

            const loanId = parseInt(id);
            if (isNaN(loanId)) {
                return res
                    .status(400)
                    .json({
                        error: "Devolução inválida para o livro informado",
                    });
            }

            const loan = await this.repository.findOne({
                where: { id: loanId },
                relations: ["book"],
            });

            if (!loan) {
                return res
                    .status(404)
                    .json({ error: "Empréstimo não encontrado" });
            }

            if (loan.status === LoanStatus.RETURNED) {
                return res
                    .status(400)
                    .json({ error: "Devolução já registrada!" });
            }

            loan.actualReturnDate = actualReturnDate
                ? new Date(actualReturnDate)
                : new Date();
            loan.status = LoanStatus.RETURNED;
            await this.repository.save(loan);

            const book = loan.book;
            book.qttAlugados -= 1;
            book.rented = book.qttAlugados >= book.qttEstoque;
            await this.bookRepository.save(book);

            const updatedLoan = await this.repository.findOne({
                where: { id: loanId },
                relations: ["book", "client"],
            });

            const loanDTO = LoanResponseDTO.fromEntity(updatedLoan!, true);
            return res.json(loanDTO);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getActiveLoans(req: Request, res: Response): Promise<Response> {
        try {
            const loans = await this.repository.find({
                where: { status: LoanStatus.ACTIVE },
                relations: ["book", "client"],
            });
            return res.json(LoanResponseDTO.fromEntityArray(loans, true));
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getOverdueLoans(req: Request, res: Response): Promise<Response> {
        try {
            const currentDate = new Date();

            const overdueLoans = await this.repository
                .createQueryBuilder("loan")
                .leftJoinAndSelect("loan.book", "book")
                .leftJoinAndSelect("loan.client", "client")
                .where("loan.status = :status", { status: LoanStatus.ACTIVE })
                .andWhere("loan.returnDate < :currentDate", { currentDate })
                .getMany();

            for (const loan of overdueLoans) {
                loan.status = LoanStatus.OVERDUE;
                await this.repository.save(loan);
            }

            const loanDTOs = LoanResponseDTO.fromEntityArray(
                overdueLoans,
                true
            );
            return res.json(loanDTOs);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getLoansByClient(req: Request, res: Response): Promise<Response> {
        try {
            const { clientId } = req.params;
            const clientIdNum = parseInt(clientId);

            if (isNaN(clientIdNum)) {
                return res
                    .status(400)
                    .json({ error: "Usuário não encontrado" });
            }

            const loans = await this.repository.find({
                where: { clientId: clientIdNum },
                relations: ["book", "client"],
            });

            const loanDTOs = LoanResponseDTO.fromEntityArray(loans, true);
            return res.json(loanDTOs);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getLoansByBook(req: Request, res: Response): Promise<Response> {
        try {
            const { bookId } = req.params;
            const bookIdNum = parseInt(bookId);

            if (isNaN(bookIdNum)) {
                return res
                    .status(400)
                    .json({ error: "Livro inválido ou não encontrado" });
            }

            const loans = await this.repository.find({
                where: { bookId: bookIdNum },
                relations: ["book", "client"],
            });

            const loanDTOs = LoanResponseDTO.fromEntityArray(loans, true);
            return res.json(loanDTOs);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { returnDate, status } = req.body;

            const loanId = parseInt(id);
            if (isNaN(loanId)) {
                return res
                    .status(400)
                    .json({ error: "Empréstimo não encontrado" });
            }

            const loan = await this.repository.findOne({
                where: { id: loanId },
                relations: ["book"],
            });

            if (!loan) {
                return res
                    .status(404)
                    .json({ error: "Empréstimo não encontrado" });
            }

            if (
                loan.status === LoanStatus.RETURNED &&
                status === LoanStatus.ACTIVE
            ) {
                return res.status(400).json({
                    error: "Não é possível alterar o empréstimo.",
                });
            }

            if (returnDate) {
                const newReturnDate = new Date(returnDate);

                if (
                    loan.status === LoanStatus.ACTIVE &&
                    newReturnDate < new Date()
                ) {
                    return res.status(400).json({
                        error: "Data de retorno inválida para empréstimos ativos",
                    });
                }

                loan.returnDate = newReturnDate;
            }

            const oldStatus = loan.status;

            if (status) {
                loan.status = status;

                if (
                    (oldStatus === LoanStatus.ACTIVE ||
                        oldStatus === LoanStatus.OVERDUE) &&
                    status === LoanStatus.RETURNED
                ) {
                    loan.actualReturnDate = new Date();

                    const book = loan.book;
                    book.qttAlugados -= 1;
                    book.rented = book.qttAlugados >= book.qttEstoque;
                    await this.bookRepository.save(book);
                }
            }

            await this.repository.save(loan);

            const updatedLoan = await this.repository.findOne({
                where: { id: loanId },
                relations: ["book", "client"],
            });

            const loanDTO = LoanResponseDTO.fromEntity(updatedLoan!, true);
            return res.json(loanDTO);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
