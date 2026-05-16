import React from 'react';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '../../types';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onChange: (filters: Partial<LeadFilters>) => void;
  onReset: () => void;
}

const statusOptions: { value: LeadStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const sourceOptions: { value: LeadSource | ''; label: string }[] = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: '🌐 Website' },
  { value: 'Instagram', label: '📸 Instagram' },
  { value: 'Referral', label: '🤝 Referral' },
];

const LeadFiltersBar: React.FC<LeadFiltersBarProps> = ({ filters, onChange, onReset }) => {
  const hasActiveFilters = !!(filters.status || filters.source || filters.search);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          id="leads-search"
          type="text"
          placeholder="Search by name or email..."
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          className="form-input pl-9 pr-9"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ search: '', page: 1 })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <select
          id="filter-status"
          value={filters.status || ''}
          onChange={(e) => onChange({ status: e.target.value as LeadStatus | '', page: 1 })}
          className="form-input pl-9 pr-8 appearance-none min-w-[140px]"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Source Filter */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <select
          id="filter-source"
          value={filters.source || ''}
          onChange={(e) => onChange({ source: e.target.value as LeadSource | '', page: 1 })}
          className="form-input pl-9 pr-8 appearance-none min-w-[140px]"
        >
          {sourceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="relative">
        {filters.sort === 'oldest' ? (
          <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        ) : (
          <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}
        <select
          id="filter-sort"
          value={filters.sort || 'latest'}
          onChange={(e) => onChange({ sort: e.target.value as SortOrder, page: 1 })}
          className="form-input pl-9 pr-8 appearance-none min-w-[120px]"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          id="reset-filters-btn"
          onClick={onReset}
          className="btn-ghost text-sm text-primary-600 dark:text-primary-400"
        >
          <X className="w-3.5 h-3.5" />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default LeadFiltersBar;
