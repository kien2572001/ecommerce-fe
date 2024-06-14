import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Tags from "../ecommerce/Filter/Tags";
import ProductServices from "../../services/api/product-api";
import { useEffect, useState } from "react";
const Breadcrumb2 = ({ parent, sub, subChild, noBreadcrumb }) => {
  const router = useRouter();

  const cat_slug = router.query.cat;

  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await ProductServices.fetchCategoryBySlug(cat_slug);
        setCategory(data.category);
        //console.log("category", data.category);
      } catch (error) {
        console.log(error);
      }
    };
    if (cat_slug) {
      fetchCategory();
    }
  }, [cat_slug]);

  return (
    <>
      <div className="page-header mt-30 mb-50">
        <div className="container">
          <div className="archive-header">
            <div className="row align-items-center">
              <div className="col-xl-3">
                <h1 className="mb-15 text-capitalize">
                  {/* {cat_slug ? cat_slug : "Category"} */}
                  {category ? category.category_name : "Category"}
                </h1>
                <div className="breadcrumb">
                  <Link href="/">
                    <i className="fi-rs-home mr-5"></i>Home
                  </Link>
                  <span></span> Shop <span></span>{" "}
                  {category ? category.category_name : "Category"}
                </div>
              </div>
              {/* <div className="col-xl-9 text-end d-none d-xl-block">
                            <Tags/>
                        </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Breadcrumb2;
