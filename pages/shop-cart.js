"use client";

import { connect } from "react-redux";
import Layout from "../components/layout/Layout";
import { useInitialDataContext } from "../services/hooks/useInitialData";
import { toast } from "react-toastify";
import Link from "next/link";
import Helpers from "../util/helpers";
import ProductPrice from "../components/ecommerce/ProductPrice";
import { useRouter } from "next/router";
import { Badge } from "react-bootstrap";
const Cart = () => {
  const router = useRouter();

  const { initialData, updateInventory, deleteInventory, productVariant } =
    useInitialDataContext();

  const isFlashSaleOngoing = (inventory) => {
    if (inventory && inventory.flash_sale_start_time !== "") {
    }
    const startTime = new Date(Number(inventory.flash_sale_start_time));
    const endTime = new Date(Number(inventory.flash_sale_end_time));
    const currentTime = new Date();
    if (currentTime > startTime && currentTime < endTime) {
      return inventory.flash_sale_quantity > 0;
    }
    return false;
  };

  const getPrice = (inventory) => {
    if (isFlashSaleOngoing(inventory)) {
      return inventory.flash_sale_price;
    }
    return inventory.price;
  };

  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Cart">
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mb-40">
                <h1 className="heading-2 mb-10">Your Cart</h1>
                <div className="d-flex justify-content-between">
                  <h6 className="text-body">
                    Carefully check the information before checkout
                  </h6>
                  <h6 className="text-body">
                    <a href="#" className="text-muted">
                      <i className="fi-rs-trash mr-5"></i>
                      Clear Cart
                    </a>
                  </h6>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8">
                <div className="table-responsive shopping-summery">
                  {initialData &&
                    initialData.cart?.items?.length <= 0 &&
                    "No Products"}
                  {/* {cartItems.length <= 0 && "No Products"} */}
                  <table
                    className={
                      initialData.cart?.items?.length > 0
                        ? "table table-wishlist"
                        : "d-none"
                    }
                  >
                    <thead>
                      <tr className="main-heading">
                        <th
                          className="custome-checkbox start pl-30"
                          colSpan="2"
                        >
                          Product
                        </th>
                        <th scope="col">Unit Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Subtotal</th>
                        <th scope="col" className="end">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {initialData?.cart?.items?.map((item, i) => {
                        return (
                          <>
                            <tr key={item.shop._id}>
                              <td className="product-des product-name">
                                <h6 className="product-name pl-20">Shop:</h6>
                              </td>
                              <td
                                className="product-des product-name"
                                colSpan={2}
                              >
                                <h6 className="product-name">
                                  <Link
                                    href="/shop/[id]"
                                    as={`/shop/${item.shop._id}`}
                                  >
                                    {item.shop.shop_name}
                                  </Link>
                                </h6>
                              </td>
                              <td className="product-des product-name">
                                <h6 className="product-name pl-10">
                                  Total bill:
                                </h6>
                              </td>
                              <td className="text-right" data-title="Cart">
                                <h4 className="text-body">
                                  <ProductPrice
                                    price={item.inventories.reduce(
                                      (total, inventory) =>
                                        total +
                                        inventory.quantity *
                                          getPrice(inventory.inventory),
                                      0
                                    )}
                                  />
                                </h4>
                              </td>
                              <td className="action" data-title="Remove">
                                <div className="cart-action">
                                  <a
                                    className="btn "
                                    onClick={() => {
                                      router.push(
                                        "/shop-checkout?cartId=" +
                                          initialData.cart.id +
                                          "&shopId=" +
                                          item.shop._id +
                                          "&orderId=" +
                                          Helpers.generateOrderId()
                                      );
                                    }}
                                  >
                                    Checkout
                                  </a>
                                </div>
                              </td>
                            </tr>
                            {item?.inventories?.map((item, i) => {
                              return (
                                <tr
                                  key={
                                    "shop-cart-inventory-" + item.inventory_id
                                  }
                                >
                                  <td className="image product-thumbnail">
                                    {/* <img src={item.images[0].img} /> */}
                                    <img src={item.product?.images[0]?.url} />
                                  </td>

                                  <td className="product-des product-name">
                                    <h6 className="product-name">
                                      <Link
                                        href={`/products/${item.product?.product_slug}`}
                                      >
                                        {item.product?.product_name}
                                      </Link>
                                    </h6>
                                    <div className="product-rate-cover">
                                      {/* <div className="product-rate d-inline-block">
                                        <div
                                          className="product-rating"
                                          style={{
                                            width: "90%",
                                          }}
                                        ></div>
                                      </div>
                                      <span className="font-small ml-5 text-muted">
                                        {" "}
                                        (4.0)
                                      </span> */}
                                      {productVariant(
                                        item.inventory_id,
                                        item.shop_id
                                      )}
                                      <Badge pill bs="primary">
                                        Flash Sale
                                      </Badge>
                                    </div>
                                  </td>
                                  <td className="price" data-title="Price">
                                    <h4 className="text-brand">
                                      <ProductPrice
                                        price={getPrice(item.inventory)}
                                      />
                                    </h4>
                                    {isFlashSaleOngoing(item.inventory) && (
                                      <span className="text-muted">
                                        <del>
                                          <ProductPrice
                                            price={item.inventory.price}
                                          />
                                        </del>
                                      </span>
                                    )}
                                  </td>
                                  <td
                                    className="text-center detail-info"
                                    data-title="Stock"
                                  >
                                    <div className="detail-extralink mr-15">
                                      <div
                                        className="detail-qty border radius "
                                        style={{
                                          margin: "0",
                                        }}
                                      >
                                        <a
                                          onClick={(e) => {
                                            //console.log(item);
                                            if (item.quantity > 1) {
                                              updateInventory(
                                                item.inventory_id,
                                                item.quantity - 1,
                                                item.shop_id,
                                                item.product_id
                                              );
                                            } else {
                                              deleteInventory(
                                                item.shop_id,
                                                item.inventory_id
                                              );
                                            }
                                          }}
                                          className="qty-down"
                                        >
                                          <i className="fi-rs-angle-small-down"></i>
                                        </a>
                                        <span className="qty-val">
                                          {item.quantity}
                                        </span>
                                        <a
                                          onClick={(e) => {
                                            //console.log(item);
                                            if (
                                              item.quantity <
                                              item.inventory?.quantity
                                            ) {
                                              updateInventory(
                                                item.inventory_id,
                                                item.quantity + 1,
                                                item.shop_id,
                                                item.product_id
                                              );
                                            } else {
                                              toast.error(
                                                "You can't add more than available quantity(" +
                                                  item.inventory?.quantity +
                                                  ")"
                                              );
                                            }
                                          }}
                                          className="qty-up"
                                        >
                                          <i className="fi-rs-angle-small-up"></i>
                                        </a>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="text-right" data-title="Cart">
                                    <h4 className="text-body">
                                      <ProductPrice
                                        price={
                                          item.quantity *
                                          getPrice(item.inventory)
                                        }
                                      />
                                    </h4>
                                  </td>
                                  <td className="action" data-title="Remove">
                                    <a
                                      onClick={(e) =>
                                        deleteInventory(
                                          item.shop_id,
                                          item.inventory_id
                                        )
                                      }
                                      className="text-muted"
                                    >
                                      <i className="fi-rs-trash"></i>
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        );
                      })}
                      <tr>
                        <td colSpan="6" className="text-end">
                          {/* {cartItems.length > 0 && (
                            <a onClick={clearCart} className="text-muted">
                              <i className="fi-rs-cross-small"></i>
                              Clear Cart
                            </a>
                          )} */}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="cart-action text-end">
                  <a className="btn ">
                    <i className="fi-rs-shopping-bag mr-10"></i>
                    Continue Shopping
                  </a>
                </div>
                <div className="divider center_icon mt-50 mb-50">
                  <i className="fi-rs-fingerprint"></i>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Cart;
