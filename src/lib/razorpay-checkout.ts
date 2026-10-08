export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  handler: () => void;
  modal: { ondismiss: () => void };
};

export type RazorpayCheckout = {
  open: () => void;
  on: (event: "payment.failed", handler: () => void) => void;
};

export type RazorpayCheckoutConstructor = new (options: RazorpayCheckoutOptions) => RazorpayCheckout;

declare global {
  interface Window {
    Razorpay?: RazorpayCheckoutConstructor;
  }
}

const checkoutScriptId = "cliniq-razorpay-checkout";
const checkoutScriptUrl = "https://checkout.razorpay.com/v1/checkout.js";
let loadingCheckout: Promise<RazorpayCheckoutConstructor> | null = null;

/** Loads Razorpay's official browser Checkout only when a patient starts payment. */
export function loadRazorpayCheckout(): Promise<RazorpayCheckoutConstructor> {
  if (typeof window === "undefined") return Promise.reject(new Error("Razorpay Checkout is only available in the browser."));
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (loadingCheckout) return loadingCheckout;

  loadingCheckout = new Promise<RazorpayCheckoutConstructor>((resolve, reject) => {
    const script = document.getElementById(checkoutScriptId) ?? document.createElement("script");
    const complete = () => {
      if (window.Razorpay) resolve(window.Razorpay);
      else reject(new Error("Razorpay Checkout did not load."));
    };
    script.addEventListener("load", complete, { once: true });
    script.addEventListener("error", () => reject(new Error("Razorpay Checkout could not be loaded.")), { once: true });
    if (!script.parentNode) {
      script.id = checkoutScriptId;
      script.setAttribute("src", checkoutScriptUrl);
      document.head.appendChild(script);
    }
  }).catch((error: unknown) => {
    loadingCheckout = null;
    throw error;
  });

  return loadingCheckout;
}
