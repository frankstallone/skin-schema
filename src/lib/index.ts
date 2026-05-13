export type ContactFormProps = {
  content?: {
    title: string;
    description: string;
    message: string;
  };
};

/**
 * Type definition for navigation link items
 */
export type NavigationLink = {
  href: string;
  text: string;
};

/**
 * Shared navigation links used across the site
 */
export const navigationLinks: NavigationLink[] = [
  {
    href: '/#Process',
    text: 'Process',
  },
  {
    href: '/#Rates',
    text: 'Rates',
  },
  {
    href: '/#Contact',
    text: 'Contact',
  },
];
