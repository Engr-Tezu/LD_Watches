import { getProducts } from "@/lib/data";
import { getCategories } from "@/lib/site";
import { Product } from "@/types/product";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export default async function AdminProductsPage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {}
  const categories = await getCategories().catch(() => []);
  return <AdminProductsClient products={products} categories={categories} />;
}
