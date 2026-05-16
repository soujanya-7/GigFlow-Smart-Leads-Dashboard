import React from 'react';
import { LeadStatus, LeadSource } from '../../types';

const statusConfig: Record<LeadStatus, { label: string; className: string; dot: string }> = {
  New: { label: 'New', className: 'badge-new', dot: 'bg-blue-500' },
  Contacted: { label: 'Contacted', className: 'badge-contacted', dot: 'bg-yellow-500' },
  Qualified: { label: 'Qualified', className: 'badge-qualified', dot: 'bg-green-500' },
  Lost: { label: 'Lost', className: 'badge-lost', dot: 'bg-red-500' },
};

const sourceConfig: Record<LeadSource, { label: string; className: string }> = {
  Website: { label: '🌐 Website', className: 'badge-website' },
  Instagram: { label: '📸 Instagram', className: 'badge-instagram' },
  Referral: { label: '🤝 Referral', className: 'badge-referral' },
};

export const StatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span className={config.className}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export const SourceBadge: React.FC<{ source: LeadSource }> = ({ source }) => {
  const config = sourceConfig[source];
  return <span className={config.className}>{config.label}</span>;
};
