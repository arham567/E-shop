import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import { useParams , useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useCart } from "../context/cart"
import  toast  from "react-hot-toast";

const CategoryProduct = () => {

  const params = useParams()
  const [cart,setCart] = useCart()
  const navigate = useNavigate()
  const [products,setProducts] = useState([])
  const [category,setCategory] = useState()
  
  const getProductByCat = async () => {
      try {
        const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`)
        setProducts(data?.products)
        setCategory(data?.category)
      } catch (error) {
        console.log(error)
      }
  }
  useEffect(()=>{
    if(params.slug) getProductByCat()
    // eslint-disable-next-line
  },[params?.slug])
  return (

    <Layout>
      <div className="text-center">
        <h1>{category?.name}</h1>
        <h3>{products?.length} results found</h3>
        <div className="row text-center">
        <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
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
  )
}

export default CategoryProduct
