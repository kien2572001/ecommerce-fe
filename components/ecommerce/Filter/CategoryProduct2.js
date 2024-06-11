import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";
import { useInitialDataContext } from "../../../services/hooks/useInitialData";

const CategoryProduct2 = ({ updateProductCategory }) => {
  const router = useRouter();
  const { initialData } = useInitialDataContext();

  // const removeSearchTerm = () => {
  //     router.push({
  //         pathname: "/products",
  //     });
  // };

  const selectCategory = (e, category) => {
    e.preventDefault();
    // removeSearchTerm();
    updateProductCategory(category);
    router.push({
      pathname: "/products",
      query: {
        cat: category, //
      },
    });
  };
  return (
    <>
      <ul>
        {initialData.rootCategories &&
          initialData.rootCategories.map((category, index) => {
            if (index % 2 === 0) {
              return (
                <li
                  key={category._id}
                  onClick={(e) => selectCategory(e, category.category_slug)}
                >
                  <a>
                    <img
                      src={
                        category.category_thumb ||
                        "/assets/imgs/theme/icons/category-1.svg"
                      }
                      alt="nest"
                    />
                    {category.category_name}
                  </a>
                </li>
              );
            }
          })}
      </ul>
      <ul className="end">
        {initialData.rootCategories &&
          initialData.rootCategories.map((category, index) => {
            if (index % 2 === 1) {
              return (
                <li
                  key={category._id}
                  onClick={(e) => selectCategory(e, category.category_slug)}
                >
                  <a>
                    <img
                      src={
                        category.category_thumb ||
                        "/assets/imgs/theme/icons/category-1.svg"
                      }
                      alt="nest"
                    />
                    {category.category_name}
                  </a>
                </li>
              );
            }
          })}
      </ul>

      {/* <ul className="end">
        <li onClick={(e) => selectCategory(e, "jeans")}>
          <a>
            <img src="/assets/imgs/theme/icons/category-1.svg" alt="nest" />
            Milks & Dairies
          </a>
        </li>
        <li onClick={(e) => selectCategory(e, "shoe")}>
          <a>
            <img src="/assets/imgs/theme/icons/category-2.svg" alt="nest" />
            Clothing
          </a>
        </li>
        <li onClick={(e) => selectCategory(e, "jacket")}>
          <a>
            <img src="/assets/imgs/theme/icons/category-3.svg" alt="nest" />
            Pet Foods{" "}
          </a>
        </li>
        <li onClick={(e) => selectCategory(e, "trousers")}>
          <a>
            <img src="/assets/imgs/theme/icons/category-4.svg" alt="nest" />
            Baking material
          </a>
        </li>
        <li onClick={(e) => selectCategory(e, "accessories")}>
          <a>
            <img src="/assets/imgs/theme/icons/category-5.svg" alt="nest" />
            Fresh Fruit
          </a>
        </li>
      </ul> */}
    </>
  );
};

export default connect(null, { updateProductCategory })(CategoryProduct2);
