import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  LinearProgress,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownloadRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownIcon from '@mui/icons-material/TrendingDownRounded';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import VerifiedIcon from '@mui/icons-material/VerifiedRounded';
import NorthEastIcon from '@mui/icons-material/NorthEastRounded';
import SouthEastIcon from '@mui/icons-material/SouthEastRounded';
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
import api from '../services/api';

const ReportsPage = () => {
  const currentMonthStr = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [reportData, setReportData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const [year, month] = selectedMonth.split('-');
      const start_date = `${year}-${month}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      const end_date = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

      const [reportRes, chartRes] = await Promise.all([
        api.get(`/reports/summary?start_date=${start_date}&end_date=${end_date}`),
        api.get(`/dashboard/charts?start_date=${start_date}&end_date=${end_date}&view=daily`),
      ]);

      if (reportRes.data?.success) {
        setReportData(reportRes.data.data);
      }

      if (chartRes.data?.success) {
        const raw = chartRes.data.data?.trend_series ?? [];
        setTrends(raw.map((item) => ({
          date: item.period,
          income: parseFloat(item.income) || 0,
          expense: parseFloat(item.expense) || 0,
        })));
      }
    } catch (err) {
      console.error('[ReportsPage]: Failed to fetch report:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const totalIncome = reportData?.summary?.total_income || 0;
  const totalExpense = reportData?.summary?.total_expense || 0;
  const netBalance = reportData?.summary?.net_balance || 0;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((netBalance / totalIncome) * 100)).toFixed(1) : 0;
  const expenseBreakdown = reportData?.expense_breakdown || [];

  return (
    <Box sx={{ pb: { xs: 4, md: 6 } }}>
      {/* Header & Month Filter Controls */}
      <Box sx={{ pt: 1, pb: 2.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ px: 1, py: 0.25, borderRadius: '6px', bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#C0C1FF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Financial Analytics
            </Box>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#475569' }} />
            <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, fontSize: '0.72rem' }}>
              ประจำรอบบัญชีเดือน
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '1.25rem', sm: '1.45rem' }, letterSpacing: '-0.02em' }}>
            รายงานสรุปทางการเงิน
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
            สถิติเชิงลึก อัตราการออม และการวิเคราะห์สัดส่วนหมวดหมู่ประจำเดือน
          </Typography>
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
          <TextField
            type="month"
            size="small"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{
              width: { xs: '100%', sm: 170 },
              bgcolor: '#131C2E',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                bgcolor: '#131C2E',
                borderColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.print()}
            startIcon={<FileDownloadIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 36,
              fontSize: '0.825rem',
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            ส่งออกรายงาน PDF
          </Button>
        </Box>
      </Box>

      {/* 4 Summary Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* 1. รายรับทั้งหมด */}
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: '#131C2E',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  รายรับทั้งหมด
                </Typography>
                <Typography variant="h5" className="tabular-nums" sx={{ fontWeight: 700, color: '#10B981', mt: 0.5, fontSize: { xs: '1.25rem', sm: '1.45rem' } }}>
                  +{totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })} <Typography component="span" sx={{ fontSize: '0.8rem', color: '#4EDEA3' }}>฿</Typography>
                </Typography>
              </Box>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 20 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, color: '#10B981', fontSize: '0.7rem', fontWeight: 600 }}>
              <NorthEastIcon sx={{ fontSize: 13 }} />
              <span>กระแสเงินสดขาเข้าทั้งหมด</span>
            </Box>
          </Paper>
        </Grid>

        {/* 2. รายจ่ายทั้งหมด */}
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: '#131C2E',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  รายจ่ายทั้งหมด
                </Typography>
                <Typography variant="h5" className="tabular-nums" sx={{ fontWeight: 700, color: '#F43F5E', mt: 0.5, fontSize: { xs: '1.25rem', sm: '1.45rem' } }}>
                  -{totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })} <Typography component="span" sx={{ fontSize: '0.8rem', color: '#FFB2B7' }}>฿</Typography>
                </Typography>
              </Box>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: 'rgba(244, 63, 94, 0.12)', color: '#F43F5E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingDownIcon sx={{ fontSize: 20 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, color: '#F43F5E', fontSize: '0.7rem', fontWeight: 600 }}>
              <SouthEastIcon sx={{ fontSize: 13 }} />
              <span>กระแสเงินสดขาออกทั้งหมด</span>
            </Box>
          </Paper>
        </Grid>

        {/* 3. เงินคงเหลือสุทธิ */}
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: '#131C2E',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  เงินคงเหลือสุทธิ
                </Typography>
                <Typography variant="h5" className="tabular-nums" sx={{ fontWeight: 700, color: netBalance >= 0 ? '#6366F1' : '#F43F5E', mt: 0.5, fontSize: { xs: '1.25rem', sm: '1.45rem' } }}>
                  {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })} <Typography component="span" sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>฿</Typography>
                </Typography>
              </Box>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                สภาพคล่องพร้อมจัดสรร
              </Typography>
              <Box sx={{ px: 0.75, py: 0.1, borderRadius: '4px', bgcolor: '#222D42', color: '#C0C1FF', fontSize: '0.625rem', fontWeight: 700 }}>
                {netBalance >= 0 ? 'NET POSITIVE' : 'NET DEFICIT'}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* 4. อัตราการออม */}
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: '#131C2E',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                อัตราการออม (Savings)
              </Typography>
              <Typography variant="h5" className="tabular-nums" sx={{ fontWeight: 700, color: '#10B981', mt: 0.5, fontSize: { xs: '1.25rem', sm: '1.45rem' } }}>
                {savingsRate}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#4EDEA3', fontSize: '0.7rem', fontWeight: 600 }}>
                {parseFloat(savingsRate) >= 50 ? 'ยอดเยี่ยม (Grade A+)' : 'ระดับมาตรฐาน'}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VerifiedIcon sx={{ fontSize: 22 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Comparison Daily Trend Chart & Category Breakdown Bento */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Daily Comparison Bar Chart */}
        <Grid item xs={12} lg={7}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              height: { xs: 340, md: 420 },
              bgcolor: '#131C2E',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '0.9rem', sm: '1rem' }, letterSpacing: '-0.01em' }}>
                  เปรียบเทียบรายรับ-รายจ่าย รายวัน
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                  Daily Inflow vs Outflow Dynamics ({selectedMonth})
                </Typography>
              </Box>
              <Box sx={{ px: 1, py: 0.25, borderRadius: '6px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#C0C1FF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Daily Trend
              </Box>
            </Box>

            <Box sx={{ width: '100%', height: { xs: 240, md: 320 } }}>
              {trends.length === 0 ? (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                    ไม่มีข้อมูลธุรกรรมในเดือนที่เลือก
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                      tickFormatter={(v) => `฿${v}`}
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

        {/* Expense Breakdown List Card */}
        <Grid item xs={12} lg={5}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              height: { xs: 'auto', md: 420 },
              minHeight: 280,
              bgcolor: '#131C2E',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '0.9rem', sm: '1rem' }, letterSpacing: '-0.01em' }}>
                  สัดส่วนรายจ่ายตามหมวดหมู่
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                  Expense Category Allocation
                </Typography>
              </Box>
              <Box sx={{ px: 1, py: 0.25, borderRadius: '6px', bgcolor: 'rgba(244, 63, 94, 0.1)', color: '#FFB2B7', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Distribution
              </Box>
            </Box>

            {expenseBreakdown.length === 0 ? (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                  ไม่มีข้อมูลรายจ่ายในเดือนที่เลือก
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>
                {expenseBreakdown.map((item, index) => {
                  const percentage = totalExpense > 0 ? ((item.total_amount / totalExpense) * 100).toFixed(1) : 0;
                  return (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9', fontSize: '0.825rem' }}>
                          {item.icon ? `${item.icon} ` : ''}{item.category_name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" className="tabular-nums" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                            {percentage}%
                          </Typography>
                          <Typography variant="body2" className="tabular-nums" sx={{ fontWeight: 700, color: '#F43F5E', fontSize: '0.825rem' }}>
                            ฿{parseFloat(item.total_amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={parseFloat(percentage)}
                        sx={{
                          height: 5,
                          borderRadius: '3px',
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: '3px',
                            bgcolor: '#F43F5E',
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;
