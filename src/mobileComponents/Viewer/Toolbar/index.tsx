/**
 * viewer toolbar component
 *
 */
import React, { memo, useCallback, useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { setToolChange, setScrollLoopBoolChange, setPalyClipModalChnage, setGSPSBoolChange } from '@store/Tool';

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
import { ToolChainArray, ActiveToolException } from '@mobileComponents/Viewer/ArrChain';
import { Call } from '@utils/JwtHelper';
import cornerstone from 'cornerstone-core';
import { RootState } from '@store/index';
import { useTranslation } from 'react-i18next';
import { setWorklistArrChange } from '@store/worklist';
import { pagingNumAction } from '@store/filter';
import { AppDispatch } from '@store/index';
import { toolbar } from '@typings/etcType';
import cornerstoneTools from 'cornerstone-tools';
import DecryptAES256 from '@utils/DecryptAES256';
import pako from 'pako';
import HandymanIcon from '@mui/icons-material/Handyman';
import { debounce } from 'lodash';
import { setMobileThumbnailChange } from '@store/settingbox';
const Toolbar = forwardRef((props: any, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const call = new Call();
  //document.querySelctor 대체
  const myTools = useRef<any>({});
  const myModals = useRef<any>({});
  const ModalRef = useRef() as React.MutableRefObject<any>;
  const { toolChangeCheckBool, choiceTool, playClipModal, gspsBool, gspsURI, scrollLoopBool } = useSelector(
    (state: RootState) => state.tool.toolbar,
  );
  const { worklistArr } = useSelector((state: RootState) => state.worklistReducer.worklist);
  const { mobileThumbnailBool } = useSelector((state: RootState) => state.setting.setting);
  const {  series, comparisonOneSeries } = useSelector(
    (state: RootState) => state.serieslayout.seriesLayout,
  );
  ////
  const { seriesLayout: firstStudySeriesLayout, seriesDoubleClickBool,
    isOneSeries: firstStudyIsOneSeries
  } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { imageLayout: firstImageLayout, imageLayoutDoubleClickBool: firstImageLayoutDoubleClickBool } = useSelector((state: RootState) => state.studyStatus[0].imageLayout)
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)

////
  const { pagingNum, patient_id, patient_name, reading_status, modality, verify_flag, startDate, endDate } =
    useSelector((state: RootState) => state.filter.filter);
  const { imageLayout } = useSelector((state: RootState) => state.imagelayout.imagelayout);
  const {
    comparisonCheckBool,
    comparisonImageLayout,
    comparisonSeries,
    ComparisonseriesDoubleClickBool,
  } = useSelector((state: RootState) => state.comparison.comparison);
  
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
        if (ActiveToolException.includes(ToolName)) {
          //재설정/전체삭제 등의 tool 클릭 시 이전 사용 tool이 적용되고 있어야 함
          dispatch(
            setToolChange({
              tool: event.target.dataset.tool,
              toolbool: !toolChangeCheckBool,
            }),
          );
          return;
        } else if (ToolName === 'playclip') {
          currentTool.classList.add('active-tool');
          dispatch(setPalyClipModalChnage(true));
        } else {
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
      } else if (ToolName === 'playclip' && currentToolActiveCheck) {
        if (selectedStudyType === 'default') {
          setDefaultToolArr(defaultToolArr.filter((el: any) => el !== ToolName));
        }
        currentTool.classList.remove('active-tool');
        dispatch(setPalyClipModalChnage(false));
      }
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
      
      firstImageLayout,
      comparisonImageLayout,
      comparisonOneSeries,
      selectedStudyType,
      comparisonOneSeries,
      ComparisonseriesDoubleClickBool,
      defaultToolArr,
      comparisonToolArr,
      firstStudySeriesLayout,
    ],
  );

  //이전검사 버튼 클릭 시
  const previousStudyButton = useCallback(
    debounce(async (event: any) => {
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
        PreviousAndnext('previous', '이전 검사가 없습니다.');
      }, 1000);
    }, 300),
    [study_key, toolChangeCheckBool,  firstImageLayoutDoubleClickBool, comparisonCheckBool, worklistArr, gspsBool],
  );

  //다음검사 클릭 시
  const nextStudyButton = useCallback(
    debounce(async (event: any) => {
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
    }, 300),
    [study_key, toolChangeCheckBool, firstImageLayoutDoubleClickBool,  comparisonCheckBool, worklistArr, gspsBool],
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

  useImperativeHandle(ref, () => ({
    nextStudyButton,
    previousStudyButton,
  }));

  const handleThumbnail = useCallback(() => {
    dispatch(setMobileThumbnailChange(!mobileThumbnailBool));
    const active = document.querySelector('.Thumbnail');
  }, [mobileThumbnailBool]);
  return (
    <ViewerToolCss>
      <button onClick={previousStudyButton}>
        <img src={require(`@assets/icons/previous_study.png`).default} />
        <span>{t('TID02865')}</span>
      </button>
      <button onClick={nextStudyButton}>
        <img src={require(`@assets/icons/next_study.png`).default} />
        <span>{t('TID02866')}</span>
      </button>
      <button onClick={handleThumbnail} className="Thumbnail">
        <HandymanIcon sx={{ color: '#fff' }} />
        <span>썸네일</span>
      </button>
      {ToolChainArray().map((v: any, i) => {
        return v.tool === 'playclip' ? (
          <button
            key={i}
            className={
              firstStudyIsOneSeries ||
              comparisonOneSeries ||
              firstImageLayout[0] * firstImageLayout[1] !== 1 ||
              comparisonImageLayout[0] * comparisonImageLayout[1] !== 1 ||
              choiceTool === 'ReferenceLines' ||
              choiceTool === 'Crosshairs'
                ? `currentTool disable ${v.tool}`
                : `currentTool ${v.tool}`
            }
            onClick={ToolClickButton}
            data-tool={v.tool}
            ref={(element) => (myTools.current[v.tool] = element)}
            disabled={
              firstStudyIsOneSeries ||
              comparisonOneSeries ||
              firstImageLayout[0] * firstImageLayout[1] !== 1 ||
              comparisonImageLayout[0] * comparisonImageLayout[1] !== 1 ||
              choiceTool === 'ReferenceLines' ||
              choiceTool === 'Crosshairs'
                ? true
                : false
            }
          >
            <img src={require(`@assets/icons/${v.src}`).default} data-tool={v.tool} />
            <span data-tool={v.tool}>{v.name}</span>
          </button>
        ) : (
          <button
            key={i}
            className={v.tool === 'default' ? `currentTool active-tool ${v.tool} asd` : `currentTool asd ${v.tool}`}
            onClick={ToolClickButton}
            data-tool={v.tool}
            ref={(element) => (myTools.current[v.tool] = element)}
          >
            <img src={require(`@assets/icons/${v.src}`).default} data-tool={v.tool} />
            <span data-tool={v.tool}>{v.name}</span>
          </button>
        );
      })}
    </ViewerToolCss>
  );
});

export default Toolbar;
