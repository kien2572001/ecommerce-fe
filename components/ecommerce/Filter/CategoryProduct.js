import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";
import { useState, useEffect } from "react";
import ProductServices from "../../../services/api/product-api";
import Link from "next/link";
import { useInitialDataContext } from "../../../services/hooks/useInitialData";
const CategoryProduct = ({ updateProductCategory }) => {
  const router = useRouter();
  const cat_slug = router.query.cat;
  const { initialData } = useInitialDataContext();
  const [childCategories, setChildCategory] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (cat_slug) {
          const data = await ProductServices.fetchCategoryBySlug(cat_slug);
          //console.log("data", data);
          setChildCategory(data.child);
        } else {
          setChildCategory(initialData.rootCategories);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, [cat_slug]);

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
        {childCategories.map((category, index) => (
          <li
            key={index}
            onClick={(e) => selectCategory(e, category.category_slug)}
          >
            {/* <Link href={`/products?cat=${category.category_slug}`}>
              
            </Link> */}
            <span className="ml-20">{category.category_name}</span>
            {/* <span className="count">{category.total_products}</span> */}
          </li>
        ))}
        {/* <li onClick={(e) => selectCategory(e, "")}>
          <a>All</a>
        </li>
        <li onClick={(e) => selectCategory(e, "jeans")}>
          <a>
            <img src="/assets/imgs/theme/icons/category-1.svg" alt="nest" />
            Milks & Dairies
          </a>
          <span className="count">30</span>
        </li>
        <li onClick={(e) => selectCategory(e, "shoe")}>
          <a>
            <img src="/assets/imgs/theme/icons/category-2.svg" alt="nest" />
            Clothing
          </a>
          <span className="count">35</span>
        </li>
        <li onClick={(e) => selectCategory(e, "jacket")}>
          <a>
            <img src="/assets/imgs/theme/icons/category-3.svg" alt="nest" />
            Pet Foods{" "}
          </a>
          <span className="count">42</span>
        </li> */}
      </ul>
    </>
  );
};

export default connect(null, { updateProductCategory })(CategoryProduct);
