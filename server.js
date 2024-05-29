import Fastify from 'fastify';
import fetch from 'node-fetch';
import pino from 'pino';
import pretty from 'pino-pretty';
import { config } from 'dotenv';

config();

const stream = pretty({
  translateTime: 'SYS:HH:MM:ss Z',
  messageFormat: '{msg} {req.method} {req.url}',
  include: "time,pid,level",
  hideObject: true,
  colorize: false
})

const logger = pino({ level: 'info' }, stream);
const app = Fastify({ logger });

app.register(import('@fastify/cors'));

const url = 'https://api.exa.ai/search';

app.get('/api/search', async (request, reply) => {
  const { q } = request.query;

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-api-key': process.env.EXASEARCH_API_KEY
    },
    body: JSON.stringify({useAutoprompt: true, query: q})
  };

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with your request:', error);
    reply.code(500).send({ error: 'Internal server error' });
  }
});

if (process.env.NODE_ENV === "development") {
  /**
   * A function that asynchronously starts the application listening on port 3000.
   *
   * @return {Promise} A promise that resolves when the application starts listening successfully.
   */
  const start = async () => {
    try {
      await app.listen({ port: 3000 });
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };
  start();
}

export default app;