import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  // get ordered Products
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);
  return (
    <Layout title={"Your Orders"}>
      <div className="container-flui p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders?.map((o, i) => {
              return (
                <div className="border shadow">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Time</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>
                          {o?.products?.map((p) => (
                            <p className="name">{p.name}</p>
                          ))}
                        </td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>
                          {o?.payment?.success ? "Successfull" : "Failed"}
                        </td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                   <h1 className="text-center mt-3">Your Ordered Products</h1> 
                  <div className="d-flex flex-wrap">
                      {o?.products?.map((p) => (
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
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

              );
            })}
          </div>
        </div>
      </div>
    </Layout>

  );
};

export default Orders;
