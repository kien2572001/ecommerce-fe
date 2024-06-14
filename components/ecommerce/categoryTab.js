import React, { useEffect, useState } from "react";
import { server } from "../../config/index";
import Cat1Tab from "../elements/FeaturedTab";
import Cat2Tab from "../elements/NewArrivalTab";
import Cat3Tab from "../elements/TrendingTab";
import Link from "next/link";
import ProductServices from "../../services/api/product-api";
import usePagination from "../../services/hooks/usePagination";
import SingleProduct from "./SingleProduct";
import Pagination from "./Pagination";
function CategoryTab() {
  const [active, setActive] = useState("all");
  const [products, setProducts] = useState([]);
  const [pageArray, setPageArray] = useState([]);
  const [trending, setTrending] = useState(false);
  const [popular, setPopular] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const {
    page,
    limit,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setPageNumber,
    setLimitPerPage,
    setTotalPages,
  } = usePagination(1, 10);
  const fetchProducts = async () => {
    try {
      const data = await ProductServices.fetchProductInHomePage(
        page,
        limit,
        "",
        "",
        {
          trending,
          popular,
          newArrival,
        }
      );
      //console.log("products", data);

      setProducts(data.data.docs);
      setTotalPages(data.data.totalPages);
      setPageArray(getPagesArray(data.data.totalPages));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, trending, popular, newArrival]);

  function getPagesArray(totalPages) {
    const arr = Array.from({ length: totalPages }, (_, i) => i + 1);
    return arr;
  }

  return (
    <>
      <div className="section-title style-2 wow animate__animated animate__fadeIn">
        <h3>Popular Products</h3>
        <ul className="nav nav-tabs links" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={active === "all" ? "nav-link active" : "nav-link"}
              onClick={() => {
                setTrending(false);
                setPopular(false);
                setNewArrival(false);
                setActive("all");
              }}
            >
              All
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={active === "trending" ? "nav-link active" : "nav-link"}
              onClick={() => {
                setTrending(true);
                setPopular(false);
                setNewArrival(false);
                setActive("trending");
              }}
            >
              Trending
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={active === "popular" ? "nav-link active" : "nav-link"}
              onClick={() => {
                setTrending(false);
                setPopular(true);
                setNewArrival(false);
                setActive("popular");
              }}
            >
              Popular
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={
                active === "newArrival" ? "nav-link active" : "nav-link"
              }
              onClick={() => {
                setTrending(false);
                setPopular(false);
                setNewArrival(true);
                setActive("newArrival");
              }}
            >
              New added
            </button>
          </li>
        </ul>
      </div>
      <div className="tab-content wow fadeIn animated">
        <div className="row product-grid">
          {products.length === 0 && <h3>No Products Found </h3>}

          {products.map((item, i) => (
            <div
              className="col-lg-1-5 col-md-4 col-12 col-sm-6"
              key={"product-detail-" + i}
            >
              <SingleProduct product={item} />
              {/* <SingleProductList product={item} /> */}
            </div>
          ))}
        </div>
      </div>
      <div className="pagination-area mt-15 mb-sm-5 mb-lg-0">
        <nav aria-label="Page navigation example">
          <Pagination
            getPaginationGroup={pageArray}
            currentPage={page}
            pages={totalPages}
            next={goToNextPage}
            prev={goToPreviousPage}
            handleActive={setPageNumber}
          />
        </nav>
      </div>

      {/* <div className="tab-content wow fadeIn animated">
        <div
          className={
            active === "1" ? "tab-pane fade show active" : "tab-pane fade"
          }
        >
          <div className="product-grid-4 row">
            <Cat1Tab products={catAll} />
          </div>
        </div>

        <div
          className={
            active === "2" ? "tab-pane fade show active" : "tab-pane fade"
          }
        >
          <div className="product-grid-4 row">
            <Cat1Tab products={cat1} />
          </div>
        </div>

        <div
          className={
            active === "3" ? "tab-pane fade show active" : "tab-pane fade"
          }
        >
          <div className="product-grid-4 row">
            <Cat3Tab products={cat2} />
          </div>
        </div>
        <div
          className={
            active === "4" ? "tab-pane fade show active" : "tab-pane fade"
          }
        >
          <div className="product-grid-4 row">
            <Cat2Tab products={cat3} />
          </div>
        </div>
      </div> */}
    </>
  );
}
export default CategoryTab;
