import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leadsApi } from '../../api/leads';
import { Lead, LeadStatus, LeadSource } from '../../types';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost'] as const),
  source: z.enum(['Website', 'Instagram', 'Referral'] as const),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: lead?.name || '',
      email: lead?.email || '',
      status: lead?.status || 'New',
      source: lead?.source || 'Website',
      notes: lead?.notes || '',
    },
  });

  const createMutation = useMutation({
    mutationFn: leadsApi.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead created successfully!');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to create lead');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeadFormData }) =>
      leadsApi.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead updated successfully!');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to update lead');
    },
  });

  const onSubmit = (data: LeadFormData) => {
    if (isEditing && lead) {
      updateMutation.mutate({ id: lead._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const statusOptions: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
  const sourceOptions: LeadSource[] = ['Website', 'Instagram', 'Referral'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="lead-name" className="form-label">Full Name *</label>
        <input
          id="lead-name"
          type="text"
          placeholder="Enter lead's full name"
          className="form-input"
          {...register('name')}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="lead-email" className="form-label">Email Address *</label>
        <input
          id="lead-email"
          type="email"
          placeholder="lead@example.com"
          className="form-input"
          {...register('email')}
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      {/* Status and Source */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="lead-status" className="form-label">Status *</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select id="lead-status" className="form-input" {...field}>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          />
          {errors.status && <p className="form-error">{errors.status.message}</p>}
        </div>

        <div>
          <label htmlFor="lead-source" className="form-label">Source *</label>
          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <select id="lead-source" className="form-input" {...field}>
                {sourceOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          />
          {errors.source && <p className="form-error">{errors.source.message}</p>}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="lead-notes" className="form-label">Notes</label>
        <textarea
          id="lead-notes"
          rows={3}
          placeholder="Add any notes about this lead..."
          className="form-input resize-none"
          {...register('notes')}
        />
        {errors.notes && <p className="form-error">{errors.notes.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="btn-primary flex-1"
          id={isEditing ? 'update-lead-btn' : 'create-lead-btn'}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Lead' : 'Create Lead'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          id="cancel-lead-btn"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
