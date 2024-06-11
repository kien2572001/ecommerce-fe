class ShippingServices {
  static instance = null;

  constructor() {
    if (ShippingServices.instance) {
      throw new Error("Singleton class, Use ShippingServices.getInstance()");
    }
    this.baseUrl = "http://localhost:8011/address";
    ShippingServices.instance = this;
  }

  static getInstance() {
    if (!ShippingServices.instance) {
      return new ShippingServices();
    }
    return ShippingServices.instance;
  }

  async getShippingRates(shopId, addressTo) {
    try {
      const response = await fetch(`${this.baseUrl}/rates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify({
          shopId: shopId,
          addressTo: addressTo,
        }),
      });

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

  async parseAddress(city, district, ward) {
    try {
      const response = await fetch(`${this.baseUrl}/parse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
        body: JSON.stringify({
          cityId: city,
          districtId: district,
          wardId: ward,
        }),
      });
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

  async getCities() {
    try {
      const response = await fetch(`${this.baseUrl}/cities`, {
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
      return data;
    } catch (error) {
      throw error; // Re-throw for handling in components
    }
  }

  async getDistricts(cityId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/cities/${cityId}/districts`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

  async getWards(districtId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/districts/${districtId}/wards`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

export default ShippingServices.getInstance();
