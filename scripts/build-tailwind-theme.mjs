import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildTailwindCssArtifacts } from '../src/css-utils/tailwind-token-generator.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const outputDir = path.join(projectRoot, 'src/css/generated');

const readJson = async (...segments) =>
  JSON.parse(await readFile(path.join(projectRoot, ...segments), 'utf8'));

const writeArtifact = async (filename, contents) => {
  const filePath = path.join(outputDir, filename);
  await writeFile(filePath, contents, 'utf8');
  return filePath;
};

const main = async () => {
  const [
    colorTokens,
    fontTokens,
    spacingTokens,
    textLeadingTokens,
    textSizeTokens,
    textWeightTokens,
    viewportTokens,
  ] = await Promise.all([
    readJson('src/design-tokens/colors.json'),
    readJson('src/design-tokens/fonts.json'),
    readJson('src/design-tokens/spacing.json'),
    readJson('src/design-tokens/text-leading.json'),
    readJson('src/design-tokens/text-sizes.json'),
    readJson('src/design-tokens/text-weights.json'),
    readJson('src/design-tokens/viewports.json'),
  ]);

  await mkdir(outputDir, { recursive: true });

  const { themeCss, utilitiesCss } = buildTailwindCssArtifacts({
    colorTokens: colorTokens.items,
    fontTokens: fontTokens.items,
    spacingTokens: spacingTokens.items,
    textSizeTokens: textSizeTokens.items,
    textLeadingTokens: textLeadingTokens.items,
    textWeightTokens: textWeightTokens.items,
    viewportTokens,
  });

  const files = await Promise.all([
    writeArtifact('tailwind-theme.css', themeCss),
    writeArtifact('tailwind-utilities.css', utilitiesCss),
  ]);

  files.forEach((file) =>
    console.log(`wrote ${path.relative(projectRoot, file)}`),
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
