import { supabase } from "./supabaseClient";

// Set to true once you register for GST — rate is applied to the rent
// subtotal (not the security deposit, which isn't a sale).
export const GST_APPLICABLE = false;
export const GST_RATE = 0.18;

// ── helpers ──────────────────────────────────────────────────────────────

export function slugify(name = "") {
  return name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapProductRow(p) {
  return {
    id: p.id,
    slug: p.slug,
    category: p.category,
    brand: p.brand || "",
    name: p.name,
    specs: p.specs,
    shortDescription: p.short_description || "",
    fullDescription: p.full_description || "",
    pricePerDay: p.price_per_day,
    securityDeposit: p.security_deposit || 0,
    originalPrice: p.original_price || null,
    stockQuantity: p.stock_quantity ?? 1,
    availabilityStatus: p.availability_status || "available",
    isFeatured: !!p.is_featured,
    condition: p.condition || "New",
    sku: p.sku || "",
    viewCount: p.view_count || 0,
    image: p.image_url || "/images/laptop-placeholder.svg",
    tag: p.tag || "",
    createdAt: p.created_at,
  };
}

// ── reads ────────────────────────────────────────────────────────────────

/**
 * Get a page of products with optional search/filter/sort.
 * @returns {Promise<{ data: object[], count: number }>}
 */
export async function getAllProducts({
  page = 1,
  pageSize = 12,
  search = "",
  category = null,
  brand = null,
  maxPrice = null,
  sort = "popular", // popular | price_asc | price_desc | name_asc | newest
} = {}) {
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_deleted", false);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,specs.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%`
    );
  }
  if (category) query = query.eq("category", category);
  if (brand) query = query.eq("brand", brand);
  if (maxPrice) query = query.lte("price_per_day", maxPrice);

  if (sort === "price_asc") query = query.order("price_per_day", { ascending: true });
  else if (sort === "price_desc") query = query.order("price_per_day", { ascending: false });
  else if (sort === "name_asc") query = query.order("name", { ascending: true });
  else if (sort === "newest") query = query.order("created_at", { ascending: false });
  else query = query.order("is_featured", { ascending: false }).order("view_count", { ascending: false });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) {
    console.error("getAllProducts error:", error);
    return { data: [], count: 0 };
  }
  return { data: data.map(mapProductRow), count: count || 0 };
}

/** Full product detail by slug — product + images + details, in parallel. */
export async function getProductBySlug(slug) {
  const [{ data: product, error: productError }, { data: images }, { data: details }] = await Promise.all([
    supabase.from("products").select("*").eq("slug", slug).eq("is_deleted", false).single(),
    supabase.from("product_images").select("*").order("position", { ascending: true }),
    supabase.from("product_details").select("*"),
  ]);

  if (productError || !product) return null;

  const productImages = (images || [])
    .filter((img) => img.product_id === product.id)
    .sort((a, b) => (b.is_primary === a.is_primary ? a.position - b.position : b.is_primary ? 1 : -1));

  const productDetail = (details || []).find((d) => d.product_id === product.id) || null;

  return {
    ...mapProductRow(product),
    images: productImages.length
      ? productImages.map((img) => img.image_url)
      : [product.image_url || "/images/laptop-placeholder.svg"],
    details: productDetail
      ? {
          specifications: productDetail.specifications || [],
          features: productDetail.features || [],
          whatsIncluded: productDetail.whats_included || [],
          rentalTerms: productDetail.rental_terms || "",
          deliveryInformation: productDetail.delivery_information || "",
          returnPolicy: productDetail.return_policy || "",
          warranty: productDetail.warranty || "",
          faqs: productDetail.faqs || [],
          tags: productDetail.tags || [],
          metaTitle: productDetail.meta_title || "",
          metaDescription: productDetail.meta_description || "",
        }
      : null,
  };
}

export async function getFeaturedProducts(limit = 8) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_deleted", false)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedProducts error:", error);
    return [];
  }
  return data.map(mapProductRow);
}

