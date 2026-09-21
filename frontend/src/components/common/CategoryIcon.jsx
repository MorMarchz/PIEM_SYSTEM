import React from 'react';
import { Box } from '@mui/material';

const ICON_MAP = {
  Work: '💼',
  Laptop: '💻',
  TrendingUp: '📈',
  Storefront: '🏪',
  AttachMoney: '💰',
  Restaurant: '🍔',
  DirectionsCar: '🚗',
  ShoppingBag: '🛍️',
  Home: '🏠',
  SportsEsports: '🎮',
  School: '📚',
  LocalHospital: '🏥',
  MoreHoriz: '✨',
};

/**
 * Universal CategoryIcon Component
 * Supports: Data URI (base64 images), Image URLs, Emojis, and Legacy Icon Names
 */
export const CategoryIcon = ({ icon, name = 'icon', size = '1.2rem', sx = {} }) => {
  if (!icon) {
    return <Box component="span" sx={{ fontSize: size, lineHeight: 1, ...sx }}>📁</Box>;
  }

  const isImage = typeof icon === 'string' && (
    icon.startsWith('data:image/') ||
    icon.startsWith('http://') ||
    icon.startsWith('https://') ||
    icon.startsWith('/uploads/') ||
    /\.(png|jpe?g|svg|webp|gif)$/i.test(icon)
  );

  if (isImage) {
    return (
      <Box
        component="img"
        src={icon}
        alt={name}
        sx={{
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: '4px',
          display: 'inline-block',
          verticalAlign: 'middle',
          ...sx,
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  const resolvedIcon = ICON_MAP[icon] || icon;

  return (
    <Box
      component="span"
      sx={{
        fontSize: size,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        ...sx,
      }}
    >
      {resolvedIcon}
    </Box>
  );
};

export default CategoryIcon;
