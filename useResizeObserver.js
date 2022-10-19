import { useCallback, useEffect, useRef, useState } from "react";
// import ResizeObserver from "resize-observer-polyfill";

function useResizeObserver(element) {
  const [size, setSize] = useState();
  const observer = useRef();
  const callback = useRef();

  const onResize = useCallback((fn) => {
    callback.current = fn;
  }, []);

  useEffect(() => {
    const current = element && element.current;

    if (current && observer.current) {
      observer.current.unobserve(current);
    }

    observer.current = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (
          entry.contentRect &&
          (entry.contentRect.width !== size?.width ||
            entry.contentRect.height !== size?.height)
        ) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });
    });

    if (current && observer.current) {
      observer.current.observe(current);
    }

    return () => {
      if (observer && observer.current && current) {
        observer.current.unobserve(current);
      }
    };
  }, [element]);

  useEffect(() => {
    if (callback.current && size) {
      callback.current(size);
    }
  }, [size]);

  return [size, onResize];
}

export default useResizeObserver;
