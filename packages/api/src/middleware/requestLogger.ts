import { FastifyRequest } from 'fastify';

export async function requestLogger(request: FastifyRequest): Promise<void> {
  request.log.info(
    {
      method: request.method,
      url: request.url,
      headers: {
        'user-agent': request.headers['user-agent'],
        'content-type': request.headers['content-type'],
      },
      ip: request.ip,
    },
    'Incoming request'
  );
}