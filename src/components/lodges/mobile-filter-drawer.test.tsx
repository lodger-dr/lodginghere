import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileFilterDrawer } from './mobile-filter-drawer';

describe('MobileFilterDrawer', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    selectedUniSlug: 'university-of-lagos',
    onSelectUni: vi.fn(),
    accommodationType: '',
    onChangeAccommodationType: vi.fn(),
    maxBudget: '',
    onChangeMaxBudget: vi.fn(),
    selectedAmenities: [] as any[],
    onToggleAmenity: vi.fn(),
    verifiedOnly: true,
    onToggleVerifiedOnly: vi.fn(),
    sortBy: 'recommended' as const,
    onChangeSortBy: vi.fn(),
    totalResultsCount: 12,
    onReset: vi.fn(),
    activeFilterCount: 2,
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<MobileFilterDrawer {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders filter drawer content and active filter count badge when open', () => {
    render(<MobileFilterDrawer {...defaultProps} />);

    expect(screen.getByRole('dialog', { name: /filter accommodation listings/i })).toBeDefined();
    expect(screen.getByText('Filter Lodges')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined(); // activeFilterCount badge
    expect(screen.getByText(/Show 12 Lodges/i)).toBeDefined();
  });

  it('triggers onReset when Reset All button is clicked', () => {
    const onReset = vi.fn();
    render(<MobileFilterDrawer {...defaultProps} onReset={onReset} />);

    const resetBtn = screen.getByRole('button', { name: /reset all/i });
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when Show Lodges button is clicked', () => {
    const onClose = vi.fn();
    render(<MobileFilterDrawer {...defaultProps} onClose={onClose} />);

    const showBtn = screen.getByRole('button', { name: /show 12 lodges/i });
    fireEvent.click(showBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onChangeAccommodationType when a room type button is clicked', () => {
    const onChangeAccommodationType = vi.fn();
    render(<MobileFilterDrawer {...defaultProps} onChangeAccommodationType={onChangeAccommodationType} />);

    const selfConBtn = screen.getByRole('button', { name: /self-con/i });
    fireEvent.click(selfConBtn);
    expect(onChangeAccommodationType).toHaveBeenCalledWith('self_contained');
  });

  it('triggers onChangeMaxBudget when a budget preset is clicked', () => {
    const onChangeMaxBudget = vi.fn();
    render(<MobileFilterDrawer {...defaultProps} onChangeMaxBudget={onChangeMaxBudget} />);

    const budgetBtn = screen.getByRole('button', { name: /< ₦400k/i });
    fireEvent.click(budgetBtn);
    expect(onChangeMaxBudget).toHaveBeenCalledWith('400000');
  });
});
