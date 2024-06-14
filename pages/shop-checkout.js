"use client";

import { useRouter } from "next/router";
import ProductPrice from "../components/ecommerce/ProductPrice";
import Layout from "../components/layout/Layout";
import CartServices from "../services/api/cart-api";
import { useEffect, useState } from "react";
import ShippingServices from "../services/api/shipping-api";
import { toast } from "react-toastify";
import OrderServices from "../services/api/order-api";
import { useInitialDataContext } from "../services/hooks/useInitialData";
import AddressComponent from "../components/ecommerce/AddressComponent";
import Helpers from "../util/helpers";
import { Badge } from "react-bootstrap";
import Link from "next/link";
export default function ShopCheckout() {
  const router = useRouter();
  const { initialData, updateInventory, deleteInventory, productVariant } =
    useInitialDataContext();
  const { cartId, shopId, orderId } = router.query;

  const [inventories, setInventories] = useState([]);
  const [address, setAddress] = useState(null);
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");

  const calculateInventoryPrice = (inventories) => {
    let total = inventories.reduce((acc, item) => {
      return acc + getPrice(item.inventory) * item.quantity;
    }, 0);
    return total;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await OrderServices.getOrderByCode(orderId);
        console.log("order", response);
        if (response && response.code) {
          router.push(`/orders/${response.code}`);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await CartServices.getInventoryFromCartByShopId(
          cartId,
          shopId
        );
        console.log("inventories", response.data);
        setInventories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (cartId && shopId) {
      fetchInventory();
    }
  }, [cartId, shopId]);

  useEffect(() => {
    const fetchShippingRates = async () => {
      try {
        const data = await ShippingServices.getShippingRates(shopId, {
          cityId: address.city,
          districtId: address.district,
        });
        console.log("shipping rates", data.data);
        setShippingRates(data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (address) {
      fetchShippingRates();
    }
  }, [address]);

  const deleteAllInventories = async () => {
    try {
      let listInventoryIds = inventories.map((item) => item.inventory_id);
      for (let i = 0; i < listInventoryIds.length; i++) {
        await deleteInventory(shopId, listInventoryIds[i]);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error("Please select an address");
      return;
    }
    if (!selectedShippingMethod) {
      toast.error("Please select a shipping method");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (inventories.length <= 0) {
      toast.error("No products in cart");
      return;
    }
    const order = {
      code: orderId || Helpers.generateOrderId(),
      user_id: cartId,
      shop_id: shopId,
      payment_method: selectedPaymentMethod,
      shipping_address: address,
      shipping_fee: selectedShippingMethod.fee,

      order_items: inventories.map((item) => {
        return {
          inventory_id: item.inventory_id,
          product_id: item.product._id,
          quantity: item.quantity,
          price: item.inventory.price,
        };
      }),
    };

    try {
      const response = await OrderServices.placeOrder(order);
      console.log("order response", response);
      if (response.status === "failed") {
        if (response.message === "Inventory is out of stock") {
          toast.error("The product is out of stock");
          return;
        }
        toast.error("The product is out of stock");
        return;
      } else if (response.status === "success") {
        deleteAllInventories();
        toast.success("Order placed successfully");
        if (selectedPaymentMethod === "MOMO" && response.payment) {
          // Redirect to MOMO payment page
          console.log("payUrl", response.payment.payUrl);
          window.location.href = response.payment.payUrl;
          return;
        } else if (selectedPaymentMethod === "COD") {
          router.push(`/orders/${response.order}`);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to place order");
    }
  };

  const renderProductVariants = (inventoryId) => {
    const inventory = inventories.find(
      (item) => item.inventory_id === inventoryId
    );
    const product = inventory.product;
    const is_has_many_classifications = product.is_has_many_classifications;
    if (is_has_many_classifications) {
      const classification_main_id = product.classifications[0]._id;
      const classification_main_name =
        product.classifications[0].classification_name;
      const classification_sub_id = product.classifications[1]._id;
      const classification_sub_name =
        product.classifications[1].classification_name;

      const classification_main_item = product.classifications[0].items.find(
        (item) => item._id === inventory.inventory.classification_main_id
      );

      const classification_sub_item = product.classifications[1].items.find(
        (item) => item._id === inventory.inventory.classification_sub_id
      );

      if (product.classifications.length === 1) {
        return `Variants: ${classification_main_name}: ${classification_main_item.item_name}`;
      } else if (product.classifications.length === 2) {
        return `Variants: ${classification_main_name}: ${classification_main_item.item_name}, ${classification_sub_name}: ${classification_sub_item.item_name}`;
      }
    } else {
      return "";
    }
  };

  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Checkout">
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mb-40">
                <h1 className="heading-2 mb-10">Checkout</h1>
                <div className="d-flex justify-content-between">
                  <h6 className="text-body">
                    Carefully check the information before checkout
                  </h6>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Address selection block */}
              <AddressComponent setAddress={setAddress} />

              <div className="col-lg-12">
                <div className="border p-40 cart-totals ml-30 mb-50">
                  <div className="d-flex align-items-end justify-content-between mb-30">
                    <h5>Your Order</h5>
                  </div>
                  <div className="divider-2 mb-30"></div>
                  <div className="table-responsive order_table">
                    {inventories?.length <= 0 && "No Products"}
                    <table
                      className={
                        inventories?.length > 0 ? "table no-border" : "d-none"
                      }
                    >
                      <tbody>
                        {inventories?.map((item, i) => (
                          <tr key={i}>
                            <td className="image product-thumbnail">
                              <Link
                                href={`/products/${item.product.product_slug}`}
                              >
                                <img
                                  src={item?.product?.images[0]?.url}
                                  alt="#"
                                />
                              </Link>
                            </td>
                            <td>
                              <h6 className=" mb-5">
                                <Link
                                  href={`/products/${item.product.product_slug}`}
                                >
                                  {item.product.product_name}
                                </Link>
                                <p className=" font-sm">
                                  {renderProductVariants(item.inventory_id)}
                                  {isFlashSaleOngoing(item.inventory) && (
                                    <Badge pill bg="danger">
                                      Flash Sale
                                    </Badge>
                                  )}
                                </p>
                                {/* <div className="product-rate-cover">
                                  <div className="product-rate d-inline-block">
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
                                  </span>
                                </div> */}
                              </h6>{" "}
                            </td>
                            <td>
                              <h6 className="text-brand pl-20 pr-20">
                                <ProductPrice
                                  price={getPrice(item.inventory)}
                                />
                                {isFlashSaleOngoing(item.inventory) && (
                                  <p className="text-muted">
                                    <del>
                                      <ProductPrice
                                        price={item.inventory.price}
                                      />
                                    </del>
                                  </p>
                                )}
                              </h6>
                            </td>
                            <td>
                              <h6 className="text-muted pl-20 pr-20">
                                x {item.quantity}
                              </h6>
                            </td>
                            <td>
                              <h4 className="text-brand">
                                <ProductPrice
                                  price={
                                    item.quantity * getPrice(item.inventory)
                                  }
                                />
                              </h4>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bt-1 border-color-1 mt-30 mb-30"></div>

                  {/* Shipping method */}
                  <div className="row">
                    <div className="payment_method col-md-6">
                      <div className="mb-25">
                        <h5>Shipping Method</h5>
                      </div>
                      <div className="payment_option">
                        {shippingRates?.length <= 0 &&
                          "No shipping methods available"}
                        {shippingRates?.map((item, i) => (
                          <div
                            className="custome-radio"
                            key={"shipping_method" + i}
                          >
                            <input
                              className="form-check-input"
                              required=""
                              type="radio"
                              name="shipping_option"
                              id={"shippingOption" + i}
                              //defaultChecked={true}
                              onChange={() =>
                                setSelectedShippingMethod({
                                  id: item._id,
                                  fee: item.total_fee,
                                })
                              }
                            />
                            {/* <img
                              src={item.carrier_logo}
                              style={{ width: "50px" }}
                              alt="#"
                              className="mr-10"
                            /> */}
                            <label
                              className="form-check-label"
                              htmlFor={"shippingOption" + i}
                              data-bs-toggle="collapse"
                              data-target="#cod"
                              aria-controls="cod"
                            >
                              {item.carrier_name} {"   "}- {"   "}Fee:{" "}
                              {item.total_fee}đ{"   "} -{"   "}
                              Expected: {item.expected}
                            </label>
                          </div>
                        ))}
                        {/* <div className="custome-radio">
                          <input
                            className="form-check-input"
                            required=""
                            type="radio"
                            name="payment_option"
                            id="vnpayOption"
                          />
                          <label
                            className="form-check-labelhandlePlaceOrder()}
                            aria-controls="vnpay"
                          >
                            VNPAY
                          </label>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="bt-1 border-color-1 mt-30 mb-30"></div>
                  <div className="row">
                    {/* Left */}
                    <div className="payment_method col-md-6">
                      <div className="mb-25">
                        <h5>Payment</h5>
                      </div>
                      <div className="payment_option">
                        <div className="custome-radio">
                          <input
                            className="form-check-input"
                            required
                            type="radio"
                            name="payment_option"
                            id="codOption"
                            defaultChecked={true}
                            onChange={() => setSelectedPaymentMethod("COD")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="codOption"
                            data-bs-toggle="collapse"
                            data-target="#cod"
                            aria-controls="cod"
                          >
                            Cash on Delivery (COD)
                          </label>
                          <div
                            className={`form-group collapse ${
                              selectedPaymentMethod === "COD" ? "show" : ""
                            }`}
                            id="cod"
                          >
                            <p className="text-muted mt-5">
                              Pay with cash upon delivery.
                            </p>
                          </div>
                        </div>
                        <div className="custome-radio">
                          <input
                            className="form-check-input"
                            required
                            type="radio"
                            name="payment_option"
                            id="momoOption"
                            onChange={() => setSelectedPaymentMethod("MOMO")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="momoOption"
                            data-bs-toggle="collapse"
                            data-target="#momo"
                            aria-controls="momo"
                          >
                            MOMO
                          </label>
                          <div
                            className={`form-group collapse ${
                              selectedPaymentMethod === "MOMO" ? "show" : ""
                            }`}
                            id="momo"
                          >
                            <p className="text-muted mt-5">
                              Pay via MOMO; you can pay with your MOMO account.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Right */}
                    <div className="col-md-6">
                      <div className="cart_totals">
                        <h5 className="mb-2">Bill Totals</h5>
                        <div className="table-responsive">
                          <table className="table">
                            <tbody>
                              <tr>
                                <td>Subtotal</td>
                                <td className="text-right">
                                  <ProductPrice
                                    price={calculateInventoryPrice(inventories)}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Shipping</td>
                                <td className="text-right">
                                  {selectedShippingMethod ? (
                                    <ProductPrice
                                      price={selectedShippingMethod.fee}
                                    />
                                  ) : (
                                    "Please select a shipping method"
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>Total</td>
                                <td className="text-right">
                                  <h4>
                                    <ProductPrice
                                      price={
                                        calculateInventoryPrice(inventories) +
                                        (selectedShippingMethod
                                          ? selectedShippingMethod.fee
                                          : 0)
                                      }
                                    />
                                  </h4>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    className="btn btn-fill-out btn-block mt-30"
                    onClick={() => {
                      handlePlaceOrder();
                    }}
                  >
                    Place Order
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
