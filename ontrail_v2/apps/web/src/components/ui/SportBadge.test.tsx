import { describe, expect, test } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { SportBadge } from './SportBadge';

describe('SportBadge', () => {
  test('renders Finnish sport names', () => {
    render(<SportBadge sport="run" lang="fi" />);

    expect(screen.getByText('Juoksu')).toBeTruthy();
  });

  test('renders English sport names', () => {
    render(<SportBadge sport="run" lang="en" />);

    expect(screen.getByText('Running')).toBeTruthy();
  });
});
