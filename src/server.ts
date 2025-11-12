import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config/database";

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log("Iniciando servidor > > >");
        console.log("NODE_ENV:", process.env.NODE_ENV || "undefined");
        console.log("DB_HOST:", process.env.DB_HOST || "localhost");
        console.log("PORT:", PORT);

        console.log("Conectando ao banco de dados > > >");
        await AppDataSource.initialize();
        console.info("Banco de dados conectado");

        app.listen(PORT, () => {
            console.info(`Servidor rodando na porta ${PORT}`);
            console.info(`Health check: http://localhost:${PORT}/health`);
            console.info(`API Base: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error("Erro ao iniciar o servidor:", error);
        process.exit(1);
    }
}

process.on("SIGTERM", async () => {
    console.log("SIGTERM recebido, encerrando progressivamente");
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
    process.exit(0);
});

process.on("SIGINT", async () => {
    console.log("SIGINT recebido, encerrando progressivamente");
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
    process.exit(0);
});

startServer();
