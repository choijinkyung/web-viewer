import React, { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Button,
  createTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Divider,
} from '@mui/material';
import { UserSettingCss } from './styled';
import { useTranslation } from 'react-i18next';
import WorklistSetting from '@mobileComponents/Setting/WorklistSetting'
import UserLanguageSetting from '@mobileComponents/Setting/UserLanguageSetting'
import UserToolSetting from '@mobileComponents/Setting/UserToolSetting'
import HangingProtocolSetting from '@mobileComponents/Setting/HangingProtocolSetting'
const UserSetting = () => {
    const {t} = useTranslation();
    const [currentViewType,setCurrentViewType] = useState(t('TID01540'))

    const currentViewTypeChange = useCallback((value: any)=> {
        setCurrentViewType(value);
      },[])
  return (
    <UserSettingCss>
      <Box className="toolBox" >
        <Box className="choiceBox">
          {/* <span onClick={() => currentViewTypeChange(t('TID00009'))} className={currentViewType === t('TID00009') ? 'active' : ''}>
            {t('TID00009')}
          </span> */}
          <span onClick={() => currentViewTypeChange(t('TID01540'))} className={currentViewType === t('TID01540') ? 'active' : ''}>
          {t('TID01540')}
          </span>
          <span onClick={() => currentViewTypeChange(t('TID01667'))} className={currentViewType === t('TID01667') ? 'active' : ''}>
          {t('TID01667')}
          </span>
          {/* <span onClick={() => currentViewTypeChange(t('TID03023'))} className={currentViewType === t('TID03023') ? 'active' : ''}>
          {t('TID03023')}
          </span> */}
          <Divider sx={{ bgcolor: '#a00000', borderBottomWidth: '2px' }} />
        </Box>
        {currentViewType ===t('TID00009') && <WorklistSetting/>}
        {currentViewType ===t('TID01540') && <UserLanguageSetting/>}
        {currentViewType ===t('TID01667') && <UserToolSetting/>}
        {currentViewType ===t('TID03023') && <HangingProtocolSetting/>}
        
      </Box>
    </UserSettingCss>
  );
};
export default UserSetting;
