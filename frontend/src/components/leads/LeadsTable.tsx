import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Lead } from '../../types';
import { leadsApi } from '../../api/leads';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { TableSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/StateViews';
import Modal from '../ui/Modal';
import LeadForm from './LeadForm';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onLeadClick: (lead: Lead) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, isLoading, onLeadClick }) => {
  const queryClient = useQueryClient();
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Lead | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: leadsApi.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead deleted successfully');
      setDeleteConfirm(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to delete lead');
    },
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!isLoading && leads.length === 0) {
    return (
      <EmptyState
        title="No leads found"
        description="Try adjusting your filters or create a new lead to get started."
      />
    );
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Source</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          {isLoading ? (
            <TableSkeleton rows={8} cols={6} />
          ) : (
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="group cursor-pointer" onClick={() => onLeadClick(lead)}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {lead.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-gray-500 dark:text-gray-400">{lead.email}</td>
                  <td><StatusBadge status={lead.status} /></td>
                  <td><SourceBadge source={lead.source} /></td>
                  <td className="text-gray-500 dark:text-gray-400 text-xs">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button
                        id={`lead-menu-${lead._id}`}
                        onClick={() => setOpenMenu(openMenu === lead._id ? null : lead._id)}
                        className="btn-ghost btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Lead actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenu === lead._id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10 animate-fade-in">
                          <button
                            onClick={() => { onLeadClick(lead); setOpenMenu(null); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                            id={`view-lead-${lead._id}`}
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                          <button
                            onClick={() => { setEditLead(lead); setOpenMenu(null); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            id={`edit-lead-${lead._id}`}
                          >
                            <Edit2 className="w-4 h-4" /> Edit Lead
                          </button>
                          <button
                            onClick={() => { setDeleteConfirm(lead); setOpenMenu(null); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                            id={`delete-lead-${lead._id}`}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editLead}
        onClose={() => setEditLead(null)}
        title="Edit Lead"
        size="md"
      >
        {editLead && (
          <LeadForm
            lead={editLead}
            onSuccess={() => setEditLead(null)}
            onCancel={() => setEditLead(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Lead"
        size="sm"
      >
        {deleteConfirm && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {deleteConfirm.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm._id)}
                disabled={deleteMutation.isPending}
                className="btn-danger flex-1"
                id="confirm-delete-btn"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Lead'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary"
                id="cancel-delete-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Click outside to close menu */}
      {openMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenMenu(null)}
        />
      )}
    </>
  );
};

export default LeadsTable;
