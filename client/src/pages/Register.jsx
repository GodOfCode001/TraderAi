import React, { useState } from "react";
import "./register.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referrer: "",
  });

  // console.log(formValues)

  const [formErrors, setFormErrors] = useState({});

  console.log(formErrors);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let errors = {};

    if (!formValues.username) {
      errors.username = true;
    }

    if (!formValues.email) {
      errors.email = true;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = true;
    }

    if (!formValues.password) {
      errors.password = true;
    }

    if (!formValues.confirmPassword) {
      errors.confirmPassword = true;
    } else if (formValues.confirmPassword !== formValues.password) {
      errors.confirmPassword = true;
    }

    if (!formValues.referrer) {
      errors.referrer = true;
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Proceed with form submission (e.g., send data to the server)
      console.log("Form is valid, submitting...");
    } else {
      console.log("Form is invalid, please correct the errors");
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-card">
          <fieldset>
            <legend>{t("big-register")}</legend>
            <div className="name"> {t("web-name")} </div>
            <div className="welcome"> {t("register-welcome")} </div>
            <form action="">
              <label htmlFor="username">
                username: <span className="red">*</span>{" "}
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username"
                value={formValues.username}
                onChange={handleChange}
                className={formErrors.username ? "input-error" : ""}
              />
              <label htmlFor="email">
                email: <span className="red">*</span>
              </label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="email"
                value={formValues.email}
                onChange={handleChange}
                className={formErrors.email ? "input-error" : ""}
              />
              <label htmlFor="password">
                password: <span className="red">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                value={formValues.password}
                onChange={handleChange}
                className={formErrors.password ? "input-error" : ""}
              />
              <label htmlFor="confirmPassword">
                confirm Password: <span className="red">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="confirm Password"
                value={formValues.confirmPassword}
                onChange={handleChange}
                className={formErrors.confirmPassword ? "input-error" : ""}
              />
              <label htmlFor="referrer">
                referrer Code: <span className="red">*</span>
              </label>
              <input
                type="text"
                name="referrer"
                id="referrer"
                placeholder="referrer Code"
                value={formValues.referrer}
                onChange={handleChange}
                className={formErrors.referrer ? "input-error" : ""}
              />
              <button onClick={handleSubmit}> {t("big-register")} </button>
            </form>
            <div className="asking">
              {t("id-asking")}{" "}
              <Link to="/login" className="link">
                {" "}
                {t("big-login")}{" "}
              </Link>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default Register;
