import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import { Button, CssBaseline, TextField, Link, Grid, Box, Container, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import Copyright from '@utils/copyright';
import { Navigate } from 'react-router-dom';
import { Error } from '../../style/index';
import { AppDispatch } from '../../store/index';
import { setLogin } from '../../store/auth';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';
import { setAccess, setRefresh } from '@utils/JwtHelper';
const theme = createTheme();

export default function SignIn() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [logInError, setLogInError] = useState(false);
  const [logInErrorMessage, setLogInErrorMessage] = useState('');
  const [userID, onChangeUserID] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const secretKey = process.env.REACT_APP_AES_SECRET as string;
      if (
        userID === '' ||
        userID === null ||
        userID === undefined ||
        password === '' ||
        password === null ||
        password === undefined
      ) {
        alert(t('TID03056'));
        return;
      }

      // //user의 모든 권한 dispatch
      // dispatch(userAction.getUserPrivileges(userID));

      // const password = sha256(hashPassword);
      try {
        const user_id = userID;

        const response = await axios.post(
          `/api/v1/auth/login`,
          { id: user_id, password },
          {
            withCredentials: true,
          },
        );
        const user = response.data.data.user;
        const userinfo = {
          USERID: CryptoJS.AES.encrypt(JSON.stringify(user.USERID), secretKey).toString(),
          // GROUPID:CryptoJS.AES.encrypt(JSON.stringify(user.GROUPID), secretKey).toString(),
          USERNAME: CryptoJS.AES.encrypt(JSON.stringify(user.USERNAME), secretKey).toString(),
        };
        await localStorage.setItem('user', JSON.stringify(userinfo));
        await localStorage.setItem('accessToken', response.data.data.accessToken);
        await localStorage.setItem('refreshToken', response.data.data.refreshToken);
        setAccess(response.data.data.accessToken);
        setRefresh(response.data.data.refreshToken);

        setLogInError(false);
        dispatch(setLogin({ userID, loginBoolean: true }));
      } catch (error: any) {
        console.log(error);
        setLogInError(error.response?.status === 401);
        setLogInErrorMessage(error.response.data.message);
        return;
      }
      window.location.replace('/#/pacs/worklist');
    },
    [userID, password],
  );

  //user group만 조회해서 pacs의 admin인지, 전체 admin인지 판별
  if (localStorage.getItem('user')) {
    return (
      <>
        <Navigate to="/pacs/worklist" replace />
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img style={{ width: '100%' }} src={require('../../assets/logo_white.png').default} />
          <Divider sx={{ my: 1 }} />
          <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 2 }}>
            <Grid container>
              <Grid item xs={12} style={{ display: 'flex' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  sx={{ background: 'white', borderRadius: '10px' }}
                  id="userID"
                  label={t('TID00002')}
                  name="userID"
                  autoFocus={true}
                  autoComplete="off"
                  value={userID}
                  onChange={onChangeUserID}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  sx={{ background: 'white', borderRadius: '10px' }}
                  name="password"
                  label={t('TID00003')}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={onChangePassword}
                />
              </Grid>

              <Box sx={{ m: 2 }}>{logInError && <Error>{logInErrorMessage}</Error>}</Box>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: '#dd322f',
              }}
            >
              {t('TID00004')}
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
