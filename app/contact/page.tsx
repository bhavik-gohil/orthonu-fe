"use client";

import React, { JSX } from "react";
import HomeNavbar from "@/components/HomeNavbar";
import ContactUsForm from "@/components/forms/ContactUsForm";
import Footer from "@/components/Footer";

/**
 * Contact Page
 *
 * Dedicated page for the Contact Us form at route /contact.
 * Displays the ContactUsForm component as the primary content with proper layout and styling.
 *
 * Requirements validated:
 * - 7.1: ContactUsForm displayed on dedicated page at route /contact
 * - 7.2: ContactUsForm is the primary content when page is rendered
 *
 * @returns {JSX.Element} The contact page with ContactUsForm
 */
export default function ContactPage(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-warm-gray text-soft-dark font-sans">
      {/* Navigation */}
      <HomeNavbar />

      {/* Main Content - ContactUsForm as primary content */}
      <main className="flex-1 flex items-center justify-center p-3 md:py-8">
        <div className="w-full max-w-4xl">
          <ContactUsForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
