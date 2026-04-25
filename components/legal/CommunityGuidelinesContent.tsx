import React from "react";
import Link from "next/link";

export default function CommunityGuidelinesContent() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 w-full">
      <h1 className="text-3xl font-black text-soft-dark mb-8">Community Guidelines</h1>
      <div className="prose prose-zinc max-w-none space-y-6 text-sm leading-relaxed text-soft-dark/80">
        
        <p className="text-lg">Thanks for being part of the OrthoNu community! It makes us smile that you are here!</p>

        <p>We think social media is a great way to share what we're working on, what we're excited about, and more about orthodontia. It's also a great way to connect with you, employees, Orthodontists, patients, parents, and anyone interested in connecting. To make sure we keep things positive and helpful, we have established a few page guidelines for ourselves and our audience. OrthoNu wants to see more happy smiles and positivity, so these guidelines are important to us.</p>

        <p>When you engage with any of the OrthoNu social media channels, you are agreeing to these Social Media Guidelines and those of the respective social media platforms.</p>

        <section>
          <h2 className="text-xl font-bold text-soft-dark mb-4">Stay Positive</h2>
          <p>We are in the business of helping people get smiles they are confident in so let's keep things positive to make sure we are seeing those smiles. When posting on the page or engaging with content, please be respectful of everyone involved. Avoid profanity, discriminatory language, illegal behavior, or anything negative in general. If our team finds your post going against this guideline, we will remove it.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-soft-dark mb-4">Always Talk to Your Orthodontist with Concerns</h2>
          <p>Social media is a common platform for people to share health-related concerns. And while many in this community work in the orthodontic field, this page should not be used to discuss or diagnose oral health. For any oral health concerns or questions, please consult your Orthodontist.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-soft-dark mb-4">This Isn't a Page for Promotions and Sales</h2>
          <p>This page is meant to be about oral health, orthodontic care, and content related to OrthoNu. Please don't use the page to promote your product or service, or to post external links to irrelevant content. If we feel content is promotional, we reserve the right to remove it.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-soft-dark mb-4">Engagement Means We Like It, Nothing More</h2>
          <p>We like to be active on our social media channels and support our community. When OrthoNu shares, comments, or engages with content it should not be considered an endorsement of a company, product or person. Occasionally we will share relevant third-party content to provide value to our community and it means just that, we like the content.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-soft-dark mb-4">We'll Always Do Our Best</h2>
          <p>We believe social media is meant to be social and we will respond to your questions and comments as quickly as possible. However, if we miss something or you need to get in contact with someone at OrthoNu fast, please visit our <Link href="/contact" className="text-brand-blue hover:underline">contact page</Link>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-soft-dark mb-4">One Last Thing</h2>
          <p>Please be aware that OrthoNu reserves the right to delete any posting at its sole discretion. If you feel your post has been removed unfairly, please message us directly to discuss it.</p>
        </section>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-brand-blue/20">
          <p className="text-lg font-semibold text-soft-dark">Thank you for joining us!</p>
        </div>

      </div>
    </main>
  );
}
