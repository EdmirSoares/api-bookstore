import { IsNotEmpty, IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO para criação de um novo cliente
 * @description Valida os dados do cliente ao criar uma nova entrada
 */
export class CreateClientDTO {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
  email: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string' })
  @MaxLength(20, { message: 'O telefone deve ter no máximo 20 caracteres' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'O endereço deve ser uma string' })
  address?: string;
}

/**
 * DTO para atualização de um cliente existente
 * @description Valida os dados do cliente ao atualizar uma entrada
 * @note Todos os campos são opcionais para atualizações parciais
 */
export class UpdateClientDTO {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string' })
  @MaxLength(20, { message: 'O telefone deve ter no máximo 20 caracteres' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'O endereço deve ser uma string' })
  address?: string;
}

/**
 * DTO para respostas de cliente
 * @description Define a estrutura dos dados de cliente enviados aos clientes
 * @note Filtra dados sensíveis e não expõe relações por padrão
 */
export class ClientResponseDTO {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Converte uma entidade Client para ClientResponseDTO
   * @param {any} client - Entidade Client do banco de dados
   * @returns {ClientResponseDTO} Resposta formatada do cliente
   */
  static fromEntity(client: any): ClientResponseDTO {
    const dto = new ClientResponseDTO();
    dto.id = client.id;
    dto.name = client.name;
    dto.email = client.email;
    dto.phone = client.phone;
    dto.address = client.address;
    dto.createdAt = client.createdAt;
    dto.updatedAt = client.updatedAt;
    return dto;
  }

  /**
   * Converte um array de entidades Client para ClientResponseDTOs
   * @param {any[]} clients - Array de entidades Client do banco de dados
   * @returns {ClientResponseDTO[]} Array de respostas formatadas de clientes
   */
  static fromEntityArray(clients: any[]): ClientResponseDTO[] {
    return clients.map(client => this.fromEntity(client));
  }
}

