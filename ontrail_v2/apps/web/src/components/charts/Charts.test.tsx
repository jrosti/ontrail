import { describe, expect, mock, test } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  ActivityCalendar,
  Donut,
  Elevation,
  HRZonesBar,
  LineChart,
  Sparkline,
  StackedBars,
} from './Charts';

describe('chart components', () => {
  test('renders sparkline and elevation SVG paths', () => {
    const { container: spark } = render(<Sparkline data={[1, 3, 2, 5]} color="red" height={44} />);
    expect(spark.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 120 44');
    expect(spark.querySelectorAll('path').length).toBe(2);

    const { container: elevation } = render(<Elevation ele={[10, 20, 15]} height={80} />);
    expect(elevation.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 720 80');
    expect(elevation.querySelectorAll('path').length).toBe(2);
  });

  test('renders line charts with ticks, grid labels, and optional area', () => {
    const { container } = render(
      <LineChart
        series={[{ data: [1, 4, 2], color: 'blue' }]}
        xTicks={['Jan', 'Feb', 'Mar']}
        yFmt={(value) => `${Math.round(value)}h`}
        area={false}
      />,
    );

    expect(container.querySelector('svg')).toBeTruthy();
    expect(screen.getByText('Jan')).toBeTruthy();
    expect(screen.getByText('Feb')).toBeTruthy();
    expect(screen.getByText('Mar')).toBeTruthy();
    expect(container.querySelectorAll('path')).toHaveLength(1);
    expect(container.textContent).toContain('h');
  });

  test('renders stacked bars for non-empty parts', () => {
    const { container } = render(
      <StackedBars
        weeks={[
          { week: '2026-W01', total: 3, parts: { run: 2, bike: 1 } },
          { week: '2026-W02', total: 1, parts: { run: 1 } },
        ]}
        keys={['run', 'bike']}
        colorOf={(key) => (key === 'run' ? 'red' : 'blue')}
        xFmt={(week) => week.week.slice(-2)}
      />,
    );

    expect(container.querySelectorAll('rect')).toHaveLength(3);
    expect(screen.getByText('01')).toBeTruthy();
    expect(screen.getByText('02')).toBeTruthy();
  });

  test('renders donut center labels and segments', () => {
    const { container } = render(
      <Donut
        data={[
          { label: 'Run', color: 'red', value: 2 },
          { label: 'Bike', color: 'blue', value: 1 },
        ]}
        centerLabel="3h"
        centerSub="TOTAL"
      />,
    );

    expect(container.querySelectorAll('circle')).toHaveLength(2);
    expect(screen.getByText('3h')).toBeTruthy();
    expect(screen.getByText('TOTAL')).toBeTruthy();
  });

  test('renders HR zones and activity calendar cells', () => {
    const { container: zones } = render(
      <HRZonesBar
        zones={[
          { z: 1, pct: 20, name: { fi: 'Kevyt', en: 'Easy' } },
          { z: 2, pct: 0, name: { fi: 'Perus', en: 'Base' } },
          { z: 3, pct: 80, name: { fi: 'Kova', en: 'Hard' } },
        ]}
      />,
    );
    expect(zones.querySelectorAll('div[title]')).toHaveLength(2);

    const onDayClick = mock(() => {});
    const { container: calendar } = render(
      <ActivityCalendar
        year={2026}
        byDate={new Map([['2026-01-01', 3600]])}
        cell={8}
        gap={2}
        onDayClick={onDayClick}
        lang="en"
      />,
    );
    expect(calendar.querySelectorAll('rect')).toHaveLength(365);
    expect(screen.getByText('Jan')).toBeTruthy();
    expect(screen.getByText('Tu')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '2026-01-01: 60min' }));
    expect(onDayClick).toHaveBeenCalledWith('2026-01-01');
  });
});
