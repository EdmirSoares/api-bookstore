import { AppDataSource } from '../config/database';
import { initializeDatabase } from './init';
import { seedDatabase } from './seed';

/**
 * Uso:
 *   npm run db:init       - Inicializa o banco
 *   npm run db:seed       - Popula com dados de exemplo
 *   npm run db:init-seed  - Faz ambos
 */

const command = process.argv[2];

async function run() {
  try {
    if (!command || command === 'init' || command === 'init-seed') {
      await initializeDatabase();
    }
    
    if (command === 'seed' || command === 'init-seed') {
      await seedDatabase();
    }
    
    if (!command) {
      console.log('\nComandos Disponíveis:');
      console.log('  npm run db:init       - Iniciar o banco de dados');
      console.log('  npm run db:seed       - Preencher com dados de exemplo');
      console.log('  npm run db:init-seed  - Inicializar banco de dados e preencher');
    }
    
    await AppDataSource.destroy();
    process.exit(0);
    
  } catch (error) {
    console.error('Error:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

run();
