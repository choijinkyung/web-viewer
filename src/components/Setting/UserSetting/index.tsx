import React from 'react';
import { UserSettingCss } from './styles';
import { Route,Routes,Navigate } from "react-router";
import UserSettingMenuModal from '@components/Modal/UserSettingMenuModal';
import HangingProtocolSetting from "@components/Setting/HangingProtocolSetting";
import UserLanguageSetting from '../UserLanguageSetting';
import UserToolSetting from '../UserToolSetting';
import WorklistSetting from '../WorklistSetting';


const UserSetting = ()=> {
  return (
    <UserSettingCss>
      <UserSettingMenuModal/>
      <Routes>
        <Route path="/" element={<Navigate replace to="worklist"/>}/>
        <Route path="hanging" element={<HangingProtocolSetting/>}/>
        <Route path="worklist" element={<WorklistSetting />}/>
        <Route path="language" element={<UserLanguageSetting/>}/>
        <Route path='tool' element={<UserToolSetting/>}/>
        <Route path="/*" element={<Navigate replace to="hanging"/>}/>
      </Routes>
    </UserSettingCss>
  );
}

export default UserSetting;