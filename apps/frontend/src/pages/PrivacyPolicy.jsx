import React from "react";
import { PolicyLayout } from "./info/InfoKit";

const PrivacyPolicy = () => {
  return (
    <PolicyLayout
      title="Privacy Policy"
      updated="Last updated: February 2026"
      intro="At Notervo, we respect your privacy and protect personal data with clear, practical safeguards."
      sections={[
        {
          id: "information-we-collect",
          title: "Information We Collect",
          content: (
            <ul>
              <li>Name, email, phone, and shipping address</li>
              <li>Order and purchase history</li>
              <li>Basic device and browsing data through cookies</li>
            </ul>
          ),
        },
        {
          id: "how-we-use-data",
          title: "How We Use Data",
          content: (
            <ul>
              <li>Process and deliver your orders</li>
              <li>Improve product selection and website experience</li>
              <li>Send service updates and optional promotions</li>
            </ul>
          ),
        },
        {
          id: "data-security",
          title: "Data Security",
          content: (
            <p>
              We use standard security controls to reduce unauthorized access,
              misuse, or data loss.
            </p>
          ),
        },
        {
          id: "your-rights",
          title: "Your Rights",
          content: (
            <p>
              You can request access, correction, or deletion of your data at
              any time by contacting <strong>support@notervo.com</strong>.
            </p>
          ),
        },
      ]}
    />
  );
};

export default PrivacyPolicy;
