import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { allSpotsThunk } from "../../store/spot";
import { NO_PHOTO } from "../../constants";
import RatingBadge from "../RatingBadge";
import "./SpotsIndex.css";

export default function SpotsIndex() {
  const dispatch = useDispatch();
  const spotsById = useSelector((state) => state.spot.allSpots);
  const spots = spotsById && Object.values(spotsById);

  useEffect(() => {
    dispatch(allSpotsThunk());
  }, [dispatch]);

  return (
    <div className="spots-container">
      {spots &&
        spots.map((spot) => (
          <Link to={`/spots/${spot.id}`} key={`spot-${spot.id}`}>
            <div className="spot" title={spot.name}>
              <img src={spot.previewImage || NO_PHOTO} alt="Spot Preview" />
              <div className="location-and-rating">
                <p>
                  {spot.city}, {spot.state}
                </p>
                <RatingBadge rating={spot.avgRating} />
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
