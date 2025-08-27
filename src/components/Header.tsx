import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  logo: any; // Accept ImageMetadata from Astro
}

export default function Header({ logo }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState('/');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Get current path and set active tab
  useEffect(() => {
    const currentPath = window.location.pathname;
    setActivePath(currentPath);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/blog', label: 'Blog' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return activePath === '/';
    }
    return activePath.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg px-2 lg:px-4 h-14 flex items-center justify-between">
        <a className="flex items-center justify-center text-primary hover:text-secondary" href="/">
          <img alt="Logo" className="w-80 -ml-24" src={logo.src} />
          <span className="sr-only">Rac Wodiyamado</span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden sm:flex ml-auto">
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href}>
              <Button variant="link" className={`text-sm font-medium ${isActive(item.href) ? 'underline' : ''}`}>
                {item.label}
              </Button>
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          ref={buttonRef}
          onClick={toggleMenu}
          className="sm:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? (
            // X icon when menu is open
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon when menu is closed
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="sm:hidden bg-white border-b border-gray-200"
        >
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-sm text-base font-medium text-gray-700 hover:bg-gray-50 ${isActive(item.href) ? 'bg-gray-100' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
