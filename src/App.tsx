import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DocumentList from './pages/DocumentList';
import UploadDocument from './pages/UploadDocument';
import './App.css'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<DocumentList />} />
            <Route path="/upload" element={<UploadDocument />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
