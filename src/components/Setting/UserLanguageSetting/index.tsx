import { Box, Button, createTheme, FormControl, ListItem, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { UserLanguageSettingCss } from './styles';
import i18n from '@lang/index';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select/Select';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import FormHelperText from '@mui/material/FormHelperText/FormHelperText';
import { useDispatch } from 'react-redux';
import { languageChangeAction } from '@store/language';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true; // removes the `xs` breakpoint
    sm: true;
    md: true;
    lg: true;
    xl: true;
    fullhd: true; // adds the `tablet` breakpoint
    laptop: true;
    desktop: true;
    fourk: true;
  }
};

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      fourk: 1921,
      laptop: 361,
      fullhd: 1281,
      desktop: 641,
    },
  },
});

const UserLanguageSetting = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const languageChnageButton = useCallback((event:any)=> {
        i18n.changeLanguage(event.target.value);
        localStorage.setItem('lang',event.target.value);
        dispatch(languageChangeAction(event.target.value))
    },[])

  return (
    <ThemeProvider theme={theme}>
    <UserLanguageSettingCss>
      <Box className="languageBox">
        <Box className="language" component={Paper}>
            {/* <select style={{width : '100%'}} name="lang" id="lang" onChange={languageChnageButton}>
                <option value="">선택해주세요</option>
                <option value="ko">{t('TID02814')}</option>
                <option value="en">{t('TID02818')}</option>
                <option value="zh">{t('TID02815')}</option>
                <option value="vi">{t('TID02817')}</option>
            </select> */}
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label" sx={{margin : '20px'}}>language</InputLabel>
            <Select 
              sx={{
                width : '100%',
                backgroundColor : 'white',
              }}
              label="lang"
              // labelId='demo-simple-select-label'
              className='languageselect'
              name="lang"
              onChange={languageChnageButton}
              displayEmpty
              inputProps={{ 'aria-label' : 'Without label' }}
            >            
              <MenuItem value="ko">{t('TID02814')}</MenuItem>
              <MenuItem value="en">{t('TID02818')}</MenuItem>
              <MenuItem value="zh">{t('TID02815')}</MenuItem>
              <MenuItem value="vi">{t('TID02817')}</MenuItem>
            </Select>
            </FormControl>
        </Box>
      </Box>
    </UserLanguageSettingCss>
    </ThemeProvider>
  );
};

export default UserLanguageSetting;
