import React, { useCallback, useEffect, useState } from 'react';
import { ComparisonCheckListModalCss } from './styles';
import {
  Box,
  Button,
  ButtonBase,
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import { setToolChange } from '@store/Tool';
import {
  setComparisonCheckBoolChange,
  setComparisonSeriesChange,
  setComparisonStudyKeyChange,
} from '@store/comparison';
import { setComparisonCheckModalBool } from '@store/modal';
import { useParams } from 'react-router';
import { AppDispatch } from '@store/index';
import moment from 'moment';
import { Call, jwtUtil } from '@utils/JwtHelper';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { limitAction } from '@store/filter';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const ComparisonCheckListModal = () => {
  const { t } = useTranslation();
  const call = new Call();
  const dispatch = useDispatch<AppDispatch>();
  const { study_key } = useParams();
  const { toolChangeCheckBool } = useSelector((state: RootState) => state.tool.toolbar);
  const { comparisonCheckBool, comparisonSeries } = useSelector((state: RootState) => state.comparison.comparison);
  const { comparisonCheckModalBool } = useSelector((state: RootState) => state.modal.modal);
  const patientPastStudyList = useSelector((state: any) => state.patientPastStudyList.patientPastStudyList);
  const [pastListArr, setPastListArr] = useState<any>([]);
  const [workListArr, setWorkListArr] = useState<any>([]);
  const [currentModality, setCurrentModality] = useState('');
  const [modality, setModality] = useState(' ');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [pagingNum, setPagingNum] = useState(0);
  const [limitState,setLimitState] = useState(10)
  const [workListArrLength,setWorkListArrLength] = useState(0)

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
  };

  const closeButton = useCallback(() => {
    // document.querySelector('.default')?.classList.add('active-tool');
    document.querySelector('.comparisonCheck')?.classList.remove('active-tool');
    // dispatch(
    //   setToolChange({
    //     tool: 'default',
    //     toolbool: !toolChangeCheckBool,
    //   }),
    // );
    dispatch(setComparisonCheckModalBool(!comparisonCheckModalBool));
  }, [comparisonCheckModalBool]);

  // const TestButton = useCallback(() => {
  //   dispatch(setComparisonCheckBoolChange(true));
  //   dispatch(setComparisonCheckModalBool(!comparisonCheckModalBool));
  // }, [comparisonCheckModalBool]);

  const CloseModalButton = useCallback(() => {
    dispatch(setComparisonCheckModalBool(false));
    // document.querySelector('.default')?.classList.add('active-tool');
    document.querySelector('.comparisonCheck')?.classList.remove('active-tool');
    // dispatch(
    //   setToolChange({
    //     tool: 'default',
    //     toolbool: !toolChangeCheckBool,
    //   }),
    // );
  }, [toolChangeCheckBool]);
  useEffect(() => {
    if (patientPastStudyList) {
      const pastList = patientPastStudyList.filter((v: any) => {
        if (Number(study_key) !== v.study_key) {
          return true;
        } else {
          setCurrentModality(v.modality);
          return false;
        }
      });
      setPastListArr(pastList);
    }
  }, [patientPastStudyList]);
  const modalityTypeSearch = useCallback(
    async (payload: any) => {
      await axios
        .get(
          `/api/v1/worklists?pID=${payload.params.patient_id}&pName=${payload.params.patient_name}&reportStatus=${payload.params.reading_status}&startDate=${payload.params.start_date}&endDate=${payload.params.end_date}&modality=${payload.params.modality}&verifyFlag=${payload.params.verify_flag}&pagingNum=${payload.params.pagingNum}&limit=${payload.params.limitState}&listLength=${payload.params.listLength}`,
          {
            headers: payload.headers,
          },
        )
        .then((res) => {
          const data = res.data.filter((v: any) => {
            if (Number(study_key) !== v.studyKey) {
              return true;
            } else {
              return false;
            }
          });
          if (payload.value) {
            const concatData = workListArr.concat(data);
            setWorkListArr(concatData);
          } else {
            setWorkListArr(data);
          }
        })
        .catch(async (error) => {
          const jwt = await jwtUtil(error);
          if (jwt.message === 'Retry success') {
            const data = jwt.response.data.filter((v: any) => {
              if (Number(study_key) !== v.studyKey) {
                return true;
              } else {
                return false;
              }
            });
            if (payload.value) {
              const concatData = workListArr.concat(data);
              setWorkListArr(concatData);
            } else {
              setWorkListArr(data);
            }
          }
        });
    },
    [workListArr, setWorkListArr,study_key],
  );
  useEffect(() => {
    if (currentModality !== '') {
      const payload = {
        params: {
          patient_id: '',
          patient_name: '',
          reading_status: '',
          modality: currentModality === " " ? '' :currentModality,
          verify_flag: '',
          start_date: '19900101',
          end_date: moment().format('YYYYMMDD'),
          limitState,
        },
        headers,
      };
      modalityTypeSearch(payload);
    }
  }, [currentModality]);

  const SearchClickButton = useCallback(() => {
    const payload = {
      params: {
        patient_id: patientId,
        patient_name: patientName,
        reading_status: '',
        modality: modality === " " ? '' : modality,
        verify_flag: '',
        start_date: '19900101',
        end_date: moment().format('YYYYMMDD'),
        pagingNum: 0,
        limitState
      },
      headers,
    };
    setPagingNum(0);
    modalityTypeSearch(payload);
  }, [headers, modality, patientId, modality,limitState]);

  const ListDoubleClickButton = useCallback(
    async (event: any) => {
      const parent = event.target.closest('tr');
      const value = parent.dataset.value;
      const number = parent.dataset.number;
      const studyKey = parent.dataset.study;
      // const {
      //   data: { modality },
      // } = await call.get(`/api/v1/worklists/info/study/${studyKey}`);
      // const value2 = hanging.data.find((v: any) => v.modality === modality);
      // if (value2) {
      //   if (comparisonSeries[0] !== value2.series_row && comparisonSeries[1] !== value2.series_columns) {
      //     dispatch(setComparisonSeriesChange([Number(value.series_row), Number(value.series_columns)]));
      //   }
      // } else {
        dispatch(setComparisonSeriesChange([2, 2]));
        // }
      dispatch(setComparisonStudyKeyChange(studyKey));
      dispatch(setComparisonCheckBoolChange(true));
      dispatch(setComparisonCheckModalBool(!comparisonCheckModalBool));

      // if (Number(value)) {
      //   const row = workListArr[number]
      //   window.location.replace(`/pacs/viewer/${row.study_key}/${row.study_instance_uid}/${row.patient_id}`);
      // }else {
      //   const row = pastListArr[number]
      //   window.location.replace(`/pacs/viewer/${row.study_key}/${row.study_instance_uid}/${row.patient_id}`);
      // }
    },
    [pastListArr, workListArr, comparisonCheckModalBool],
  );

  const MoreButtonClick = useCallback(() => {
    const payload = {
      params: {
        patient_id: patientId,
        patient_name: patientName,
        reading_status: '',
        modality: modality === " " ? '' :modality,
        verify_flag: '',
        start_date: '19900101',
        end_date: moment().format('YYYYMMDD'),
        pagingNum: pagingNum + 1,
        limitState,
        listLength :workListArrLength
      },
      value: 1,
      headers,
    };
    setPagingNum(pagingNum + 1);
    modalityTypeSearch(payload);
  }, [patientId, patientName, modality, pagingNum, workListArr,limitState,workListArrLength]);

  const modalityChnage = useCallback((event: any) => {
    setModality(event.target.value);
  }, []);
  const patientIdChange = useCallback((event: any) => {
    setPatientId(event.target.value);
  }, []);
  const patientNameChange = useCallback((event: any) => {
    setPatientName(event.target.value);
  }, []);

  const EnterKeyEvent = useCallback((event:any)=> {
    if (event.keyCode === 13) {
      const payload = {
        params: {
          patient_id: patientId,
          patient_name: patientName,
          reading_status: '',
          modality: modality ===" "?'':modality,
          verify_flag: '',
          start_date: '19900101',
          end_date: moment().format('YYYYMMDD'),
          pagingNum: 0,
          limitState
        },
        headers,
      };
      setPagingNum(0);
      modalityTypeSearch(payload);
    }
  },[headers, modality, patientId, modality,limitState])

  const limitChangeEvent = useCallback((event : any)=> {
    setLimitState(event.target.value);
  },[])

  useEffect(()=> {
    if (workListArr.length) {
      setWorkListArrLength(workListArr.length)
    }
  },[workListArr])

  return (
    <Modal open={comparisonCheckModalBool} onClose={closeButton}>
      <ComparisonCheckListModalCss>
        <Box
          sx={{
            width: '100%',
            height: '95%',
          }}
        >
          <Box
            sx={{
              height: '10%',
            }}
          >
            <Box>
              <h2>{t('TID02333')}</h2>
            </Box>
            <FormControl>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <Grid className="textfield">
                  <TextField
                    name="patientId"
                    label={t('TID02821')}
                    variant="outlined"
                    size="small"
                    sx={{
                      '.MuiInputLabel-shrink' :{
                        borderRadius: '0px'
                      },
                      '.Mui-focused':{
                        borderRadius: '50px',
                      },
                      '.MuiInputLabel-outlined':{
                        // border: '1px solid #32fbcd',
                        color:'white'
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                          color:'white'
                        },
                      },
                      '& .MuiFormLabel-root.Mui-focused': {
                        color: 'white',
                      },
                      bgcolor: '#373737',
                      input: {
                        '&:focus': {
                          backgroundColor: '#000',
                          color: '#fff',
                        },
                        color: '#9b9b9b',
                        borderRadius: '50px',
                      },
                      width: '280px',
                      height: '36px',
                      ml: '10px',
                      borderRadius: '50px',
                      mt: '24px',
                    }}
                    autoComplete="off"
                    defaultValue={patientId}
                    onChange={patientIdChange}
                    onKeyDown={EnterKeyEvent}
                  />
                </Grid>
                <Grid className="textfield">
                  <TextField
                    name="patientName"
                    label={t('TID02738')}
                    variant="outlined"
                    size="small"
                    sx={{
                      '.MuiInputLabel-shrink' :{
                        borderRadius: '0px'
                      },
                      '.Mui-focused':{
                        borderRadius: '50px',
                      },
                      '.MuiInputLabel-outlined':{
                        // border: '1px solid #32fbcd',
                        color:'white'
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                          color:'white'
                        },
                      },
                      '& .MuiFormLabel-root.Mui-focused': {
                        color: 'white',
                      },
                      bgcolor: '#373737',
                      input: {
                        '&:focus': {
                          backgroundColor: '#000',
                          color: '#fff',
                        },
                        color: '#9b9b9b',
                        borderRadius: '50px',
                      },
                      width: '280px',
                      height: '36px',
                      ml: '10px',
                      borderRadius: '50px',
                      mt: '24px',
                    }}
                    autoComplete="off"
                    defaultValue={patientName}
                    onChange={patientNameChange}
                    onKeyDown={EnterKeyEvent}
                  />
                </Grid>
                <Grid className="selectfield">
                  {/* <InputLabel>
                    선택하세요
                  </InputLabel> */}
