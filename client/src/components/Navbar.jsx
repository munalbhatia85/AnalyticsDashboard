import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 tracking-wide no-underline"
        >
          Analytics<span className="text-gray-700">Dash</span>
        </Link>

        {/* Toggle Button (Mobile) */}
        <button
          className="lg:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* SVG removed as per request */}
        </button>

        {/* Nav Links */}
        <div className={`lg:flex lg:items-center lg:space-x-8 ${isOpen ? 'block mt-4' : 'hidden'} lg:mt-0`}>
          <Link
            to="/"
            className="block text-gray-600 hover:text-blue-600 transition-colors py-2 lg:py-0 no-underline"
          >
            Database Connector
          </Link>
          <Link
            to="/DatasetViewer"
            className="block text-gray-600 hover:text-blue-600 transition-colors py-2 lg:py-0 no-underline"
          >
            Data
          </Link>
          <Link
            to="/ChartBuilder"
            className="block text-gray-600 hover:text-blue-600 transition-colors py-2 lg:py-0 no-underline"
          >
            Chart
          </Link>
          <Link
            to="/DashboardBuilder"
            className="block text-gray-600 hover:text-blue-600 transition-colors py-2 lg:py-0 no-underline"
          >
            Dashboard Builder
          </Link>
        </div>
      </div>
    </nav>
  );
}
