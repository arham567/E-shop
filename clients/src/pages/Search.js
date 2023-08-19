import React from 'react'
import Layout from "./../components/Layout/Layout";
import { useSearch } from '../context/search';
import { useCart } from '../context/cart';
import  toast  from "react-hot-toast";

const Search = () => {
  // eslint-disable-next-line
    const [values,setValues] = useSearch()
    const [cart,setCart] = useCart()
  return (
    <Layout>
        <div className="container">
            <div className="text-center">
                <h1>Search Results</h1>
                <h6>{values?.results.length<1 ? "NO PRODUCT FOUND" : `FOUND ${values?.results.length}`}</h6>
                <div className="d-flex flex-wrap">
            {values?.results.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  style={{height:"200px"}}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <h6 className="card-text"> $ {p.price}</h6>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <button class="btn btn-primary ms-1">More Details</button>
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
  )
}

export default Search
