import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';

const componentPath = new URL('../ShortFormExamples.astro', import.meta.url);

describe('ShortFormExamples', () => {
  it('renders the local short-form video assets without Instagram embeds', async () => {
    const component = await readFile(componentPath, 'utf8');

    assert.match(component, /id="ShortFormExamples"/);
    assert.match(component, /short-01\.mp4/);
    assert.match(component, /short-02\.mp4/);
    assert.match(component, /short-03\.mp4/);
    assert.match(component, /Short-form skincare product texture video/);
    assert.match(component, /Short-form beauty routine product video/);
    assert.match(component, /Short-form makeup and skincare product video/);
    assert.doesNotMatch(component, /instagram-media|data-instgrm/);
  });

  it('defers video sources until the lazy-load observer runs', async () => {
    const component = await readFile(componentPath, 'utf8');

    assert.match(component, /preload="none"/);
    assert.match(component, /data-src=\{example\.src\}/);
    assert.match(component, /IntersectionObserver/);
    assert.match(component, /rootMargin: '300px 100%'/);
    assert.doesNotMatch(component, /@media \(min-width:/);
    assert.doesNotMatch(component, /<source\s+src=\{example\.src\}/);
  });
});