<TextField
  select
  className="select"
  id="modality"
  variant="outlined"
  size="small"
  sx={{
    bgcolor: '#373737',
    color: '#9b9b9b',
    '.css-1pysi21-MuiFormLabel-root-MuiInputLabel-root' : {
      color: '#9b9b9b',
    },
    '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root' :{
      display: 'none',
    },
    '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root.Mui-focused' :{
      display: 'block'
    },
    '.MuiInputLabel-shrink' :{
      borderRadius: '0px'
    },
    '.Mui-focused':{
      borderRadius: '50px',
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "white",
        color:'white'
      },
    },
    borderRadius: '50px',
    width: '280px',
    height: '36px',
    ml: '10px',
    mt: '24px',
  }}
  value={modality}
  onChange={modalityChnage}
  SelectProps={{
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center"
      },
      PaperProps : {
        style: {
          maxHeight: "200px",
        },
      },
    }
  }}
>
                    <MenuItem value=" ">{t('TID03029')}</MenuItem>
                    <MenuItem value="AS">AS</MenuItem>
                    <MenuItem value="AU">AU</MenuItem>
                    <MenuItem value="BI">BI</MenuItem>
                    <MenuItem value="CD">CD</MenuItem>
                    <MenuItem value="CF">CF</MenuItem>
                    <MenuItem value="CP">CP</MenuItem>
                    <MenuItem value="CR">CR</MenuItem>
                    <MenuItem value="CS">CS</MenuItem>
                    <MenuItem value="CT">CT</MenuItem>
                    <MenuItem value="DD">DD</MenuItem>
                    <MenuItem value="DF">DF</MenuItem>
                    <MenuItem value="DG">DG</MenuItem>
                    <MenuItem value="DM">DM</MenuItem>
                    <MenuItem value="DR">DR</MenuItem>
                    <MenuItem value="DS">DS</MenuItem>
                    <MenuItem value="DX">DX</MenuItem>
                    <MenuItem value="EC">EC</MenuItem>
                    <MenuItem value="ES">ES</MenuItem>
                    <MenuItem value="FA">FA</MenuItem>
                    <MenuItem value="FS">FS</MenuItem>
                    <MenuItem value="LS">LS</MenuItem>
                    <MenuItem value="LP">LP</MenuItem>
                    <MenuItem value="MA">MA</MenuItem>
                    <MenuItem value="MR">MR</MenuItem>
                    <MenuItem value="MS">MS</MenuItem>
                    <MenuItem value="NM">NM</MenuItem>
                    <MenuItem value="OT">OT</MenuItem>
                    <MenuItem value="PT">PT</MenuItem>
                    <MenuItem value="RF">RF</MenuItem>
                    <MenuItem value="RG">RG</MenuItem>
                    <MenuItem value="ST">ST</MenuItem>
                    <MenuItem value="TG">TG</MenuItem>
                    <MenuItem value="US">US</MenuItem>
                    <MenuItem value="VF">VF</MenuItem>
                    <MenuItem value="XA">XA</MenuItem>
                  </TextField>
                </Grid>
                <Grid>
                  <Box
                    sx={{
                      background: '#621212',
                      '&:hover': { background: '#a00000' },
                      color: 'white',
                      borderRadius: '50%',
                      width: '3rem',
                      height: '3rem',
                      mt: '22px',
                      ml: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textAlign: 'center',
                      lineHeight: '3rem',
                      cursor: 'pointer',
                    }}
                    onClick={SearchClickButton}
                  >
                    {t('TID02333')}
                  </Box>
                </Grid>
              </Box>
            </FormControl>
          </Box>
          <Box
            sx={{
              height: '90%',
            }}
          >
            <Box
              sx={{
                mt: 2,
                mb: 2,
                display:'flex',
                flexDirection: 'row',
                justifyContent:'space-between',
              }}
            >
              <h2>{t('TID00009')}</h2>
              <Select 
                  // style={{
                  //   marginLeft:'auto',
                  //   backgroundColor: 'white',
                  // }}
                  sx={{
                    borderRadius: '15px',
                    color: 'white',
                    bgcolor: 'black',
                    marginRight: {
                      fullhd: '32px',
                      desktop: '16px',
                    },
                    // "@media screen and (orientation: portrait)":{
                    //   marginRight:{
                    //     desktop: '28px',
                    //   }
                    // },
                    width: '130px',
                    height: '28px',
                    size: 'small',
                    fontSize: '11px',
                    border: '1px solid transparent',
                    // textAlign: 'right',
                    '&:hover': {
                      transitionDelay: '0.1s',
                      background: '#000000',
                      border: '1px solid #a00000',
                    },
                    '.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':{
                      paddingRight: '3px',
                    },
                  }} 
                  onChange={limitChangeEvent} 
                  defaultValue={10}
                  IconComponent={(props) => (<MoreHorizIcon sx={{ color: '#a00000', fontSize: '20px', mr: '20px' }} />)}
                >
                  <MenuItem value="10">{t('TID03025')}</MenuItem>
                  <MenuItem value="20">{t('TID03026')}</MenuItem>
                  <MenuItem value="50">{t('TID03027')}</MenuItem>
                  <MenuItem value="100">{t('TID03028')}</MenuItem>
                </Select>
            </Box>
            <Box className="comparisontable">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '20%' }} align="center">
                      {t('TID02738')}
                    </TableCell>
                    <TableCell sx={{ width: '10%' }} align="center">
                      {t('TID00031')}
                    </TableCell>
                    <TableCell sx={{ width: '40%' }} align="center">
                      {t('TID02820')}
                    </TableCell>
                    <TableCell sx={{ width: '10%' }} align="center">
                      {t('TID00032')}
                    </TableCell>
                    <TableCell sx={{ width: '10%' }} align="center">
                      {t('TID00034')}
                    </TableCell>
                    <TableCell sx={{ width: '10%' }} align="center">
                      {t('TID00035')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workListArr.length ? (
                    workListArr.map((v: any, i: any) => {
                      return (
                        <TableRow
                          key={i}
                          data-number={i}
                          data-study={v.studyKey}
                          data-value="1"
                          onDoubleClick={ListDoubleClickButton}
                        >
                          <TableCell align="left">{v.pName}</TableCell>
                          <TableCell align="center">{v.modality}</TableCell>
                          <TableCell align="left">{v.studyDesc}</TableCell>
                          <TableCell align="center">{v.studyDate}</TableCell>
                          <TableCell align="right">{v.seriesCnt}</TableCell>
                          <TableCell align="right">{v.imageCnt.toLocaleString('ko-KR')}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{width: '100%', textAlign : 'center'}}>{t('TID03074')}</Box>                        
                      </TableCell>
                    </TableRow>
                  )}
                  {workListArr.length ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ width: '100%', backgroundColor: '#242424'}}>
                      <Box sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                          <Box>&nbsp;</Box>
                          <Box>  
                            <Button
                              sx={{
                                borderRadius: '15px',
                                color: 'white',
                                bgcolor: '#000000',
                                marginRight: '12px',
                                width: '100px',
                                height: '28px',
                                size: 'small',
                                fontSize: '11px',
                                border: '1px solid transparent',
                                '&:hover': {
                                  transitionDelay: '0.1s',
                                  background: '#000000',
                                  border: '1px solid #a00000',
                                },
                              }}
                              onClick={MoreButtonClick}>
                                {t('TID02824')}
                                <ExpandMoreIcon sx={{ color: '#a00000', fontSize: '20px', ml: '5px' }} />
                              </Button>
                          </Box>
                          <Box>&nbsp;</Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}
                </TableBody>
              </Table>
            </Box>
            {pastListArr.length > 0 && (
              <>
                <Box
                  sx={{
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <h2>{t('TID03146')}</h2>
                </Box>
                <Box className="comparisonPreviousTable">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '20%' }} align="center">
                          {t('TID02738')}
                        </TableCell>
                        <TableCell sx={{ width: '10%' }} align="center">
                          {t('TID00031')}
                        </TableCell>
                        <TableCell sx={{ width: '40%' }} align="center">
                          {t('TID02820')}
                        </TableCell>
                        <TableCell sx={{ width: '10%' }} align="center">
                          {t('TID00032')}
                        </TableCell>
                        <TableCell sx={{ width: '10%' }} align="center">
                          {t('TID00034')}
                        </TableCell>
                        <TableCell sx={{ width: '10%' }} align="center">
                          {t('TID00035')}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pastListArr.map((v: any, i: any) => {
                        return (
                          <TableRow
                            key={i}
                            data-number={i}
                            data-study={v.studyKey}
                            data-value="0"
                            onDoubleClick={ListDoubleClickButton}
                          >
                            <TableCell align="left">{v.pName}</TableCell>
                            <TableCell align="center">{v.modality}</TableCell>
                            <TableCell align="left">{v.studyDesc}</TableCell>
                            <TableCell align="center">{v.studyDate}</TableCell>
                            <TableCell align="right">{v.seriesCnt}</TableCell>
                            <TableCell align="right">{v.imageCnt.toLocaleString('ko-KR')}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '100%',
            height: '5%',
          }}
        >
          <Button
            sx={{
              borderRadius: '15px',
              color: 'white',
              bgcolor: 'black',
              ml: 2,
              width: '100px',
              height: '28px',
              size: 'small',
              fontSize: '11px',
              border: '1px solid transparent',
              '&:hover': {
                transitionDelay: '0.1s',
                background: '#000000',
                border: '1px solid #a00000',
              },
            }}
            onClick={CloseModalButton}
          >
            {t('TID00052')}
          </Button>
        </Box>
      </ComparisonCheckListModalCss>
    </Modal>
  );
};

export default ComparisonCheckListModal;
