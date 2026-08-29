import React from 'react';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PieChartIcon from '@mui/icons-material/PieChart';

const DEFAULT_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6', '#F97316'];

const DonutChartWidget = ({ categories = [], loading = false }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 360, bgcolor: '#1E293B', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
        <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', my: 2 }} />
      </Paper>
    );
  }

  const chartData = categories.map((cat, idx) => ({
    name: cat.name || 'ไม่ระบุหมวดหมู่',
    value: parseFloat(cat.total_amount) || 0,
    color: cat.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
  }));

  const hasData = chartData.some((item) => item.value > 0);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: 380,
        bgcolor: '#1E293B',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <PieChartIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
          สัดส่วนรายจ่ายตามหมวดหมู่
        </Typography>
      </Box>

      {!hasData ? (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <PieChartIcon sx={{ fontSize: 54, color: 'text.secondary', opacity: 0.4, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            ยังไม่มีข้อมูลรายจ่ายในหมวดหมู่
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, width: '100%', minHeight: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value.toLocaleString('th-TH')} ฿`, 'จำนวนเงิน']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span style={{ color: '#CBD5E1', fontSize: '0.825rem' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

export default DonutChartWidget;
