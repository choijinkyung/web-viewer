import React from 'react';
import { AdministratorCss } from './styles';
import { Routes,Route } from 'react-router';
import AdminSettingMenuModal from '@components/Modal/AdminSettingMenuModal';
import UserInfoSetting from '@components/Setting/UserInfoSetting';
const Administrator = ()=> {
  return (
    <AdministratorCss>
        <AdminSettingMenuModal/>
        <Routes>
            <Route path="/" element={<UserInfoSetting/>}/>
        </Routes>
    </AdministratorCss>
  );
}

export default Administrator;