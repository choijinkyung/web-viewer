import React,{ useCallback, useState, useEffect } from "react";
import { Route,Routes,Navigate } from "react-router";
import loadable from '@loadable/component';
const UserSetting = loadable(()=> import('@mobileComponents/Setting/UserSetting'))
const AdminSetting = loadable(()=> import('@mobileComponents/Setting/AdminSetting'))
const MobileSetting = ()=> {
  return (
    <>
        <Routes>
          <Route path="/" element={<Navigate replace to="user"/>}  />
          <Route path="user/*"  element={<UserSetting/>}/>
          <Route path="administrator/*" element={<AdminSetting/>}/>
        </Routes>
    </>
  );
}
export default MobileSetting;