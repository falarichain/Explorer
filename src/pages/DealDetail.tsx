import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchIntent, fetchIntentShards, IntentDetail, ShardInfo } from '../api';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function DealDetailPage() {
  const { intentID } = useParams<{ intentID: string }>();
  const [intent, setIntent] = useState<IntentDetail | null>(null);
  const [shards, setShards] = useState<ShardInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!intentID) return;
    Promise.all([
      fetchIntent(intentID),
      fetchIntentShards(intentID)
    ]).then(([i, s]) => {
      setIntent(i);
      setShards(s.shards);
    }).catch(e => setError(e.message))
    .finally(() => setLoading(false));
  }, [intentID]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!intent) return <div className="text-center py-20 text-gray-500">Intent not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Storage Deal</h1>
      <p className="text-sm font-mono text-gray-500 mb-6 break-all">{intent.intent_id}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          ['File Name', intent.file_name],
          ['File Size', formatBytes(intent.file_size)],
          ['Status', intent.status],
          ['Storage Status', intent.storage_status],
          ['Access', intent.access_status],
          ['Deal ID', intent.deal_id],
          ['Locked Fee', intent.locked_fee.toLocaleString()],
          ['Paid Fee', intent.paid_fee.toLocaleString()],
          ['Uploaded', formatBytes(intent.uploaded_size)],
          ['Erasure', `${intent.erasure.data_shards}+${intent.erasure.parity_shards} / ${intent.erasure.shard_size}B`],
          ['Policy', intent.policy ? `${intent.policy.class} / ${intent.policy.duration}s` : '-'],
          ['Committed Segments', String(intent.committed_segments)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className="text-sm text-gray-700 break-all">{value || '-'}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Shard Distribution ({shards.length})</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3">Segment</th>
                <th className="text-left px-5 py-3">Shard</th>
                <th className="text-left px-5 py-3">Miner</th>
                <th className="text-left px-5 py-3">CID</th>
                <th className="text-left px-5 py-3">Size</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {shards.map((s, i) => (
                <tr key={i} className="table-row-hover border-t border-gray-50">
                  <td className="px-5 py-3 font-mono">{s.segment_id}</td>
                  <td className="px-5 py-3 font-mono">{s.shard_index}</td>
                  <td className="px-5 py-3 font-mono text-gray-500">
                    <Link to={`/accounts/${s.miner_address}`} className="hover:text-primary-600">{s.miner_address.slice(0, 12)}...</Link>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-400 text-xs">{s.shard_cid?.slice(0, 16)}...</td>
                  <td className="px-5 py-3">{formatBytes(s.shard_size)}</td>
                  <td className="px-5 py-3">
                    {s.committed
                      ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Committed</span>
                      : <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Pending</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
