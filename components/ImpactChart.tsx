import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Home page "Business Impact" chart, in its own file so Recharts loads as a
// separate chunk (React.lazy in pages/Home.tsx) instead of in the main bundle.
const data = [
  { name: 'Traditional IT', efficiency: 40, cost: 100 },
  { name: 'Nixsoft Ops', efficiency: 95, cost: 60 },
];

// initialDimension avoids Recharts' "width(-1)/height(-1)" warning on the
// first render, before the container is measured.
const ImpactChart: React.FC = () => (
  <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 480, height: 288 }}>
    <BarChart
      data={data}
      layout="vertical"
      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      barSize={32}
    >
      <XAxis type="number" hide />
      <YAxis
        dataKey="name"
        type="category"
        width={100}
        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
        interval={0}
      />
      <Tooltip
        cursor={{ fill: 'transparent' }}
        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
      />
      <Bar dataKey="efficiency" name="Deployment Speed" fill="#39FF14" radius={[0, 4, 4, 0]} animationDuration={1500} />
      <Bar dataKey="cost" name="Cost Savings" fill="#0A4A8F" radius={[0, 4, 4, 0]} animationDuration={1500} />
    </BarChart>
  </ResponsiveContainer>
);

export default ImpactChart;
