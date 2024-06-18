/**
 * viewer toolbar component
 *
 */
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { setToolChange, setScrollLoopBoolChange, setPalyClipModalChnage, setGSPSBoolChange } from '@store/Tool';
import {
  setSeriesChange,
  setSeriesValueChange,
  setOneSeriesBoolChange,
  setComparisonOneSeriesBoolChange,
  setDefaultSeriesStorageChange,
  setComparisonSeriesStorageChange,
} from '@store/series';
import { setImageLayoutChange, setImageLayoutDoubleClickBoolChange } from '@store/imagelayout';
import {
  setComparisonCheckBoolChange,
  setComparisonSeriesChange,
  setComparisonImgaeLayoutChange,
  // setImageLoaderTypeChnage,
  setComparisonDoubleClickBoolChange,
  setComaprisonSeriesValueChange,
  setComparisonOneSeriesStartNumberChange,
  setComparisonImageLayoutViewNumberChange,
} from '@store/comparison';
import { setSelectedStudyType } from '@store/viewerStatus';

import { useDispatch, useSelector } from 'react-redux';
import { ViewerToolCss, TogleCss } from './styles';
import { useNavigate, useParams } from 'react-router';
import { ToolChainArray, ActiveToolException } from '@components/Viewer/ArrChain';
import { Call } from '@utils/JwtHelper';
import cornerstone from 'cornerstone-core';
import { RootState } from '@store/index';
import { useTranslation } from 'react-i18next';
import { setWorklistArrChange } from '@store/worklist';
import { pagingNumAction } from '@store/filter';
import { AppDispatch } from '@store/index';
import { toolbar } from '@typings/etcType';
import cornerstoneTools from 'cornerstone-tools'
import DecryptAES256 from '@utils/DecryptAES256';
import { useMediaQuery } from 'react-responsive';

