import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1', // Indigo Accent
      light: '#C0C1FF',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981', // Inflow / Emerald Green
      light: '#4EDEA3',
      dark: '#059669',
      contrastText: '#002113',
    },
    error: {
      main: '#F43F5E', // Outflow / Rose Red
      light: '#FFB2B7',
      dark: '#E11D48',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#8083FF',
      light: '#C0C1FF',
      dark: '#494BD6',
    },
    background: {
      default: '#080C14', // Canvas Floor
      paper: '#131C2E',   // Card Surface Level 2
      lowest: '#0A0E16',  // Sidebar / Base surface
      container: '#182235',
      high: '#222D42',
      highest: '#2D3B54',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      disabled: '#475569',
    },
    divider: 'rgba(255, 255, 255, 0.07)',
  },
  typography: {
    fontFamily: ['Inter', 'Outfit', 'Noto Sans Thai', '-apple-system', 'sans-serif'].join(','),
    h1: { fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '-0.015em' },
    h4: { fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontFamily: 'Inter, sans-serif', fontWeight: 600 },
    subtitle1: { fontFamily: 'Inter, sans-serif', fontWeight: 500 },
    subtitle2: { fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.85rem' },
    body1: { fontFamily: 'Inter, sans-serif', fontSize: '0.925rem', lineHeight: 1.5 },
    body2: { fontFamily: 'Inter, sans-serif', fontSize: '0.825rem', lineHeight: 1.45 },
    button: { textTransform: 'none', fontWeight: 600, fontFamily: 'Inter, sans-serif' },
    caption: { fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#080C14',
          color: '#F1F5F9',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#131C2E',
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#131C2E',
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          padding: '7px 16px',
          boxShadow: 'none',
          textTransform: 'none',
          transition: 'all 0.15s ease-in-out',
        },
        containedPrimary: {
          backgroundColor: '#6366F1',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)',
          '&:hover': {
            backgroundColor: '#4F46E5',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.5)',
          },
        },
        containedSecondary: {
          backgroundColor: '#10B981',
          color: '#002113',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#059669',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          color: '#F1F5F9',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#0A0E16',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.08)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.18)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#6366F1',
            borderWidth: 1.5,
            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
          },
        },
        input: {
          padding: '10px 14px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F172A',
          backgroundImage: 'none',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.8)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          padding: '12px 16px',
        },
        head: {
          backgroundColor: '#0A0E16',
          color: '#94A3B8',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0A0E16',
          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(8, 12, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default theme;
