class UserServices {
  static instance = null;

  constructor() {
    if (UserServices.instance) {
      throw new Error("Singleton class, Use UserServices.getInstance()");
    }
    //this.baseUrl = process.env.BACKEND_URL + "/user-service";
    //this.baseUrl = "http://localhost:8011";
    this.baseUrl = process.env.USER_SERVICE_URL;
    UserServices.instance = this;
  }

  static getInstance() {
    if (!UserServices.instance) {
      return new UserServices();
    }
    return UserServices.instance;
  }

  async fetchUserByListId(listId, includes) {
    try {
      const response = await fetch(`${this.baseUrl}/user/by-list-ids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
        body: JSON.stringify({ ids: listId, includes }),
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

  async fetchMyProfile() {
    const token = localStorage.getItem("ACCESS_TOKEN");
    try {
      const response = await fetch(`${this.baseUrl}/user/my-profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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

  async fetchShopById(shopId) {
    try {
      const response = await fetch(`${this.baseUrl}/public/shop/id/${shopId}`, {
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

  async updateAddressByUserId(userId, address) {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
        body: JSON.stringify(address),
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

export default UserServices.getInstance();
