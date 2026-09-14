import React from 'react';
import { Grid, Paper, Box, Typography, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownIcon from '@mui/icons-material/TrendingDownRounded';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ReceiptIcon from '@mui/icons-material/ReceiptRounded';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded';
import PieChartIcon from '@mui/icons-material/PieChartRounded';

const SummaryCards = ({ summary = null, loading = false }) => {
  if (loading) {
    return (
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item}>
            <Skeleton variant="rounded" height={140} sx={{ bgcolor: '#131C2E', borderRadius: '14px' }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const netBalance = summary?.net_balance || 0;
  const totalIncome = summary?.total_income || 0;
  const totalExpense = summary?.total_expense || 0;
  const totalTransactions = summary?.total_transactions || 0;
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

  const cardItems = [
    {
      title: 'รายรับรวม (Total Income)',
      value: `+${totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`,
      currency: '฿',
      accentColor: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.12)',
      icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
      deltaText: '+12.5%',
      deltaSub: 'เปรียบเทียบเดือนก่อน',
      deltaPositive: true,
    },
    {
      title: 'รายจ่ายรวม (Total Expense)',
      value: `-${totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`,
      currency: '฿',
      accentColor: '#F43F5E',
      bgColor: 'rgba(244, 63, 94, 0.12)',
      icon: <TrendingDownIcon sx={{ fontSize: 20 }} />,
      deltaText: '-4.2%',
      deltaSub: 'ควบคุมค่าใช้จ่ายได้ดี',
      deltaPositive: false,
    },
    {
      title: 'คงเหลือสุทธิ (Net Balance)',
      value: `${netBalance >= 0 ? '+' : ''}${netBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`,
      currency: '฿',
      accentColor: netBalance >= 0 ? '#6366F1' : '#F43F5E',
      bgColor: netBalance >= 0 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(244, 63, 94, 0.15)',
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />,
      deltaText: `${savingsRate}%`,
      deltaSub: 'อัตราคงเหลือสภาพคล่อง',
      deltaIcon: <PieChartIcon sx={{ fontSize: 13 }} />,
    },
    {
      title: 'จำนวนรายการ (Transactions)',
      value: `${totalTransactions}`,
      currency: 'รายการ',
      accentColor: '#C0C1FF',
      bgColor: 'rgba(192, 193, 255, 0.12)',
      icon: <ReceiptIcon sx={{ fontSize: 20 }} />,
      deltaText: 'ซิงค์อัตโนมัติ',
      deltaSub: 'อัปเดตล่าสุดวันนี้',
      isSync: true,
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {cardItems.map((card, idx) => (
        <Grid item xs={12} sm={6} lg={3} key={idx}>
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              bgcolor: '#131C2E',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '14px',
              p: 2.5,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                boxShadow: `0 8px 24px -4px rgba(0,0,0,0.5), 0 0 20px -4px ${card.accentColor}25, inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
              },
            }}
          >
            {/* Left Accent Stripe */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                bgcolor: card.accentColor,
                borderTopLeftRadius: '14px',
                borderBottomLeftRadius: '14px',
              }}
            />

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.78rem' }}>
                {card.title}
              </Typography>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  bgcolor: card.bgColor,
                  color: card.accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </Box>
            </Box>

            {/* Metric Value */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="h4"
                className="tabular-nums"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.65rem',
                  letterSpacing: '-0.025em',
                  color: card.accentColor,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 0.75,
                }}
              >
                {card.value}
                <Typography component="span" sx={{ fontSize: '0.95rem', fontWeight: 500, color: '#64748B' }}>
                  {card.currency}
                </Typography>
              </Typography>
            </Box>

            {/* Footer Delta Pill */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1,
                  py: 0.25,
                  borderRadius: '6px',
                  bgcolor: card.bgColor,
                  color: card.accentColor,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                {card.isSync ? (
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                ) : card.deltaIcon ? (
                  card.deltaIcon
                ) : card.deltaPositive ? (
                  <ArrowUpwardIcon sx={{ fontSize: 12 }} />
                ) : (
                  <ArrowDownwardIcon sx={{ fontSize: 12 }} />
                )}
                <span>{card.deltaText}</span>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                {card.deltaSub}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
