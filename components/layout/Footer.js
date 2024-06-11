import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="main">
        <div
          className="container pb-30  wow animate__animated animate__fadeInUp"
          data-wow-delay="0"
        >
          <div className="row align-items-center">
            <div className="col-12 mb-30">
              <div className="footer-bottom"></div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6">
              <p className="font-sm mb-0">
                &copy; 2024, <strong className="text-brand">Nest</strong> - HTML
                Ecommerce Template <br />
                All rights reserved
              </p>
            </div>
            <div className="col-xl-4 col-lg-6 text-center d-none d-xl-block">
              <div className="hotline d-lg-inline-flex mr-30">
                <img
                  src="/assets/imgs/theme/icons/phone-call.svg"
                  alt="hotline"
                />
                <p>
                  1900 - 6666<span>Working 8:00 - 22:00</span>
                </p>
              </div>
              <div className="hotline d-lg-inline-flex">
                <img
                  src="/assets/imgs/theme/icons/phone-call.svg"
                  alt="hotline"
                />
                <p>
                  1900 - 8888<span>24/7 Support Center</span>
                </p>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 text-end d-none d-md-block">
              <div className="mobile-social-icon">
                <h6>Follow Us</h6>
                <a href="#">
                  <img
                    src="/assets/imgs/theme/icons/icon-facebook-white.svg"
                    alt="nest"
                  />
                </a>
                <a href="#">
                  <img
                    src="/assets/imgs/theme/icons/icon-twitter-white.svg"
                    alt="nest"
                  />
                </a>
                <a href="#">
                  <img
                    src="/assets/imgs/theme/icons/icon-instagram-white.svg"
                    alt="nest"
                  />
                </a>
                <a href="#">
                  <img
                    src="/assets/imgs/theme/icons/icon-pinterest-white.svg"
                    alt="nest"
                  />
                </a>
                <a href="#">
                  <img
                    src="/assets/imgs/theme/icons/icon-youtube-white.svg"
                    alt="nest"
                  />
                </a>
              </div>
              <p className="font-sm">
                Up to 15% discount on your first subscribe
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
