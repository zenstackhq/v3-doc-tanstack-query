import { SqlJsDialect } from '@zenstackhq/kysely-sql-js';
import { ZenStackClient, type ClientContract } from '@zenstackhq/orm';
import { RPCApiHandler } from '@zenstackhq/server/api';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import cors from 'cors';
import express from 'express';
import initSqlJs from 'sql.js';
import { schema, type SchemaType } from './zenstack/schema';

const app = express();

let db: ClientContract<SchemaType>;
initializeDb();

app.use(express.json());
app.use(cors());

app.use(
    '/api/model',
    ZenStackMiddleware({
        apiHandler: new RPCApiHandler({ schema }),
        getClient: () => db,
    })
);

const port = 3100;
app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});

async function initializeDb() {
    if (db) {
        return;
    }

    // initialize sql.js engine
    const SQL = await initSqlJs();

    // create database client with sql.js dialect
    db = new ZenStackClient(schema, {
        dialect: new SqlJsDialect({ sqlJs: new SQL.Database() }),
    });

    // push schema to the database
    // the `$pushSchema` API is for testing purposes only
    await db.$pushSchema();

    // create test data
    const users = await db.user.createManyAndReturn({
        data: [
            { id: '1', name: 'Alice', email: 'alice@example.com' },
            { id: '2', name: 'Bob', email: 'bob@example.com' },
        ],
    });

    console.log('Test users created:');
    console.table(users);

    return db;
}
