import React from 'react';
import { X, Mail, Calendar, User } from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onEdit: () => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onClose, onEdit }) => {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const createdByName =
    typeof lead.createdBy === 'object' ? lead.createdBy.name : 'N/A';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
            {lead.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5 mt-1">
            <Mail className="w-3.5 h-3.5" />
            {lead.email}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={lead.status} />
        <SourceBadge source={lead.source} />
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <User className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Created By</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{createdByName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Created At</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatDate(lead.createdAt)}
            </p>
          </div>
        </div>

        {lead.notes && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Notes</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {lead.notes}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={onEdit} className="btn-primary flex-1" id="detail-edit-btn">
          Edit Lead
        </button>
        <button onClick={onClose} className="btn-secondary" id="detail-close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default LeadDetail;
