export function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function notFound(): Response {
  return json({ error: 'not_found' }, { status: 404 });
}

export function methodNotAllowed(): Response {
  return json({ error: 'method_not_allowed' }, { status: 405 });
}

export function unauthorized(error = 'unauthorized'): Response {
  return json({ error }, { status: 401 });
}

export function forbidden(error = 'forbidden'): Response {
  return json({ error }, { status: 403 });
}

export async function handleError(error: unknown): Promise<Response> {
  console.error(error);
  return json({ error: 'internal_error' }, { status: 500 });
}
