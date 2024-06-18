import React, { useCallback, useEffect, useState, Suspense } from 'react';
import {
  Button,
  createTheme,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import { WorkListCss } from './styles';
import { AppDispatch } from '@store/index';
import { useDispatch, useSelector } from 'react-redux';
import { startDateAction, endDateAction, pagingNumAction, limitAction } from '@store/filter';
import { worklistActions, setWorklistArrChange, setCheckStudyChange } from '@store/worklist';
import moment from 'moment';
import { reportActions } from '@store/report';
import loadable from '@loadable/component';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadIcon from '@mui/icons-material/Download';
import dicomParser, { DataSet } from 'dicom-parser';
import { useNavigate } from 'react-router';
import { Call } from '@utils/JwtHelper';
import { RootState } from '@store/index';
import { userAction } from '@store/user';
import {
  setDefaultSeriesStorageChange,
  setOneSeriesBoolChange,
  setSeriesChange,
  setSeriesDoubleClickElementChange,
  setSeriesValueChange,
} from '@store/series';
import { useTranslation } from 'react-i18next';
import { Root } from 'react-dom/client';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import DecryptAES256 from '@utils/DecryptAES256';
import InitCornerstone from '@components/InitCornerstone';
import { useMediaQuery } from 'react-responsive';
import { ReportModal } from '@components/Modal/ReportModal';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';


import { parseDicom } from 'dicom-parser';
import { createImageData } from 'canvas';
import InsertPhoto from '@mui/icons-material/InsertPhoto';
// import { isSmallScreen } from '@utils/Resolution';
// import { worklistColumnArr } from '@components/Worklist/WorklistChain';

const WorklistTopSearchFilter = React.lazy(() => import('../../components/Worklist/WorklistTopSearchFilter'));
const WorklistReportBox = React.lazy(() => import('../../components/Worklist/WorklistReportBox'));
const WorklistLeftSeacrhBox = loadable(() => import('../../components/Worklist/WorklistLeftSearchBox'));

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
}

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

type contextMenu = {
  worklistBool: boolean;
  pastListBool: boolean;
  x: string | null;
  y: string | null;
  row: null | {
    study_key: number;
    study_instance_uid: string;
    patient_id: string;
  };
};

