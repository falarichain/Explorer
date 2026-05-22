import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlock, BlockDetail, TxSummary } from '../api';

function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleString();
}

export default function BlockDetailPage() {
  const { heightOrHash } = useParams<{ heightOrHash: string }>();
  const [block, setBlock] = useState<BlockDetail | null>(null);
  const [txs, setTxs] = useState<TxSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!heightOrHash) return;
    setLoading(true);
    fetchBlock(heightOrHash)
      .then(data => { setBlock(data.block); setTxs(data.transactions); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [heightOrHash]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!block) return <div className="text-center py-20 text-gray-500">Block not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Block <span className="font-mono text-primary-600">#{block.height.toLocaleString()}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          ['Hash', block.hash],
          ['Previous Hash', block.prev_hash],
          ['Timestamp', formatTime(block.time_unix)],
          ['Producer', block.producer_address],
          ['Tx Root', block.tx_root],
          ['State Root', block.state_root],
          ['Receipts Root', block.receipts_root],
          ['Transactions', String(block.tx_count)],
          ['Finalized', block.finalized ? 'Yes' : 'No'],
          ['Voting Power', `${block.voting_power} / ${block.total_power}`],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className="text-sm font-mono text-gray-700 break-all">{value || '-'}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Transactions ({txs.length})</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3">Tx ID</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">From</th>
                <th className="text-left px-5 py-3">Fee</th>
              </tr>
            </thead>
            <tbody>
              {txs.map(tx => (
                <tr key={tx.tx_id} className="table-row-hover border-t border-gray-50">
                  <td className="px-5 py-3 font-mono">
                    <Link to={`/tx/${tx.tx_id}`} className="text-primary-600 hover:underline">
                      {tx.tx_id.slice(0, 16)}...
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{tx.type}</span>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-500">
                    <Link to={`/accounts/${tx.from}`} className="hover:text-primary-600">{tx.from.slice(0, 12)}...</Link>
                  </td>
                  <td className="px-5 py-3">{tx.fee}</td>
                </tr>
              ))}
              {txs.length === 0 && (
                <tr><td colSpan={4} className="text-center py-6 text-gray-400">No transactions in this block</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
