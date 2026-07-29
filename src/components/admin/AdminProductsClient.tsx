"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Product } from "@/types/product";
import { Category } from "@/types/site";
import AdminProductList from "./AdminProductList";
import AdminAddProductModal from "./AdminAddProductModal";

interface AdminProductsClientProps {
  products: Product[];
  categories: Category[];
}

export default function AdminProductsClient({ products, categories }: AdminProductsClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Products</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold text-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        <div className="card-surface p-4 sm:p-6">
          <AdminProductList
            products={products}
            categories={categories}
            onAddProduct={() => setShowAddModal(true)}
          />
        </div>
      </div>

      <AdminAddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
      />
    </>
  );
}
