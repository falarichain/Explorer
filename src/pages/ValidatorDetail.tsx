import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchValidator, ValidatorDetail } from '../api';

function formatTime(unix: number): string {
  if (!unix) return '-';
  return new Date(unix * 1000).toLocaleString();
}

export default function ValidatorDetailPage() {
  const { address } = useParams<{ address: string }>();
  const [validator, setValidator] = useState<ValidatorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!address) return;
    fetchValidator(address)
      .then(setValidator)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [address]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!validator) return <div className="text-center py-20 text-gray-500">Validator not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Validator</h1>
      <p className="text-sm font-mono text-gray-500 mb-6 break-all">{validator.validator_address}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          ['Status', validator.status],
          ['Endpoint', validator.endpoint],
          ['Public Key', validator.public_key?.slice(0, 20) + '...'],
          ['Total Stake', validator.stake.toLocaleString()],
          ['Self Stake', validator.self_stake.toLocaleString()],
          ['Delegated Stake', validator.delegated_stake.toLocaleString()],
          ['Consensus', validator.consensus ? 'Active' : 'Standby'],
          ['Produced Blocks', validator.produced_blocks.toLocaleString()],
          ['Slashed', validator.slashed.toLocaleString()],
          ['Evidence Count', String(validator.evidence_count)],
          ['Delegator Count', String(validator.delegator_count)],
          ['Total Rewards', validator.rewards.toLocaleString()],
          ['Delegation Rewards', validator.delegation_rewards.toLocaleString()],
          ['Registered', formatTime(validator.registered_at_unix)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className="text-sm font-mono text-gray-700 break-all">{value || '-'}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link to={`/accounts/${validator.validator_address}`} className="text-sm text-primary-600 hover:underline">
          View Account →
        </Link>
        <Link to="/validators" className="text-sm text-gray-500 hover:underline">
          ← Back to Validators
        </Link>
      </div>
    </div>
  );
}
