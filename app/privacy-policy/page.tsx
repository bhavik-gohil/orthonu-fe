import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";

export const metadata = { 
  title: "Privacy Policy | OrthoNu" 
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-soft-dark font-sans">
      <HomeNavbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl font-black text-soft-dark mb-8">Privacy Policy</h1>
        <div className="prose prose-zinc max-w-none space-y-6 text-sm leading-relaxed">
          
          <p>This Privacy Policy describes how orthonu.com (the "Site" or "we") collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.</p>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Collecting Personal Information</h2>
            <p>When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. In this Privacy Policy, we refer to any information that can uniquely identify an individual (including the information below) as "Personal Information". See the list below for more information about what Personal Information we collect and why.</p>
            
            <h3 className="text-lg font-semibold text-soft-dark mb-3 mt-6">Device Information</h3>
            <p><strong>Examples of Personal Information collected:</strong> version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the Site.</p>
            <p><strong>Purpose of collection:</strong> to load the Site accurately for you, and to perform analytics on Site usage to optimize our Site.</p>
            <p><strong>Source of collection:</strong> Collected automatically when you access our Site using cookies, log files, web beacons, tags, or pixels.</p>
            <p><strong>Disclosure for a business purpose:</strong> shared with our processor Shopify, analytics providers or marketing providers.</p>
            
            <h3 className="text-lg font-semibold text-soft-dark mb-3 mt-6">Order Information</h3>
            <p><strong>Examples of Personal Information collected:</strong> name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.</p>
            <p><strong>Purpose of collection:</strong> to provide products or services to you to fulfill our contract, to process your payment information, arrange for shipping, and provide you with invoices and/or order confirmations, communicate with you, screen our orders for potential risk or fraud, and when in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</p>
            <p><strong>Source of collection:</strong> collected from you.</p>
            <p><strong>Disclosure for a business purpose:</strong> shared with our processor Shopify, fulfillment vendor, marketing partners or other product personalization vendors.</p>
            
            <h3 className="text-lg font-semibold text-soft-dark mb-3 mt-6">Customer Support</h3>
            <p><strong>Examples of Personal Information collected:</strong> name, billing address, shipping address, payment information (including credit card numbers), email address, phone number, order information</p>
            <p><strong>Purpose of collection:</strong> to provide customer support.</p>
            <p><strong>Source of collection:</strong> collected from you.</p>
            <p><strong>Disclosure for a business purpose:</strong> customer support providers</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Minors</h2>
            <p>The Site is not intended for individuals under the age of 13. We do not intentionally collect Personal Information from children. If you are the parent or guardian and believe your child has provided us with Personal Information, please contact us at the address below to request deletion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Sharing Personal Information</h2>
            <p>We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Behavioral Advertising</h2>
            <p>As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you. For example:</p>
            
            <p>We use Google Analytics to help us understand how our customers use the Site. You can read more about how Google uses your Personal Information here: <a href="https://policies.google.com/privacy?hl=en" className="text-brand-blue hover:underline">https://policies.google.com/privacy?hl=en</a>. You can also opt-out of Google Analytics here: <a href="https://tools.google.com/dlpage/gaoptout" className="text-brand-blue hover:underline">https://tools.google.com/dlpage/gaoptout</a>.</p>
            
            <p>We share information about your use of the Site, your purchases, and your interaction with our ads on other websites with our advertising partners. We collect and share some of this information directly with our advertising partners, and in some cases through the use of cookies or other similar technologies (which you may consent to, depending on your location).</p>
            
            <p>For more information about how targeted advertising works, you can visit the Network Advertising Initiative's ("NAI") educational page at <a href="http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work" className="text-brand-blue hover:underline">http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work</a>.</p>
            
            <p>You can opt out of targeted advertising by:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>FACEBOOK – <a href="https://www.facebook.com/settings/?tab=ads" className="text-brand-blue hover:underline">https://www.facebook.com/settings/?tab=ads</a></li>
              <li>GOOGLE – <a href="https://www.google.com/settings/ads/anonymous" className="text-brand-blue hover:underline">https://www.google.com/settings/ads/anonymous</a></li>
              <li>BING – <a href="https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads" className="text-brand-blue hover:underline">https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads</a></li>
            </ul>
            
            <p>Additionally, you can opt out of some of these services by visiting the Digital Advertising Alliance's opt-out portal at: <a href="http://optout.aboutads.info/" className="text-brand-blue hover:underline">http://optout.aboutads.info/</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Using Personal Information</h2>
            <p>We use your personal Information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Retention</h2>
            <p>When you place an order through the Site, we will retain your Personal Information for our records unless and until you ask us to erase this information. For more information on your right of erasure, please see the 'Your rights' section below.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Automatic Decision-Making</h2>
            <p>If you are a resident of the EEA, you have the right to object to processing based solely on automated decision-making (which includes profiling), when that decision-making has a legal effect on you or otherwise significantly affects you.</p>
            
            <p>We DO NOT engage in fully automated decision-making that has a legal or otherwise significant effect using customer data.</p>
            
            <p>Our processor Shopify uses limited automated decision-making to prevent fraud that does not have a legal or otherwise significant effect on you.</p>
            
            <p>Services that include elements of automated decision-making include:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Temporary denylist of IP addresses associated with repeated failed transactions. This denylist persists for a small number of hours.</li>
              <li>Temporary denylist of credit cards associated with denylisted IP addresses. This denylist persists for a small number of days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Your Rights</h2>
            
            <h3 className="text-lg font-semibold text-soft-dark mb-3 mt-6">CCPA</h3>
            <p>If you are a resident of California, you have the right to access the Personal Information we hold about you (also known as the 'Right to Know'), to port it to a new service, and to ask that your Personal Information be corrected, updated, or erased. If you would like to exercise these rights, please contact us through the contact information below.</p>
            
            <p>If you would like to designate an authorized agent to submit these requests on your behalf, please contact us at the address below.</p>
            
            <p>If you wish to opt-out of collection of sale of your personal information, you can click here.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Cookies</h2>
            <p>A cookie is a small amount of information that's downloaded to your computer or device when you visit our Site. We use a number of different cookies, including functional, performance, advertising, and social media or content cookies. Cookies make your browsing experience better by allowing the website to remember your actions and preferences (such as login and region selection). This means you don't have to re-enter this information each time you return to the site or browse from one page to another. Cookies also provide information on how people use the website, for instance whether it's their first time visiting or if they are a frequent visitor.</p>
            
            <p>The length of time that a cookie remains on your computer or mobile device depends on whether it is a "persistent" or "session" cookie. Session cookies last until you stop browsing and persistent cookies last until they expire or are deleted. Most of the cookies we use are persistent and will expire between 30 minutes and two years from the date they are downloaded to your device.</p>
            
            <p>You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can negatively impact your user experience and parts of our website may no longer be fully accessible.</p>
            
            <p>Most browsers automatically accept cookies, but you can choose whether or not to accept cookies through your browser controls, often found in your browser's "Tools" or "Preferences" menu. For more information on how to modify your browser settings or how to block, manage or filter cookies can be found in your browser's help file or through such sites as www.allaboutcookies.org.</p>
            
            <p>Additionally, please note that blocking cookies may not completely prevent how we share information with third parties such as our advertising partners. To exercise your rights or opt-out of certain uses of your information by these parties, please follow the instructions in the "Behavioral Advertising" section above.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Do Not Track</h2>
            <p>Please note that because there is no consistent industry understanding of how to respond to "Do Not Track" signals, we do not alter our data collection and usage practices when we detect such a signal from your browser.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Changes</h2>
            <p>We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Contact</h2>
            <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at whatsnu@orthonu.com or by mail using the details provided below:</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="font-semibold">OrthoNu LLC</p>
              <p>41 Flatbush Avenue</p>
              <p>Suite 1, PMB #896</p>
              <p>Brooklyn, NY 11217</p>
            </div>
            
            <p className="mt-4"><strong>Last updated:</strong> 28 August 2022</p>
            
            <p>If you are not satisfied with our response to your complaint, you have the right to lodge your complaint with the relevant data protection authority. You can contact your local data protection authority, or our supervisory authority.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}