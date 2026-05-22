import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchSearch, SearchResult } from '../api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setLoading(false); return; }
    setLoading(true);
    fetchSearch(q).then(data => setResults(data.results)).finally(() => setLoading(false));
  }, [q]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h1>
      <p className="text-sm text-gray-500 mb-6">Query: &ldquo;{q}&rdquo;</p>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" /></div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No results found for &ldquo;{q}&rdquo;</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">ID / Name</th>
                  <th className="text-left px-5 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  let link = '#';
                  let id = '';
                  let detail = '';
                  
                  if (r.type === 'block') {
                    link = `/blocks/${r.height}`;
                    id = `Block #${r.height}`;
                    detail = `Hash: ${r.hash?.slice(0, 20)}...`;
                  } else if (r.type === 'transaction') {
                    link = `/tx/${r.tx_id}`;
                    id = r.tx_id?.slice(0, 20) + '...' || '';
                    detail = `Type: ${r.tx_type} | From: ${r.from?.slice(0, 12)}... | Block: ${r.block_height}`;
                  } else if (r.type === 'intent') {
                    link = `/intents/${r.intent_id}`;
                    id = r.file_name || r.intent_id?.slice(0, 20) + '...' || '';
                    detail = `User: ${r.user?.slice(0, 12)}... | Status: ${r.status}`;
                  }

                  return (
                    <tr key={i} className="table-row-hover border-t border-gray-50">
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          r.type === 'block' ? 'bg-blue-50 text-blue-600' :
                          r.type === 'transaction' ? 'bg-purple-50 text-purple-600' :
                          'bg-green-50 text-green-600'
                        }`}>
                          {r.type}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Link to={link} className="text-primary-600 hover:underline font-mono text-sm">{id}</Link>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">{detail}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
