import React, { useCallback, useState, useEffect, useRef } from "react";
// import WadoImageLoader from "@components/Viewer/WadoImageLoader";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@store/index";
import { Call } from "@utils/JwtHelper";
import DecryptAES256 from "@utils/DecryptAES256";
import { useParams } from "react-router";
import { setChoiceToolChange, setPalyClipModalChnage, setToolChange } from "@store/Tool";
import { setComparisonSeriesStorageChange, setDefaultSeriesStorageChange, setSeriesChange, setSeriesValueChange } from "@store/series";
import { ToolChain } from '@components/Viewer/ArrChain';
import { wado } from '@typings/etcType';
import { setComaprisonSeriesValueChange, setComparisonSeriesChange } from "@store/comparison";
import { Box } from '@mui/material';
import { MobileViewerCss } from "./styled";
// import ViewerMenu from "@mobileComponents/Viewer/ViewerMenu";
// import Toolbar from "@mobileComponents/Viewer/Toolbar";
import ToolController from "@utils/ToolController";
import loadable from "@loadable/component";
import { debounce } from "lodash";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { setSpinnerChange } from "@store/viewer";
import { ClipLoader } from 'react-spinners';
import cornerstone from "cornerstone-core";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";


const WadoImageLoader = loadable(() => import('@components/Viewer/WadoImageLoader'));
const ViewerMenu = loadable(() => import('@mobileComponents/Viewer/ViewerMenu'));
const Toolbar = loadable(() => import('@mobileComponents/Viewer/Toolbar'));
const MobileViewer = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { study_key } = useParams();
  const call = new Call()
  const {
    oneSeries,
    comparisonOneSeries,
  } = useSelector((state: RootState) => state.serieslayout.seriesLayout);
  ////
  const { seriesElementNumber: firstStudyseriesElementNumber } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { isOneSeries: firstStudyIsOneSeries }=useSelector((state:RootState)=>state.studyStatus[0].seriesLayout)

  ////
  const { tool, toolChangeCheckBool } = useSelector((state: RootState) => state.tool.toolbar);
  const { spinner } = useSelector((state: RootState) => state.viewer.viewer);
  const { mobileThumbnailBool } = useSelector((state: RootState) => state.setting.setting);
  const ToolbarRef = useRef<any>()
  const swiperRef = useRef<any>()
  const [screenLeftBlur, setScreenLeftBlur] = useState(false);
  const [screenRightBlur, setScreenRightBlur] = useState(false);
  const [firstRandering, setFirstRandering] = useState(false); //첫 마운트 카운트용
  const [imageLayoutElementBorderActive, setImageLayoutElementBorderActive] = useState<HTMLDivElement | null>(null);
  const [comparisonGspsLengthCheckBool, setComparisonGspsLengthCheckBool] = useState(false);
  const [comparisonGspsData, setComparisonGspsData] = useState([]);
  const [wadoBool, setWadoBool] = useState(false);
  const [toolSetting, setToolSetting] = useState()
  const [comparisonLoadingSpinnerCount, setComparisonLoadingSpinnerCount] = useState(0);
  const [loadingSpinnerCount, setLoadingSpinnerCount] = useState(0); // viewer 스피너를 조절하기 위한 상태값
  const [gspsLengthCheckBool, setGspsLengthCheckBool] = useState(false);
  const [gspsData, setGspsData] = useState([]);
  const [wadouri, setWadouri] = useState<any>({
    series: [],
    oneSeries: [],
  });
  const [comparisonWadoURI, setComparisonWadoURI] = useState<wado>({
    series: [],
    oneSeries: [],
  });


  ToolController({
    wadouri: { series: wadouri.series, oneSeries: wadouri.oneSeries },
    comparisonWadoURI: { series: comparisonWadoURI.series, oneSeries: comparisonWadoURI.oneSeries },
    imageLayoutElementBorderActive,
    firstRandering,
  });


  //자식컴포넌트에게서 호출 받고 실행되는 함수 (comparison용)
  const handleComparisonChildDataLoaded = useCallback(() => {
    setComparisonLoadingSpinnerCount((comparisonLoadingSpinnerCount) => comparisonLoadingSpinnerCount + 1); // 로딩 완료된 자식 컴포넌트 수 증가
  }, [comparisonLoadingSpinnerCount])

  //자식컴포넌트에게서 호출 받고 실행되는 함수 (default용)
  const handleChildDataLoaded = useCallback(() => {
    setLoadingSpinnerCount((loadingSpinnerCount) => loadingSpinnerCount + 1); // 로딩 완료된 자식 컴포넌트 수 증가
  }, [loadingSpinnerCount])


  useEffect(() => {
    // if (firstRandering) {
    if (wadouri.series.length) {
      if (loadingSpinnerCount > 0) {
        setTimeout(() => {
          dispatch(setSpinnerChange(false));
        }, 300);
      }
    }
    // }
  }, [loadingSpinnerCount, wadouri]);


  async function getSettingData() {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    await call.get(`/api/v1/setting?UserID=${DecryptAES256(userID)}`).then(({ data }) => {
      const tool = JSON.parse(data.toolSetting);
      setToolSetting(tool)
    })
  }

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
        return
      }
      const { data: gsps } = await call.get(`/api/v1/gsps?studyKey=${studyKey}`);
      // const {data :gspsText} = await call.get(`/api/v1/gsps/text?studyKey=${studyKey}`);
      if (gsps !== null && gsps !== undefined && gsps.length > 0) {
        if (value === 0) {
          setGspsData(gsps)
          setGspsLengthCheckBool(true)
        } else if (value === 1) {
          setComparisonGspsData(gsps)
          setComparisonGspsLengthCheckBool(true)
        }
      } else {
        if (value === 0) {
          setGspsData([])
          setGspsLengthCheckBool(false)
        } else if (value === 1) {
          setComparisonGspsData([])
          setComparisonGspsLengthCheckBool(false)
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
      }
      const seriesFilter = series.filter((v: any) => {
        if (v.length > 0) {
          return v
        } else {
          return
        }
      })
      // oneSeriesArray.sort(collator.compare);
      const hanging = await call.get(`/api/v1/hanging/${userID}`);
      const seriesValue = hanging.data.find((v: any) => v.Modality === modalityType);
      if (value === 0) {
        if (seriesValue) {
          dispatch({ type: 'setSeriesLayout/0', payload: [Number(seriesValue.SeriesRows), Number(seriesValue.SeriesColumns)] });
          dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: Number(seriesValue.SeriesRows) * Number(seriesValue.SeriesColumns) } })

          dispatch({ type: 'setSeriesStorage/0', payload: [2, 2] })

        } else {
          dispatch({ type: 'setSeriesLayout/0', payload: [1, 1] });
          dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: 1 } })
          dispatch({ type: 'setSeriesStorage/0', payload: [2, 2] })

        }
        setWadouri({
          series: seriesFilter,
          oneSeries: oneSeriesArray,
        });
        setWadoBool(true)
      } else if (value === 1) {
        if (seriesValue) {
          dispatch(setComparisonSeriesChange([Number(seriesValue.SeriesRows), Number(seriesValue.SeriesColumns)]));
          dispatch(setComaprisonSeriesValueChange({
            comparisonSeriesMin: 0,
            comparisonSeriesMax: Number(seriesValue.SeriesRows) * Number(seriesValue.SeriesColumns),
          }))
          dispatch(setComparisonSeriesStorageChange([2, 2]));
        } else {
          dispatch(setComaprisonSeriesValueChange({
            comparisonSeriesMin: 0,
            comparisonSeriesMax: 4,
          }))
        }
        setComparisonWadoURI({
          series: series,
          oneSeries: oneSeriesArray,
        });
        setWadoBool(true)
      }
    });
  }

  //다이콤 파일 url 불러오는 로직
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
  useEffect(() => {
    getSettingData()
  }, [])

  //mounted될 떄 getseriesList
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

  const [startX, setStartX] = useState<any>(null);
  const [touchEdge, setTouchEdge] = useState(false);
  const [touchMove, setTouchMove] = useState(false)

  const handleTouchStart = (e: any) => {
    const clientX = e.touches[0].clientX;
    setStartX(clientX);
    // 디바이스의 양끝에서 터치가 시작되었는지 확인 (여기서는 20px를 가장자리로 가정)
    setTouchEdge(clientX < 20 || window.innerWidth - clientX < 20);
  };

  const handleTouchMove = (e: any) => {
    // 디바이스의 양끝에서 터치가 시작되지 않았다면 아무 작업도 수행하지 않음
    if (!touchEdge) return;

    let touch = e.touches[0];
    let change = startX - touch.clientX;
    if (change < -90) {
      setScreenLeftBlur(true)
    } else if (change > 90) {
      setScreenRightBlur(true)
    } else {
      setScreenLeftBlur(false)
      setScreenRightBlur(false)
    }
    setTouchMove(change > 90 || change < -90)
    // if (change > 90) {
    //   // 오른쪽으로 300px 이상 스와이프하면 다음 페이지로 이동
    //   ToolbarRef.current.nextStudyButton()
    //   handleBlurLogic()
    // } else if (change < -90) {
    //   // 왼쪽으로 300px 이상 스와이프하면 이전 페이지로 이동
    //   ToolbarRef.current.previousStudyButton()
    //   handleBlurLogic()
    // }else {
    //   handleBlurLogic()
    //   return
    // }
  };
  const handleTouchEnd = (e: any) => {

    let Endtouch = e.changedTouches[0].clientX;
    let change = startX - Endtouch;

    // 디바이스의 양끝에서 터치가 시작되지 않았다면 아무 작업도 수행하지 않음
    if (!touchEdge) return;
    if (Math.abs(change) < 90) {
      handleBlurLogic()
      return;
    }
    if (!touchMove) {
      handleBlurLogic()
      return;
    };

    if (change > 90) {
      // 오른쪽으로 300px 이상 스와이프하면 다음 페이지로 이동
      ToolbarRef.current.nextStudyButton()
      handleBlurLogic()
    } else if (change < -90) {
      // 왼쪽으로 300px 이상 스와이프하면 이전 페이지로 이동
      ToolbarRef.current.previousStudyButton()
      handleBlurLogic()
    } else {
      handleBlurLogic()
      return
    }
  }
  const handleBlurLogic = debounce(() => {
    setTimeout(() => {
      setScreenLeftBlur(false)
      setScreenRightBlur(false)
    }, 100);
  }, 500)

  /** 
 * 브라우저 뒤로가기 감지 이펙트
 */
  useEffect(() => {
    // 뒤로 가기 이벤트를 감지하는 함수
    const handlePopState = (event: any) => {
      cornerstone.imageCache.purgeCache();
      dispatch(
        setToolChange({
          tool: 'default',
          toolbool: !toolChangeCheckBool,
        }),
      );
      dispatch(setPalyClipModalChnage(false));
    };
    // popstate 이벤트 리스너 추가
    window.addEventListener('popstate', handlePopState);
    return () => {
      setTimeout(() => {
        window.removeEventListener('popstate', handlePopState);
      }, 500);
    };
  }, []);
  const handleSlideChange = (swiper: any) => {
    dispatch({ type: 'setSeriesElementNumber/0', payload: swiper.activeIndex })
    
  };


  const goToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };
  useEffect(() => {
    if (!firstRandering) {
      setFirstRandering(true)
    }
  }, [])


  useEffect(() => {
    if (firstRandering) {
      goToSlide(firstStudyseriesElementNumber)
    }
  }, [firstStudyseriesElementNumber])
  return (
    <MobileViewerCss
    // onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
    >
      {spinner && !firstStudyIsOneSeries && !comparisonOneSeries && (
        <Box className="spinner-wrapper">
          <Box className="spinner-Box">
            <ClipLoader color="#E50915" loading={spinner} className="spinners" size={80} />
            {spinner && <p className="spinners-loading">Loading...</p>}
          </Box>
        </Box>
      )}
      <Swiper className={mobileThumbnailBool ? "swiper thumbnail" : "swiper"} onSwiper={(swiper: any) => { swiperRef.current = swiper }} onSlideChange={handleSlideChange}>
        {Array(wadouri.series.length < 25 ? wadouri.series.length : wadouri.series.length).fill('').map((v, i: number) => {
          return (
            <SwiperSlide key={i}>
              <Box className={
                'parentDiv'
              }>
                {wadouri.series.length && wadouri.series.length > i && wadouri.oneSeries.length > 0 && wadouri.series[i].length > 0 ? (
                  <WadoImageLoader imageurl={wadouri.series[i]} wadourl={['url']} gsps={gspsData} gspsBool={gspsLengthCheckBool} wadonumber={i} type="default" oneSeries='normal' imageLength={wadouri.oneSeries.length} onDataLoaded={handleChildDataLoaded} onComparisonDataLoaded={handleComparisonChildDataLoaded} />
                ) : ''}
              </Box>
            </SwiperSlide>
          )
        })}
      </Swiper>
      {mobileThumbnailBool && (wadouri.series.length > 0 && <ViewerMenu imageurl={wadouri.series} />)}
      {toolSetting !== undefined && <Toolbar toolSetting={toolSetting} ref={ToolbarRef} />}
    </MobileViewerCss>
  );
}
export default MobileViewer;