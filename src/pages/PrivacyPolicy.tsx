import { useEffect } from 'react';
import { trackEvent } from '../utils/gtm';

export default function PrivacyPolicy() {
  useEffect(() => {
    // Track page view
    trackEvent('page_view', {
      page_title: 'Privacy Policy - A/B Test Stats Toolkit',
      page_location: window.location.href,
      page_path: window.location.pathname
    });
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="container-custom py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#004f80] mb-6">Privacy Policy</h1>
        
        <div className="text-sm text-gray-500 mb-8 flex flex-col sm:flex-row sm:justify-between">
          <p>Effective Date: 28th February 2025</p>
          <p>Last Updated: 28th February 2025</p>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-lg">
            Welcome to the Swayven Digital A/B Test Stats Toolkit (the "Toolkit"). Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our Toolkit.
          </p>
          
          <p className="text-lg font-medium mt-6">
            By using this Toolkit, you agree to the terms outlined in this Privacy Policy. If you do not agree, please refrain from using the Toolkit.
          </p>
          
          <h2 className="text-2xl font-bold text-[#004f80] mt-10 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Automatically Collected Data</h3>
          <p>
            When you use the Toolkit, we may automatically collect certain information about your visit through analytics and tracking technologies, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><span className="font-medium">Usage Data:</span> Pages visited, time spent on the site, interactions with features, and navigation patterns.</li>
            <li><span className="font-medium">Device & Browser Information:</span> IP address, browser type, operating system, and screen resolution.</li>
            <li><span className="font-medium">Referral Data:</span> How you arrived at the Toolkit (e.g., search engine, direct visit, or referral from another website).</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Tracking & Analytics Data</h3>
          <p>
            We use third-party analytics tools, including Google Analytics and Google Tag Manager, to collect data on how users interact with the Toolkit. These tools may use cookies and tracking pixels to analyze user behavior.
          </p>
          
          <h2 className="text-2xl font-bold text-[#004f80] mt-10 mb-4">2. How We Use Your Data</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>To monitor and improve the Toolkit's functionality, usability, and performance.</li>
            <li>To analyze user behavior and enhance user experience.</li>
            <li>To troubleshoot issues and ensure technical stability.</li>
            <li>To assess engagement and identify opportunities for optimizing the Toolkit.</li>
            <li>To measure the effectiveness of marketing efforts and refine our Martech strategies.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-[#004f80] mt-10 mb-4">3. Cookies & Tracking Technologies</h2>
          <p>
            We use cookies, tracking pixels, and related technologies to collect and store information when you visit our Toolkit. These technologies help us:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Understand how users navigate the site.</li>
            <li>Measure and improve the effectiveness of features.</li>
            <li>Ensure a smooth and secure user experience.</li>
          </ul>
          <p className="mt-4">
            If you prefer to disable cookies, you can do so via your browser settings. However, disabling cookies may impact the functionality of the Toolkit.
          </p>
          
          <h2 className="text-2xl font-bold text-[#004f80] mt-10 mb-4">4. Third-Party Services</h2>
          <p>
            We may integrate additional MarTech tools in the future (such as marketing automation, CRM, or ad tracking services). Any new third-party integrations will be reflected in this Privacy Policy.
          </p>
          <p className="mt-4">Current third-party services in use:</p>
          <ul className="list-none pl-6 space-y-2 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-[#67cc34]">✔</span>
              <span><span className="font-medium">Google Analytics</span> – For traffic analysis and user insights.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#67cc34]">✔</span>
              <span><span className="font-medium">Google Tag Manager</span> – For managing tracking scripts and analytics tools.</span>
            </li>
          </ul>
          <p className="mt-4">
            We do not sell, trade, or share your personal data with third parties for advertising purposes.
          </p>
          
          <h2 className="text-2xl font-bold text-[#004f80] mt-10 mb-4">5. Data Storage & Security</h2>
          <p>
            We take reasonable security measures to protect user data from unauthorized access, disclosure, or misuse. However, no online service is 100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h2 className="text-2xl font-bold text-[#004f80] mt-10 mb-4">6. Your Data Rights</h2>
          <p>
            Depending on your location, you may have rights under GDPR (for EU users), CCPA (for California residents), and other privacy laws. These rights may include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><span className="font-medium">Access to your data</span> – Request information on what personal data we hold.</li>
            <li><span className="font-medium">Correction of inaccurate data</span> – Request corrections to your stored information.</li>
            <li><span className="font-medium">Deletion of your data</span> – Request removal of your personal data.</li>
            <li><span className="font-medium">Opting out of tracking</span> – Disable tracking cookies or analytics via browser settings.</li>
          </ul>
          <p className="mt-4">
            If you wish to exercise your rights, contact us at <a href="mailto:info@swayvendigital.com" className="text-[#004f80] hover:underline">info@swayvendigital.com</a>.
          </p>
          
          <h2 className="text-2xl font-bold text-[#004f80] mt-10 mb-4">7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect new tools, legal updates, or changes in how we handle data. Any major updates will be communicated via a notice on the Toolkit.
          </p>
          <p className="mt-4">
            We encourage you to review this Privacy Policy periodically.
          </p>
          
          <h2 className="text-2xl font-bold text-[#004f80] mt-10 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, data practices, or your rights, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg mt-4 space-y-3">
            <p className="flex items-start gap-2">
              <span className="text-[#004f80]">📍</span>
              <span>
                <span className="font-medium">Swayven Digital Ltd</span><br />
                85 Great Portland Street, First Floor<br />
                London, W1W 7LT<br />
                United Kingdom
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#004f80]">📞</span>
              <span>Tel: +44 (0)203 488 5238</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#004f80]">📧</span>
              <span>Email: <a href="mailto:info@swayvendigital.com" className="text-[#004f80] hover:underline">info@swayvendigital.com</a></span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#004f80]">🌍</span>
              <span>Website: <a href="https://www.swayvendigital.com" target="_blank" rel="noopener noreferrer" className="text-[#004f80] hover:underline">www.swayvendigital.com</a></span>
            </p>
          </div>
          
          <div className="bg-[#004f80]/5 p-6 rounded-lg mt-10 text-center">
            <p className="font-medium">
              By using the A/B Test Stats Toolkit, you agree to this Privacy Policy.<br />
              If you do not agree, please discontinue use of the Toolkit.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}