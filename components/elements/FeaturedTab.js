import SingleProduct from "../ecommerce/SingleProduct";
import ProductServices from "../../services/api/product-api";

const FeaturedTab = ({ products }) => {
  const showItem = 10;
  return (
    <>
      {products.slice(0, showItem).map((product, i) => (
        <div className="col-lg-1-5 col-md-4 col-12 col-sm-6" key={i}>
          <SingleProduct product={product} />
        </div>
      ))}
    </>
  );
};

export default FeaturedTab;
