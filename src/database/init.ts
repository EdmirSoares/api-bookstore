import { AppDataSource } from '../config/database';

/**
 * Inicializa o banco de dados de forma segura
 * - Conecta ao banco
 * - Cria tabelas automaticamente via TypeORM (sem SQL manual)
 * - Verifica se as tabelas foram criadas
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.warn('Iniciando conexão com o db > > >');
    
    await AppDataSource.initialize();

    console.info('Banco de dados inicializado');

    const entityMetadatas = AppDataSource.entityMetadatas;
    
    console.warn('Tabelas no banco de dados:');
    entityMetadatas.forEach((metadata) => {
      console.info(`   - ${metadata.tableName}`);
    });
    
  } catch (error) {
    console.error('Falha na inicialização do banco de dados:', error);
    throw error;
  }
}

/**
 * Fecha a conexão com o banco de dados
 */
export async function closeDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.warn('Conexão com o banco de dados encerrada');
    }
  } catch (error) {
    console.error('Erro ao fechar o banco de dados:', error);
    throw error;
  }
}

/**
 * Verifica o estado da conexão
 */
export function isDatabaseConnected(): boolean {
  return AppDataSource.isInitialized;
}
