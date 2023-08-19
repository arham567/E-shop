import Layout from "../components/Layout/Layout";
import React, { useState , useEffect } from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast  from "react-hot-toast";

const CartPage = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken , setClientToken] = useState("")
  const [loading , setLoading] =  useState(false)
  const [instance , setInstance] = useState("")

  // total Price
  const totalPrice = () => {
    try {
      let total = 0;
      // eslint-disable-next-line 
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };
  // delete from cart
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(myCart));
      setCart(myCart);
    } catch (error) {
      console.log(error);
    }
  };

  // get Payment Gateway Token
  const getToken = async () => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`)
      setClientToken(data?.clientToken)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    getToken()
  } , [auth?.token])

  // handle payment
  const handlePayment = async () =>{
    setLoading(true)
    const {nonce} = await instance.requestPaymentMethod();
    // eslint-disable-next-line
    const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,{nonce,cart})
    setLoading(false)
    localStorage.removeItem('cart')
    setCart([]);
    navigate('/dashboard/user/orders')
    toast.success("Payment Successful")
  }


  return (
    <Layout>
      <div className="container">
        <h1 className="text-center bg-light p-3">
          {`Hello ${auth?.token && auth?.user?.name}`}
        </h1>
        <h4 className="text-center">
          {cart?.length > 0
            ? `You have ${cart.length} items in your cart ${
                auth?.token ? " " : "please login to checkout"
              }`
            : "Your cart is empty"}
        </h4>

        <div className="row">
          <div className="col-md-9">
            {cart?.map((p) => (
              <div key={p._id}
                className="row mt-4 mb-2 p-2"
                style={{
                  border: "2px solid black",
                  borderRadius: "10px",
                  backgroundColor: "#e5e1e145",
                }}
              >
                <div className="col-md-4">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    style={{
                      height: "200px",
                      border: "2px solid black",
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <p>Name : {p.name}</p>
                  <p>Price : $ {p.price}</p>
                  <p>Description :{p.description.substring(0, 30)}...</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    {" "}
                    Remove{" "}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-3">
            <h4>Cart Summary</h4>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h4>{auth?.user?.address}</h4>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => {
                      navigate("/dashboard/user/profile");
                    }}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => {
                      navigate("/dashboard/user/profile");
                    }}
                  >
                    Add Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      navigate("/login",{state:"/cart"});
                    }}
                  >
                    Please Login
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              {
                !clientToken || !cart?.length ? (""):(
                  <>
                  <DropIn
              options={{
                authorization : clientToken ,
                paypal : {flow:"vault"}
              }}
              onInstance={instance => setInstance(instance)}
              />
              <button className="btn btn-primary" 
              onClick={handlePayment}
              >{
                loading ? "Processing" : "Make Payment"
              }</button>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
