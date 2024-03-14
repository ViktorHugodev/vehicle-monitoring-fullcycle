import { createTheme } from '@mui/material/styles'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90CAF9', // Um azul claro agradável e calmante, ótimo para uma aparência fresca e moderna
      contrastText: '#0D1B2A', // Um azul-marinho profundo para garantir uma legibilidade ótima no azul claro
    },
    secondary: {
      main: '#FFE082', // Um amarelo claro como cor secundária para complementar o azul sem competir por atenção
      contrastText: '#0D1B2A', // Azul-marinho para o texto sobre o amarelo claro, mantendo a consistência e a legibilidade
    },
    background: {
      default: '#0D1B2A', // Um azul-marinho como cor de fundo, oferecendo profundidade e complementando o azul claro
      paper: '#11263C', // Um tom ligeiramente mais claro que o fundo para elementos como cartões, para sutil diferenciação
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          minHeight: '100vh',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#90CAF9',
          color: '#0D1B2A',
        },
      },
    },
  },
})

export default defaultTheme
