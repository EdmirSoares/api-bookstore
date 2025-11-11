import { Request, Response } from "express";
import { Client } from "../entities/Client";
import { BaseController } from "./BaseController";
import { ClientResponseDTO } from "../dtos/ClientDTO";

export class ClientController extends BaseController<Client> {
    constructor() {
        super(Client);
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const clients = await this.repository.find({
                relations: ["loans", "loans.book"],
            });

            const clientDTOs = ClientResponseDTO.fromEntityArray(clients);
            return res.json(clientDTOs);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async findById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const clientId = parseInt(id);
            
            if (isNaN(clientId)) {
                return res.status(400).json({ error: 'Invalid client ID' });
            }
            
            const client = await this.repository.findOne({
                where: { id: clientId },
                relations: ["loans", "loans.book"],
            });

            if (!client) {
                return res.status(404).json({ error: "Client not found" });
            }

            const clientDTO = ClientResponseDTO.fromEntity(client);
            return res.json(clientDTO);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async findByEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.params;
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            
            const client = await this.repository.findOne({
                where: { email },
                relations: ["loans", "loans.book"],
            });

            if (!client) {
                return res.status(404).json({ error: "Client not found" });
            }

            const clientDTO = ClientResponseDTO.fromEntity(client);
            return res.json(clientDTO);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async searchByName(req: Request, res: Response): Promise<Response> {
        try {
            const { name } = req.query;

            if (!name) {
                return res
                    .status(400)
                    .json({ error: "Name parameter is required" });
            }
            
            if (typeof name !== 'string') {
                return res.status(400).json({ error: 'Name must be a string' });
            }

            const clients = await this.repository
                .createQueryBuilder("client")
                .where("LOWER(client.name) LIKE LOWER(:name)", {
                    name: `%${name}%`,
                })
                .getMany();

            const clientDTOs = ClientResponseDTO.fromEntityArray(clients);
            return res.json(clientDTOs);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
