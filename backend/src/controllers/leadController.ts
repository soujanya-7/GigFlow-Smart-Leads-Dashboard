import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { IUserPayload, LeadStatus, LeadSource, PaginationMeta } from '../types';
import { createError } from '../middleware/error';
import { FilterQuery } from 'mongoose';
import { ILeadDocument } from '../models/Lead';

interface AuthRequest extends Request {
  user?: IUserPayload;
}

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, status, source, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      notes,
      createdBy: req.user!._id,
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = '1',
      limit = '10',
    } = req.query as {
      status?: LeadStatus;
      source?: LeadSource;
      search?: string;
      sort?: 'latest' | 'oldest';
      page?: string;
      limit?: string;
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filterQuery: FilterQuery<ILeadDocument> = {};

    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      filterQuery.status = status;
    }

    if (source && ['Website', 'Instagram', 'Referral'].includes(source)) {
      filterQuery.source = source;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filterQuery.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    // Sort direction
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filterQuery)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const meta: PaginationMeta = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    };

    res.status(200).json({
      success: true,
      data: leads,
      meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      return next(createError('Lead not found', 404));
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(createError('Lead not found', 404));
    }

    // Sales users can only update their own leads
    if (
      req.user!.role === 'sales' &&
      lead.createdBy.toString() !== req.user!._id
    ) {
      return next(createError('Not authorized to update this lead', 403));
    }

    const { name, email, status, source, notes } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, status, source, notes },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(createError('Lead not found', 404));
    }

    // Sales users can only delete their own leads
    if (
      req.user!.role === 'sales' &&
      lead.createdBy.toString() !== req.user!._id
    ) {
      return next(createError('Not authorized to delete this lead', 403));
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as {
      status?: LeadStatus;
      source?: LeadSource;
      search?: string;
    };

    const filterQuery: FilterQuery<ILeadDocument> = {};

    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      filterQuery.status = status;
    }
    if (source && ['Website', 'Instagram', 'Referral'].includes(source)) {
      filterQuery.source = source;
    }
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filterQuery.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const leads = await Lead.find(filterQuery)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    const csvHeader = 'Name,Email,Status,Source,Notes,Created By,Created At\n';
    const csvRows = leads
      .map(lead => {
        const createdBy = (lead.createdBy as any)?.name || 'N/A';
        const notes = (lead.notes || '').replace(/,/g, ';').replace(/\n/g, ' ');
        return `"${lead.name}","${lead.email}","${lead.status}","${lead.source}","${notes}","${createdBy}","${lead.createdAt.toISOString()}"`;
      })
      .join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leads-${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const getLeadStats = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [total, statusStats, sourceStats] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: statusStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        bySource: sourceStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    next(error);
  }
};
