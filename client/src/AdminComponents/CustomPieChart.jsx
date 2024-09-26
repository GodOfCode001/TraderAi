import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import './customPieChart.css'
const COLORS = ['#0088FE', '#FFBB28', '#00C49F']; // Blue, Yellow, Green
const pieData = [
  { name: 'Blue', value: 600 },
  { name: 'Yellow', value: 400 },
  { name: 'Green', value: 300 },
];

const CustomPieChart = () => {
  return (
    <div className="pie-charts">
      <PieChart width={400} height={400}>
        <Pie
          data={pieData}
          cx={200}
          cy={130}
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="top"
         height={36}           
         layout="horizontal"
          align="center"
          wrapperStyle={{ marginBottom: -20 }} 
          // Move legend closer to the pie chart
          />
      </PieChart>
    </div>
  );
};

export default CustomPieChart;
