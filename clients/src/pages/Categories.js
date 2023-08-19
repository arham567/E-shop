import React from "react";
import useCategory from "../hook/useCategory";
import Layout from "./../components/Layout/Layout";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Catagories"}>
      <div className="text-center">
        <h1>All Categories</h1>
      </div>
      <div className="container">
        <div className="row">
          {categories.map((c) => (
            <div className="col-md-6 mt-5 mb-3 gs-4 gy-4">
              <Link to={`/categories/${c.slug}`} className="btn btn-primary">
                {c.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
