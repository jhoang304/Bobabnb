// Star rating on a spot card: the average to two decimals, or "New" when the spot has no reviews (avgRating is null)
export default function RatingBadge({ rating }) {
  return (
    <div className="reviews">
      <i className="fa-solid fa-star"></i>
      {rating === null || rating === undefined ? (
        <div className="newListing">New</div>
      ) : (
        <div className="avgRating">{Number(rating).toFixed(2)}</div>
      )}
    </div>
  );
}
