const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

let reducedMotionQuery: MediaQueryList | undefined;

const getReducedMotionQuery = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  reducedMotionQuery ??= window.matchMedia(REDUCED_MOTION_QUERY);
  return reducedMotionQuery;
};

export const getReducedMotionSnapshot = () =>
  getReducedMotionQuery()?.matches ?? true;

export const getReducedMotionServerSnapshot = () => true;

export const subscribeToReducedMotion = (onChange: () => void) => {
  const query = getReducedMotionQuery();

  if (!query) {
    return () => undefined;
  }

  query.addEventListener('change', onChange);

  return () => query.removeEventListener('change', onChange);
};
