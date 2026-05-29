import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMiners, MinerInfo } from '../api';
import { formatGF } from '../lib/format';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function Miners() {
  const [miners, setMiners] = useState<MinerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMiners().then(data => setMiners(data.miners)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Storage Miners</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3">Miner</th>
                <th className="text-left px-5 py-3">Capacity</th>
                <th className="text-left px-5 py-3">Used</th>
                <th className="text-left px-5 py-3">Stake</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Proofs</th>
                <th className="text-left px-5 py-3">Success Rate</th>
                <th className="text-left px-5 py-3">Locked Bonus</th>
                <th className="text-left px-5 py-3">Retrievals</th>
                <th className="text-left px-5 py-3">Rewards</th>
                <th className="text-left px-5 py-3">Slashed</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : miners.map(m => (
                <tr key={m.miner_address} className="table-row-hover border-t border-gray-50">
                  <td className="px-5 py-3 font-mono text-gray-500">
                    <Link to={`/miners/${m.miner_address}`} className="hover:text-primary-600">{m.miner_address.slice(0, 12)}...</Link>
                  </td>
                  <td className="px-5 py-3">{formatBytes(m.capacity_bytes)}</td>
                  <td className="px-5 py-3">{formatBytes(m.used_bytes)}</td>
                  <td className="px-5 py-3">{formatGF(m.stake)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    <span className="text-green-600">{m.proof_success}</span> / <span className="text-red-500">{m.proof_failure}</span>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {(() => {
                      const total = (m.proof_success || 0) + (m.proof_failure || 0);
                      return total > 0 ? `${((m.proof_success / total) * 100).toFixed(1)}%` : 'N/A';
                    })()}
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {formatGF(m.locked_bonus || 0)}
                    {m.bonus_released && <span className="ml-1 text-green-600">(released)</span>}
                    {m.bonus_expired && <span className="ml-1 text-red-600">(expired)</span>}
                  </td>
                  <td className="px-5 py-3 text-xs">{m.retrieval_success} ({formatBytes(m.retrieval_bytes)})</td>
                  <td className="px-5 py-3">{formatGF((m.storage_rewards || 0) + (m.retrieval_rewards || 0) + (m.repair_rewards || 0))}</td>
                  <td className="px-5 py-3 text-red-500">{formatGF(m.slashed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
