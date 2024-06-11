class OrderServices {
  static instance = null;

  constructor() {
    if (OrderServices.instance) {
      throw new Error("Singleton class, Use OrderServices.getInstance()");
    }
    this.baseUrl = "http://localhost:8041/public/order";
    OrderServices.instance = this;
  }

  static getInstance() {
    if (!OrderServices.instance) {
      return new OrderServices();
    }
    return OrderServices.instance;
  }

  async placeOrder(order) {
    try {
      const response = await fetch(`${this.baseUrl}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify(order),
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

  async getOrderByCode(code) {
    try {
      const response = await fetch(`${this.baseUrl}/${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

export default OrderServices.getInstance();
