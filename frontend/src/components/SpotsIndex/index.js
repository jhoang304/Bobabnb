import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { allSpotsThunk } from "../../store/spot";
import "./SpotsIndex.css";

export default function SpotsIndex() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spot.allSpots);

  useEffect(() => {
    dispatch(allSpotsThunk());
  }, [dispatch]);

  return (
    <div className="spots-container">
      {spots &&
        spots.map((spot) => (
          <Link to={`/spots/${spot.id}`} key={`spot-${spot.id}`}>
            <div className="spot" title={spot.name}>
              <img src={spot.previewImage} alt="Spot Preview" />
              <div className="location-and-rating">
                <p>
                  {spot.city}, {spot.state}
                </p>
                {spot.avgRating === 0 ? (
                  <div className="reviews">
                    <i className="fa-solid fa-star"></i>
                    <div className="newListing">New</div>
                  </div>
                ) : (
                  <div className="reviews">
                    <i className="fa-solid fa-star"></i>
                    <div className="avgRating">{spot.avgRating.toFixed(2)}</div>
                  </div>
                )}
              </div>
              <div className="price-container">
                <div className="price">${spot.price}</div> night
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
