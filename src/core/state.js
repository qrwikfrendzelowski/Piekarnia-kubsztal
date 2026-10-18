const listeners = new Set();

let state = {
  cart: [],
  products: [],
};

function notify() {
  for (const listener of listeners) listener(state);
}

export const store = {
  getState() {
    return state;
  },

  subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('A listener function is required.');
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setProducts(products) {
    state = { ...state, products: Array.isArray(products) ? products : [] };
    notify();
  },

  setCart(cart) {
    state = { ...state, cart: Array.isArray(cart) ? cart : [] };
    notify();
  },

  update(updater) {
    const nextState = updater(state);
    if (!nextState || typeof nextState !== 'object') throw new TypeError('The state updater must return an object.');
    state = { ...state, ...nextState };
    notify();
  },
};
