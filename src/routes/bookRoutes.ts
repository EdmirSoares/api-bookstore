import { Router } from "express";
import { BookController } from "../controllers/BookController";
import { upload } from "../config/multer";
import { validateDTO } from "../middlewares/validation.middleware";
import { CreateBookDTO, UpdateBookDTO, UpdateStockDTO } from "../dtos/BookDTO";

const router = Router();
const bookController = new BookController();

/**
 * @route GET /books
 * @description Busca todos os livros
 * @returns {BookResponseDTO[]} Array de livros
 */
router.get("/", (req, res) => bookController.findAll(req, res));

/**
 * @route GET /books/categories
 * @description Busca todas as categorias de livros disponíveis
 * @returns {string[]} Array de nomes de categorias
 */
router.get("/categories", (req, res) => bookController.getCategories(req, res));

/**
 * @route GET /books/search/title
 * @description Busca livros por título
 * @query {string} title - Título do livro para buscar
 * @returns {BookResponseDTO[]} Array de livros correspondentes
 */
router.get("/search/title", (req, res) =>
    bookController.searchByTitle(req, res)
);

/**
 * @route GET /books/search/author
 * @description Busca livros por autor
 * @query {string} author - Nome do autor para buscar
 * @returns {BookResponseDTO[]} Array de livros correspondentes
 */
router.get("/search/author", (req, res) =>
    bookController.searchByAuthor(req, res)
);

/**
 * @route GET /books/search/category
 * @description Busca livros por categoria
 * @query {string} category - Categoria para filtrar
 * @returns {BookResponseDTO[]} Array de livros correspondentes
 */
router.get("/search/category", (req, res) =>
    bookController.searchByCategory(req, res)
);

/**
 * @route GET /books/:id
 * @description Busca livro por ID
 * @param {number} id - ID do livro
 * @returns {BookResponseDTO} Detalhes do livro
 * @note Esta rota deve vir após rotas específicas para evitar conflitos de parâmetros
 */
router.get("/:id", (req, res) => bookController.findById(req, res));

/**
 * @route POST /books
 * @description Cria um novo livro
 * @body {CreateBookDTO} Dados do livro
 * @file {File} cover - Imagem de capa do livro opcional (JPG/PNG, máx 5MB)
 * @middleware upload.single('cover') - Processa upload de arquivo
 * @middleware validateDTO(CreateBookDTO) - Valida corpo da requisição
 * @returns {BookResponseDTO} Livro criado
 */
router.post(
    "/",
    upload.single("cover"),
    validateDTO(CreateBookDTO),
    (req, res) => bookController.create(req, res)
);

/**
 * @route PUT /books/:id
 * @description Atualiza um livro
 * @param {number} id - ID do livro
 * @body {UpdateBookDTO} Dados atualizados do livro
 * @file {File} cover - Nova imagem de capa do livro opcional (JPG/PNG, máx 5MB)
 * @middleware upload.single('cover') - Processa upload de arquivo
 * @middleware validateDTO(UpdateBookDTO, true) - Valida corpo da requisição (atualização parcial)
 * @returns {BookResponseDTO} Livro atualizado
 */
router.put(
    "/:id",
    upload.single("cover"),
    validateDTO(UpdateBookDTO, true),
    (req, res) => bookController.update(req, res)
);

/**
 * @route PATCH /books/:id/stock
 * @description Atualiza quantidade em estoque do livro
 * @param {number} id - ID do livro
 * @body {UpdateStockDTO} Dados de atualização do estoque
 * @middleware validateDTO(UpdateStockDTO) - Valida corpo da requisição
 * @returns {BookResponseDTO} Livro atualizado
 */
router.patch("/:id/stock", validateDTO(UpdateStockDTO), (req, res) =>
    bookController.updateStock(req, res)
);

/**
 * @route DELETE /books/:id
 * @description Deleta um livro
 * @param {number} id - ID do livro
 * @returns {Object} Mensagem de sucesso
 */
router.delete("/:id", (req, res) => bookController.delete(req, res));

export default router;
