import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import ProductTab from "../elements/ProductTab";
import RelatedSlider from "../sliders/Related";
import ThumbSlider from "../sliders/Thumb";
import ProductPrice from "./ProductPrice";
import CartServices from "../../services/api/cart-api";

import { useInitialDataContext } from "../../services/hooks/useInitialData";
import { useAuth } from "../../services/hooks/useAuth";
const ProductDetails = ({
  product,
  cartItems,
  addToCompare,
  addToCart,
  addToWishlist,
  increaseQuantity,
  decreaseQuantity,
  quickView,
}) => {
  const { initialData, updateInventory, deleteInventory } =
    useInitialDataContext();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(0);

  const [images, setImages] = useState([]);
  const [price, setPrice] = useState();
  const [inStock, setInStock] = useState();
  const [isHasManyClassifications, setIsHasManyClassifications] = useState();
  const [mainClassification, setMainClassification] = useState([]);
  const [subClassification, setSubClassification] = useState([]);
  const [inventories, setInventories] = useState();
  const [selectedInventory, setSelectedInventory] = useState({
    inventory_id: "",
    classification_main_id: "",
    classification_sub_id: "",
  });

  useEffect(() => {
    console.log("product", product);
    if (product) {
      setImages(product.images);
      setIsHasManyClassifications(product.is_has_many_classifications);
      setInventories(product.inventories);
      if (product.is_has_many_classifications === true) {
        //case length = 2
        if (product.classifications.length === 2) {
          setMainClassification(product.classifications[0]);
          setSubClassification(product.classifications[1]);
          setWhatQuantityNotEqualZero(product.inventories);
        }
        //case length = 1
        else if (product.classifications.length === 1) {
          setMainClassification(product.classifications[0]);
          setSubClassification(null);
          setWhatQuantityNotEqualZero(product.inventories);
        }
      } else {
        setPrice(product?.inventories[0]?.price || 0);
        setInStock(product?.inventories[0]?.quantity || 0);
        setSelectedInventory({
          ...selectedInventory,
          inventory_id: product?.inventories[0]?.inventory_id || "",
        });
      }
    }
  }, [product]);

  const setWhatQuantityNotEqualZero = (inventories) => {
    for (let i = 0; i < inventories.length; i++) {
      if (inventories[i].quantity !== 0) {
        //console.log("inventories[i]", inventories[i]);
        setSelectedInventory({
          inventory_id: inventories[i].inventory_id,
          main_classification_id: inventories[i].classification_main_id,
          sub_classification_id: inventories[i].classification_sub_id,
        });
        setPrice(inventories[i].price);
        setInStock(inventories[i].quantity);
        break;
      }
    }
    //if all quantity = 0
    setSelectedInventory(inventories[0]);
    setPrice(inventories[0].price);
    setInStock(inventories[0].quantity);
  };

  const changeMainClassification = (mainClassificationId) => {
    setSelectedInventory((prev) => {
      const subClassificationId = prev.classification_sub_id;
      const inventory = inventories.find(
        (inventory) =>
          inventory.classification_main_id === mainClassificationId &&
          inventory.classification_sub_id === subClassificationId
      );
      setPrice(inventory.price);
      setInStock(inventory.quantity);
      return inventory;
    });
  };

  const changeSubClassification = (subClassificationId) => {
    setSelectedInventory((prev) => {
      const mainClassificationId = prev.classification_main_id;
      const inventory = inventories.find(
        (inventory) =>
          inventory.classification_main_id === mainClassificationId &&
          inventory.classification_sub_id === subClassificationId
      );
      setPrice(inventory.price);
      setInStock(inventory.quantity);
      return inventory;
    });
  };

  useEffect(() => {
    console.log("selectedInventory", selectedInventory);
  }, [selectedInventory]);

  const handleCart = () => {
    console.log("selectedInventory", selectedInventory);
    const shopId = product.shop_id;
    const inventoryId = selectedInventory.inventory_id;
    const productId = product._id;
    console.log("shopId", shopId);
    console.log("inventoryId", inventoryId);
    console.log("productId", productId);
    console.log("quantity", quantity);
    if (quantity == 0) {
      toast.error("Please choose quantity !");
      return;
    }
    if (shopId && inventoryId && productId && quantity) {
      updateInventory(inventoryId, quantity, shopId, productId);
      toast.success("Added to cart !");
    } else {
      toast.error("Something went wrong !");
    }
  };

  const handleCompare = (product) => {
    addToCompare(product);
    toast("Added to Compare list !");
  };

  const handleWishlist = (product) => {
    addToWishlist(product);
    toast("Added to Wishlist !");
  };

  // const inCart = cartItems.find((cartItem) => cartItem.id === product.id);

  //console.log(inCart);

  return (
    <>
      <section className="mt-50 mb-50">
        <div className="container">
          <div className="row flex-row-reverse">
            <div className="col-xl-10 col-lg-12 m-auto">
              <div className="product-detail accordion-detail">
                <div className="row mb-50  mt-30">
                  <div className="col-md-5 col-sm-12 col-xs-12 mb-md-0 mb-sm-5">
                    <div className="detail-gallery">
                      <span className="zoom-icon">
                        <i className="fi-rs-search"></i>
                      </span>

                      <div className="product-image-slider">
                        <ThumbSlider product={product} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7 col-sm-12 col-xs-12">
                    <div className="detail-info  pr-30 pl-30">
                      <span className="stock-status out-stock"> Sale Off </span>
                      <h2 className="title-detail">{product?.product_name}</h2>
                      <div className="product-detail-rating">
                        <div className="product-rate-cover text-end">
                          <div className="product-rate d-inline-block">
                            <div
                              className="product-rating"
                              style={{ width: "90%" }}
                            ></div>
                          </div>
                          <span className="font-small ml-5 text-muted">
                            {" "}
                            (32 reviews)
                          </span>
                        </div>
                      </div>
                      <div className="clearfix product-price-cover">
                        <div className="product-price primary-color float-left">
                          <span className="current-price text-brand">
                            <ProductPrice price={price} />
                          </span>
                          {/* <span>
                            <span className="save-price font-md color3 ml-15">
                              {product.discount.percentage}% Off
                            </span>
                            <span className="old-price font-md ml-15">
                              {product.oldPrice
                                ? `$ ${product.oldPrice}`
                                : null}
                            </span>
                          </span> */}
                        </div>
                      </div>

                      {/* <div className="short-desc mb-30">
                        <p className="font-lg">{product.desc}</p>
                      </div> */}
                      {/* <div className="attr-detail attr-color mb-15">
                        <strong className="mr-10">Color</strong>
                        <ul className="list-filter color-filter">
                          {product.variations.map((clr, i) => (
                            <li key={i}>
                              <a href="#">
                                <span className={`product-color-${clr}`}></span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div> */}
                      {isHasManyClassifications && mainClassification && (
                        <div className="attr-detail attr-color mb-15">
                          <strong className="mr-10">
                            {mainClassification.classification_name}
                          </strong>
                          <ul className="list-filter size-filter font-small">
                            {mainClassification.items.map((value) => (
                              <li
                                key={value._id}
                                className={
                                  value._id ===
                                  selectedInventory.classification_main_id
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) =>
                                  changeMainClassification(value._id)
                                }
                              >
                                <a>
                                  <span>{value.item_name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {isHasManyClassifications && subClassification && (
                        <div className="attr-detail attr-color mb-15">
                          <strong className="mr-10">
                            {subClassification.classification_name}
                          </strong>
                          <ul className="list-filter size-filter font-small">
                            {subClassification.items.map((value) => (
                              <li
                                key={value._id}
                                className={
                                  value._id ===
                                  selectedInventory.classification_sub_id
                                    ? "active"
                                    : ""
                                }
                                onClick={(e) =>
                                  changeSubClassification(value._id)
                                }
                              >
                                <a>
                                  <span>{value.item_name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* <div className="attr-detail attr-size">
                        <strong className="mr-10">Size</strong>
                        <ul className="list-filter size-filter font-small">
                          <li className="active">
                            <a>M</a>
                          </li>
                          <li>
                            <a>L</a>
                          </li>
                          <li>
                            <a>XL</a>
                          </li>
                          <li>
                            <a>XXL</a>
                          </li>
                        </ul>
                      </div> */}
                      <div className="product-extra-link2">
                        {inStock} products available.
                      </div>
                      <div className="bt-1 border-color-1 mt-15 mb-15"></div>
                      <div className="detail-extralink">
                        <div className="detail-qty border radius">
                          <a
                            onClick={() => {
                              if (quantity > 1) {
                                setQuantity(quantity - 1);
                              }
                            }}
                            className="qty-down"
                          >
                            <i className="fi-rs-angle-small-down"></i>
                          </a>
                          <span className="qty-val">{quantity}</span>
                          <a
                            onClick={() => {
                              if (quantity < inStock) {
                                setQuantity(quantity + 1);
                              }
                            }}
                            className="qty-up"
                          >
                            <i className="fi-rs-angle-small-up"></i>
                          </a>
                        </div>
                        <div className="product-extra-link2">
                          <button
                            onClick={(e) => handleCart()}
                            className="button button-add-to-cart"
                          >
                            Add to cart
                          </button>
                          <button
                            onClick={(e) =>
                              handleCart({
                                ...product,
                                quantity: quantity || 1,
                              })
                            }
                            className="button button-add-to-cart ml-5"
                          >
                            Buy Now
                          </button>
                          <a
                            aria-label="Add To Wishlist"
                            className="action-btn hover-up"
                            onClick={(e) => handleWishlist(product)}
                          >
                            <i className="fi-rs-heart"></i>
                          </a>
                        </div>
                      </div>
                      <ul className="product-meta font-xs color-grey mt-50">
                        <li className="mb-5">
                          SKU:
                          <a href="#">FWM15VKT</a>
                        </li>
                        <li className="mb-5">
                          Tags:
                          <a href="#" rel="tag" className="me-1">
                            Cloth,
                          </a>
                        </li>
                        <li>
                          Availability:
                          <span className="in-stock text-success ml-5">
                            {inStock} Items In Stock
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {quickView ? null : (
                  <>
                    <ProductTab product={product} />
                    <div className="row mt-60">
                      <div className="col-12">
                        <h3 className="section-title style-1 mb-30">
                          Related products
                        </h3>
                      </div>
                      <div className="col-12">
                        <div className="row related-products position-relative">
                          <RelatedSlider />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
});

const mapDispatchToProps = {
  addToCompare,
  addToWishlist,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
