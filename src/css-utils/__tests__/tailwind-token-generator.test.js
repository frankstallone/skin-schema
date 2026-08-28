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
    assert.match(themeCss, /--color-paper: var\(--color-bone-050\);/);
    assert.match(themeCss, /--color-ink: var\(--color-pine-750\);/);
    assert.match(themeCss, /--color-inverse-paper: var\(--color-pine-950\);/);
    assert.match(themeCss, /--color-inverse-ink: var\(--color-bone-050\);/);
    assert.doesNotMatch(themeCss, /--color-(?:gray|skin)-/);
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

  it('rejects a semantic role that references an unknown color', () => {
    const invalidColors = structuredClone(colors);
    invalidColors.roles.focus = { scale: 'rose', tone: '475' };

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
      /Color role "focus" references unknown color "rose\.475"\./,
    );
  });
});
