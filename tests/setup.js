import fs from 'fs';
import path from 'path';

const testDbPath = path.join(process.cwd(), 'tests', 'test.db');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

process.env.DB_PATH = testDbPath;