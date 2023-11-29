import { useEffect, useState, useRef, RefObject } from 'react';

export default function useOnScreen(ref: RefObject<HTMLElement>) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) =>
      setIsOnScreen(entry.isIntersecting)
    );
  }, []);

  useEffect(() => {
    //@ts-ignore
    observerRef.current.observe(ref.current);

    return () => {
    //@ts-ignore
      observerRef.current.disconnect();
    };
  }, [ref]);

  return isOnScreen;
}
