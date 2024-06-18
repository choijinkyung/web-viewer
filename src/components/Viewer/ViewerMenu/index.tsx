import React, { memo, useState, useEffect, useCallback, MouseEvent } from 'react';
import { ViewerMenuCss } from './styles';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@store/index';
import { worklistActions } from '@store/worklist';
import {
  setDefaultSeriesStorageChange,
  setThumbnailClickChange,
  setSeriesChange,

  setSeriesElementChange,
  setSeriesValueChange,
} from '@store/series';
import { RootState } from '@store/index';
import Thumbnail from '@components/Viewer/Thumbnail';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead/TableHead';
import cornerstone from 'cornerstone-core';
import moment from 'moment';
import { imageurl } from '@typings/etcType';
import { useTranslation } from 'react-i18next';
import { setImageLayoutChange, setImageLayoutDoubleClickBoolChange } from '@store/imagelayout';
import { useNavigate } from 'react-router';
import { ComparisonSlice, setComparisonDoubleClickBoolChange, setComparisonImgaeLayoutChange, setComparisonSeriesChange, setComparisonThumbnailClickBool, setComparisonWadoElementNumberChange } from '@store/comparison';

const ViewerMenu = memo((props: imageurl) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    thumbnailClick,
    series,
  } = useSelector((state: RootState) => state.serieslayout.seriesLayout);
  ////
  const { seriesLayout: firstStudySeriesLayout, seriesDoubleClickBool, selectedElementNumber, seriesMin, seriesMax, seriesStorage, seriesThumbnailClick } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { seriesElementNumber: firstStudyseriesElementNumber } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { imageLayout: firstImageLayout, imageLayoutDoubleClickBool: firstImageLayoutDoubleClickBool } = useSelector((state: RootState) => state.studyStatus[0].imageLayout)
  const selectedStudyType = useSelector((state: RootState) => state.viewerStatus.selectedStudyType)

  const { seriesLayout: seriesLayoutState } = useSelector((state: RootState) => state.studyStatus[0])
  ////
  const { imageLayout } = useSelector((state: RootState) => state.imagelayout.imagelayout);
  const patientPastStudyList = useSelector((state: any) => state.patientPastStudyList.patientPastStudyList);
  const { thumbnailBoxBool } = useSelector((state: RootState) => state.setting.setting);
  const { study_key, patient_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const {comparisonThumbnailClickBool,comparisonImageLayout,comparisonImageLayoutDoubleClickBool,comparisonSeries,ComparisonseriesDoubleClickBool,comparisonWadoElementNumber} = useSelector((state: RootState) => state.comparison.comparison)
  const comparisonState = useSelector((state: RootState) => state.comparison.comparison)
  const [thumbnailBorderBox, setThumbnailBorderBox] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState(props.imageurl);
  const selectRef = React.useRef() as React.MutableRefObject<HTMLSelectElement>;

  /**
   * 썸네일 클릭 시 발동되는 함수 (해당이미지가 시리즈 1x1으로 변경되며 표출됨)
   */
  const ThumbnailDoubleClickButton = useCallback(
    (event: any) => {
      const parent = parseInt(event.target.closest('.thumbnailParent').dataset.value);
      const seriesValue = seriesStorage[0] * seriesStorage[0];
      
      if (selectedStudyType === 'default') {
        if (firstImageLayout[0] * firstImageLayout[1] !== 1) {
          dispatch({ type: 'setImageLayout/0', payload: [1, 1] })
          if (firstImageLayoutDoubleClickBool) {
            dispatch({ type: 'setImageLayoutDoubleClickBool/0', payload: false })
          }
        }
        if (firstStudyseriesElementNumber === parent && firstStudySeriesLayout[0] === 1 && firstStudySeriesLayout[1] === 1 && seriesDoubleClickBool) {
          dispatch({ type: 'setSeriesThumbnailClick/0', payload: !seriesThumbnailClick })
          return;
        } else {

          dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: true, selectedElementNumber: parent } })
          dispatch({ type: 'setSeriesLayout/0', payload: [1, 1] });
          dispatch({ type: 'setSeriesElementNumber/0', payload: parent })
          dispatch({ type: 'setSeriesThumbnailClick/0', payload: !seriesThumbnailClick })
        }
      }
      else if(selectedStudyType==='comparison') {
        if (comparisonImageLayout[0] * comparisonImageLayout[1] !== 1) {
          dispatch(setComparisonImgaeLayoutChange([1,1]))
          if (comparisonImageLayoutDoubleClickBool) {
            dispatch(setImageLayoutDoubleClickBoolChange(false))
          }
        }
        if (comparisonWadoElementNumber===parent&&comparisonSeries[0] === 1 && comparisonSeries[1] === 1 && ComparisonseriesDoubleClickBool) {
          dispatch(setComparisonThumbnailClickBool(!comparisonThumbnailClickBool))
          dispatch(setComparisonWadoElementNumberChange(parent))
          return;
        } else {
          dispatch(setComparisonDoubleClickBoolChange(true))
          dispatch(setComparisonSeriesChange([1, 1]));
          dispatch(setComparisonWadoElementNumberChange(parent))
          dispatch(setComparisonThumbnailClickBool(!comparisonThumbnailClickBool))

        }
      }

    },
    [
      seriesDoubleClickBool,
      firstStudyseriesElementNumber,
      selectedElementNumber,
      firstStudySeriesLayout,
      seriesMax,
      seriesMin,
      seriesStorage,
      firstImageLayout,
      firstImageLayoutDoubleClickBool,
      seriesLayoutState,
      selectedStudyType,
      comparisonThumbnailClickBool,
      comparisonSeries,
      ComparisonseriesDoubleClickBool,
      comparisonImageLayoutDoubleClickBool,
      comparisonImageLayout,
      comparisonState,
      
    ],
  );

  /**
   * 과거 검사 이력 select 박스 변경 시 함수
   */
  const ChangeSelect = useCallback(
    (event: any) => {
      const selectedIndex = event.target.selectedIndex;
      const selectedIndexValue = event.target.value;
      if (study_key === selectedIndexValue) {
        alert(t('TID03054'));
        return;
      } else {
        const row = patientPastStudyList[selectedIndex];
        navigate(`/pacs/viewer/${row.studyKey}/${row.studyInsUID}/${row.pID}`);
      }
    },
    [patientPastStudyList],
  );

  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    };
    const payload = {
      params: {
        patient_id: patient_id,
        study_key: study_key,
      },
      headers,
    };

    dispatch(worklistActions.fetchPatientPastStudyList(payload));
  }, [study_key]);

  useEffect(() => {
    if (seriesDoubleClickBool) {
      setThumbnailBorderBox(selectedElementNumber);
    }
  }, [seriesMin, seriesDoubleClickBool, selectedElementNumber]);

  useEffect(() => {
    setThumbnail(props.imageurl);
  }, [props.imageurl]);

  return (
    <ViewerMenuCss style={thumbnailBoxBool ? {} : { display: 'none' }}>
      {patientPastStudyList.length > 2 && (
        <>
          <Box className="menuTitle">{t('TID03146')}</Box>
          <select ref={selectRef} onChange={ChangeSelect}>
            {patientPastStudyList &&
              patientPastStudyList.map((row: any, i: number) => {
                if (Number(study_key) !== row.study_key) {
                  return (
                    <option key={i} value={row.study_key}>
                      {row.pName}/{row.modality}/{moment(row.studyDate).format('YYYY-MM-DD')}
                    </option>
                  );
                }
              })}
          </select>
        </>
      )}
      <TableContainer
        sx={{
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }}
        component={Paper}
      >
        <Table
          className="thumbnailTable"
          sx={
            patientPastStudyList.length > 2
              ? {
                backgroundColor: '#242424',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
                height: 'calc(100% - 75px)',
              }
              : {
                backgroundColor: '#242424',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
                height: '100%',
              }
          }
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell className="thumbnailTitle">
                <Box>{t('TID01668')}</Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ borderBottom: 'none' }}>
                <Box className="thumbnailBox">
                  {thumbnail &&
                    patientPastStudyList &&
                    thumbnail.map((v: any, i: number) => {
                      return (
                        <Box
                          className={i === thumbnailBorderBox ? 'thumbnailParent active-thumbnail' : 'thumbnailParent'}
                          key={i}
                          data-value={i}
                          // onDoubleClick={ThumbnailDoubleClickButton}
                          onClick={ThumbnailDoubleClickButton}
                        >
                          <Thumbnail imageURLIndex={v} ThunmnailNumber={i + 1} />
                        </Box>
                      );
                    })}
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ViewerMenuCss>
  );
});

export default ViewerMenu;
