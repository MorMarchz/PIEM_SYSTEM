import React from 'react';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import PieChartIcon from '@mui/icons-material/PieChartRounded';

const PRECISION_COLORS = ['#6366F1', '#10B981', '#F43F5E', '#F59E0B', '#8083FF', '#4EDEA3', '#FF516A', '#38BDF8'];

const DonutChartWidget = ({ categories = [], loading = false }) => {
  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: 3, height: 380, bgcolor: '#131C2E', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
        <Skeleton variant="text" width={180} height={28} sx={{ mb: 2 }} />
        <Skeleton variant="circular" width={180} height={180} sx={{ mx: 'auto', my: 2 }} />
      </Paper>
    );
  }

  const chartData = categories.map((cat, idx) => ({
    name: cat.name || 'ไม่ระบุหมวดหมู่',
    value: parseFloat(cat.total_amount) || 0,
    color: cat.color || PRECISION_COLORS[idx % PRECISION_COLORS.length],
  }));

  const totalSum = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const hasData = totalSum > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: 390,
        bgcolor: '#131C2E',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '1rem', letterSpacing: '-0.01em' }}>
            สัดส่วนหมวดหมู่
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
            Category Distribution Overview
          </Typography>
        </Box>
        <Box
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: '6px',
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            color: '#C0C1FF',
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Proportion
        </Box>
      </Box>

      {!hasData ? (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <PieChartIcon sx={{ fontSize: 48, color: '#475569', opacity: 0.5, mb: 1 }} />
          <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
            ยังไม่มีข้อมูลสัดส่วนรายจ่าย
          </Typography>
        </Box>
      ) : (
        <Box sx={{ position: 'relative', width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`฿${Number(value).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`, 'จำนวนเงิน']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#F1F5F9',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  fontSize: '0.8rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Stat Display */}
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              รวมรายจ่าย
            </Typography>
            <Typography variant="subtitle2" className="tabular-nums" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.9rem' }}>
              ฿{totalSum.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Dynamic Legend Badges */}
      {hasData && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
          {chartData.slice(0, 4).map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1,
                py: 0.4,
                borderRadius: '6px',
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem', fontWeight: 500 }}>
                {item.name}
              </Typography>
              <Typography variant="caption" className="tabular-nums" sx={{ color: '#F1F5F9', fontSize: '0.72rem', fontWeight: 600 }}>
                {totalSum > 0 ? `${((item.value / totalSum) * 100).toFixed(0)}%` : '0%'}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default DonutChartWidget;
