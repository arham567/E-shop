import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import { useCart } from "../context/cart"
import  toast  from "react-hot-toast";


const ProductsDetails = () => {

  const [cart,setCart] = useCart()
  const params = useParams();
  const navigate = useNavigate()
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);

  // initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
    // eslint-disable-next-line
  }, [params?.slug]);

  // get Product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  // get Product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProduct(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="row container mt-5">
        <div className="col-md-6">
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            style={{ height: "400px" }}
          />
        </div>
        <div className="col-md-6">
          <div className="text-center">
            <h1>Product Details</h1>
          </div>
          <h4>Name : {product.name}</h4>
          <h4>Price : $ {product.price}</h4>
          <h4>Quantity : {product.quantity}</h4>
          <h4>Category : {product?.category?.name}</h4>
          <h4>Description : </h4>
          <p>{product.description}</p>
          <button className="btn btn-secondary ms-1" onClick={()=>{
                    setCart([...cart,product])
                    toast.success('item added to cart')
                    }}>ADD TO CART</button>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="text-center mt-3">
          <h3>Similar Products</h3>
          {relatedProduct?.length < 1 && (
            <p className="text-center">No Similar Product Found</p>
          )}
          <div className="d-flex flex-wrap">
            {relatedProduct?.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  style={{ height: "200px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <h6 className="card-text"> $ {p.price}</h6>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <button className="btn btn-primary ms-1" onClick={()=>navigate(`/product/${p.slug}`)}>More Details</button>
                  <button className="btn btn-secondary ms-1" onClick={()=>{
                    setCart([...cart,p])
                    localStorage.setItem('cart', JSON.stringify([...cart,p]))
                    toast.success('item added to cart')
                    }}>ADD TO CART</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsDetails;
