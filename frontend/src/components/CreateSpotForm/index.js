import { useDispatch, useSelector } from "react-redux"
import { createSpotThunk, updateSpotThunk } from "../../store/spots"
import { useHistory } from "react-router-dom"
import { useEffect, useState } from "react"
import './CreateSpotForm.css'
import { createSpotImageThunk } from "../../store/spotimage"


const CreateSpotFormIndex = ({ spot, formType }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  // console.log('props ->>',props)
  //set the props
  // const spot = props.spot
  // const formType = props.formType

  // console.log('prop spot --->', spot)
  // console.log('prop form type --->', formType)

  // console.log('prop spot images ->', editSpotImages)
  // console.log('prop preview images ->', editSpotPreviewImage)
  //get the userid to add to the form submission neeeded?
  const userId = useSelector(state => state.session)

  // console.log(userId)

  if (userId.user === null) {
    // alert('You must be logged in to access this page... returning to home')
    history.push('/')
  }

  //form set state to the prop values if applicable
  const [address, setAddress] = useState(spot?.address || '')
  const [city, setCity] = useState(spot?.city || '')
  const [state, setState] = useState(spot?.state || '')
  const [country, setCountry] = useState(spot?.country || '')
  const [name, setName] = useState(spot?.name || '')
  const [description, setDescription] = useState(spot?.description || '')
  const [price, setPrice] = useState(spot?.price || '')
  const [previewImage, setPreviewImage] = useState('')
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [image4, setImage4] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [submittedPress, setSubmittedPress] = useState(false)

  useEffect(() => {
    let errors = {}
    let previewImageCheck = ['.png', '.jpg', '.jpeg']
    if (address.length < 1) {
      errors.address = 'Address is required'
    } if (city.length < 1) {
      errors.city = 'City is required'
    } if (state.length < 1) {
      errors.state = 'State is required'
    } if (country.length < 1) {
      errors.country = 'Country is required'
    } if (name.length < 1) {
      errors.name = 'Name is required'
    } if (description.length < 30) {
      errors.description = 'Description needs a minimum of 30 characters'
    } if (price < 1) {
      errors.price = 'Price is required'
    } if (formType !== 'edit' && previewImage.length < 4) {
      errors.previewImage = 'Preview image is required'
    } if (formType !== 'edit' && !previewImageCheck.some(extension => previewImage.endsWith(extension))) {
      errors.previewImage = 'Image URL must end in .png, .jpg, or .jpeg '
    } if (formType !== 'edit' && image1 && !previewImageCheck.some(extension => image1.endsWith(extension))) {
      errors.image1 = 'Image URL must end in .png, .jpg, or .jpeg '
    } if (formType !== 'edit' && image2 && !previewImageCheck.some(extension => image2.endsWith(extension))) {
      errors.image2 = 'Image URL must end in .png, .jpg, or .jpeg '
    } if (formType !== 'edit' && image3 && !previewImageCheck.some(extension => image3.endsWith(extension))) {
      errors.image3 = 'Image URL must end in .png, .jpg, or .jpeg '
    } if (formType !== 'edit' && image4 && !previewImageCheck.some(extension => image4.endsWith(extension))) {
      errors.image4 = 'Image URL must end in .png, .jpg, or .jpeg '
    }
    setValidationErrors(errors)
  }, [address, city, state, country, name, description, price, previewImage, image1, image2, image3, image4])

  useEffect(() => {

  }, [validationErrors])

  useEffect(() => {
    console.log('spot prop ->', spot)
    if (spot) {
      const editSpotImages = []
      //preview image if prop was passed
      let editSpotPreviewImage = ''
      const spotImages = spot.SpotImages || []

      for (let image of spotImages) {
        if (image.preview === false) {
          editSpotImages.push(image.url)
        } else {
          editSpotPreviewImage = image.url
        }
      }
      setPreviewImage(editSpotPreviewImage)
      setImage1(editSpotImages[0])
      setImage2(editSpotImages[1])
      setImage3(editSpotImages[2])
      setImage4(editSpotImages[3])
    }

  }, [spot])

  // if (!spot.SpotImages) {
  //   return (
  //     <div>
  //       ...Loading...
  //     </div>
  //   )
  // } else {
  //   const editSpotImages = []
  //   //preview image if prop was passed
  //   let editSpotPreviewImage = ''
  //   const spotImages = spot.SpotImages

  //   for (let image of spotImages) {
  //     if (image.preview === false) {
  //       editSpotImages.push(image.url)
  //     } else {
  //       editSpotPreviewImage = image.url
  //     }
  //   }
  //   setPreviewImage(editSpotPreviewImage)
  //   setImage1(editSpotImages[0])
  //   setImage2(editSpotImages[1])
  //   setImage3(editSpotImages[2])
  //   setImage4(editSpotImages[3])
  // }

  const onSubmit = async (e) => {
    e.preventDefault()
    console.log('form type inside the onSubmit!!', formType)
    setSubmittedPress(true)
    const newSpot = { address, lat: 1, lng: 1, city, state, country, name, description, price }

    const previewImagePost = { url: previewImage, preview: true }
    const image1Post = { url: image1, preview: false }
    const image2Post = { url: image2, preview: false }
    const image3Post = { url: image3, preview: false }
    const image4Post = { url: image4, preview: false }

    console.log('validation errors', Object.values(validationErrors))


    if (!Object.values(validationErrors).length) {
      if (formType === 'edit') {
        console.log('I am inside the edit if block for the form!',)
        const editedSpot = { ...newSpot }
        editedSpot.spotId = spot.id
        const res = await dispatch(updateSpotThunk(editedSpot))
        if (res.id) {
          const spotId = res.id
          // console.log('did it work?')
          history.push(`/spots/${spotId}`)
        } else {
          console.log('OH NO ERROR!')
          setValidationErrors({ ...res.errors })
        }

      } else {
        const res = await dispatch(createSpotThunk(newSpot))
        if (res.id) {
          //put postImage thunks here
          const spotId = res.id

          previewImagePost.spotId = spotId
          const previewImageRes = await dispatch(createSpotImageThunk(previewImagePost))

          if (previewImageRes.errors) {
            setValidationErrors({ ...previewImageRes.errors })
          }

          if (image1.length > 2) {
            image1Post.spotId = spotId
            const image1Res = await dispatch(createSpotImageThunk(image1Post))
            if (image1Res.errors) {
              setValidationErrors({ ...previewImageRes.errors })
            }
          }
          if (image2.length > 2) {
            image2Post.spotId = spotId
            const image2Res = await dispatch(createSpotImageThunk(image2Post))
            if (image2Res.errors) {
              setValidationErrors({ ...previewImageRes.errors })
            }
          }
          if (image3.length > 2) {
            image3Post.spotId = spotId
            const image3Res = await dispatch(createSpotImageThunk(image3Post))
            if (image3Res.errors) {
              setValidationErrors({ ...previewImageRes.errors })
            }
          }
          if (image4.length > 2) {
            image4Post.spotId = spotId
            const image4Res = await dispatch(createSpotImageThunk(image1Post))
            if (image4Res.errors) {
              setValidationErrors({ ...previewImageRes.errors })
            }
          }

          history.push(`/spots/${spotId}`)
        } else {
          setValidationErrors({ ...res.errors })
        }
      }
    }
  }


  return (
    <div className="spot-form">
      <div className="form-head">
        <h2> Create a new Spot</h2>
        <h3> Where's your place located?</h3>
        <h5> Guests will only get your exact address once they booked a reservation.</h5>
      </div>
      <form
        onSubmit={onSubmit}>
        <div className="spot-location">

          <label>
            Country {validationErrors.country && submittedPress && (
              <span className="errors"> {validationErrors.country}</span>
            )}
            <input
              value={country}
              type="text"
              placeholder="Country"
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
          <label>
            Street Address {validationErrors.address && submittedPress && (
              <span className="errors"> {validationErrors.address}</span>
            )}
            <input
              value={address}
              type="text"
              placeholder="Street Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <div className="city-state">
            <label>
              City {validationErrors.city && submittedPress && (
                <span className="errors"> {validationErrors.city}</span>
              )}
              <input
                value={city}
                type="text"
                placeholder="City"
                onChange={(e) => setCity(e.target.value)}
                className="city-input"
              />

            </label>
            <div className="city-state-comma">
              ,
            </div>
            <label>
              State {validationErrors.state && submittedPress && (
                <span className="errors"> {validationErrors.state}</span>
              )}
              <input
                value={state}
                type="text"
                placeholder="State"
                onChange={(e) => setState(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="description-field">
          <h3> Describe your place to your guests</h3>
          <h5> Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.</h5>
          <label>

            <textarea
              value={description}
              type="text"
              placeholder="Please write at least 30 characters"
              onChange={(e) => setDescription(e.target.value)}
            />
            {validationErrors.description && submittedPress && (
              <div className="errors"> {validationErrors.description}</div>
            )}
          </label>
        </div>
        <div className="name-field">
          <h3> Create a title for your spot</h3>
          <h5> Catch guests' attention with a spot title that highlights what makes
            your place special.</h5>
          <label>
            <input
              value={name}
              type="text"
              placeholder="Name of your spot"
              onChange={(e) => setName(e.target.value)}
              className="name-field-input"
            />
            {validationErrors.name && submittedPress && (
              <div className="errors"> {validationErrors.name}</div>
            )}
          </label>
        </div>
        <div className="price-field">
          <h3> Set a base price for your spot</h3>
          <h5> Competitive pricing can help your listing stand out and rank higher
            in search results.</h5>
          <div className="price-field-sub">
            $
            <label>
              <input
                value={price}
                type="number"
                placeholder="Price per night (USD)"
                onChange={(e) => setPrice(parseFloat(e.target.value).toFixed(2))}
              />
              {validationErrors.price && submittedPress && (
                <div className="errors"> {validationErrors.price}</div>
              )}
            </label>
          </div>
        </div>
        {formType !== 'edit' && (

          <div className="photos-field">
            <h3> Liven up your spot with photos</h3>
            <h5> Submit a link to at least one photo to publish your spot.</h5>

            <label>
              <input
                value={previewImage}
                type="text"
                placeholder="Preview Image URL"
                onChange={(e) => setPreviewImage(e.target.value)}
                className="photo-input-field"
              />
              {validationErrors.previewImage && submittedPress && (
                <div className="errors"> {validationErrors.previewImage}</div>
              )}
            </label>
            <label>
              <input
                value={image1}
                type="text"
                placeholder="Image URL"
                onChange={(e) => setImage1(e.target.value)}
                className="photo-input-field"
              />
              {validationErrors.image1 && submittedPress && (
                <div className="errors"> {validationErrors.image1}</div>
              )}
            </label>
            <label>
              <input
                value={image2}
                type="text"
                placeholder="Image URL"
                onChange={(e) => setImage2(e.target.value)}
                className="photo-input-field"
              />
              {validationErrors.image2 && submittedPress && (
                <div className="errors"> {validationErrors.image2}</div>
              )}
            </label>
            <label>
              <input
                value={image3}
                type="text"
                placeholder="Image URL"
                onChange={(e) => setImage3(e.target.value)}
                className="photo-input-field"
              />
              {validationErrors.image3 && submittedPress && (
                <div className="errors"> {validationErrors.image3}</div>
              )}
            </label>
            <label>
              <input
                value={image4}
                type="text"
                placeholder="Image URL"
                onChange={(e) => setImage4(e.target.value)}
                className="photo-input-field"
              />
              {validationErrors.image4 && submittedPress && (
                <div className="errors"> {validationErrors.image4}</div>
              )}
            </label>

          </div>
        )}
        <div className="submit-button-container">

          <button type="submit" className="submit-button">
            {formType === 'edit' ? 'Edit Spot' : 'Create Spot'}
          </button>
        </div>

      </form>
    </div>
  )

}

export default CreateSpotFormIndex