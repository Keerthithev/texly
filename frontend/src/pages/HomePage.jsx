import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Texly</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/features" className="text-muted hover:text-primary">Features</Link>
              <Link to="/pricing" className="text-muted hover:text-primary">Pricing</Link>
              <Link to="/contact" className="text-muted hover:text-primary">Contact</Link>
            </nav>
            <div className="flex space-x-4">
              <Link to="/login" className="text-primary hover:text-secondary">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary">Sign Up</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
                Welcome to Texly
                <br />
                <span className="text-secondary">ටෙක්ස්ලි වෙත සාදරයෙන් පිළිගනිමු</span>
              </h1>
              <p className="text-lg text-muted mb-8">
                The modern SMS SaaS platform for your business.
                <br />
                ඔබේ ව්‍යාපාරය සඳහා නවීන SMS SaaS වේදිකාව.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="px-8 py-3 bg-primary text-white rounded-md hover:bg-secondary text-center">
                  Get Started
                  <br />
                  ආරම්භ කරන්න
                </Link>
                <Link to="/features" className="px-8 py-3 border border-primary text-primary rounded-md hover:bg-primary hover:text-white text-center">
                  Learn More
                  <br />
                  තව දැනගන්න
                </Link>
              </div>
            </div>
            <div className="text-center">
              <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="SMS Communication Platform" className="rounded-lg shadow-lg mx-auto max-w-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Choose Texly?
              <br />
              ටෙක්ස්ලි තෝරා ගන්නේ ඇයි?
            </h2>
            <p className="text-muted">
              Powerful features to streamline your SMS communication.
              <br />
              ඔබේ SMS සන්නිවේදනය සරල කිරීම සඳහා ශක්තිමත් විශේෂාංග.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-background rounded-lg">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Bulk SMS
                <br />
                බෑලි SMS
              </h3>
              <p className="text-muted">
                Send thousands of SMS at once with our reliable platform.
                <br />
                අපගේ විශ්වාසදායක වේදිකාව සමඟ එකවර දහස් ගණනක් SMS යවන්න.
              </p>
            </div>
            <div className="text-center p-6 bg-background rounded-lg">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Analytics
                <br />
                විශ්ලේෂණය
              </h3>
              <p className="text-muted">
                Track delivery rates and campaign performance.
                <br />
                බෙදාහැරීමේ අනුපාත සහ ව්‍යාපාරික ක්‍රියාකාරකම් නිරීක්ෂණය කරන්න.
              </p>
            </div>
            <div className="text-center p-6 bg-background rounded-lg">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Secure
                <br />
                ආරක්ෂිත
              </h3>
              <p className="text-muted">
                Enterprise-grade security for your data.
                <br />
                ඔබේ දත්ත සඳහා ව්‍යාපාරික පෙළ ආරක්ෂාව.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Texly. All rights reserved. සියලුම හිමිකම් රක්ෂිතයි.</p>
        </div>
      </footer>
    </div>
  );
}
