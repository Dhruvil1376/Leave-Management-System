import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

interface ErrorPageProps { title?: string; message?: string; }

export default function ErrorPage({ title = '404 – Page Not Found', message = "The page you're looking for doesn't exist." }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center px-4">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle size={36} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );
}
