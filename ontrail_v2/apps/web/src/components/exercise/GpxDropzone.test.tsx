import { describe, expect, mock, test } from 'bun:test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { GpxResult } from '../../utils/gpx';
import { GpxDropzone } from './GpxDropzone';

const labels = {
  label: 'GPS-jälki (.gpx)',
  hint: 'Pudota .gpx-tiedosto tähän tai klikkaa',
  removeLabel: 'Poista',
  loadedLabel: 'GPS-jälki ladattu',
  pointsLabel: 'pistettä',
  filledLabel: 'Matka, kesto ja nousu täytetty GPS-tiedoista',
};

const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="OnTrail test">
  <trk>
    <name>Test GPX</name>
    <trkseg>
      <trkpt lat="60.1699" lon="24.9384"><ele>10</ele><time>2026-06-09T12:00:00Z</time></trkpt>
      <trkpt lat="60.1709" lon="24.9484"><ele>20</ele><time>2026-06-09T12:05:00Z</time></trkpt>
    </trkseg>
  </trk>
</gpx>`;

describe('GpxDropzone', () => {
  test('renders the upload affordance', () => {
    render(<GpxDropzone result={null} onLoaded={() => {}} onRemove={() => {}} {...labels} />);

    expect(screen.getByRole('button', { name: labels.label })).toBeTruthy();
    expect(screen.getByText(labels.hint)).toBeTruthy();
  });

  test('parses selected GPX files', async () => {
    let loaded: GpxResult | null = null;
    render(
      <GpxDropzone
        result={null}
        onLoaded={(result) => {
          loaded = result;
        }}
        onRemove={() => {}}
        {...labels}
      />,
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([gpx], 'test.gpx', { type: 'application/gpx+xml' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(loaded?.name).toBe('Test GPX'));
    expect(loaded?.durationCs).toBe(30000); // 5 min = 30000 cs
    expect(loaded?.points).toHaveLength(2);
    expect(input.value).toBe('');
  });

  test('shows an error for non-GPX files selected from the picker', async () => {
    render(
      <GpxDropzone
        result={null}
        onLoaded={() => {
          throw new Error('should not load');
        }}
        onRemove={() => {}}
        {...labels}
      />,
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByText('Please drop a .gpx file')).toBeTruthy();
    expect(input.value).toBe('');
  });

  test('supports drag-and-drop and resets the drag state', async () => {
    let loaded: GpxResult | null = null;
    render(
      <GpxDropzone
        result={null}
        onLoaded={(result) => {
          loaded = result;
        }}
        onRemove={() => {}}
        {...labels}
      />,
    );

    const dropzone = screen.getByRole('button', { name: labels.label });
    fireEvent.dragOver(dropzone);
    expect((dropzone as HTMLElement).style.border).toContain('var(--accent)');

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [new File([gpx], 'route.gpx', { type: 'application/gpx+xml' })],
      },
    });

    await waitFor(() => expect(loaded?.points).toHaveLength(2));
    expect((dropzone as HTMLElement).style.border).toContain('var(--border)');
  });

  test('clicking the visible dropzone opens the hidden input once', () => {
    render(<GpxDropzone result={null} onLoaded={() => {}} onRemove={() => {}} {...labels} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const click = mock(() => {});
    input.click = click;

    fireEvent.click(screen.getByRole('button', { name: labels.label }));
    expect(click).toHaveBeenCalledTimes(1);
  });

  test('ignores clicks bubbling from the hidden input to avoid reopening the picker', () => {
    render(<GpxDropzone result={null} onLoaded={() => {}} onRemove={() => {}} {...labels} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const click = mock(() => {});
    input.click = click;

    fireEvent.click(input);

    expect(click).not.toHaveBeenCalled();
  });

  test('renders loaded state with remove action', () => {
    const onRemove = mock(() => {});
    render(
      <GpxDropzone
        result={{
          name: 'Test GPX',
          points: [
            { lat: 60.1699, lon: 24.9384 },
            { lat: 60.1709, lon: 24.9484 },
          ],
          distanceM: 560,
          elevationGainM: 10,
          durationCs: 30000,
        }}
        onLoaded={() => {}}
        onRemove={onRemove}
        {...labels}
      />,
    );

    expect(screen.getByText(labels.loadedLabel)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: new RegExp(labels.removeLabel) }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
