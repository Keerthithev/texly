import React from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const plans = [
    {
      name: 'Free Trial',
      nameSi: 'නිදහස් අත්හදා බැලීම',
      price: '$0',
      period: 'forever',
      periodSi: 'සදහටම',
      description: 'Perfect for testing our platform',
      descriptionSi: 'අපගේ වේදිකාව පරීක්ෂා කිරීම සඳහා පරිපූර්ණයි',
      features: ['Send up to 20 SMS', 'Basic templates', 'Delivery reports'],
      featuresSi: ['SMS 20 ක් දක්වා යවන්න', 'මූලික ආකෘති', 'බෙදාහැරීමේ වාර්තා'],
      buttonText: 'Start Free',
      buttonTextSi: 'නිදහසේ ආරම්භ කරන්න',
      popular: false,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Pay-as-you-go',
      nameSi: 'භාවිතා කරන පරිදි ගෙවන්න',
      price: '$0.01',
      period: 'per SMS',
      periodSi: 'SMS එකකට',
      description: 'Flexible pricing for any scale',
      descriptionSi: 'ඕනෑම පරිමාණයකටම නම්‍යශීලී මිලකැඳවීම',
      features: ['Unlimited SMS', 'Advanced templates', 'Priority support', 'API access'],
      featuresSi: ['අසීමිත SMS', 'උසස් ආකෘති', 'ප්‍රමුඛතා සහාය', 'API ප්‍රවේශය'],
      buttonText: 'Choose Plan',
      buttonTextSi: 'සැලසුම තෝරන්න',
      popular: true,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Premium',
      nameSi: 'ප්‍රීමියම්',
      price: '$20',
      period: 'per month',
      periodSi: 'මාසයකට',
      description: 'Best for growing businesses',
      descriptionSi: 'වැඩෙන ව්‍යාපාරයන් සඳහා හොඳම',
      features: ['10,000 SMS/month', 'Custom templates', 'Advanced analytics', 'Dedicated support'],
      featuresSi: ['මාසයකට SMS 10,000', 'අභිරුචි ආකෘති', 'උසස් විශ්ලේෂණය', 'විශේෂිත සහාය'],
      buttonText: 'Upgrade',
      buttonTextSi: 'උත්ශාධනය කරන්න',
      popular: false,
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
              <Link to="/features" className="text-muted hover:text-primary">Features</Link>
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
            Simple, Transparent Pricing
            <br />
            සරල, ප්‍රසාදනීය මිලකැඳවීම
          </h1>
          <p className="text-xl mb-8">
            Choose the plan that fits your SMS needs.
            <br />
            ඔබේ SMS අවශ්‍යතාට සුදුසු සැලසුම තෝරන්න.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-lg overflow-hidden ${plan.popular ? 'border-2 border-primary transform scale-105' : ''} hover:shadow-xl transition-all`}>
                {plan.popular && (
                  <div className="bg-primary text-white text-center py-2 font-semibold">
                    Most Popular
                    <br />
                    වඩාත්ම ප්‍රසිද්ධ
                  </div>
                )}
                <img src={plan.image} alt={plan.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {plan.name}
                    <br />
                    <span className="text-lg text-secondary">{plan.nameSi}</span>
                  </h3>
                  <p className="text-muted mb-4">
                    {plan.description}
                    <br />
                    <span className="text-sm">{plan.descriptionSi}</span>
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted">/{plan.period}</span>
                    <br />
                    <span className="text-sm text-secondary">({plan.periodSi})</span>
                  </div>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                        <br />
                        <span className="text-sm text-secondary ml-6">{plan.featuresSi[i]}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className={`w-full py-3 px-4 rounded-md font-semibold text-center block ${plan.popular ? 'bg-primary text-white hover:bg-secondary' : 'bg-secondary text-white hover:bg-primary'}`}>
                    {plan.buttonText}
                    <br />
                    <span className="text-sm">{plan.buttonTextSi}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Frequently Asked Questions
              <br />
              නිතිපතා අසන පැනවීම්
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Can I change plans anytime?
                <br />
                මම ඕනෑම විටක පැනවීම් වෙනස් කළ හැකිද?
              </h3>
              <p className="text-muted">
                Yes, you can upgrade or downgrade your plan at any time.
                <br />
                ඔව්, ඔබට ඕනෑම විටක ඔබේ සැලසුම උත්ශාධනය හෝ පහත් කිරීම කළ හැක.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Is there a setup fee?
                <br />
                ස්ථාපන ගාස්තුවක් තියෙනවද?
              </h3>
              <p className="text-muted">
                No setup fees for any of our plans.
                <br />
                අපගේ සැලසුම් කිසිවකටම ස්ථාපන ගාස්තුවක් නැත.
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
