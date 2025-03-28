import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DocumentList from './pages/DocumentList';
import UploadDocument from './pages/UploadDocument';
import Home from './pages/Home';
import UserList from './pages/UserList';
import './App.css'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<DocumentList />} />
            <Route path="/upload" element={<UploadDocument />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
