import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
// import { Link, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { getUserSpotsThunk } from "../../store/spot";
import "./ManageSpots.css";
import OpenModalButton from "../OpenModalButton";
import SpotDeleteModal from "../SpotDeleteModal";

export default function ManageSpots() {
  // const history = useHistory();
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spot.allSpots);
  console.log(spots);

  useEffect(() => {
    dispatch(getUserSpotsThunk());
  }, [dispatch]);

  return (
    <>
      {!spots ? (
        <div className="manageSpotsHeader">
          <div className="manageHeader">Manage Spots</div>
          <Link to="/spots/new">
            <button className="addSpotButton">Create a New Spot</button>
          </Link>
        </div>
      ) : (
        <div className="manageSpotsHeader">
          <div className="manageHeader">Manage Spots</div>
          {!spots.length && (
            <Link to="/spots/new">
              <button className="addSpotButton">Create a New Spot</button>
            </Link>
          )}
          <div id="spots-container">
            {spots &&
              spots.map((spot) => (
                <div className="spot-container" key={`spot-${spot.id}`}>
                  <Link to={`/spots/${spot.id}`}>
                    <div className="spot">
                      <img src={spot.previewImage} alt="Spot Preview" />
                      {/* <h2>{spot.name}</h2>
                      <p>
                        City: {spot.city}, State: {spot.state}
                        {spot.city}, {spot.state}
                      </p>
                      <p>${spot.price} night</p> */}
                      <div className="location-and-rating">
                        <p>
                          {spot.city}, {spot.state}
                        </p>
                        {spot.avgRating === null ? (
                          <div className="reviews">
                            <i className="fa-solid fa-star"></i>
                            <div className="newListing">New</div>
                          </div>
                        ) : (
                          <div className="reviews">
                            <i className="fa-solid fa-star"></i>
                            <div className="avgRating">{spot.avgRating}</div>
                          </div>
                        )}
                      </div>
                      <div className="price-container">
                        <div className="price">${spot.price}</div> night
                      </div>
                    </div>
                  </Link>
                  <div className="manageSpot-buttons">
                    <Link to={`/spots/${spot.id}/edit`}>
                      <button id="updateButton">Update</button>
                    </Link>
                    <OpenModalButton
                      // id="deleteButton"
                      buttonText="Delete"
                      modalComponent={<SpotDeleteModal spot={spot} />}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
