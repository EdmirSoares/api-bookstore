import { Router } from "express";
import { LoanController } from "../controllers/LoanController";
import { validateDTO } from "../middlewares/validation.middleware";
import { CreateLoanDTO, ReturnLoanDTO, UpdateLoanDTO } from "../dtos/LoanDTO";

const router = Router();
const loanController = new LoanController();

/**
 * @route GET /loans
 * @description Busca todos os empréstimos
 * @returns {LoanResponseDTO[]} Array de empréstimos
 */
router.get("/", (req, res) => loanController.findAll(req, res));

/**
 * @route GET /loans/active
 * @description Busca todos os empréstimos ativos
 * @returns {LoanResponseDTO[]} Array de empréstimos ativos
 */
router.get("/active", (req, res) => loanController.getActiveLoans(req, res));

/**
 * @route GET /loans/overdue
 * @description Busca todos os empréstimos atrasados
 * @returns {LoanResponseDTO[]} Array de empréstimos atrasados
 */
router.get("/overdue", (req, res) => loanController.getOverdueLoans(req, res));

/**
 * @route GET /loans/client/:clientId
 * @description Busca todos os empréstimos de um cliente específico
 * @param {number} clientId - ID do cliente
 * @returns {LoanResponseDTO[]} Array de empréstimos do cliente
 */
router.get("/client/:clientId", (req, res) =>
    loanController.getLoansByClient(req, res)
);

/**
 * @route GET /loans/book/:bookId
 * @description Busca todos os empréstimos de um livro específico
 * @param {number} bookId - ID do livro
 * @returns {LoanResponseDTO[]} Array de empréstimos do livro
 */
router.get("/book/:bookId", (req, res) =>
    loanController.getLoansByBook(req, res)
);

/**
 * @route GET /loans/:id
 * @description Busca empréstimo por ID
 * @param {number} id - ID do empréstimo
 * @returns {LoanResponseDTO} Detalhes do empréstimo
 */
router.get("/:id", (req, res) => loanController.findById(req, res));

/**
 * @route POST /loans
 * @description Cria um novo empréstimo
 * @body {CreateLoanDTO} Dados do empréstimo
 * @returns {LoanResponseDTO} Empréstimo criado
 */
router.post("/", validateDTO(CreateLoanDTO), (req, res) =>
    loanController.create(req, res)
);

/**
 * @route PATCH /loans/:id/return
 * @description Devolve um livro (marca empréstimo como devolvido)
 * @param {number} id - ID do empréstimo
 * @returns {LoanResponseDTO} Empréstimo atualizado com data de devolução
 */
router.patch("/:id/return", validateDTO(ReturnLoanDTO), (req, res) =>
    loanController.returnBook(req, res)
);

/**
 * @route PUT /loans/:id
 * @description Atualiza um empréstimo
 * @param {number} id - ID do empréstimo
 * @body {UpdateLoanDTO} Dados atualizados do empréstimo
 * @returns {LoanResponseDTO} Empréstimo atualizado
 */
router.put("/:id", validateDTO(UpdateLoanDTO), (req, res) =>
    loanController.update(req, res)
);

/**
 * @route DELETE /loans/:id
 * @description Deleta um empréstimo
 * @param {number} id - ID do empréstimo
 * @returns {Object} Mensagem de sucesso
 */
router.delete("/:id", (req, res) => loanController.delete(req, res));

export default router;
