import React from "react";
import { Route,Routes,Navigate } from "react-router";
import loadable from '@loadable/component';
const UserSetting = loadable(()=> import('@components/Setting/UserSetting'))
const AdminSetting = loadable(()=> import('@components/Setting/AdminSetting'))
const Setting = () => {
  
  return (
    <>
        <Routes>
          <Route path="/" element={<Navigate replace to="user"/>}  />
          <Route path="user/*"  element={<UserSetting/>}/>
          <Route path="administrator/*" element={<AdminSetting/>}/>
        </Routes>
    </>
  );
};

export default Setting;