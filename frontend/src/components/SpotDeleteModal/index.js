import { useDispatch } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useModal } from "../../context/Modal";
import "./SpotDeleteModal.css";
import { deleteSpotThunk } from "../../store/spot";

export default function SpotDeleteModal({ spot }) {
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    setErrors({});
    return dispatch(deleteSpotThunk(spot.id))
      .then(() => {
        closeModal();
        history.push("/spots/current");
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="deleteSpotContainer">
      <div className="deleteHeader">Confirm Delete</div>
      <div className="deleteText">
        Are you sure you want to remove this spot from your listings?
      </div>
      <div>
        <button id="yesDelete" onClick={handleSubmit}>
          Yes (Delete Spot)
        </button>
        <button
          id="noDelete"
          onClick={(e) => {
            closeModal();
            e.stopPropagation();
            history.push("/spots/current");
          }}
        >
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}
