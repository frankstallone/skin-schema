import { type Props as PriceCardProps } from '../components/PriceCard';

export const options: PriceCardProps[] = [
  {
    service: {
      title: 'Product Photo Sets',
      description:
        'Refined product photography and texture visuals for skincare, makeup, and wellness brands that need polished assets for social, campaign, and product storytelling.',
      exampleId: 'PhotographyExamples',
      type: 'Photo Set',
      packages: [
        {
          amount: 1,
          price: [
            { method: 'you', value: '$125' },
            { method: 'me', value: '$200' },
          ],
          weekTurnaround: 2,
        },
        {
          amount: 3,
          price: [
            { method: 'you', value: '$250' },
            { method: 'me', value: '$375' },
          ],
          weekTurnaround: 2,
        },
        {
          amount: 5,
          price: [
            { method: 'you', value: '$375' },
            { method: 'me', value: '$575' },
          ],
          weekTurnaround: 3,
        },
      ],
    },
  },
  {
    service: {
      title: 'Short-Form Product Videos',
      description:
        "Elevated short-form videos for Instagram, TikTok, and paid or organic social. Ideal for product showcases, unboxings, how-tos, before-and-afters, hooks, and beauty routines that need to feel credible and brand-ready.",
      exampleId: 'ShortFormExamples',
      type: 'UGC Video',
      packages: [
        {
          amount: 1,
          price: [
            { method: 'you', value: '$250' },
            { method: 'me', value: '$315' },
          ],
          weekTurnaround: 2,
        },
        {
          amount: 3,
          price: [
            { method: 'you', value: '$625' },
            { method: 'me', value: '$750' },
          ],
          weekTurnaround: 3,
        },
        {
          amount: 5,
          price: [
            { method: 'you', value: '$875' },
            { method: 'me', value: '$1065' },
          ],
          weekTurnaround: 3,
        },
      ],
    },
  },
  {
    service: {
      title: 'Product Storytelling Videos',
      description:
        'More developed beauty video concepts that combine polished production, product context, lifestyle detail, and Skin Schema-style serenity for campaigns, launches, and deeper product education.',
      exampleId: 'InspirationalExamples',
      type: 'UGC Video',
      packages: [
        {
          amount: 1,
          price: [
            { method: 'you', value: '$375' },
            { method: 'me', value: '$440' },
          ],
          weekTurnaround: 2,
        },
        {
          amount: 3,
          price: [
            { method: 'you', value: '$750' },
            { method: 'me', value: '$875' },
          ],
          weekTurnaround: 3,
        },
        {
          amount: 5,
          price: [
            { method: 'you', value: '$1000' },
            { method: 'me', value: '$1200' },
          ],
          weekTurnaround: 3,
        },
      ],
    },
  },
];

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
    href: '/#Services',
    text: 'Services',
  },
  {
    href: '/#RateCard',
    text: 'Rate Card',
  },
  {
    href: '/#Contact',
    text: 'Contact',
  },
];