const WorkList = () => {
  const { t, i18n } = useTranslation();
  const call = new Call();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(''); //선택된 검사
  const [param, setParam] = useState('dcm');
  const loggedUser = localStorage.getItem('user');
  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };

  const isBigScreen = useMediaQuery({ minWidth: 1921, maxWidth: 7680 });
  const isSmallScreen = useMediaQuery({ minWidth: 0, maxWidth: 1280 });
  const isFHD = useMediaQuery({ minWidth: 1281, maxWidth: 1920 });
  const isHD = useMediaQuery({ minWidth: 961, maxWidth: 1280 });
  const isQHD = useMediaQuery({ minWidth: 641, maxWidth: 960 });
  const isNHD = useMediaQuery({ minWidth: 0, maxWidth: 640 });

  const dispatch = useDispatch<AppDispatch>();
  const worklist = useSelector((state: RootState) => state.worklist.worklist);
  const moreWorkList = useSelector((state: RootState) => state.moreworklist.moreWorkList);
  const { pagingNum, patient_id, patient_name, reading_status, modality, verify_flag, startDate, endDate, limit } =
    useSelector((state: RootState) => state.filter.filter);
  const { worklistArr } = useSelector((state: RootState) => state.worklistReducer.worklist);
  const patientPastStudyList = useSelector((state: any) => state.patientPastStudyList.patientPastStudyList);
  const { searchBoxBool } = useSelector((state: RootState) => state.setting.setting);
  const userPrivileges = useSelector((state: any) => state.user.userPrivileges);
  // const [worklistArr, setWorklistArr] = useState([]);
  const [firstRandering, setFirstRandering] = useState(false);
  const [workListArrLength, setWorkListArrLength] = useState(0);
  const [checkItems, setCheckItems] = useState<string[]>([]); //체크된 검사 리스트
  const [worklistContextMenu, setWorkListContextMenu] = useState<contextMenu>({
    worklistBool: false,
    pastListBool: false,
    x: null,
    y: null,
    row: null,
  });
  const [patientStudy, setpatientStudy] = useState([]);
  const [SelectOpenBool, setSelectOpenBool] = useState(false);
  const [worklistSetting, setWorklistSetting] = useState<any>();
  const [worklistSettingLength, setWorklistSettingLength] = useState<any>();

  const worklistColumnArray = [
    { name: t('TID02821'), desc: t('TID02821'), column: 'pID' },
    { name: t('TID02738'), desc: t('TID02738'), column: 'pName' },
    { name: t('TID00031'), desc: t('TID03091'), column: 'modality' },
    { name: t('TID00045'), desc: t('TID00045'), column: 'studyDesc' },
    { name: t('TID00032'), desc: t('TID03083'), column: 'studyDate' },
    { name: t('TID00033'), desc: t('TID03084'), column: 'ReportStatus' },
    { name: t('TID00034'), desc: t('TID03085'), column: 'seriesCnt' },
    { name: t('TID00035'), desc: t('TID03086'), column: 'imageCnt' },
    { name: t('TID02825'), desc: t('TID03087'), column: 'VerifyFlag' },
    { name: t('TID02481'), desc: t('TID03088'), column: 'pSex' },
    { name: t('TID03081'), desc: t('TID03089'), column: 'PatAge' },
    { name: t('TID02955'), desc: t('TID03090'), column: 'RefPhysicianName' },
    { name: t('TID03082'), desc: t('TID03082'), column: 'InsName' },
    { name: t('TID03075'), desc: t('TID03092'), column: 'AI_Company' },
    { name: t('TID03076'), desc: t('TID03093'), column: 'AI_Model_Name' },
    { name: t('TID02995'), desc: t('TID03094'), column: 'AI_Score' },
    { name: t('TID03077'), desc: t('TID03095'), column: 'AI_Priority' },
    { name: t('TID03078'), desc: t('TID03096'), column: 'AI_Number_Of_Findings' },
    { name: t('TID03079'), desc: t('TID03097'), column: 'AI_Abnormal_YN' },
    { name: t('TID03080'), desc: t('TID03098'), column: 'AI_Finding' },
  ];

  /**
   * 워크리스트 목록에서 검사이력을 클릭하였을때 과거검사이력 api 가 발동하고 응답(res)가왔을때 상태값에 넣어준뒤 상태값을 컨트롤하여
   * 화면에 표출해준다.
   * @ api응답값을 사용하여 표출 시 뷰어페이지로 이동 후 워크리스트 복귀 시점에 store가 가지고 있는 값을 화면에 표출하여 목록을클릭하지
   * @ 않아도 과거검사 목록이 떠있다
   */
  useEffect(() => {
    if (firstRandering) {
      setpatientStudy(patientPastStudyList);
    }
  }, [patientPastStudyList]);

  /**
   * 워크리스트 페이지 이동 시 과거검사이력 상태값을 초기화 해주는 코드
   */
  useEffect(() => {
    setpatientStudy([]);
  }, []);

  /**
   * 워크리스트 검색(기간 버튼 포함) 시 해당 데이터를 상태값에 넘겨 테이블에 표출
   */
  useEffect(() => {
    if (firstRandering) {
      if (worklist !== undefined && worklist !== null) {
        // setWorklistArr(worklist);
        dispatch(setWorklistArrChange(worklist));
      }
    }
    // }else {
    //   setFirstRandering(true);
    // }
  }, [worklist]);

  /**
   * 워크리스트 테이블 아래 더보기 버튼 클릭 시 받은 데이터를 원래있던 데이터에 포함시켜 테이블에 표출
   */
  useEffect(() => {
    if (firstRandering) {
      if (moreWorkList !== undefined && moreWorkList !== null) {
        const Arr = worklistArr.concat(moreWorkList);
        // setWorklistArr(Arr);
        dispatch(setWorklistArrChange(Arr));
      }
    } else {
      setFirstRandering(true);
    }
  }, [moreWorkList]);

  /**
   * 처음 mount 될 때, 달력의 최초값을 지정해주는 Effect
   */
  useEffect(() => {
    // dispatch(startDateAction(moment().subtract(3, 'months').format('YYYY-MM-DD')));
    dispatch(startDateAction('1990-01-01'));
    dispatch(endDateAction(moment().format('YYYY-MM-DD')));
  }, []);

  /**체크박스 단일 선택*/
  const handleSingleCheck = (checked: boolean, study_key: string) => {
    if (checked) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems((prev: any[]): any => [...prev, study_key]);
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(checkItems.filter((el) => el !== study_key));
    }
  };

  /**
   *  체크박스 전체 선택
   */
  const handleAllCheck = (checked: any) => {
    if (checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      const rowData: any = [];
      worklistArr.forEach((el: any) => rowData.push(el.studyKey));
      setCheckItems(rowData);
    } else {
      // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
      setCheckItems([]);
    }
  };

  /**
   * 체크박스를 통해 상태값이 변할때 전역 상태값을 관리하는 이펙트
   */
  useEffect(() => {
    if (firstRandering) {
      dispatch(setCheckStudyChange(checkItems));
    }
  }, [checkItems]);

  /**
   * 워크리스트 column 선택시, report와 과거검사 api 호출
   */
  const handleWorklistItemClick = useCallback(
    (row: any) => {
      const payload = {
        params: {
          patient_id: row.pID,
          study_key: row.studyKey,
        },
        headers,
      };
      setSelectedRow(row);
      dispatch(worklistActions.fetchPatientPastStudyList(payload));
      dispatch(reportActions.fetchRecentReport(payload));
      dispatch(reportActions.fetchRecentReportInfo(payload));
      dispatch(reportActions.fetchRecentComment(payload));
      setWorkListContextMenu({
        ...worklistContextMenu,
        worklistBool: false,
      });
    },
    [headers],
  );

  /**
   * column 더블 클릭시 해당 검사의 뷰어로 이동
   */
  const handleWorklistItemDoubleClick = useCallback(
    async (row: any) => {
      const user_id = JSON.parse(localStorage.getItem('user') as string).USERID;
      const userID = DecryptAES256(user_id);
      // location.replace(`/pacs/viewer/${row.study_key}/${row.study_instance_uid}/${row.patient_id}`);
      const hanging = await call.get(`/api/v1/hanging/${userID}`);
      const seriesValue = hanging.data.find((v: any) => v.Modality === row.modality);
      if (seriesValue) {
        dispatch({ type: 'setSeriesLayout/0', payload: [Number(seriesValue.SeriesRows), Number(seriesValue.SeriesColumns)] });
        if (Number(seriesValue.SeriesRows) === 1 && Number(seriesValue.SeriesColumns) === 1) {
          dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: 1 } })
          dispatch({ type: 'setSeriesStorage/0', payload: [2, 2] })

        }
      } else {
        dispatch({ type: 'setSeriesLayout/0', payload: [1,1] });
        dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: 1 } })
        dispatch({ type: 'setSeriesStorage/0', payload: [2, 2] })

      }
      if (checkItems.length > 0) {
        setCheckItems([]);
      }

      navigate(`/pacs/viewer/${row.studyKey}/${row.studyInsUID}/${encodeURIComponent(row.pID)}`);
      //emr 테스트 용
      // navigate(`/pacs/emr/${row.pID}/${row.accessNum}`);
    },
    [checkItems],
  );

  /**
   * 검사 삭제 버튼
   */
  const deleteStudy = useCallback(() => {
    if (checkItems.length > 0) {
      if (confirm(t('TID03053'))) {
        checkItems.forEach(async (study_key: any) => {
          await call.delete(`/api/v1/dicom/studyKey/${study_key}`, t('TID03069')).then((res) => {
            alert(res);
            window.location.reload();
          });
        });
      } else {
        alert(t('TID03044'));
      }
    } else {
      alert(t('TID03060'));
    }
  }, [checkItems]);

  /**
   * 워크리스트 cotextMenu
   */
  const WorklistContextMenuButton = useCallback(
    (param: any) => (event: any) => {
      event.preventDefault();
      const x = event.pageX + 'px';
      const y = event.pageY + 'px';
      setWorkListContextMenu({
        ...worklistContextMenu,
        [param.bool]: true,
        x: x,
        y: y,
        row: param.row,
      });
    },
    [],
  );

  /**
   * 워크리스트 목록 우클릭 새탭에서 열기 로직
   */
  const openInNewTab = useCallback(
    (event: any) => {
      if (worklistContextMenu.row !== null) {
        window.open(
          `/#/pacs/viewer/${worklistContextMenu.row.study_key}/${worklistContextMenu.row.study_instance_uid}/${worklistContextMenu.row.patient_id}`,
        );
      }
      setWorkListContextMenu({
        ...worklistContextMenu,
        worklistBool: false,
      });
    },
    [worklistContextMenu],
  );

  /**
   * 워크리스트 목록 우클릭 새창에서 열기 로직
   */
  const openInNewWindow = useCallback(
    async (event: any) => {
      let screenDetails: any, permission: any, currentScreenLength: any;
      let WindowScreen = window.screen;
      let placement: any = 'window-placement';
      let Getsuccess = true;
      if ('getScreenDetails' in window) {
        screenDetails = await window.getScreenDetails().catch((error: any) => {
          alert(t('TID03061'));
          if (worklistContextMenu.row !== null) {
            const n = {
              x: 0,
              y: 0,
              width: window.screen.availWidth,
              height: window.screen.availHeight,
            };
            const getFeaturesFromOptions = (e: any) =>
              'left=' + e.x + ',top=' + e.y + ',width=' + e.width + ',height=' + e.height;
            window.open(
              `/#/pacs/viewer/${worklistContextMenu.row.study_key}/${worklistContextMenu.row.study_instance_uid}/${worklistContextMenu.row.patient_id}`,
              'myapp',
              getFeaturesFromOptions(n),
            );
            Getsuccess = false;
            return;
          }
          return;
        });
        if (Getsuccess) {
          screenDetails.addEventListener('screenschange', (e: any) => {
            screenDetails.screens.length !== currentScreenLength &&
              (currentScreenLength = screenDetails.screens.length);
          });
          try {
            permission =
              'granted' ===
              (
                await navigator.permissions.query({
                  name: placement,
                })
              ).state
                ? 'Granted'
                : 'No Permission';
          } catch (e) {
            console.error(e);
            return;
          }
          if (permission === 'No Permission') {
            console.log('No Permission');
            return;
          }
          currentScreenLength = screenDetails.screens.length;

          let e;
          if (screenDetails.screens.length > 1) {
            if (screenDetails.screens.length === 2) {
              if (screenDetails.currentScreen.availLeft !== 0) {
                e = screenDetails.screens[0];
              } else {
                e = screenDetails.screens[1];
              }
            } else if (screenDetails.screens.length > 2) {
              const findCurrentScreenNumber = Number(
                screenDetails.screens.findIndex((v: any) => v.availLeft === screenDetails.currentScreen.availLeft),
              );
              if (findCurrentScreenNumber === screenDetails.screens.length - 1) {
                e = screenDetails.screens[findCurrentScreenNumber - 1];
              } else {
                e = screenDetails.screens[findCurrentScreenNumber + 1];
              }
            }
          } else {
            e = screenDetails.screens[0];
          }

          const n = {
            x: e.left,
            y: e.top,
            width: e.availWidth,
            height: e.availHeight,
          };
          const getFeaturesFromOptions = (e: any) =>
            'left=' + e.x + ',top=' + e.y + ',width=' + e.width + ',height=' + e.height;

          if (worklistContextMenu.row !== null) {
            window.open(
              `/#/pacs/viewer/${worklistContextMenu.row.study_key}/${worklistContextMenu.row.study_instance_uid}/${worklistContextMenu.row.patient_id}`,
              'myapp',
              getFeaturesFromOptions(n),
            );
          }
        }
      } else {
        (screenDetails = WindowScreen),
          // (permission = 'Multi-Screen Window Placement API - NOT SUPPORTED'),
          (currentScreenLength = 1);
      }

      setWorkListContextMenu({
        ...worklistContextMenu,
        worklistBool: false,
      });
    },
    [worklistContextMenu],
  );

  /**
   * 우클릭 모달 마우스 이벤트
   */
  const onMouseLeaveEvent = useCallback(
    (param: any) => (e: any) => {
      setWorkListContextMenu({
        ...worklistContextMenu,
        [param]: false,
      });
    },
    [],
  );

  /**
   * 다운로드 버튼
   */
  const getStudyKey = useCallback(
    async (param: string) => {
      if (confirm(t('TID03062'))) {
        const len = checkItems.length;
        if (len === 0) {
          alert(t('TID03063'));
          return;
        }
        for (let i = 0; i < len; i++) {
          await getSeriesKey(checkItems[i], param);
        }
      } else {
        alert(t('TID03046'));
      }
    },
    [checkItems, param],
  );

  /**
   * 다운로드 버튼 클릭 시 실행되는 함수
   */
  const getSeriesKey = useCallback(async (study_key: string, param: string) => {
    await call.get(`/api/v1/worklists/studies/${study_key}`).then(async ({ data }) => {
      const seriesListLen = data.length;
      for (let i = 0; i < seriesListLen; i++) {
        await getImageKey(study_key, data[i].seriesKey, param);
      }
    });
  }, []);

  /**
   * 다운로드 버튼 클릭 시 실행되는 함수
   */
  const getImageKey = useCallback(async (study_key: string, series_key: string, param: string) => {
    try {
      const { data } = await call.get(`/api/v1/worklists/studies/${study_key}/series/${series_key}`);

      const sopInstanceListLen = data.length;
      if (param === 'dcm') {
        for (let j = 0; j < sopInstanceListLen; j++) {
          await downloadDICOM(study_key, series_key, data[j].imageKey, data[j].sopInstanceUID);
        }
      } else if (param === 'jpeg') {
        for (let j = 0; j < sopInstanceListLen; j++) {
          await downloadJPEG(study_key, series_key, data[j].imageKey, data[j].sopInstanceUID);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  /**
   * 다운로드 버튼 클릭 시 실행되는 함수
   */
  const downloadDICOM = useCallback(
    (study_key: string, series_key: string, image_key: string, sop_instance_uid: string) => {
      axios
        .get(`/api/v1/dicom/studies/${study_key}/series/${series_key}/instances/${image_key}`, {
          headers,
          responseType: 'blob',
        })

        .then((response) => {
          response.data.arrayBuffer().then((arrayBuffer: any) => {
            let url;
            let dataSet: DataSet | null = dicomParser.parseDicom(new Uint8Array(arrayBuffer));

            url = window.URL.createObjectURL(
              new Blob([dataSet.byteArray], {
                type: 'application/dicom',
              }),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${sop_instance_uid}.dcm`);
            document.body.appendChild(link);
            link.click();
            arrayBuffer = null;
            dataSet = null;
          });
        });
    },
    [],
  );

  /**
   * jpg 다운로드 버튼 클릭시 실행되는 함수
   */
  /*
const downloadJPEG = useCallback(
  (study_key: string, series_key: string, image_key: string, sop_instance_uid: string) => {
    axios
      .get(`/api/v1/dicom/studies/${study_key}/series/${series_key}/instances/${image_key}`, {
        headers,
        responseType: 'arraybuffer', // ArrayBuffer 형식으로 응답 설정
      })
      .then((response) => {
        const arrayBuffer = response.data;
        const uint8Array = new Uint8Array(arrayBuffer); // ArrayBuffer를 Uint8Array로 변환

        // DICOM 데이터 파싱
        const dataSet: DataSet | null = dicomParser.parseDicom(uint8Array);

        // DICOM 이미지 정보 추출
        const width: any = dataSet.uint16('x00280011');
        const height: any = dataSet.uint16('x00280010');
        const pixelDataElement = dataSet.elements.x7fe00010;
        const pixelDataOffset = pixelDataElement.dataOffset;
        const pixelDataLength = pixelDataElement.length;
        const pixelDataBuffer = new Uint8Array(arrayBuffer, pixelDataOffset, pixelDataLength);

        // Canvas 생성
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('Failed to get canvas context');
          return;
        }

        // Canvas에 이미지 그리기
        const imageData = ctx.createImageData(width, height);
        imageData.data.set(pixelDataBuffer);
        ctx.putImageData(imageData, 0, 0);

        // Canvas를 JPEG 이미지로 변환하여 다운로드
        canvas.toBlob(function (blob) {
          if (!blob) {
            console.error('Failed to convert canvas to JPEG');
            return;
          }
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${sop_instance_uid}.jpg`;
          link.click();
          window.URL.revokeObjectURL(url);
        }, 'image/jpeg');
      });
  },
  [],
);*/

const downloadJPEG = useCallback(
  (study_key: string, series_key: string, image_key: string, sop_instance_uid: string) => {
    axios
      .get(`/api/v1/dicom/studies/${study_key}/series/${series_key}/instances/${image_key}`, {
        headers,
        responseType: 'blob', // Blob 형식으로 응답 설정
      })
      .then((response) => {
        const blob = response.data;

        // DICOM 이미지를 코너스톤 이미지로 로드
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(blob);
        if (!imageId) {
          console.error('Failed to load DICOM image.');
          return;
        }

        // DICOM 이미지를 JPEG로 변환하여 다운로드
        cornerstone
          .loadAndCacheImage(imageId)
          .then((image) => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              console.error('Failed to get canvas context.');
              return;
            }
            cornerstone.renderToCanvas(canvas, image);

            // Canvas를 JPEG 이미지로 변환하여 다운로드
            canvas.toBlob(function (jpegBlob) {
              if (!jpegBlob) {
                console.error('Failed to convert canvas to JPEG');
                return;
              }
              const url = window.URL.createObjectURL(jpegBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${sop_instance_uid}.jpg`;
              link.click();
              window.URL.revokeObjectURL(url);
            }, 'image/jpeg');
          })
          .catch((error) => {
            console.error('Error loading DICOM image:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching DICOM data:', error);
      });
  },
  [],
);

  // 주어진 pixelDataBuffer를 사용하여 JPEG 이미지로 변환하고 다운로드하는 함수
  const downloadAsJpeg = (arrayBuffer: Uint8Array, width: number, height: number, sop_instance_uid: any) => {
    // Canvas 생성
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    // DICOM 데이터를 Canvas에 그리기
    const dataSet: DataSet | null = dicomParser.parseDicom(arrayBuffer);
    const pixelDataElement = dataSet!.elements.x7fe00010;
    const pixelDataOffset = pixelDataElement.dataOffset;
    const pixelDataLength = pixelDataElement.length;
    const pixelDataBuffer = new Uint8Array(arrayBuffer, pixelDataOffset, pixelDataLength);
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixelDataBuffer);
    ctx.putImageData(imageData, 0, 0);

    // Canvas를 JPEG 이미지로 변환하여 다운로드
    canvas.toBlob(function (blob) {
      if (!blob) {
        console.error('Failed to convert canvas to JPEG');
        return;
      }
      // JPEG 이미지 다운로드
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sop_instance_uid}.jpg`;
      link.click();
      // Blob URL 해제
      window.URL.revokeObjectURL(url);
    }, 'image/jpeg');
  };
  // ArrayBuffer를 base64 문자열로 변환하는 함수
  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  /**
   * 우클릭 버튼 jsx
   */
  const ContextMenu = useCallback(() => {
    return (
      <TableBody
        className="contextMenuCss"
        style={{ left: `${worklistContextMenu.x}`, top: `${worklistContextMenu.y}` }}
      >
        <TableRow>
          <TableCell onClick={openInNewTab}>{t('TID03033')}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell onClick={openInNewWindow}>{t('TID03034')}</TableCell>
        </TableRow>
      </TableBody>
    );
  }, [worklistContextMenu]);

  /**
   * 워크리스트 테이블 더보기 버튼
   */
  const MoreButtonClick = useCallback(() => {
    const payload = {
      params: {
        patient_id,
        patient_name,
        reading_status,
        modality,
        verify_flag,
        start_date: startDate,
        end_date: endDate,
        pagingNum: pagingNum + 1,
        limit,
        listLength: workListArrLength,
      },
      headers,
    };

    sessionStorage.setItem('search', JSON.stringify(payload.params));
    dispatch(worklistActions.fetchMoreWorklist(payload));
    dispatch(pagingNumAction(pagingNum + 1));
  }, [pagingNum, patient_id, patient_name, reading_status, headers, modality, verify_flag, limit, workListArrLength]);

  /**
   * 워크리스트 n개씩보기 버튼
   */
  const limitChangeEvent = useCallback((event: any) => {
    dispatch(limitAction(event.target.value));
  }, []);

  /**
   * 워크리스트 n개씩보기 상태값 저장 이펙트
   */
  useEffect(() => {
    if (worklistArr.length) {
      setWorkListArrLength(worklistArr.length);
    }
  }, [worklistArr]);

  /**
   * 유저세팅 호출 함수
   */
  async function getSettingData() {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    await call.get(`/api/v1/setting?UserID=${DecryptAES256(userID)}`).then(({ data }) => {
      const worklistData = JSON.parse(data.worklistSetting);
      const color = JSON.parse(data.colorSetting);
      const text = JSON.parse(data.TextSetting);
      setWorklistSetting(worklistData);
      sessionStorage.setItem(
        'color',
        JSON.stringify({ mouse: color.mouseColor, annotation: color.annotationColor, gsps: color.GSPSColor }),
      );
      sessionStorage.setItem('text', JSON.stringify(text));
      InitCornerstone();
      const a = Object.keys(worklistData).filter((v) => {
        if (worklistData[v]) {
          return true;
        } else {
          return false;
        }
      });
      setWorklistSettingLength(a.length + 1);
    });
  }
  /**
   * 유저 세팅 호출 이펙트
   */
  useEffect(() => {
    getSettingData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <WorkListCss>
        {searchBoxBool && <WorklistLeftSeacrhBox />}
        {checkItems.length > 0 && <ReportModal location="worklist" row={checkItems[0]} />}
        <Box className="listbox">
          <Box className="Total">
            <WorklistTopSearchFilter />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '10px',
              }}
            >
              <span className="totalcases">
                {t('TID00024')} : {worklistArr.length ? worklistArr.length : ''}
              </span>
              <Box>
                {userPrivileges.includes(410) ? (
                  <Button
                    sx={{
                      borderRadius: '15px',
                      color: 'white',
                      bgcolor: '#000000',
                      // marginRight: '12px',
                      width: isBigScreen ? '100px' : 'auto',
                      minWidth: isBigScreen ? '' : '30px',
                      height: '28px',
                      size: 'small',
                      fontSize: '11px',
                      border: '1px solid transparent',
                      mr: '10px',
                      '&:hover': {
                        transitionDelay: '0.1s',
                        background: '#000000',
                        border: '1px solid #a00000',
                      },
                    }}
                    title={t('TID00027')}
                    onClick={() => getStudyKey('dcm')}
                  >
                    {isBigScreen && (
                      <p
                        style={{
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t('TID00027')}
                      </p>
                    )}
                    <DownloadIcon sx={{ color: '#a00000', fontSize: '20px', ml: isBigScreen ? '5px' : '' }} />
                  </Button>
                ) : (
                  ''
                )}
                {userPrivileges.includes(410) ? (
                  <Button
                    sx={{
                      borderRadius: '15px',
                      color: 'white',
                      bgcolor: '#000000',
                      // marginRight: '12px',
                      width: isBigScreen ? '100px' : 'auto',
                      minWidth: isBigScreen ? '' : '30px',
                      height: '28px',
                      size: 'small',
                      fontSize: '11px',
                      border: '1px solid transparent',
                      mr: '10px',
                      '&:hover': {
                        transitionDelay: '0.1s',
                        background: '#000000',
                        border: '1px solid #a00000',
                      },
                    }}
                    title={t('TID03151')}
                    onClick={() => getStudyKey('jpeg')}
                  >
                    {isBigScreen && (
                      <p
                        style={{
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t('TID03151')}
                      </p>
                    )}
                  <InsertPhotoOutlinedIcon sx={{ color: '#a00000', fontSize: '20px', ml: isBigScreen ? '5px' : '' }} />
                  </Button>
                ) : (
                  ''
                )}
                {userPrivileges.includes(310) ? (
                  <Button
                    sx={{
                      borderRadius: '15px',
                      color: 'white',
                      bgcolor: 'black',
                      marginRight: {
                        fullhd: '32px',
                        desktop: '16px',
                      },
                      // "@media screen and (orientation: portrait)":{
                      //   marginRight:{
                      //     desktop: '28px',
                      //   }
                      // },
                      width: isBigScreen ? '100px' : 'auto',
                      minWidth: isBigScreen ? '' : '30px',
                      height: '28px',
                      size: 'small',
                      fontSize: '11px',
                      border: '1px solid transparent',
                      '&:hover': {
                        transitionDelay: '0.1s',
                        background: '#000000',
                        border: '1px solid #a00000',
                      },
                    }}
                    title={t('TID00029')}
                    onClick={deleteStudy}
                  >
                    {isBigScreen && (
                      <p
                        style={{
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t('TID00029')}
                      </p>
                    )}
                    <DeleteForeverIcon sx={{ color: '#a00000', fontSize: '20px', ml: isBigScreen ? '5px' : '' }} />
                  </Button>
                ) : (
                  ''
                )}
                <Select
                  // style={{
                  //   marginLeft:'auto',
                  //   backgroundColor: 'white',
                  // }}
                  open={SelectOpenBool}
                  onOpen={() => setSelectOpenBool(true)}
                  onClose={() => setSelectOpenBool(false)}
                  sx={{
                    borderRadius: '15px',
                    color: 'white',
                    bgcolor: 'black',
                    marginRight: {
                      fullhd: '32px',
                      desktop: '16px',
                    },
                    // "@media screen and (orientation: portrait)":{
                    //   marginRight:{
                    //     desktop: '28px',
                    //   }
                    // },
                    width: '130px',
                    height: '28px',
                    size: 'small',
                    fontSize: '11px',
                    border: '1px solid transparent',
                    // textAlign: 'right',
                    '&:hover': {
                      transitionDelay: '0.1s',
                      background: '#000000',
                      border: '1px solid #a00000',
                    },
                    '.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':
                      {
                        paddingRight: '3px',
                      },
                  }}
                  onChange={limitChangeEvent}
                  value={limit}
                  IconComponent={(props) => (
                    <MoreHorizIcon
                      sx={{ color: '#a00000', fontSize: '20px', mr: '20px', cursor: 'pointer' }}
                      onClick={() => setSelectOpenBool(true)}
                    />
                  )}
                >
                  <MenuItem value="10">{t('TID03025')}</MenuItem>
                  <MenuItem value="20">{t('TID03026')}</MenuItem>
                  <MenuItem value="50">{t('TID03027')}</MenuItem>
                  <MenuItem value="100">{t('TID03028')}</MenuItem>
                </Select>
              </Box>
            </Box>
            {worklistSetting !== null && worklistSetting !== undefined && (
              <TableContainer className="tablebox" component={Paper} onMouseLeave={onMouseLeaveEvent('worklistBool')}>
                <Table aria-label="worklist table" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '2%' }} align="center">
                        <input
                          type="checkbox"
                          name="select-all"
                          onChange={(e) => handleAllCheck(e.target.checked)}
                          // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                          checked={checkItems.length === worklistArr.length ? true : false}
                        />
                      </TableCell>
                      {worklistColumnArray.map((v: any, i: number) => {
                        if (worklistSetting[v.column]) {
                          if (
                            v.column === 'modality' ||
                            v.column === 'ReportStatus' ||
                            v.column === 'seriesCnt' ||
                            v.column === 'imageCnt' ||
                            v.column === 'VerifyFlag' ||
                            v.column === 'pSex' ||
                            v.column === 'PatAge'
                          ) {
                            return (
                              <TableCell key={i} align="center" sx={{ width: '4%', maxWidth: '100%' }}>
                                {v.name}
                              </TableCell>
                            );
                          } else if (
                            v.column === 'AI_Company' ||
                            v.column === 'AI_Score' ||
                            v.column === 'AI_Priority' ||
                            v.column === 'AI_Number_Of_Findings' ||
                            v.column === 'AI_Finding' ||
                            v.column === 'AI_Model_Name' ||
                            v.column === 'AI_Abnormal_YN'
                          ) {
                            return (
                              <TableCell key={i} align="center" sx={{ Width: '4%', maxWidth: '100%' }}>
                                {v.name}
                              </TableCell>
                            );
                          } else if (
                            v.column === 'pID' ||
                            v.column === 'pName' ||
                            v.column === 'RefPhysicianName' ||
                            v.column === 'InsName' ||
                            v.column === 'studyDate'
                          ) {
                            return (
                              <TableCell key={i} align="center" sx={{ width: '5%', maxWidth: '100%' }}>
                                {v.name}
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell key={i} align="center" sx={{ width: '15%', maxWidth: '100%' }}>
                                {v.name}
                              </TableCell>
                            );
                          }
                        }
                      })}
                    </TableRow>
                  </TableHead>
                  {worklistContextMenu.worklistBool && ContextMenu()}
                  <TableBody>
                    {worklistArr.length > 0 &&
                      worklistArr.map((row: any) => {
                        if (Number(row.imageCnt) > 0 && Number(row.seriesCnt) > 0) {
                          return (
                            <TableRow
                              key={row.studyKey}
                              onClick={() => {
                                handleWorklistItemClick(row);
                              }}
                              onDoubleClick={() => {
                                handleWorklistItemDoubleClick(row);
                              }}
                              onContextMenu={WorklistContextMenuButton({
                                row: {
                                  study_key: row.studyKey,
                                  study_instance_uid: row.studyInsUID,
                                  patient_id: row.pID,
                                },
                                bool: 'worklistBool',
                              })}
                            >
                              <TableCell align="center">
                                <input
                                  type="checkbox"
                                  name={`select-${row.studyKey}`}
                                  onChange={(e) => handleSingleCheck(e.target.checked, row.studyKey)}
                                  // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                                  checked={checkItems.includes(row.studyKey) ? true : false}
                                />
                              </TableCell>
                              {worklistColumnArray.map((v: any, i: number) => {
                                if (worklistSetting[v.column]) {
                                  if (v.column === 'ReportStatus') {
                                    return (
                                      <TableCell align="center" key={i}>
                                        {row[v.column] === 3
                                          ? t('TID00013')
                                          : row[v.column] === 5
                                          ? t('TID00015')
                                          : row[v.column] === 6
                                          ? t('TID00016')
                                          : row[v.column] === 9
                                          ? t('TID00017')
                                          : row[v.column] === 4
                                          ? t('TID00014')
                                          : t('TID00018')}
                                      </TableCell>
                                    );
                                  } else if (v.column === 'VerifyFlag') {
                                    return (
                                      <TableCell align="center" key={i}>
                                        {row[v.column] === 0 ? t('TID02823') : t('TID02822')}
                                      </TableCell>
                                    );
                                  } else {
                                    return (
                                      <TableCell align="center" key={i}>
                                        {row[v.column]}
                                      </TableCell>
                                    );
                                  }
                                }
                              })}
                            </TableRow>
                          );
                        }
                      })}
                    {worklistArr.length ? (
                      <TableRow>
                        <TableCell colSpan={worklistSettingLength} sx={{ width: '100%' }}>
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}
                          >
                            <Box>&nbsp;</Box>
                            <Box>
                              <Button
                                sx={{
                                  borderRadius: '15px',
                                  color: 'white',
                                  bgcolor: '#000000',
                                  marginRight: '12px',
                                  width: '100px',
                                  height: '28px',
                                  size: 'small',
                                  fontSize: '11px',
                                  border: '1px solid transparent',
                                  '&:hover': {
                                    transitionDelay: '0.1s',
                                    background: '#000000',
                                    border: '1px solid #a00000',
                                  },
                                }}
                                onClick={MoreButtonClick}
                                title={t('TID02824')}
                              >
                                <p
                                  style={{
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {t('TID02824')}
                                </p>
                                <ExpandMoreIcon sx={{ color: '#a00000', fontSize: '20px', ml: '5px' }} />
                              </Button>
                            </Box>
                            <Box>&nbsp;</Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ''
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
          <Box className="list2">
            <Box className={!isSmallScreen ? 'Previous' : 'Previous smallScreen'}>
              <h3 className="Previoustitle">{t('TID03146')}</h3>
              <Grid
                container
                sx={{
                  width: '100%',
                  mt: '14px',
                  ml: {
                    fullhd: '42px',
                    desktop: '15px',
                  },
                }}
              >
                {patientStudy.length ? (
                  <>
                    <Grid item={true} xs={6} md={6} className="PreviousPatientInformation">
                      {t('TID02821')}: {patientPastStudyList[0].pID ?? 'Unknown'}
                    </Grid>
                    <Grid item={true} xs={6} md={6} className="PreviousPatientInformation">
                      {t('TID02738')}: {patientPastStudyList[0].pName ?? 'Unknown'}
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item={true} xs={6} md={6} className="PreviousPatientInformation">
                      {t('TID02821')} :
                    </Grid>
                    <Grid item={true} xs={6} md={6} className="PreviousPatientInformation">
                      {t('TID02738')}:
                    </Grid>
                  </>
                )}
              </Grid>
              <TableContainer className="previousTable" component={Paper} sx={{ backgroundColor: '#393939' }}>
                <Table stickyHeader aria-label="previous table" onMouseLeave={onMouseLeaveEvent('pastListBool')}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ width: '10%' }}>
                        {t('TID00031')}
                      </TableCell>
                      <TableCell align="center" sx={{ width: '34%' }}>
                        {t('TID00045')}
                      </TableCell>
                      <TableCell align="center" sx={{ width: '11%' }}>
                        {t('TID00032')}
                      </TableCell>
                      <TableCell align="center" sx={{ width: '18%' }}>
                        {t('TID00033')}
                      </TableCell>
                      <TableCell align="center" sx={{ width: '8%' }}>
                        {t('TID00034')}
                      </TableCell>
                      <TableCell align="center" sx={{ width: '8%' }}>
                        {t('TID00035')}
                      </TableCell>
                      <TableCell align="center" sx={{ width: '11%' }}>
                        {t('TID02825')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {worklistContextMenu.pastListBool && ContextMenu()}
                  <TableBody>
                    {patientStudy !== undefined ? (
                      patientStudy.map((row: any) => (
                        <TableRow
                          key={row.studyKey}
                          onClick={() =>
                            setWorkListContextMenu({
                              ...worklistContextMenu,
                              pastListBool: false,
                            })
                          }
                          onDoubleClick={() => handleWorklistItemDoubleClick(row)}
                          onContextMenu={WorklistContextMenuButton({
                            row: {
                              study_key: row.studyKey,
                              study_instance_uid: row.studyInsUID,
                              patient_id: row.pID,
                            },
                            bool: 'pastListBool',
                          })}
                        >
                          <TableCell align="center">{row.modality}</TableCell>
                          <TableCell align="center">{row.studyDesc}</TableCell>
                          <TableCell align="center">{row.studyDate}</TableCell>
                          <TableCell align="center">
                            {row.ReportStatus === 3
                              ? t('TID00013')
                              : row.ReportStatus === 5
                              ? t('TID00015')
                              : row.ReportStatus === 6
                              ? t('TID00016')
                              : row.ReportStatus === 9
                              ? t('TID00017')
                              : row.ReportStatus === 4
                              ? t('TID00014')
                              : t('TID00018')}
                          </TableCell>
                          <TableCell align="center">{row.seriesCnt}</TableCell>
                          <TableCell align="center">{row.imageCnt}</TableCell>
                          <TableCell align="center">{row.VerifyFlag === 0 ? t('TID02823') : t('TID02822')}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>&nbsp;</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <WorklistReportBox row={selectedRow} />
          </Box>
        </Box>
      </WorkListCss>
    </ThemeProvider>
  );
};

export default WorkList;
