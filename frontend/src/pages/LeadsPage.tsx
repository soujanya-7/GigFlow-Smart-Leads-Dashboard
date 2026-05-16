import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsApi } from '../api/leads';
import { Lead, LeadFilters } from '../types';
import Header from '../components/layout/Header';
import LeadsTable from '../components/leads/LeadsTable';
import LeadFiltersBar from '../components/leads/LeadFiltersBar';
import LeadForm from '../components/leads/LeadForm';
import LeadDetail from '../components/leads/LeadDetail';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { ErrorState } from '../components/ui/StateViews';
import useDebounce from '../hooks/useDebounce';

const DEFAULT_FILTERS: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
  limit: 10,
};

const LeadsPage: React.FC = () => {
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editFromDetail, setEditFromDetail] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Debounce search by 500ms
  const debouncedSearch = useDebounce(filters.search || '', 500);

  const queryFilters: LeadFilters = {
    ...filters,
    search: debouncedSearch,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leads', queryFilters],
    queryFn: () => leadsApi.getLeads(queryFilters),
    placeholderData: (prev) => prev,
  });

  const leads = data?.data || [];
  const meta = data?.meta;

  const handleFilterChange = (partial: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      await leadsApi.exportCSV({
        status: filters.status,
        source: filters.source,
        search: debouncedSearch,
      });
      toast.success('CSV exported successfully!');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return (
      <div>
        <Header title="Leads" subtitle="Manage your leads" />
        <div className="p-6">
          <ErrorState message="Failed to load leads" onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Leads" subtitle={`${meta?.total ?? 0} total leads`} />

      <div className="p-6 space-y-5 animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <LeadFiltersBar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="btn-secondary"
              id="export-csv-btn"
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export CSV
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="btn-primary"
              id="add-lead-btn"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <LeadsTable
            leads={leads}
            isLoading={isLoading}
            onLeadClick={(lead) => setSelectedLead(lead)}
          />

          {/* Pagination */}
          {meta && (
            <Pagination
              meta={meta}
              onPageChange={(page) => handleFilterChange({ page })}
            />
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Lead"
        size="md"
      >
        <LeadForm
          onSuccess={() => setIsCreateOpen(false)}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Lead Detail Modal */}
      <Modal
        isOpen={!!selectedLead && !editFromDetail}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
        size="md"
      >
        {selectedLead && (
          <LeadDetail
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onEdit={() => {
              setEditFromDetail(selectedLead);
              setSelectedLead(null);
            }}
          />
        )}
      </Modal>

      {/* Edit from detail */}
      <Modal
        isOpen={!!editFromDetail}
        onClose={() => setEditFromDetail(null)}
        title="Edit Lead"
        size="md"
      >
        {editFromDetail && (
          <LeadForm
            lead={editFromDetail}
            onSuccess={() => setEditFromDetail(null)}
            onCancel={() => setEditFromDetail(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default LeadsPage;
