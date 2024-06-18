import React, { memo, useState, useEffect, useCallback, MouseEvent } from 'react';
import { ViewerMenuCss } from './styles';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@store/index';
import { worklistActions } from '@store/worklist';
import { setDefaultSeriesStorageChange, setThumbnailClickChange, setSeriesChange, setSeriesElementChange, setSeriesValueChange } from '@store/series';
import { RootState } from '@store/index';
import Thumbnail from '@mobileComponents/Viewer/Thumbnail';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead/TableHead';
import cornerstone from 'cornerstone-core';
import moment from 'moment';
import { imageurl } from '@typings/etcType';
import { useTranslation } from 'react-i18next';
import { setImageLayoutChange, setImageLayoutDoubleClickBoolChange } from '@store/imagelayout';
import { useNavigate } from 'react-router';

const ViewerMenu = memo((props: imageurl) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { thumbnailClick, series } = useSelector(
    (state: RootState) => state.serieslayout.seriesLayout,
  );
  ///
  const { seriesDoubleClickBool, selectedElementNumber, seriesMin, seriesMax, seriesStorage } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)
  const { seriesElementNumber: firstStudyseriesElementNumber } = useSelector((state: RootState) => state.studyStatus[0].seriesLayout)

  ///
  const { imageLayout } = useSelector((state: RootState) => state.imagelayout.imagelayout)
  const patientPastStudyList = useSelector((state: any) => state.patientPastStudyList.patientPastStudyList);
  const { thumbnailBoxBool } = useSelector((state: RootState) => state.setting.setting);
  const { study_key, patient_id } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const [thumbnailBorderBox, setThumbnailBorderBox] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState(props.imageurl);
  const [TouchMoveBool, setTouchMoveBool] = useState(false);
  const selectRef = React.useRef() as React.MutableRefObject<HTMLSelectElement>;

  const ThumbnailDoubleClickButton = useCallback(
    async (event: any) => {
      if (!TouchMoveBool) {
        
        const parent = parseInt(event.target.closest('.thumbnailParent').dataset.value);
        dispatch({ type: 'setSeriesDoubleClickBool/0', payload: { seriesDoubleClickBool: true, selectedElementNumber: parent } })
        dispatch({ type:'setSeriesElementNumber/0',payload:parent})
        
        setTimeout(() => {
          for (const img of props.imageurl[parent]) {
            cornerstone.loadAndCacheImage(img);
          }
        }, 500);
      }

    },
    [TouchMoveBool],
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

  const handleTouchMove = useCallback((event: any) => {
    setTouchMoveBool(true);
    setTimeout(() => {
      setTouchMoveBool(false);
    }, 800);
  }, [TouchMoveBool])

  return (
    <ViewerMenuCss>
      <TableContainer
        sx={{
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <Table
          className="thumbnailTable"
          sx={patientPastStudyList.length > 2 ? {
            backgroundColor: '#242424',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            height: "calc(100% - 75px)"
          } : {
            backgroundColor: '#242424',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            height: "100%"
          }}
          stickyHeader
        >
          <TableBody>
            <TableRow>
              <TableCell sx={{ borderBottom: 'none' }}>
                <Box className="thumbnailBox">
                  {thumbnail &&
                    patientPastStudyList &&
                    thumbnail.map((v: any, i: number) => {
                      return (
                        <Box
                          className={i === firstStudyseriesElementNumber ? 'thumbnailParent active-thumbnail' : 'thumbnailParent'}
                          key={i}
                          data-value={i}
                          // onDoubleClick={ThumbnailDoubleClickButton}
                          // onTouchMove={handleTouchMove}
                          onClick={ThumbnailDoubleClickButton}
                        >
                          <Thumbnail
                            imageURLIndex={v}
                            ThunmnailNumber={i + 1}

                          />
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
