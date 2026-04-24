// usePricing.ts
import { useEffect, useState } from "react";
import { fetchPrice } from "../services/pricing.api";

export function usePricing({ country, currency }) {
  const [options, setOptions] = useState({
    quantity: 1,
    premium: false,
  });

  const [promoCode, setPromoCode] = useState("");
  const [price, setPrice] = useState(null);
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
      } catch (err) {
        // fallback handling
        setPrice((prev) => prev || { finalPrice: 0, currency });
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