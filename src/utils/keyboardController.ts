import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import { setSeriesElementChange, setSeriesValueChange } from '@store/series';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { keyboardControll } from '@typings/etcType';
import { setImageLayoutViewNumberChange } from '@store/imagelayout';
import { setComparisonWadoElementNumberChange,setComparisonOneSeriesStartNumberChange,setComparisonImageLayoutViewNumberChange,setComaprisonSeriesValueChange } from '@store/comparison';
import { debounce } from 'lodash';

const keyboardController = ({
  wadouri,
  imageLayoutBool,
  imageLayoutState,
  comparisonImageLayoutBool,
  comparisonWadoURI,
  comparisonImageLayoutState
}: keyboardControll) => {
  const dispatch = useDispatch();
  const { imageLayout} = useSelector(
    (state: RootState) => state.imagelayout.imagelayout,
  );
  const {
    comparisonCheckBool,
    comparisonSeries,
    ComparisonseriesDoubleClickBool,
    comparisonSeriesMin,
    comparisonSeriesMax,
    comparisonImageLayoutDoubleClickBool,
    comparisonImageLayout,
    comparisonImageLayoutViewNumber,
    comparisonWadoElementNumber,
    comparisonOneSeriesStartNumber,
    comparisonImageLayoutElementNumber,
  } = useSelector((state: RootState) => state.comparison.comparison);
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)

  const {
    series,    
    
    oneSeries,
    comparisonOneSeries,
  } = useSelector((state: RootState) => state.serieslayout.seriesLayout);
  ////
  const { seriesLayout: firstStudySeriesLayout,
    seriesDoubleClickBool,
    selectedElementNumber,
    seriesMin,
    seriesMax,
    oneSeriesStartNumber: firstStudyOneSeriesStartNumber,
    isOneSeries: firstStudyIsOneSeries
  } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { imageLayout: firstImageLayout, imageLayoutDoubleClickBool: firstImageLayoutDoubleClickBool, imageLayoutElementNumber, imageLayoutViewStartNumber } = useSelector((state: RootState) => state.studyStatus[0].imageLayout)
  const { seriesElementNumber }=useSelector((state:RootState)=>state.studyStatus[0].seriesLayout)

