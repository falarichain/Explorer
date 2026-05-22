import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAccount, fetchTransactions, AccountInfo, TxSummary } from '../api';

export default function AccountPage() {
  const { address } = useParams<{ address: string }>();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [txs, setTxs] = useState<TxSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    Promise.all([
      fetchAccount(address),
      fetchTransactions({ address, page: 1 })
    ]).then(([acc, txData]) => {
      setAccount(acc);
      setTxs(txData.transactions);
    }).catch(e => setError(e.message))
    .finally(() => setLoading(false));
  }, [address]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!account) return <div className="text-center py-20 text-gray-500">Account not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Account</h1>
      <p className="text-sm font-mono text-gray-500 mb-6 break-all">{account.address}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          ['Balance', account.balance.toLocaleString()],
          ['Nonce', String(account.nonce)],
          ['Locked Stake', account.locked_stake.toLocaleString()],
          ['Locked Storage', account.locked_storage.toLocaleString()],
        ].map(([label, value]) => (
          <div key={label} className="stat-card">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className="text-lg font-bold text-gray-900">{value}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3">Tx ID</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Block</th>
                <th className="text-left px-5 py-3">Fee</th>
              </tr>
            </thead>
            <tbody>
              {txs.map(tx => (
                <tr key={tx.tx_id} className="table-row-hover border-t border-gray-50">
                  <td className="px-5 py-3 font-mono">
                    <Link to={`/tx/${tx.tx_id}`} className="text-primary-600 hover:underline">{tx.tx_id.slice(0, 16)}...</Link>
                  </td>
                  <td className="px-5 py-3"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{tx.type}</span></td>
                  <td className="px-5 py-3">
                    <Link to={`/blocks/${tx.block_height}`} className="text-primary-600 hover:underline">{tx.block_height}</Link>
                  </td>
                  <td className="px-5 py-3">{tx.fee}</td>
                </tr>
              ))}
              {txs.length === 0 && (
                <tr><td colSpan={4} className="text-center py-6 text-gray-400">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
