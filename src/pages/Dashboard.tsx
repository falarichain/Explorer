import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { fetchStatus, fetchBlocks, BlockSummary } from '../api';
import { Blocks, FileText, Activity, Shield, HardDrive, ArrowRight } from 'lucide-react';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleString();
}

export default function Dashboard() {
  const [status, setStatus] = useState<any>(null);
  const [recentBlocks, setRecentBlocks] = useState<BlockSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, b] = await Promise.all([fetchStatus(), fetchBlocks(1)]);
        setStatus(s);
        setRecentBlocks(b.blocks.slice(0, 10));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" /></div>;
  }

  if (!status) {
    return <div className="text-center py-20 text-gray-500">Unable to connect to explorer API (port 9090)</div>;
  }

  const stats = [
    { label: 'Chain Height', value: status.height?.toLocaleString() || '0', icon: <Blocks className="w-5 h-5" /> },
    { label: 'Transactions', value: status.transactions?.toLocaleString() || '0', icon: <Activity className="w-5 h-5" /> },
    { label: 'Active Miners', value: `${status.active_miners || 0} / ${status.miners || 0}`, icon: <HardDrive className="w-5 h-5" /> },
    { label: 'Validators', value: `${status.active_validators || 0} / ${status.validators || 0}`, icon: <Shield className="w-5 h-5" /> },
    { label: 'Deals (intents)', value: status.intents?.toLocaleString() || '0', sub: `${status.finalized_intents || 0} finalized`, icon: <FileText className="w-5 h-5" /> },
    { label: 'Data Stored', value: formatBytes(status.total_data_bytes || 0) },
    { label: 'Storage Rewards', value: (status.storage_rewards || 0).toLocaleString() },
    { label: 'Total Slashed', value: (status.total_slashed || 0).toLocaleString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Falari Network Overview</h1>
      
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} icon={s.icon} sub={s.sub} />
        ))}
      </div>

      {/* Recent blocks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Blocks</h2>
          <Link to="/blocks" className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3">Height</th>
                <th className="text-left px-5 py-3">Hash</th>
                <th className="text-left px-5 py-3">Txs</th>
                <th className="text-left px-5 py-3">Producer</th>
                <th className="text-left px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentBlocks.map((b) => (
                <tr key={b.height} className="table-row-hover border-t border-gray-50">
                  <td className="px-5 py-3">
                    <Link to={`/blocks/${b.height}`} className="text-primary-600 hover:underline font-mono">
                      {b.height.toLocaleString()}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-500">
                    <Link to={`/blocks/${b.hash}`} className="hover:text-primary-600">
                      {b.hash.slice(0, 16)}...
                    </Link>
                  </td>
                  <td className="px-5 py-3">{b.tx_count}</td>
                  <td className="px-5 py-3 font-mono text-gray-500">
                    <Link to={`/accounts/${b.producer_address}`} className="hover:text-primary-600">
                      {b.producer_address.slice(0, 12)}...
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{formatTime(b.time_unix)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
