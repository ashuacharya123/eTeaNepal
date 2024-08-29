import { createContext } from "react";

export const cartContext = createContext([
  {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
  },
]);

export const showCart = createContext(false);

export const buy = createContext([{}]);
