import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/Features/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import './Login.css';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },

        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email format")
                .required("Email is required"),

            password: Yup.string()
                .min(6, "Minimum 6 characters required")
                .required("Password is required")
        }),

        onSubmit: async (values) => {
            try {
                await dispatch(loginUser(values)).unwrap();
                toast.success("Login successful ✅");
                navigate("/dashboard");
            } catch (error) {
                toast.error(error || "Login failed ❌");
            }
        }
    });

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back</h2>
                <form className="auth-form" onSubmit={formik.handleSubmit}>

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

                    <button className="auth-submit-btn" type="submit">Login</button>

                </form>
                
                <div className="auth-footer">
                    Don't have an account? <Link className="auth-link" to={'/signup'}>Sign up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;