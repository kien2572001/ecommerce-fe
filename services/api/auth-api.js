class AuthServices {
  static instance = null;

  constructor() {
    if (AuthServices.instance) {
      throw new Error("Singleton class, Use AuthServices.getInstance()");
    }
    //this.baseUrl = process.env.BACKEND_URL + "/auth-service";
    this.baseUrl = "http://localhost:8011/auth";
    AuthServices.instance = this;
  }

  static getInstance() {
    if (!AuthServices.instance) {
      return new AuthServices();
    }
    return AuthServices.instance;
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
        body: JSON.stringify({ email, password }),
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
}

export default AuthServices.getInstance();