const Toolbar = memo((props: toolbar) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const call = new Call();
  //document.querySelctor 대체
  const myTools = useRef<any>({});
  const myModals = useRef<any>({});
  const ModalRef = useRef() as React.MutableRefObject<any>;
  const { toolChangeCheckBool, choiceTool, playClipModal,gspsBool,gspsURI,scrollLoopBool } = useSelector((state: RootState) => state.tool.toolbar);
  const { worklistArr } = useSelector((state: RootState) => state.worklistReducer.worklist);
  const {oneSeries, comparisonOneSeries } = useSelector(
    (state: RootState) => state.serieslayout.seriesLayout,
  );
  /////
  const { seriesLayout: firstSeriesLayout, seriesDoubleClickBool, isOneSeries:firstStudyIsOneSeries  } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout
)
  
 
  /////
  const { pagingNum, patient_id, patient_name, reading_status, modality, verify_flag, startDate, endDate } =
    useSelector((state: RootState) => state.filter.filter);
  const { imageLayout } = useSelector((state: RootState) => state.imagelayout.imagelayout);
  const { imageLayout: firstImageLayout, imageLayoutDoubleClickBool: firstImageLayoutDoubleClickBool } = useSelector((state: RootState) => state.studyStatus[0].imageLayout)

  const {
    comparisonCheckBool,
    comparisonImageLayout,
    comparisonSeries,
    ComparisonseriesDoubleClickBool,
  } = useSelector((state: RootState) => state.comparison.comparison);
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)

  const { study_key } = useParams();
  const [moreWorklistArr, setMoreWorklistArr] = useState();
  const [firstRandering, setFirstRandering] = useState(false);
  const [defaultToolArr, setDefaultToolArr] = useState<string[]>([]);
  const [comparisonToolArr, setComparisonToolArr] = useState<string[]>([]);
  const [modalBool, setModalBool] = useState({
    seriesModal: false,
    toolsModal: false,
    annotationModal: false,
    resetModal: false,
    imageLayoutModal: false,
  });

  const isBigScreen = useMediaQuery({ minWidth: 1281, maxWidth: 7680  })
  const isSmallScreen = useMediaQuery({ minWidth: 0, maxWidth: 1280 })
  const isFHD = useMediaQuery({ minWidth: 1281, maxWidth: 1920  })
  const isHD = useMediaQuery({ minWidth: 961, maxWidth: 1280  })
  const isQHD = useMediaQuery({ minWidth: 641, maxWidth: 960  })
  const isNHD = useMediaQuery({ minWidth: 0, maxWidth: 640  })

  const ToolClickButton = useCallback(
    (event: any) => {
      const ToolName = event.target.dataset.tool; //클릭한 아이콘의 tool
      const currentTool = myTools.current[ToolName]; //클릭한 tool 로 찾은 Element
      const currentToolActiveCheck = currentTool.classList.value.includes('active-tool'); //현재 클릭한 아이콘에 active가 되어있었는지 boolean값으로 알려주는 변수
      const parentModalName = event.target.dataset.parent ?? '';
      const parentModal = myModals.current[parentModalName] ?? '';
      const currentModalBox = document.querySelector('.active-tool-modal'); //active 되어있는 모달

      //tool 아이콘에 active 를 주기 위한 로직
      if (!currentToolActiveCheck) {
        if (ToolName === 'ScrollLoop') {
          //스크롤 루프 active 예외처리
          dispatch(setScrollLoopBoolChange(true));
          currentTool.classList.add('active-tool');
        }else if (ToolName ==='GSPS') {
          dispatch(setGSPSBoolChange(true));
          currentTool.classList.add('active-tool');
        } else if (ActiveToolException.includes(ToolName)) {
          //재설정/전체삭제 등의 tool 클릭 시 이전 사용 tool이 적용되고 있어야 함
          dispatch(
            setToolChange({
              tool: event.target.dataset.tool,
              toolbool: !toolChangeCheckBool,
            }),
          );
          return;
        } else if (ToolName === 'oneSeriesImage') {
          //원시리즈 일때의 예외처리
          //이미지 레이아웃이 켜져있을때의 예외처리
          if (playClipModal === true) {
            dispatch(setPalyClipModalChnage(false));
            Array.from(document.querySelectorAll('.active-tool')).map((v) => {
              if (v.classList.value.includes('playclip')) {
                v.classList.remove('active-tool');
              }
            });
          }

          if (choiceTool === 'ReferenceLines') {
            currentModalBox?.classList.remove('active-tool-modal');
            Array.from(document.querySelectorAll('.active-tool')).map((v) => {
              if (v.classList.value.includes('Crosshairs') || v.classList.value.includes('referenceLine')) {
                v.classList.remove('active-tool');
              }
            });
            document.querySelector('.default')?.classList.add('active-tool');
          }
          if (selectedStudyType === 'default') {
            if (Number(firstImageLayout[0]) * Number(firstImageLayout[1]) !== 1) {
              alert(t('TID03047'));
              return;
            } else {
              setDefaultToolArr([...defaultToolArr, ToolName]);
              currentTool.classList.add('active-tool');
              dispatch({ type: 'setSeriesElementNumber/0' ,payload:0})
            }
          } else if (selectedStudyType === 'comparison') {
            if (Number(comparisonImageLayout[0] * Number(comparisonImageLayout[1]) !== 1)) {
              alert(t('TID03047'));
              return;
            } else {
              setComparisonToolArr([...comparisonToolArr, ToolName]);
              currentTool.classList.add('active-tool');
            }
          }
        } else if (ToolName === 'playclip') {
          currentTool.classList.add('active-tool');
          dispatch(setPalyClipModalChnage(true));
        } else if (ToolName === 'comparisonCheck') {
          currentTool.classList.add('active-tool');
        } else {
          //예외처리를 제외한 tool의 경우
          if ((ToolName=== 'Crosshairs' || ToolName ==='referenceLine' ) && (
            firstStudyIsOneSeries||
            comparisonOneSeries||
            playClipModal||
            (firstImageLayout[0] !==1 && firstImageLayout[1] !==1)||
            (comparisonImageLayout[0] !==1 && comparisonImageLayout[1] !==1)
          )) {
            return;
          }

          Array.from(document.querySelectorAll('.active-tool')).map((v) => {
            if (
              !(
                v.classList.value.includes('ScrollLoop') ||
                v.classList.value.includes('oneSeriesImage') ||
                v.classList.value.includes('comparisonCheck') ||
                v.classList.value.includes('playclip') || 
                v.classList.value.includes('GSPS')
              )
            ) {
              v.classList.remove('active-tool');
            }
          });
          currentTool.classList.add('active-tool');
        }
      } else if (ToolName === 'ScrollLoop' && currentToolActiveCheck) {
        //스크롤 루프의 active 끄기
        currentTool.classList.remove('active-tool');
        dispatch(setScrollLoopBoolChange(false));
        return;
      } else if (ToolName ==='GSPS' && currentToolActiveCheck) {
        currentTool.classList.remove('active-tool');
        dispatch(setGSPSBoolChange(false));
        return;
      } else if (ToolName === 'playclip' && currentToolActiveCheck) {
        if (selectedStudyType === 'default') {
          setDefaultToolArr(defaultToolArr.filter((el: any) => el !== ToolName));
        } else if (selectedStudyType === 'comparison') {
          setComparisonToolArr(comparisonToolArr.filter((el: any) => el !== ToolName));
        }
        currentTool.classList.remove('active-tool');
        dispatch(setPalyClipModalChnage(false));
      } else if (ToolName === 'oneSeriesImage' && currentToolActiveCheck) {
        if (selectedStudyType === 'default') {
          setDefaultToolArr(defaultToolArr.filter((el: any) => el !== ToolName));
        } else if (selectedStudyType === 'comparison') {
          setComparisonToolArr(comparisonToolArr.filter((el: any) => el !== ToolName));
        }
        //원시리즈 active 끄기
        if (selectedStudyType === 'default' && firstStudyIsOneSeries && !comparisonOneSeries) {
          currentTool.classList.remove('active-tool');
        } else if (selectedStudyType === 'comparison' && comparisonOneSeries && !firstStudyIsOneSeries) {
          currentTool.classList.remove('active-tool');
        }

        setModalBool({
          ...modalBool,
          seriesModal: false,
          toolsModal: false,
          annotationModal: false,
          resetModal: false,
        });
        dispatch(
          setToolChange({
            tool: event.target.dataset.tool,
            toolbool: !toolChangeCheckBool,
          }),
        );
        return;
      } else if (ToolName === 'comparisonCheck' && currentToolActiveCheck) {
        currentTool.classList.remove('active-tool');
        setModalBool({
          ...modalBool,
          seriesModal: false,
          toolsModal: false,
          annotationModal: false,
          resetModal: false,
        });
        if (comparisonImageLayout[0] * comparisonImageLayout[1] !== 1) {
          dispatch(setComparisonImgaeLayoutChange([1, 1]));
          dispatch(setComparisonDoubleClickBoolChange(false));
          dispatch(
            setComaprisonSeriesValueChange({
              comparisonSeriesMin: 0,
              comparisonSeriesMax: 4,
            }),
          );
          dispatch(setComparisonImageLayoutViewNumberChange(0));
          dispatch(setComparisonSeriesChange([2, 2]));
        }
        if (comparisonOneSeries) {
          dispatch(setComparisonOneSeriesBoolChange(false));
          dispatch(setComparisonDoubleClickBoolChange(false));
          dispatch(setComparisonOneSeriesStartNumberChange(0));
          dispatch(
            setComaprisonSeriesValueChange({
              comparisonSeriesMin: 0,
              comparisonSeriesMax: 4,
            }),
          );
        }
        if (ComparisonseriesDoubleClickBool) {
          dispatch(setComparisonDoubleClickBoolChange(false));
          dispatch(
            setComaprisonSeriesValueChange({
              comparisonSeriesMin: 0,
              comparisonSeriesMax: 4,
            }),
          );
        }

        dispatch(setComparisonCheckBoolChange(false));
        dispatch(setSelectedStudyType('default'));
        return;
      }
      if (choiceTool ==='Crosshairs') {
        cornerstone.getEnabledElements().forEach((value:any)=> {
          if (value.element.classList.value.includes('wadoElement')) {
            cornerstoneTools.removeToolForElement(value.element, 'ReferenceLines');
            cornerstoneTools.removeToolForElement(value.element, 'Crosshairs');
            cornerstone.updateImage(value.element)
          }
        })
      }
      //도구/주석/재설정 등의 모달박스를 포함한 아이콘일때의 로직
      if (parentModal !== '' && parentModal !== undefined && parentModal !== currentModalBox) {
        currentModalBox?.classList.remove('active-tool-modal');
        parentModal.classList.add('active-tool-modal');
      }
      //도구/주석/재설정 등의 모달박스를 포함한 아이콘이 active되어 있는 상태에서 일반 아이콘을 클릭 시 발생할 로직
      if (
        (parentModal === '' || (currentModalBox !== null && firstStudyIsOneSeries)) &&
        ToolName !== 'oneSeriesImage' &&
        ToolName !== 'comparisonCheck' &&
        ToolName !== 'ScrollLoop' &&
        ToolName !== 'playclip' && 
        ToolName !== 'GSPS' &&
        parentModal !== currentModalBox
      ) {
        currentModalBox?.classList.remove('active-tool-modal');
      }
      setModalBool({
        ...modalBool,
        seriesModal: false,
        toolsModal: false,
        annotationModal: false,
        resetModal: false,
      });
      dispatch(
        setToolChange({
          tool: ToolName,
          toolbool: !toolChangeCheckBool,
        }),
      );
    },
    [
      choiceTool,
      playClipModal,
      toolChangeCheckBool,
      firstStudyIsOneSeries,
      firstImageLayout,
      comparisonImageLayout,
      comparisonOneSeries,
      selectedStudyType,
      comparisonOneSeries,
      ComparisonseriesDoubleClickBool,
      defaultToolArr,
      comparisonToolArr,
      firstSeriesLayout
      ,
    ],
  );

  //시리즈 modal hover 시 color변경
  const onModalMouseOver = useCallback(
    (event: any) => {
      const row = event.target.dataset.row;
      const column = event.target.dataset.column;
      const ref = ModalRef.current;
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
          ref.childNodes[i].childNodes[j].firstChild.style.background = '#ccc';
        }
      }
    },
    [ModalRef],
  );
  //시리즈 modal color 원복
  const onModalMouseOut = useCallback(
    (event: any) => {
      const row = event.target.dataset.row;
      const column = event.target.dataset.column;
      const ref = ModalRef.current;
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
          ref.childNodes[i].childNodes[j].firstChild.style.background = '';
        }
      }
    },
    [ModalRef],
  );

  //시리즈 레이아웃 modal click 시 이벤트
  const onSeriesModalClickButton = useCallback(
    (event: any) => {
      const row = Number(event.target.dataset.row);
      const column = Number(event.target.dataset.column);
      if (selectedStudyType === 'default') {
        if (Number(firstImageLayout[0]) * Number(firstImageLayout[1]) !== 1) {
          dispatch({ type: 'setImageLayout/0', payload: [1, 1] })
        }
        if (row * column === 1) {
          dispatch({ type: 'setSeriesStorage/0', payload: [2, 2] })
        } else {
          dispatch({ type: 'setSeriesStorage/0', payload: [row ,column] })
        }
        dispatch({type:'setSeriesLayout/0',payload:[row,column]});
      } else if (selectedStudyType === 'comparison') {
        if (Number(comparisonImageLayout[0]) * Number(comparisonImageLayout[1]) !== 1) {
          dispatch(setComparisonImgaeLayoutChange([1, 1]));
        }
        if (row * column === 1) {
          dispatch(setComparisonSeriesStorageChange([2,2]))
        }else {
          dispatch(setComparisonSeriesStorageChange([row,column]))
        }
        dispatch(setComparisonSeriesChange([row, column]));
      }
    },
    [firstImageLayout, selectedStudyType, comparisonImageLayout],
  );

  //이미지 레이아웃 modal click 시 이벤트
  const onImageLayoutModalClickButton = useCallback(
    (event: any) => {
      const row = Number(event.target.dataset.row);
      const column = Number(event.target.dataset.column);
      if (selectedStudyType === 'default') {
        dispatch({ type: 'setImageLayout/0', payload: [row, column] })

      } else if (selectedStudyType === 'comparison') {
        dispatch(setComparisonImgaeLayoutChange([row, column]));
      }
    },
    [selectedStudyType],
  );

  //시리즈 레이아웃 click 시 모달 설정 이벤트
  const seriesModalButton = useCallback(() => {
    setModalBool({
      ...modalBool,
      toolsModal: false,
      annotationModal: false,
      resetModal: false,
      imageLayoutModal: false,
      seriesModal: !modalBool.seriesModal,
    });
  }, [modalBool]);

  //이미지 레이아웃 click 시 모달 설정 이벤트
  const imageLayoutModalButton = useCallback(() => {
    setModalBool({
      ...modalBool,
      toolsModal: false,
      annotationModal: false,
      resetModal: false,
      seriesModal: false,
      imageLayoutModal: !modalBool.imageLayoutModal,
    });
  }, [modalBool]);

  //도구 click 시 모달 설정 이벤트
  const toolsClickButton = useCallback(() => {
    setModalBool({
      ...modalBool,
      seriesModal: false,
      annotationModal: false,
      resetModal: false,
      toolsModal: !modalBool.toolsModal,
    });
  }, [modalBool]);

  //주석 tool click 시 모달 설정 이벤트
  const annotationClickButton = useCallback(() => {
    setModalBool({
      ...modalBool,
      seriesModal: false,
      toolsModal: false,
      resetModal: false,
      annotationModal: !modalBool.annotationModal,
    });
  }, [modalBool]);

  //재설정 tool click 시 모달 설정 이벤트
  const resetClickButton = useCallback(() => {
    setModalBool({
      ...modalBool,
      seriesModal: false,
      toolsModal: false,
      annotationModal: false,
      resetModal: !modalBool.resetModal,
    });
  }, [modalBool]);

  const MouseLeaveEvent = useCallback(() => {
    setModalBool({
      ...modalBool,
      seriesModal: false,
      toolsModal: false,
      annotationModal: false,
      resetModal: false,
      imageLayoutModal: false,
    });
  }, []);
  function imgTagg(v: any, i: number, event: any, bool: any) {
    return (
      <button
        key={i}
        data-tool={i}
        onClick={event}
        className="toolModalParent"
        ref={(element) => (myModals.current[v.tool] = element)}
        onMouseLeave={MouseLeaveEvent}
      >
        <div  title={v.name}>
          <img src={require(`@assets/icons/${v.src}`).default} data-tool={i} />
          <svg viewBox="0 0 1030 638" width="10">
            <path
              d="M1017 68L541 626q-11 12-26 12t-26-12L13 68Q-3 49 6 24.5T39 0h952q24 0 33 24.5t-7 43.5z"
              fill="#FFF"
            />
          </svg>
        </div>
        {isBigScreen&&<span>{v.name}</span>}
        <div className={bool ? 'toolModalChildren' : 'toolModalChildren displayNone'}>
          {v.modalTools?.map((value: any, i: number) => {
            if (props.toolSetting[v.tool][value.tool]) {
              return (
                <div key={i}>
                  {value.tool === 'Crosshairs' || value.tool ==='referenceLine' ? (
                    <div
                      key={i}
                      data-tool={value.tool}
                      className={
                        selectedStudyType==='default' ?
                        firstStudyIsOneSeries || playClipModal || (firstImageLayout[0] *  firstImageLayout[1] !== 1)
                        ? `currentTool disable ${v.tool}`
                        :`currentTool ${value.tool}`
                        :comparisonOneSeries ||playClipModal || (comparisonImageLayout[0] * comparisonImageLayout[1] !==1 )
                        ? `currentTool disable ${v.tool}`
                        :`currentTool ${value.tool}`
                      }
                      // disabled={
                      //   playClipModal || choiceTool === 'ReferenceLines' || (firstImageLayout[0] !== 1 && firstImageLayout[1] !== 1)
                      //     ? true
                      //     : false
                      // }
                      data-parent={v.tool}
                      ref={(element) => (myTools.current[value.tool] = element)}
                      onClick={ToolClickButton}
                      onMouseEnter={imageCacheEvent}
                      title={value.name}
                    >
                      <img
                        src={require(`@assets/icons/${value.src}`).default}
                        data-tool={value.tool}
                        data-parent={v.tool}
                      />
                      {isBigScreen&&<span data-tool={value.tool} data-parent={v.tool}>
                        {value.name}
                      </span>}
                    </div>
                  ) : (
                    <div
                      key={i}
                      data-tool={value.tool}
                      className={`currentTool ${value.tool}`}
                      data-parent={v.tool}
                      ref={(element) => (myTools.current[value.tool] = element)}
                      onClick={ToolClickButton}
                      title={value.name}
                    >
                      <img
                        src={require(`@assets/icons/${value.src}`).default}
                        data-tool={value.tool}
                        data-parent={v.tool}
                      />
                      {isBigScreen&&<span data-tool={value.tool} data-parent={v.tool}>
                        {value.name}
                      </span>}
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      </button>
    );
  }

  //워크리스트 tool 선택 시
  const workListButton = useCallback(() => {
    setTimeout(() => {
      try {
        navigate('/pacs/worklist');
      } catch (error) {
        console.log(error);
      } finally {
        if (comparisonCheckBool) {
          dispatch(setComparisonCheckBoolChange(false));
          if (comparisonImageLayout[0] * comparisonImageLayout[0] !== 1) {
            dispatch(setComparisonImgaeLayoutChange([1, 1]));
          }
        }
        if (gspsBool) {
          dispatch(setGSPSBoolChange(false));
        }
        
        // dispatch(setSeriesChange([2, 2]));
        dispatch(setPalyClipModalChnage(false));
        //이미지 레이아웃 실행중일 시 초기화
        if (firstImageLayout[0] * firstImageLayout[1] !== 1) {
          dispatch({ type: 'setImageLayoutDoubleClickBool/0', payload: false })

          dispatch({ type: 'setImageLayout/0', payload: [1, 1] })
        }
        if (selectedStudyType !== 'default') {
          dispatch(setSelectedStudyType('default'));
        }
        dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: false } })
        dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: 4 } })
        
        dispatch(
          setToolChange({
            tool: 'default',
            toolbool: !toolChangeCheckBool,
          }),
        );
        dispatch({ type: 'setIsOneSeries/0', payload: false })
      }
    }, 50);
  }, [comparisonCheckBool, firstImageLayout, selectedStudyType, comparisonImageLayout,gspsBool]);

  //이전검사 버튼 클릭 시
  const previousStudyButton = useCallback(
    async (event: any) => {
      try {
        if (firstStudyIsOneSeries) {
          dispatch({ type: 'setIsOneSeries/0', payload: !firstStudyIsOneSeries })
        }
        if (firstImageLayoutDoubleClickBool) {
          dispatch({ type: 'setImageLayoutDoubleClickBool/0', payload: !firstImageLayoutDoubleClickBool })
        }
        if (comparisonCheckBool) {
          dispatch(setComparisonCheckBoolChange(false));
        }
        if (gspsBool) {
          dispatch(setGSPSBoolChange(false));
        }
        dispatch({ type: 'setImageLayout/0', payload: [1, 1] })
        dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: false, selectedElementNumber :0} })
        // dispatch(setSeriesChange([2, 2]));
        // dispatch(
        //   setSeriesValueChange({
        //     seriesMin: 0,
        //     seriesMax: 4,
        //   }),
        // );
      } catch (err) {
        console.error(err);
      }
      setTimeout(() => {
        PreviousAndnext('previous', '이전 검사가 없습니다.');
      }, 1000);
    },
    [study_key, toolChangeCheckBool, firstStudyIsOneSeries, firstImageLayoutDoubleClickBool, comparisonCheckBool, worklistArr,gspsBool],
  );

  //다음검사 클릭 시
  const nextStudyButton = useCallback(
    async (event: any) => {
      try {
        if (firstStudyIsOneSeries) {
          dispatch({ type: 'setIsOneSeries/0', payload: !firstStudyIsOneSeries })
        }
        if (firstImageLayoutDoubleClickBool) {
          dispatch({ type: 'setImageLayoutDoubleClickBool/0', payload: !firstImageLayoutDoubleClickBool })
        }
        if (gspsBool) {
          dispatch(setGSPSBoolChange(false));
        }
        if (comparisonCheckBool) {
          dispatch(setComparisonCheckBoolChange(false));
        }
        dispatch({ type: 'setImageLayout/0', payload: [1, 1] })
        dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: false, selectedElementNumber:0 } })

        // dispatch(setSeriesChange([2, 2]));
        // dispatch(
        //   setSeriesValueChange({
        //     seriesMin: 0,
        //     seriesMax: 4,
        //   }),
        // );
      } catch (err) {
        console.error(err);
      }
      setTimeout(() => {
        PreviousAndnext('next', '다음 검사가 없습니다.');
      }, 1000);
    },
    [study_key, toolChangeCheckBool, firstImageLayoutDoubleClickBool, firstStudyIsOneSeries, comparisonCheckBool, worklistArr,gspsBool],
  );

  //이전,다음 검사를 위한 함수
  const PreviousAndnext = useCallback(
    async (type: string, message: string) => {
      const defaultTool = document.querySelector('.default');
      const currentTool = document.querySelectorAll('.active-tool');
      const activeModal = document.querySelector('.active-tool-modal');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      };

      activeModal?.classList.remove('active-tool-modal');
      dispatch(setPalyClipModalChnage(false));

      currentTool.forEach((v) => {
        if (v === defaultTool) {
          return;
        } else {
          v.classList.remove('active-tool');
        }
      });

      if (!defaultTool?.classList.value.includes('active-tool')) {
        defaultTool?.classList.add('active-tool');
      }

      dispatch(
        setToolChange({
          tool: 'default',
          toolbool: !toolChangeCheckBool,
        }),
      );

      cornerstone.imageCache.purgeCache();

      async function worklistLogic(pagingNumber: number, type: string) {
        let value = true;
        let number = 1;
        while (value) {
          const payload = {
            params: {
              patient_id,
              patient_name,
              reading_status,
              modality,
              verify_flag,
              start_date: startDate,
              end_date: endDate,
              pagingNum: pagingNumber + number,
              limit: 10,
              listLength: 10,
            },
            headers,
          };
          sessionStorage.setItem('search', JSON.stringify(payload.params));
          dispatch(pagingNumAction(pagingNumber + number));
          await call
            .get(
              `/api/v1/worklists?pID=${payload.params.patient_id}&pName=${payload.params.patient_name}&reportStatus=${
                payload.params.reading_status
              }&startDate=${payload.params.start_date}&endDate=${payload.params.end_date}&modality=${
                payload.params.modality
              }&verifyFlag=${payload.params.verify_flag}&pagingNum=${payload.params.pagingNum}&limit=${
                payload.params.limit
              }&listLength=${payload.params.listLength * number}`,
            )
            .then(({ data }) => {
              setMoreWorklistArr(data);
              const index = data.findIndex((v: any) => v.studyKey === Number(study_key));
              //찾는 목록이 list에 있는경우를 뜻함
              if (!(index < 0)) {
                if (type === 'next') {
                  //리스트에 +1(next) 했을때 index가 있는지 확인 없을때 else
                  if (data[index + 1]) {
                    const dataValue: any = data[index + 1];
                    navigate(`/pacs/viewer/${dataValue.studyKey}/${dataValue.studyInsUID}/${dataValue.pID}`);
                    value = false;
                  } else {
                    //+1이 없다는건 한번만 더 리스트를 조회하면 된다는 뜻
                    call
                      .get(
                        `/api/v1/worklists?pID=${payload.params.patient_id}&pName=${
                          payload.params.patient_name
                        }&reportStatus=${payload.params.reading_status}&startDate=${
                          payload.params.start_date
                        }&endDate=${payload.params.end_date}&modality=${payload.params.modality}&verifyFlag=${
                          payload.params.verify_flag
                        }&pagingNum=${payload.params.pagingNum + 1}&limit=${payload.params.limit}&listLength=${
                          payload.params.listLength * number + 10
                        }`,
                      )
                      .then(({ data }) => {
                        setMoreWorklistArr(data);
                        const dataValue2: any = data[0];
                        value = false;
                        navigate(`/pacs/viewer/${dataValue2.studyKey}/${dataValue2.studyInsUID}/${dataValue2.pID}`);
                      })
                      .catch((error) => {
                        console.error(error);
                        value = false;
                      });
                  }
                } else if (type === 'previous') {
                  if (data[index - 1]) {
                    const dataValue: any = data[index - 1];
                    navigate(`/pacs/viewer/${dataValue.studyKey}/${dataValue.studyInsUID}/${dataValue.pID}`);
                    value = false;
                  } else {
                    //필요없는 로직이라고 생각됨 지금까지 순차적으로 로직을 실행했는데 index의 -1 번째가 없을수 없을듯
                    call
                      .get(
                        `/api/v1/worklists?pID=${payload.params.patient_id}&pName=${
                          payload.params.patient_name
                        }&reportStatus=${payload.params.reading_status}&startDate=${
                          payload.params.start_date
                        }&endDate=${payload.params.end_date}&modality=${payload.params.modality}&verifyFlag=${
                          payload.params.verify_flag
                        }&pagingNum=${payload.params.pagingNum - 1}&limit=${payload.params.limit}&listLength=${
                          payload.params.listLength
                        }`,
                      )
                      .then(({ data }) => {
                        setMoreWorklistArr(data);
                        const dataValue2: any = data[data.length - 1];
                        navigate(`/pacs/viewer/${dataValue2.studyKey}/${dataValue2.studyInsUID}/${dataValue2.pID}`);
                        value = false;
                      })
                      .catch((error) => {
                        console.error(error);
                        value = false;
                      });
                  }
                }
              }
              if (number > 10) {
                value = false;
              }
            });
          number++;
        }
      }

      //자동화 로직
      if (worklistArr.length === 0) {
        const payload = {
          params: {
            patient_id,
            patient_name,
            reading_status,
            modality,
            verify_flag,
            start_date: startDate,
            end_date: endDate,
            pagingNum: 0,
            limit: 10,
            listLength: worklistArr.length,
          },
          headers,
        };
        //새로고침으로 인해 워크리스트가 리덕스에서 사라진 경우를 위함
        await call
          .get(
            `/api/v1/worklists?pID=${payload.params.patient_id}&pName=${payload.params.patient_name}&reportStatus=${payload.params.reading_status}&startDate=${payload.params.start_date}&endDate=${payload.params.end_date}&modality=${payload.params.modality}&verifyFlag=${payload.params.verify_flag}&pagingNum=${payload.params.pagingNum}&limit=${payload.params.limit}`,
          )
          .then(({ data }) => {
            dispatch(setWorklistArrChange(data));
            const index = data.findIndex((v: any) => v.studyKey === Number(study_key));
            //index가 0보다 작다는건 index가 음수인경우 리스트에 검사가 없는 경우 이럴때는 만들어준 worklistLogic 함수에 값을 넘김
            if (index < 0) {
              worklistLogic(0, type);
            }
            //0 과 같거나 크다는것은 워크리스트 첫조회시 검사가 존재한다는 뜻 1~10 사이의 검사중하나
            if (index >= 0) {
              if (type === 'next') {
                if (data[index + 1]) {
                  //다음검사로 넘어가기 위해 +1 하여 worklistArr 배열에서 탐색 배열이 있는 경우
                  const value: any = data[index + 1];
                  navigate(`/pacs/viewer/${value.studyKey}/${value.studyInsUID}/${value.pID}`);
                  return;
                } else {
                  //다음검사로 넘어가기 위해 +1 하여 worklistArr 배열에서 탐색 배열이 없는 경우
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
                      limit: 10,
                      listLength: 10,
                    },
                    headers,
                  };
                  call
                    .get(
                      `/api/v1/worklists?pID=${payload.params.patient_id}&pName=${payload.params.patient_name}&reportStatus=${payload.params.reading_status}&startDate=${payload.params.start_date}&endDate=${payload.params.end_date}&modality=${payload.params.modality}&verifyFlag=${payload.params.verify_flag}&pagingNum=${payload.params.pagingNum}&limit=${payload.params.limit}&listLength=${payload.params.listLength}`,
                    )
                    .then(({ data }) => {
                      setMoreWorklistArr(data);
                      dispatch(pagingNumAction(pagingNum + 1));
                      const dataValue2: any = data[0];
                      navigate(`/pacs/viewer/${dataValue2.studyKey}/${dataValue2.studyInsUID}/${dataValue2.pID}`);
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              } else if (type === 'previous') {
                if (data[index - 1]) {
                  // 이전검사로 넘어가기위해 -1하여 worklistArr 배열에서 탐색 배열이 있는 경우
                  const value: any = data[index - 1];
                  navigate(`/pacs/viewer/${value.studyKey}/${value.studyInsUID}/${value.pID}`);
                } else {
                  // 이전검사로 넘어가기위해 -1하여 worklistArr 배열에서 탐색 배열이 없는 경우 첫번째 검사임
                  alert(t('TID03049'));
                }
              }
            }
          });
      } else {
        //navigate를 통해 viewer페이지로 이동한 경우 리덕스에 워크리스트 배열을 가지고 있음
        const index = worklistArr.findIndex((v: any) => v.studyKey === Number(study_key));
        if (index < 0) {
          //호출되는 경우가 없는것 같음 파악 후 삭제 요망
          worklistLogic(pagingNum, type);
        } else {
          //worklistArr에 현재 검사가 있는 경우
          if (type === 'next') {
            if (worklistArr[index + 1]) {
              //다음검사로 넘어가기 위해 +1 하여 worklistArr 배열에서 탐색 배열이 있는 경우
              const value: any = worklistArr[index + 1];
              navigate(`/pacs/viewer/${value.studyKey}/${value.studyInsUID}/${value.pID}`);
            } else {
              //다음검사로 넘어가기 위해 +1 하여 worklistArr 배열에서 탐색 배열이 없는 경우
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
                  limit: 10,
                  listLength: worklistArr.length,
                },
                headers,
              };
              call
                .get(
                  `/api/v1/worklists?pID=${payload.params.patient_id}&pName=${payload.params.patient_name}&reportStatus=${payload.params.reading_status}&startDate=${payload.params.start_date}&endDate=${payload.params.end_date}&modality=${payload.params.modality}&verifyFlag=${payload.params.verify_flag}&pagingNum=${payload.params.pagingNum}&limit=${payload.params.limit}&listLength=${payload.params.listLength}`,
                )
                .then(({ data }) => {
                  setMoreWorklistArr(data);
                  dispatch(pagingNumAction(pagingNum + 1));
                  const dataValue2: any = data[0];
                  navigate(`/pacs/viewer/${dataValue2.studyKey}/${dataValue2.studyInsUID}/${dataValue2.pID}`);
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          } else if (type === 'previous') {
            if (worklistArr[index - 1]) {
              // 이전검사로 넘어가기위해 -1하여 worklistArr 배열에서 탐색 배열이 있는 경우
              const value: any = worklistArr[index - 1];
              navigate(`/pacs/viewer/${value.studyKey}/${value.studyInsUID}/${value.pID}`);
            } else {
              // 이전검사로 넘어가기위해 -1하여 worklistArr 배열에서 탐색 배열이 없는 경우 첫번째 검사임
              alert(t('TID03049'));
            }
          }
        }
      }
    },
    [pagingNum, patient_id, patient_name, reading_status, modality, verify_flag, worklistArr, study_key],
  );

  useEffect(() => {
    if (firstRandering) {
      if (moreWorklistArr !== undefined && moreWorklistArr !== null) {
        const Arr = worklistArr.concat(moreWorklistArr);
        dispatch(setWorklistArrChange(Arr));
      }
    }
  }, [moreWorklistArr]);

  useEffect(() => {
    if (!firstRandering) {
      setFirstRandering(true);
    }
    
  }, []);
 
 

  const imageCacheEvent = useCallback(() => {
    if (!firstStudyIsOneSeries) {
      for (const imageId of props.imageurl) {
        for (const img of imageId) {
          cornerstone.loadAndCacheImage(img);
        }
      }
    }
  }, [firstStudyIsOneSeries,props]);
  const AnnotationSaveButton = useCallback(async()=> {
    const annotation =cornerstoneTools.globalImageIdSpecificToolStateManager.toolState;
    const json2:any = JSON.parse(JSON.stringify(annotation));

    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    const user_id :any =DecryptAES256(userID)
    // gspsURI.forEach(key => {
    //   if(json2[key] && json2[key].FreehandRoi) { // key와 FreehandRoi가 있는지 확인
    //     if(Object.keys(json2[key]).length === 1) { // FreehandRoi만 있는지 확인
    //       delete json2[key]; // 부모 key 삭제
    //     } else {
    //       delete json2[key].FreehandRoi; // FreehandRoi만 삭제
    //     }
    //   }
    // });


    Object.keys(json2).map((key:any) => {
      const studyId = key.split("/")[5]; // 'studies/' 뒤의 숫자를 가져옵니다.
      if(studyId !== study_key) {
        delete json2[key];
      }
    });


    gspsURI.forEach(key => {
      if(json2[key] && json2[key].FreehandRoi) {
        json2[key].FreehandRoi.data = json2[key].FreehandRoi.data.filter((item:any) =>  item.color === undefined ? item : false);
          if(json2[key].FreehandRoi.data.length === 0) {
              delete json2[key].FreehandRoi;
          }
          if(Object.keys(json2[key]).length === 0) {
              delete json2[key];
          }
      }
  });



    Object.keys(json2).forEach(key => {
      Object.keys(json2[key]).forEach(subKey => {
          if(json2[key][subKey].data.length === 0) { // data의 길이가 0인지 확인
              delete json2[key][subKey]; // data의 길이가 0이면 해당 키 삭제
          }
      });
      if(Object.keys(json2[key]).length === 0) { // 모든 키가 삭제되었는지 확인
          delete json2[key]; // 모든 키가 삭제되었으면 부모 키 삭제
      }
  });


    if (confirm('저장하시겠습니까?')) {
      if ((Object.keys(json2)).length > 0) {
        // const aa = pako.gzip(JSON.stringify(json2))
        await call.post('/api/v1/annotation',{UserID:user_id,StudyKey:study_key,A_Data:JSON.stringify(json2)},t('TID02712')).then((res)=> {
          alert(res)
        })
      }else {
        alert('저장할 주석이 없습니다.')
      }
    }
  },[gspsURI,study_key])
  return (
    <ViewerToolCss>
      <button onClick={workListButton} title={t('TID00009')}>
        <img src={require(`@assets/icons/worklist.png`).default} />
        {isBigScreen&&<span>{t('TID00009')}</span>}
      </button>
      <button onClick={previousStudyButton} title={t('TID02865')}>
        <img src={require(`@assets/icons/previous_study.png`).default} />
        {isBigScreen&& <span>{t('TID02865')}</span>}
      </button>
      <button onClick={nextStudyButton} title={t('TID02866')}>
        <img src={require(`@assets/icons/next_study.png`).default} />
        {isBigScreen&&<span>{t('TID02866')}</span>}
      </button>
      {ToolChainArray().map((v:any, i) => {
        if (props.toolSetting[v.tool]) {
          return v.tool === 'tools' && props.toolSetting['toolsBool'] ? (
            <div key={i}>{imgTagg(v, i, toolsClickButton, modalBool.toolsModal)}</div>
          ) : v.tool === 'annotation' &&props.toolSetting['annotationBool'] ? (
            <div key={i}>{imgTagg(v, i, annotationClickButton, modalBool.annotationModal)}</div>
          ) : v.tool === 'reset' && props.toolSetting['resetBool'] ? (
            <div key={i}>{imgTagg(v, i, resetClickButton, modalBool.resetModal)}</div>
          ) : 
          v.tool === 'oneSeriesImage' ? (
            <button
              key={i}
              className={
                selectedStudyType === 'default' && firstStudyIsOneSeries
                  ? `currentTool active-tool ${v.tool}`
                  : playClipModal || choiceTool === 'ReferenceLines'||choiceTool ==='Crosshairs' || (firstImageLayout[0] * firstImageLayout[1] !== 1)
                  ? `currentTool disable ${v.tool}`
                  : selectedStudyType === 'comparison' && comparisonOneSeries
                  ? `currentTool active-tool ${v.tool}`
                  : playClipModal || choiceTool === 'ReferenceLines'||choiceTool ==='Crosshairs' || (comparisonImageLayout[0] * comparisonImageLayout[1] !== 1)
                  ? `currentTool disable ${v.tool}`
                  : `currentTool ${v.tool}`
              }
              onClick={ToolClickButton}
              data-tool={v.tool}
              ref={(element) => (myTools.current[v.tool] = element)}
              disabled={playClipModal || choiceTool ==="ReferenceLines"||choiceTool ==='Crosshairs' ||(firstImageLayout[0] * firstImageLayout[1] !== 1) ||(comparisonImageLayout[0] * comparisonImageLayout[1] !== 1) ? true :false}
              title={v.name}
            >
              <img src={require(`@assets/icons/${v.src}`).default} data-tool={v.tool} />
              {isBigScreen&&<span data-tool={v.tool}>{v.name}</span>}
            </button>
          ) : v.tool ==='playclip' ? (
            <button
            key={i}
            className={firstStudyIsOneSeries || comparisonOneSeries ||( firstImageLayout[0] * firstImageLayout[1]!==1) || (comparisonImageLayout[0] * comparisonImageLayout[1] !== 1) ||choiceTool ==='ReferenceLines'||choiceTool ==='Crosshairs' ?`currentTool disable ${v.tool}`:  `currentTool ${v.tool}`}
            onClick={ToolClickButton}
            data-tool={v.tool}
            ref={(element) => (myTools.current[v.tool] = element)}
            disabled={firstStudyIsOneSeries || comparisonOneSeries ||( firstImageLayout[0] * firstImageLayout[1]!==1) || (comparisonImageLayout[0] * comparisonImageLayout[1] !== 1) ||choiceTool ==='ReferenceLines'||choiceTool ==='Crosshairs' ? true : false}
            title={v.name}
          >
            <img src={require(`@assets/icons/${v.src}`).default} data-tool={v.tool} />
            {isBigScreen&&<span data-tool={v.tool}>{v.name}</span>}
          </button>
          ) :v.tool ==='ScrollLoop' ? (
            <button
            key={i}
            className={firstStudyIsOneSeries || comparisonOneSeries ||( firstImageLayout[0] * firstImageLayout[1]!==1) ||playClipModal|| (comparisonImageLayout[0] * comparisonImageLayout[1] !== 1) ||choiceTool ==='ReferenceLines'||choiceTool ==='Crosshairs' ?`currentTool disable ${v.tool}`: scrollLoopBool ? `currentTool active-tool ${v.tool}` : `currentTool ${v.tool}`}
            onClick={ToolClickButton}
            data-tool={v.tool}
            ref={(element) => (myTools.current[v.tool] = element)}
            disabled={firstStudyIsOneSeries || comparisonOneSeries ||( firstImageLayout[0] * firstImageLayout[1]!==1) ||playClipModal|| (comparisonImageLayout[0] * comparisonImageLayout[1] !== 1) ||choiceTool ==='ReferenceLines'||choiceTool ==='Crosshairs' ? true : false}
            title={v.name}
            >
              <img src={require(`@assets/icons/${v.src}`).default} data-tool={v.tool} />
              {isBigScreen&& <span data-tool={v.tool}>{v.name}</span>}
            </button>
          )
           : v.tool !== 'tools' && v.tool !== 'annotation' && v.tool !== 'reset' && (
            <button
              key={i}
              className={v.tool === 'default' ? `currentTool active-tool ${v.tool} asd` : `currentTool asd ${v.tool}`}
              onClick={ToolClickButton}
              data-tool={v.tool}
              ref={(element) => (myTools.current[v.tool] = element)}
              title={v.name}
            >
              <img src={require(`@assets/icons/${v.src}`).default} data-tool={v.tool} />
              {isBigScreen&& <span data-tool={v.tool}>{v.name}</span>}
            </button>
          );
        }
      })}
      <button onClick={seriesModalButton} onMouseLeave={MouseLeaveEvent} title={t('TID02991')}>
        <div>
          <img src={require('@assets/icons/changeSeriesLayout.png').default} />
          <svg viewBox="0 0 1030 638" width="10">
            <path
              d="M1017 68L541 626q-11 12-26 12t-26-12L13 68Q-3 49 6 24.5T39 0h952q24 0 33 24.5t-7 43.5z"
              fill="#FFF"
            />
          </svg>
        </div>
        {isBigScreen&&<span>{t('TID02991')}</span>}
        {modalBool.seriesModal ? (
          <TogleCss>
            <div ref={ModalRef} className="togleBox">
              {Array(5)
                .fill(' ')
                .map((v, i) => {
                  return (
                    <div key={i}>
                      {Array(5)
                        .fill(' ')
                        .map((v, j) => {
                          return (
                            <div key={j} className="vertical-align">
                              <div
                                id="table"
                                className="table"
                                onMouseOver={onModalMouseOver}
                                onMouseOut={onModalMouseOut}
                                onClick={onSeriesModalClickButton}
                                data-row={i + 1}
                                data-column={j + 1}
                              />
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
          </TogleCss>
        ) : (
          ''
        )}
      </button>
        <button 
          className={
            selectedStudyType ==='default'
            ?firstStudyIsOneSeries || playClipModal || choiceTool === 'ReferenceLines' ||choiceTool ==='Crosshairs' || !(firstSeriesLayout
              [0] === 1 && firstSeriesLayout
              [1] === 1)
            ? 'disable' 
            : ''
            :comparisonOneSeries || playClipModal || choiceTool ==='ReferenceLines'||choiceTool ==='Crosshairs' || !(comparisonSeries[0] === 1 && comparisonSeries[1] === 1)
            ? "disable" 
            : ''
          }
          onClick={imageLayoutModalButton}
          onMouseLeave={MouseLeaveEvent}
          disabled={
            selectedStudyType ==='default'?
            firstStudyIsOneSeries || playClipModal || choiceTool === 'ReferenceLines' ||choiceTool ==='Crosshairs' ||!(firstSeriesLayout
              [0] === 1 && firstSeriesLayout
              [1] === 1)
            ? true
            : false
            :comparisonOneSeries || playClipModal || choiceTool ==='ReferneceLines'||choiceTool ==='Crosshairs' ||!(comparisonSeries[0] === 1 && comparisonSeries[1] === 1)
            ? true
            :false
          }
          title={t('TID03017')}
         >
          <div>
            <img src={require('@assets/icons/changeSeriesLayout.png').default} />
            <svg viewBox="0 0 1030 638" width="10">
              <path
                d="M1017 68L541 626q-11 12-26 12t-26-12L13 68Q-3 49 6 24.5T39 0h952q24 0 33 24.5t-7 43.5z"
                fill="#FFF"
              />
            </svg>
          </div>
          {isBigScreen &&<span>{t('TID03017')}</span>}
          {modalBool.imageLayoutModal ? (
            <TogleCss>
              <div ref={ModalRef} className="togleBox">
                {Array(5)
                  .fill(' ')
                  .map((v, i) => {
                    return (
                      <div key={i}>
                        {Array(5)
                          .fill(' ')
                          .map((v, j) => {
                            return (
                              <div key={j} className="vertical-align">
                                <div
                                  id="table"
                                  className="table"
                                  onMouseOver={onModalMouseOver}
                                  onMouseOut={onModalMouseOut}
                                  onClick={onImageLayoutModalClickButton}
                                  data-row={i + 1}
                                  data-column={j + 1}
                                />
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
              </div>
            </TogleCss>
          ) : (
            ''
          )}
        </button>
        <button
              onClick={AnnotationSaveButton}
              title={`${t('TID01840')} ${t('TID01543')}`}
            >
              <img src={require(`@assets/icons/save.png`).default} />
              {isBigScreen&& <span>{t('TID01840')} {t('TID01543')}</span>}
            </button>
      {/* )} */}
    </ViewerToolCss>
  );
});

export default Toolbar;
