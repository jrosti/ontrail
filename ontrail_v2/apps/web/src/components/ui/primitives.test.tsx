import { describe, expect, mock, test } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { Icon } from './Icon';
import { Logo } from './Logo';

describe('UI primitives', () => {
  test('Avatar renders initials with sizing and optional ring', () => {
    render(<Avatar initials="PP" color="#4466aa" size={52} ring />);

    const avatar = screen.getByText('PP');
    expect(avatar.style.width).toBe('52px');
    expect(avatar.style.height).toBe('52px');
    expect(avatar.style.background).toBe('#4466aa');
    expect(avatar.style.boxShadow).toContain('var(--accent)');
  });

  test('Card combines classes, padding, hover state, and click handling', () => {
    const onClick = mock(() => {});
    render(
      <Card hover className="custom-card" pad={false} onClick={onClick}>
        Content
      </Card>,
    );

    const card = screen.getByText('Content');
    expect(card.className).toContain('ot-card');
    expect(card.className).toContain('ot-card-hover');
    expect(card.className).toContain('custom-card');
    expect(card.style.padding).toBe('0');
    expect(card.style.cursor).toBe('pointer');

    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('Icon renders filled hearts and falls back to info for unknown names', () => {
    const { container } = render(
      <>
        <Icon name="heart-f" size={18} />
        <Icon name="missing" stroke={3} className="fallback-icon" />
      </>,
    );

    const [heart, fallback] = Array.from(container.querySelectorAll('svg'));
    expect(heart.getAttribute('fill')).toBe('currentColor');
    expect(heart.getAttribute('stroke')).toBe('none');
    expect(heart.getAttribute('width')).toBe('18');
    expect(fallback.getAttribute('class')).toBe('fallback-icon');
    expect(fallback.getAttribute('stroke-width')).toBe('3');
    expect(fallback.querySelector('path')?.getAttribute('d')).toContain('a10 10');
  });

  test('Logo can render with or without wordmark text', () => {
    const { rerender } = render(<Logo size={30} withText />);

    expect(screen.getByText('on')).toBeTruthy();
    expect(screen.getByText('trail')).toBeTruthy();
    expect(document.querySelector('svg')?.getAttribute('width')).toBe('30');

    rerender(<Logo withText={false} />);
    expect(screen.queryByText('on')).toBeNull();
    expect(screen.queryByText('trail')).toBeNull();
  });
});
