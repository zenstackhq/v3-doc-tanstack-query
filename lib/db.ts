import { schema, type SchemaType } from '@/zenstack/schema';
import { SqlJsDialect } from '@zenstackhq/kysely-sql-js';
import { type ClientContract, ZenStackClient } from '@zenstackhq/orm';
import path from 'path';
import initSqlJs from 'sql.js';

let db: ClientContract<SchemaType>;

initializeDb();

async function initializeDb() {
    if (db) {
        return;
    }

    // initialize sql.js engine
    const SQL = await initSqlJs({
        // work around for locating sql.js wasm file in Next.js
        locateFile: (file) =>
            path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file),
    });

    // create database client with sql.js dialect
    db = new ZenStackClient(schema, {
        dialect: new SqlJsDialect({ sqlJs: new SQL.Database() }),
        log: ['query'],
    });

    // push schema to the database
    // the `$pushSchema` API is for testing purposes only
    await db.$pushSchema();

    // create test data
    const users = await db.user.createMany({
        data: [
            { id: '1', name: 'Alice', email: 'alice@example.com' },
            { id: '2', name: 'Bob', email: 'bob@example.com' },
        ],
    });

    console.log('Test users created:');
    console.table(users);

    return db;
}

export { db };
