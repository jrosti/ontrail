import type { KeyboardEvent } from 'react';
import type { Care } from '../../types';

const DEFAULT_EMOJIS = ['❤️', '👏', '🔥', '💪', '🏅', '😍'];
const MORE_EMOJIS = [
  '🎉',
  '⚡',
  '🌟',
  '🏆',
  '💯',
  '🙌',
  '😊',
  '🤩',
  '😎',
  '💨',
  '🧗',
  '🚵',
  '🏊',
  '🎽',
  '🥇',
  '🦁',
  '🐻',
  '🌈',
  '☀️',
  '❄️',
];

export { DEFAULT_EMOJIS };

interface CareAvatarsProps {
  cares: Care[];
  size?: number;
}

export function CareAvatars({ cares, size = 36 }: CareAvatarsProps) {
  if (cares.length === 0) return null;
  const visible = cares.slice(0, 6);
  const rest = cares.length - visible.length;
  const fontSize = Math.round(size * 0.36);
  const emojiFontSize = Math.round(size * 0.4);
  const emojiOffset = -Math.round(size * 0.14);
  return (
    <div className="ot-care-avatars" title={`${cares.length} kehuja`}>
      {visible.map((c, i) => (
        <div
          key={c.authorId}
          className="ot-care-avatar"
          style={{ zIndex: visible.length - i }}
          title={`${c.authorUsername}: ${c.emoji}`}
        >
          <div
            className="ot-care-squircle"
            style={{ background: c.avatarColor, width: size, height: size }}
          >
            <span className="ot-care-initials" style={{ fontSize }}>
              {c.avatarInitials}
            </span>
          </div>
          <span
            className="ot-care-emoji"
            style={{ fontSize: emojiFontSize, bottom: emojiOffset, right: emojiOffset }}
          >
            {c.emoji}
          </span>
        </div>
      ))}
      {rest > 0 && (
        <div
          className="ot-care-more"
          style={{ width: size, height: size, fontSize: Math.round(size * 0.32) }}
          title={`${rest} muuta`}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}

interface EmojiPickerProps {
  onPick: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onPick, onClose }: EmojiPickerProps) {
  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="ot-emoji-picker" role="dialog" aria-label="Valitse emoji" onKeyDown={handleKey}>
      <div className="ot-emoji-defaults">
        {DEFAULT_EMOJIS.map((em) => (
          <button
            key={em}
            type="button"
            className="ot-emoji-btn"
            onClick={() => onPick(em)}
            aria-label={em}
          >
            {em}
          </button>
        ))}
      </div>
      <div className="ot-emoji-more">
        {MORE_EMOJIS.map((em) => (
          <button
            key={em}
            type="button"
            className="ot-emoji-btn"
            onClick={() => onPick(em)}
            aria-label={em}
          >
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}
