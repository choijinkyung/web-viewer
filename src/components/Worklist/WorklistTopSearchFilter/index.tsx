import { Box, FormControl, Grid, TextField, MenuItem, Select, InputLabel } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { worklistActions } from '@store/worklist';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@store/index';
import { MainFilter } from './styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Call } from '@utils/JwtHelper';
import moment from 'moment';
import { debounce } from 'lodash';
import {
  patientIDAction,
  patientNameAction,
  readingStatusAction,
  startDateAction,
  endDateAction,
  pagingNumAction,
  resetTriggerChange,
} from '@store/filter';
import { t } from 'i18next';
import { useMediaQuery } from 'react-responsive';

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

const accessToken = localStorage.getItem('accessToken');

const WorklistTopSearchFilter = () => {
  const call = new Call();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
  };
  const [firstRandering, setFirstRandering] = useState(false);
  const [patientID, setPatientID] = useState('');
  const [patientName, setPatientName] = useState('');
  const [readingStatus, setReadingstatus] = useState('0');

  const dispatch = useDispatch<AppDispatch>();
  const { patient_id, patient_name, reading_status, modality, verify_flag, startDate, endDate, resetTrigger, limit } =
    useSelector((state: any) => state.filter.filter);

    const isBigScreen = useMediaQuery({ minWidth: 1921, maxWidth: 7680  })
    const isSmallScreen = useMediaQuery({ minWidth: 0, maxWidth: 1280 })
    const isFHD = useMediaQuery({ minWidth: 1281, maxWidth: 1920  })
    const isHD = useMediaQuery({ minWidth: 961, maxWidth: 1280  })
    const isQHD = useMediaQuery({ minWidth: 641, maxWidth: 960  })
    const isNHD = useMediaQuery({ minWidth: 0, maxWidth: 640  })

  /**
   * 세부검색의 rset버튼 클릭 시 검색 input에 작성되어 있는 string을 비워주기 위한 이펙트
   */
  useEffect(() => {
    if (firstRandering) {
      setPatientID('');
      setPatientName('');
      setReadingstatus('0');
      inputDebounce();
    } else {
      setFirstRandering(true);
    }
  }, [resetTrigger]);

  /**
   * 전체 버튼 클릭 함수(검색버튼)
   */
  const clickAllButton = useCallback(
    (event: any) => {
      event.preventDefault();

      const payload = {
        params: {
          patient_id,
          patient_name,
          reading_status,
          modality,
          verify_flag,
          start_date: '1990-01-01',
          // start_date: moment().subtract(3, 'months').format('YYYY-MM-DD'),
          end_date: moment().format('YYYY-MM-DD'),
          pagingNum: 0,
          limit,
        },
        headers,
      };
      sessionStorage.setItem('search', JSON.stringify(payload.params));
      dispatch(pagingNumAction(0));
      dispatch(worklistActions.fetchWorklist(payload));
      dispatch(startDateAction(moment().subtract(3, 'months').format('YYYY-MM-DD')));
    },
    [patient_id, patient_name, reading_status, headers, modality, verify_flag, limit],
  );
  /**
   * 1일 버튼 클릭 함수(검색버튼)
   */
  const click1DButton = useCallback(
    (event: any) => {
      event.preventDefault();

      const payload = {
        params: {
          patient_id,
          patient_name,
          reading_status,
          modality,
          verify_flag,
          start_date: moment().subtract(1, 'd').format('YYYY-MM-DD'),
          end_date: moment().format('YYYY-MM-DD'),
          pagingNum: 0,
          limit,
        },
        headers,
      };
      sessionStorage.setItem('search', JSON.stringify(payload.params));
      dispatch(pagingNumAction(0));
      dispatch(worklistActions.fetchWorklist(payload));
      dispatch(startDateAction(moment().subtract(1, 'd').format('YYYY-MM-DD')));
    },
    [patient_id, patient_name, reading_status, headers, modality, verify_flag, limit],
  );
  /**
   * 3일 버튼 클릭 함수(검색버튼)
   */
  const click3DButton = useCallback(
    (event: any) => {
      event.preventDefault();

      const payload = {
        params: {
          patient_id,
          patient_name,
          reading_status,
          modality,
          verify_flag,
          start_date: moment().subtract(3, 'd').format('YYYY-MM-DD'),
          end_date: moment().format('YYYY-MM-DD'),
          pagingNum: 0,
          limit,
        },
        headers,
      };
      sessionStorage.setItem('search', JSON.stringify(payload.params));
      dispatch(pagingNumAction(0));
      dispatch(worklistActions.fetchWorklist(payload));
      dispatch(startDateAction(moment().subtract(3, 'd').format('YYYY-MM-DD')));
    },
    [patient_id, patient_name, reading_status, headers, modality, verify_flag, limit],
  );
  /**
   * 1주 버튼 클림 함수(검색버튼)
   */
  const click1WButton = useCallback(
    (event: any) => {
      event.preventDefault();

      const payload = {
        params: {
          patient_id,
          patient_name,
          reading_status,
          modality,
          verify_flag,
          start_date: moment().subtract(7, 'd').format('YYYY-MM-DD'),
          end_date: moment().format('YYYY-MM-DD'),
          pagingNum: 0,
          limit,
        },
        headers,
      };
      sessionStorage.setItem('search', JSON.stringify(payload.params));
      dispatch(pagingNumAction(0));
      dispatch(worklistActions.fetchWorklist(payload));
      dispatch(startDateAction(moment().subtract(7, 'd').format('YYYY-MM-DD')));
    },
    [patient_id, patient_name, reading_status, headers, modality, verify_flag, limit],
  );

  /**
   * 재설정 버튼 클릭 함수
   */
  const resetButton = useCallback(() => {
    dispatch(startDateAction('19900101'));
    dispatch(endDateAction(moment().format('YYYYMMDD')));
    inputDebounce();
    dispatch(resetTriggerChange(!resetTrigger));
  }, [resetTrigger]);

  /**
   * 검색 버튼 클릭 함수
   */
  const fetchWorklist = useCallback(
    async (event: any) => {
      event.preventDefault();

      const payload = {
        params: {
          patient_id,
          patient_name,
          reading_status,
          start_date: startDate,
          end_date: endDate,
          modality,
          verify_flag,
          pagingNum: 0,
          limit,
        },
        headers,
      };
      sessionStorage.setItem('search', JSON.stringify(payload.params));
      dispatch(pagingNumAction(0));
      dispatch(worklistActions.fetchWorklist(payload));
    },
    [patient_id, patient_name, reading_status, headers, modality, verify_flag, limit],
  );

  /**
   * 상단에 있는 검색 창과 상세검색을 이어주기 위해 리덕스를 통해 전체 상태값을 변경해주는 함수
   */
  const inputDebounce = debounce(() => {
    dispatch(patientIDAction(patientID));
    dispatch(patientNameAction(patientName));
    if (readingStatus === '0') {
      dispatch(readingStatusAction(''));
    } else {
      dispatch(readingStatusAction(readingStatus));
    }
  }, 10);

  useEffect(() => {
    if (firstRandering) {
      inputDebounce();
    }
  }, [patientID, patientName, readingStatus]);

  const EnterKeyEvent = useCallback(
    (event: any) => {
      if (event.keyCode === 13) {
        const payload = {
          params: {
            patient_id,
            patient_name,
            reading_status,
            start_date: startDate,
            end_date: endDate,
            modality,
            verify_flag,
            pagingNum: 0,
            limit,
          },
          headers,
        };
        sessionStorage.setItem('search', JSON.stringify(payload.params));
        dispatch(pagingNumAction(0));
        dispatch(worklistActions.fetchWorklist(payload));
      }
    },
    [patient_id, patient_name, reading_status, headers, modality, verify_flag, limit],
  );

  const NameChange = useCallback(
    (event: any) => {
      event.preventDefault();
      setPatientName(event.target.value);
    },
    [patientName],
  );

  return (
    <ThemeProvider theme={theme}>
      <MainFilter>
        <Box sx={{ width: '100%' }}>
          <h3 className="searchheader">{t('TID02333')}</h3>
        </Box>
        <FormControl>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Grid className={!isSmallScreen ?"textfield before" : 'textfield'}>
              <TextField
                id="patient_id"
                label={t('TID02821')}
                variant="outlined"
                size="small"
                defaultValue={patient_id === '' ? patientID : patient_id}
                autoComplete="off"
                sx={{
                  '.css-1pysi21-MuiFormLabel-root-MuiInputLabel-root': {
                    color: '#9b9b9b',
                  },
                  '.MuiInputLabel-shrink': {
                    borderRadius: '0px',
                  },
                  '.Mui-focused': {
                    borderRadius: '50px',
                  },
                  '.MuiInputLabel-outlined': {
                    // border: '1px solid #32fbcd',
                    color: 'white',
                  },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                      color: 'white',
                    },
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: 'white',
                  },
                  bgcolor: '#373737',
                  input: {
                    '&:focus': {
                      backgroundColor: '#000',
                      color: '#9b9b9b',
                    },
                    color: '#9b9b9b',
                    borderRadius: '50px',
                  },
                  width: {
                    fourk: '280px',
                    fullhd: '140px',
                    desktop: '160px',
                  },
                  height: '36px',
                  ml: {
                    fourk: '10px',
                    fullhd: '5px',
                    desktop: '5px'
                  },
                  borderRadius: '50px',
                  mt: {
                    fourk: '24px',
                    fullhd: '15px',
                    desktop: '5px',
                  },
                }}
                onInput={(e: any) => setPatientID(e.target.value)}
                onKeyDown={EnterKeyEvent}
              />
            </Grid>
            <Grid className={!isSmallScreen ?"textfield before" : 'textfield'}>
              <TextField
                label={t('TID02738')}
                id="patient_name"
                variant="outlined"
                size="small"
                defaultValue={patient_name === '' ? patientName : patient_name}
                autoComplete="off"
                sx={{
                  '.css-1pysi21-MuiFormLabel-root-MuiInputLabel-root': {
                    color: '#9b9b9b',
                  },
                  '.MuiInputLabel-shrink': {
                    borderRadius: '0px',
                  },
                  '.Mui-focused': {
                    borderRadius: '50px',
                  },
                  '.MuiInputLabel-outlined': {
                    // border: '1px solid #32fbcd',
                    color: 'white',
                  },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                      color: 'white',
                    },
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: 'white',
                  },
                  bgcolor: '#373737',
                  input: {
                    '&:focus': {
                      backgroundColor: '#000',
                      color: '#9b9b9b',
                    },
                    color: '#9b9b9b',
                    borderRadius: '50px',
                  },
                  width: {
                    fourk: '280px',
                    fullhd: '140px',
                    desktop: '160px',
                  },
                  height: '36px',
                  ml: {
                    fourk: '10px',
                    fullhd: '5px',
                    desktop: '5px'
                  },
                  borderRadius: '50px',
                  mt: {
                    fourk: '24px',
                    fullhd: '15px',
                    desktop: '5px',
                  },
                }}
                onInput={(e: any) => setPatientName(e.target.value)}
                onKeyDown={EnterKeyEvent}
              />
            </Grid>
            {/* <Grid className="textfield">
              <TextField
                id="reading_status"
                label={t('TID00033')}
                variant="outlined"
                size="small"
                value={readingStatus}
                autoComplete='off'
                sx={{
                  bgcolor: '#373737',
                  input: {
                    '&:focus': {
                      backgroundColor: '#000',
                      color: '#fff',
                    },
                    border: 'none !important',
                    color: '#9b9b9b',
                    borderRadius: '50px',
                  },
                  width: {
                    fourk: '280px',
                    fullhd: '280px',
                    desktop: '160px',
                  },
                  height: '36px',
                  ml: '10px',
                  borderRadius: '50px',
                  mt: {
                    fourk: '24px',
                    fullhd: '15px',
                    desktop: '5px',
                  },
                }}
                onInput={(e: any) => setReadingstatus(e.target.value)}
                onKeyDown={EnterKeyEvent}
              />
            </Grid> */}
            <Grid className={!isSmallScreen ?"selectfield before" : 'selectfield'}>
              {/* <InputLabel
                id='demo-simple-select-helper-label'
                size='small'
              >
                판독상태
              </InputLabel> 
              <Select
                className="select"
                labelId='demo-simple-select-helper-label'
                id="modality"
                variant="outlined"
                size="small"
                sx={{
                  '.MuiInputLabel-shrink' :{
                    borderRadius: '0px',
                    backgrounColor: '#fff',            
                  },
                  bgcolor: '#373737',
                  color: '#9b9b9b',
                  '&:focus': {
                    backgroundColor: '#000',
                    color: '#fff',
                  },
                  borderRadius: '50px',
                  width: {
                    fourk: '280px',
                    fullhd: '280px',
                    desktop: '160px',
                  },
                  height: '36px',
                  ml: '10px',
                  mt: {
                    fourk: '24px',
                    fullhd: '15px',
                    desktop: '5px',
                  },
                }}
                onChange={(e:any)=>setReadingstatus(e.target.value)}
                value={readingStatus}
                label="판독상태"
              >
                <MenuItem value="0">전체선택</MenuItem>
                <MenuItem value="3">읽지않음</MenuItem>
                <MenuItem value="9">열람중</MenuItem>
                <MenuItem value="5">예비판독</MenuItem>
                <MenuItem value="6">판독</MenuItem>
              </Select> */}
              <TextField
                select
                className="select"
                // labelId='demo-simple-select-helper-label'
                id="modality"
                variant="outlined"
                size="small"
                sx={{
                  '.css-1pysi21-MuiFormLabel-root-MuiInputLabel-root': {
                    color: '#9b9b9b',
                  },
                  '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root': {
                    display: 'none',
                  },
                  '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
                    display: 'block',
                  },
                  '.MuiInputLabel-shrink': {
                    borderRadius: '0px',
                  },
                  '.Mui-focused': {
                    borderRadius: '50px',
                  },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                      color: 'white',
                    },
                  },
                  bgcolor: '#373737',
                  input: {
                    '&:focus': {
                      backgroundColor: '#000',
                      color: '#9b9b9b',
                    },
                    color: '#9b9b9b',
                    borderRadius: '50px',
                  },
                  width: {
                    fourk: '280px',
                    fullhd: '140px',
                    desktop: '160px',
                  },
                  height: '36px',
                  ml: '10px',
                  borderRadius: '50px',
                  mt: {
                    fourk: '24px',
                    fullhd: '15px',
                    desktop: '5px',
                  },
                }}
                onChange={(e: any) => setReadingstatus(e.target.value)}
                value={readingStatus}
              >
                <MenuItem value="" disabled>
                  <em>{t('TID00033')}</em>
                </MenuItem>
                <MenuItem value="0">{t('TID03024')}</MenuItem>
                <MenuItem value="3">{t('TID00013')}</MenuItem>
                <MenuItem value="9">{t('TID00017')}</MenuItem>
                <MenuItem value="5">{t('TID00015')}</MenuItem>
                <MenuItem value="6">{t('TID00016')}</MenuItem>
              </TextField>
            </Grid>
            {!isSmallScreen && (
              <>
              <Box
              sx={{
                whiteSpace: 'nowrap',
                background: '#373737',
                '&:hover': { background: '#24282b' },
                color: 'white',
                borderRadius: '50%',
                width: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                height: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                mt: {
                  fourk: '22px',
                  fullhd: '11px',
                  desktop: '6px',
                },
                ml: '30px',
                textAlign: 'center',
                lineHeight: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                fontWeight: '600',
                fontSize: {
                  fourk: '14px',
                  fullhd: '14px',
                  desktop: '12px',
                },
                cursor: 'pointer',
              }}
              title={t('TID03018')}
              onClick={clickAllButton}
            >
              {t('TID03018')}
            </Box>
            <Box
              sx={{
                whiteSpace: 'nowrap',
                background: '#373737',
                '&:hover': { background: '#24282b' },
                color: 'white',
                borderRadius: '50%',
                width: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                height: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                mt: {
                  fourk: '22px',
                  fullhd: '11px',
                  desktop: '6px',
                },
                ml: '10px',
                textAlign: 'center',
                lineHeight: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                fontWeight: '600',
                fontSize: {
                  fourk: '14px',
                  fullhd: '14px',
                  desktop: '12px',
                },
                cursor: 'pointer',
              }}
              title={t('TID03019')}
              onClick={click1DButton}
            >
              {t('TID03019')}
            </Box>
            <Box
              sx={{
                whiteSpace: 'nowrap',
                background: '#373737',
                '&:hover': { background: '#24282b' },
                color: 'white',
                borderRadius: '50%',
                width: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                height: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                mt: {
                  fourk: '22px',
                  fullhd: '11px',
                  desktop: '6px',
                },
                ml: '10px',
                textAlign: 'center',
                lineHeight: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                fontWeight: '600',
                fontSize: {
                  fourk: '14px',
                  fullhd: '14px',
                  desktop: '12px',
                },
                cursor: 'pointer',
              }}
              title={t('TID03020')}
              onClick={click3DButton}
            >
              {t('TID03020')}
            </Box>
            <Box
              sx={{
                whiteSpace: 'nowrap',
                background: '#373737',
                '&:hover': { background: '#24282b' },
                color: 'white',
                borderRadius: '50%',
                width: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                height: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                mt: {
                  fourk: '22px',
                  fullhd: '11px',
                  desktop: '6px',
                },
                ml: '10px',
                textAlign: 'center',
                lineHeight: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                fontWeight: '600',
                fontSize: {
                  fourk: '14px',
                  fullhd: '14px',
                  desktop: '12px',
                },
                cursor: 'pointer',
              }}
              title={t('TID03021')}
              onClick={click1WButton}
            >
              {t('TID03021')}
            </Box>
            <Box
              sx={{
                whiteSpace: 'nowrap',
                background: '#373737',
                '&:hover': { background: '#24282b' },
                color: 'white',
                borderRadius: '50%',
                width: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                height: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                mt: {
                  fourk: '22px',
                  fullhd: '11px',
                  desktop: '6px',
                },
                ml: '10px',
                textAlign: 'center',
                lineHeight: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                fontWeight: '600',
                fontSize: {
                  fourk: '14px',
                  fullhd: '14px',
                  desktop: '12px',
                },
                cursor: 'pointer',
              }}
              title={t('TID02999')}
              onClick={resetButton}
            >
              {t('TID02999')}
            </Box>
              </>
            )}
            <Box
              sx={{
                whiteSpace: 'nowrap',
                background: '#621212',
                '&:hover': { background: '#a00000' },
                color: 'white',
                borderRadius: '50%',
                width: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                height: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                mt: {
                  fourk: '22px',
                  fullhd: '11px',
                  desktop: '6px',
                },
                ml: '10px',
                fontSize: {
                  fourk: '14px',
                  fullhd: '14px',
                  desktop: '12px',
                },
                fontWeight: '600',
                textAlign: 'center',
                lineHeight: {
                  fourk: '3rem',
                  fullhd: '3rem',
                  desktop: '2.5rem',
                },
                cursor: 'pointer',
              }}
              title={t('TID02333')}
              onClick={fetchWorklist}
            >
              {t('TID02333')}
            </Box>
          </Box>
        </FormControl>
      </MainFilter>
    </ThemeProvider>
  );
};

export default WorklistTopSearchFilter;
