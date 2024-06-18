import React, { VFC, useCallback, useState, useEffect, lazy, Suspense, useRef } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import loadable from '@loadable/component';
import { PacsCss } from './styles';
import SettingBox from '@components/SettingBox';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setToolChange, setPalyClipModalChnage, setGSPSBoolChange } from '@store/Tool';
import { setImageLayoutChange, setImageLayoutDoubleClickBoolChange } from '@store/imagelayout';
import {
  setComparisonCheckBoolChange,
  setComparisonImgaeLayoutChange,
  // setImageLoaderTypeChnage,
} from '@store/comparison';
import { setSelectedStudyType } from '@store/viewerStatus';

import cornerstone from 'cornerstone-core';
import { RootState, AppDispatch } from '@store/index';
import { userAction } from '@store/user';
import DecryptAES256 from '@utils/DecryptAES256';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Button, MenuItem, Paper, Popper, Grow, ClickAwayListener, MenuList } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { io } from 'socket.io-client';
import ifvisible from 'ifvisible.js';
import { Call } from '@utils/JwtHelper';
const socket = io('http://localhost:5000/#/pacs');

const WorkList = lazy(() => import('../../pages/WorkList'));
const Viewer = lazy(() => import('../../pages/Viewer'));
const Setting = loadable(() => import('../../pages/Setting'));
const MobileWorklist = lazy(() => import('../../mobilePage/MobileWorklist'));
const MobileViewer = lazy(() => import('../../mobilePage/MobileViewer'));
const MobileSetting = loadable(() => import('../../mobilePage/MobileSetting'));
const HIS = loadable(() => import('../../pages/HIS'));

