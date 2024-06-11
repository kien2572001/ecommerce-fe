const ProductPrice = ({ price }) => {
  // Sử dụng toLocaleString để định dạng giá trị price
  const formattedPrice = (price || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // Remove the currency symbol (₫) and trim any whitespace
  const priceWithoutCurrency = formattedPrice.replace(/₫/g, "").trim();

  return <span>{priceWithoutCurrency}đ</span>;
};

export default ProductPrice;
