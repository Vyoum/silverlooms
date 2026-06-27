import { WishlistPage } from "@/features/wishlist/wishlist-page";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata = {
  title: "Wishlist",
  description: "Your saved favourites at Silver Looms.",
  ...noIndexMetadata,
};

export default function Page() {
  return <WishlistPage />;
}
