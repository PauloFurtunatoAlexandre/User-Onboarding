import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const Form = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: true,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: true,
  });

  const [posts, setPosts] = useState();

  const [buttonDisabled, setButtonDisabled] = useState(true);

  let passwordValidator = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  
  let schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Email format is necessary").required("Email is required"),
    password: yup.string().matches(passwordValidator).required("Password is required"),
    terms: yup.boolean().oneOf([true]),
  });

  useEffect(() => {
    schema.isValid(formState).then(isFormValid => {
      setButtonDisabled(!isFormValid);
    });
  }, [formState, schema]);

  const inputChange = event => {
    event.persist();
    setFormState({ name: event.target.value });

    const newFormData = {
      ...formState,
      [event.target.name]: event.target.name === "terms" ? event.target.checked : event.target.value,
    }

    validateChange(event);
    setFormState(newFormData);
  }

  const validateChange = event => {
    yup
      .reach(schema, event.target.name)
      .validate(event.target.value)
      .then(inputIsValid => {
        setErrors({
          ...errors,
          [event.target.name]: ""
        });
      })
      .catch(err => {
        setErrors({
          ...errors,
          [event.target.name]: err.errors[0],
        });
      });
  }

  const formSubmit = event => {
    axios
      .post("https://reqres.in/api/users", formState)
      .then(response => {
        console.log(response);
        setPosts(response.data);
        setFormState({
          name: "",
          email: "",
          password: "",
          terms: true,
        });
      })
      .catch(err => console.log(err));
  }

  return(
    <form onSubmit={formSubmit}>
      <label htmlFor="name">
        Name
        <input 
          type="text"
          name="name"
          value={formState.name}
          onChange={inputChange}
        />
        { errors.name.length > 0 ? <p className="error">Please, type your name.</p> : null }
      </label>
      <label htmlFor="email">
        Email
        <input 
          type="text"
          name="email"
          value={formState.email}
          onChange={inputChange}
        />
        { errors.email.length > 0 ? <p className="error">Please, type your email.</p> : null }
      </label>
      <label htmlFor="password">
        Password
        <input 
          type="password"
          name="password"
          value={formState.password}
          onChange={inputChange}
        />
        { errors.password.length > 8 ? <p className="error">Minimum eight characters, at least one letter, one number and one special character.</p> : null }
      </label>
      <label htmlFor="terms" className="terms">
        <input 
          type="checkbox"
          id="terms"
          name="terms"
          checked={formState.terms}
          onChange={inputChange}
        />
        Terms and conditions
      </label>
      <button type="submit" disabled={buttonDisabled}>Submit New Member</button>
    </form>
  );
}

export default Form;