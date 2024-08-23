import { ChangeEvent, MouseEvent, ReactNode, useState } from 'react';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import MuiCard, { CardProps } from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import themeConfig from 'src/configs/themeConfig';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { EyeOffOutline, EyeOutline } from 'mdi-material-ui';
import { parseCookies } from 'nookies';

interface State {
  username: string;
  password: string;
  showPassword: boolean;
}

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}));

const LoginPage = () => {
  const [values, setValues] = useState<State>({
    username: '',
    password: '',
    showPassword: false
  });
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { username, password } = values;

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        router.push('/');
      } else {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      }

    } catch (error) {
      console.error('Erro no processo de login:', error);
      setError('Erro no processo de login. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              👜 Bem Vindo ao {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='caption' sx={{ marginBottom: 1 }}>
              O software para pequenos comerciantes!
            </Typography>
          </Box>
          <Typography variant='body2' sx={{ marginBottom: 2 }}>
            Por favor insira seu Usuário e sua Senha abaixo!
          </Typography>
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField
              autoFocus
              fullWidth
              id='username'
              label='Nome de usuário'
              value={values.username}
              onChange={handleChange('username')}
              sx={{ marginBottom: 4 }}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Senha</InputLabel>
              <OutlinedInput
                id='auth-login-password'
                label='Password'
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {error && (
              <Typography
                style={{
                  marginTop: '15px',
                  padding: 5,
                  backgroundColor: '#F1F1F1',
                  borderRadius: '6px',
                }}
                color='#DD0000'
              >
                {error}
              </Typography>
            )}
            <Divider sx={{ margin: 5 }} />
            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} type='submit'>
              Acessar
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;