const PACS: VFC = () => {
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const { toolChangeCheckBool, gspsBool } = useSelector((state: RootState) => state.tool.toolbar);
  const { imageLayout } = useSelector((state: RootState) => state.imagelayout.imagelayout);
  const { comparisonCheckBool, comparisonImageLayout } = useSelector(
    (state: RootState) => state.comparison.comparison,
  );
  ////
  const { isOneSeries: firstStudyIsOneSeries } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout);
  const { imageLayout: firstImageLayout } = useSelector((state: RootState) => state.studyStatus[0].imageLayout)
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)

  ////
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [open, setOpen] = React.useState(false);
  const prevOpen = React.useRef(open);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const call = new Call();
  //socket으로 온라인 확인
  useEffect(() => {
    socket.on('connection', () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });
    addEventListener('beforeunload', (e) => {
      socket.emit('refresh', {});
    });
    // ifvisible.setIdleDuration(200); //백그라운드시 오프라인 전환 타이머
    ifvisible.on('idle', () => {
      socket.emit('notVisible', {});
    });
    ifvisible.on('wakeup', () => {
      socket.emit('isVisible', {});
    });
    socket.on('licenseFulled', () => {
      const payload = {
        USERID: DecryptAES256(JSON.parse(localStorage.getItem('user')!).USERID),
      };
      axios.post('/api/v1/auth/logout', payload);
      // localStorage.clear();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.replace('/');
      alert('The session has expired');
      return;
    });
  }, []);

  const onClickUserProfile = useCallback((event: any) => {
    event.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);
  const page = param['*']?.split('/')[0];

  const LogoClickButton = useCallback(() => {
    cornerstone.imageCache.purgeCache();
    if (page === 'viewer') {
      if (firstStudyIsOneSeries) {
        dispatch({ type: 'setIsOneSeries/0', payload: !firstStudyIsOneSeries })
      }
      if (gspsBool) {
        dispatch(setGSPSBoolChange(false));
      }

      // dispatch(setSeriesChange([2, 2]));
    
      
      dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: false } })
      dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: 4 } })

      dispatch(
        setToolChange({
          tool: 'default',
          toolbool: !toolChangeCheckBool,
        }),
      );
      if (comparisonCheckBool) {
        dispatch(setComparisonCheckBoolChange(false));
        if (comparisonImageLayout[0] * comparisonImageLayout[0] !== 1) {
          dispatch(setComparisonImgaeLayoutChange([1, 1]));
        }
      }
    }
    if (selectedStudyType !== 'default') {
      dispatch(setSelectedStudyType('default'));
    }
    dispatch(setPalyClipModalChnage(false));
    //이미지 레이아웃 실행중일 시 초기화
    if (firstImageLayout[0] * firstImageLayout[1] !== 1) {
      dispatch({ type: 'setImageLayoutDoubleClickBool/0', payload: false })
      dispatch({ type: 'setImageLayout/0', payload: [1, 1] })
    }
    setTimeout(() => {
      navigate('/pacs/worklist');
    }, 50);
  }, [
    page,
    toolChangeCheckBool,
    firstImageLayout,
    comparisonCheckBool,
    firstStudyIsOneSeries,
    comparisonImageLayout,
    selectedStudyType,
    gspsBool,
  ]);
  if (!localStorage.getItem('accessToken')) {
    window.location.replace('/');
  }

  useEffect(() => {
    const user_id = JSON.parse(localStorage.getItem('user') as string).USERID;
    if (user_id !== undefined && user_id !== null) {
      dispatch(userAction.getUserPrivileges(DecryptAES256(user_id)));
    }
  }, []);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const handleClose = useCallback((event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  }, []);

  const handleListKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }, []);

  const MenuModalButtonClick = useCallback(
    (type: any) => {
      if (type === 'worklist') {
        cornerstone.imageCache.purgeCache();
        if (page === 'viewer') {
          if (firstStudyIsOneSeries) {
            dispatch({ type: 'setIsOneSeries/0', payload: !firstStudyIsOneSeries })
          }
          if (gspsBool) {
            dispatch(setGSPSBoolChange(false));
          }
          dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: false } })
          dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: 4 } })

          dispatch(
            setToolChange({
              tool: 'default',
              toolbool: !toolChangeCheckBool,
            }),
          );
          if (comparisonCheckBool) {
            dispatch(setComparisonCheckBoolChange(false));
            if (comparisonImageLayout[0] * comparisonImageLayout[0] !== 1) {
              dispatch(setComparisonImgaeLayoutChange([1, 1]));
            }
          }
        }
        if (selectedStudyType !== 'default') {
          dispatch(setSelectedStudyType('default'));
        }
        dispatch(setPalyClipModalChnage(false));
        //이미지 레이아웃 실행중일 시 초기화
        if (firstImageLayout[0] * firstImageLayout[1] !== 1) {
          dispatch({ type: 'setImageLayoutDoubleClickBool/0', payload: false })
          dispatch({ type: 'setImageLayout/0', payload: [1, 1] })
        }
        setTimeout(() => {
          navigate('/pacs/worklist');
        }, 50);
      }
      if (type === 'setting') {
        const page = param['*']?.split('/')[0];
        if (page === 'viewer') {
          if (firstStudyIsOneSeries) {
            dispatch({ type: 'setIsOneSeries/0', payload: !firstStudyIsOneSeries })
          }
          if (gspsBool) {
            dispatch(setGSPSBoolChange(false));
          }
          dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: false } })
          dispatch(
            setToolChange({
              tool: 'default',
              toolbool: !toolChangeCheckBool,
            }),
          );
          if (comparisonCheckBool) {
            dispatch(setComparisonCheckBoolChange(false));
            if (comparisonImageLayout[0] * comparisonImageLayout[0] !== 1) {
              dispatch(setComparisonImgaeLayoutChange([1, 1]));
            }
          }
          if (selectedStudyType !== 'default') {
            dispatch(setSelectedStudyType('default'));
          }
          dispatch(setPalyClipModalChnage(false));
          if (firstImageLayout[0] * firstImageLayout[1] !== 1) {
            dispatch({ type: 'setImageLayoutDoubleClickBool/0', payload: false })
            dispatch({ type: 'setImageLayout/0', payload: [1, 1] })
          }
          location.replace('/pacs/setting');
        } else {
          navigate('/pacs/setting');
        }
      }
      if (type === 'logout') {
        const user_id = JSON.parse(localStorage.getItem('user') as string).USERID;
        const payload = {
          USERID: DecryptAES256(user_id),
        };
        if (confirm(t('TID03073'))) {
          try {
            call.post('/api/v1/auth/logout', payload, t('TID00012'));
          } catch (error) {
            console.error(error);
          }
          if (comparisonCheckBool) {
            dispatch(setComparisonCheckBoolChange(false));
          }
          dispatch(setPalyClipModalChnage(false));
          dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: false } })
          dispatch({ type: 'setIsOneSeries/0', payload: false })
          dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: 4 } })

          dispatch(
            setToolChange({
              tool: 'default',
              toolbool: !toolChangeCheckBool,
            }),
          );
          // localStorage.clear();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.replace('/');
          return;
        } else {
          alert(t('TID03046'));
        }
      }

      setOpen(false);
    },
    [handleClose],
  );

  return (
    <PacsCss>
      {sessionStorage.getItem('mobile') === 'true' ? (
        <>
          <header className="mobileHeader">
            <div className="logo">
              <img
                src={require('../../assets/logo_white.png').default}
                onClick={LogoClickButton}
                onTouchStart={LogoClickButton}
              />
            </div>
            <div className="menuButton">
              <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? 'composition-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <MenuIcon sx={{ color: 'white', height: '100%', fontSize: '7vw' }} />
              </Button>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                // disablePortal
                sx={{ zIndex: '10000', position: 'relative' }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem onClick={() => MenuModalButtonClick('worklist')}>WorkList</MenuItem>
                          <MenuItem onClick={() => MenuModalButtonClick('setting')}>Setting</MenuItem>
                          <MenuItem onClick={() => MenuModalButtonClick('logout')}>Logout</MenuItem>
                          <MenuItem
                            onClick={() => {
                              if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                              MenuModalButtonClick('fullscreen');
                            }}
                          >
                            FullScreen
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </header>
          <Suspense>
            <div className="mainBox">
              <Routes>
                <Route path="/" element={<Navigate replace to="/pacs/worklist" />} />
                <Route path="/worklist" element={<MobileWorklist />} />
                <Route path="/setting/*" element={<MobileSetting />} />
                <Route path="/viewer/:study_key/:study_instance_uid/:patient_id" element={<MobileViewer />} />
                <Route path="/his/:patient_id/:access_number" element={<HIS />} />
                <Route path="/his/:patient_id/" element={<HIS />} />
                <Route path="/his/*" element={<HIS />} />
                <Route path="/*" element={<Navigate replace to="/pacs/worklist" />} />
              </Routes>
            </div>
          </Suspense>
        </>
      ) : (
        <>
          <header className="desktopHeader">
            <button onClick={LogoClickButton}>
              <img src={require('../../assets/logo_white.png').default} />
            </button>
          </header>
          <Suspense>
            <div className="mainBox">
              <SettingBox />
              <Routes>
                <Route path="/" element={<Navigate replace to="/pacs/worklist" />} />
                <Route path="/worklist" element={<WorkList />} />
                <Route path="/setting/*" element={<Setting />} />
                <Route path="/viewer/:study_key/:study_instance_uid/:patient_id" element={<Viewer />} />
                <Route path="/his/:patient_id/:access_number" element={<HIS />} />
                <Route path="/his/:patient_id/" element={<HIS />} />
                <Route path="/his/*" element={<HIS />} />
                <Route path="/*" element={<Navigate replace to="/pacs/worklist" />} />
              </Routes>
            </div>
          </Suspense>
        </>
      )}
    </PacsCss>
  );
};

export default PACS;
