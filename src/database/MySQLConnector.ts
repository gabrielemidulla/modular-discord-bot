import { Logger } from "utils/Logger";
import mysql from "mysql2/promise";

export class MySQLConnector {
    private static instance: MySQLConnector;
    public connection: mysql.Connection;
    private constructor() {
        this.connection = null;
    }

    private static async createConnection(config: mysql.ConnectionOptions) {
        try {
            Logger.log("Creating MySQL connection...");
            MySQLConnector.instance.connection = await mysql.createConnection(config);
            Logger.success("MySQL connection created");
        } catch (e) {
            Logger.error("Failed to create MySQL connection", e);
        }
    }

    public static async getInstance(): Promise<MySQLConnector> {
        if (!MySQLConnector.instance) {
            Logger.log("Creating MySQLConnector instance...");

            try {
                MySQLConnector.instance = new MySQLConnector();
                const config: mysql.ConnectionOptions = {
                    host: process.env.MYSQL_HOST,
                    user: process.env.MYSQL_USER,
                    password: process.env.MYSQL_PASS || "",
                };

                await MySQLConnector.createConnection(config);

                try {
                    Logger.log(`Creating database ${process.env.MYSQL_DB} if it doesn't exist...`);
                    await MySQLConnector.instance.connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DB}`);
                    Logger.success(`Database ${process.env.MYSQL_DB} created`);
                } catch (e) {
                    Logger.error(`Failed to create database ${process.env.MYSQL_DB}`, e);
                }

                // Recreate connection configuring it to use the database
                config.database = process.env.MYSQL_DB;
                MySQLConnector.instance.connection.destroy();
                await MySQLConnector.createConnection(config);

                Logger.success("MySQLConnector instance created");
            } catch (e) {
                Logger.error("Failed to create MySQLConnector instance", e);
            }
        }
        return MySQLConnector.instance;
    }
}
