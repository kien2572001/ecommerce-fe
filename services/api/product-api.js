class ProductServices {
  static instance = null;

  constructor() {
    if (ProductServices.instance) {
      throw new Error("Singleton class, Use ProductServices.getInstance()");
    }
    //this.baseUrl = process.env.BACKEND_URL + "/product-service";
    this.baseUrl = "http://localhost:8021";
    ProductServices.instance = this;
  }

  static getInstance() {
    if (!ProductServices.instance) {
      return new ProductServices();
    }
    return ProductServices.instance;
  }

  async fetchProductInHomePage(
    page,
    limit,
    keyword = "",
    category_slug,
    {
      trending = false,
      popular = false,
      newArrival = false,
      priceRange = null,
      priceOrder = null,
    }
  ) {
    try {
      const response = await fetch(
        `${this.baseUrl}/public/product/homepage?` +
          new URLSearchParams({
            page,
            limit,
            keyword,
            category_slug,
            trending,
            popular,
            newArrival,
            priceRange: priceRange ? JSON.stringify(priceRange) : null,
            priceOrder,
          }),

        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message, error.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error; // Re-throw for handling in components
    }
  }

  async fetchProductBySlug(slug) {
    try {
      const response = await fetch(
        `${this.baseUrl}/public/product/slug/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message, error.status);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error; // Re-throw for handling in components
    }
  }

  async fetchRootCategories() {
    try {
      const response = await fetch(
        `${this.baseUrl}/public/category/root-list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message, error.status);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error; // Re-throw for handling in components
    }
  }

  async fetchCategoryBySlug(slug) {
    try {
      const response = await fetch(
        `${this.baseUrl}/public/category/slug/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message, error.status);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error; // Re-throw for handling in components
    }
  }

  async fetchReviewsByProductId(
    productId,
    options = {
      page: 1,
      newest: false,
      hasImages: false,
      rating: null,
    }
  ) {
    try {
      // Tạo query string từ các tùy chọn
      const queryParams = new URLSearchParams(options).toString();
      const url = `${this.baseUrl}/private/review/product/${productId}?${queryParams}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message, error.status);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error; // Re-throw for handling in components
    }
  }
}

export default ProductServices.getInstance();
