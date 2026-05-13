import type { ImageMetadata } from 'astro';

import campaignStill from '../../assets/2023-Creative-Minds-29-web.jpg';
import photoExample01 from '../../assets/photo-example-01.jpg';
import photoExample03 from '../../assets/photo-example-03.jpg';
import photoExample04 from '../../assets/photo-example-04.jpg';
import photoExample05 from '../../assets/photo-example-05.jpg';
import photoExample06 from '../../assets/photo-example-06.jpg';
import photoExample08 from '../../assets/photo-example-08.jpg';
import creatorPortrait from '../../assets/photograph-of-skin-schema.jpg';
import armani from '../../assets/workedwith/armani-beauty.png';
import naturopathica from '../../assets/workedwith/naturopathica.png';
import queen from '../../assets/workedwith/queen-musia.avif';
import saya from '../../assets/workedwith/saya.webp';
import valentino from '../../assets/workedwith/valentino@2x.png';

export const creatorImages = {
  portrait: creatorPortrait,
  campaignStill,
};

export const brandLogos = [
  {
    src: valentino,
    alt: 'Skin Schema has worked with Valentino',
    className: 'max-h-[20px]',
  },
  {
    src: armani,
    alt: 'Skin Schema has worked with Armani Beauty',
    className: 'max-h-[40px]',
  },
  {
    src: naturopathica,
    alt: 'Skin Schema has worked with Naturopathica',
    className: 'max-h-[20px]',
  },
  {
    src: queen,
    alt: 'Skin Schema has worked with Queen Musia',
    className: 'max-h-[20px]',
  },
  {
    src: saya,
    alt: 'Skin Schema has worked with Saya',
    className: 'max-h-[20px]',
  },
];

export const proofPoints = [
  {
    title: 'Authenticity at scale',
    text: 'Creator-led visuals that feel credible, specific, and true to how beauty customers actually discover products.',
  },
  {
    title: 'Brand-ready polish',
    text: 'Concepting, shooting, and editing are handled with a refined visual standard your team can use across launches, socials, and campaigns.',
  },
  {
    title: 'Beauty niche fit',
    text: 'A focused understanding of skincare, makeup, wellness, product textures, routines, and the details that make beauty content convert.',
  },
];

export const processSteps = [
  {
    number: '01',
    title: 'Concepting',
    text: 'Product showcases, unboxings, how-tos, before-and-afters, hooks, and beauty routines.',
  },
  {
    number: '02',
    title: 'Shooting',
    text: 'Polished production, product context, lifestyle detail, and Skin Schema-style serenity.',
  },
  {
    number: '03',
    title: 'Delivery',
    text: 'Content for social channels, launch moments, campaigns, and product education.',
  },
];

export const startingRates = [
  {
    title: 'Product Photo Sets',
    type: 'Photo Set',
    price: '$250',
    text: 'Refined product photography and texture visuals for skincare, makeup, and wellness brands.',
    specs: [
      ['Assets', '3'],
      ['Turnaround', '2 weeks'],
      ['Revisions', '1'],
      ['Length', 'N/A'],
    ],
  },
  {
    title: 'Short-Form Product Videos',
    type: 'Short Video',
    price: '$500',
    text: 'Elevated short-form videos for product showcases, unboxings, how-tos, before-and-afters, hooks, and beauty routines.',
    specs: [
      ['Assets', '1'],
      ['Turnaround', '2 weeks'],
      ['Revisions', '1'],
      ['Length', 'Up to 12 seconds'],
    ],
  },
  {
    title: 'Premium Product Videos',
    type: 'Premium Video',
    price: '$750',
    text: 'More developed beauty video concepts with polished production, product context, lifestyle detail, and campaign-style pacing.',
    specs: [
      ['Assets', '1'],
      ['Turnaround', '2 weeks'],
      ['Revisions', '1'],
      ['Length', 'Up to 30 seconds'],
    ],
  },
];

type RangeMedia =
  | {
      kind: 'image';
      src: ImageMetadata;
      alt: string;
    }
  | {
      kind: 'video';
      src: string;
      alt: string;
    };

type RangeExample = {
  id: string;
  kind: 'image' | 'video';
  src: ImageMetadata | string;
  label: string;
  carouselTitle: string;
  alt: string;
  columnWeight: number;
  aspectRatio: string;
  objectPosition: string;
  mediaTransform: string;
  carouselMedia: RangeMedia[];
};

export const rangeExamples = [
  {
    id: 'photo-set',
    kind: 'image',
    src: photoExample03,
    label: 'Photo set',
    carouselTitle: 'Photography examples',
    alt: 'Skincare product photography by Skin Schema',
    columnWeight: 0.8,
    aspectRatio: '4 / 5',
    objectPosition: 'center',
    mediaTransform: 'none',
    carouselMedia: [
      {
        kind: 'image',
        src: photoExample08,
        alt: 'Instagram high quality skincare photography example',
      },
      {
        kind: 'image',
        src: photoExample01,
        alt: 'Instagram high quality skincare photography example',
      },
      {
        kind: 'image',
        src: photoExample03,
        alt: 'Instagram high quality skincare photography example',
      },
      {
        kind: 'image',
        src: photoExample04,
        alt: 'Instagram high quality skincare photography example',
      },
      {
        kind: 'image',
        src: photoExample05,
        alt: 'Instagram high quality skincare photography example',
      },
      {
        kind: 'image',
        src: photoExample06,
        alt: 'Instagram high quality skincare photography example',
      },
    ],
  },
  {
    id: 'short-form-video',
    kind: 'video',
    src: '/media/videos/short-02.mp4',
    label: 'Short-form video',
    carouselTitle: 'Short form product examples',
    alt: 'Short-form beauty routine product video by Skin Schema',
    columnWeight: 0.5625,
    aspectRatio: '9 / 16',
    objectPosition: 'center',
    mediaTransform: 'none',
    carouselMedia: [
      {
        kind: 'video',
        src: '/media/videos/short-01.mp4',
        alt: 'Short-form skincare product texture video',
      },
      {
        kind: 'video',
        src: '/media/videos/short-02.mp4',
        alt: 'Short-form beauty routine product video',
      },
      {
        kind: 'video',
        src: '/media/videos/short-03.mp4',
        alt: 'Short-form makeup and skincare product video',
      },
    ],
  },
  {
    id: 'premium-video',
    kind: 'video',
    src: '/media/videos/premium-02.mp4',
    label: 'Premium video',
    carouselTitle: 'Product Storytelling Video examples',
    alt: 'Premium beauty product video by Skin Schema',
    columnWeight: 0.5625,
    aspectRatio: '9 / 16',
    objectPosition: 'center',
    mediaTransform: 'none',
    carouselMedia: [
      {
        kind: 'video',
        src: '/media/videos/premium-01.mp4',
        alt: 'Premium skincare product storytelling video',
      },
      {
        kind: 'video',
        src: '/media/videos/premium-02.mp4',
        alt: 'Premium beauty product routine video',
      },
      {
        kind: 'video',
        src: '/media/videos/premium-03.mp4',
        alt: 'Premium skincare campaign storytelling video',
      },
    ],
  },
] satisfies RangeExample[];
