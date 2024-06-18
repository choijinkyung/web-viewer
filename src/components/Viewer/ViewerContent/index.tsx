import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import WadoImageLoader from '@components/Viewer/WadoImageLoader';
// import Toolbar from '@components/Viewer/Toolbar';
import { RootState } from '@store/index';
import { ViewerContentCss } from './styles';
import { useParams } from 'react-router';
import ViewerMenu from '@components/Viewer/ViewerMenu';
import axios from 'axios';
import { Call } from '@utils/JwtHelper';
import dicomParser, { DataSet } from 'dicom-parser';
import { setChoiceToolChange, setGSPSBoolChange, setGSPSURIChange, setPalyClipModalChnage, setToolChange } from '@store/Tool';
import { hangingActions } from '@store/hanging';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ClipLoader } from 'react-spinners';
import {

  setSeriesValueChange,
  setOneSeriesStartNumberChange,
  setSeriesChange,
  setSeriesStorageChange,
  setDefaultSeriesStorageChange,
  setComparisonSeriesStorageChange,
  setSeriesElementChange,
  setOneSeriesBoolChange,
} from '@store/series';
import {
  setImageLayoutChange,
  setImageLayoutDoubleClickBoolChange,
  setImageLayoutElementNumberChange,
  setImageLayoutViewNumberChange,
} from '@store/imagelayout';
import {
  setComparisonDoubleClickBoolChange,
  // setImageLoaderTypeChnage,
  setComaprisonSeriesValueChange,
  setComparisonImageLayoutDoubleClickBool,
  setComparisonImageLayoutElementNumber,
  setComparisonWadoElementNumberChange,
  setComparisonSeriesChange,
  setComparisonOneSeriesStartNumberChange,
  setComparisonImageLayoutViewNumberChange,
  setComparisonImgaeLayoutChange,
  setComparisonCheckBoolChange,
} from '@store/comparison';
import { setSelectedStudyType } from '@store/viewerStatus';

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { setViewerContextMenuBool, setDicomHeaderModalBool } from '@store/modal';
import DicomHeaderModal from '@components/Modal/DicomHeaderModal';
import { Box, Modal } from '@mui/material';
import { ToolChain } from '@components/Viewer/ArrChain';
import { wado, contextMenuLocation } from '@typings/etcType';
import keyboardController from '@utils/keyboardController';
import mouseWheelController from '@utils/mouseWheelController';
import ToolController from '@utils/ToolController';
import DoubleClickController from '@utils/DoubleClickController';
import TouchController from '@utils/TouchController';
import { setContextMenuLocationChange, setSpinnerChange, setWadoElementInfoChange } from '@store/viewer';
import { useTranslation } from 'react-i18next';
import DecryptAES256 from '@utils/DecryptAES256';
import { debounce } from 'lodash';
import { createBrowserHistory } from "history";


