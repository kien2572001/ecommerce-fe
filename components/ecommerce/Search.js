import { useRouter } from "next/router";
import React, { useState } from "react";
import { useInitialDataContext } from "../../services/hooks/useInitialData";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { initialData } = useInitialDataContext();

  const handleSearch = () => {
    console.log("click");
    router.push({
      pathname: "/products",
      query: {
        search: searchTerm,
      },
    });
    setSearchTerm("");
  };

  const handleInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };
  return (
    <>
      <form>
        <select className="select-active">
          <option>All Categories</option>
          {initialData.rootCategories &&
            initialData.rootCategories.map((category) => {
              return (
                <option key={category._id}>{category.category_name}</option>
              );
            })}
        </select>
        <input
          value={searchTerm}
          onKeyDown={handleInput}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search"
        />
      </form>
    </>
  );
};

export default Search;
