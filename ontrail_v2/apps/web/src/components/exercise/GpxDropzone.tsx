import { useRef, useState } from 'react';
import { downsample, type GpxResult, parseGpx } from '../../utils/gpx';
import { LeafletMap } from '../charts/LeafletMap';
import { Icon } from '../ui/Icon';

interface Props {
  onLoaded: (result: GpxResult) => void;
  onRemove: () => void;
  result: GpxResult | null;
  accent?: string;
  label: string;
  hint: string;
  removeLabel: string;
  loadedLabel: string;
  pointsLabel: string;
  filledLabel: string;
}

export function GpxDropzone({
  onLoaded,
  onRemove,
  result,
  accent = 'var(--accent)',
  label,
  hint,
  removeLabel,
  loadedLabel,
  pointsLabel,
  filledLabel,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith('.gpx') && file.type !== 'application/gpx+xml') {
      setError('Please drop a .gpx file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseGpx(e.target?.result as string);
        if (parsed.points.length < 2) throw new Error('No track points found');
        onLoaded(parsed);
      } catch (err) {
        setError((err as Error).message || 'Failed to parse GPX');
      }
    };
    reader.readAsText(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const displayPoints = result ? downsample(result.points, 400) : [];
  const accentHex = accent.startsWith('var') ? '#e8602c' : accent;

  if (result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <LeafletMap points={displayPoints} height={260} accent={accentHex} rounded={12} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Icon name="route" size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
            {loadedLabel}
          </span>
          <span
            style={{ fontSize: 12, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
          >
            {result.points.length.toLocaleString()} {pointsLabel}
          </span>
          <button
            type="button"
            onClick={onRemove}
            style={{
              marginLeft: 'auto',
              border: 0,
              background: 'transparent',
              color: 'var(--text-faint)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Icon name="close" size={13} stroke={2.2} />
            {removeLabel}
          </button>
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--accent)',
            background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
            borderRadius: 8,
            padding: '6px 12px',
          }}
        >
          {filledLabel}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        minHeight: 96,
        width: '100%',
        border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 12,
        background: dragging
          ? 'color-mix(in oklab, var(--accent) 6%, transparent)'
          : 'var(--surface-2)',
        cursor: 'pointer',
        transition: 'all .15s',
        padding: '20px 16px',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".gpx,application/gpx+xml"
        style={{ display: 'none' }}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const input = e.currentTarget;
          const file = input.files?.[0];
          if (file) handleFile(file);
          input.value = '';
        }}
      />
      <Icon
        name="route"
        size={26}
        style={{
          color: dragging ? 'var(--accent)' : 'var(--text-faint)',
          opacity: dragging ? 1 : 0.5,
        }}
      />
      <span style={{ fontSize: 13.5, color: 'var(--text-faint)', textAlign: 'center' }}>
        {hint}
      </span>
      {error && (
        <span style={{ fontSize: 12, color: 'oklch(0.66 0.20 28)', fontWeight: 600 }}>{error}</span>
      )}
    </button>
  );
}
