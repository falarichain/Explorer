import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlocks, BlockSummary } from '../api';
import Pagination from '../components/Pagination';

function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleString();
}

export default function Blocks() {
  const [blocks, setBlocks] = useState<BlockSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBlocks(page).then(data => {
      setBlocks(data.blocks);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Blocks</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3">Height</th>
                <th className="text-left px-5 py-3">Hash</th>
                <th className="text-left px-5 py-3">Txs</th>
                <th className="text-left px-5 py-3">Producer</th>
                <th className="text-left px-5 py-3">Finalized</th>
                <th className="text-left px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : blocks.map(b => (
                <tr key={b.height} className="table-row-hover border-t border-gray-50">
                  <td className="px-5 py-3">
                    <Link to={`/blocks/${b.height}`} className="text-primary-600 hover:underline font-mono">
                      {b.height.toLocaleString()}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-500">
                    <Link to={`/blocks/${b.hash}`} className="hover:text-primary-600">{b.hash.slice(0, 16)}...</Link>
                  </td>
                  <td className="px-5 py-3">{b.tx_count}</td>
                  <td className="px-5 py-3">
                    <Link to={`/accounts/${b.producer_address}`} className="font-mono text-gray-500 hover:text-primary-600">
                      {b.producer_address.slice(0, 12)}...
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    {b.finalized 
                      ? <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">Yes</span>
                      : <span className="text-yellow-600 text-xs bg-yellow-50 px-2 py-0.5 rounded-full">Pending</span>
                    }
                  </td>
                  <td className="px-5 py-3 text-gray-400">{formatTime(b.time_unix)}</td>
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
