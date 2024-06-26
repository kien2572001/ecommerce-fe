import React, { useState, useEffect } from "react";
import { useAuth } from "../../../services/hooks/useAuth";
import OrderServices from "../../../services/api/order-api";
import usePagination from "../../../services/hooks/usePagination";
import Pagination from "../../ecommerce/Pagination";
import ProductPrice from "../../ecommerce/ProductPrice";
import Link from "next/link";
import moment from "moment";
import { Badge } from "react-bootstrap";
import OrderStatusEnum from "../../../enums/OrderStatus";
const OrdersTab = () => {
  const { user } = useAuth();
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
  const [orders, setOrders] = useState([]);
  const [pageArray, setPageArray] = useState([]);

  const getBadgeVariant = (status) => {
    switch (status) {
      case OrderStatusEnum.PENDING:
        return "secondary";
      case OrderStatusEnum.PLACED:
        return "primary";
      case OrderStatusEnum.FAILED:
        return "danger";
      case OrderStatusEnum.PAID:
        return "success";
      case OrderStatusEnum.CONFIRMED:
        return "info"; // Ví dụ: màu info cho trạng thái confirmed
      case OrderStatusEnum.SHIPPING_CREATED:
        return "warning"; // Ví dụ: màu warning cho trạng thái shipping_created
      case OrderStatusEnum.DELIVERED:
        return "dark"; // Ví dụ: màu dark cho trạng thái delivered
      case OrderStatusEnum.CANCELLED:
        return "secondary"; // Ví dụ: màu secondary cho trạng thái cancelled
      case OrderStatusEnum.DONE:
        return "success"; // Ví dụ: màu success cho trạng thái done
      default:
        return "secondary"; // Mặc định trả về màu secondary nếu không khớp với bất kỳ trạng thái nào
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await OrderServices.getOrdersByUserId(
          user._id,
          page,
          limit
        );
        console.log(orders);
        setOrders(orders.docs);
        setTotalPages(orders.totalPages);
        setPageArray(getPagesArray(orders.totalPages));
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user, page, limit]);

  function getPagesArray(totalPages) {
    const arr = Array.from({ length: totalPages }, (_, i) => i + 1);
    return arr;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="mb-0">Your Orders</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.code}>
                  <td>{order.code}</td>
                  <td>
                    {moment(order.created_at).format("MMMM DD, YYYY HH:mm")}
                  </td>
                  <td>
                    <Badge
                      pill
                      bg={getBadgeVariant(order.status)}
                      //style={{ fontSize: "20px" }}
                    >
                      {order.status?.toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <ProductPrice price={order.total} />
                  </td>
                  <td>
                    <Link
                      href={`/orders/${order.code}`}
                      className="btn-small d-block"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {/* <tr>
                <td>#1357</td>
                <td>March 45, 2020</td>
                <td>Processing</td>
                <td>$125.00 for 2 item</td>
                <td>
                  <a href="#" className="btn-small d-block">
                    View
                  </a>
                </td>
              </tr>
              <tr>
                <td>#2468</td>
                <td>June 29, 2020</td>
                <td>Completed</td>
                <td>$364.00 for 5 item</td>
                <td>
                  <a href="#" className="btn-small d-block">
                    View
                  </a>
                </td>
              </tr>
              <tr>
                <td>#2366</td>
                <td>August 02, 2020</td>
                <td>Completed</td>
                <td>$280.00 for 3 item</td>
                <td>
                  <a href="#" className="btn-small d-block">
                    View
                  </a>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
        {orders?.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
