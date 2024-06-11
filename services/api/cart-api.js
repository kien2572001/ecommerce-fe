class CartServices {
  static instance = null;

  constructor() {
    if (CartServices.instance) {
      throw new Error("Singleton class, Use CartServices.getInstance()");
    }
    //this.baseUrl = process.env.BACKEND_URL + "/auth-service";
    this.baseUrl = "http://localhost:8031";
    CartServices.instance = this;
  }

  static getInstance() {
    if (!CartServices.instance) {
      return new CartServices();
    }
    return CartServices.instance;
  }

  async getOrCreatedCart(userId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/public/cart/get-or-create-cart/${userId}`,
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

  async getInventoryFromCartByShopId(cartId, shopId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/public/cart/get-inventories-from-cart-by-shop-id/${cartId}/shop/${shopId}`,
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

  async updateInventoryToCart(
    cartId,
    inventoryId,
    quantity,
    productId,
    shopId
  ) {
    try {
      const response = await fetch(
        `${this.baseUrl}/public/cart/add-inventory-to-cart/${cartId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          },
          body: JSON.stringify({
            inventory_id: inventoryId,
            product_id: productId,
            shop_id: shopId,
            quantity,
          }),
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

  async removeInventoryFromCart(cartId, inventoryId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/public/cart/remove-inventory-from-cart/${cartId}/inventory/${inventoryId}`,
        {
          method: "DELETE",
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
}

export default CartServices.getInstance();
