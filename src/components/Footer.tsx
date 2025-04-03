import { trackContactClick } from '../utils/gtm';

interface FooterProps {
  companyName: string;
  year?: number;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

export default function Footer({ 
  companyName, 
  year = new Date().getFullYear(),
  links = []
}: FooterProps) {
  const handleLinkClick = (linkType: string, destination: string) => {
    trackContactClick(linkType, destination);
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">
            © {year} {companyName}. All rights reserved.
          </p>
          
          {links.length > 0 && (
            <nav className="flex gap-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-primary transition-colors"
                  onClick={() => handleLinkClick(`footer_${link.label.toLowerCase()}`, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}