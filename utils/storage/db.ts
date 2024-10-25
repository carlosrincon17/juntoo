import * as schema from '@/drizzle/schema';
import { drizzle } from 'drizzle-orm/vercel-postgres';

export const db = drizzle({ schema });