import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const Form = () => {
  const [formState, setFormState] = useState({
    first_name: "",
    email: "",
    password: "",
    terms: true,
  });

  const [errors, setErrors] = useState({
    first_name: "",
    email: "",
    password: "",
    terms: true,
  });

  const [posts, setPosts] = useState();

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [users, setUsers] = useState([]);

  let passwordValidator = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  
  let formSchema = yup.object().shape({
    first_name: yup.string().required("Name is required"),
    email: yup.string().email("Email format is necessary").required("Email is required"),
    password: yup.string().matches(passwordValidator).required("Password is required"),
    terms: yup.boolean().oneOf([true]),
  });

  useEffect(() => {
    formSchema.isValid(formState).then(isFormValid => {
      setButtonDisabled(!isFormValid);
    });
  }, [formState, formSchema]);

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
      .reach(formSchema, event.target.name)
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

  const getAllUsers = event => {
    axios
      .get("https://reqres.in/api/users")
      .then(response => {
        setUsers(response.data.data);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  const formSubmit = event => {
    event.preventDefault();
    console.log({formState});
    axios
      .post("https://reqres.in/api/users", formState)
      .then(response => {
        console.log(response);
        setPosts(response.data);
        setFormState({
          first_name: "",
          email: "",
          password: "",
          terms: true,
        });
      })
      .catch(err => console.log(err));
  }

  return(
    <form onSubmit={formSubmit}>
      <label htmlFor="first_name">
        Name
        <input 
          type="text"
          name="first_name"
          value={formState.first_name}
          onChange={inputChange}
          data-cy="first_name"
        />
        { errors.first_name.length > 0 ? <p className="error">Please, type your name.</p> : null }
      </label>
      <label htmlFor="email">
        Email
        <input 
          type="text"
          name="email"
          value={formState.email}
          onChange={inputChange}
          data-cy="email"
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
          data-cy="password"
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
      <button data-cy="submit" type="submit" disabled={buttonDisabled}>Submit New Member</button>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
      <div className="user-list">
      {users.map(user => {
        return(
          <div className="users">
            <h2>{user.first_name}</h2>
            <p>{user.email}</p>
          </div>
        );
      })}
      </div>
    </form>
  );
}

export default Form;