import React from "react";
import { PolicyLayout } from "./info/InfoKit";

const TermsOfService = () => {
  return (
    <PolicyLayout
      title="Terms of Service"
      updated="Last updated: February 2026"
      intro="These terms govern your use of Notervo services. By placing an order or using this website, you agree to these terms."
      sections={[
        {
          id: "accounts",
          title: "Accounts",
          content: (
            <p>
              You may create an account to place orders, save favorites, and
              track shipments. You are responsible for your login credentials.
            </p>
          ),
        },
        {
          id: "orders-and-payments",
          title: "Orders and Payments",
          content: (
            <p>
              Orders are subject to stock availability. Prices are shown in EGP
              and confirmed at checkout.
            </p>
          ),
        },
        {
          id: "intellectual-property",
          title: "Intellectual Property",
          content: (
            <p>
              Notervo owns the brand assets, product visuals, and content on
              this website unless stated otherwise.
            </p>
          ),
        },
        {
          id: "changes-to-terms",
          title: "Changes to Terms",
          content: (
            <p>
              We may update these terms when needed. Continued use of the site
              means you accept the latest version.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          content: (
            <p>
              For questions, email{" "}
              <a
                href="mailto:support@notervo.com"
                className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                support@notervo.com
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
};

export default TermsOfService;
