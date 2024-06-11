"use client";

import React from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from "../../components/layout/Layout";
import { server } from "../../config/index";
import { findProductIndex } from "../../util/util";
import { useState, useEffect } from "react";
import ProductServices from "../../services/api/product-api";
import { useRouter } from "next/router";

// const ProductId = ({ product }) => {
const ProductId = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await ProductServices.fetchProductBySlug(
        "Small-Wooden-Table-1717412772339"
      );
      setProduct(data);
      console.log(data);
    };
    fetchProduct();
  }, []);
  return (
    <>
      <Layout
        parent="Home"
        sub="Shop"
        subChild={product?.title || "HHEHEHEHEHEHE"}
      >
        <div className="container">
          <ProductDetails product={product} />
        </div>
      </Layout>
    </>
  );
};

ProductId.getInitialProps = async (params) => {
  const request = await fetch(`${server}/static/product.json`);
  const data = await request.json();

  const index = findProductIndex(data, params.query.slug);

  return { product: data[index] };
};

export default ProductId;
