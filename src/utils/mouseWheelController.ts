import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import cornerstone from 'cornerstone-core';
import { wheelControll } from '@typings/etcType';
import { setOneSeriesStartNumberChange } from '@store/series';
import { setImageLayoutViewNumberChange } from '@store/imagelayout';
import { setComparisonOneSeriesStartNumberChange, setComparisonImageLayoutViewNumberChange } from '@store/comparison';
import { debounce } from 'lodash';
const mouseWheelController = ({
  wadouri,
  comparisonWadoURI,
  imageLayoutBool,
  comparisonImageLayoutBool,
  imageLayoutState,
  comparisonImageLayoutState,
}: wheelControll) => {
  const dispatch = useDispatch();
  const { imageLayout} = useSelector(
    (state: RootState) => state.imagelayout.imagelayout,
  );
  const {
    comparisonCheckBool,
    comparisonSeries,
    comparisonImageLayout,
    ComparisonseriesDoubleClickBool,
    comparisonImageLayoutDoubleClickBool,
    comparisonImageLayoutViewNumber,
    comparisonOneSeriesStartNumber,
    comparisonImageLayoutElementNumber,
  } = useSelector((state: RootState) => state.comparison.comparison);
  const { selectedStudyType } = useSelector((state: RootState) => state.viewerStatus)

  const { series, oneSeries, comparisonOneSeries } = useSelector(
    (state: RootState) => state.serieslayout.seriesLayout,
  );
  ////
  const { seriesLayout: firstStudySeriesLayout,
    seriesDoubleClickBool,
    oneSeriesStartNumber: firstStudyOneSeriesStartNumber,
    isOneSeries: firstStudyIsOneSeries
   } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { imageLayout: firstImageLayout, imageLayoutDoubleClickBool: firstImageLayoutDoubleClickBool, imageLayoutElementNumber,imageLayoutViewStartNumber } = useSelector((state: RootState) => state.studyStatus[0].imageLayout)

////

  //원시리즈 && 이미지레이아웃 스크롤 이벤트
  useEffect(() => {
    let selectedSeries = seriesDoubleClickBool ? 1 : firstStudySeriesLayout[0] * firstStudySeriesLayout[1];
    let selectedcomparisonSeries = ComparisonseriesDoubleClickBool ? 1 : comparisonSeries[0] * comparisonSeries[1];
    const scrollEvent = debounce((event: any)=> {
      if (firstStudyIsOneSeries && !imageLayoutBool && !comparisonCheckBool) {
        if (event.wheelDelta < 0) {
          if (firstStudyOneSeriesStartNumber + selectedSeries < wadouri.oneSeries.length) {
            const number = firstStudyOneSeriesStartNumber + selectedSeries;
            dispatch({ type: 'setOneSeriesStartNumber/0', payload: number })
            // cornerstone.imageCache.purgeCache();
          } else {
            return;
          }
        } else if (event.wheelDelta > 0) {
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
        } else {
          return;
        }
      } else if (!firstStudyIsOneSeries && imageLayoutBool && !comparisonCheckBool) {
        const layout: number = firstImageLayoutDoubleClickBool ? 1 : firstImageLayout[0] * firstImageLayout[1];
        if (event.wheelDelta < 0) {
          if (
            firstImageLayoutDoubleClickBool
              ? imageLayoutState.imageurl.length > imageLayoutViewStartNumber + imageLayoutElementNumber + layout
              : imageLayoutState.imageurl.length > imageLayoutViewStartNumber + layout
          ) {
            dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: imageLayoutViewStartNumber + layout })

          } else {
            return;
          }
        } else if (event.wheelDelta > 0) {
          if (imageLayoutViewStartNumber !== 0 && imageLayoutViewStartNumber - layout >= 0) {
            dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: imageLayoutViewStartNumber - layout })

          } else if (imageLayoutViewStartNumber - layout < 0) {
            dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: 0})
            return;
          } else {
            return;
          }
        } else {
          return;
        }
      } else if (comparisonCheckBool && (imageLayoutBool || comparisonImageLayoutBool) && !firstStudyIsOneSeries) {
        if (selectedStudyType === 'default' && imageLayoutBool) {
          const layout: number = firstImageLayoutDoubleClickBool ? 1 : firstImageLayout[0] * firstImageLayout[1];
          if (event.wheelDelta < 0) {
            if (
              firstImageLayoutDoubleClickBool
                ? imageLayoutState.imageurl.length > imageLayoutViewStartNumber + imageLayoutElementNumber + layout
                : imageLayoutState.imageurl.length > imageLayoutViewStartNumber + layout
            ) {
              dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: imageLayoutViewStartNumber + layout })

            } else {
              return;
            }
          } else if (event.wheelDelta > 0) {
            if (imageLayoutViewStartNumber !== 0 && imageLayoutViewStartNumber - layout >= 0) {
              dispatch({ type: 'setImageLayoutViewStartNumber/0', payload: imageLayoutViewStartNumber -layout })

            } else if (imageLayoutViewStartNumber - layout < 0) {
              dispatch({ type: 'setImageLayoutViewStartNumber/0', payload:0})
              return;
            } else {
              return;
            }
          } else {
            return;
          }
        } else if (selectedStudyType === 'comparison' && comparisonImageLayoutBool) {
          const layout: number = comparisonImageLayoutDoubleClickBool
            ? 1
            : comparisonImageLayout[0] * comparisonImageLayout[1];
          if (event.wheelDelta < 0) {
            if (
              comparisonImageLayoutDoubleClickBool
                ? comparisonImageLayoutState.imageurl.length >
                  comparisonImageLayoutViewNumber + comparisonImageLayoutElementNumber + layout
                : comparisonImageLayoutState.imageurl.length > comparisonImageLayoutViewNumber + layout
            ) {
              dispatch(setComparisonImageLayoutViewNumberChange(comparisonImageLayoutViewNumber + layout));
            } else {
              return;
            }
          } else if (event.wheelDelta > 0) {
            if (comparisonImageLayoutViewNumber !== 0 && comparisonImageLayoutViewNumber - layout >= 0) {
              dispatch(setComparisonImageLayoutViewNumberChange(comparisonImageLayoutViewNumber - layout));
            } else if (comparisonImageLayoutViewNumber - layout < 0) {
              dispatch(setComparisonImageLayoutViewNumberChange(0));
              return;
            } else {
              return;
            }
          } else {
            return;
          }
        }
      } else if (comparisonCheckBool && (firstStudyIsOneSeries || comparisonOneSeries) && !imageLayoutBool) {
        if (selectedStudyType === 'default' && firstStudyIsOneSeries) {
          if (event.wheelDelta < 0) {
            if (firstStudyOneSeriesStartNumber + selectedSeries < wadouri.oneSeries.length) {
              const number = firstStudyOneSeriesStartNumber + selectedSeries;
              dispatch({ type: 'setOneSeriesStartNumber/0', payload: number })
              // cornerstone.imageCache.purgeCache();
            } else {
              return;
            }
          } else if (event.wheelDelta > 0) {
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
          } else {
            return;
          }
        } else if (selectedStudyType === 'comparison' && comparisonOneSeries) {
          if (event.wheelDelta < 0) {
            if (comparisonOneSeriesStartNumber + selectedcomparisonSeries < comparisonWadoURI.oneSeries.length) {
              const number = comparisonOneSeriesStartNumber + selectedcomparisonSeries;
              dispatch(setComparisonOneSeriesStartNumberChange(number));
              // cornerstone.imageCache.purgeCache();
            } else {
              return;
            }
          } else if (event.wheelDelta > 0) {
            if (
              comparisonOneSeriesStartNumber !== 0 &&
              !(comparisonOneSeriesStartNumber - selectedcomparisonSeries < 0)
            ) {
              const number = comparisonOneSeriesStartNumber - selectedcomparisonSeries;
              dispatch(setComparisonOneSeriesStartNumberChange(number));
              // cornerstone.imageCache.purgeCache();
            } else if (comparisonOneSeriesStartNumber - selectedcomparisonSeries < 0) {
              dispatch(setComparisonOneSeriesStartNumberChange(0));
              // cornerstone.imageCache.purgeCache();
            } else {
              return;
            }
          } else {
            return;
          }
        }
      } else {
        return;
      }
    },0)
    if (firstStudyIsOneSeries || imageLayoutBool || comparisonOneSeries || comparisonImageLayoutBool) {
      window.addEventListener('wheel', scrollEvent);
      return () => {
        window.removeEventListener('wheel', scrollEvent);
      };
    }
  }, [
    firstStudySeriesLayout,
    firstStudyIsOneSeries,
    seriesDoubleClickBool,
    imageLayoutBool,
    firstStudyOneSeriesStartNumber,
    comparisonOneSeriesStartNumber,
    wadouri,
    firstImageLayout,
    imageLayoutViewStartNumber,
    firstImageLayoutDoubleClickBool,
    comparisonImageLayoutDoubleClickBool,
    ComparisonseriesDoubleClickBool,
    comparisonCheckBool,
    selectedStudyType,
    comparisonImageLayout,
    comparisonImageLayoutBool,
    comparisonOneSeries,
    imageLayoutState,
    comparisonImageLayoutState,
  ]);
};

export default mouseWheelController;