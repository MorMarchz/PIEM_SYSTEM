import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/SyncRounded';
import AddCircleIcon from '@mui/icons-material/AddCircleRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardRounded';
import BarChartIcon from '@mui/icons-material/BarChartRounded';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongRounded';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import SummaryCards from '../components/dashboard/SummaryCards';
import DonutChartWidget from '../components/dashboard/DonutChartWidget';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState({ categories: [], daily_trends: [] });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setIsRotating(true);
    try {
      const [summaryRes, chartsRes, transactionsRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/charts'),
        api.get('/transactions?limit=5'),
      ]);

      if (summaryRes.data?.success) setSummary(summaryRes.data.data);
      if (chartsRes.data?.success) {
        const raw = chartsRes.data.data;
        setChartData({
          categories: raw?.category_breakdown ?? [],
          daily_trends: (raw?.trend_series ?? []).map((item) => ({
            date: item.period,
            income: parseFloat(item.income) || 0,
            expense: parseFloat(item.expense) || 0,
          })),
        });
      }
      if (transactionsRes.data?.success) {
        setRecentTransactions(transactionsRes.data.data?.transactions ?? []);
      }
    } catch (err) {
      console.error('[DashboardPage]: Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRotating(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const handleUpdate = () => fetchDashboardData();
    window.addEventListener('transactionUpdated', handleUpdate);
    return () => window.removeEventListener('transactionUpdated', handleUpdate);
  }, [fetchDashboardData]);

  const currentMonthYear = new Intl.DateTimeFormat('th-TH', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <Box sx={{ pb: { xs: 4, md: 5 } }}>
      {/* Top Greeting & Control Strip */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1.5, sm: 2 },
          pt: 1,
          pb: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em', fontSize: { xs: '1.25rem', sm: '1.45rem' } }}>
              สวัสดีคุณ {user?.display_name || 'March'} 👋
            </Typography>
            <Chip
              label="Pro Vault"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.625rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                bgcolor: 'rgba(99, 102, 241, 0.15)',
                color: '#C0C1FF',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94A3B8', fontSize: { xs: '0.78rem', sm: '0.85rem' }, flexWrap: 'wrap' }}>
            <span>สรุปภาพรวมสถิติ — {currentMonthYear}</span>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#475569' }} />
            <Typography component="span" className="tabular-nums" sx={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 600 }}>
              UTC+7 Bangkok
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={fetchDashboardData}
            disabled={loading}
            fullWidth={isMobile}
            startIcon={
              <SyncIcon
                sx={{
                  fontSize: 18,
                  transform: isRotating ? 'rotate(360deg)' : 'none',
                  transition: 'transform 0.6s ease-in-out',
                }}
              />
            }
            sx={{
              height: 36,
              fontSize: '0.825rem',
              fontWeight: 600,
              bgcolor: '#131C2E',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              flex: { xs: 1, sm: 'none' },
              '&:hover': {
                bgcolor: '#182235',
                color: '#F1F5F9',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            รีเฟรชข้อมูล
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/transactions')}
            startIcon={<AddCircleIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 36,
              fontSize: '0.825rem',
              fontWeight: 600,
              flex: { xs: 1, sm: 'none' },
            }}
          >
            จัดการรายการ
          </Button>
        </Box>
      </Box>

      {/* 4 Bento KPI Metric Cards */}
      <SummaryCards summary={summary} loading={loading} />

      {/* Charts Bento Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Category Donut Card */}
        <Grid item xs={12} lg={5}>
          <DonutChartWidget categories={chartData.categories} loading={loading} />
        </Grid>

        {/* Daily/Monthly Trends Bar Chart */}
        <Grid item xs={12} lg={7}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              height: { xs: 340, md: 390 },
              bgcolor: '#131C2E',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '0.9rem', sm: '1rem' }, letterSpacing: '-0.01em' }}>
                  เปรียบเทียบรายรับ - รายจ่าย
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                  Inflow vs Outflow Cashflow Dynamics
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: '6px',
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  color: '#4EDEA3',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Cashflow
              </Box>
            </Box>

            <Box sx={{ width: '100%', height: { xs: 240, md: 280 } }}>
              {chartData.daily_trends.length === 0 ? (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <BarChartIcon sx={{ fontSize: 40, color: '#475569', opacity: 0.4, mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                    ยังไม่มีข้อมูลประวัติธุรกรรมสำหรับแสดงกราฟ
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.daily_trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(255, 255, 255, 0.07)' }}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `฿${value}`}
                    />
                    <RechartsTooltip
                      formatter={(value, name) => [
                        `฿${Number(value).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`,
                        name === 'income' ? 'รายรับ' : 'รายจ่าย',
                      ]}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: 'rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#F1F5F9',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                        fontSize: '0.75rem',
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      height={30}
                      formatter={(value) => (
                        <span style={{ color: '#94A3B8', fontSize: '0.72rem', fontWeight: 600 }}>
                          {value === 'income' ? 'รายรับ' : 'รายจ่าย'}
                        </span>
                      )}
                    />
                    <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="expense" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions Ledger */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#131C2E',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: 'rgba(99, 102, 241, 0.12)',
                color: '#C0C1FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReceiptLongIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '0.875rem', sm: '0.95rem' } }}>
                รายการธุรกรรมล่าสุด
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                Recent Ledger Feed
              </Typography>
            </Box>
          </Box>

          <Button
            size="small"
            onClick={() => navigate('/transactions')}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: '#818CF8',
              fontSize: '0.78rem',
              fontWeight: 600,
              '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' },
            }}
          >
            ดูทั้งหมด
          </Button>
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 100 }}>วันที่</TableCell>
                <TableCell sx={{ minWidth: 160 }}>ชื่อรายการ</TableCell>
                <TableCell sx={{ minWidth: 90 }}>ประเภท</TableCell>
                <TableCell sx={{ minWidth: 120 }}>หมวดหมู่</TableCell>
                <TableCell align="right" sx={{ minWidth: 120 }}>จำนวนเงิน</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} color="primary" />
                  </TableCell>
                </TableRow>
              ) : recentTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748B' }}>
                    ยังไม่มีรายการบันทึก
                  </TableCell>
                </TableRow>
              ) : (
                recentTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const formattedDate = new Date(tx.date).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  });

                  return (
                    <TableRow
                      key={tx.id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                      }}
                    >
                      <TableCell className="tabular-nums" sx={{ color: '#94A3B8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {formattedDate}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9', fontSize: '0.825rem' }}>
                          {tx.title}
                        </Typography>
                        {tx.note && (
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>
                            {tx.note}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 0.9,
                            py: 0.2,
                            borderRadius: '9999px',
                            bgcolor: isIncome ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                            color: isIncome ? '#4EDEA3' : '#FFB2B7',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: isIncome ? '#10B981' : '#F43F5E' }} />
                          {isIncome ? 'รายรับ' : 'รายจ่าย'}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                          {tx.category ? `${tx.category.icon ? tx.category.icon + ' ' : ''}${tx.category.name}` : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Typography
                          variant="body2"
                          className="tabular-nums"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            color: isIncome ? '#10B981' : '#F43F5E',
                          }}
                        >
                          {isIncome ? '+' : '-'}{parseFloat(tx.amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
