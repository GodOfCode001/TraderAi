import React, { useContext, useEffect, useState } from "react";
import "./adminUserChart.css";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from 'axios'
import { AuthContext } from "../context/AuthContext";

// const data = [
//   {
//     name: "Page A",
//     // uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     // uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     // uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     // uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     // uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     // uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];




const AdminUserChart = () => {

  const [data, setData] = useState([])
  const { backend } = useContext(AuthContext)

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backend}/api/admin/get-user-charts`, {
          withCredentials: true
        });
        const formattedData = response.data.map((item) => ({
          name: months[item.month - 1],
          userCount: item.user_count,
        })).sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name));
        setData(formattedData);
        console.log(formattedData)
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
  
    fetchData();
  }, [])

  return (
    <div className="admin-user-chart">
      <div className="admin-user-chart-container">
        <div className="chart">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="userCount" fill="#8884d8" />
                {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserChart;
