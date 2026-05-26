import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchValidators, ValidatorInfo } from '../api';
import { formatGF } from '../lib/format';

export default function Validators() {
  const [validators, setValidators] = useState<ValidatorInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchValidators().then(data => setValidators(data.validators)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Validators</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3">Validator</th>
                <th className="text-left px-5 py-3">Stake</th>
                <th className="text-left px-5 py-3">Delegated</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Consensus</th>
                <th className="text-left px-5 py-3">Blocks</th>
                <th className="text-left px-5 py-3">Slashed</th>
                <th className="text-left px-5 py-3">Rewards</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : validators.map(v => (
                <tr key={v.validator_address} className="table-row-hover border-t border-gray-50">
                  <td className="px-5 py-3 font-mono text-gray-500">
                    <Link to={`/validators/${v.validator_address}`} className="hover:text-primary-600">{v.validator_address.slice(0, 12)}...</Link>
                  </td>
                  <td className="px-5 py-3">{formatGF(v.stake)}</td>
                  <td className="px-5 py-3">{formatGF(v.delegated_stake)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${v.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {v.consensus 
                      ? <span className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">Yes</span>
                      : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">No</span>
                    }
                  </td>
                  <td className="px-5 py-3">{v.produced_blocks.toLocaleString()}</td>
                  <td className="px-5 py-3 text-red-500">{formatGF(v.slashed)}</td>
                  <td className="px-5 py-3">{formatGF(v.rewards)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
