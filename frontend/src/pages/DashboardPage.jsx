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
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
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
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState({ categories: [], daily_trends: [] });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, chartsRes, transactionsRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/charts'),
        api.get('/transactions?limit=5'),
      ]);

      if (summaryRes.data?.success) setSummary(summaryRes.data.data);
      if (chartsRes.data?.success) setChartData(chartsRes.data.data);
      if (transactionsRes.data?.success) setRecentTransactions(transactionsRes.data.data.transactions || []);
    } catch (err) {
      console.error('[DashboardPage]: Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
            สวัสดีคุณ, {user?.display_name || 'ผู้ใช้งาน'} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            สรุปภาพรวมสถิติทางการเงิน รายรับ-รายจ่ายของคุณ
          </Typography>
        </Box>

        <Tooltip title="อัปเดตข้อมูลล่าสุด">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchDashboardData}
            disabled={loading}
            sx={{ borderRadius: 2.5 }}
          >
            รีเฟรชข้อมูล
          </Button>
        </Tooltip>
      </Box>

      {/* Summary KPI Cards */}
      <SummaryCards summary={summary} loading={loading} />

      {/* Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Category Donut Chart */}
        <Grid item xs={12} md={5}>
          <DonutChartWidget categories={chartData.categories} loading={loading} />
        </Grid>

        {/* Daily/Monthly Trends Bar Chart */}
        <Grid item xs={12} md={7}>
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
              <BarChartIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                แนวโน้มรายรับ - รายจ่าย
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <CircularProgress size={36} color="primary" />
              </Box>
            ) : chartData.daily_trends.length === 0 ? (
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <BarChartIcon sx={{ fontSize: 54, color: 'text.secondary', opacity: 0.4, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  ยังไม่มีข้อมูลเปรียบเทียบแนวโน้ม
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, width: '100%', minHeight: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.daily_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <RechartsTooltip
                      formatter={(val) => [`${val.toLocaleString('th-TH')} ฿`]}
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
                      formatter={(val) => <span style={{ color: '#CBD5E1', fontSize: '0.825rem' }}>{val === 'income' ? 'รายรับ' : 'รายจ่าย'}</span>}
                    />
                    <Bar dataKey="income" name="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions Widget Table */}
      <Paper sx={{ p: 3, bgcolor: '#1E293B', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptLongIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
              รายการล่าสุด (5 รายการแรก)
            </Typography>
          </Box>
          <Button
            size="small"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/transactions')}
            sx={{ fontWeight: 600 }}
          >
            ดูทั้งหมด
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} color="primary" />
          </Box>
        ) : recentTransactions.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              ยังไม่มีรายการการเงินล่าสุด กดเพิ่มรายการใหม่เพื่อเริ่มต้นบันทึก
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>วันที่</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>ชื่อรายการ</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>หมวดหมู่</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>จำนวนเงิน</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTransactions.map((row) => {
                  const isIncome = row.type === 'income';
                  return (
                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ color: '#F8FAFC' }}>
                        {new Date(row.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#F8FAFC' }}>{row.title}</TableCell>
                      <TableCell>
                        {row.category ? (
                          <Chip label={row.category.name} size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#F8FAFC' }} />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700, color: isIncome ? 'success.main' : 'error.main' }}>
                          {isIncome ? '+' : '-'}{row.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardPage;
