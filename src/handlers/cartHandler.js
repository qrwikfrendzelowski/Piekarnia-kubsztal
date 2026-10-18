function getCartElements(form) {
  return {
    items: Array.from(form.querySelectorAll("[data-cart-item]")),
    count: form.querySelector("#cart-count")
  };
}

function updateCartItem(item) {
  const checkbox = item.querySelector('input[type="checkbox"]');
  const quantity = item.querySelector('input[type="number"]');
  const decrementButton = item.querySelector('[data-cart-action="decrement"]');
  const parsedQuantity = Number(quantity.value);
  const itemQuantity = Number.isFinite(parsedQuantity) ? Math.max(0, Math.floor(parsedQuantity)) : 0;

  quantity.value = String(itemQuantity);
  checkbox.checked = itemQuantity > 0;
  quantity.disabled = !checkbox.checked;
  decrementButton.disabled = Number(quantity.value) <= 0;
}

function updateCartCount(form) {
  const { items, count } = getCartElements(form);
  const itemCount = items.reduce((total, item) => {
    const quantity = item.querySelector('input[type="number"]');
    return total + Number(quantity.value);
  }, 0);
  count.textContent = `Cart: ${itemCount} ${itemCount === 1 ? "item" : "items"}`;
}

export function initializeCartHandler(form) {
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError("initializeCartHandler requires an HTML form element.");
  }

  form.querySelectorAll("[data-cart-item]").forEach((item) => {
    updateCartItem(item);
  });
  updateCartCount(form);

  form.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");
    if (!button || !form.contains(button)) {
      return;
    }

    const item = button.closest("[data-cart-item]");
    const quantity = item.querySelector('input[type="number"]');
    const checkbox = item.querySelector('input[type="checkbox"]');
    const action = button.dataset.cartAction;
    const currentQuantity = Number(quantity.value);

    if (action === "add" || action === "increment") {
      quantity.value = String(currentQuantity + 1);
    } else if (action === "decrement") {
      quantity.value = String(Math.max(0, currentQuantity - 1));
    } else {
      return;
    }

    checkbox.checked = Number(quantity.value) > 0;
    updateCartItem(item);
    updateCartCount(form);
    quantity.dispatchEvent(new Event("change", { bubbles: true }));
  });

  form.addEventListener("change", (event) => {
    const target = event.target;
    if (!target.matches('[data-cart-item] input[type="number"], [data-cart-item] input[type="checkbox"]')) {
      return;
    }

    const item = target.closest("[data-cart-item]");
    if (target.type === "checkbox") {
      const quantity = item.querySelector('input[type="number"]');
      const currentQuantity = Number(quantity.value);
      quantity.value = target.checked
        ? String(Math.max(1, Number.isFinite(currentQuantity) ? currentQuantity : 0))
        : "0";
    } else {
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.checked = Number(target.value) > 0;
    }

    updateCartItem(item);
    updateCartCount(form);
    item.dispatchEvent(new CustomEvent("cart:change", {
      bubbles: true,
      detail: {
        product: item.querySelector('input[type="checkbox"]').value,
        quantity: Number(item.querySelector('input[type="number"]').value)
      }
    }));
  });
}

