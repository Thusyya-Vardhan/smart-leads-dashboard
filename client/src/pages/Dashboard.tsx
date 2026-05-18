import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { exportToCSV } from '../utils/csvExport';
import Navbar from '../components/Navbar';
import type { ILead, IPagination } from '../types';

// Status badge colors
const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  Qualified: 'bg-green-100 text-green-700',
  Lost: 'bg-red-100 text-red-700',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<ILead[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);

  // Debounce search to avoid API call on every keystroke
  const debouncedSearch = useDebounce(search, 500);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState<ILead | null>(null);
  const [form, setForm] = useState({ name: '', email: '', status: 'New', source: 'Website' });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (status) params.append('status', status);
      if (source) params.append('source', source);
      params.append('sort', sort);
      params.append('page', String(page));
      params.append('limit', '10');

      const res = await api.get(`/leads?${params.toString()}`);
      setLeads(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, source, sort, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source, sort]);

  const openCreate = () => {
    setEditLead(null);
    setForm({ name: '', email: '', status: 'New', source: 'Website' });
    setShowModal(true);
  };

  const openEdit = (lead: ILead) => {
    setEditLead(lead);
    setForm({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editLead) {
        await api.put(`/leads/${editLead._id}`, form);
      } else {
        await api.post('/leads', form);
      }
      setShowModal(false);
      fetchLeads();
    } catch {
      alert('Failed to save lead');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch {
      alert('Failed to delete lead');
    }
  };

  const handleExport = async () => {
    // Fetch all leads without pagination for export
    const res = await api.get('/leads?limit=1000');
    exportToCSV(res.data.data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Leads</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{pagination.total} total leads</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
            >
              Export CSV
            </button>
            <button
              onClick={openCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              + Add Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-6 flex flex-wrap gap-3 shadow-sm">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={source}
            onChange={e => setSource(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading leads...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No leads found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600 dark:text-gray-300 font-medium">Name</th>
                  <th className="text-left px-6 py-3 text-gray-600 dark:text-gray-300 font-medium">Email</th>
                  <th className="text-left px-6 py-3 text-gray-600 dark:text-gray-300 font-medium">Status</th>
                  <th className="text-left px-6 py-3 text-gray-600 dark:text-gray-300 font-medium">Source</th>
                  <th className="text-left px-6 py-3 text-gray-600 dark:text-gray-300 font-medium">Created</th>
                  <th className="text-left px-6 py-3 text-gray-600 dark:text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{lead.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{lead.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{lead.source}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => openEdit(lead)}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Edit
                      </button>
                      {/* Only admin can delete */}
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="text-red-500 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">Page {page} of {pagination.pages}</span>
            <button
              disabled={page === pagination.pages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editLead ? 'Edit Lead' : 'Add New Lead'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.source}
                  onChange={e => setForm({ ...form, source: e.target.value })}
                >
                  <option>Website</option>
                  <option>Instagram</option>
                  <option>Referral</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editLead ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;