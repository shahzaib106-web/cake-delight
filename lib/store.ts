/**
 * Cake Delight — data layer.
 * Mode A (production): Supabase (set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars).
 * Mode B (demo/local): built-in JSON store at ./data/db.json — auto-seeded, fully functional.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { priceFor, ORDER_STATUSES, CUSTOM_STATUSES, type Product, type Flavor, type Testimonial, type Order, type OrderItem, type CustomOrder, type Message } from "./types";

/* ------------------------------- env / mode ------------------------------ */
const SUPA_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const usingSupabase = !!(SUPA_URL && SUPA_SERVICE);

let _supa: SupabaseClient | null = null;
export const supa = () => {
  if (!_supa) _supa = createClient(SUPA_URL, SUPA_SERVICE, { auth: { persistSession: false } });
  return _supa!;
};

/* --------------------------------- crypto -------------------------------- */
const SECRET = process.env.ADMIN_SECRET || "cake-delight-dev-secret-2026";
export function hashPassword(pw: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(pw, salt, 64).toString("hex")}`;
}
function verifyPassword(pw: string, stored: string) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(pw, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(check, "hex"));
}
export function signToken(id: number) {
  const exp = Date.now() + 7 * 864e5;
  const sig = crypto.createHmac("sha256", SECRET).update(`${id}.${exp}`).digest("hex");
  return `${id}.${exp}.${sig}`;
}
export function verifyToken(token: string): number | null {
  const [idS, expS, sig] = String(token || "").split(".");
  if (!idS || !expS || !sig) return null;
  if (Date.now() > +expS) return null;
  const expect = crypto.createHmac("sha256", SECRET).update(`${idS}.${expS}`).digest("hex");
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expect, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return +idS;
}

/* ------------------------------ local store ------------------------------ */
interface DB {
  admin_users: { id: number; username: string; password_hash: string; name: string }[];
  products: Product[];
  flavors: Flavor[];
  testimonials: Testimonial[];
  orders: Order[];
  order_items: OrderItem[];
  custom_orders: CustomOrder[];
  messages: Message[];
  settings?: Record<string, string>;
}
const DB_PATH = path.join(process.cwd(), "data", "db.json");

function seedDB(): DB {
  const now = Date.now();
  const iso = (daysAgo: number) => new Date(now - daysAgo * 864e5).toISOString();
  const P = (o: Partial<Product> & { name: string; category: string; price: number; image: string; description: string }, i: number): Product => ({
    id: i, rating: 4.8, reviews: 0, badge: "", bestseller: 0, active: 1, long_description: "", created_at: iso(30 - i), ...o,
  } as Product);
  return {
    admin_users: [{ id: 1, username: "admin", password_hash: hashPassword("admin123"), name: "Cake Delight Admin" }],
    products: [
      P({ name: "Chocolate Truffle Cake", category: "birthday", price: 2500, image: "/img/prod-chocolate-truffle.jpg", description: "Rich chocolate layers with silky truffle ganache and chocolate curls.", long_description: "Our signature Chocolate Truffle Cake layers moist chocolate sponge with silky dark truffle ganache, finished with hand-rolled chocolate curls and a dusting of premium cocoa. Made fresh to order with imported Belgian chocolate.", rating: 4.9, reviews: 128, badge: "Best Seller", bestseller: 1 }, 1),
      P({ name: "Red Velvet Cake", category: "anniversary", price: 2800, image: "/img/prod-red-velvet.jpg", description: "Classic red velvet with smooth cream cheese frosting.", long_description: "A timeless classic — deep red velvet sponge with buttermilk tenderness, layered with silky cream cheese frosting and coated in red velvet crumbs, topped with fresh raspberries.", rating: 4.8, reviews: 96, bestseller: 1 }, 2),
      P({ name: "Unicorn Kids Cake", category: "kids", price: 3000, image: "/img/prod-unicorn.jpg", description: "Magical pastel mane, golden horn and glitter stars.", long_description: "Every child's dream cake! A magical unicorn with a pastel buttercream mane in pink, lavender and mint, a golden horn and edible glitter stars. Funfetti sponge inside makes every slice a party.", rating: 4.9, reviews: 74, badge: "Kids Favorite", bestseller: 1 }, 3),
      P({ name: "Lotus Biscoff Cake", category: "birthday", price: 2700, image: "/img/prod-biscoff.jpg", description: "Caramel drip, Lotus biscuits and biscoff spread.", long_description: "The internet's favorite flavor — soft sponge layered with velvety Lotus Biscoff spread, a glossy caramel drip, crushed biscuit crumbs and whole Lotus biscuits on top.", rating: 4.8, reviews: 61, badge: "Trending", bestseller: 1 }, 4),
      P({ name: "Floral Wedding Cake", category: "wedding", price: 6500, image: "/img/cat-wedding.jpg", description: "Three ivory tiers with blush roses and pearl details.", long_description: "A show-stopping three-tier wedding cake in smooth ivory buttercream with hand-piped pearl details, blush garden roses and cascading greenery. Fully customizable to your wedding palette.", rating: 5.0, reviews: 52, badge: "Premium", bestseller: 1 }, 5),
      P({ name: "Heart Anniversary Cake", category: "anniversary", price: 3200, image: "/img/cat-anniversary.jpg", description: "Heart-shaped red velvet with rose petals.", long_description: "Celebrate love with sweetness — a heart-shaped red velvet cake with cream cheese frosting, fresh raspberries, dried rose petals and an elegant gold topper.", rating: 4.9, reviews: 45 }, 6),
      P({ name: "Celebration Cupcakes (Box of 6)", category: "cupcakes", price: 1200, image: "/img/cat-cupcakes.jpg", description: "Swirls of pink buttercream with gold sprinkles.", long_description: "Little treats, big happiness! A box of six gourmet cupcakes with tall swirls of blush-pink buttercream, gold sprinkles and rose petals.", rating: 4.8, reviews: 38 }, 7),
      P({ name: "Rainbow Party Cake", category: "kids", price: 2800, image: "/img/cat-kids.jpg", description: "Colorful Funfetti sponge with pastel buttercream.", long_description: "A party in every slice! Layers of colorful funfetti sponge under pastel pink buttercream with rainbow sprinkles.", rating: 4.7, reviews: 29 }, 8),
    ],
    flavors: [
      ["Chocolate Truffle", "Belgian chocolate sponge with dark truffle ganache", "classic"],
      ["Red Velvet", "Classic buttermilk red velvet with cream cheese frosting", "classic"],
      ["Vanilla Bean", "Madagascar vanilla sponge with silky buttercream", "classic"],
      ["Lotus Biscoff", "Spiced biscoff spread with caramel drip", "premium"],
      ["Pistachio Rose", "Roasted pistachio sponge with rose cream", "premium"],
      ["Chocolate Fudge", "Double chocolate fudge with ganache layers", "classic"],
      ["Funfetti", "Vanilla sponge loaded with rainbow sprinkles", "classic"],
      ["Strawberry Cream", "Fresh strawberry compote with whipped cream", "fruity"],
      ["Mango Delight", "Seasonal mango chunks with mango mousse", "fruity"],
      ["Butterscotch", "Caramel butterscotch with praline crunch", "premium"],
      ["Caramel Coffee", "Espresso sponge with salted caramel", "premium"],
      ["Coconut Dream", "Coconut sponge with mascarpone cream", "fruity"],
    ].map((f, i) => ({ id: i + 1, name: f[0] as string, description: f[1] as string, tag: f[2] as string, active: 1 })),
    testimonials: [
      { id: 1, name: "Usman Ali", location: "Sahiwal", text: "From ordering to delivery, everything was smooth. The cake was fresh and delicious and the service was even better. Highly recommended!", rating: 5, active: 1 },
      { id: 2, name: "Ayesha Malik", location: "Sahiwal", text: "The custom cake for my daughter's birthday was exactly what I imagined — beautiful design and amazing taste. Will order again for sure!", rating: 5, active: 1 },
      { id: 3, name: "Sara & Bilal", location: "Sahiwal", text: "Our anniversary cake was a big hit! So creative, delivered on time and in perfect condition. Cake Delight never disappoints.", rating: 5, active: 1 },
    ],
    orders: [
      { id: 1, order_no: "CD-2026-0001", customer_name: "Fatima Khan", phone: "03001234567", email: "fatima@example.pk", address: "House 12, Street 3, Farooq Colony", city: "Sahiwal", notes: "", delivery_date: new Date(now - 5 * 864e5).toISOString().slice(0, 10), delivery_slot: "evening", subtotal: 5300, delivery_fee: 0, total: 5300, payment_method: "cod", status: "delivered", created_at: iso(5) },
      { id: 2, order_no: "CD-2026-0002", customer_name: "Hamza Riaz", phone: "03217654321", email: "", address: "Flat 4B, Gulshan View, Canal Road", city: "Sahiwal", notes: "Ring the bell twice", delivery_date: new Date(now - 1 * 864e5).toISOString().slice(0, 10), delivery_slot: "afternoon", subtotal: 2800, delivery_fee: 200, total: 3000, payment_method: "cod", status: "out-for-delivery", created_at: iso(1) },
      { id: 3, order_no: "CD-2026-0003", customer_name: "Nimra Aslam", phone: "03331234567", email: "nimra@example.pk", address: "House 88, Block C, Taj City", city: "Sahiwal", notes: "", delivery_date: new Date(now + 1 * 864e5).toISOString().slice(0, 10), delivery_slot: "morning", subtotal: 6500, delivery_fee: 0, total: 6500, payment_method: "cod", status: "pending", created_at: iso(0.2) },
    ],
    order_items: [
      { id: 1, order_id: 1, product_id: 1, name: "Chocolate Truffle Cake", image: "/img/prod-chocolate-truffle.jpg", unit_price: 3500, qty: 1, size: "3 lb", flavor: "Chocolate Truffle", message: "Happy Birthday Ahmed!" },
      { id: 2, order_id: 1, product_id: 7, name: "Celebration Cupcakes (Box of 6)", image: "/img/cat-cupcakes.jpg", unit_price: 1200, qty: 1.5 > 1 ? 1 : 1, size: "2 lb", flavor: "", message: "" },
      { id: 3, order_id: 1, product_id: 2, name: "Red Velvet Cake", image: "/img/prod-red-velvet.jpg", unit_price: 2400, qty: 1, size: "1 lb", flavor: "Red Velvet", message: "" },
      { id: 4, order_id: 2, product_id: 8, name: "Rainbow Party Cake", image: "/img/cat-kids.jpg", unit_price: 2800, qty: 1, size: "2 lb", flavor: "Funfetti", message: "Happy 6th Zoya!" },
      { id: 5, order_id: 3, product_id: 5, name: "Floral Wedding Cake", image: "/img/cat-wedding.jpg", unit_price: 6500, qty: 1, size: "2 lb", flavor: "Vanilla Bean", message: "" },
    ],
    custom_orders: [
      { id: 1, ref_no: "CQ-0001", name: "Ayesha Malik", phone: "03211234567", email: "ayesha@example.pk", occasion: "🎂 Birthday", design: "A two-tier pink and gold cake with roses on top, 'Happy Birthday Ayesha' written on it.", flavor: "Pistachio Rose", size: "Medium · 2.5 lb", servings: 12, delivery_date: new Date(now + 3 * 864e5).toISOString().slice(0, 10), message: "Happy Birthday Ayesha!", budget: "Rs. 5,000 – 8,000", status: "quoted", admin_notes: "Quoted Rs. 6,500 on WhatsApp", created_at: iso(0.5) },
    ],
    messages: [
      { id: 1, name: "Bilal Ahmed", email: "bilal@example.pk", phone: "03011112222", subject: "Event / Wedding Cake", message: "Hi! I need a 3-tier wedding cake for 150 guests on the 20th. Can you share options and pricing?", is_read: 0, created_at: iso(0.3) },
      { id: 2, name: "Hina Tariq", email: "hina@example.pk", phone: "", subject: "General Question", message: "Do you offer eggless cakes? Also, is same-day delivery available for cupcakes?", is_read: 1, created_at: iso(2) },
    ],
  };
}

function readDB(): DB {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    const db = seedDB();
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 1));
    return db;
  }
}
function writeDB(db: DB) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 1));
}

/* ------------------------------ validation ------------------------------- */
const phoneOk = (p: string) => /^0?\d{9,11}$/.test(String(p || "").replace(/[\s-]/g, ""));
const CATS_OK = ["birthday", "wedding", "kids", "anniversary", "cupcakes"];

/* ----------------------------- public reads ------------------------------ */
export async function listProducts(opts: { category?: string; q?: string; bestseller?: string; sort?: string } = {}): Promise<Product[]> {
  if (usingSupabase) {
    let q = supa().from("products").select("*").eq("active", true);
    if (opts.category && opts.category !== "all") q = q.eq("category", opts.category);
    if (opts.bestseller === "1") q = q.eq("bestseller", true);
    if (opts.q) q = q.or(`name.ilike.%${opts.q}%,description.ilike.%${opts.q}%`);
    const order = opts.sort === "price-asc" ? { col: "price", dir: true } : opts.sort === "price-desc" ? { col: "price", dir: false } : opts.sort === "rating" ? { col: "rating", dir: false } : null;
    if (order) q = q.order(order.col, { ascending: order.dir });
    else q = q.order("bestseller", { ascending: false }).order("reviews", { ascending: false });
    const { data, error } = await q.limit(100);
    if (error) throw new Error(error.message);
    return (data || []) as Product[];
  }
  const db = readDB();
  let list = db.products.filter((p) => p.active);
  if (opts.category && opts.category !== "all") list = list.filter((p) => p.category === opts.category);
  if (opts.bestseller === "1") list = list.filter((p) => p.bestseller);
  if (opts.q) {
    const s = opts.q.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  const sort = opts.sort;
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "rating") list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  else list.sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || b.reviews - a.reviews);
  return list;
}

export async function getProductDetail(id: number) {
  const p = (await listProducts()).find((x) => x.id === id) || null;
  if (!p) return null;
  const sizes = Object.keys({ "1 lb": 1, "2 lb": 1, "3 lb": 1, "5 lb": 1 }).map((size) => ({ size, price: priceFor(p.price, size) }));
  const related = (await listProducts({ category: p.category })).filter((x) => x.id !== p.id).slice(0, 3);
  return { product: p, sizes, related };
}

export async function listFlavors(): Promise<Flavor[]> {
  if (usingSupabase) {
    const { data, error } = await supa().from("flavors").select("*").eq("active", true).order("tag").order("name");
    if (error) throw new Error(error.message);
    return (data || []) as Flavor[];
  }
  return readDB().flavors.filter((f) => f.active).sort((a, b) => a.tag.localeCompare(b.tag) || a.name.localeCompare(b.name));
}

export async function listTestimonials(): Promise<Testimonial[]> {
  if (usingSupabase) {
    const { data, error } = await supa().from("testimonials").select("*").eq("active", true).order("id", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as Testimonial[];
  }
  return readDB().testimonials.filter((t) => t.active).slice().reverse();
}

/* ----------------------------- public writes ----------------------------- */
export async function createMessage(d: Partial<Message>) {
  if (!d.name || !d.message) throw new Error("Name and message are required");
  if (usingSupabase) {
    const { error } = await supa().from("messages").insert({ name: d.name, email: d.email || "", phone: d.phone || "", subject: d.subject || "General", message: d.message });
    if (error) throw new Error(error.message);
    return { ok: true };
  }
  const db = readDB();
  db.messages.push({ id: Math.max(0, ...db.messages.map((m) => m.id)) + 1, name: String(d.name).slice(0, 100), email: String(d.email || "").slice(0, 120), phone: String(d.phone || "").slice(0, 30), subject: String(d.subject || "General").slice(0, 100), message: String(d.message).slice(0, 2000), is_read: 0, created_at: new Date().toISOString() });
  writeDB(db);
  return { ok: true };
}

export async function createOrder(d: any): Promise<{ order_no: string }> {
  const { customer_name, phone, address, items } = d || {};
  if (!customer_name || !phone || !address) throw new Error("Name, phone and address are required");
  if (!phoneOk(phone)) throw new Error("Please enter a valid Pakistani phone number");
  if (!Array.isArray(items) || !items.length) throw new Error("Your cart is empty");

  const all = await listProducts();
  let subtotal = 0;
  const rows: OrderItem[] = [];
  for (const it of items) {
    const prod = all.find((p) => p.id === +it.product_id);
    if (!prod) throw new Error("One of the products is no longer available");
    const qty = Math.min(Math.max(parseInt(it.qty) || 1, 1), 20);
    const size = ["1 lb", "2 lb", "3 lb", "5 lb"].includes(it.size) ? it.size : "2 lb";
    const unit_price = priceFor(prod.price, size);
    subtotal += unit_price * qty;
    rows.push({ product_id: prod.id, name: prod.name, image: prod.image, unit_price, qty, size, flavor: String(it.flavor || "").slice(0, 60), message: String(it.message || "").slice(0, 200) });
  }
  const delivery_fee = subtotal >= 3000 ? 0 : 200;
  const total = subtotal + delivery_fee;

  if (usingSupabase) {
    const { data: o, error } = await supa().from("orders").insert({ customer_name, phone, email: d.email || "", address, city: d.city || "Sahiwal", notes: d.notes || "", delivery_date: d.delivery_date || "", delivery_slot: d.delivery_slot || "anytime", subtotal, delivery_fee, total, payment_method: "cod", status: "pending" }).select("id").single();
    if (error) throw new Error(error.message);
    const order_no = `CD-${new Date().getFullYear()}-${String(o.id).padStart(4, "0")}`;
    await supa().from("orders").update({ order_no }).eq("id", o.id);
    await supa().from("order_items").insert(rows.map((r) => ({ ...r, order_id: o.id })));
    return { order_no };
  }
  const db = readDB();
  const id = Math.max(0, ...db.orders.map((o) => o.id)) + 1;
  const order_no = `CD-${new Date().getFullYear()}-${String(db.orders.length + 1).padStart(4, "0")}`;
  db.orders.push({ id, order_no, customer_name: String(customer_name).slice(0, 100), phone: String(phone).slice(0, 30), email: String(d.email || "").slice(0, 120), address: String(address).slice(0, 400), city: String(d.city || "Sahiwal").slice(0, 60), notes: String(d.notes || "").slice(0, 500), delivery_date: String(d.delivery_date || "").slice(0, 20), delivery_slot: String(d.delivery_slot || "anytime").slice(0, 30), subtotal, delivery_fee, total, payment_method: "cod", status: "pending", created_at: new Date().toISOString() });
  rows.forEach((r, i) => db.order_items.push({ ...r, id: Math.max(0, ...db.order_items.map((x) => x.id || 0)) + 1 + i, order_id: id }));
  writeDB(db);
  return { order_no };
}

export async function trackOrder(orderNo: string) {
  if (usingSupabase) {
    const { data: o, error } = await supa().from("orders").select("*").eq("order_no", orderNo).maybeSingle();
    if (error || !o) throw new Error("Order not found");
    const { data: items } = await supa().from("order_items").select("name, image, unit_price, qty, size, flavor, message").eq("order_id", o.id);
    return { ...o, items: items || [] };
  }
  const db = readDB();
  const o = db.orders.find((x) => x.order_no === orderNo);
  if (!o) throw new Error("Order not found");
  return { ...o, items: db.order_items.filter((i) => i.order_id === o.id).map(({ name, image, unit_price, qty, size, flavor, message }) => ({ name, image, unit_price, qty, size, flavor, message })) };
}

export async function createCustomOrder(d: any): Promise<{ ref_no: string }> {
  const { name, phone, occasion, design, flavor, size } = d || {};
  if (!name || !phone) throw new Error("Name and phone are required");
  if (!phoneOk(phone)) throw new Error("Please enter a valid Pakistani phone number");
  if (!occasion || !design || !flavor || !size) throw new Error("Please complete all builder steps");
  if (usingSupabase) {
    const { data: c, error } = await supa().from("custom_orders").insert({ name, phone, email: d.email || "", occasion, design, flavor, size, servings: +d.servings || 12, delivery_date: d.delivery_date || "", message: d.message || "", budget: d.budget || "", status: "new" }).select("id").single();
    if (error) throw new Error(error.message);
    const ref_no = `CQ-${String(c.id).padStart(4, "0")}`;
    await supa().from("custom_orders").update({ ref_no }).eq("id", c.id);
    return { ref_no };
  }
  const db = readDB();
  const id = Math.max(0, ...db.custom_orders.map((c) => c.id)) + 1;
  db.custom_orders.push({ id, ref_no: `CQ-${String(db.custom_orders.length + 1).padStart(4, "0")}`, name: String(name).slice(0, 100), phone: String(phone).slice(0, 30), email: String(d.email || "").slice(0, 120), occasion: String(occasion).slice(0, 60), design: String(design).slice(0, 2000), flavor: String(flavor).slice(0, 60), size: String(size).slice(0, 40), servings: parseInt(d.servings) || 12, delivery_date: String(d.delivery_date || "").slice(0, 20), message: String(d.message || "").slice(0, 300), budget: String(d.budget || "").slice(0, 60), status: "new", admin_notes: "", created_at: new Date().toISOString() });
  writeDB(db);
  return { ref_no: db.custom_orders[db.custom_orders.length - 1].ref_no };
}

/* ------------------------------- admin auth ------------------------------ */
export async function adminLogin(username: string, password: string): Promise<{ token: string; name: string }> {
  if (usingSupabase) {
    // Supabase mode: admin authenticates against Supabase Auth (email + password)
    const anon = process.env.SUPABASE_ANON_KEY || SUPA_SERVICE;
    const auth = createClient(SUPA_URL, anon, { auth: { persistSession: false } });
    const { data, error } = await auth.auth.signInWithPassword({ email: username, password });
    if (error || !data.session) throw new Error("Invalid credentials");
    return { token: data.session.access_token, name: data.user?.email?.split("@")[0] || "Admin" };
  }
  const db = readDB();
  const u = db.admin_users.find((x) => x.username === String(username || "").trim());
  if (!u || !verifyPassword(String(password || ""), u.password_hash)) throw new Error("Invalid username or password");
  return { token: signToken(u.id), name: u.name };
}

export async function verifyAdmin(token: string): Promise<{ name: string } | null> {
  if (!token) return null;
  if (usingSupabase) {
    const auth = createClient(SUPA_URL, process.env.SUPABASE_ANON_KEY || SUPA_SERVICE, { auth: { persistSession: false } });
    const { data } = await auth.auth.getUser(token);
    return data?.user ? { name: data.user.email?.split("@")[0] || "Admin" } : null;
  }
  const id = verifyToken(token);
  if (!id) return null;
  const u = readDB().admin_users.find((x) => x.id === id);
  return u ? { name: u.name } : null;
}

/* ------------------------------ admin generic ---------------------------- */
export type Resource = "products" | "orders" | "custom-orders" | "flavors" | "testimonials" | "messages";
const SUPA_TABLE: Record<Resource, string> = { "products": "products", "orders": "orders", "custom-orders": "custom_orders", "flavors": "flavors", "testimonials": "testimonials", "messages": "messages" };

/* per-resource searchable columns (Supabase .or filter) */
const SEARCH_COLS: Record<Resource, string[]> = {
  products: ["name", "description"],
  orders: ["order_no", "customer_name", "phone"],
  "custom-orders": ["ref_no", "name", "phone"],
  flavors: ["name", "description"],
  testimonials: ["name", "text"],
  messages: ["name", "email", "phone", "subject"],
};

export async function adminList(resource: Resource, opts: { status?: string; q?: string } = {}): Promise<any[]> {
  if (usingSupabase) {
    let q = supa().from(SUPA_TABLE[resource]).select("*");
    if (opts.status && opts.status !== "all") q = q.eq("status", opts.status);
    if (opts.q) {
      const term = opts.q.replace(/[,()]/g, " ").trim();
      if (term) q = q.or(SEARCH_COLS[resource].map((c) => `${c}.ilike.%${term}%`).join(","));
    }
    const { data, error } = await q.order("id", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    const rows: any[] = data || [];
    if (resource === "orders") {
      const { data: items } = await supa().from("order_items").select("order_id");
      const counts: Record<string, number> = {};
      (items || []).forEach((i: any) => (counts[i.order_id] = (counts[i.order_id] || 0) + 1));
      rows.forEach((r) => (r.items_count = counts[r.id] || 0));
    }
    return rows;
  }
  const db = readDB();
  let rows: any[] = resource === "custom-orders" ? db.custom_orders : (db as any)[resource];
  rows = rows.slice();
  if (opts.status && opts.status !== "all" && resource !== "flavors" && resource !== "testimonials" && resource !== "products") rows = rows.filter((r) => r.status === opts.status);
  if (opts.q) {
    const s = opts.q.toLowerCase();
    rows = rows.filter((r) => [r.order_no, r.ref_no, r.name, r.customer_name, r.phone].some((v) => String(v || "").toLowerCase().includes(s)));
  }
  if (resource === "orders") rows.forEach((r) => (r.items_count = db.order_items.filter((i) => i.order_id === r.id).length));
  return rows.sort((a, b) => b.id - a.id);
}

export async function adminGet(resource: Resource, id: number) {
  if (usingSupabase) {
    const { data, error } = await supa().from(SUPA_TABLE[resource]).select("*").eq("id", id).maybeSingle();
    if (error || !data) throw new Error("Not found");
    if (resource === "orders") {
      const { data: items } = await supa().from("order_items").select("*").eq("order_id", id);
      (data as any).items = items || [];
    }
    return data;
  }
  const db = readDB();
  const rows: any[] = resource === "custom-orders" ? db.custom_orders : (db as any)[resource];
  const row = rows.find((r) => r.id === id);
  if (!row) throw new Error("Not found");
  if (resource === "orders") row.items = db.order_items.filter((i) => i.order_id === id);
  return row;
}

function sanitize(resource: Resource, d: any, partial: boolean): any {
  const out: any = {};
  const S = (v: string, n: number) => String(v ?? "").slice(0, n);
  if (resource === "products") {
    if (d.name !== undefined) out.name = S(d.name, 120);
    if (d.category !== undefined) { if (!CATS_OK.includes(d.category)) throw new Error("Invalid category"); out.category = d.category; }
    if (d.price !== undefined) { const p = parseFloat(d.price); if (!(p > 0 && p < 1e6)) throw new Error("Price must be 1 – 10,00,000"); out.price = p; }
    if (d.description !== undefined) out.description = S(d.description, 300);
    if (d.long_description !== undefined) out.long_description = S(d.long_description, 3000);
    if (d.image !== undefined) out.image = S(d.image, 300);
    if (d.rating !== undefined) out.rating = Math.min(Math.max(parseFloat(d.rating) || 4.8, 1), 5);
    if (d.reviews !== undefined) out.reviews = parseInt(d.reviews) || 0;
    if (d.badge !== undefined) out.badge = S(d.badge, 40);
    if (d.bestseller !== undefined) out.bestseller = d.bestseller ? (usingSupabase ? true : 1) : usingSupabase ? false : 0;
    if (d.active !== undefined) out.active = d.active ? (usingSupabase ? true : 1) : usingSupabase ? false : 0;
    if (!partial && (!out.name || !out.description || out.price === undefined)) throw new Error("Name, description and price are required");
  } else if (resource === "flavors") {
    if (d.name !== undefined) out.name = S(d.name, 60);
    if (d.description !== undefined) out.description = S(d.description, 200);
    if (d.tag !== undefined && ["classic", "premium", "fruity"].includes(d.tag)) out.tag = d.tag;
    if (d.active !== undefined) out.active = d.active ? (usingSupabase ? true : 1) : usingSupabase ? false : 0;
    if (!partial && !out.name) throw new Error("Flavor name is required");
  } else if (resource === "testimonials") {
    if (d.name !== undefined) out.name = S(d.name, 100);
    if (d.location !== undefined) out.location = S(d.location, 60);
    if (d.text !== undefined) out.text = S(d.text, 600);
    if (d.rating !== undefined) out.rating = Math.min(Math.max(parseInt(d.rating) || 5, 1), 5);
    if (d.active !== undefined) out.active = d.active ? (usingSupabase ? true : 1) : usingSupabase ? false : 0;
    if (!partial && (!out.name || !out.text)) throw new Error("Name and text are required");
  } else if (resource === "orders") {
    if (d.status !== undefined) { if (!ORDER_STATUSES.includes(d.status)) throw new Error("Invalid status"); out.status = d.status; }
  } else if (resource === "custom-orders") {
    if (d.status !== undefined) { if (!CUSTOM_STATUSES.includes(d.status)) throw new Error("Invalid status"); out.status = d.status; }
    if (d.admin_notes !== undefined) out.admin_notes = S(d.admin_notes, 1000);
  } else if (resource === "messages") {
    if (d.is_read !== undefined) out.is_read = d.is_read ? (usingSupabase ? true : 1) : usingSupabase ? false : 0;
  }
  return out;
}

export async function adminCreate(resource: Resource, d: any) {
  const clean = sanitize(resource, d, false);
  if (usingSupabase) {
    const { data, error } = await supa().from(SUPA_TABLE[resource]).insert(clean).select("id").single();
    if (error) throw new Error(error.message);
    return { id: data.id };
  }
  const db = readDB();
  const rows: any[] = resource === "custom-orders" ? db.custom_orders : (db as any)[resource];
  const row: any = { id: Math.max(0, ...rows.map((r) => r.id)) + 1, created_at: new Date().toISOString(), ...clean };
  if (resource === "products") { row.slug = String(row.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36); row.active = row.active ?? 1; row.bestseller = row.bestseller ?? 0; row.rating = row.rating ?? 4.8; row.reviews = row.reviews ?? 0; }
  if (resource === "testimonials") { row.active = row.active ?? 1; row.rating = row.rating ?? 5; row.location = row.location ?? "Sahiwal"; }
  if (resource === "flavors") { row.active = row.active ?? 1; row.tag = row.tag ?? "classic"; }
  rows.push(row);
  writeDB(db);
  return { id: row.id };
}

export async function adminUpdate(resource: Resource, id: number, d: any) {
  const clean = sanitize(resource, d, true);
  if (usingSupabase) {
    const { error } = await supa().from(SUPA_TABLE[resource]).update(clean).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  }
  const db = readDB();
  const rows: any[] = resource === "custom-orders" ? db.custom_orders : (db as any)[resource];
  const row = rows.find((r) => r.id === id);
  if (!row) throw new Error("Not found");
  Object.assign(row, clean);
  writeDB(db);
  return { ok: true };
}

export async function adminDelete(resource: Resource, id: number) {
  if (usingSupabase) {
    if (resource === "orders") await supa().from("order_items").delete().eq("order_id", id);
    const { error } = await supa().from(SUPA_TABLE[resource]).delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  }
  const db = readDB();
  const key = resource === "custom-orders" ? "custom_orders" : resource;
  if (resource === "orders") db.order_items = db.order_items.filter((i) => i.order_id !== id);
  (db as any)[key] = (db as any)[key].filter((r: any) => r.id !== id);
  writeDB(db);
  return { ok: true };
}

/* --------------------------------- stats ---------------------------------- */
export async function adminStats() {
  const orders = (await adminList("orders")) as Order[];
  const custom = (await adminList("custom-orders")) as CustomOrder[];
  const messages = (await adminList("messages")) as Message[];
  const products = (await adminList("products")) as Product[];
  const active = orders.filter((o) => o.status !== "cancelled");
  const chart: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) chart[new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)] = 0;
  active.forEach((o) => {
    const d = String(o.created_at).slice(0, 10);
    if (d in chart) chart[d] += o.total;
  });
  const statusCounts: Record<string, number> = {};
  ORDER_STATUSES.forEach((s) => (statusCounts[s] = orders.filter((o) => o.status === s).length));
  return {
    revenue: active.reduce((s, o) => s + o.total, 0),
    orders: orders.length,
    pending: orders.filter((o) => ["pending", "confirmed", "baking", "out-for-delivery"].includes(o.status)).length,
    custom: custom.filter((c) => !["completed", "cancelled"].includes(c.status)).length,
    unread: messages.filter((m) => !m.is_read).length,
    products: products.length,
    chart,
    statusCounts,
    recentOrders: orders.slice(0, 6),
    recentMessages: messages.slice(0, 5),
  };
}

/* ----------------------------- site settings ------------------------------ */
/** Editable site content — admin → Settings. Values fall back to these defaults. */
export const DEFAULT_SETTINGS: Record<string, string> = {
  announcement: "Custom cakes for birthdays, weddings & special events in Sahiwal",
  announcement_phone: "0300-1234567",
  hero_badge: "Custom Cakes in Sahiwal",
  hero_title_1: "Custom Cakes Crafted",
  hero_title_2: "Special Moments!",
  hero_sub: "Beautifully designed, deliciously made — personalized cakes for birthdays, weddings, anniversaries and all your special celebrations in Sahiwal.",
  hero_points: "100% Fresh Baked|Premium Ingredients|Same-Day Delivery",
  contact_address: "Main Boulevard, Farooq Colony, Sahiwal, Punjab 57000",
  contact_phone: "0300-1234567",
  contact_email: "hello@cakedelight.pk",
  contact_hours: "Monday – Sunday · 9:00 AM – 10:00 PM",
  whatsapp_number: "923001234567",
  footer_tagline: "Beautifully designed, deliciously made — personalized cakes for birthdays, weddings, anniversaries and all your special celebrations in Sahiwal.",
  footer_note: "Cash on Delivery · Same-Day Delivery in Sahiwal",
  about_sub: "From a home kitchen in Sahiwal to your happiest moments",
  about_heading: "Baking Happiness Into Every Celebration",
  about_p1: "Cake Delight began as a small home bakery with one simple belief — every celebration deserves a cake that tastes as beautiful as it looks. Today, we're proud to be one of Sahiwal's most-loved custom cake shops, crafting 500+ cakes a year for birthdays, weddings, anniversaries and every happy moment in between.",
  about_p2: "Every cake is baked fresh to order with premium ingredients — Belgian chocolate, fresh dairy butter and farm eggs. No shortcuts, no compromises. Just handcrafted goodness, delivered with a smile.",
};

export type SiteSettings = Record<string, string>;

export async function getSettings(): Promise<SiteSettings> {
  if (usingSupabase) {
    try {
      const { data, error } = await supa().from("site_settings").select("key,value");
      if (!error && data) return { ...DEFAULT_SETTINGS, ...Object.fromEntries(data.map((r: any) => [r.key, String(r.value ?? "")])) };
    } catch { /* table missing → defaults */ }
  } else {
    try { const db = readDB(); if (db.settings) return { ...DEFAULT_SETTINGS, ...db.settings }; } catch { /* ignore */ }
  }
  return { ...DEFAULT_SETTINGS };
}

/** true when the site_settings table exists and is writable (admin diagnostics) */
export async function settingsReady(): Promise<boolean> {
  if (!usingSupabase) return true;
  try { const { error } = await supa().from("site_settings").select("key").limit(1); return !error; } catch { return false; }
}

export async function saveSettings(patch: Record<string, string>): Promise<void> {
  const clean: Record<string, string> = {};
  for (const k of Object.keys(DEFAULT_SETTINGS)) if (patch[k] !== undefined) clean[k] = String(patch[k] ?? "").slice(0, 2000);
  if (!Object.keys(clean).length) return;
  if (usingSupabase) {
    const { error } = await supa().from("site_settings").upsert(Object.entries(clean).map(([key, value]) => ({ key, value })), { onConflict: "key" });
    if (error) throw new Error(/does not exist|Could not find the table|schema cache/i.test(error.message) ? "The site_settings table is missing — run the SQL shown below (or in supabase/schema.sql) in the Supabase SQL Editor first." : error.message);
  } else {
    const db = readDB();
    db.settings = { ...(db.settings || {}), ...clean };
    writeDB(db);
  }
}
