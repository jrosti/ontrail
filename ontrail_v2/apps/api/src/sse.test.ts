import { describe, expect, test } from 'bun:test';
import { emitToUser, registerSseClient, type SseController } from './sse';

function controller(): SseController & { events: string[] } {
  return {
    events: [],
    enqueue(data: string) {
      this.events.push(data);
    },
    close() {},
  };
}

describe('SSE pub/sub', () => {
  test('delivers events to registered user clients', () => {
    const first = controller();
    const second = controller();
    const unregisterFirst = registerSseClient('user-id', first);
    const unregisterSecond = registerSseClient('user-id', second);

    emitToUser('user-id', 'new_comment', { exerciseId: 'exercise-id' });

    expect(first.events).toEqual(['event: new_comment\ndata: {"exerciseId":"exercise-id"}\n\n']);
    expect(second.events).toEqual(['event: new_comment\ndata: {"exerciseId":"exercise-id"}\n\n']);

    unregisterFirst();
    emitToUser('user-id', 'new_comment', { exerciseId: 'second' });

    expect(first.events).toHaveLength(1);
    expect(second.events).toHaveLength(2);

    unregisterSecond();
  });

  test('ignores missing and disconnected clients', () => {
    const broken: SseController = {
      enqueue() {
        throw new Error('closed');
      },
      close() {},
    };
    const unregister = registerSseClient('broken-user', broken);

    expect(() => emitToUser('missing-user', 'ping', {})).not.toThrow();
    expect(() => emitToUser('broken-user', 'ping', {})).not.toThrow();

    unregister();
  });
});
