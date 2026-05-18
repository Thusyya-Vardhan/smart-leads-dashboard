import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../middleware/auth';

// GET /api/leads - with filters, search, sort, pagination
export const getLeads = async (req: AuthRequest, res: Response) => {
  try {
    const { status, source, search, sort, page = 1, limit = 10 } = req.query;

    const query: Record<string, unknown> = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/leads/:id
export const getLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/leads
export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user?.id });
    res.status(201).json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/leads/:id
export const updateLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/leads/:id - admin only
export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};