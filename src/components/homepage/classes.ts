import { actionButton, primaryAction } from '../actionClasses';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current';

export const homepageBrand = `font-mono font-bold uppercase text-action-auxiliary-foreground-color no-underline ${focusRing}`;

export const homepageKicker =
  'm-zero max-w-none font-mono text-step-000 font-bold uppercase';

export const homepageButton = `homepage-motion-action ${actionButton}`;

export const homepagePrimaryAction = `homepage-motion-action ${primaryAction}`;

export const homepageNavLink = `text-action-auxiliary-foreground-color no-underline ${focusRing}`;
