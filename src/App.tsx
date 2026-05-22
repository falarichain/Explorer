import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Blocks from './pages/Blocks';
import BlockDetailPage from './pages/BlockDetail';
import TransactionPage from './pages/Transaction';
import AccountPage from './pages/Account';
import Deals from './pages/Deals';
import DealDetailPage from './pages/DealDetail';
import Miners from './pages/Miners';
import MinerDetailPage from './pages/MinerDetail';
import Validators from './pages/Validators';
import ValidatorDetailPage from './pages/ValidatorDetail';
import SearchPage from './pages/Search';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blocks" element={<Blocks />} />
          <Route path="/blocks/:heightOrHash" element={<BlockDetailPage />} />
          <Route path="/tx/:txID" element={<TransactionPage />} />
          <Route path="/accounts/:address" element={<AccountPage />} />
          <Route path="/intents" element={<Deals />} />
          <Route path="/intents/:intentID" element={<DealDetailPage />} />
          <Route path="/miners" element={<Miners />} />
          <Route path="/miners/:address" element={<MinerDetailPage />} />
          <Route path="/validators" element={<Validators />} />
          <Route path="/validators/:address" element={<ValidatorDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
