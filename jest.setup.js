// jest.setup.js (in project root)
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve('.env') }); // Load .env from root