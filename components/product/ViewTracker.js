"use client";

import { useEffect } from "react";
import { trackProductView } from "../../lib/productService";

export default function ViewTracker({ productId }) {
  useEffect(() => {
    if (productId) trackProductView(productId);
  }, [productId]);

  return null;
}