import Link from "next/link";
import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { openQuickView } from "../../redux/action/quickViewAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import ProductPrice from "./ProductPrice";
import { useRouter } from "next/router";
import Helpers from "../../util/helpers";
const SingleProduct = ({ product }) => {
  // const handleCart = (product) => {
  //     addToCart(product);
  //     toast("Product added to Cart !");
  // };

  // const handleCompare = (product) => {
  //     addToCompare(product);
  //     toast("Added to Compare list !");
  // };

  //   const handleWishlist = (product) => {
  //     addToWishlist(product);
  //     toast("Added to Wishlist !");
  //   };

  const router = useRouter();

  return (
    <>
      <div className="product-cart-wrap mb-30">
        <div className="product-img-action-wrap">
          <div className="product-img product-img-zoom">
            <Link
              href="/products/[slug]"
              as={`/products/${product.product_slug}`}
            >
              <img
                className="default-img"
                src={product.images[0].url}
                alt="nest"
              />
              <img
                className="hover-img"
                src={product.images[0].url}
                alt="nest"
              />
            </Link>
          </div>
          {/* <div className="product-action-1">
            <a
              aria-label="Quick view"
              className="action-btn hover-up"
              data-bs-toggle="modal"
              onClick={(e) => openQuickView(product)}
            >
              <i className="fi-rs-eye"></i>
            </a>
            <a
              aria-label="Add To Wishlist"
              className="action-btn hover-up"
              onClick={(e) => handleWishlist(product)}
            >
              <i className="fi-rs-heart"></i>
            </a>
            <a
              aria-label="Compare"
              className="action-btn hover-up"
              onClick={(e) => handleCompare(product)}
            >
              <i className="fi-rs-shuffle"></i>
            </a>
          </div> */}

          <div className="product-badges product-badges-position product-badges-mrg">
            {/* {product.trending && <span className="hot">Hot</span>} */}
            {/* {product.created && <span className="new">New</span>} */}
            {product.sold_quantity > 1000 && (
              <span className="best">Best Sell</span>
            )}
            {/* {product.discount.isActive && <span className="sale">Sale</span>} */}
            {/* {product.discount.percentage >= 5 && (
              <span className="hot">{product.discount.percentage}%</span>
            )} */}
          </div>
        </div>
        <div className="product-content-wrap">
          {/* <div className="product-category">
            <Link href="/products">{product.brand}</Link>
          </div> */}
          <h2 className="two-line-ellipsis">
            <Link
              href="/products/[slug]"
              as={`/products/${product.product_slug}`}
            >
              {product.product_name}
            </Link>
          </h2>

          <div className="product-rate-cover">
            <div className="product-rate d-inline-block">
              {product && product.rating && (
                <div
                  className="product-rating"
                  style={{ width: `${product.rating * 20}%` }}
                ></div>
              )}
            </div>
            <span className="font-small ml-5 text-muted">
              {" "}
              (
              {product?.total_reviews
                ? Helpers.formatNumber(product.total_reviews)
                : 0}
              )
            </span>
          </div>

          <div>
            <span
              className="font-small text-muted d-inline-block text-truncate"
              style={{ maxWidth: "150px" }}
            >
              By <Link href="/vendor/1">{product?.shop?.shop_name}</Link>
            </span>
          </div>

          <div className="product-card-bottom">
            <div className="product-price">
              <span>
                <ProductPrice price={product.price} />
              </span>
              {/* <span className="old-price">
                {product.oldPrice && `$ ${product.oldPrice}`}
              </span> */}
            </div>
            <div className="add-cart">
              <a
                className="add"
                onClick={(e) => {
                  router.push(`/products/${product.product_slug}`);
                }}
              >
                <i className="fi-rs-shopping-cart mr-5"></i> Buy
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = {
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
};

export default connect(null, mapDispatchToProps)(SingleProduct);
