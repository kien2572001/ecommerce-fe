import React, { createContext, useState, useEffect } from "react";
import ProductServices from "../api/product-api";
import CartServices from "../api/cart-api";
import { useAuth } from "../hooks/useAuth";
// Tạo Context
const InitialDataContext = createContext({});

// Tạo Provider
const InitialDataProvider = ({ children }) => {
  const { user } = useAuth();
  // Khởi tạo state để lưu trữ dữ liệu khởi tạo
  const [initialData, setInitialData] = useState({
    rootCategories: [],
    cart: [],
  });

  useEffect(() => {
    console.log("InitialDataProvider: ", initialData);
  }, [initialData]);

  useEffect(() => {
    const fetchRootCategories = async () => {
      try {
        const response = await ProductServices.fetchRootCategories();
        //console.log("fetchRootCategories: ", response);
        setInitialData({ ...initialData, rootCategories: response.items });
      } catch (error) {
        console.log(error);
      }
    };
    //Get root categories
    fetchRootCategories();
  }, []);

  const fetchCart = async (userId) => {
    try {
      const response = await CartServices.getOrCreatedCart(userId);
      setInitialData({ ...initialData, cart: response.data });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchCart(user._id);
    } else {
      setInitialData({ ...initialData, cart: [] });
    }
  }, [user]);

  const refreshCart = () => {
    if (user && user._id) {
      fetchCart(user._id);
    }
  };

  const updateInventory = (inventoryId, quantity, shopId, productId) => {
    //console.log("cartId: ", initialData.cart.id);
    CartServices.updateInventoryToCart(
      initialData.cart.id,
      inventoryId,
      quantity,
      productId,
      shopId
    )
      .then((response) => {
        console.log("updateInventoryToCart: ");
        let inventoryFound = false;
        const newCart = initialData.cart.items.map((item) => {
          if (item.shop._id === shopId) {
            const inventories = item.inventories.map((inventory) => {
              if (inventory.inventory_id === inventoryId) {
                inventory.quantity = quantity;
                inventoryFound = true;
              }
              return inventory;
            });
            item.inventories = inventories;
          }
          return item;
        });
        // Nếu không tìm thấy inventory thì fetch lại giỏ hàng
        if (!inventoryFound) {
          fetchCart(user._id);
        } else {
          setInitialData({
            ...initialData,
            cart: { items: newCart, id: initialData.cart.id },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteInventory = (shopId, inventoryId) => {
    CartServices.removeInventoryFromCart(initialData.cart.id, inventoryId)
      .then((response) => {
        console.log("deleteInventoryFromCart: ", response);

        // Tạo bản sao mới của giỏ hàng để tránh tham chiếu trực tiếp
        const newCart = initialData.cart.items
          .map((item) => {
            if (item.shop._id === shopId) {
              // Lọc bỏ các inventories không cần thiết
              const inventories = item.inventories.filter(
                (inventory) => inventory.inventory_id !== inventoryId
              );
              return { ...item, inventories };
            }
            return item;
          })
          .filter((item) => item.inventories.length > 0); // Loại bỏ các item có inventories trống

        // Cập nhật lại state của initialData
        setInitialData((prevData) => ({
          ...prevData,
          cart: { items: newCart, id: prevData.cart.id },
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const productVariant = (inventoryId, shopId) => {
    const cart = initialData.cart.items.find(
      (item) => item.shop._id === shopId
    );
    const inventory = cart.inventories.find(
      (inventory) => inventory.inventory_id === inventoryId
    );
    const product = inventory.product;
    if (product.is_has_many_classifications) {
      const classification_main_name =
        product.classifications[0].classification_name;
      const classification_sub_name =
        product.classifications[1].classification_name;
      const classification_main_id = inventory.inventory.classification_main_id;
      const classification_sub_id = inventory.inventory.classification_sub_id;

      const classification_main = product.classifications[0].items.find(
        (item) => item._id === classification_main_id
      );

      if (product.classifications.length === 1) {
        return (
          "Variant: " +
          classification_main_name +
          ":" +
          classification_main.item_name
        );
      } else if (product.classifications.length === 2) {
        const classification_sub = product.classifications[1].items.find(
          (item) => item._id === classification_sub_id
        );
        return (
          "Variant: " +
          classification_main_name +
          ":" +
          classification_main.item_name +
          ", " +
          classification_sub_name +
          ":" +
          classification_sub.item_name
        );
      }
    } else {
      return "";
    }
  };

  // Hàm để cập nhật dữ liệu khởi tạo
  const updateInitialData = (newData) => {
    setInitialData(newData);
  };

  // Trả về Provider với giá trị là initialData và hàm updateInitialData
  return (
    <InitialDataContext.Provider
      value={{
        initialData,
        updateInitialData,
        updateInventory,
        deleteInventory,
        productVariant,
      }}
    >
      {children}
    </InitialDataContext.Provider>
  );
};

export { InitialDataContext, InitialDataProvider };
