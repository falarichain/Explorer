// In dev, Vite proxies /api to localhost:9090.
// In production, set VITE_API_BASE to the explorer API URL.
import type {
  AccountInfo,
  BlockDetail,
  BlockSummary,
  DailyStat,
  IntentDetail,
  IntentSummary,
  MinerDetail,
  MinerInfo,
  SearchResult,
  ShardInfo,
  TxDetail,
  TxSummary,
  ValidatorDetail,
  ValidatorInfo,
} from './types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function fetchAPI<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Dashboard status
export async function fetchStatus() {
  return fetchAPI<{
    height: number;
    blocks: number;
    transactions: number;
    intents: number;
    finalized_intents: number;
    miners: number;
    active_miners: number;
    validators: number;
    active_validators: number;
    total_data_bytes: number;
    storage_rewards: number;
    retrieval_rewards: number;
    total_slashed: number;
  }>('/api/status');
}

// Blocks
export async function fetchBlocks(page = 1) {
  return fetchAPI<{ blocks: BlockSummary[]; total: number; page: number; limit: number }>(`/api/blocks?page=${page}`);
}

export async function fetchBlock(heightOrHash: string) {
  return fetchAPI<{ block: BlockDetail; transactions: TxSummary[] }>(`/api/blocks/${heightOrHash}`);
}

export async function fetchLatestBlock() {
  return fetchAPI<BlockDetail>(`/api/blocks/latest`);
}

// Transactions
export async function fetchTransactions(params: { page?: number; block?: string; address?: string; type?: string }) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.block) qs.set('block', params.block);
  if (params.address) qs.set('address', params.address);
  if (params.type) qs.set('type', params.type);
  return fetchAPI<{ transactions: TxSummary[]; page: number; limit: number }>(`/api/txs?${qs}`);
}

export async function fetchTransaction(txID: string) {
  return fetchAPI<TxDetail>(`/api/txs/${txID}`);
}

// Accounts
export async function fetchAccount(address: string) {
  return fetchAPI<AccountInfo>(`/api/accounts/${address}`);
}

// Intents
export async function fetchIntents(page = 1, status?: string, user?: string) {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  if (status) qs.set('status', status);
  if (user) qs.set('user', user);
  return fetchAPI<{ intents: IntentSummary[]; total: number; page: number; limit: number }>(`/api/intents?${qs}`);
}

export async function fetchIntent(intentID: string) {
  return fetchAPI<IntentDetail>(`/api/intents/${intentID}`);
}

export async function fetchIntentShards(intentID: string) {
  return fetchAPI<{ shards: ShardInfo[] }>(`/api/intents/${intentID}/shards`);
}

// Miners
export async function fetchMiners() {
  return fetchAPI<{ miners: MinerInfo[] }>(`/api/miners`);
}

export async function fetchMiner(address: string) {
  return fetchAPI<MinerDetail>(`/api/miners/${address}`);
}

// Validators
export async function fetchValidators() {
  return fetchAPI<{ validators: ValidatorInfo[] }>(`/api/validators`);
}

export async function fetchValidator(address: string) {
  return fetchAPI<ValidatorDetail>(`/api/validators/${address}`);
}

// Search
export async function fetchSearch(q: string) {
  return fetchAPI<{ results: SearchResult[] }>(`/api/search?q=${encodeURIComponent(q)}`);
}

// Daily stats
export async function fetchDailyStats() {
  return fetchAPI<{ daily_stats: DailyStat[] }>(`/api/stats/daily`);
}

// Re-export types from types.ts
export type {
  BlockSummary,
  BlockDetail,
  TxSummary,
  TxDetail,
  AccountInfo,
  IntentSummary,
  IntentDetail,
  ShardInfo,
  MinerInfo,
  MinerDetail,
  ValidatorInfo,
  ValidatorDetail,
  SearchResult,
  DailyStat,
} from './types';
