import './DeleteReview.css'
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from '../../store/review';

function DeleteReviewModal ({review}) {
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(deleteReviewThunk(review))
        .then(() => {
          closeModal();
          })
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
              setErrors(data.errors);
            }
        }
          );
      };

    return (
        <div className="deleteSpotContainer">
            <div className="deleteHeader">Confirm Delete</div>
            <div className="deleteText">Are you sure you want to delete this review?</div>
            <div>
                <button
                id="yesDelete"
                onClick={handleSubmit}
                >
                    Yes (Delete Review)
                </button>
                <button
                id="noDelete"
                onClick={((e) => {
                  closeModal();
                  })}
                >
                    No (Keep Review)
                </button>
            </div>
        </div>
    )
}

export default DeleteReviewModal;
