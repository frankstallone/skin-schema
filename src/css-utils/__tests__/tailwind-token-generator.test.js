import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  buildTailwindCssArtifacts,
  COLOR_TONES,
  createClampValue,
  slugTokenName,
} from '../tailwind-token-generator.js';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDir, '../../..');

const readTokenJson = (...segments) =>
  JSON.parse(readFileSync(path.join(projectRoot, ...segments), 'utf8'));

const colors = readTokenJson('src/design-tokens/colors.json');
const fonts = readTokenJson('src/design-tokens/fonts.json');
const spacing = readTokenJson('src/design-tokens/spacing.json');
const textLeading = readTokenJson('src/design-tokens/text-leading.json');
const textSizes = readTokenJson('src/design-tokens/text-sizes.json');
const textWeights = readTokenJson('src/design-tokens/text-weights.json');
const viewports = readTokenJson('src/design-tokens/viewports.json');

const expectedColorIntents = [
  'control-background-color',
  'control-foreground-color',
  'control-border-color',
  'action-primary-background-color',
  'action-primary-foreground-color',
  'action-primary-border-color',
  'action-secondary-background-color',
  'action-secondary-foreground-color',
  'action-secondary-border-color',
  'action-auxiliary-background-color',
  'action-auxiliary-foreground-color',
  'action-auxiliary-border-color',
  'surface-primary-background-color',
  'surface-primary-foreground-color',
  'surface-primary-border-color',
  'surface-secondary-background-color',
  'surface-secondary-foreground-color',
  'surface-secondary-border-color',
  'surface-auxiliary-background-color',
  'surface-auxiliary-foreground-color',
  'surface-auxiliary-border-color',
  'figure-1st-color',
];

