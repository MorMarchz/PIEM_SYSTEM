import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  CircularProgress,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
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
  const [loading, setLoading] = useState(true);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/reports/summary?month=${selectedMonth}`);
      if (response.data?.success) {
        setReportData(response.data.data);
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

  const totalIncome = reportData?.total_income || 0;
  const totalExpense = reportData?.total_expense || 0;
  const netBalance = reportData?.net_balance || 0;
  const savingsRate = reportData?.savings_rate || 0;
  const categoryBreakdown = reportData?.category_breakdown || [];
  const trends = reportData?.trends || [];

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* Header & Month Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
            รายงานและสถิติทางการเงิน
          </Typography>
          <Typography variant="body2" color="text.secondary">
            สรุปสถิติเชิงลึก อัตราการออม และสัดส่วนหมวดหมู่รายเดือน
          </Typography>
        </Box>

        <Paper sx={{ p: 1, px: 2, bgcolor: '#1E293B', borderRadius: 2.5, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FilterAltIcon color="primary" fontSize="small" />
            <TextField
              type="month"
              size="small"
              label="เลือกเดือนประจำรายงาน"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 170 }}
            />
          </Box>
        </Paper>
      </Box>

      {/* Monthly KPI Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, bgcolor: '#1E293B', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              รายรับประจำเดือน
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#10B981', mt: 0.5 }}>
              +{totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, bgcolor: '#1E293B', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              รายจ่ายประจำเดือน
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#EF4444', mt: 0.5 }}>
              -{totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, bgcolor: '#1E293B', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              เงินคงเหลือประจำเดือน
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: netBalance >= 0 ? '#6366F1' : '#EF4444', mt: 0.5 }}>
              {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, bgcolor: '#1E293B', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              อัตราการออมประจำเดือน (Savings Rate)
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#F59E0B', mt: 0.5 }}>
              {savingsRate.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Grid Content: Chart & Breakdown Table */}
      <Grid container spacing={3}>
        {/* Trend Bar Chart */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3, height: 420, bgcolor: '#1E293B', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AssessmentIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                เปรียบเทียบรายรับ-รายจ่าย รายวันประจำเดือน {selectedMonth}
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <CircularProgress size={40} color="primary" />
              </Box>
            ) : trends.length === 0 ? (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  ไม่มีข้อมูลธุรกรรมในเดือนที่เลือก
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, width: '100%', minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <RechartsTooltip
                      formatter={(val) => [`${val.toLocaleString('th-TH')} ฿`]}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#F8FAFC',
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                    <Bar dataKey="income" name="รายรับ" fill="#10B981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="expense" name="รายจ่าย" fill="#EF4444" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Category Breakdown Table */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, height: 420, bgcolor: '#1E293B', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 2 }}>
              สัดส่วนรายจ่ายแยกตามหมวดหมู่
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={36} color="primary" />
              </Box>
            ) : categoryBreakdown.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  ไม่มีข้อมูลรายจ่ายประจำเดือนนี้
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>หมวดหมู่</TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>จำนวนเงิน</TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>สัดส่วน (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryBreakdown.map((cat, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                          {cat.name}
                          <Box sx={{ width: '100%', mt: 0.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(cat.percentage || 0, 100)}
                              sx={{
                                height: 5,
                                borderRadius: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: cat.color || '#EF4444',
                                },
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#EF4444', fontWeight: 700 }}>
                          -{parseFloat(cat.total_amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={`${(cat.percentage || 0).toFixed(1)}%`} size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontWeight: 600 }} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;
