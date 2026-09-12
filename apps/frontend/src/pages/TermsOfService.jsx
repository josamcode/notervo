import React from "react";

const TermsOfService = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-heading text-primary mb-6">Terms of Service</h1>
      <p className="text-lg text-gray-600 mb-8">Last updated: February 2026</p>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          These terms govern your use of Notervo services. By placing an order or using this website, you agree to these terms.
        </p>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">Accounts</h2>
        <p className="text-gray-600">
          You may create an account to place orders, save favorites, and track shipments. You are responsible for your login credentials.
        </p>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">Orders and Payments</h2>
        <p className="text-gray-600">
          Orders are subject to stock availability. Prices are shown in EGP and confirmed at checkout.
        </p>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">Intellectual Property</h2>
        <p className="text-gray-600">
          Notervo owns the brand assets, product visuals, and content on this website unless stated otherwise.
        </p>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">Changes to Terms</h2>
        <p className="text-gray-600">
          We may update these terms when needed. Continued use of the site means you accept the latest version.
        </p>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">Contact</h2>
        <p className="text-gray-600">
          For questions, email <a href="mailto:support@notervo.com" className="text-primary hover:underline">support@notervo.com</a>.
        </p>
      </div>
    </main>
  );
};

export default TermsOfService;
