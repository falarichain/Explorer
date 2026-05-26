import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMiner, MinerDetail } from '../api';
import { formatGF } from '../lib/format';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTime(unix: number): string {
  if (!unix) return '-';
  return new Date(unix * 1000).toLocaleString();
}

export default function MinerDetailPage() {
  const { address } = useParams<{ address: string }>();
  const [miner, setMiner] = useState<MinerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!address) return;
    fetchMiner(address)
      .then(setMiner)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [address]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!miner) return <div className="text-center py-20 text-gray-500">Miner not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Storage Miner</h1>
      <p className="text-sm font-mono text-gray-500 mb-6 break-all">{miner.miner_address}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          ['Status', miner.status],
          ['Endpoint', miner.endpoint],
          ['Public Key', miner.public_key?.slice(0, 20) + '...'],
          ['Capacity', formatBytes(miner.capacity_bytes)],
          ['Used', formatBytes(miner.used_bytes)],
          ['Reserved', formatBytes(miner.reserved_bytes)],
          ['Stake', formatGF(miner.stake)],
          ['Proofs (OK/Fail)', `${miner.proof_success} / ${miner.proof_failure}`],
          ['Consecutive Failures', String(miner.consecutive_failures)],
          ['Retrieval Success', String(miner.retrieval_success)],
          ['Retrieval Bytes', formatBytes(miner.retrieval_bytes)],
          ['Storage Rewards', formatGF(miner.storage_rewards)],
          ['Retrieval Rewards', formatGF(miner.retrieval_rewards)],
          ['Repair Rewards', formatGF(miner.repair_rewards)],
          ['Total Rewards', formatGF(miner.rewards)],
          ['Slashed', formatGF(miner.slashed)],
          ['Effective Weight', String(miner.effective_weight)],
          ['Speed Score', String(miner.speed_score)],
          ['Anti-Spam Score', String(miner.anti_spam_score)],
          ['Registered', formatTime(miner.registered_at_unix)],
          ['Last Seen', formatTime(miner.last_seen_unix)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className="text-sm font-mono text-gray-700 break-all">{value || '-'}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link to={`/accounts/${miner.miner_address}`} className="text-sm text-primary-600 hover:underline">
          View Account →
        </Link>
        <Link to="/miners" className="text-sm text-gray-500 hover:underline">
          ← Back to Miners
        </Link>
      </div>
    </div>
  );
}
