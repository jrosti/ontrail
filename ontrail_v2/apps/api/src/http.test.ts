import { describe, expect, mock, test } from 'bun:test';
import { forbidden, handleError, json, methodNotAllowed, notFound, unauthorized } from './http';

async function responseJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe('http helpers', () => {
  test('json returns UTF-8 application JSON responses', async () => {
    const response = json({ ok: true }, { status: 201 });

    expect(response.status).toBe(201);
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(await responseJson(response)).toEqual({ ok: true });
  });

  test('standard error helpers return stable contracts', async () => {
    await expect(responseJson(notFound())).resolves.toEqual({ error: 'not_found' });
    expect(notFound().status).toBe(404);

    await expect(responseJson(methodNotAllowed())).resolves.toEqual({
      error: 'method_not_allowed',
    });
    expect(methodNotAllowed().status).toBe(405);

    await expect(responseJson(unauthorized())).resolves.toEqual({ error: 'unauthorized' });
    expect(unauthorized().status).toBe(401);

    await expect(responseJson(forbidden())).resolves.toEqual({ error: 'forbidden' });
    expect(forbidden().status).toBe(403);
  });

  test('error helpers support custom error codes and internal error logging', async () => {
    await expect(responseJson(unauthorized('login_required'))).resolves.toEqual({
      error: 'login_required',
    });
    await expect(responseJson(forbidden('owner_required'))).resolves.toEqual({
      error: 'owner_required',
    });

    const originalError = console.error;
    const error = mock(() => {});
    console.error = error;
    try {
      const response = await handleError(new Error('boom'));
      expect(response.status).toBe(500);
      await expect(responseJson(response)).resolves.toEqual({ error: 'internal_error' });
      expect(error).toHaveBeenCalledTimes(1);
    } finally {
      console.error = originalError;
    }
  });
});
