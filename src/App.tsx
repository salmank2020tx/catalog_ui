import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ListingPage } from './pages/ListingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<ListingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;