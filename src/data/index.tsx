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
            { method: 'you', value: '$100' },
            { method: 'me', value: '$150' },
          ],
          weekTurnaround: 1,
        },
        {
          amount: 3,
          price: [
            { method: 'you', value: '$200' },
            { method: 'me', value: '$300' },
          ],
          weekTurnaround: 2,
        },
        {
          amount: 5,
          price: [
            { method: 'you', value: '$300' },
            { method: 'me', value: '$450' },
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
        'Engaging short videos tailored for Instagram & TikTok, designed to captivate and inspire your audience through a feeling of lux serenity. These can be product showcases, unboxings, how-tos, before-and-afters, or any other ideas youd like to see brought to life.',
      exampleId: 'ShortFormExamples',
      type: 'UGC Video',
      packages: [
        {
          amount: 1,
          price: [
            { method: 'you', value: '$200' },
            { method: 'me', value: '$250' },
          ],
          weekTurnaround: 1,
        },
        {
          amount: 3,
          price: [
            { method: 'you', value: '$500' },
            { method: 'me', value: '4600' },
          ],
          weekTurnaround: 2,
        },
        {
          amount: 5,
          price: [
            { method: 'you', value: '$700' },
            { method: 'me', value: '$850' },
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
            { method: 'you', value: '$300' },
            { method: 'me', value: '$350' },
          ],
          weekTurnaround: 1,
        },
        {
          amount: 3,
          price: [
            { method: 'you', value: '$600' },
            { method: 'me', value: '$700' },
          ],
          weekTurnaround: 2,
        },
        {
          amount: 5,
          price: [
            { method: 'you', value: '$800' },
            { method: 'me', value: '$950' },
          ],
          weekTurnaround: 3,
        },
      ],
    },
  },
];
