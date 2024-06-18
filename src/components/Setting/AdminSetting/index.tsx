import React from 'react';
import { AdminSettingCss } from './styles';
import { Routes,Route,Navigate } from 'react-router';
import AdminSettingMenuModal from '@components/Modal/AdminSettingMenuModal';
import UserInfoSetting from '@components/Setting/UserInfoSetting';
import GroupPrivilege from '@components/Setting/GroupPrivilege';
import { replace } from 'lodash';
const AdminSetting = ()=> {
  return (
    <AdminSettingCss>
        <AdminSettingMenuModal/>
        <Routes>
            <Route path="/" element={<Navigate replace to="userinfo"/>}/>
            <Route path="userinfo" element={<UserInfoSetting/>}/>
            <Route path="/*" element={<Navigate replace to="userinfo"/>}/>
            {/* <Route path="groupprivilege" element={<GroupPrivilege/>}/> */}
        </Routes>
    </AdminSettingCss>
  );
}

export default AdminSetting;