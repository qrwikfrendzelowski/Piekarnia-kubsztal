const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrorElement(form, id) {
  return form.querySelector(`#${id}`);
}

function setFieldError(control, errorElement, message) {
  control.setCustomValidity(message);
  control.setAttribute("aria-invalid", String(Boolean(message)));
  errorElement.textContent = message;
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateOrderForm(form) {
  const name = form.elements.namedItem("name");
  const email = form.elements.namedItem("email");
  const pickupDate = form.elements.namedItem("pickupDate");
  const productCheckboxes = Array.from(form.querySelectorAll('input[name="products"]'));
  const productFieldset = form.querySelector("#order-products");
  const selectedProducts = productCheckboxes.filter((checkbox) => {
    const item = checkbox.closest("[data-cart-item]");
    const quantity = item?.querySelector('input[type="number"]');
    return checkbox.checked && Number(quantity?.value) > 0;
  });

  const nameError = getErrorElement(form, "customer-name-error");
  const emailError = getErrorElement(form, "customer-email-error");
  const pickupDateError = getErrorElement(form, "pickup-date-error");
  const productError = getErrorElement(form, "product-selection-error");

  const nameValue = name.value.trim();
  name.value = nameValue;
  setFieldError(
    name,
    nameError,
    nameValue ? "" : "Enter your name."
  );

  const emailValue = email.value.trim();
  email.value = emailValue;
  setFieldError(
    email,
    emailError,
    !emailValue
      ? "Enter your email address."
      : EMAIL_PATTERN.test(emailValue)
        ? ""
        : "Enter a valid email address."
  );

  const today = getLocalDateString();
  const pickupValue = pickupDate.value;
  setFieldError(
    pickupDate,
    pickupDateError,
    !pickupValue
      ? "Choose a pickup date."
      : pickupValue > today
        ? ""
        : "Choose a date in the future."
  );

  const productMessage = selectedProducts.length
    ? ""
    : "Add at least one product with a quantity greater than zero.";
  productFieldset.setAttribute("aria-invalid", String(Boolean(productMessage)));
  productError.textContent = productMessage;
  productCheckboxes.forEach((checkbox, index) => {
    const message = index === 0 ? productMessage : "";
    checkbox.setCustomValidity(message);
    checkbox.setAttribute("aria-invalid", String(Boolean(message)));
  });

  return form.checkValidity();
}

export function initializeOrderForm(form) {
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError("initializeOrderForm requires an HTML form element.");
  }

  const pickupDate = form.elements.namedItem("pickupDate");
  pickupDate.min = getLocalDateString();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = getErrorElement(form, "order-form-status");
    status.textContent = "";
    form.dataset.validationAttempted = "true";

    if (!validateOrderForm(form)) {
      const firstInvalidControl = form.querySelector(
        'input[aria-invalid="true"]:not([disabled]), select[aria-invalid="true"]:not([disabled]), textarea[aria-invalid="true"]:not([disabled])'
      );
      firstInvalidControl?.focus();
      return;
    }

    status.textContent = "Your order details are valid and ready to submit.";
    form.dispatchEvent(new CustomEvent("order:valid", {
      bubbles: true,
      detail: new FormData(form)
    }));
  });

  form.addEventListener("input", () => {
    const status = getErrorElement(form, "order-form-status");
    if (status.textContent) {
      status.textContent = "";
    }
    if (form.dataset.validationAttempted === "true") {
      validateOrderForm(form);
    }
  });

  form.addEventListener("change", () => {
    if (form.dataset.validationAttempted === "true") {
      validateOrderForm(form);
    }
  });
}

