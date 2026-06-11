import { describe, expect, test } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Metric } from './Metric';

describe('Metric', () => {
  test('renders value, unit, and label', () => {
    render(<Metric value="12,50" unit="km" label="Matka" />);

    expect(screen.getByText('12,50')).toBeTruthy();
    expect(screen.getByText('km')).toBeTruthy();
    expect(screen.getByText('Matka')).toBeTruthy();
  });

  test('renders without unit when not provided', () => {
    render(<Metric value="45 min" label="Kesto" />);

    expect(screen.getByText('45 min')).toBeTruthy();
    expect(screen.getByText('Kesto')).toBeTruthy();
  });
});