/** Same category OR brand, similar price range (±40%), excluding the current product. */
export async function getRelatedProducts(product, limit = 8) {
  if (!product) return [];
  const minPrice = product.pricePerDay * 0.6;
  const maxPrice = product.pricePerDay * 1.4;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_deleted", false)
    .neq("id", product.id)
    .or(`category.eq.${product.category},brand.eq.${product.brand}`)
    .gte("price_per_day", minPrice)
    .lte("price_per_day", maxPrice)
    .limit(limit);

  if (error) {
    console.error("getRelatedProducts error:", error);
    return [];
  }

  // if the price-range filter left us short, top up with same-category items
  if (data.length < limit) {
    const { data: fallback } = await supabase
      .from("products")
      .select("*")
      .eq("is_deleted", false)
      .eq("category", product.category)
      .neq("id", product.id)
      .limit(limit);
    const merged = [...data, ...(fallback || [])].filter(
      (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
    );
    return merged.slice(0, limit).map(mapProductRow);
  }

  return data.map(mapProductRow);
}

export async function searchProducts(term, limit = 10) {
  if (!term) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_deleted", false)
    .or(`name.ilike.%${term}%,brand.ilike.%${term}%,category.ilike.%${term}%`)
    .limit(limit);

  if (error) {
    console.error("searchProducts error:", error);
    return [];
  }
  return data.map(mapProductRow);
}

// ── view tracking ────────────────────────────────────────────────────────

function getOrCreateSessionId() {
  if (typeof window === "undefined") return null;
  const key = "rentogram_session_id";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem(key, id);
  }
  return id;
}

export async function trackProductView(productId) {
  if (!productId) return;
  const sessionId = getOrCreateSessionId();
  const { error } = await supabase.from("product_views").insert([
    { product_id: productId, session_id: sessionId },
  ]);
  if (error) console.error("trackProductView error:", error);
}

// ── admin writes (require service_role — see lib/supabaseAdmin.js) ───────
// These are here for a future admin panel to call from server-side API
// routes. They will fail under the anon key because RLS blocks anon writes
// on `products` by design.

export async function createProduct(adminClient, payload) {
  const slug = payload.slug || slugify(payload.name);
  const { data, error } = await adminClient.from("products").insert([{ ...payload, slug }]).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(adminClient, id, payload) {
  const { data, error } = await adminClient.from("products").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function softDeleteProduct(adminClient, id) {
  const { error } = await adminClient.from("products").update({ is_deleted: true }).eq("id", id);
  if (error) throw error;
}

// ── rental orders ────────────────────────────────────────────────────────

export function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RNT-${ts}-${rand}`;
}

/**
 * Pure calculation helper — no network calls — used to show a live price
 * breakdown in the Rent Now form before submission.
 */
export function calculateOrderTotals({ unitRentPrice, unitSecurityDeposit = 0, quantity = 1, days = 1 }) {
  const subtotal = unitRentPrice * quantity * days;
  const securityDeposit = unitSecurityDeposit * quantity;
  const gst = GST_APPLICABLE ? Math.round(subtotal * GST_RATE) : 0;
  const total = subtotal + securityDeposit + gst;
  return { subtotal, securityDeposit, gst, total };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // fallback UUID v4 for older browsers / non-secure contexts
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Creates a rental order + its single line item. Returns the generated
 * order_number on success (used to redirect to the confirmation page).
 *
 * NOTE: rental_orders/rental_order_items intentionally have no anon SELECT
 * policy (guest order data shouldn't be publicly browsable) — only INSERT.
 * That means we can't `.select().single()` the row back after inserting, so
 * we generate the id client-side up front and use it directly.
 */
export async function createRentalOrder({ customer, rental, product, totals }) {
  const orderNumber = generateOrderNumber();
  const orderId = makeId();

  const { error: orderError } = await supabase.from("rental_orders").insert([
    {
      id: orderId,
      order_number: orderNumber,
      customer_name: customer.name,
      customer_mobile: customer.mobile,
      customer_email: customer.email || null,
      customer_address: customer.address,
      customer_city: customer.city,
      customer_state: customer.state,
      customer_pincode: customer.pincode,
      start_date: rental.startDate,
      end_date: rental.endDate,
      rental_duration_days: rental.days,
      subtotal_amount: totals.subtotal,
      security_deposit_amount: totals.securityDeposit,
      gst_amount: totals.gst,
      total_amount: totals.total,
    },
  ]);

  if (orderError) throw orderError;

  const { error: itemError } = await supabase.from("rental_order_items").insert([
    {
      order_id: orderId,
      // demo/sample catalog products use string ids like "lap-001", which
      // aren't valid uuids — the FK column allows null, so fall back to that
      // rather than letting the insert fail on a type error.
      product_id: UUID_RE.test(product.id) ? product.id : null,
      product_name: product.name,
      product_image: product.image,
      unit_rent_price: product.pricePerDay,
      unit_security_deposit: product.securityDeposit || 0,
      quantity: rental.quantity,
      line_rent_total: totals.subtotal,
      line_deposit_total: totals.securityDeposit,
    },
  ]);

  if (itemError) throw itemError;

  return orderNumber;
}

/** Guest-safe order lookup — only returns a row if the exact order_number is known. */
export async function getOrderByNumber(orderNumber) {
  const { data, error } = await supabase.rpc("get_order_details", { p_order_number: orderNumber });
  if (error) {
    console.error("getOrderByNumber error:", error);
    return null;
  }
  return data; // { order: {...}, items: [...] } or null
}