import React, { useState, useEffect, useRef } from 'react';
import loadable from '@loadable/component';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import i18n from '@lang/index';

const SignIn = loadable(() => import('../../pages/SignIn'));
const PACS = loadable(() => import('../PACS'));
const Admin = loadable(() => import('../../pages/Administrator'));
const MobileSignIn = loadable(() => import('../../mobilePage/MobileSignin'));

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    sessionStorage.setItem('mobile', String(mobile));
    setIsMobile(mobile);
  }, []);
  useEffect(() => {
    const lang = localStorage.getItem('lang');
    if (lang !== undefined && lang !== null) {
      i18n.changeLanguage(lang);
    }
  }, []);

  return (
    <HashRouter>
      {isMobile ? (
        <Routes>
          <Route path="/" element={<Navigate replace to="/signin" />} />
          <Route path="/signin" element={<MobileSignIn />} />
          <Route path="/pacs/*" element={<PACS />} />
          <Route path="/*" element={<Navigate replace to="/signin" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate replace to="/signin" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/pacs/*" element={<PACS />} />
          <Route path="/*" element={<Navigate replace to="/signin" />} />
        </Routes>
      )}
    </HashRouter>
  );
};

export default App;
