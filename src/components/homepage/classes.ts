const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-skin-100';

export const homepageBrand = `font-mono font-bold uppercase text-current no-underline ${focusRing}`;

export const homepageKicker =
  'm-zero max-w-none font-mono text-step-000 font-bold uppercase';

export const homepageButton = `inline-flex w-fit rounded-full px-l py-2xs font-bold no-underline transition-[background,color,transform] duration-[180ms] ease-in-out hover:-translate-y-px ${focusRing}`;

export const homepageButtonLight = `${homepageButton} bg-skin-100 text-gray-1200 hover:bg-skin-500 focus:bg-skin-500`;

export const homepageNavLink = `text-current no-underline ${focusRing}`;
