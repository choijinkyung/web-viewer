import React, { useEffect, useCallback, useState } from 'react';
import { Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import axios from 'axios';
import {
  setSearchBoxBoolChange,
  setThumbnailBoxBoolChange,
  setToolBoxBoolChange,
  setReportModalChange,
} from '@store/settingbox';
import { setComparisonCheckModalBool } from '@store/modal';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import HandymanIcon from '@mui/icons-material/Handyman';
import { SettingBoxCss } from './styles';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CompareIcon from '@mui/icons-material/Compare';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { RootState } from '@store/index';
import {
  setComparisonCheckBoolChange,
  setComparisonImgaeLayoutChange,
  // setImageLoaderTypeChnage,
} from '@store/comparison';
import { setSelectedStudyType } from '@store/viewerStatus';
import { setPalyClipModalChnage, setToolChange } from '@store/Tool';
import { useTranslation } from 'react-i18next';
import DecryptAES256 from '@utils/DecryptAES256';
import { setGSPSBoolChange } from '@store/Tool';
import { useMediaQuery } from 'react-responsive';
import { Call } from '@utils/JwtHelper';
const SettingBox = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const param = useParams();
  const navigate = useNavigate();
  const { searchBoxBool, thumbnailBoxBool, toolBoxBool, reportModalBool, userSettingMenuBool, adminSettingMenuBool } =
    useSelector((state: RootState) => state.setting.setting);
  const { comparisonCheckModalBool } = useSelector((state: RootState) => state.modal.modal);
  const { toolChangeCheckBool, gspsBool } = useSelector((state: RootState) => state.tool.toolbar);
  const { comparisonCheckBool, comparisonImageLayout } = useSelector(
    (state: RootState) => state.comparison.comparison,
  );
  ////
  const { isOneSeries: firstStudyIsOneSeries } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { imageLayout: firstImageLayout } = useSelector((state: RootState) => state.studyStatus[0].imageLayout)
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)
  /////
  const { imageLayout } = useSelector((state: RootState) => state.imagelayout.imagelayout);
  const { CheckStudy } = useSelector((state: RootState) => state.worklistReducer.worklist);
  const [settingBoxBool, setSettingBoxBool] = useState('worklist');
  const [settingPagePath, setSettingPagePath] = useState('');
  const [userName, setUserName] = useState('');
  const call = new Call();
  const isSmallScreen = useMediaQuery({ minWidth: 0, maxWidth: 1280 });

  /**
   * 검색 (search) 버튼 (WorkList page)
   */
  const WorklistSearchButtonClick = useCallback(() => {
    dispatch(setSearchBoxBoolChange(!searchBoxBool));
  }, [searchBoxBool]);

  /**
   * 썸네일(Thumbnail) 버튼 (Viewer page)
   */
  const ViewerThumbnailButtonClick = useCallback(() => {
    dispatch(setThumbnailBoxBoolChange(!thumbnailBoxBool));
  }, [thumbnailBoxBool]);

  /**
   * 도구(Tool) 버튼 (Viewer page)
   */
  const ViewerToolButtonClick = useCallback(() => {
    dispatch(setToolBoxBoolChange(!toolBoxBool));
  }, [toolBoxBool]);

  /**
   * 판독 (Report) 버튼 (Viewer page)
   */
  const ViewerReportModalButtonClick = useCallback(
    (value: any) => {
      if (value === 'worklist') {
        if (CheckStudy.length > 1) {
          alert('하나의 검사만 선택해주세요');
          return;
        }
        if (CheckStudy.length === 0) {
          alert('하나의 검사를 선택해주세요');
          return;
        }
        dispatch(setReportModalChange(!reportModalBool));
      } else if (value === 'viewer') {
        dispatch(setReportModalChange(!reportModalBool));
      }
    },
    [reportModalBool, CheckStudy],
  );

  /**
   * 비교검사 버튼 (Viewer page)
   */
  const ComparisonCheckModalButtonClick = useCallback(() => {
    dispatch(setComparisonCheckModalBool(!comparisonCheckModalBool));
  }, [comparisonCheckModalBool]);

  /**
   * 사용자 설정 버튼 (Setting page)
   */
  const UserSettingMenuButtonClick = useCallback(() => {
    if (settingPagePath === 'user') {
      return;
    }
    setSettingPagePath('user');
    navigate('setting');
  }, [userSettingMenuBool, adminSettingMenuBool, settingPagePath]);

  /**
   * 관리자 설정 버튼 (Setting page)
   */
  const AdminSettingMenuButtonClick = useCallback(() => {
    if (settingPagePath === 'administrator') {
      return;
    }
    setSettingPagePath('administrator');
    navigate('setting/administrator');
  }, [adminSettingMenuBool, userSettingMenuBool, settingPagePath]);

  /**
   * 로그아웃 (logout) 버튼 (공통)
   */
  const logoutButtonClick = useCallback(async () => {
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
  }, [comparisonCheckBool]);

  /**
   * 설정 (setting) 버튼 (공통)
   */
  const settingButtonClick = useCallback(() => {
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
        dispatch({ type:'setImageLayoutDoubleClickBool/0',payload:false})
        dispatch({ type: 'setImageLayout/0', payload: [1, 1] })
      }
      navigate('/pacs/setting');
    } else {
      navigate('/pacs/setting');
    }
  }, [
    param,
    firstStudyIsOneSeries,
    gspsBool,
    comparisonCheckBool,
    comparisonImageLayout,
    selectedStudyType,
    firstImageLayout,
    toolChangeCheckBool,
  ]);

  useEffect(() => {
    const page = param['*']?.split('/')[0];
    if (page === 'worklist') {
      setSettingBoxBool('worklist');
    } else if (page === 'viewer') {
      setSettingBoxBool('viewer');
    } else if (page === 'setting') {
      const current = param['*']?.split('/')[1];
      setSettingBoxBool('setting');
      if (current !== null && current !== undefined) {
        setSettingPagePath(current);
      }
    }
  }, [param]);
  useEffect(() => {
    const name = JSON.parse(localStorage.getItem('user') as string).USERNAME;

    setUserName(DecryptAES256(name));
  }, []);

  return (
    <SettingBoxCss
      style={{
        color: 'white',
      }}
    >
      <Box className="Menuwrapper">
        <Box title={userName}>
          <AccountCircleIcon sx={{ color: '#a00000' }} />
          <span className="name">{userName}</span>
          {/* <span className="hospital">병원</span> */}
        </Box>
        {settingBoxBool === 'viewer' ? (
          <Box>
            <Box
              onClick={ViewerThumbnailButtonClick}
              className={thumbnailBoxBool ? 'icon active' : 'icon'}
              title={t('TID01668')}
            >
              <AddToPhotosIcon sx={{ color: '#a00000' }} />
            </Box>
            <span className="thumbnailBox " title={t('TID01668')}>
              {t('TID01668')}
            </span>
            <Box onClick={ViewerToolButtonClick} className={toolBoxBool ? 'icon active' : 'icon'} title={t('TID01667')}>
              <HandymanIcon sx={{ color: '#a00000' }} />
            </Box>
            <span className="toolBox" title={t('TID01667')}>
              {t('TID01667')}
            </span>
            <Box
              onClick={() => ViewerReportModalButtonClick('viewer')}
              className={reportModalBool ? 'icon active' : 'icon'}
              title={t('TID00076')}
            >
              <LibraryBooksIcon sx={{ color: '#a00000' }} />
            </Box>
            <span className="reportModal" title={t('TID00076')}>
              {t('TID00076')}
            </span>
            {comparisonCheckBool ? (
              <>
                <Box
                  onClick={ComparisonCheckModalButtonClick}
                  className={comparisonCheckBool ? 'icon active' : 'icon'}
                  title={t('TID03014')}
                >
                  <CompareIcon sx={{ color: '#a00000' }} />
                </Box>
                <span className="comparisonCheck" title={t('TID03014')}>
                  {t('TID03014')}
                </span>
              </>
            ) : (
              ''
            )}
          </Box>
        ) : settingBoxBool === 'worklist' ? (
          <span>
            <Box onClick={WorklistSearchButtonClick}>
              <Box className={searchBoxBool ? 'icon active' : 'icon'} title={t('TID02468')}>
                <ManageSearchIcon sx={{ color: '#a00000' }} />
              </Box>
              <span className="settingText" title={t('TID02468')}>
                {t('TID02468')}
              </span>
            </Box>
            {isSmallScreen && (
              <Box onClick={() => ViewerReportModalButtonClick('worklist')}>
                <Box className={'icon'} title={t('TID00076')}>
                  <LibraryBooksIcon sx={{ color: '#a00000' }} />
                </Box>
                <span className="reportModal" title={t('TID00076')}>
                  {t('TID00076')}
                </span>
              </Box>
            )}
          </span>
        ) : (
          <Box>
            <Box
              onClick={UserSettingMenuButtonClick}
              className={settingPagePath === 'user' ? 'icon active' : 'icon'}
              title={t('TID00010')}
            >
              <ManageAccountsIcon sx={{ color: '#a00000' }} />
            </Box>
            <span className="settingText" title={t('TID00010')}>
              {t('TID00010')}
            </span>
            {DecryptAES256(JSON.parse(localStorage.getItem('user') as string).USERID) === 'admin' ? (
              <Box sx={{ marginTop: '12px !important' }} title={t('TID00068')}>
                <Box
                  onClick={AdminSettingMenuButtonClick}
                  className={settingPagePath === 'administrator' ? 'icon active' : 'icon'}
                >
                  <EngineeringIcon sx={{ color: '#a00000' }} />
                </Box>
                <span className="settingText">{t('TID00068')}</span>
              </Box>
            ) : (
              <Box></Box>
            )}
          </Box>
        )}
      </Box>
      <Box className="Settingwrapper">
        <Box className="usersetting" onClick={settingButtonClick} title={t('TID03149')}>
          <SettingsIcon sx={{ color: '#a00000' }} />
        </Box>
        <Box className="logout" onClick={logoutButtonClick} title={t('TID00012')}>
          <LogoutIcon sx={{ color: '#a00000' }} />
        </Box>
      </Box>
    </SettingBoxCss>
  );
};

export default SettingBox;
