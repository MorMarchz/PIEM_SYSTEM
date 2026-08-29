import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, CircularProgress, Alert, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TransactionForm from '../components/transactions/TransactionForm';
import api from '../services/api';

const EditTransactionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/transactions/${id}`);
        if (response.data?.success) {
          setTransaction(response.data.data);
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'ไม่พบข้อมูลรายการที่ต้องการแก้ไข';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaction();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  }

  if (error || !transaction) {
    return (
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', textAlign: 'center', bgcolor: '#1E293B' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'ไม่พบข้อมูลรายการ'}
        </Alert>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/transactions')}>
          กลับไปหน้าประวัติรายการ
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <TransactionForm mode="edit" initialData={transaction} transactionId={id} />
    </Box>
  );
};

export default EditTransactionPage;
