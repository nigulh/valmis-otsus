import ReactDOM from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import Coffee from "./Coffee.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/coffee" element={<Coffee/> } />
    </Routes>
  </Router>,
)
