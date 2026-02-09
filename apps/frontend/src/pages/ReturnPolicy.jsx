import React from "react";

const ReturnPolicy = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-heading text-primary mb-6">Return and Exchange Policy</h1>
      <p className="text-lg text-gray-600 mb-8">Last updated: February 2026</p>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          We want every Notervo notebook to meet your expectations. If it does not, we offer a clear and simple return process.
        </p>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">Eligibility</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
          <li>Returns and exchanges are accepted within <strong>14 days</strong> of delivery.</li>
          <li>Items must be unused and in their original packaging.</li>
          <li>Final-sale items are non-returnable unless they arrive defective.</li>
        </ul>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">How to Start a Return</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-2">
          <li>Email <strong>support@notervo.com</strong> with your order ID.</li>
          <li>Wait for return approval and instructions.</li>
          <li>Pack the notebook securely and send it back.</li>
          <li>Refunds are processed within 3-5 business days after inspection.</li>
        </ol>

        <h2 className="text-2xl font-heading text-primary mt-8 mb-4">Damaged or Incorrect Items</h2>
        <p className="text-gray-600">
          If your order arrives damaged or incorrect, contact us immediately. We will replace the item or issue a full refund.
        </p>
      </div>
    </main>
  );
};

export default ReturnPolicy;
