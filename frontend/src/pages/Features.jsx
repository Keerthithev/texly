import React from 'react';
import { Link } from 'react-router-dom';

export default function Features() {
  const features = [
    {
      title: 'Send Individual and Bulk SMS',
      titleSi: 'තනිකම සහ බෑලි SMS යවන්න',
      description: 'Effortlessly send single messages or thousands of SMS in bulk with our reliable platform.',
      descriptionSi: 'අපගේ විශ්වාසදායක වේදිකාව සමඟ තනි පණිවිඩ හෝ දහස් ගණනක් බෑලි SMS යාම සරලව කරන්න.',
      icon: '📱',
      image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Schedule SMS for Later',
      titleSi: 'පසුව SMS නියම කරන්න',
      description: 'Plan and schedule your SMS campaigns for optimal timing and maximum impact.',
      descriptionSi: 'ඔබේ SMS ව්‍යාපාරික ක්‍රියාකාරකම් උපරිම බලපෑම සඳහා සුදුසු වේලාවට සැලසුම් කර නියම කරන්න.',
      icon: '⏰',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Upload Contacts',
      titleSi: 'සම්බන්ධතා උඩුගත කරන්න',
      description: 'Import your contact lists from CSV or Excel files with ease.',
      descriptionSi: 'CSV හෝ Excel ගොනු වලින් ඔබේ සම්බන්ධතා ලැයිස්තු සරලව ආයාත කරන්න.',
      icon: '📊',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Manage SMS Templates',
      titleSi: 'SMS ආකෘති කළමනාකරණය කරන්න',
      description: 'Create, edit, and organize reusable SMS templates for consistent messaging.',
      descriptionSi: 'නිල කම්මැලි සඳහා නැවත භාවිතා කළ හැකි SMS ආකෘති නිර්මාණය, සංස්කරණය සහ සකස් කරන්න.',
      icon: '📝',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Delivery Reports and History',
      titleSi: 'බෙදාහැරීමේ වාර්තා සහ ඉතිහාසය',
      description: 'Track delivery status, view detailed reports, and access message history.',
      descriptionSi: 'බෙදාහැරීමේ තත්ත්වය නිරීක්ෂණය කරන්න, විස්තරාත්මක වාර්තා බලන්න සහ පණිවිඩ ඉතිහාසයට ප්‍රවේශ වන්න.',
      icon: '📈',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Role-Based Access',
      titleSi: 'භූමිකාව මත පදනම්ව ප්‍රවේශය',
      description: 'Secure access with different permission levels for Admin, Business, and Free users.',
      descriptionSi: 'පරිපාලක, ව්‍යාපාරික සහ නිදහස් පරිශීලකයින් සඳහා වෙනත් අවසර මට්ටම් සමඟ ආරක්ෂිත ප්‍රවේශය.',
      icon: '🔒',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Subscription Management',
      titleSi: 'දායකත්ව කළමනාකරණය',
      description: 'Manage subscriptions, handle payments, and upgrade plans seamlessly.',
      descriptionSi: 'දායකත්ව කළමනාකරණය කරන්න, ගෙවීම් හසුරුවන්න සහ සැලසුම් නිරවද්‍යව උත්ශාධනය කරන්න.',
      icon: '💳',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Professional UI/UX',
      titleSi: 'වෘත්තීය UI/UX',
      description: 'Enjoy a responsive, user-friendly interface designed for efficiency.',
      descriptionSi: 'කාර්යක්ෂමතාව සඳහා නිර්මාණය කරන ලද පිළිතුරු දක්වන, පරිශීලක-හිතාකාරී අතුරු මුහුදුව භුක්ති වින්දන්න.',
      icon: '🎨',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-primary">Texly</Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-muted hover:text-primary">Home</Link>
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

      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Powerful Features
            <br />
            ශක්තිමත් විශේෂාංග
          </h1>
          <p className="text-xl mb-8">
            Discover what makes Texly the leading SMS SaaS platform.
            <br />
            ටෙක්ස්ලි ප්‍රධාන SMS SaaS වේදිකාව කරන එය සොයා ගන්න.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{feature.icon}</span>
                    <h3 className="text-xl font-semibold text-primary">
                      {feature.title}
                      <br />
                      <span className="text-sm text-secondary">{feature.titleSi}</span>
                    </h3>
                  </div>
                  <p className="text-muted">
                    {feature.description}
                    <br />
                    <span className="text-sm">{feature.descriptionSi}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
            <br />
            ආරම්භ කිරීමට සූදානම්ද?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of businesses using Texly for their SMS needs.
            <br />
            ඔවුන්ගේ SMS අවශ්‍යතා සඳහා ටෙක්ස්ලි භාවිතා කරන දහස් ගණනක් ව්‍යාපාරයට සම්බන්ධ වන්න.
          </p>
          <Link to="/signup" className="px-8 py-3 bg-white text-primary rounded-md hover:bg-gray-100 font-semibold">
            Start Free Trial
            <br />
            නිදහස් අත්හදා බැලීම ආරම්භ කරන්න
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted">&copy; 2024 Texly. All rights reserved. සියලුම හිමිකම් රක්ෂිතයි.</p>
        </div>
      </footer>
    </div>
  );
}
