import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clickState, setClickState] = useState(false)
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const errorsObj = {}
    if (email.length < 1) {
      errorsObj.email = 'email must be provided'
    }
    if (username.length < 4) {
      errorsObj.username = 'username must be provided'
    }
    if (firstName.length < 1) {
      errorsObj.firstName = 'First name must be provided'
    } if (lastName.length < 1) {
      errorsObj.lastName = 'Last name must be provided'
    } if (password.length < 6) {
      errorsObj.password = 'Password must be provided'
    } if (confirmPassword.length < 6) {
      errorsObj.password = 'Password must be provided'
    }

    setErrors({ ...errorsObj })

  }, [email, username, firstName, lastName, password, confirmPassword])

  useEffect(() => {

  }, [errors])


  const handleSubmit = (e) => {
    e.preventDefault();
    setClickState(true)
    if (password === confirmPassword && Object.keys(errors).length === 0) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            console.log(data.errors)
            setErrors({ ...data.errors });
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="signup-modal">
      <h1 className="signup-head">Sign Up</h1>
      {(errors.email && clickState === true) && <p className="signup-erros">{errors.email}</p>}
      {(errors.username && clickState === true) && <p className="signup-erros">{errors.username}</p>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            className="signup-modal-values"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="signup-modal-label">
          Username
          <input
            type="text"
            className="signup-modal-values"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="signup-modal-label">
          First Name
          <input
            type="text"
            className="signup-modal-values"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {(errors.firstName && clickState === true) && <p>{errors.firstName}</p>}
        <label
          className="signup-modal-label">
          Last Name
          <input
            type="text"
            className="signup-modal-values"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label >
        {(errors.lastName && clickState === true) && <p>{errors.lastName}</p>}
        <label className="signup-modal-label">
          Password
          <input
            type="password"
            className="signup-modal-values"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {(errors.password && clickState === true) && <p>{errors.password}</p>}
        <label className="signup-modal-label">
          Confirm Password
          <input
            type="password"
            className="signup-modal-values"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}
        <div className="signup-button-container">

          <button type="submit"
            className={Object.values(errors).length > 0 ? "disabled-signup-modal-submit" : "enabled-signup-modal-submit"}
            disabled={Object.values(errors).length > 0 ? true : false}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;