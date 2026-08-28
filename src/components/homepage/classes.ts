const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current';

export const homepageBrand = `font-mono font-bold uppercase text-action-auxiliary-foreground-color no-underline ${focusRing}`;

export const homepageKicker =
  'm-zero max-w-none font-mono text-step-000 font-bold uppercase';

export const homepageButton = `inline-flex w-fit rounded-full px-l py-2xs font-bold no-underline transition-[background,color,transform] duration-[180ms] ease-in-out hover:-translate-y-px ${focusRing}`;

export const homepagePrimaryAction = `${homepageButton} bg-action-primary-background-color text-action-primary-foreground-color hover:brightness-[1.08] focus:brightness-[1.08]`;

export const homepageNavLink = `text-action-auxiliary-foreground-color no-underline ${focusRing}`;
