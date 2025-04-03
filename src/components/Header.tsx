import { ExternalLink } from 'lucide-react';

interface HeaderProps {
  title: string;
  logo?: string;
  navLinks?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

export default function Header({ title, logo, navLinks = [] }: HeaderProps) {
  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            {logo ? (
              <img src={logo} alt={title} className="h-16 w-auto" />
            ) : (
              <span className="text-2xl font-bold text-white">{title}</span>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="relative px-4 py-2 text-white hover:text-blue-100 transition-all duration-300 group"
              >
                <span className="relative z-10 flex items-center gap-1">
                  {link.label}
                  {link.external && <ExternalLink className="w-4 h-4" />}
                </span>
                <span className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}