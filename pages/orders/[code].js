"use client";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import OrderServices from "../../services/api/order-api";
import Layout from "../../components/layout/Layout";
import AddressComponent from "../../components/ecommerce/AddressComponent";
import ProductPrice from "../../components/ecommerce/ProductPrice";
import NotificationModal from "../../components/elements/NotificationModal";
import { Badge } from "react-bootstrap";

export default function OrderDetail() {
  const router = useRouter();
  const { code } = router.query;
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    const socket = io("http://localhost:8051");

    // Tham gia vào phòng cụ thể
    socket.emit("joinOrderRoom", code);

    // Lắng nghe sự kiện cập nhật trạng thái đơn hàng từ phòng cụ thể
    socket.on("orderStatusUpdated", (data) => {
      console.log("Order status updated:", data);
      if (data.room === `order:${code}`) {
        console.log("Order status updated:", data);
        // Hiển thị thông báo
        if (data.status === "paid") {
          setModalMessage("Order payment successful");
          setIsSuccess(true);
          setShowModal(true);
          setIsSuccess(true);
        }
        setStatus(data.status);
      }
    });

    // Cleanup kết nối khi component unmount
    return () => {
      socket.disconnect();
    };
  }, [code]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await OrderServices.getOrderByCode(code);
        console.log(order);
        setOrder(order);
        setStatus(order.status);
      } catch (error) {
        console.error(error);
      }
    };
    if (code) {
      fetchOrder();
    }
  }, [code]);

  const calculateInventoryPrice = (inventories = []) => {
    if (!inventories) return 0;
    let total = inventories.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    return total;
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

  const getBadgeVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "PLACED":
        return "primary";
      case "FAILED":
        return "danger";
      case "SUCCESS":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Checkout">
        <section className="mt-50 mb-50">
          <NotificationModal
            show={showModal}
            onHide={() => setShowModal(false)}
            message={modalMessage}
            isSuccess={isSuccess}
          />

          <div className="container">
            <div className="row">
              <div className="col-lg-8 mb-40">
                <h1 className="heading-2 mb-10">Order Detail</h1>
              </div>
            </div>

            <div className="row">
              {/* Address selection block */}
              <div className="col-lg-12">
                <div className="border p-40 cart-totals ml-30 mb-50">
                  <div className="d-flex align-items-end justify-content-between mb-30">
                    <h5>Order Details</h5>
                  </div>

                  <div className="divider-2 mb-30"></div>
                  <div>
                    {/* Order code */}
                    <div className="mb-10">
                      <h5
                        className="d-inline "
                        style={{
                          color: "black",
                        }}
                      >
                        Order Code:{" "}
                      </h5>
                      <span
                        className=""
                        style={{
                          fontSize: "20px",
                        }}
                      >
                        {order?.code}
                      </span>
                    </div>
                    {/* Address */}
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      className="mb-10"
                    >
                      {order && (
                        <p style={{ margin: 0, fontSize: "20px" }}>
                          <p></p>
                          <strong style={{ color: "black" }}>
                            {order.shipping_address?.name},{" "}
                            {order.shipping_address?.phone}
                          </strong>{" "}
                          {"  -  "}
                          {order.shipping_address?.full_address}
                        </p>
                      )}
                    </div>
                    {/* Status */}
                    <div className="mb-10">
                      <h5
                        className="d-inline "
                        style={{
                          color: "black",
                        }}
                      >
                        Status:{" "}
                      </h5>
                      <span
                        className=""
                        style={{
                          fontSize: "20px",
                        }}
                      >
                        <Badge
                          pill
                          bg={getBadgeVariant(status?.toUpperCase())}
                          //style={{ fontSize: "20px" }}
                        >
                          {status?.toUpperCase()}
                        </Badge>
                      </span>
                    </div>
                    {/* Payment method */}
                    <div className="mb-10">
                      <h5
                        className="d-inline "
                        style={{
                          color: "black",
                        }}
                      >
                        Payment Method:{" "}
                      </h5>
                      <span
                        className=""
                        style={{
                          fontSize: "20px",
                        }}
                      >
                        {order?.payment_method === "COD" ? (
                          <Badge
                            pill
                            bg="secondary"
                            //style={{ fontSize: "20px" }}
                          >
                            COD
                          </Badge>
                        ) : (
                          <Badge
                            pill
                            bg="danger"
                            //style={{ fontSize: "20px" }}
                          >
                            MOMO
                          </Badge>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="border p-40 cart-totals ml-30 mb-50">
                  <div className="d-flex align-items-end justify-content-between mb-30">
                    <h5>Your Items</h5>
                  </div>
                  <div className="divider-2 mb-30"></div>
                  <div className="table-responsive order_table">
                    {order?.order_items?.length <= 0 && "No Products"}
                    <table
                      className={
                        order?.order_items?.length > 0
                          ? "table no-border"
                          : "d-none"
                      }
                    >
                      <tbody>
                        {order?.order_items?.map((item, i) => (
                          <tr key={i}>
                            <td className="image product-thumbnail">
                              <img
                                src={item?.product?.images[0]?.url}
                                alt="#"
                              />
                            </td>
                            <td>
                              <h6 className=" mb-5">
                                <a>{item.product.product_name}</a>
                                <p className=" font-sm">
                                  {/* {renderProductVariants(item.inventory_id)} */}
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
                              <h6 className="text-muted pl-20 pr-20">
                                <ProductPrice price={item.price} />
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
                                  price={item.quantity * item.price}
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
                  {/* <div className="row">
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
                      </div>
                    </div>
                  </div> */}

                  <div className="bt-1 border-color-1 mt-30 mb-30"></div>
                  <div className="row">
                    {/* Left */}
                    <div className="payment_method col-md-6"></div>
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
                                    price={calculateInventoryPrice(
                                      order?.order_items
                                    )}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Shipping</td>
                                <td className="text-right">
                                  <ProductPrice price={order?.shipping_fee} />
                                </td>
                              </tr>
                              <tr>
                                <td>Total</td>
                                <td className="text-right">
                                  <h4>
                                    <ProductPrice
                                      price={
                                        calculateInventoryPrice(
                                          order?.order_items
                                        ) + (order?.shipping_fee || 0)
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
