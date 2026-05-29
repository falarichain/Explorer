// ============ Explorer Type Definitions ============

export interface BlockSummary {
  height: number;
  hash: string;
  prev_hash: string;
  time_unix: number;
  tx_count: number;
  producer_address: string;
  finalized: boolean;
}

export interface BlockDetail {
  height: number;
  hash: string;
  prev_hash: string;
  time_unix: number;
  tx_count: number;
  producer_address: string;
  producer_public_key: string;
  tx_root: string;
  state_root: string;
  receipts_root: string;
  signature: string;
  finalized: boolean;
  voting_power: number;
  total_power: number;
}

export interface TxSummary {
  tx_id: string;
  type: string;
  from: string;
  nonce: number;
  fee: number;
  payload_hash: string;
  payload: any;
  block_height: number;
  created_at_unix: number;
}

export interface TxDetail {
  tx_id: string;
  type: string;
  from: string;
  nonce: number;
  nonce_protected: boolean;
  fee: number;
  payload_hash: string;
  payload: any;
  block_height: number;
  block_hash: string;
  producer: string;
  block_time_unix: number;
  created_at_unix: number;
}

export interface AccountInfo {
  address: string;
  balance: number;
  nonce: number;
  locked_stake: number;
  locked_storage: number;
  tx_count: number;
}

export interface IntentSummary {
  intent_id: string;
  user: string;
  file_name: string;
  file_size: number;
  status: string;
  storage_status: string;
  deal_id: string;
  locked_fee: number;
  paid_fee: number;
  uploaded_size: number;
  expires_at: number;
}

export interface IntentDetail {
  intent_id: string;
  user: string;
  file_name: string;
  file_size: number;
  status: string;
  storage_status: string;
  access_status: string;
  moderation_status: string;
  deal_id: string;
  locked_fee: number;
  paid_fee: number;
  refunded_fee: number;
  uploaded_size: number;
  committed_segments: number;
  erasure: { data_shards: number; parity_shards: number; shard_size: number };
  policy: { class: string; duration: number; redundancy: string };
  expires_at_unix: number;
  terminated_at_unix: number;
}

export interface ShardInfo {
  segment_id: number;
  shard_index: number;
  miner_address: string;
  shard_hash: string;
  shard_cid: string;
  shard_size: number;
  committed: boolean;
}

export interface MinerInfo {
  miner_address: string;
  public_key: string;
  endpoint: string;
  capacity_bytes: number;
  used_bytes: number;
  reserved_bytes: number;
  stake: number;
  status: string;
  proof_success: number;
  proof_failure: number;
  retrieval_success: number;
  retrieval_bytes: number;
  storage_rewards: number;
  retrieval_rewards: number;
  repair_rewards: number;
  slashed: number;
  locked_bonus: number;
  bonus_released: boolean;
}

export interface MinerDetail extends MinerInfo {
  consecutive_failures: number;
  rewards: number;
  effective_weight: number;
  speed_score: number;
  anti_spam_score: number;
  registered_at_unix: number;
  exited_at_unix: number;
  last_seen_unix: number;
}

export interface ValidatorInfo {
  owner_address: string;
  operator_address: string;
  operator_public_key: string;
  stake: number;
  delegated_stake: number;
  status: string;
  consensus: boolean;
  produced_blocks: number;
  slashed: number;
  evidence_count: number;
  rewards: number;
  commission_rate_bps?: number;
}

export interface ValidatorDetail extends ValidatorInfo {
  endpoint: string;
  self_stake: number;
  delegator_count: number;
  delegation_rewards: number;
  registered_at_unix: number;
}

export interface UnbondingEntry {
  id: string;
  delegator: string;
  validator: string;
  amount: number;
  created_at_unix: number;
  matures_at_unix: number;
}

export interface SearchResult {
  type: 'block' | 'transaction' | 'intent' | 'account';
  height?: number;
  hash?: string;
  tx_id?: string;
  tx_type?: string;
  intent_id?: string;
  file_name?: string;
  from?: string;
  user?: string;
  status?: string;
  block_height?: number;
  time_unix?: number;
}

export interface DailyStat {
  date: string;
  tx_count: number;
  blocks_produced: number;
  new_intents: number;
  finalized_intents: number;
}
