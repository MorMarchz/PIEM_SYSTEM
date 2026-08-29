import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import api from '../services/api';

// Icon Mapping Helper
const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'Restaurant': return <RestaurantIcon />;
    case 'DirectionsCar': return <DirectionsCarIcon />;
    case 'Home': return <HomeIcon />;
    case 'ShoppingBag': return <ShoppingBagIcon />;
    case 'SportsEsports': return <SportsEsportsIcon />;
    case 'LocalHospital': return <LocalHospitalIcon />;
    case 'School': return <SchoolIcon />;
    case 'AttachMoney': return <AttachMoneyIcon />;
    case 'TrendingUp': return <TrendingUpIcon />;
    case 'CardGiftcard': return <CardGiftcardIcon />;
    default: return <MoreHorizIcon />;
  }
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [tabValue, setTabValue] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await api.get('/categories');
        if (response.data?.success) {
          setCategories(response.data.data.categories || []);
        }
      } catch (err) {
        console.error('[CategoriesPage]: Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredCategories = categories.filter((cat) => {
    if (tabValue === 'income') return cat.type === 'income';
    if (tabValue === 'expense') return cat.type === 'expense';
    return true; // 'all'
  });

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
          หมวดหมู่การเงินมาตรฐาน
        </Typography>
        <Typography variant="body2" color="text.secondary">
          หมวดหมู่มาตรฐานสำหรับจัดกลุ่มรายการรายรับและรายจ่ายในระบบ
        </Typography>
      </Box>

      {/* Tabs Filter */}
      <Paper sx={{ mb: 3, bgcolor: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ px: 2 }}
        >
          <Tab value="all" label={`ทั้งหมด (${categories.length})`} sx={{ fontWeight: 600 }} />
          <Tab
            value="income"
            label={`หมวดหมู่รายรับ (${categories.filter((c) => c.type === 'income').length})`}
            sx={{ fontWeight: 600 }}
          />
          <Tab
            value="expense"
            label={`หมวดหมู่รายจ่าย (${categories.filter((c) => c.type === 'expense').length})`}
            sx={{ fontWeight: 600 }}
          />
        </Tabs>
      </Paper>

      {/* Category Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={44} color="primary" />
        </Box>
      ) : filteredCategories.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#1E293B', borderRadius: 3 }}>
          <CategoryIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
          <Typography variant="h6" color="text.secondary">
            ไม่พบหมวดหมู่ในประเภทนี้
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {filteredCategories.map((cat) => {
            const isIncome = cat.type === 'income';

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                <Card
                  elevation={2}
                  sx={{
                    bgcolor: '#1E293B',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 3,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: cat.color ? `${cat.color}25` : 'rgba(99, 102, 241, 0.15)',
                        color: cat.color || (isIncome ? '#10B981' : '#EF4444'),
                        width: 48,
                        height: 48,
                        border: `1px solid ${cat.color || (isIncome ? '#10B981' : '#EF4444')}40`,
                      }}
                    >
                      {getCategoryIcon(cat.icon)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#F8FAFC', noWrap: true }}>
                        {cat.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={isIncome ? 'รายรับ' : 'รายจ่าย'}
                          size="small"
                          color={isIncome ? 'success' : 'error'}
                          variant="outlined"
                          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                        />
                        {cat.is_system && (
                          <Chip
                            label="มาตรฐาน"
                            size="small"
                            sx={{ height: 22, fontSize: '0.7rem', bgcolor: 'rgba(255, 255, 255, 0.08)', color: 'text.secondary' }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default CategoriesPage;