describe('tailwind token generator', () => {
  it('slugifies token names the same way as the existing Tailwind bridge', () => {
    assert.equal(slugTokenName('2XS - XS'), '2xs-xs');
    assert.equal(slugTokenName('Step 000'), 'step-000');
    assert.equal(slugTokenName('Rose 450'), 'rose-450');
  });

  it('preserves the existing clamp math for spacing and type tokens', () => {
    assert.equal(
      createClampValue({ min: 18, max: 24 }, viewports),
      'clamp(1.125rem, 0.99rem + 0.67vw, 1.5rem)',
    );
    assert.equal(
      createClampValue({ min: 21.6, max: 25 }, viewports),
      'clamp(1.35rem, 1.27rem + 0.38vw, 1.5625rem)',
    );
  });

  it('emits theme variables and custom utilities', () => {
    const { themeCss, utilitiesCss } = buildTailwindCssArtifacts({
      colorTokens: colors,
      fontTokens: fonts.items,
      spacingTokens: spacing.items,
      textSizeTokens: textSizes.items,
      textLeadingTokens: textLeading.items,
      textWeightTokens: textWeights.items,
      viewportTokens: viewports,
    });

    assert.match(themeCss, /--color-pine-750: #213f37;/);
    assert.match(themeCss, /--color-bone-050: #f2ede6;/);
    assert.match(themeCss, /--color-rose-250: #e6a0b5;/);
    assert.match(themeCss, /--color-rose-450: #d85b7d;/);
    assert.match(
      themeCss,
      /--color-surface-auxiliary-background-color: var\(--color-bone-050\);/,
    );
    assert.match(
      themeCss,
      /--color-surface-primary-background-color: var\(--color-rose-250\);/,
    );
    assert.match(
      themeCss,
      /\[data-mode~='dark'\][\s\S]*--color-surface-secondary-background-color: var\(--color-pine-900\);/,
    );
    assert.match(
      themeCss,
      /\[data-mode~='dark'\][\s\S]*--color-surface-auxiliary-background-color: var\(--color-pine-950\);/,
    );
    assert.match(
      themeCss,
      /--color-action-primary-background-color: var\(--color-rose-450\);/,
    );
    assert.match(
      themeCss,
      /--color-action-primary-foreground-color: var\(--color-pine-900\);/,
    );
    assert.doesNotMatch(
      themeCss,
      /--color-(?:gray|skin)-|--color-(?:paper|ink|muted-ink|rule|accent|accent-hover|focus|inverse(?:-[a-z-]+)?):/,
    );
    assert.match(
      themeCss,
      /--spacing-2xs-xs: clamp\(0\.5625rem, 0\.36rem \+ 1\.00vw, 1\.125rem\);/,
    );
    assert.match(
      themeCss,
      /--text-step-1: clamp\(1\.35rem, 1\.27rem \+ 0\.38vw, 1\.5625rem\);/,
    );
    assert.match(themeCss, /--font-base: Geist, sans-serif;/);
    assert.match(themeCss, /--font-weight-bold: 500;/);
    assert.match(themeCss, /--leading-fine: 1\.15;/);
    assert.match(themeCss, /--breakpoint-md: 760px;/);

    assert.match(utilitiesCss, /@utility flow-space-s \{/);
    assert.match(utilitiesCss, /--flow-space: var\(--spacing-s\);/);
    assert.match(utilitiesCss, /@utility region-space-l-xl \{/);
    assert.match(utilitiesCss, /@utility gutter-zero \{/);
  });

  it('defines every required tone once in each brand scale', () => {
    assert.deepEqual(Object.keys(colors.scales), ['pine', 'bone', 'rose']);

    Object.values(colors.scales).forEach((scale) => {
      assert.equal(Object.keys(scale).length, COLOR_TONES.length);
      assert.deepEqual(Object.keys(scale).sort(), [...COLOR_TONES].sort());
    });
  });

  it('keeps Tonal Foundry generation metadata aligned with the scales', () => {
    assert.equal(colors.foundry.destination, 'srgb');
    assert.equal(colors.foundry.tween, 'oklch');
    assert.deepEqual(
      Object.keys(colors.foundry.scales),
      Object.keys(colors.scales),
    );

    Object.entries(colors.foundry.scales).forEach(([scaleName, scale]) => {
      assert.ok(scale.keys.length > 0);
      scale.keys.forEach(({ tone }) => {
        assert.ok(colors.scales[scaleName][tone]);
      });
    });
  });

  it('defines the same complete intent set for every color mode', () => {
    assert.equal(colors.defaultMode, 'light');
    assert.deepEqual(colors.intents, expectedColorIntents);
    assert.deepEqual(Object.keys(colors.modes), ['light', 'dark']);

    Object.values(colors.modes).forEach((mode) => {
      assert.deepEqual(Object.keys(mode), colors.intents);
    });
  });

  it('rejects an incomplete color scale', () => {
    const incompleteColors = structuredClone(colors);
    delete incompleteColors.scales.pine['450'];

    assert.throws(
      () =>
        buildTailwindCssArtifacts({
          colorTokens: incompleteColors,
          fontTokens: fonts.items,
          spacingTokens: spacing.items,
          textSizeTokens: textSizes.items,
          textLeadingTokens: textLeading.items,
          textWeightTokens: textWeights.items,
          viewportTokens: viewports,
        }),
      /Color scale "pine" is invalid: missing 450\./,
    );
  });

  it('rejects a color intent that references an unknown color', () => {
    const invalidColors = structuredClone(colors);
    invalidColors.modes.dark['action-primary-background-color'] = {
      scale: 'rose',
      tone: '475',
    };

    assert.throws(
      () =>
        buildTailwindCssArtifacts({
          colorTokens: invalidColors,
          fontTokens: fonts.items,
          spacingTokens: spacing.items,
          textSizeTokens: textSizes.items,
          textLeadingTokens: textLeading.items,
          textWeightTokens: textWeights.items,
          viewportTokens: viewports,
        }),
      /Color intent "action-primary-background-color" references unknown color "rose\.475"\./,
    );
  });

  it('rejects a color mode with incomplete intent coverage', () => {
    const incompleteMode = structuredClone(colors);
    delete incompleteMode.modes.dark['control-border-color'];

    assert.throws(
      () =>
        buildTailwindCssArtifacts({
          colorTokens: incompleteMode,
          fontTokens: fonts.items,
          spacingTokens: spacing.items,
          textSizeTokens: textSizes.items,
          textLeadingTokens: textLeading.items,
          textWeightTokens: textWeights.items,
          viewportTokens: viewports,
        }),
      /Color mode "dark" is invalid: missing control-border-color\./,
    );
  });

  it('rejects color mode names that collide after slugification', () => {
    const collidingModes = structuredClone(colors);
    collidingModes.modes.DARK = structuredClone(colors.modes.dark);

    assert.throws(
      () =>
        buildTailwindCssArtifacts({
          colorTokens: collidingModes,
          fontTokens: fonts.items,
          spacingTokens: spacing.items,
          textSizeTokens: textSizes.items,
          textLeadingTokens: textLeading.items,
          textWeightTokens: textWeights.items,
          viewportTokens: viewports,
        }),
      /Color mode names must be unique after slugification\./,
    );
  });

  it('rejects assignment names that collide after slugification', () => {
    const collidingAssignments = structuredClone(colors);
    collidingAssignments.modes.dark['Control Background Color'] = {
      value: 'transparent',
    };

    assert.throws(
      () =>
        buildTailwindCssArtifacts({
          colorTokens: collidingAssignments,
          fontTokens: fonts.items,
          spacingTokens: spacing.items,
          textSizeTokens: textSizes.items,
          textLeadingTokens: textLeading.items,
          textWeightTokens: textWeights.items,
          viewportTokens: viewports,
        }),
      /Color mode "dark" assignment names must be unique after slugification\./,
    );
  });
});
