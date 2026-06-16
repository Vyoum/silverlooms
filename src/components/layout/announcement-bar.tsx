export function AnnouncementBar() {
  return (
    <div className="bg-ink py-2 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[2.2px] text-cream">
        Free shipping on orders above ₹5000{" "}
        <span className="mx-2 text-border-strong">|</span>
        <a href="/kurtis" className="underline underline-offset-2">
          Shop Now
        </a>
      </p>
    </div>
  );
}
