import { type Props as PriceCardProps } from '../components/PriceCard';

export const options: PriceCardProps[] = [
  {
    service: {
      title: 'Professional Photography of Products',
      description:
        'High-quality images showcasing your products in a professional, light, airy, and minimalistic style.',
      exampleId: 'PhotographyExamples',
      type: 'Photo',
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
      title: 'Short Form Product Videos',
      description:
        "Engaging short videos tailored for Instagram & TikTok, designed to captivate and inspire your audience through a feeling of lux serenity. These can be product showcases, unboxings, how-tos, before-and-afters, or any other ideas you'd like to see brought to life.",
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
      title: 'Inspiration and Vlog Videos',
      description:
        'Personalized and heartfelt video content produced in studio quality, sharing lifestyle tips, inspiration, self-care routines, and day-to-day product usage.',
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
