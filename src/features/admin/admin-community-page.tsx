import { listReviewsForAdmin } from "@/features/admin/services/order-admin-service";

export async function AdminCommunityPage() {
  const reviews = await listReviewsForAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-admin-ink">Community</h1>
        <p className="mt-2 max-w-2xl text-sm text-admin-muted">
          Customer reviews across your product catalogue.
        </p>
      </div>

      <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
        {reviews.length === 0 ? (
          <p className="py-10 text-center text-sm text-admin-muted">
            No reviews yet. They will appear here when customers leave feedback.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-admin-border bg-admin-canvas p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-admin-ink">{review.productName}</p>
                    <p className="text-xs text-admin-muted">{review.userEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-admin-ink">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </p>
                    <p className="text-xs text-admin-muted">{review.createdAt}</p>
                  </div>
                </div>
                {review.title ? (
                  <p className="mt-3 text-sm font-medium text-admin-ink">{review.title}</p>
                ) : null}
                {review.comment ? (
                  <p className="mt-1 text-sm leading-relaxed text-admin-muted">
                    {review.comment}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
