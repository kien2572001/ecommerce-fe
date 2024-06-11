"use client";

import Link from "next/link";
import Layout from "../components/layout/Layout";
import AuthServices from "../services/api/auth-api";
import { useState, useEffect } from "react";
import GuestGuard from "../services/guards/GuestGuard";
import { useAuth } from "../services/hooks/useAuth";
import { toast } from "react-toastify";

function Login() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");

  // Tạo mã bảo mật ngẫu nhiên khi component được tải
  useEffect(() => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (securityCode !== generatedCode) {
      setError("Security code is incorrect.");
      return;
    }

    // Gửi yêu cầu đăng nhập
    AuthServices.login(email, password)
      .then((data) => {
        login(data.data.accessToken);
        toast.success("Login successfully");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <GuestGuard>
      <Layout parent="Home" sub="Pages" subChild="Login & Register">
        <div className="page-content pt-150 pb-150">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                <div className="row">
                  <div className="col-lg-6 pr-30 d-none d-lg-block">
                    <img
                      className="border-radius-15"
                      src="assets/imgs/page/login-1.png"
                      alt="nest"
                    />
                  </div>
                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all bg-white">
                        <div className="heading_s1">
                          <h1 className="mb-5">Login</h1>
                          <p className="mb-30">
                            Don't have an account?{" "}
                            <Link href="/page-register">Create here</Link>
                          </p>
                        </div>
                        <form method="post" onSubmit={handleSubmit}>
                          <div className="form-group">
                            <input
                              type="text"
                              required
                              name="email"
                              placeholder="Username or Email *"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <input
                              required
                              type="password"
                              name="password"
                              placeholder="Your password *"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="login_footer form-group">
                            <div className="chek-form">
                              <input
                                type="text"
                                required
                                name="securityCode"
                                placeholder="Security code *"
                                value={securityCode}
                                onChange={(e) =>
                                  setSecurityCode(e.target.value)
                                }
                              />
                            </div>
                            <span className="security-code">
                              {generatedCode.split("").map((digit, index) => (
                                <b key={index}>{digit}</b>
                              ))}
                            </span>
                          </div>
                          {error && <p className="text-danger">{error}</p>}
                          <div className="login_footer form-group mb-50">
                            <div className="chek-form">
                              <div className="custome-checkbox">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="checkbox"
                                  id="exampleCheckbox1"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="exampleCheckbox1"
                                >
                                  <span>Remember me</span>
                                </label>
                              </div>
                            </div>
                            <a className="text-muted" href="#">
                              Forgot password?
                            </a>
                          </div>
                          <div className="form-group">
                            <button
                              type="submit"
                              className="btn btn-heading btn-block hover-up"
                              name="login"
                            >
                              Log in
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </GuestGuard>
  );
}

export default Login;
