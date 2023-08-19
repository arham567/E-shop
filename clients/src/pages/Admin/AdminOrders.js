import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import toast from "react-hot-toast";
const {Option} = Select

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();



  // get all ordered Products

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/all-orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

// Updating order Status
  const handleChange = async (orderId , value) => {
    try {
      const {data} = await  axios.put(`${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,{status:value})
      getOrders()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Layout title={"All - Orders"}>
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <div className="col-md-9">
                <h1 className="text-center">Manage Orders</h1>
                {/* ALL  Orders */}
                {orders?.map((o, i) => {
                  return (
                    <div className="border shadow">

                      {/* ORDER MAPPING -----START */}

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
                            <td>
                                <Select bordered={false} onChange={(value)=>handleChange(o._id , value)} defaultValue={o.status} >
                                      {status.map((s,i)=>(<Option key={i} value={s}>{s}</Option>))}
                                </Select>
                            </td>
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
                      {/* end of order maping */}

                      <h1 className="text-center mt-3">Selling Product</h1>

                      {/* Maping Product ----START */}
                      <div className="d-flex flex-wrap">
                        {o?.products?.map((p) => (
                          <div
                            className="card m-2"
                            style={{ width: "18rem" }}
                            key={p._id}
                          >
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
                      {/* end of product mapping */}

                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AdminOrders;
