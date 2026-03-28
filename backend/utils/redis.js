import { Redis } from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
}) 
//await client.set('foo', 'bar');


