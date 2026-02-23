import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/Features/authSlice';
import { toast } from "react-toastify";
import './Signup.css';

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            mobileno: "",
            email: "",
            password: "",
        },

        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, "At least 3 characters")    
                .required("Username is required"),

            mobileno: Yup.string()
                .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
                .required("Mobile number required"),

            email: Yup.string()
                .email("Invalid email")
                .required("Email required"),

            password: Yup.string()
                .min(6, "Minimum 6 characters")
                .required("Password required"),
        }),

        onSubmit: async (values) => {
            try {
                await dispatch(registerUser(values)).unwrap();
                toast.success("Signup successful 🎉");
                navigate("/dashboard");
            } catch (error) {
                toast.error(error || "Signup failed ❌");
            }
        }
    });

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Create an Account</h2>
                <form className="auth-form" onSubmit={formik.handleSubmit}>

                    <div className="input-group">
                        <input
                            className="auth-input"
                            placeholder="Enter username"
                            {...formik.getFieldProps("username")}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <p className="error-text">{formik.errors.username}</p>
                        )}
                    </div>

                    <div className="input-group">
                        <input
                            className="auth-input"
                            placeholder="Enter mobile number"
                            {...formik.getFieldProps("mobileno")}
                        />
                        {formik.touched.mobileno && formik.errors.mobileno && (
                            <p className="error-text">{formik.errors.mobileno}</p>
                        )}
                    </div>

                    <div className="input-group">
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="Enter email"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="error-text">{formik.errors.email}</p>
                        )}
                    </div>

                    <div className="input-group">
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Enter password"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="error-text">{formik.errors.password}</p>
                        )}
                    </div>

                    <button className="auth-submit-btn" type="submit">Signup</button>

                </form>
                
                <div className="auth-footer">
                    Already have an account? <Link className="auth-link" to={'/login'}>Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;