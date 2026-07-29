"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Category } from "@/types/site";
import { formatPrice, getMainImage } from "@/lib/utils";
import { Pencil, Trash2, Eye, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CustomSelect from "@/components/ui/CustomSelect";
import AdminProductViewModal from "./AdminProductViewModal";

interface AdminProductListProps {
  products: Product[];
  categories: Category[];
  onAddProduct?: () => void;
}

export default function AdminProductList({
  products,
  categories,
  onAddProduct,
}: AdminProductListProps) {
  const router = useRouter();
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "inStock" && item.inStock) ||
        (statusFilter === "outOfStock" && !item.inStock) ||
        (statusFilter === "featured" && item.featured);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(deleteTarget.id);
    setDeleteError("");

    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setDeleteTarget(null);
      setViewProduct(null);
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <AdminProductViewModal
        product={viewProduct}
        onClose={() => setViewProduct(null)}
        onDelete={(product) => setDeleteTarget({ id: product._id, name: product.name })}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Product"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Product"
        loading={deleting === deleteTarget?.id}
        onClose={() => {
          if (deleting) return;
          setDeleteTarget(null);
          setDeleteError("");
        }}
        onConfirm={confirmDelete}
      />

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ld-silver" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40"
          />
        </div>
        <CustomSelect
          className="w-full lg:w-48"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { value: "all", label: "All Categories" },
            ...categories.map((category) => ({
              value: category.name,
              label: category.name,
            })),
          ]}
        />
        <CustomSelect
          className="w-full lg:w-44"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            { value: "inStock", label: "In Stock" },
            { value: "outOfStock", label: "Out of Stock" },
            { value: "featured", label: "Featured" },
          ]}
        />
      </div>

      {deleteError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {deleteError}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <p className="text-ld-light mb-6">No products yet</p>
          {onAddProduct && (
            <button onClick={onAddProduct} className="btn-gold text-sm">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-ld-silver">No products match your filters</div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="p-4 bg-ld-dark rounded-xl border border-ld-grey/40"
              >
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-ld-charcoal shrink-0">
                    <Image
                      src={getMainImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{product.name}</p>
                    <p className="text-ld-silver text-xs">
                      {product.brand} · {product.category}
                    </p>
                    <p className="text-ld-gold font-semibold text-sm mt-1">
                      {formatPrice(product.price)}
                    </p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {product.inStock ? (
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded">
                          Out of Stock
                        </span>
                      )}
                      {product.featured && (
                        <span className="px-2 py-0.5 bg-ld-gold/15 text-ld-gold-light text-xs rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-ld-grey/30">
                  <button
                    onClick={() => setViewProduct(product)}
                    className="p-2 text-ld-silver hover:text-ld-gold"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="p-2 text-ld-silver hover:text-ld-gold"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget({ id: product._id, name: product.name })}
                    disabled={deleting === product._id}
                    className="p-2 text-ld-silver hover:text-red-400 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-ld-grey/50">
                  <th className="text-left py-3 px-4 text-ld-silver text-sm font-medium">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-ld-silver text-sm font-medium">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-ld-silver text-sm font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-ld-silver text-sm font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-ld-silver text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-ld-grey/30 hover:bg-ld-dark/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-ld-dark shrink-0">
                          <Image
                            src={getMainImage(product)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate">{product.name}</p>
                          <p className="text-ld-silver text-xs">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-ld-light text-sm">{product.category}</td>
                    <td className="py-3 px-4 text-ld-gold-light text-sm font-semibold">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 flex-wrap">
                        {product.inStock ? (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">
                            In Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded">
                            Out of Stock
                          </span>
                        )}
                        {product.featured && (
                          <span className="px-2 py-0.5 bg-ld-gold/15 text-ld-gold-light text-xs rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewProduct(product)}
                          className="p-2 text-ld-silver hover:text-ld-gold transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          className="p-2 text-ld-silver hover:text-ld-gold transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id: product._id, name: product.name })}
                          disabled={deleting === product._id}
                          className="p-2 text-ld-silver hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
