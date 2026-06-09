import { describe, expect, test } from 'bun:test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GpxDropzone } from './GpxDropzone';
import type { GpxResult } from '../../utils/gpx';

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
    render(<GpxDropzone result={null} onLoaded={(result) => { loaded = result; }} onRemove={() => {}} {...labels} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([gpx], 'test.gpx', { type: 'application/gpx+xml' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(loaded?.name).toBe('Test GPX'));
    expect(loaded?.durationSec).toBe(300);
    expect(loaded?.points).toHaveLength(2);
  });

  test('renders loaded state with remove action', () => {
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
          durationSec: 300,
        }}
        onLoaded={() => {}}
        onRemove={() => {}}
        {...labels}
      />,
    );

    expect(screen.getByText(labels.loadedLabel)).toBeTruthy();
    expect(screen.getByRole('button', { name: new RegExp(labels.removeLabel) })).toBeTruthy();
  });
});