////

  useEffect(() => {
    let elementIndex = selectedElementNumber;
    let elementLength = selectedStudyType ==='default' ? wadouri.series.length - 1 : comparisonWadoURI.series.length -1;
    let selectedSeries = selectedStudyType ==='default' ? firstStudySeriesLayout[0] * firstStudySeriesLayout[1] :comparisonSeries[0] * comparisonSeries[1] ;
    let initialization = selectedStudyType ==='default' ? firstStudySeriesLayout[0] * firstStudySeriesLayout[1] :comparisonSeries[0] * comparisonSeries[1] ;

    const keyDownEvent = debounce((event: any) => {
      /**
       * page up : 33 => -1
       * page down : 34 => +1
      */
     if (selectedStudyType ==='default') {
          //더블클릭 상태일때 
          if (
            seriesDoubleClickBool  &&
            !firstStudyIsOneSeries &&
            !firstImageLayoutDoubleClickBool &&
            !imageLayoutBool
          ) {
            if (event.keyCode === 34) {
              if (elementIndex < elementLength) {
                dispatch({ type: 'setSeriesElementNumber/0', payload: ++elementIndex })
                dispatch({ type: 'setselectedElementNumber/0', payload: selectedElementNumber + 1})
               
              } else {
                return;
              }
            } else if (event.keyCode === 33) {
              if (elementIndex !== 0) {
                dispatch({ type: 'setSeriesElementNumber/0', payload: --elementIndex })

                dispatch({ type: 'setselectedElementNumber/0', payload: selectedElementNumber - 1 })
              } else {
                return;
              }
            }
          }
          //원시리즈 상태일때
          else if (firstStudyIsOneSeries && !seriesDoubleClickBool) {
            if (event.keyCode === 34) {
              if (firstStudyOneSeriesStartNumber + selectedSeries < wadouri.oneSeries.length) {
                const number = firstStudyOneSeriesStartNumber + selectedSeries;
                dispatch({ type: 'setOneSeriesStartNumber/0', payload: number })
                // cornerstone.imageCache.purgeCache();
              } else {
                return;
              }
            } else if (event.keyCode === 33) {
              if (firstStudyOneSeriesStartNumber !== 0 && !(firstStudyOneSeriesStartNumber - selectedSeries < 0)) {
                const number = firstStudyOneSeriesStartNumber - selectedSeries;
                dispatch({ type: 'setOneSeriesStartNumber/0', payload: number })

                // cornerstone.imageCache.purgeCache();
              } else if (firstStudyOneSeriesStartNumber - selectedSeries < 0) {
                dispatch({ type: 'setOneSeriesStartNumber/0', payload: 0 })
                // cornerstone.imageCache.purgeCache();
              } else {
                return;
              }
            }
          }
          //원시리즈 && 더블클릭 상태일때
          else if (firstStudyIsOneSeries  && seriesDoubleClickBool ) {
            if (event.keyCode === 34) {
              if (
                firstStudyOneSeriesStartNumber + selectedSeries < wadouri.oneSeries.length &&
                elementIndex + firstStudyOneSeriesStartNumber + 1 < wadouri.oneSeries.length
              ) {
                const number = firstStudyOneSeriesStartNumber + 1;
                dispatch({ type: 'setOneSeriesStartNumber/0', payload: number })
                // cornerstone.imageCache.purgeCache();
              } else {
                return;
              }
            } else if (event.keyCode === 33) {
              if (firstStudyOneSeriesStartNumber >= 0 && !(firstStudyOneSeriesStartNumber - selectedSeries < 0)) {
                const number = firstStudyOneSeriesStartNumber - 1;
                dispatch({ type: 'setOneSeriesStartNumber/0', payload: number })

                // cornerstone.imageCache.purgeCache();
              } else if (selectedElementNumber > 0 && 0 - selectedElementNumber < firstStudyOneSeriesStartNumber) {
                const number = firstStudyOneSeriesStartNumber - 1;
                dispatch({ type: 'setOneSeriesStartNumber/0', payload: number })

                // cornerstone.imageCache.purgeCache();
              } else {
                return;
              }
            }
          }
          //이미지레이아웃 && 이미지레이아웃 더블클릭 상태일때
          else if (firstImageLayoutDoubleClickBool  && seriesDoubleClickBool) {
            if (event.keyCode === 34) {
              if (imageLayoutState.imageurl.length > (imageLayoutViewStartNumber + imageLayoutElementNumber) + 1) {
                dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: (imageLayoutViewStartNumber) + 1 })

              }
            } else if (event.keyCode === 33) {
              if (imageLayoutViewStartNumber !== 0 && imageLayoutViewStartNumber - 1 >= 0) {
                dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: (imageLayoutViewStartNumber) - 1 })

              } else if (imageLayoutViewStartNumber - 1 < 0) {
                dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: 0 })
              } else {
                return;
              }
            }
          }
          //이미지 레이아웃 상태일때
          else if (imageLayoutBool  && !firstImageLayoutDoubleClickBool) {
            const layout: number = firstImageLayout[0] * firstImageLayout[1];
            if (event.keyCode === 34) {
              if (imageLayoutState.imageurl.length > imageLayoutViewStartNumber + layout) {
                dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: imageLayoutViewStartNumber + layout })
              }
            } else if (event.keyCode === 33) {
              if (imageLayoutViewStartNumber !== 0 && imageLayoutViewStartNumber - layout >= 0) {
                dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: imageLayoutViewStartNumber - layout })

              } else if (imageLayoutViewStartNumber - layout < 0) {
                dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: 0 })
              } else {
                return;
              }
            }
          }
          //아무것도 안한상태 시리즈 1x1 포함
          else if (!firstStudyIsOneSeries && !seriesDoubleClickBool) {
            if (event.keyCode === 34) {
              if (seriesMax + initialization > wadouri.series.length || seriesMax + initialization > 25) {
                if (wadouri.series.length === seriesMax) {
                  return;
                } else if (wadouri.series.length > seriesMax) {
                  dispatch({ type: 'setSelectedElementNumber/0', payload: seriesMax })
                  dispatch({ type: 'setSeriesViewRange/0', payload: { min: seriesMax, max: seriesMax + initialization } })
                 
                } else {
                  return;
                }
              } else {
                dispatch({ type: 'setSelectedElementNumber/0', payload: seriesMax })
                dispatch({ type: 'setSeriesViewRange/0', payload: { min: seriesMax, max: seriesMax + initialization } })
              
              }
            } else if (event.keyCode === 33) {
              if (seriesMin === 0 || selectedSeries - initialization < 0) {
                return;
              } else {
                dispatch({ type: 'setSelectedElementNumber/0', payload: seriesMin - initialization })
                dispatch({ type: 'setSeriesViewRange/0', payload: { min: seriesMin - initialization, max: seriesMin } })

               
              }
            } 
           
          }
        }else if (selectedStudyType ==='comparison') {
          if (
            ComparisonseriesDoubleClickBool&&
            !comparisonOneSeries &&
            !comparisonImageLayoutDoubleClickBool &&
            !comparisonImageLayoutBool
          ) {
            if (event.keyCode === 34) {
              if (elementIndex < elementLength) {
                dispatch(setComparisonWadoElementNumberChange(selectedElementNumber + 1));
                dispatch({ type: 'setSeriesElementNumber/0', payload: ++elementIndex })
              } else {
                return;
              }
            } else if (event.keyCode === 33) {
              if (elementIndex !== 0) {
                dispatch(setComparisonWadoElementNumberChange(selectedElementNumber - 1));
                dispatch({ type: 'setSeriesElementNumber/0', payload: --elementIndex })
              } else {
                return;
              }
            }
          }
          //원시리즈 상태일때
          else if ( comparisonOneSeries && !ComparisonseriesDoubleClickBool) {
            if (event.keyCode === 34) {
              if (comparisonOneSeriesStartNumber + selectedSeries < comparisonWadoURI.oneSeries.length) {
                const number = comparisonOneSeriesStartNumber + selectedSeries;
                dispatch(setComparisonOneSeriesStartNumberChange(number));
                // cornerstone.imageCache.purgeCache();
              } else {
                return;
              }
            } else if (event.keyCode === 33) {
              if (comparisonOneSeriesStartNumber !== 0 && !(comparisonOneSeriesStartNumber - selectedSeries < 0)) {
                const number = comparisonOneSeriesStartNumber - selectedSeries;
                dispatch(setComparisonOneSeriesStartNumberChange(number));
                // cornerstone.imageCache.purgeCache();
              } else if (comparisonOneSeriesStartNumber - selectedSeries < 0) {
                dispatch(setComparisonOneSeriesStartNumberChange(0));
                // cornerstone.imageCache.purgeCache();
              } else {
                return;
              }
            }
          }
          //원시리즈 && 더블클릭 상태일때
          else if ( comparisonOneSeries && ComparisonseriesDoubleClickBool) {
            if (event.keyCode === 34) {
              if (
                comparisonOneSeriesStartNumber + selectedSeries < comparisonWadoURI.oneSeries.length &&
                comparisonWadoElementNumber + comparisonOneSeriesStartNumber + 1 < comparisonWadoURI.oneSeries.length
              ) {
                const number = comparisonOneSeriesStartNumber + 1;
                dispatch(setComparisonOneSeriesStartNumberChange(number));
                // cornerstone.imageCache.purgeCache();
              } else {
                return;
              }
            } else if (event.keyCode === 33) {
              if (comparisonOneSeriesStartNumber > 0 && !((comparisonOneSeriesStartNumber - selectedSeries) < 0)) {
                const number = comparisonOneSeriesStartNumber - 1;
                dispatch(setComparisonOneSeriesStartNumberChange(number));
                // cornerstone.imageCache.purgeCache();
              } else if (comparisonWadoElementNumber+comparisonOneSeriesStartNumber > 0 && 0 - comparisonWadoElementNumber < comparisonOneSeriesStartNumber) {
                const number = comparisonOneSeriesStartNumber - 1;
                dispatch(setComparisonOneSeriesStartNumberChange(number));
                // cornerstone.imageCache.purgeCache();
              } else {
                return;
              }
            }
          }
          //이미지레이아웃 && 이미지레이아웃 더블클릭 상태일때
          else if ( comparisonImageLayoutDoubleClickBool && comparisonImageLayoutBool) {
            if (event.keyCode === 34) {
              if (comparisonImageLayoutState.imageurl.length > comparisonImageLayoutViewNumber+comparisonImageLayoutElementNumber + 1) {
                dispatch(setComparisonImageLayoutViewNumberChange(comparisonImageLayoutViewNumber + 1));
              }
            } else if (event.keyCode === 33) {
              if (comparisonImageLayoutViewNumber !== 0 && comparisonImageLayoutViewNumber - 1 >= 0) {
                dispatch(setComparisonImageLayoutViewNumberChange(comparisonImageLayoutViewNumber - 1));
              } else if (comparisonImageLayoutViewNumber - 1 < 0) {
                dispatch(setComparisonImageLayoutViewNumberChange(0));
              } else {
                return;
              }
            }
          }
          //이미지 레이아웃 상태일때
          else if (comparisonImageLayoutBool && !comparisonImageLayoutDoubleClickBool) {
            const layout: number = comparisonImageLayout[0] * comparisonImageLayout[1];
            if (event.keyCode === 34) {
              if (comparisonImageLayoutState.imageurl.length > comparisonImageLayoutViewNumber + layout) {
                dispatch(setComparisonImageLayoutViewNumberChange(comparisonImageLayoutViewNumber + layout));
              }
            } else if (event.keyCode === 33) {
              if (comparisonImageLayoutViewNumber !== 0 && comparisonImageLayoutViewNumber - layout >= 0) {
                dispatch(setComparisonImageLayoutViewNumberChange(comparisonImageLayoutViewNumber - layout));
              } else if (comparisonImageLayoutViewNumber - layout < 0) {
                dispatch(setComparisonImageLayoutViewNumberChange(0));
              } else {
                return;
              }
            }
          }
          //아무것도 안한상태 시리즈 1x1 포함
          else if (!comparisonOneSeries && !ComparisonseriesDoubleClickBool) {
            if (event.keyCode === 34) {
              if (comparisonSeriesMax + initialization > comparisonWadoURI.series.length || comparisonSeriesMax + initialization > 25) {
                if (comparisonWadoURI.series.length === comparisonSeriesMax) {
                  return;
                } else if (comparisonWadoURI.series.length > comparisonSeriesMax) {
                  dispatch(setComparisonWadoElementNumberChange(comparisonSeriesMax));
                  dispatch(
                    setComaprisonSeriesValueChange({
                      comparisonSeriesMin: comparisonSeriesMax,
                      comparisonSeriesMax: comparisonSeriesMax + initialization,
                    }),
                  );
                } else {
                  return;
                }
              } else {
                dispatch(setComparisonWadoElementNumberChange(comparisonSeriesMax));
                dispatch(
                    setComaprisonSeriesValueChange({
                    comparisonSeriesMin: comparisonSeriesMax,
                    comparisonSeriesMax: comparisonSeriesMax + initialization,
                  }),
                );
              }
            } else if (event.keyCode === 33) {
              if (comparisonSeriesMin === 0 || selectedSeries - initialization < 0) {
                return;
              } else {
                dispatch(setComparisonWadoElementNumberChange(comparisonSeriesMin - initialization));
                dispatch(
                    setComaprisonSeriesValueChange({
                    comparisonSeriesMin: comparisonSeriesMin - initialization,
                    comparisonSeriesMax: comparisonSeriesMin,
                  }),
                );
              }
            } 
          
          }

      }
    },0);
    window.addEventListener('keydown', keyDownEvent);
    return () => {
      window.removeEventListener('keydown', keyDownEvent);
    };
  }, [
    seriesDoubleClickBool,
    firstStudySeriesLayout,
    seriesMin,
    seriesMax,
    wadouri,
    firstStudyIsOneSeries,
    firstStudyOneSeriesStartNumber,
    selectedElementNumber,
    firstImageLayoutDoubleClickBool,
    imageLayoutState,
    imageLayoutViewStartNumber,
    firstImageLayout,
    seriesElementNumber,
    comparisonCheckBool,
    selectedStudyType,
    comparisonSeriesMin,
    comparisonSeriesMax,
    comparisonSeries,
    ComparisonseriesDoubleClickBool,
    comparisonImageLayoutBool,
    comparisonImageLayoutDoubleClickBool,
    comparisonOneSeries,
    comparisonOneSeriesStartNumber,
    comparisonWadoURI,
    comparisonWadoElementNumber,
    comparisonImageLayoutState,
    imageLayoutElementNumber,
    comparisonImageLayoutElementNumber
  ]);
};

export default keyboardController;
