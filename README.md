# useUtils

_React Hooks that I use every day_

## 🪝 Hooks

1. [useLocalStorage](#uselocalstorage)

## useLocalStorage

A hook to persist data locally on a browser. Covers most required use-cases of `localStorage`.

#### Code

```js
import { useCallback, useEffect, useState } from "react";

const useLocalStorage = (key, defaultValue) => {
  const [data, setData] = useState(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const existingData = window.localStorage.getItem(key);
      return existingData ? JSON.parse(existingData) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const save = useCallback(
    (value) => {
      if (typeof window !== "undefined") {
        const valueAsString = JSON.stringify(value ?? defaultValue);
        window.localStorage.setItem(key, valueAsString);
      }
    },
    [defaultValue, key]
  );
  const remove = useCallback(() => window.localStorage.removeItem(key), [key]);

  const onStorageEvent = useCallback(
    (e) => {
      if (
        e.storageArea === window.localStorage &&
        e.key === key &&
        e.newValue
      ) {
        setData(JSON.parse(e.newValue));
      }
    },
    [key]
  );

  useEffect(() => {
    window.addEventListener("storage", onStorageEvent);
    return () => window.removeEventListener("storage", onStorageEvent);
  }, [onStorageEvent, key]);

  return [data, save, remove];
};
```

[useLocalStorage.js](./useLocalStorage.js)

#### Example

```js
const [data, saveData, removeData] = useLocalStorage("key", "defaultValue");

saveData("newValue");
removeData();
```

---

## useResizeObserver

Pass in `ref` of an element and get size (width & height) changes on resize.

#### Code

```js
import { useCallback, useEffect, useRef, useState } from "react";

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
```

[useResizeObserver.js](./useResizeObserver.js)

#### Example

```js
function Example() {
  const ref = useRef();
  const [size, onResize] = useResizeObserver(ref);

  onResize((size) => {
    console.log(size);
  });

  return (
    <div>
      <textarea ref={ref} defaultValue="An inbuilt resizable input element" />
      <p>
        Textarea's width is {size?.width} & height is {size?.height}
      </p>
    </div>
  );
}
```
