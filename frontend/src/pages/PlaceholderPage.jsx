import React from 'react';
import { Box, Paper, Typography, Button, Grid, Chip } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

const PlaceholderPage = ({ title = 'หน้าเพจ', description = 'ส่วนนี้กำลังอยู่ในขั้นตอนการพัฒนาตามแผนงาน' }) => {
  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <Paper sx={{ p: 4, textAlign: 'center', my: 2, background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<ConstructionIcon />}
            label="Phase Ready Foundation"
            color="primary"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#F8FAFC' }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 3 }}>
          {description}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2, textAlign: 'left' }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
              <Typography variant="h6" color="primary.light" sx={{ mb: 1 }}>
                Layout Standard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                โครงสร้าง Responsive Drawer และ Navigation Bar พร้อมใช้งาน 100%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
              <Typography variant="h6" color="success.light" sx={{ mb: 1 }}>
                MUI 5 Theme System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                กำหนดชุดสี Dark Mode, Glassmorphism Cards และ Fonts เรียบร้อยแล้ว
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
              <Typography variant="h6" color="secondary.light" sx={{ mb: 1 }}>
                Protected Routing
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ระบบจัดการเส้นทางย่อยผ่านการเชื่อมต่อ Protected Route ครบถ้วน
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PlaceholderPage;
