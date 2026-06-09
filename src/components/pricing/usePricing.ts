// usePricing.ts
import { useEffect, useState } from "react";

// Mock implementation of fetchPrice since pricing.api does not exist
const fetchPrice = async (
  params: { country: string; currency: string; options: any; promoCode: string },
  options: { signal: AbortSignal }
) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (options.signal.aborted) {
        reject(new Error("Aborted"));
      } else {
        resolve({ finalPrice: params.options.quantity * 10, currency: params.currency });
      }
    }, 1000);
    options.signal.addEventListener("abort", () => clearTimeout(timeout));
  });
};

interface UsePricingProps {
  country: string;
  currency: string;
}

export function usePricing({ country, currency }: UsePricingProps) {
  const [options, setOptions] = useState({
    quantity: 1,
    premium: false,
  });

  const [promoCode, setPromoCode] = useState("");
  const [price, setPrice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadPrice = async () => {
      setLoading(true);
      try {
        const data = await fetchPrice(
          { country, currency, options, promoCode },
          { signal: controller.signal }
        );
        setPrice(data);
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message === 'Aborted') return;
        // fallback handling
        setPrice((prev: any) => prev || { finalPrice: 0, currency });
      } finally {
        setLoading(false);
      }
    };

    loadPrice();

    return () => controller.abort();
  }, [country, currency, options, promoCode]);

  return {
    price,
    loading,
    options,
    setOptions,
    promoCode,
    setPromoCode,
  };
}