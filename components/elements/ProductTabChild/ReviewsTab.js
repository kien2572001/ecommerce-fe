import { useState, useEffect } from "react";
import ProductServices from "../../../services/api/product-api";
import UserServices from "../../../services/api/user-api";
import usePagination from "../../../services/hooks/usePagination";

const ReviewsTab = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const {
    page,
    limit,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setTotalPages,
    setPageNumber,
  } = usePagination(1, 6);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await ProductServices.fetchReviewsByProductId(product._id, {
        page,
      });
      const reviews = data.docs;
      const listUsers = reviews.map((review) => review.user_id);
      const users = await UserServices.fetchUserByListId(listUsers, [
        "_id",
        "display_name",
        "avatar",
        "created_at",
      ]);
      reviews.forEach((review) => {
        const user = users.find((user) => user._id === review.user_id);
        review.user = user;
      });
      setReviews(data.docs);
      setPageNumber(data.page);
      setTotalPages(data.totalPages);
    };
    if (product && product._id) {
      fetchReviews();
    }
  }, [product, page, totalPages]);

  return (
    <div>
      <div className="comments-area">
        <h4 className="mb-30">Product Ratings</h4>
        <div className="comment-list pb-0">
          {reviews?.map((review, index) => (
            <div
              className="single-comment justify-content-between d-flex"
              key={review._id}
            >
              <div className="user justify-content-between d-flex">
                <div className="thumb text-center">
                  {/* <img src="/assets/imgs/blog/author-3.png" alt="nest" /> */}
                  <img
                    src={review.user.avatar}
                    alt={review.user.display_name}
                  />
                  {/* <h6>
                    <a>Ana Rosie</a>
                  </h6> */}
                  {/* <p className="font-xxs">Since 2008</p> */}
                </div>
                <div className="desc">
                  <div className="">
                    <h6>
                      <a>{review.user.display_name}</a>
                    </h6>
                  </div>
                  <div className="product-rate d-inline-block">
                    <div
                      className="product-rating"
                      style={{
                        width: `${review.rating * 20}%`, // Tính toán độ rộng dựa trên rating
                      }}
                    ></div>
                  </div>
                  <p>{review.comment}</p>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="font-xs mr-30 font-weight-bold">
                        {new Date(review.created_at).toLocaleTimeString()}
                        {" - "}
                        {new Date(review.created_at).toLocaleDateString(
                          "en-GB"
                        )}
                      </div>
                      {/* <a href="#" className="text-brand btn-reply">
                        Reply
                        <i className="fi-rs-arrow-right"></i>
                      </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="pagination-area">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li className="page-item">
                  <a className="page-link" onClick={goToPreviousPage}>
                    <i className="fi-rs-arrow-small-left"></i>
                  </a>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                    key={i}
                  >
                    <a
                      className="page-link"
                      onClick={() => setPageNumber(i + 1)}
                    >
                      {i + 1}
                    </a>
                  </li>
                ))}
                <li className="page-item">
                  <a className="page-link" onClick={goToNextPage}>
                    <i className="fi-rs-arrow-small-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <div className="comment-form">
        <h4 className="mb-15">Leave a Comment</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <input className="form-control" placeholder="Name" type="text" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <input className="form-control" placeholder="Email" type="text" />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Website"
                type="text"
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <textarea
                className="form-control"
                placeholder="Comment"
                rows="5"
              ></textarea>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <button className="btn btn-submit" type="submit">
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsTab;
