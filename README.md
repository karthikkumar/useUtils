# useUtils

_React Hooks that I use every day_

## 🪝 Hooks

1. [useLocalStorage](#uselocalstorage)

## useLocalStorage

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

#### Example

```js
const [data, saveData, removeData] = useLocalStorage("key", "defaultValue");

saveData("newValue");
removeData();
```
