/** Top-right inverted-radius notch + circular action (from reference HTML). */
export default function FeedCardNotch() {
  return (
    <div
      className="feed-card-notch pointer-events-none absolute top-0 right-0"
      aria-hidden
    >
      <div className="feed-card-notch-curve feed-card-notch-curve--top" />
      <div className="feed-card-notch-curve feed-card-notch-curve--right" />
      <div className="feed-card-notch-btn">
        <div className="feed-card-notch-btn-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feed-card-notch-icon text-[#f2a93b]"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </div>
    </div>
  );
}
