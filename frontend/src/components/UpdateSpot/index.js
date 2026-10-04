import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { updateSpotThunk, singleSpotThunk, spotFormErrors } from '../../store/spot'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { Redirect } from 'react-router-dom'
import NotFound from '../NotFound'
import './UpdateSpot.css'

function UpdateSpot() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [country, setCountry] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [description, setDescription] = useState("")
    const [latitude, setLatitude] = useState(40)
    const [longitude, setLongitude] = useState(40)
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [validationErrors, setValidationErrors] = useState({})
    const [serverError, setServerError] = useState("")
    const [notFound, setNotFound] = useState(false)

    const spot = useSelector((state) => state.spot.singleSpot);
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        setServerError("");
        setNotFound(false);
        dispatch(singleSpotThunk(spotId)).catch(() => setNotFound(true));
    }, [dispatch, spotId]);


    useEffect(() => {
    if (spot) {
      setCountry(spot.country || '');
      setAddress(spot.address || '');
      setCity(spot.city || '');
      setState(spot.state || '');
      setDescription(spot.description || '');
      setLatitude(spot.lat || 40);
      setLongitude(spot.lng || 40);
      setTitle(spot.name || '');
      setPrice(spot.price || '');
    }
  }, [spot]);

  useEffect(() => {
    const errorsObject = {};
    if (!country) {
        errorsObject.country = "Country is required"
    }
    if (!address) {
        errorsObject.address = "Address is required"
    }
    if (!city) {
        errorsObject.city = "City is required"
    }
    if (!state) {
        errorsObject.state = "State is required"
    }
    if (description.length < 30) {
        errorsObject.description = "Description needs a minimum of 30 characters"
    }
    if (description.length < 30) {
        errorsObject.description = "Description needs a minimum of 30 characters"
    }
    if (!title) {
        errorsObject.title = "Name is required"
    }
    if (title.length > 50) {
        errorsObject.title = "Name must be less than 50 characters"
    }
    if (!price) {
        errorsObject.price = "Price is required"
    }
    if (isNaN(price)) {
        errorsObject.price = "Price must be a number";
    }
    setValidationErrors(errorsObject)
}, [country, address, city, state, description, title, price])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(validationErrors).length) {
      return alert('Form data is invalid, please correct your submission.');
    }

    setValidationErrors({});
    setServerError("");
    const newSpot = {
      ...spot,
      address,
      city,
      state,
      country,
      lat: latitude,
      lng: longitude,
      name: title,
      description,
      price,
    };

    const result = await dispatch(updateSpotThunk(newSpot));
    if (result.ok) {
      history.push(`/spots/${result.spot.id}`);
    } else {
      const { fields, general } = spotFormErrors(result);
      setValidationErrors(fields);
      setServerError(general);
    }
  };

  if (notFound) {
    return <NotFound message="That spot doesn't exist or has been deleted." />;
  }
  // Wait for this spot, not one left over from another page, before showing the form
  if (!spot || spot.id !== Number(spotId)) {
    return <div>Loading Spot...</div>;
  }
  // Only the owner can edit a spot; anyone else is sent to its page
  if (spot.ownerId !== sessionUser.id) {
    return <Redirect to={`/spots/${spotId}`} />;
  }

  return (
    <div className="createSpotContainer">
        <form onSubmit={handleSubmit}>
            <div className="createSpotHeading">Update your Spot</div>
            <div className="locationInfo">
                <div className="locationHeader">Where's your place located?</div>
                <div className="locationText">Guests will only get your exact address once they booked a reservation.</div>
            <div className="inputContainer">Country
                <input
                value={country}
                type="text"
                placeholder="Country"
                onChange={(e) => setCountry(e.target.value)}/>
                {validationErrors.country && <p className="error">{validationErrors.country}</p>}
            </div>
            <div className="inputContainer">Address
                <input
                value={address}
                type="text"
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}/>
                {validationErrors.address && <p className="error">{validationErrors.address}</p>}
            </div>
            <div className="cityStateContainer">
                <div className="inputContainer">City
                <input
                value={city}
                type="text"
                placeholder="City"
                onChange={(e) => setCity(e.target.value)}/>
                {validationErrors.city && <p className="error">{validationErrors.city}</p>}
                </div>
                <div className="inputContainer">State
                <input
                value={state}
                type="text"
                placeholder="State"
                onChange={(e) => setState(e.target.value)}/>
                {validationErrors.state && <p className="error">{validationErrors.state}</p>}
                </div>
            </div>
            </div>
            <div className="descriptionInfo">
            <div className="descriptionHeader">Describe your place to guests</div>
            <div className="descriptionText">Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</div>
            <div className="inputContainer">
                <input
                value={description}
                type="text"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}/>
                {validationErrors.description && <p className="error">{validationErrors.description}</p>}
            </div>
        </div>
        <div className="titleInfo">
            <div className='titleHeader'>Create a title for your spot</div>
            <div className='titleText'>Catch guests' attention with a spot title that highlights what makes your place special.</div>
            <div className="inputContainer">
                <input
                value={title}
                type="text"
                placeholder="Name of your spot"
                onChange={(e) => setTitle(e.target.value)}/>
                {validationErrors.title && <p className="error">{validationErrors.title}</p>}
            </div>
        </div>
        <div className="priceInfo">
            <div className="priceHeader">Set a base price for your spot</div>
            <div className="priceText">Competitive pricing can help our listing stand out and rank higher in search results.</div>
            {/* <div className="inputContainer">
            <i className="fa-solid fa-dollar-sign"></i> */}
            <div className="priceContainer">$
                <input
                value={price}
                type="number"
                placeholder="Price per night (USD)"
                onChange={(e) => setPrice(e.target.value)}/>
                {validationErrors.price && <p className="error">{validationErrors.price}</p>}
            </div>
        </div>
        {serverError && <p className="error">{serverError}</p>}
        <div className='submitContainer'>
        <button type='submit' className="submit-button">Update Your Spot</button>
        </div>
        </form>
    </div>
)
}

export default UpdateSpot
