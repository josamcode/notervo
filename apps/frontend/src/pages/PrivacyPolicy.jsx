import React from "react";

const PrivacyPolicy = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-heading text-primary mb-6">Privacy Policy</h1>
      <p className="text-lg text-gray-600 mb-8">Last updated: February 2026</p>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          At Notervo, we respect your privacy and protect personal data with clear, practical safeguards.
        </p>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">Information We Collect</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
          <li>Name, email, phone, and shipping address</li>
          <li>Order and purchase history</li>
          <li>Basic device and browsing data through cookies</li>
        </ul>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">How We Use Data</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
          <li>Process and deliver your orders</li>
          <li>Improve product selection and website experience</li>
          <li>Send service updates and optional promotions</li>
        </ul>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">Data Security</h2>
        <p className="text-gray-600">
          We use standard security controls to reduce unauthorized access, misuse, or data loss.
        </p>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">Your Rights</h2>
        <p className="text-gray-600">
          You can request access, correction, or deletion of your data at any time by contacting <strong>support@notervo.com</strong>.
        </p>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
