import { useRef, useEffect, useState, useMemo, DependencyList } from 'react'

export function useDidUpdateEffect(fn: () => void, inputs: DependencyList) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
  }, inputs);
}

type ProxiedState<T> = {
  [P in keyof T]: T[P];
};

export function useReactState<T extends object>(initialState: T): ProxiedState<T> {
  const [state, setState] = useState<T>(initialState)
  const stateRef = useRef<T>(state);

  const proxiedState = useMemo(() => new Proxy(stateRef.current, {
    set(target, property, value) {
      target[property as keyof T] = value;
      setState({ ...stateRef.current });
      return true;
    }
  }), [])

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return proxiedState
}