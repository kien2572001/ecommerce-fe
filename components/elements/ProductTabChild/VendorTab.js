import { useState, useEffect } from "react";
import UserServices from "../../../services/api/user-api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const VendorTab = ({ product }) => {
  const [vendor, setVendor] = useState(null);
  useEffect(() => {
    const fetchVendor = async () => {
      const data = await UserServices.fetchShopById(product.shop_id);
      //console.log("data", data);
      setVendor(data);
    };
    if (product.shop_id) {
      fetchVendor();
    }
  }, [product]);

  return (
    <div>
      <div className="vendor-logo d-flex mb-30">
        <img src="/assets/imgs/vendor/vendor-18.svg" alt="nest" />
        <div className="vendor-name ml-15">
          <h6>
            <a href="vendor-details-2.html">
              {vendor?.shop_name || <Skeleton />}
            </a>
          </h6>
          <div className="product-rate-cover text-end">
            <div className="product-rate d-inline-block">
              <div className="product-rating" style={{ width: "90%" }}></div>
            </div>
            <span className="font-small ml-5 text-muted"> (32 reviews)</span>
          </div>
        </div>
      </div>
      <ul className="contact-infor mb-50">
        <li>
          <img src="/assets/imgs/theme/icons/icon-location.svg" alt="nest" />
          <strong>Address: </strong>{" "}
          <span>{vendor?.address?.full_address || <Skeleton />}</span>
        </li>
        <li>
          <img src="/assets/imgs/theme/icons/icon-contact.svg" alt="nest" />
          <strong>Contact Seller:</strong>{" "}
          <span>{vendor?.phone_number || <Skeleton />}</span>
        </li>
      </ul>
      {/* <div className="d-flex mb-55">
        <div className="mr-30">
          <p className="text-brand font-xs">Rating</p>
          <h4 className="mb-0">92%</h4>
        </div>
        <div className="mr-30">
          <p className="text-brand font-xs">Ship on time</p>
          <h4 className="mb-0">100%</h4>
        </div>
        <div>
          <p className="text-brand font-xs">Chat response</p>
          <h4 className="mb-0">89%</h4>
        </div>
      </div> */}
      <p>
        {vendor?.description || <Skeleton count={3} />}
        {/* Noodles & Company là một chuỗi nhà hàng ăn nhanh của Mỹ chuyên về các
        món mì và pasta quốc tế và Mỹ, cùng với súp và salad. Noodles & Company
        được thành lập năm 1995 bởi Aaron Kennedy và có trụ sở chính tại
        Broomfield, Colorado. Công ty đã công khai vào năm 2013 và ghi nhận
        doanh thu 457 triệu USD vào năm 2017. Cuối năm 2018, có 460 địa điểm
        Noodles & Company trên khắp 29 bang và Washington, D.C. */}
      </p>
    </div>
  );
};

export default VendorTab;
