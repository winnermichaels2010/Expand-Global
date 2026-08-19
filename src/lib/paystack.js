let scriptPromise = null;

export function loadPaystackScript() {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      scriptPromise = null;
      reject(new Error('Paystack script timed out. Check your connection or disable ad blockers.'));
    }, 15000);

    if (window.PaystackPop && typeof window.PaystackPop.setup === 'function') {
      clearTimeout(timeout);
      resolve(window.PaystackPop);
      return;
    }

    const existing = document.getElementById('paystack-inline-script');
    if (existing) {
      existing.addEventListener('load', () => {
        clearTimeout(timeout);
        if (window.PaystackPop && typeof window.PaystackPop.setup === 'function') {
          resolve(window.PaystackPop);
        } else {
          scriptPromise = null;
          reject(new Error('Paystack failed to initialize. Disable ad blockers and try again.'));
        }
      });
      existing.addEventListener('error', () => {
        clearTimeout(timeout);
        scriptPromise = null;
        reject(new Error('Failed to load Paystack script. Check your connection.'));
      });
      return;
    }

    const script = document.createElement('script');
    script.id = 'paystack-inline-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      clearTimeout(timeout);
      if (window.PaystackPop && typeof window.PaystackPop.setup === 'function') {
        resolve(window.PaystackPop);
      } else {
        scriptPromise = null;
        reject(new Error('Paystack failed to initialize. Disable ad blockers and try again.'));
      }
    };
    script.onerror = () => {
      clearTimeout(timeout);
      scriptPromise = null;
      reject(new Error('Failed to load Paystack script. Check your connection.'));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}
