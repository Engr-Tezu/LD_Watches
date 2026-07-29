import { getReviews } from "@/lib/site";
import AdminReviewsManager from "@/components/admin/AdminReviewsManager";

export default async function AdminReviewsPage() {
  const reviews = await getReviews().catch(() => []);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Reviews</h1>
        <p className="text-ld-silver text-sm mt-1">
          Manage customer testimonials shown on the homepage.
        </p>
      </div>
      <AdminReviewsManager initialReviews={reviews} />
    </div>
  );
}
