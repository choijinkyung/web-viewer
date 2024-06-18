import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import {
  setSeriesChange,
  setSeriesDoubleClickElementChange,
  setSeriesValueChange,
  setSeriesStorageChange,
  setDefaultSeriesStorageChange,
  setComparisonSeriesStorageChange,
} from '@store/series';
import {
  setComparisonDoubleClickBoolChange,
  setComaprisonSeriesValueChange,
  setComparisonSeriesChange,
} from '@store/comparison';
import { throttle } from 'lodash';
import { doubleClickControll } from '@typings/etcType';

const DoubleClickController = ({ firstRandering }: doubleClickControll) => {
  const dispatch = useDispatch();
  const {
    comparisonSeries,
    ComparisonseriesDoubleClickBool,
    comparisonSeriesMin,
    comparisonSeriesMax,
    comparisonWadoElementNumber,
  } = useSelector((state: RootState) => state.comparison.comparison);
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)

  const { series, comparisonSeriesStorage } = useSelector(
    (state: RootState) => state.serieslayout.seriesLayout,
  );
  ////
  const { seriesLayout: firstStudySeriesLayout, seriesDoubleClickBool, seriesMin, seriesMax } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { seriesElementNumber: firstStudyseriesElementNumber } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)

  ////
  const [countEffect, setCountEffect] = useState({
    default: 0,
    comparison: 0,
  });

  

  // //elementDoubleClick 시 이전 시리즈값을 저장하는 로직

  // useEffect(() => {
  //   const doubleClickLogic = throttle(() => {
  //     if (imageLoaderType === 'default') {
  //       if (seriesDoubleClickBool) {
  //         if (!countEffect.default) {
  //           if (Number(series[0]) === 1 && Number(series[1]) === 1) {
  //             dispatch(
  //               setSeriesStorageChange({
  //                 ...seriesStorage,
  //                 default: [2, 2],
  //               }),
  //             );
  //             setCountEffect({
  //               ...countEffect,
  //               default: 0,
  //             });
  //             dispatch(setSeriesChange(seriesStorage.default));
  //             dispatch(
  //               setSeriesDoubleClickElementChange({
  //                 seriesDoubleClickBool: !seriesDoubleClickBool,
  //               }),
  //             );
  //             return;
  //           } else {
  //             setCountEffect({
  //               ...countEffect,
  //               default: 1,
  //             });
  //             dispatch(
  //               setSeriesStorageChange({
  //                 ...seriesStorage,
  //                 default: series,
  //               }),
  //             );
  //           }
  //           dispatch(setSeriesChange([1, 1]));
  //         }
  //       } else {
  //         setCountEffect({
  //           ...countEffect,
  //           default: 0,
  //         });
  //         dispatch(setSeriesChange(seriesStorage.default));
  //       }
  //     } else if (imageLoaderType === 'comparison') {
  //       if (ComparisonseriesDoubleClickBool) {
  //         if (!countEffect.comparison) {
  //           if (Number(comparisonSeries[0]) === 1 && Number(comparisonSeries[1]) === 1) {
  //             dispatch(
  //               setSeriesStorageChange({
  //                 ...seriesStorage,
  //                 comparison: [2, 2],
  //               }),
  //             );
  //             setCountEffect({
  //               ...countEffect,
  //               comparison: 0,
  //             });
  //             dispatch(setComparisonSeriesChange(seriesStorage.comparison));
  //             dispatch(setComparisonDoubleClickBoolChange(!ComparisonseriesDoubleClickBool));
  //             return;
  //           } else {
  //             setCountEffect({
  //               ...countEffect,
  //               comparison: 1,
  //             });
  //             dispatch(
  //               setSeriesStorageChange({
  //                 ...seriesStorage,
  //                 comparison: comparisonSeries,
  //               }),
  //             );
  //           }
  //           dispatch(setComparisonSeriesChange([1, 1]));
  //         }
  //       } else {
  //         setCountEffect({
  //           ...countEffect,
  //           comparison: 0,
  //         });
  //         dispatch(setComparisonSeriesChange(seriesStorage.comparison));
  //       }
  //     }
  //   }, 100);      
  //   if (firstRandering) {
  //     doubleClickLogic()
  //   }
  // }, [seriesDoubleClickBool, ComparisonseriesDoubleClickBool,comparisonSeries,imageLoaderType]);

  //더블클릭 상태에서 시리즈가 변경되었을때의 로직
  
  useEffect(() => {
    if (firstRandering) {
      if (selectedStudyType === 'default') {
        if (seriesDoubleClickBool) {
          if (firstStudySeriesLayout[0] * firstStudySeriesLayout[1] !== 1) {
            dispatch({ type: 'setSeriesStorage/0', payload: firstStudySeriesLayout })

            dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: false, selectedElementNumber:0 } })

            setCountEffect({ ...countEffect, default: 0 });
          }
        }
        //시리즈가 변화했을때 seriesMin/Max 변화
        const seriesMultiply = firstStudySeriesLayout[0] * firstStudySeriesLayout[1];
        if (seriesMax < seriesMultiply) {
          dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: seriesMultiply } })

          
        } else if (seriesMin >= seriesMultiply) {
          const Min: number = firstStudyseriesElementNumber - (firstStudyseriesElementNumber % seriesMultiply);
          const Max: number = Min + seriesMultiply;
          dispatch({ type: 'setSeriesViewRange/0', payload: { min: Min, max: Max } })

        
        } else if (seriesMin < seriesMultiply && seriesMax > seriesMultiply) {
          dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: seriesMultiply } })
         
        }
      } else if (selectedStudyType === 'comparison') {
        if (ComparisonseriesDoubleClickBool) {
          if (comparisonSeries[0] * comparisonSeries[1] !== 1) {
            dispatch(
              setComparisonSeriesStorageChange(comparisonSeries),
            );
            dispatch(setComparisonDoubleClickBoolChange(false));
            setCountEffect({ ...countEffect, comparison: 0 });
          }
        }
        //시리즈가 변화했을때 seriesMin/Max 변화
        const comparisonSeriesMultiply = comparisonSeries[0] * comparisonSeries[1];
        if (comparisonSeriesMax < comparisonSeriesMultiply) {
          dispatch(
            setComaprisonSeriesValueChange({
              comparisonSeriesMin: 0,
              comparisonSeriesMax: comparisonSeriesMultiply,
            }),
          );
        } else if (comparisonSeriesMin >= comparisonSeriesMultiply) {
          const Min: number = comparisonWadoElementNumber - (comparisonWadoElementNumber % comparisonSeriesMultiply);
          const Max: number = Min + comparisonSeriesMultiply;
          dispatch(
            setComaprisonSeriesValueChange({
              comparisonSeriesMin: Min,
              comparisonSeriesMax: Max,
            }),
          );
        } else if (comparisonSeriesMin < comparisonSeriesMultiply && comparisonSeriesMax > comparisonSeriesMultiply) {
          dispatch(
            setComaprisonSeriesValueChange({
              comparisonSeriesMin: 0,
              comparisonSeriesMax: comparisonSeriesMultiply,
            }),
          );
        }
      }
    }
  }, [firstStudySeriesLayout, comparisonSeries]);
};

export default DoubleClickController;
