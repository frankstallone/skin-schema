import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import { describe, it } from 'node:test';

const componentPath = new URL('../InspirationalExamples.astro', import.meta.url);
const publicDirectory = new URL('../../../public/', import.meta.url);

const createVideo = (src) => {
  const sources = [];
  const video = {
    dataset: { src },
    loadCalls: 0,
    appendedSources: sources,
    append(source) {
      sources.push(source);
    },
    load() {
      this.loadCalls += 1;
    },
    querySelector(selector) {
      return selector === 'source' ? sources[0] : null;
    },
  };

  return video;
};

const runComponentScript = async ({ videos, IntersectionObserver }) => {
  const component = await readFile(componentPath, 'utf8');
  const script = component
    .match(/<script>([\s\S]*?)<\/script>/)[1]
    .replaceAll(': HTMLVideoElement', '')
    .replaceAll('<HTMLVideoElement>', '')
    .replaceAll(' as HTMLVideoElement', '');
  const createdSources = [];
  const document = {
    createElement(tagName) {
      assert.equal(tagName, 'source');

      const source = {};
      createdSources.push(source);
      return source;
    },
    querySelectorAll(selector) {
      assert.equal(selector, '.inspirational-example__video[data-src]');
      return videos;
    },
  };
  const context = { document, window: {} };

  if (IntersectionObserver) {
    context.window.IntersectionObserver = IntersectionObserver;
    context.IntersectionObserver = IntersectionObserver;
  }

  new Script(script).runInNewContext(context);

  return createdSources;
};

describe('InspirationalExamples', () => {
  it('renders the local product storytelling video assets without Instagram embeds', async () => {
    const component = await readFile(componentPath, 'utf8');

    assert.match(component, /id="InspirationalExamples"/);
    assert.match(component, /Product Storytelling Video examples/);
    assert.match(component, /premium-01\.mp4/);
    assert.match(component, /premium-02\.mp4/);
    assert.match(component, /premium-03\.mp4/);
    assert.match(component, /Premium skincare product storytelling video/);
    assert.match(component, /Premium beauty product routine video/);
    assert.match(component, /Premium skincare campaign storytelling video/);
    assert.match(component, /Visual product storytelling example/);
    assert.match(component, /aria-describedby/);
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

  it('loads only intersecting videos and unobserves them after source insertion', async () => {
    const videos = [
      createVideo('/media/videos/premium-01.mp4'),
      createVideo('/media/videos/premium-02.mp4'),
    ];
    const observed = [];
    const unobserved = [];
    let callback;

    class MockIntersectionObserver {
      constructor(observerCallback) {
        callback = observerCallback;
      }

      observe(video) {
        observed.push(video);
      }

      unobserve(video) {
        unobserved.push(video);
      }
    }

    const sources = await runComponentScript({
      videos,
      IntersectionObserver: MockIntersectionObserver,
    });

    assert.deepEqual(observed, videos);
    assert.equal(sources.length, 0);

    callback([
      { isIntersecting: false, target: videos[0] },
      { isIntersecting: true, target: videos[1] },
    ]);

    assert.equal(videos[0].appendedSources.length, 0);
    assert.equal(videos[0].loadCalls, 0);
    assert.equal(videos[1].appendedSources.length, 1);
    assert.equal(videos[1].appendedSources[0].src, '/media/videos/premium-02.mp4');
    assert.equal(videos[1].appendedSources[0].type, 'video/mp4');
    assert.equal(videos[1].loadCalls, 1);
    assert.deepEqual(unobserved, [videos[1]]);
  });

  it('loads all videos when IntersectionObserver is unavailable', async () => {
    const videos = [
      createVideo('/media/videos/premium-01.mp4'),
      createVideo('/media/videos/premium-02.mp4'),
      createVideo('/media/videos/premium-03.mp4'),
    ];

    await runComponentScript({ videos });

    videos.forEach((video) => {
      assert.equal(video.appendedSources.length, 1);
      assert.equal(video.appendedSources[0].src, video.dataset.src);
      assert.equal(video.appendedSources[0].type, 'video/mp4');
      assert.equal(video.loadCalls, 1);
    });
  });

  it('references video assets that exist in public media', async () => {
    const component = await readFile(componentPath, 'utf8');
    const assetPaths = component.match(/\/media\/videos\/premium-\d+\.mp4/g);

    assert.deepEqual(assetPaths, [
      '/media/videos/premium-01.mp4',
      '/media/videos/premium-02.mp4',
      '/media/videos/premium-03.mp4',
    ]);

    assetPaths.forEach((assetPath) => {
      const asset = new URL(`.${assetPath}`, publicDirectory);

      assert.equal(existsSync(asset), true);
      assert.ok(statSync(asset).size > 0);
    });
  });
});
