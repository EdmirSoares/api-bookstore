import { Router } from "express";
import { ClientController } from "../controllers/ClientController";
import { validateDTO } from "../middlewares/validation.middleware";
import { CreateClientDTO, UpdateClientDTO } from "../dtos/ClientDTO";

const router = Router();
const clientController = new ClientController();

/**
 * @route GET /clients
 * @description Busca todos os clientes
 * @returns {ClientResponseDTO[]} Array de clientes
 */
router.get("/", (req, res) => clientController.findAll(req, res));

/**
 * @route GET /clients/search
 * @description Busca clientes por nome
 * @query {string} name - Nome do cliente para buscar
 * @returns {ClientResponseDTO[]} Array de clientes correspondentes
 */
router.get("/search", (req, res) => clientController.searchByName(req, res));

/**
 * @route GET /clients/email/:email
 * @description Busca cliente por endereço de email
 * @param {string} email - Endereço de email do cliente
 * @returns {ClientResponseDTO} Detalhes do cliente
 */
router.get("/email/:email", (req, res) =>
    clientController.findByEmail(req, res)
);

/**
 * @route GET /clients/:id
 * @description Busca cliente por ID
 * @param {number} id - ID do cliente
 * @returns {ClientResponseDTO} Detalhes do cliente
 */
router.get("/:id", (req, res) => clientController.findById(req, res));

/**
 * @route POST /clients
 * @description Cria um novo cliente
 * @body {CreateClientDTO} Dados do cliente
 * @middleware validateDTO(CreateClientDTO) - Valida corpo da requisição
 * @returns {ClientResponseDTO} Cliente criado
 */
router.post("/", validateDTO(CreateClientDTO), (req, res) =>
    clientController.create(req, res)
);

/**
 * @route PUT /clients/:id
 * @description Atualiza um cliente
 * @param {number} id - ID do cliente
 * @body {UpdateClientDTO} Dados atualizados do cliente
 * @middleware validateDTO(UpdateClientDTO, true) - Valida corpo da requisição (atualização parcial)
 * @returns {ClientResponseDTO} Cliente atualizado
 */
router.put("/:id", validateDTO(UpdateClientDTO, true), (req, res) =>
    clientController.update(req, res)
);

/**
 * @route DELETE /clients/:id
 * @description Deleta um cliente
 * @param {number} id - ID do cliente
 * @returns {Object} Mensagem de sucesso
 */
router.delete("/:id", (req, res) => clientController.delete(req, res));

export default router;
