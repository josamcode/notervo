import React from "react";
import { PolicyLayout } from "./info/InfoKit";

const steps = [
  <>
    Email <strong>support@notervo.com</strong> with your order ID.
  </>,
  "Wait for return approval and instructions.",
  "Pack the notebook securely and send it back.",
  "Refunds are processed within 3-5 business days after inspection.",
];

const ReturnPolicy = () => {
  return (
    <PolicyLayout
      title="Return and Exchange Policy"
      updated="Last updated: February 2026"
      intro="We want every Notervo notebook to meet your expectations. If it does not, we offer a clear and simple return process."
      sections={[
        {
          id: "eligibility",
          title: "Eligibility",
          content: (
            <ul>
              <li>
                Returns and exchanges are accepted within{" "}
                <strong>14 days</strong> of delivery.
              </li>
              <li>Items must be unused and in their original packaging.</li>
              <li>
                Final-sale items are non-returnable unless they arrive
                defective.
              </li>
            </ul>
          ),
        },
        {
          id: "start-a-return",
          title: "How to Start a Return",
          content: (
            <ol>
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4 !pl-0 before:!hidden">
                  <span className="w-6 shrink-0 font-serif text-[18px] leading-[1.35] text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ),
        },
        {
          id: "damaged-items",
          title: "Damaged or Incorrect Items",
          content: (
            <p>
              If your order arrives damaged or incorrect, contact us
              immediately. We will replace the item or issue a full refund.
            </p>
          ),
        },
      ]}
    />
  );
};

export default ReturnPolicy;
