import React from 'react';
import { Grid, Paper, Box, Typography, Avatar, Skeleton, Chip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SavingsIcon from '@mui/icons-material/Savings';
import CategoryIcon from '@mui/icons-material/Category';

const SummaryCards = ({ summary = null, loading = false }) => {
  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Skeleton variant="rounded" height={130} sx={{ bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const netBalance = summary?.net_balance || 0;
  const totalIncome = summary?.total_income || 0;
  const totalExpense = summary?.total_expense || 0;
  const savingsRate = summary?.savings_rate || 0;
  const topCategory = summary?.top_expense_category;

  const cardItems = [
    {
      title: 'ยอดคงเหลือสุทธิ (Net Balance)',
      value: `${netBalance >= 0 ? '+' : ''}${netBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿`,
      subtitle: netBalance >= 0 ? 'สถานะการเงินเป็นบวก' : 'ยอดเงินติดลบ ควรระวัง',
      icon: <AccountBalanceWalletIcon fontSize="large" />,
      color: netBalance >= 0 ? '#6366F1' : '#EF4444',
      bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(30, 41, 59, 0.9) 100%)',
    },
    {
      title: 'รายรับรวม (Total Income)',
      value: `+${totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿`,
      subtitle: 'รวมจากทุกหมวดหมู่รายรับ',
      icon: <ArrowUpwardIcon fontSize="large" />,
      color: '#10B981',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(30, 41, 59, 0.9) 100%)',
    },
    {
      title: 'รายจ่ายรวม (Total Expense)',
      value: `-${totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿`,
      subtitle: 'รวมจากทุกหมวดหมู่รายจ่าย',
      icon: <ArrowDownwardIcon fontSize="large" />,
      color: '#EF4444',
      bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(30, 41, 59, 0.9) 100%)',
    },
    {
      title: 'อัตราการออม (Savings Rate)',
      value: `${savingsRate.toFixed(1)}%`,
      subtitle: topCategory ? `รายจ่ายสูงสุด: ${topCategory.name}` : 'ยังไม่มีข้อมูลรายจ่าย',
      icon: <SavingsIcon fontSize="large" />,
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(30, 41, 59, 0.9) 100%)',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardItems.map((card, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Paper
            elevation={3}
            sx={{
              p: 2.5,
              height: '100%',
              borderRadius: 3,
              background: card.bgGradient,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}>
                {card.title}
              </Typography>
              <Avatar
                sx={{
                  bgcolor: `${card.color}25`,
                  color: card.color,
                  width: 44,
                  height: 44,
                  border: `1px solid ${card.color}40`,
                }}
              >
                {card.icon}
              </Avatar>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 0.5 }}>
                {card.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', noWrap: true }}>
                {card.subtitle}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
