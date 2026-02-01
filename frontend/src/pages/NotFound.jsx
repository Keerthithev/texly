import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <img
            src="https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
            alt="404 Not Found"
            className="mx-auto mb-6 rounded-full object-cover"
          />
          <h1 className="text-6xl font-bold text-error mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Page Not Found
            <br />
            <span className="text-lg text-secondary">පිටුව සොයා ගත නොහැක</span>
          </h2>
          <p className="text-muted mb-8">
            The page you're looking for doesn't exist or has been moved.
            <br />
            ඔබ සොයන පිටුව නොපවතීනවා හෝ ගෙනයා ඇත.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-secondary font-semibold transition-colors"
          >
            Go to Home
            <br />
            නිවාසයට යන්න
          </Link>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/features"
              className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              Features
              <br />
              විශේෂාංග
            </Link>
            <Link
              to="/contact"
              className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              Contact Us
              <br />
              අප සමඟ සම්බන්ධ වන්න
            </Link>
          </div>
        </div>

        <div className="mt-12 text-sm text-muted">
          <p>
            If you believe this is an error, please
            <Link to="/contact" className="text-primary hover:text-secondary ml-1">
              contact support
              <br />
              සහායකයින්ට සම්බන්ධ වන්න
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
