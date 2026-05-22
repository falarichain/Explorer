import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTransaction, TxDetail } from '../api';

function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleString();
}

export default function TransactionPage() {
  const { txID } = useParams<{ txID: string }>();
  const [tx, setTx] = useState<TxDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!txID) return;
    fetchTransaction(txID)
      .then(setTx)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [txID]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!tx) return <div className="text-center py-20 text-gray-500">Transaction not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaction</h1>
      <p className="text-sm font-mono text-gray-500 mb-6 break-all">{tx.tx_id}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          ['Type', tx.type],
          ['From', tx.from],
          ['Nonce', String(tx.nonce)],
          ['Fee', String(tx.fee)],
          ['Payload Hash', tx.payload_hash],
          ['Block', tx.block_height ? String(tx.block_height) : '-'],
          ['Block Hash', tx.block_hash],
          ['Producer', tx.producer],
          ['Timestamp', formatTime(tx.created_at_unix)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className="text-sm font-mono text-gray-700 break-all">
              {label === 'From' ? <Link to={`/accounts/${value}`} className="text-primary-600 hover:underline">{value}</Link>
               : label === 'Block' ? <Link to={`/blocks/${value}`} className="text-primary-600 hover:underline">{value}</Link>
               : label === 'Block Hash' ? <Link to={`/blocks/${value}`} className="text-primary-600 hover:underline">{value?.slice(0, 16)}...</Link>
               : value || '-'}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payload</h2>
      <div className="bg-white rounded-xl border border-gray-100 p-5 overflow-auto">
        <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">{JSON.stringify(tx.payload, null, 2)}</pre>
      </div>
    </div>
  );
}
