import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts';
import './adminCharts.css'
import { BsThreeDots } from "react-icons/bs";
import CustomPieChart from './CustomPieChart';

const AdminCharts = () => {

    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];

      const pie = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
      ];
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className='admin-charts'>
      <div className="admin-charts-container">

        <div className="left">
            <div className="header">
                <p>Deposit / Withdraw Overview</p>
                <div className="icon">
                <BsThreeDots className='icon'/>
                </div>
            </div>
            <div className="charts">

            <ResponsiveContainer width="100%" height="100%" className="res">
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
          <XAxis dataKey="name" />
          <YAxis />
          {/* <Tooltip content={<CustomTooltip />} /> */}
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8"/>
          <Bar dataKey="uv" fill="#82ca9d"/>
        </BarChart>
      </ResponsiveContainer>
            </div>
        </div>

        <div className="right">
        <div className="header">
                <p>Trending Products</p>
                <div className="icon">
                <BsThreeDots className='icon'/>
                </div>
            </div>
            
            <div className="charts">

                <CustomPieChart />

            {/* <PieChart width={800} height={400}>
        <Pie
          data={pie}
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {pie.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart> */}
            </div>
        </div>

      </div>
    </div>
  )
}

export default AdminCharts

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
          <p className="text-medium text-lg">{label}</p>
          <p className="text-sm text-blue-400">
            user:
            <span className="ml-2">${payload[0].value}</span>
          </p>
          <p className="text-sm text-indigo-400">
            Profit:
            <span className="ml-2">${payload[1].value}</span>
          </p>
        </div>
      );
    }
  };
