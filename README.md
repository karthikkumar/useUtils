# useUtils

_React Hooks that I use every day_

## 🪝 Hooks

1. [useLocalStorage](#uselocalstorage)

## useLocalStorage

#### Code

```js
import { useCallback, useEffect, useState } from "react";

const useLocalStorage = (key, defaultValue) => {
  const [data, setData] = useState();

  const save = useCallback(
    (value) => {
      const valueAsString = JSON.stringify(value ?? defaultValue);
      window.localStorage.setItem(key, valueAsString);
    },
    [defaultValue, key]
  );
  const remove = useCallback(() => window.localStorage.removeItem(key), [key]);

  useEffect(() => {
    const existingData = window.localStorage.getItem(key);
    if (existingData) {
      setData(JSON.parse(existingData));
    } else if (defaultValue) {
      setData(defaultValue);
      save();
    }
  }, [defaultValue, key, save]);

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
