import React from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-primary">Texly</Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-muted hover:text-primary">Home</Link>
              <Link to="/features" className="text-muted hover:text-primary">Features</Link>
              <Link to="/pricing" className="text-muted hover:text-primary">Pricing</Link>
            </nav>
            <div className="flex space-x-4">
              <Link to="/login" className="text-primary hover:text-secondary">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary">Sign Up</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Contact Us
            <br />
            අප සමඟ සම්බන්ධ වන්න
          </h1>
          <p className="text-xl mb-8">
            We'd love to hear from you. Get in touch with our team.
            <br />
            අපි ඔබගෙන් ඇසීමට කැමතියි. අපගේ කණ්ඩායම සමඟ සම්බන්ධ වන්න.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Send us a Message
                <br />
                අපට පණිවිඩයක් යවන්න
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block text-muted mb-2">
                    Your Name / ඔබේ නම
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-muted mb-2">
                    Your Email / ඔබේ ඊමේල්
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-muted mb-2">
                    Your Message / ඔබේ පණිවිඩය
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={6}
                    placeholder="Enter your message"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary font-semibold transition-colors"
                >
                  Send Message
                  <br />
                  පණිවිඩය යවන්න
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Get in Touch
                  <br />
                  සම්බන්ධ වන්න
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">📧</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Email</p>
                      <p className="text-muted">support@texly.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">📞</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Phone</p>
                      <p className="text-muted">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">📍</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Address</p>
                      <p className="text-muted">123 SMS Street, Colombo, Sri Lanka</p>
                      <p className="text-muted">123 SMS වීදිය, කොළඹ, ශ්‍රී ලංකාව</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="Colombo City View"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <p className="text-muted text-center">
                    Visit our office in Colombo
                    <br />
                    කොළඹේ අපගේ කාර්යාලයට පිවිසෙන්න
                  </p>
                </div>
              </div>
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