const Toolbar = React.lazy(() => import('@components/Viewer/Toolbar'));
const WadoImageLoader = React.lazy(() => import('@components/Viewer/WadoImageLoader'));
const ImageLayoutWadoImageLoader = React.lazy(() => import('@components/Viewer/ImageLayoutWadoImageLoader'))
const ViewerContent = () => {
  const call = new Call();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { study_key } = useParams();
  const WadoBoxRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const customHistory = createBrowserHistory();
  const { tool, choiceTool, gspsBool, gspsURI, toolChangeCheckBool } = useSelector(
    (state: RootState) => state.tool.toolbar,
  );
  const { contextMenuLocation, wadoElementInfo, spinner } = useSelector((state: RootState) => state.viewer.viewer);
  const { imageLayout } = useSelector(
    (state: RootState) => state.imagelayout.imagelayout,
  );
  const { imageLayout: firstImageLayout, imageLayoutDoubleClickBool: firstImageLayoutDoubleClickBool, imageLayoutElementNumber, imageLayoutViewStartNumber } = useSelector((state: RootState) => state.studyStatus[0].imageLayout)

  const {
    comparisonCheckBool,
    comparisonStudyKey,
    comparisonSeries,
    comparisonImageLayout,
    ComparisonseriesDoubleClickBool,
    comparisonSeriesMin,
    comparisonSeriesMax,
    comparisonImageLayoutDoubleClickBool,
    comparisonImageLayoutElementNumber,
    comparisonOneSeriesStartNumber,
    comparisonWadoElementNumber,
    comparisonImageLayoutViewNumber,
  } = useSelector((state: RootState) => state.comparison.comparison);
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)

  const {
    series,
    oneSeries,
    comparisonOneSeries,
    comparisonSeriesStorage,
  } = useSelector((state: RootState) => state.serieslayout.seriesLayout);
  ///////
  const { seriesLayout: firstStudySeriesLayout,
    seriesDoubleClickBool,
    selectedElementNumber,
    seriesMin,
    seriesMax,
    seriesStorage,
    oneSeriesStartNumber: firstStudyOneSeriesStartNumber,
    isOneSeries: firstStudyIsOneSeries
  } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { seriesElementNumber: firstStudyseriesElementNumber } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  //////
  const { viewerContextMenuBool, dicomHeaderModalBool } = useSelector((state: RootState) => state.modal.modal);
  const { toolBoxBool } = useSelector((state: RootState) => state.setting.setting);
  const [imageLayoutElementBorderActive, setImageLayoutElementBorderActive] = useState<HTMLDivElement | null>(null);
  const [dicomHeaderInfo, setDicomHeaderInfo] = useState<object | null>(null);
  const [firstRandering, setFirstRandering] = useState(false); //첫 마운트 카운트용
  const [imageLayoutBool, setImageLayoutBool] = useState(false); // 이미지 레이아웃 분기용 Boolen (이미지 레이아웃 1x1 = false or !1x1 =true)
  const [comparisonImageLayoutBool, setComparisonImageLayoutBool] = useState(false); //비교검사 이미지레이아웃 분기용 Boolean (이미지 레이아웃이 1x1 = false or !1x1 = true)
  const [loadingSpinnerCount, setLoadingSpinnerCount] = useState(0); // viewer 스피너를 조절하기 위한 상태값
  const [comparisonLoadingSpinnerCount, setComparisonLoadingSpinnerCount] = useState(0);
  const [imageLayoutState, setImageLayoutState] = useState({
    imageurl: '',
  });
  const [comparisonImageLayoutState, setComparisonImageLayoutState] = useState({
    imageurl: '',
  });
  const [wadouri, setWadouri] = useState<wado>({
    series: [],
    oneSeries: [],
  });
  const [comparisonWadoURI, setComparisonWadoURI] = useState<wado>({
    series: [],
    oneSeries: [],
  });
  const [comparisonGspsData, setComparisonGspsData] = useState([]);
  const [gspsData, setGspsData] = useState([]);
  const [gspsLengthCheckBool, setGspsLengthCheckBool] = useState(false);
  const [comparisonGspsLengthCheckBool, setComparisonGspsLengthCheckBool] = useState(false);
  const [toolSetting, setToolSetting] = useState();

  const [lastTouchTime, setLastTouchTime] = useState(0);

  /**
   * 시리즈 || 이미지를 키보드 up/down 을 통해 넘길수 있게 만든 컴포넌트
   */
  keyboardController({
    wadouri: { series: wadouri.series, oneSeries: wadouri.oneSeries },
    comparisonWadoURI: { series: comparisonWadoURI.series, oneSeries: comparisonWadoURI.oneSeries },
    imageLayoutBool,
    comparisonImageLayoutBool,
    imageLayoutState,
    comparisonImageLayoutState,
  });
  /**
   * 원시리즈 || 이미지 레이아웃 시 마우스 휠을 통해 이미지를 넘길수 있게 만든 컴포넌트
   */
  mouseWheelController({
    wadouri: { series: wadouri.series, oneSeries: wadouri.oneSeries },
    comparisonWadoURI: { series: comparisonWadoURI.series, oneSeries: comparisonWadoURI.oneSeries },
    imageLayoutBool,
    comparisonImageLayoutBool,
    imageLayoutState,
    comparisonImageLayoutState,
  });
  /**
   * 툴기능 들을 모아 놓은 컴포넌트
   */
  ToolController({
    wadouri: { series: wadouri.series, oneSeries: wadouri.oneSeries },
    comparisonWadoURI: { series: comparisonWadoURI.series, oneSeries: comparisonWadoURI.oneSeries },
    imageLayoutElementBorderActive,
    firstRandering,
  });
  /**
   * 이미지 더블클릭 시 1x1 || 원래있던 nxn으로 넘어가는 기능을 넣어놓은 컴포넌트
   */
  DoubleClickController({
    firstRandering,
    wadouri: { series: wadouri.series, oneSeries: wadouri.oneSeries },
    comparisonWadoURI: { series: comparisonWadoURI.series, oneSeries: comparisonWadoURI.oneSeries },
  });

  /**
   * 원시리즈 || 이미지 레이아웃 시 터치를 통해 이미지를 넘길수 있게 만든 컴포넌트
   */
  TouchController({
    wadouri: { series: wadouri.series, oneSeries: wadouri.oneSeries },
    comparisonWadoURI: { series: comparisonWadoURI.series, oneSeries: comparisonWadoURI.oneSeries },
    imageLayoutBool,
    comparisonImageLayoutBool,
    imageLayoutState,
    comparisonImageLayoutState,
  });

  /**
   * 로딩바(Spinner)를 위해 자식컴포넌트에게서 호출 받고 실행되는 함수 (default용)
   */
  const handleChildDataLoaded = useCallback(() => {
    setLoadingSpinnerCount((loadingSpinnerCount) => loadingSpinnerCount + 1); // 로딩 완료된 자식 컴포넌트 수 증가
  }, [loadingSpinnerCount]);

  /**
   * 로딩바(Spinner)를 위해 자식컴포넌트에게서 호출 받고 실행되는 함수 (comparison용)
   */
  const handleComparisonChildDataLoaded = useCallback(() => {
    setComparisonLoadingSpinnerCount((comparisonLoadingSpinnerCount) => comparisonLoadingSpinnerCount + 1); // 로딩 완료된 자식 컴포넌트 수 증가
  }, [comparisonLoadingSpinnerCount]);

 
  /**
   * Element 클릭 시 active(테두리 Red)효과를 주는 함수
   */
  const onWadoElementClick = useCallback(
    (event: any) => {
      let elementNumber = null;
      const parent = event.target.closest('.parentDiv');
      const parentValueNumber = Number(parent.dataset.value);
      const wadoElement = parent.querySelector('.wadoElement');
      const comparisonCheck = parent.classList.value.includes('comparison');
      const timeNow = Date.now();

      //우클릭 모달 off
      if (viewerContextMenuBool) {
        dispatch(setViewerContextMenuBool(false));
      }

      // if (sessionStorage.getItem('mobile') === 'true') {
      //   if (timeNow - lastTouchTime < 250) {
      //     // 300ms 내에 두 번 터치했는지 확인
      //     onWadoElementDoubleClick(event);
      //     event.preventDefault(); // 다음 터치 이벤트를 막음 (옵션)
      //   }
      //   setLastTouchTime(timeNow); // 마지막 터치 시간 업데이트
      // }
      //박스에 다이콤 이미지가 없으면 return
      if (wadoElement === null || wadoElement === undefined) {
        return;
      }

      //비교검사 loader 와 일반 loader 구분
      if (comparisonCheck) {
        if (selectedStudyType !== 'comparison') {
          dispatch(setSelectedStudyType('comparison'));
        }
        if (comparisonWadoElementNumber === parentValueNumber) {
          return;
        } else {
          dispatch(setComparisonWadoElementNumberChange(parentValueNumber));
        }
      } else {
        if (selectedStudyType !== 'default') {
          dispatch(setSelectedStudyType('default'));
        }
        if (firstStudyseriesElementNumber === parentValueNumber) {
          return;
        } else {
          dispatch({ type: 'setSeriesElementNumber/0', payload: parentValueNumber })
        }
      }
    },
    [
      viewerContextMenuBool,
      firstStudyseriesElementNumber,
      comparisonWadoElementNumber,
      selectedStudyType,
      lastTouchTime,
    ],
  );

  /**
   * Element 더블클릭 시 발동하는 함수
   */
  const onWadoElementDoubleClick = useCallback(
    (event: any) => {
      const playClipCheck = event.target.closest('.playClipModal');
      if (playClipCheck !== null && playClipCheck !== undefined) {
        return;
      }
      if (tool === 'TextMarker') {
        return;
      }
      const parent = event.target.closest('.parentDiv');
      const parentNumber = Number(parent.dataset.value);
      const wadoElement = parent.querySelector('.wadoElement');
      const comparisonCheck = parent.classList.value.includes('comparison');
      if (wadoElement === null || wadoElement === undefined) {
        return;
      }
      if (selectedStudyType === 'default') {
        if (firstStudyIsOneSeries) {
          if (parentNumber >= wadouri.oneSeries.length) {
            alert(t('TID03050'));
            return;
          } else if (seriesDoubleClickBool && selectedElementNumber !== 0) {

            dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: !seriesDoubleClickBool, selectedElementNumber: 0 } })
            dispatch({ type: 'setSeriesLayout/0', payload: seriesStorage });
            return;
          }
        } else {
          if (parentNumber >= wadouri.series.length) {
            alert(t('TID03050'));
            return;
          }
        }
      } else if (selectedStudyType === 'comparison') {
        if (comparisonOneSeries) {
          if (parentNumber >= comparisonWadoURI.oneSeries.length) {
            alert(t('TID03050'));
            return;
          } else if (ComparisonseriesDoubleClickBool) {
         

            dispatch(setComparisonDoubleClickBoolChange(!ComparisonseriesDoubleClickBool));
            dispatch(setComparisonSeriesChange(comparisonSeriesStorage));
           

            return;
          }
        } else {
          if (parentNumber >= comparisonWadoURI.series.length) {
            alert(t('TID03050'));
            return;
          }
        }
      }
      if (selectedStudyType === 'default') {
        if (!seriesDoubleClickBool) {
          if (Number(firstStudySeriesLayout[0]) === 1 && Number(firstStudySeriesLayout[1]) === 1) {
            dispatch({ type: 'setSeriesStorage/0', payload: [2, 2] })

            dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: !seriesDoubleClickBool } })

            dispatch({ type: 'setSeriesLayout/0', payload: seriesStorage });
            return;
          } else {
            dispatch({ type: 'setSeriesStorage/0', payload: firstStudySeriesLayout })
          }
          dispatch({ type: 'setSeriesLayout/0', payload: [1, 1] });
        } else {
          dispatch({ type: 'setSeriesLayout/0', payload: seriesStorage });
        }
      } else if (selectedStudyType === 'comparison') {
        if (!ComparisonseriesDoubleClickBool) {
          if (Number(comparisonSeries[0]) === 1 && Number(comparisonSeries[1]) === 1) {
            dispatch(setComparisonSeriesStorageChange([2, 2]));
            dispatch(setComparisonSeriesChange(comparisonSeriesStorage));
            dispatch(setComparisonDoubleClickBoolChange(!ComparisonseriesDoubleClickBool));
            return;
          } else {
            dispatch(setComparisonSeriesStorageChange(comparisonSeries));
          }
          dispatch(setComparisonSeriesChange([1, 1]));
        } else {
          dispatch(setComparisonSeriesChange(comparisonSeriesStorage));
        }
      }

      if (selectedStudyType === 'default') {
        if (seriesDoubleClickBool) {
          if (parentNumber >= seriesMax || parentNumber <= seriesMin) {
            const multiplySeries = Number(seriesStorage[0] * seriesStorage[1]);
            const MinValue = Number(parentNumber - (parentNumber % multiplySeries));
            dispatch({ type: 'setSeriesViewRange/0', payload: { min: MinValue, max: MinValue + multiplySeries } })

          }
        }
        dispatch({ type: 'setSeriesElementNumber/0', payload: parentNumber })

        dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: !seriesDoubleClickBool, selectedElementNumber: parentNumber } })


      } else if (selectedStudyType === 'comparison') {
        if (ComparisonseriesDoubleClickBool) {
          if (parentNumber >= comparisonSeriesMax || parentNumber <= comparisonSeriesMin) {
            const multiplySeries = Number(comparisonSeriesStorage[0] * comparisonSeriesStorage[1]);
            const MinValue = Number(parentNumber - (parentNumber % multiplySeries));
            dispatch(
              setComaprisonSeriesValueChange({
                comparisonSeriesMin: MinValue,
                comparisonSeriesMax: MinValue + multiplySeries,
              }),
            );
          }
        }
        dispatch(setComparisonWadoElementNumberChange(parentNumber));
        dispatch(setComparisonDoubleClickBoolChange(!ComparisonseriesDoubleClickBool));
      }
    },
    [
      seriesDoubleClickBool,
      dispatch,
      wadouri,
      firstStudyIsOneSeries,
      selectedElementNumber,
      firstStudyOneSeriesStartNumber,
      seriesMax,
      seriesMin,
      seriesStorage,
      comparisonSeriesStorage,
      seriesStorage,
      comparisonWadoElementNumber,
      comparisonCheckBool,
      selectedStudyType,
      comparisonSeriesMax,
      comparisonSeriesMin,
      ComparisonseriesDoubleClickBool,
      comparisonOneSeries,
      tool,
    ],
  );

  /**
   * handleChildDataLoaded함수로 증가된 loadingSpinnerCount읙 수와 wadouri.series의 수를 비교하여 같은값일때 loading spinner가 꺼지게 조정하는 이펙트
   */
  useEffect(() => {
    // if (firstRandering) {
    if (wadouri.series.length) {
      const wadoURILength = wadouri.series.filter((v: any) => {
        if (v.length > 0) {
          return true;
        } else {
          return false;
        }
      }).length;
      if (loadingSpinnerCount >= wadoURILength) {
        dispatch(setSpinnerChange(false));
        setLoadingSpinnerCount(0);
      }
    }
    // }
  }, [loadingSpinnerCount, wadouri]);

  /**
   * handleChildDataLoaded함수로 증가된 loadingSpinnerCount읙 수와 ComparisonWadouri.series의 수를 비교하여 같은값일때 loading spinner가 꺼지게 조정한다
   */
  useEffect(() => {
    if (comparisonWadoURI.series.length) {
      const ComparisonWadoURILength = comparisonWadoURI.series.filter((v: any) => {
        if (v.length > 0) {
          return true;
        } else {
          return false;
        }
      }).length;
      if (comparisonLoadingSpinnerCount >= ComparisonWadoURILength) {
        dispatch(setSpinnerChange(false));
        setComparisonLoadingSpinnerCount(0);
      }
    }
  }, [comparisonWadoURI, comparisonLoadingSpinnerCount]);

  /**
   * 우클릭(ContextMenu) 버튼 함수
   */
  const onContextMenuClick = useCallback(
    (event: any) => {
      event.preventDefault();
      const parent = event.target.closest('.parentDiv');
      const parentValueNumber = Number(event.target.closest('.parentDiv').dataset.value);
      const wadoElement = parent.querySelector('.wadoElement');
      let url;
      if (wadoElement === null || wadoElement === undefined) {
        return;
      }
      if (!wadoElement.classList.value.includes(selectedStudyType)) {
        if (selectedStudyType === 'default') {
          dispatch(setSelectedStudyType('comparison'));
          dispatch(setComparisonWadoElementNumberChange(parentValueNumber));
        } else {
          dispatch(setSelectedStudyType('default'));
          dispatch({ type: 'setSeriesElementNumber/0', payload: parentValueNumber })

        }
      } else {
        if (selectedStudyType === 'default') {
          dispatch({ type: 'setSeriesElementNumber/0', payload: parentValueNumber })
        } else {
          dispatch(setComparisonWadoElementNumberChange(parentValueNumber));
        }
      }
      if (wadoElement !== null) {
        const value = cornerstone.getEnabledElement(wadoElement);
        const slice = value.image?.imageId.split('dicom/');
        if (slice !== undefined) {
          url = slice[1];
        }
      }
      dispatch(setWadoElementInfoChange(url));
      const x = event.pageX + 'px';
      const y = event.pageY + 'px';
      dispatch(
        setContextMenuLocationChange({
          x: x,
          y: y,
        }),
      );
      dispatch(setViewerContextMenuBool(true));
    },
    [contextMenuLocation, selectedStudyType],
  );

  /**
   * ContextMenu가 켜진 상태에서 마우스가 박스를 벗어났을때의 상태값 변경 함수
   */
  const onMouseLeaveEvent = useCallback(() => {
    dispatch(setViewerContextMenuBool(false));
  }, []);

  /**
   * ContextMenu 모달 이미지 삭제 버튼 함수
   */
  const onDeleteImage = useCallback(
    (event: any) => {
      if (confirm(t('TID02716'))) {
        if (wadoElementInfo !== null) {
          const uriCopy: any = selectedStudyType === 'default' ? wadouri : comparisonWadoURI;
          const studyKey = Number(String(wadoElementInfo).split('/')[1]);
          const series = Number(String(wadoElementInfo).split('/')[3]);
          const imageKey = Number(String(wadoElementInfo).split('/')[5]);
          call
            .delete(`/api/v1/dicom/studyKey/${studyKey}/seriesKey/${series}/imageKey/${imageKey}`, t('TID03051'))
            .then((response) => {
              alert(response);
              window.location.reload();
            });
        } else {
          alert(t('TID03052'));
        }
      } else {
        alert(t('TID02717'));
      }
      dispatch(setViewerContextMenuBool(false));
    },
    [study_key, selectedStudyType, wadoElementInfo, wadouri, comparisonWadoURI],
  );

  /**
   * ContextMenu 모달 다이콤 헤더값 보기 버튼 함수
   */
  const handleDicomHeaderModal = useCallback(async () => {
    const element =
      selectedStudyType === 'default'
        ? firstStudyIsOneSeries
          ? document.getElementsByClassName(`default${firstStudyseriesElementNumber + firstStudyOneSeriesStartNumber}`)[0]
          : !imageLayoutBool
            ? document.getElementsByClassName(`default${firstStudyseriesElementNumber}`)[0]
            : document.getElementsByClassName(`default${imageLayoutElementNumber}`)[0]
        : comparisonOneSeries
          ? document.getElementsByClassName(
            `comparison${comparisonWadoElementNumber + comparisonOneSeriesStartNumber}`,
          )[0]
          : !comparisonImageLayoutBool
            ? document.getElementsByClassName(`comparison${comparisonWadoElementNumber}`)[0]
            : document.getElementsByClassName(`comparison${comparisonImageLayoutElementNumber}`)[0];

    if (
      element === undefined ||
      (element === null && ((!firstStudyIsOneSeries && !imageLayoutBool) || (!comparisonOneSeries && !comparisonImageLayoutBool)))
    ) {
      alert(t('TID03050'));
      return;
    }
    let Index;
    if (selectedStudyType === 'default') {
      if (!firstStudyIsOneSeries && !imageLayoutBool) {
        Index = await cornerstoneTools.getToolState(element, 'stack').data[0].currentImageIdIndex;
      }
    } else if (selectedStudyType === 'comparison') {
      if (!comparisonOneSeries && !comparisonImageLayoutBool) {
        Index = await cornerstoneTools.getToolState(element, 'stack').data[0].currentImageIdIndex;
      }
    }
    const elementNumber =
      selectedStudyType === 'default'
        ? firstStudyIsOneSeries
          ? firstStudyseriesElementNumber + firstStudyOneSeriesStartNumber
          : !imageLayoutBool
            ? firstStudyseriesElementNumber
            : imageLayoutElementNumber + imageLayoutViewStartNumber
        : comparisonOneSeries
          ? comparisonWadoElementNumber + comparisonOneSeriesStartNumber
          : !comparisonImageLayoutBool
            ? comparisonWadoElementNumber
            : comparisonImageLayoutElementNumber + comparisonImageLayoutViewNumber;
    dispatch(setViewerContextMenuBool(false));
    if (
      (Index !== undefined && Index !== null) ||
      firstStudyIsOneSeries ||
      imageLayoutBool ||
      comparisonOneSeries ||
      comparisonImageLayoutBool
    ) {
      const wadoURI =
        selectedStudyType === 'default'
          ? !firstStudyIsOneSeries && !imageLayoutBool
            ? wadouri.series[elementNumber][Index].split(':')[1]
            : !imageLayoutBool
              ? wadouri.oneSeries[Number(elementNumber)].split(':')[1]
              : imageLayoutState.imageurl[elementNumber].split(':')[1]
          : !comparisonOneSeries && !comparisonImageLayoutBool
            ? comparisonWadoURI.series[elementNumber][Index].split(':')[1]
            : !comparisonImageLayoutBool
              ? comparisonWadoURI.oneSeries[Number(elementNumber)].split(':')[1]
              : comparisonImageLayoutState.imageurl[elementNumber].split(':')[1];
      await axios.get(wadoURI, { responseType: 'blob' }).then((response) => {
        response.data.arrayBuffer().then((arrayBuffer: any) => {
          let dataSet: DataSet | null = dicomParser.parseDicom(new Uint8Array(arrayBuffer));
          dispatch(setDicomHeaderModalBool(true));
          setDicomHeaderInfo(dataSet);
          arrayBuffer = null;
          dataSet = null;
        });
      });
    } else {
      alert(t('TID03050'));
    }
  }, [
    dicomHeaderInfo,
    wadouri,
    firstStudyIsOneSeries,
    firstStudyseriesElementNumber,
    comparisonImageLayoutState,
    imageLayoutState,
    selectedStudyType,
    imageLayoutElementNumber,
    comparisonImageLayoutElementNumber,
    firstStudyOneSeriesStartNumber,
    comparisonWadoElementNumber,
    comparisonOneSeriesStartNumber,
    imageLayoutElementNumber,
    comparisonImageLayoutViewNumber,
    imageLayoutViewStartNumber,
    comparisonImageLayoutElementNumber,
  ]);

  /**
   * 다이콤 파일 url 불러오는 로직
   */
  async function getInstanceList(series_key: string, studyKey: number) {
    let response = null;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    };
    await call.get(`/api/v1/worklists/studies/${studyKey}/series/${series_key}`).then((res) => {
      response = res.data;
    });
    return response;
  }
  const [wadoBool, setWadoBool] = useState(false);

  function stateLogic(value: any) {
    const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
    const filterURI: any = [];
    const gsps: any = [];
    const filterGSPS: any = {};
    const gspsuri: any = [];
    value.forEach((v: any) => {
      if (!filterGSPS[v.SERIES_KEY]) {
        filterGSPS[v.SERIES_KEY] = [];
      }
      filterGSPS[v.SERIES_KEY].push(v);
    });

    value.forEach((v: any, i: number) => {
      const uri = `wadouri:/api/v1/dicom/studies/${v.STUDY_KEY}/series/${v.SERIES_KEY}/instances/${v.IMAGE_KEY}`;
      gspsuri.push(uri);
      const content = JSON.parse(v.PR_CONTENT).GraphicObjectSequence;
      if (content !== null && content !== undefined) {
        content.forEach((j: any) => {
          filterURI.push(uri);
          const graphicData = j.GraphicData.map((data: any) => {
            return { x: data.Column, y: data.Row, highlight: true, active: true };
          });
          const color = JSON.parse(sessionStorage.getItem('color') as string).gsps;
          gsps.push({
            active: false,
            area: 18498.43594301857,
            canComplete: false,
            color: color !== undefined && color !== null ? color : '#fff',
            handles: {
              invalidHandlePlacement: false,
              points: graphicData,
              textBox: {
                active: false,
                allowedOutsideImage: true,
                boundingBox: {},
                drawnIndependently: true,
                hasBoundingBox: true,
                hasMoved: false,
                movesIndependently: false,
                x: 1934.8782296225966,
                y: 1043.6954459203034,
              },
              highlight: false,
              invalidated: false,
            },
            highlight: false,
            invalidated: false,
            meanStdDev: {
              count: 904618,
              mean: 2997.260197121879,
              variance: 247494.66898078658,
              stdDev: 497.4883606485549,
            },
            meanStdDevSUV: undefined,
            polyBoundingBox: {
              left: 833.3962561880614,
              top: 471.7267552182163,
              width: 1101.4819734345351,
              height: 1143.9373814041744,
            },
            unit: '',
            uuid: 'e6f500d8-4db5-4547-972b-6891851e4c27',
            visible: true,
          });
        });
      }
    });
    if (filterURI.length > 0) {
      filterURI.forEach((v: any, i: number) => {
        toolStateManager.addImageIdToolState(v, 'FreehandRoi', gsps[i]);
      });
      // cornerstoneTools.removeToolForElement(element, 'FreehandRoi');

      // cornerstone.updateImage(element,true);
      // handleStackScrollTool(props.imageurl);
      // handleStackScrollMouseWheel(props.imageurl);
    }
    dispatch(setGSPSURIChange(gspsuri));
  }

  /**
   * GSPS를 실행하기 위한 함수
   */
  const HandleGSPS = useCallback(
    async (value: number) => {
      // FreehandRoiTool을 추가하고 활성화합니다.
      if (gspsBool) {
        cornerstoneTools.addTool(cornerstoneTools.FreehandRoiTool);
        cornerstoneTools.setToolActive('FreehandRoi', { isTouchActive: false });

        if (value === 0) {
          stateLogic(gspsData);
        } else if (value === 1) {
          stateLogic(comparisonGspsData);
        }
        if (!firstStudyIsOneSeries) {
          setTimeout(() => {
            cornerstoneTools.addTool(cornerstoneTools.StackScrollTool);
            cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 });
          }, 500);
        }
      } else {
        const ToolStateObj = cornerstoneTools.globalImageIdSpecificToolStateManager.toolState;
        const ObjKey = Object.keys(ToolStateObj);
        const ToolNameObj: any = [];
        gspsURI.forEach((key) => {
          if (ToolStateObj[key] && ToolStateObj[key].FreehandRoi) {
            // key와 FreehandRoi가 있는지 확인
            if (Object.keys(ToolStateObj[key]).length === 1) {
              // FreehandRoi만 있는지 확인
              cornerstoneTools.globalImageIdSpecificToolStateManager.clearImageIdToolState(key);
            } else {
              cornerstoneTools.globalImageIdSpecificToolStateManager.setImageIdToolState(key, 'FreehandRoi', {
                data: [],
              });
            }
          }
        });
        // for (let i = 0; i < ObjKey.length; i++) {
        //   // cornerstoneTools.globalImageIdSpecificToolStateManager.clearImageIdToolState(ObjKey[i])
        //   cornerstoneTools.globalImageIdSpecificToolStateManager.setImageIdToolState(ObjKey[i],'FreehandRoi',{data:[]})
        // }
        if (!firstStudyIsOneSeries) {
          setTimeout(() => {
            cornerstoneTools.addTool(cornerstoneTools.StackScrollTool);
            cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 });
          }, 500);
        }
        // testAnnotation()
      }
    },
    [gspsBool, gspsData, comparisonGspsData, gspsURI],
  );

  useEffect(() => {
    if (!firstRandering) {
      setAnnotation();
    }
  }, []);

  /**
   * 브라우저 뒤로가기 감지 이펙트
   */
  useEffect(() => {
    // 뒤로 가기 이벤트를 감지하는 함수
    const handlePopState = (event: any) => {
      cornerstone.imageCache.purgeCache();
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
      if (selectedStudyType !== 'default') {
        dispatch(setSelectedStudyType('default'));
      }
      dispatch(setPalyClipModalChnage(false));
      //이미지 레이아웃 실행중일 시 초기화
      if (firstImageLayout[0] * firstImageLayout[1] !== 1) {
        dispatch({ type: 'setImageLayoutDoubleClickBool/0', payload: false })
        dispatch({ type: 'setImageLayout/0', payload: [1, 1] })
      }
    };
    // popstate 이벤트 리스너 추가
    window.addEventListener('popstate', handlePopState);
    return () => {
      setTimeout(() => {
        window.removeEventListener('popstate', handlePopState);
      }, 500);
    };
  }, [firstStudyIsOneSeries, gspsBool, comparisonCheckBool, selectedStudyType, firstImageLayout]);

  /**
   * Annotation을 api를 호출하여 값을 가져와 cornerstone toolState에 넣어주는 로직
   */
  async function setAnnotation() {
    const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    const user_id: any = DecryptAES256(userID);
    let AnnoData: any;

    try {
      await call.get(`/api/v1/annotation/${user_id}/${study_key}`).then(({ data }) => {
        if (data.length) {
          AnnoData = JSON.parse(data[0].A_DATA);
        } else {
          throw new Error('No data available');
        }
      });
    } catch (error) {
      console.error(error);
      return;
    }

    const length = Object.keys(toolStateManager.toolState).filter((v: any) => {
      if (AnnoData[v]) {
        return v;
      } else {
        false;
      }
    });
    if (length.length < 1) {
      const uri = [];
      for (const key in AnnoData) {
        uri.push(key);
      }

      // toolStateManager.addImageIdToolState(v, 'FreehandRoi', gsps[i]);
      uri.forEach((v: any) => {
        const tools = [];
        for (const tool in AnnoData[v]) {
          tools.push(tool);
        }
        if (tools.length > 0) {
          tools.forEach((j: any) => {
            AnnoData[v][j].data.forEach(async (value: any) => {
              await toolStateManager.addImageIdToolState(v, j, value);
            });
          });
        }
      }, []);
    }
  }

  useEffect(() => {
    if (firstRandering) {
      HandleGSPS(0);
    } else {
      HandleGSPS(0);
    }
  }, [gspsBool]);

  useEffect(() => {
    console.log('seriesDoubleClickBool', seriesDoubleClickBool, ' element', selectedElementNumber)
  }, [seriesDoubleClickBool])

  useEffect(() => {
    if (firstRandering && comparisonCheckBool && gspsBool && comparisonGspsData.length > 0) {
      HandleGSPS(1);
    }
  }, [comparisonCheckBool, gspsBool, comparisonGspsData]);

  /*
   * 다이콤 파일 url 불러오는 로직
   * studyKey : 불러올 study_key 의 Number
   * value : 0 or 1 의 값을 주어 비교검사의 study와 일반검사의 study를 구분하기 위한 값
   *         일반검사 0 / 비교검사 1
   */
  async function getSeriesList(studyKey: any, value: number) {
    const user_id = JSON.parse(localStorage.getItem('user') as string).USERID;
    const userID = DecryptAES256(user_id);
    await call.get(`/api/v1/worklists/studies/${studyKey}`).then(async ({ data }) => {
      if (data === null || data === undefined || data.length === 0) {
        setWadouri({
          series: [],
          oneSeries: [],
        });
        return;
      }
      const { data: gsps } = await call.get(`/api/v1/gsps?studyKey=${studyKey}`);
      // const {data :gspsText} = await call.get(`/api/v1/gsps/text?studyKey=${studyKey}`);
      if (gsps !== null && gsps !== undefined && gsps.length > 0) {
        if (value === 0) {
          setGspsData(gsps);
          setGspsLengthCheckBool(true);
        } else if (value === 1) {
          setComparisonGspsData(gsps);
          setComparisonGspsLengthCheckBool(true);
        }
      } else {
        if (value === 0) {
          setGspsData([]);
          setGspsLengthCheckBool(false);
        } else if (value === 1) {
          setComparisonGspsData([]);
          setComparisonGspsLengthCheckBool(false);
        }
      }
      let oneSeriesArray: any = [];
      let modalityType: any = data[0].modality;
      // const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

      /**
       * 2024/02/14
       * promise.all 사용 시 순서대로 배열이 저장되지 않는일이 발생 로직 변경
       */
      // const series = await Promise.all(
      //   data.map(async (series: any, index: number) => {
      //     const { seriesKey } = series;
      //     const instanceList: any = await getInstanceList(seriesKey, studyKey);
      //     const instanceArr = instanceList.map((instance: any) => {
      //       const { studyKey, seriesKey, imageKey } = instance;

      //       const url = `wadouri:/api/v1/dicom/studies/${studyKey}/series/${seriesKey}/instances/${imageKey}`;
      //       oneSeriesArray.push(url);
      //       return url;
      //     });
      //     // instanceArr.sort(collator.compare);
      //     return instanceArr;
      //   }),
      // );
      const series = [];
      let seriesLengthArr={}
      for (let index = 0; index < data.length; index++) {
        const { seriesKey } = data[index];
        const instanceList: any = await getInstanceList(seriesKey, studyKey);
        const instanceArr = instanceList.map((instance: any) => {
          const { studyKey, seriesKey, imageKey } = instance;
          const url = `wadouri:/api/v1/dicom/studies/${studyKey}/series/${seriesKey}/instances/${imageKey}`;
          oneSeriesArray.push(url);
          return url;
        });
        series.push(instanceArr);
        seriesLengthArr = {...seriesLengthArr ,[seriesKey]:instanceArr.length }
      }
      const seriesFilter = series.filter((v: any) => {
        if (v.length > 0) {
          return v;
        } else {
          return;
        }
      });
      // oneSeriesArray.sort(collator.compare);
      const hanging = await call.get(`/api/v1/hanging/${userID}`);
      const seriesValue = hanging.data.find((v: any) => v.Modality === modalityType);
      if (value === 0) {
        if (seriesValue) {
          dispatch({ type: 'setSeriesLayout/0', payload: [Number(seriesValue.SeriesRows), Number(seriesValue.SeriesColumns)] });
          dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: Number(seriesValue.SeriesRows) * Number(seriesValue.SeriesColumns) } })
          dispatch({ type: 'setSeriesStorage/0', payload: [2, 2] })
          dispatch({ type: 'setSeriesLength/0', payload: seriesLengthArr })
          console.log(seriesLengthArr)
        } else {
          dispatch({ type: 'setSeriesLayout/0', payload: [1, 1] });
          dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: 1 } })
          dispatch({ type: 'setSeriesStorage/0', payload: [2, 2] })
          dispatch({ type: 'setSeriesLength/0', payload: seriesLengthArr })
        }
        setWadouri({
          series: seriesFilter,
          oneSeries: oneSeriesArray,
        });
        setWadoBool(true);
      } else if (value === 1) {
        if (seriesValue) {
          dispatch(setComparisonSeriesChange([Number(seriesValue.SeriesRows), Number(seriesValue.SeriesColumns)]));
          dispatch(
            setComaprisonSeriesValueChange({
              comparisonSeriesMin: 0,
              comparisonSeriesMax: Number(seriesValue.SeriesRows) * Number(seriesValue.SeriesColumns),
            }),
          );
          dispatch(setComparisonSeriesStorageChange([2, 2]));
          dispatch({ type: 'setSeriesLength/1', payload: seriesLengthArr })
        } else {
          dispatch(
            setComaprisonSeriesValueChange({
              comparisonSeriesMin: 0,
              comparisonSeriesMax: 4,
            }),
          );
          dispatch({ type: 'setSeriesLength/1', payload: seriesLengthArr })
        }
        setComparisonWadoURI({
          series: series,
          oneSeries: oneSeriesArray,
        });
        setWadoBool(true);
      }
    });
  }
  /**
   * 비교검사에서 표출할 검사의 wadoList를 받기위한 로직
   */
  useEffect(() => {
    if (firstRandering) {
      if (comparisonCheckBool) {
        getSeriesList(comparisonStudyKey, 1);
      }
    } else {
      setFirstRandering((firstRandering) => !firstRandering);
    }
  }, [comparisonStudyKey, comparisonCheckBool]);

  /**
   * mounted될 떄 getseriesList를 호출하기 위한 이펙트
   */
  useEffect(() => {
    setWadoBool(false);
    getSeriesList(study_key, 0);
    dispatch({ type: 'setSeriesElementNumber/0', payload: 0 })

    ToolChain.find((v: any, i: number) => {
      if (tool === v.tool) {
        dispatch(setChoiceToolChange(v.name));
        return true;
      } else {
        return false;
      }
    });
    return;
  }, [study_key]);

  /**
   * imageLayoutBool이 false가 되었을때 상태값(ImageLayoutViewerNumber)을 초기화 시켜주는 이펙트
   */
  useEffect(() => {
    if (firstRandering) {
      if (!imageLayoutBool) {
        dispatch({ type:'setImageLayoutViewStartNumber/0',payload:0})
      }
    }
  }, [imageLayoutBool]);

  /**
   * 마운트 후 imageLayout을 감시하여 실행한다 (이미지 레이아웃)
   * 이미지 레이아웃 시 첫번째 DivBox에 active를 준다
   */
  useEffect(() => {
    if (firstImageLayout[0] !== 1 || firstImageLayout[1] !== 1) {
      const wadoNumber = firstStudyseriesElementNumber;
      setImageLayoutBool(true);
      if (!imageLayoutBool) {
        const imageLayoutElement: HTMLDivElement | null = document.querySelector('.border-active');
        setImageLayoutElementBorderActive(imageLayoutElement);
      }
      dispatch({ type: 'setImageLayoutDoubleClickBool/0', payload: false })
      setImageLayoutState({
        ...imageLayoutState,
        imageurl: wadouri.series[wadoNumber],
      });
    } else {
      setImageLayoutBool(false);
      dispatch({ type: 'setImageLayoutElementNumber/0', payload: 0 })

      setImageLayoutState({
        imageurl: '',
      });
    }
  }, [firstImageLayout]);

  /**
   * 마운트 후 comparisonImageLayout 을 감시하여 실행 (비교검사 이미지 레이아웃)
   *
   */
  useEffect(() => {
    if (comparisonImageLayout[0] !== 1 || comparisonImageLayout[1] !== 1) {
      const wadoNumber = comparisonWadoElementNumber;
      setComparisonImageLayoutBool(true);
      dispatch(setComparisonImageLayoutDoubleClickBool(false));
      setComparisonImageLayoutState({
        ...comparisonImageLayoutState,
        imageurl: comparisonWadoURI.series[wadoNumber],
      });
    } else {
      setComparisonImageLayoutBool(false);
      dispatch(setComparisonImageLayoutElementNumber(0));
    }
  }, [comparisonImageLayout]);

  /**
   * 원시리즈가 꺼졌을떄를 감지하여 원시리즈가 바라보고 있던(BorderActive) indexNumber를 초기화 한다
   * 원시리즈 or 이미지 레이아웃 이 켜질 경우 적용되던 tool 을 새로운 element 에 적용해준다.
   */

  useEffect(() => {
    if (firstRandering) {
      if (!firstStudyIsOneSeries) {
        dispatch({ type: 'setOneSeriesStartNumber/0', payload: 0 })
      }
      if (firstStudyIsOneSeries || imageLayoutBool) {
        const elements = cornerstone.getEnabledElements();
        ToolChain.find((v: any, i: number) => {
          if (v.name === choiceTool) {
            elements.forEach((value) => {
              if (
                value.element.classList.value.includes('wadoElement') ||
                value.element.classList.value.includes('imageLayoutElement')
              ) {
                cornerstoneTools.addToolForElement(value.element, v.func);
                cornerstoneTools.setToolActiveForElement(value.element, v.name, { mouseButtonMask: 1 });
              }
            });
            return true;
          } else {
            return false;
          }
        });
      }
    }
  }, [firstStudyIsOneSeries, imageLayoutBool]);

  /**
   * 원시리즈 시 모든 영상을 가져와 캐시로 저장 (영상의 끊김을 방지하기 위해)
   */
  const oneSeriesLogic = debounce(() => {
    if (firstStudyIsOneSeries) {
      for (const imageId of wadouri.oneSeries) {
        // const controller = new AbortController();
        // const signal = controller.signal;
        // cornerstone.loadAndCacheImage(imageId,{signal:signal});
        cornerstone.loadAndCacheImage(imageId);
      }
    } else if (comparisonOneSeries) {
      for (const imageId of comparisonWadoURI.oneSeries) {
        // const controller = new AbortController();
        // const signal = controller.signal;
        // cornerstone.loadAndCacheImage(imageId,{signal:signal});
        cornerstone.loadAndCacheImage(imageId);
      }
    }
  }, 20);
  useEffect(() => {
    oneSeriesLogic();
  }, [firstStudyIsOneSeries, comparisonOneSeries, wadouri, comparisonWadoURI]);

  /**
   * 유저 세팅 데이터를 받아와 유저의 tool을 조정하기 위한 함수
   */
  async function getSettingData() {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    await call.get(`/api/v1/setting?UserID=${DecryptAES256(userID)}`).then(({ data }) => {
      const tool = JSON.parse(data.toolSetting);
      setToolSetting(tool);
    });
  }
  useEffect(() => {
    getSettingData();
  }, []);

  return (
    <ViewerContentCss>
      {/* {toolBoxBool&& wadoBool && <Toolbar imageurl={selectedStudyType ==='default' ? wadouri.series : comparisonWadoURI.series} />} */}
      {toolBoxBool && toolSetting !== undefined && (
        <Toolbar
          toolSetting={toolSetting}
          imageurl={selectedStudyType === 'default' ? wadouri.series : comparisonWadoURI.series}
        />
      )}
      <Box className={spinner && !firstStudyIsOneSeries && !comparisonOneSeries ? 'contentDivBox backgroundGray' : 'contentDivBox'}>
        {spinner && !firstStudyIsOneSeries && !comparisonOneSeries && (
          <Box className="spinner-wrapper">
            <Box className="spinner-Box">
              <ClipLoader color="#E50915" loading={spinner} className="spinners" size={80} />
              {spinner && <p className="spinners-loading">Loading...</p>}
            </Box>
          </Box>
        )}
        {wadouri.series.length > 0 && <ViewerMenu imageurl={selectedStudyType === 'default' ? wadouri.series : comparisonWadoURI.series}/>}
        
        {/*/////////////////////////////////////////////////////////////////////*/}
        <Box
          ref={WadoBoxRef}
          className="wadoBox"
          style={
            !comparisonCheckBool
              ? {
                gridTemplateColumns: `repeat(${firstStudySeriesLayout[1]}, 1fr)`,
                gridTemplateRows: `repeat(${firstStudySeriesLayout[0]}, 1fr)`,
              }
              : {
                gridTemplateColumns: `repeat(${firstStudySeriesLayout[1]}, 1fr)`,
                gridTemplateRows: `repeat(${firstStudySeriesLayout[0]}, 1fr)`,
                width: '50%',
              }
          }
          onMouseLeave={onMouseLeaveEvent}
        >
          {viewerContextMenuBool && (
            <Box
              className="contextMenuCss"
              style={{ left: `${contextMenuLocation.x}`, top: `${contextMenuLocation.y}` }}
            >
              <Box onClick={onDeleteImage}>{t('TID02687')}</Box>
              <Box onClick={handleDicomHeaderModal}>{t('TID02697')}</Box>
            </Box>
          )}
          {!imageLayoutBool && firstImageLayout[0] === 1 && firstImageLayout[1] === 1 ? (
            Array(firstStudyIsOneSeries ? firstStudySeriesLayout[0] * firstStudySeriesLayout[1] : wadouri.series.length + 25)
              .fill(' ')
              .map((v, i: number) => {
                return (
                  <Box
                    className={
                      firstStudyIsOneSeries && !seriesDoubleClickBool && seriesMin <= i && seriesMax > i
                        ? i === firstStudyseriesElementNumber && selectedStudyType === 'default'
                          ? 'parentDiv active-red'
                          : 'parentDiv'
                        : seriesDoubleClickBool
                          ? firstStudyseriesElementNumber === i
                            ? i === firstStudyseriesElementNumber && selectedStudyType === 'default'
                              ? 'parentDiv active-red'
                              : 'parentDiv'
                            : 'parentDiv displayNone'
                          : // : series[0] * series[1] > i
                          seriesMin <= i && seriesMax > i
                            ? i === firstStudyseriesElementNumber && selectedStudyType === 'default'
                              ? 'parentDiv active-red'
                              : 'parentDiv'
                            : 'parentDiv displayNone'
                    }
                    key={i}
                    data-value={i}
                    onDoubleClick={onWadoElementDoubleClick}
                    onContextMenu={onContextMenuClick}
                    onMouseDown={onWadoElementClick}
                  // onTouchStart={sessionStorage.getItem('mobile') === 'true' ? onWadoElementClick : () => {}}
                  >
                    <Box>
                      {firstStudyIsOneSeries ? (
                        wadouri.oneSeries.length > i && wadouri.oneSeries[i + firstStudyOneSeriesStartNumber] !== undefined ? (
                          <WadoImageLoader
                            imageurl={wadouri.oneSeries[i + firstStudyOneSeriesStartNumber]}
                            wadourl={['url']}
                            wadonumber={i + firstStudyOneSeriesStartNumber}
                            gsps={gspsData}
                            gspsBool={gspsLengthCheckBool}
                            type="default"
                            oneSeries="oneSeries"
                            imageLength={wadouri.oneSeries.length}
                            onDataLoaded={handleChildDataLoaded}
                            onComparisonDataLoaded={handleComparisonChildDataLoaded}
                          />
                        ) : (
                          ''
                        )
                      ) : wadouri.series.length &&
                        wadouri.series.length > i &&
                        wadouri.oneSeries.length > 0 &&
                        wadouri.series[i].length > 0 ? (
                        <WadoImageLoader
                          imageurl={wadouri.series[i]}
                          wadourl={['url']}
                          gsps={gspsData}
                          gspsBool={gspsLengthCheckBool}
                          wadonumber={i}
                          type="default"
                          oneSeries="normal"
                          imageLength={wadouri.oneSeries.length}
                          onDataLoaded={handleChildDataLoaded}
                          onComparisonDataLoaded={handleComparisonChildDataLoaded}
                        />
                      ) : (
                        ''
                      )}
                    </Box>
                  </Box>
                );
              })
          ) : (
            <div
              style={{
                display: 'grid',
                width: '100%',
                height: '100%',
                gridTemplateColumns: firstImageLayoutDoubleClickBool ? 'repeat(1, 1fr)' : `repeat(${firstImageLayout[1]}, 1fr)`,
                gridTemplateRows: firstImageLayoutDoubleClickBool ? 'repeat(1, 1fr)' : `repeat(${firstImageLayout[0]}, 1fr)`,
                background: 'black',
              }}
            >
              {Array(Number(firstImageLayout[0]) * Number(firstImageLayout[1]))
                .fill(' ')
                .map((v, i: number) => {
                  return (
                    <div
                      key={i}
                      className={
                        firstImageLayoutDoubleClickBool
                          ? imageLayoutElementNumber === i
                            ? selectedStudyType === 'default'
                              ? 'imageLayoutParentDiv border-active'
                              : 'imageLayoutParentDiv'
                            : 'imageLayoutParentDiv displayNone'
                          : i === imageLayoutElementNumber && selectedStudyType === 'default'
                            ? `imageLayoutParentDiv border-active ${imageLayoutViewStartNumber} ${i}`
                            : `imageLayoutParentDiv ${imageLayoutViewStartNumber} ${i}`
                      }
                    // onClick={imageLayoutClickButton}
                    >
                      {imageLayoutState.imageurl.length > i + imageLayoutViewStartNumber &&
                        imageLayoutState.imageurl[i + firstStudyOneSeriesStartNumber] !== undefined ? (
                        <ImageLayoutWadoImageLoader
                          imageurl={imageLayoutState.imageurl[i + imageLayoutViewStartNumber]}
                          wadonumber={i}
                          wadourl={['url']}
                          type="default"
                          gsps={gspsData}
                          gspsBool={gspsLengthCheckBool}
                          oneSeries="normal"
                          imageLength={imageLayoutState.imageurl.length}
                          onDataLoaded={handleChildDataLoaded}
                          onComparisonDataLoaded={handleComparisonChildDataLoaded}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </Box>
        {/**비교검사 수정 해야할 부분 */}
        {!comparisonCheckBool ? (
          ''
        ) : !comparisonImageLayoutBool && comparisonImageLayout[0] === 1 && comparisonImageLayout[1] === 1 ? (
          <Box
            style={{
              background: '#383838',
              width: '50%',
              display: 'grid',
              marginLeft: '10px',
              gridTemplateColumns: `repeat(${comparisonSeries[1]}, 1fr)`,
              gridTemplateRows: `repeat(${comparisonSeries[0]}, 1fr)`,
            }}
          >
            {comparisonWadoURI.series ? (
              Array(
                comparisonOneSeries
                  ? comparisonSeriesStorage[0] * comparisonSeriesStorage[1]
                  : comparisonWadoURI.series.length + 25,
              )
                .fill('  ')
                .map((v: any, i: number) => {
                  return (
                    <Box
                      className={
                        // firstStudyIsOneSeries &&
                        !ComparisonseriesDoubleClickBool && comparisonSeriesMin <= i && comparisonSeriesMax > i
                          ? i === comparisonWadoElementNumber && selectedStudyType === 'comparison'
                            ? 'parentDiv comparison active-red 11'
                            : 'parentDiv comparison 1'
                          : ComparisonseriesDoubleClickBool
                            ? comparisonWadoElementNumber === i
                              ? i === comparisonWadoElementNumber && selectedStudyType === 'comparison'
                                ? 'parentDiv comparison active-red 22'
                                : 'parentDiv comparison 2'
                              : 'parentDiv comparison displayNone 22'
                            : // : series[0] * series[1] > i
                            comparisonSeriesMin <= i && comparisonSeriesMax > i
                              ? i === comparisonWadoElementNumber && selectedStudyType === 'comparison'
                                ? 'parentDiv comparison active-red 33'
                                : 'parentDiv comparison 3'
                              : 'parentDiv comparison displayNone 33'
                      }
                      key={i}
                      data-value={i}
                      onMouseDown={onWadoElementClick}
                      onDoubleClick={onWadoElementDoubleClick}
                      onContextMenu={onContextMenuClick}

                    >
                      <Box>
                        {comparisonOneSeries ? (
                          comparisonWadoURI.oneSeries.length > i &&
                            comparisonWadoURI.oneSeries[i + comparisonOneSeriesStartNumber] !== undefined ? (
                            <WadoImageLoader
                              imageurl={comparisonWadoURI.oneSeries[i + comparisonOneSeriesStartNumber]}
                              wadourl={['url']}
                              wadonumber={i + comparisonOneSeriesStartNumber}
                              type="comparison"
                              gsps={comparisonGspsData}
                              gspsBool={comparisonGspsLengthCheckBool}
                              oneSeries="oneSeries"
                              imageLength={comparisonWadoURI.oneSeries.length}
                              onDataLoaded={handleChildDataLoaded}
                              onComparisonDataLoaded={handleComparisonChildDataLoaded}
                            />
                          ) : (
                            ''
                          )
                        ) : comparisonWadoURI.series.length && comparisonWadoURI.series.length > i ? (
                          <WadoImageLoader
                            imageurl={comparisonWadoURI.series[i]}
                            gsps={comparisonGspsData}
                            gspsBool={comparisonGspsLengthCheckBool}
                            wadourl={comparisonWadoURI.series}
                            wadonumber={i}
                            type="comparison"
                            oneSeries="normal"
                            imageLength={comparisonWadoURI.series[i].length}
                            onDataLoaded={handleChildDataLoaded}
                            onComparisonDataLoaded={handleComparisonChildDataLoaded}
                          />
                        ) : (
                          ''
                        )}
                      </Box>
                    </Box>
                  );
                })
            ) : (
              <div></div>
            )}
          </Box>
        ) : (
          <div
            style={{
              display: 'grid',
              width: '50%',
              marginLeft: '10px',
              gridTemplateColumns: comparisonImageLayoutDoubleClickBool
                ? 'repeat(1, 1fr)'
                : `repeat(${comparisonImageLayout[1]}, 1fr)`,
              gridTemplateRows: comparisonImageLayoutDoubleClickBool
                ? 'repeat(1, 1fr)'
                : `repeat(${comparisonImageLayout[0]}, 1fr)`,
              background: 'black',
            }}
          >
            {Array(Number(comparisonImageLayout[0]) * Number(comparisonImageLayout[1]))
              .fill(' ')
              .map((v, i: number) => {
                return (
                  <div
                    key={i}
                    className={
                      comparisonImageLayoutDoubleClickBool
                        ? comparisonImageLayoutElementNumber === i
                          ? selectedStudyType === 'comparison'
                            ? 'imageLayoutParentDiv comparison border-active'
                            : 'imageLayoutParentDiv comparison'
                          : 'imageLayoutParentDiv comparison displayNone'
                        : i === comparisonImageLayoutElementNumber && selectedStudyType === 'comparison'
                          ? `imageLayoutParentDiv comparison border-active ${comparisonImageLayoutViewNumber} ${i}`
                          : `imageLayoutParentDiv comparison ${comparisonImageLayoutViewNumber} ${i}`
                    }
                  // onClick={imageLayoutClickButton}
                  >
                    {comparisonImageLayoutState.imageurl.length > i + comparisonImageLayoutViewNumber &&
                      comparisonImageLayoutState.imageurl[i + comparisonOneSeriesStartNumber] !== undefined ? (
                      <ImageLayoutWadoImageLoader
                        imageurl={comparisonImageLayoutState.imageurl[i + comparisonImageLayoutViewNumber]}
                        wadourl={['url']}
                        wadonumber={i}
                        type="comparison"
                        oneSeries="normal"
                        gsps={comparisonGspsData}
                        gspsBool={comparisonGspsLengthCheckBool}
                        imageLength={comparisonImageLayoutState.imageurl.length}
                        onDataLoaded={handleChildDataLoaded}
                        onComparisonDataLoaded={handleComparisonChildDataLoaded}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </Box>
    </ViewerContentCss>
  );
};

export default ViewerContent;
