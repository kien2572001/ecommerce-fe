import React, { useState, lazy, Suspense } from "react";

// Lazy load các component
const DescriptionTab = lazy(() => import("./ProductTabChild/DescriptionTab"));
const AdditionalInfoTab = lazy(() =>
  import("./ProductTabChild/AdditionalInfoTab")
);
const VendorTab = lazy(() => import("./ProductTabChild/VendorTab"));
const ReviewsTab = lazy(() => import("./ProductTabChild/ReviewsTab"));

const ProductTab = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(1);

  const handleOnClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="product-info">
      <div className="tab-style3">
        <ul className="nav nav-tabs text-uppercase">
          <li className="nav-item">
            <a
              className={activeIndex === 1 ? "nav-link active" : "nav-link"}
              id="Description-tab"
              data-bs-toggle="tab"
              onClick={() => handleOnClick(1)}
            >
              Description
            </a>
          </li>
          <li className="nav-item">
            <a
              className={activeIndex === 2 ? "nav-link active" : "nav-link"}
              id="Additional-info-tab"
              data-bs-toggle="tab"
              onClick={() => handleOnClick(2)}
            >
              Additional info
            </a>
          </li>
          <li className="nav-item">
            <a
              className={activeIndex === 3 ? "nav-link active" : "nav-link"}
              id="Vendor-tab"
              data-bs-toggle="tab"
              onClick={() => handleOnClick(3)}
            >
              Vendor
            </a>
          </li>
          <li className="nav-item">
            <a
              className={activeIndex === 4 ? "nav-link active" : "nav-link"}
              id="Reviews-tab"
              data-bs-toggle="tab"
              onClick={() => handleOnClick(4)}
            >
              Reviews (3)
            </a>
          </li>
        </ul>
        <div className="tab-content shop_info_tab entry-main-content">
          <Suspense fallback={<div>Loading...</div>}>
            {activeIndex === 1 && <DescriptionTab product={product} />}
            {activeIndex === 2 && <AdditionalInfoTab product={product} />}
            {activeIndex === 3 && <VendorTab product={product} />}
            {activeIndex === 4 && <ReviewsTab product={product} />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProductTab;
