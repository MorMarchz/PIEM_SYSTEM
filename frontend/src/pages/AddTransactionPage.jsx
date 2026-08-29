import React from 'react';
import { Box } from '@mui/material';
import TransactionForm from '../components/transactions/TransactionForm';

const AddTransactionPage = () => {
  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <TransactionForm mode="create" />
    </Box>
  );
};

export default AddTransactionPage;
