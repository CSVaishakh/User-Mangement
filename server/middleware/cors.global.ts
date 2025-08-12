import { eventHandler } from 'h3'
import { cors } from 'nitro-cors'

export default eventHandler(
  cors({
    origin: '*', // or 'http://localhost:3000' for more restriction
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Origin']
  })
)
