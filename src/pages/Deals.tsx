import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchIntents, IntentSummary } from '../api';
import Pagination from '../components/Pagination';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const statusColors: Record<string, string> = {
  active: 'bg-green-50 text-green-600',
  uploading: 'bg-blue-50 text-blue-600',
  finalizing: 'bg-yellow-50 text-yellow-600',
  expired: 'bg-red-50 text-red-600',
  partial: 'bg-yellow-50 text-yellow-600',
  finalized: 'bg-green-50 text-green-600',
  deleted: 'bg-gray-50 text-gray-600',
};

export default function Deals() {
  const [intents, setIntents] = useState<IntentSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchIntents(page).then(data => {
      setIntents(data.intents);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Storage Deals (Intents)</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3">Intent ID</th>
                <th className="text-left px-5 py-3">File Name</th>
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Size</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Fee</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : intents.map(i => (
                <tr key={i.intent_id} className="table-row-hover border-t border-gray-50">
                  <td className="px-5 py-3 font-mono">
                    <Link to={`/intents/${i.intent_id}`} className="text-primary-600 hover:underline">
                      {i.intent_id.slice(0, 16)}...
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{i.file_name || '-'}</td>
                  <td className="px-5 py-3 font-mono text-gray-500">
                    <Link to={`/accounts/${i.user}`} className="hover:text-primary-600">{i.user.slice(0, 12)}...</Link>
                  </td>
                  <td className="px-5 py-3">{formatBytes(i.file_size)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[i.status] || 'bg-gray-100 text-gray-600'}`}>
                      {i.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">{i.locked_fee.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} total={total} limit={20} onPageChange={setPage} />
    </div>
  );
}
