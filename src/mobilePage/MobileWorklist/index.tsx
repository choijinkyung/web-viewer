import React, { useCallback, useState, useEffect, useRef } from 'react';
import { MobileWorklistCss } from './styled';
import {
  Button,
  createTheme,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  ThemeProvider,
} from '@mui/material';

import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@store/index';
import { setWorklistArrChange, worklistActions } from '@store/worklist';
import { reportActions } from '@store/report';
import DecryptAES256 from '@utils/DecryptAES256';
import { Call } from '@utils/JwtHelper';
import { setDefaultSeriesStorageChange, setSeriesChange, setSeriesValueChange } from '@store/series';
import { useNavigate } from 'react-router';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { pagingNumAction } from '@store/filter';
import InitCornerstone from '@components/InitCornerstone';
import WorklistSearch from '@mobileComponents/Worklist/WorklistSearch';
import WorklistReportBox from '@mobileComponents/Worklist/WorklistReportBox';
const MobileWorklist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const call = new Call();
  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };
  const worklist = useSelector((state: RootState) => state.worklist.worklist);
  const moreWorkList = useSelector((state: RootState) => state.moreworklist.moreWorkList);
  const { pagingNum, patient_id, patient_name, reading_status, modality, verify_flag, startDate, endDate, limit } =
    useSelector((state: RootState) => state.filter.filter);
  const { worklistArr } = useSelector((state: RootState) => state.worklistReducer.worklist);
  const patientPastStudyList = useSelector((state: any) => state.patientPastStudyList.patientPastStudyList);
  const { searchBoxBool } = useSelector((state: RootState) => state.setting.setting);
  const userPrivileges = useSelector((state: any) => state.user.userPrivileges);
  const { mobileDetailSearchBool } = useSelector((state: RootState) => state.worklistReducer.worklist);

  const [worklistSetting, setWorklistSetting] = useState<any>();
  const [worklistSettingLength, setWorklistSettingLength] = useState<any>();
  const [workListArrLength, setWorkListArrLength] = useState(0);
  const [checkItems, setCheckItems] = useState<string[]>([]); //체크된 검사 리스트
  const [selectedRow, setSelectedRow] = useState(''); //선택된 검사
  const [firstRandering, setFirstRandering] = useState(false);
  const [patientStudy, setpatientStudy] = useState<any>([]);

  const worklistColumnArray = [
    { name: t('TID02821'), desc: t('TID02821'), column: 'pID' },
    { name: t('TID02738'), desc: t('TID02738'), column: 'pName' },
    { name: t('TID00031'), desc: t('TID03091'), column: 'modality' },
    { name: t('TID00045'), desc: t('TID00045'), column: 'studyDesc' },
    { name: t('TID00032'), desc: t('TID03083'), column: 'studyDate' },
    { name: t('TID00033'), desc: t('TID03084'), column: 'ReportStatus' },
    { name: t('TID00034'), desc: t('TID03085'), column: 'seriesCnt' },
    { name: t('TID00035'), desc: t('TID03086'), column: 'imageCnt' },
    { name: t('TID02825'), desc: t('TID03087'), column: 'VerifyFlag' },
    { name: t('TID02481'), desc: t('TID03088'), column: 'pSex' },
    { name: t('TID03081'), desc: t('TID03089'), column: 'PatAge' },
    { name: t('TID02955'), desc: t('TID03090'), column: 'RefPhysicianName' },
    { name: t('TID03082'), desc: t('TID03082'), column: 'InsName' },
    { name: t('TID03075'), desc: t('TID03092'), column: 'AI_Company' },
    { name: t('TID03076'), desc: t('TID03093'), column: 'AI_Model_Name' },
    { name: t('TID02995'), desc: t('TID03094'), column: 'AI_Score' },
    { name: t('TID03077'), desc: t('TID03095'), column: 'AI_Priority' },
    { name: t('TID03078'), desc: t('TID03096'), column: 'AI_Number_Of_Findings' },
    { name: t('TID03079'), desc: t('TID03097'), column: 'AI_Abnormal_YN' },
    { name: t('TID03080'), desc: t('TID03098'), column: 'AI_Finding' },
  ];

  // 체크박스 단일 선택
  const handleSingleCheck = (checked: boolean, study_key: string) => {
    if (checked) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems((prev: any[]): any => [...prev, study_key]);
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(checkItems.filter((el) => el !== study_key));
    }
  };

  // 체크박스 전체 선택
  const handleAllCheck = (checked: any) => {
    if (checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      const rowData: any = [];
      worklistArr.forEach((el: any) => rowData.push(el.studyKey));
      setCheckItems(rowData);
    } else {
      // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
      setCheckItems([]);
    }
  };

  //워크리스트 column 선택시, report와 과거검사 api 호출
  const handleWorklistItemClick = useCallback(
    (row: any) => {
      const payload = {
        params: {
          patient_id: row.pID,
          study_key: row.studyKey,
        },
        headers,
      };
      setSelectedRow(row);
      dispatch(worklistActions.fetchPatientPastStudyList(payload));
      dispatch(reportActions.fetchRecentReport(payload));
      dispatch(reportActions.fetchRecentReportInfo(payload));
      dispatch(reportActions.fetchRecentComment(payload));
    },
    [headers],
  );

  //column 더블 클릭시 해당 검사의 뷰어로 이동
  const handleWorklistItemDoubleClick = useCallback(async (row: any) => {
    const user_id = JSON.parse(localStorage.getItem('user') as string).USERID;
    const userID = DecryptAES256(user_id);
    const hanging = await call.get(`/api/v1/hanging/${userID}`);
    const seriesValue = hanging.data.find((v: any) => v.Modality === row.modality);
    if (seriesValue) {
      dispatch({ type: 'setSeriesLayout/0', payload: [Number(seriesValue.SeriesRows), Number(seriesValue.SeriesColumns)] });
      if (Number(seriesValue.SeriesRows) === 1 && Number(seriesValue.SeriesColumns) === 1) {
        dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: 1 } })
        dispatch({ type: 'setSeriesStorage/0', payload: [2, 2] })

      }
    } else {
      dispatch({ type: 'setSeriesViewRange/0', payload: { min: 0, max: 1 } })
      dispatch({ type: 'setSeriesStorage/0', payload: [2, 2] })

    }

    navigate(`/pacs/viewer/${row.studyKey}/${row.studyInsUID}/${encodeURIComponent(row.pID)}`);
  }, []);

  //워크리스트 테이블 더보기 버튼
  const MoreButtonClick = useCallback(() => {
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
        limit,
        listLength: workListArrLength,
      },
      headers,
    };

    sessionStorage.setItem('search', JSON.stringify(payload.params));
    dispatch(worklistActions.fetchMoreWorklist(payload));
    dispatch(pagingNumAction(pagingNum + 1));
  }, [pagingNum, patient_id, patient_name, reading_status, headers, modality, verify_flag, limit, workListArrLength]);

  //세팅api 호출
  async function getSettingData() {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    await call.get(`/api/v1/setting?UserID=${DecryptAES256(userID)}`).then(({ data }) => {
      const worklistData = JSON.parse(data.worklistSetting);
      const color = JSON.parse(data.colorSetting);
      const text = JSON.parse(data.TextSetting);
      setWorklistSetting(worklistData);
      sessionStorage.setItem(
        'color',
        JSON.stringify({ mouse: color.mouseColor, annotation: color.annotationColor, gsps: color.GSPSColor }),
      );
      sessionStorage.setItem('text', JSON.stringify(text));
      InitCornerstone();
      const a = Object.keys(worklistData).filter((v) => {
        if (worklistData[v]) {
          return true;
        } else {
          return false;
        }
      });
      setWorklistSettingLength(a.length + 1);
    });
  }
  useEffect(() => {
    getSettingData();
  }, []);

  useEffect(() => {
    if (worklistArr.length) {
      setWorkListArrLength(worklistArr.length);
    }
  }, [worklistArr]);

  useEffect(() => {
    if (firstRandering) {
      if (moreWorkList !== undefined && moreWorkList !== null) {
        const Arr = worklistArr.concat(moreWorkList);
        dispatch(setWorklistArrChange(Arr));
      }
    } else {
      setFirstRandering(true);
    }
  }, [moreWorkList]);

  useEffect(() => {
    if (firstRandering) {
      if (worklist !== undefined && worklist !== null) {
        dispatch(setWorklistArrChange(worklist));
      }
    }
  }, [worklist]);

  useEffect(() => {
    setpatientStudy([]);
  }, []);

  useEffect(() => {
    if (firstRandering) {
      setpatientStudy(patientPastStudyList);
    }
  }, [patientPastStudyList]);

  return (
    <MobileWorklistCss>
      <WorklistSearch />
      <div className="studyTable">
        <div className="studyTableTitle">StudyList</div>
        {worklistSetting !== null && worklistSetting !== undefined && (
          <TableContainer className="tablebox" component={Paper}>
            <Table aria-label="worklist table" stickyHeader sx={{ zIndex: '100' }}>
              <TableHead>
                <TableRow>
                  {worklistColumnArray.map((v: any, i: number) => {
                    if (worklistSetting[v.column]) {
                      if (
                        v.column === 'modality' ||
                        v.column === 'ReportStatus' ||
                        v.column === 'seriesCnt' ||
                        v.column === 'imageCnt' ||
                        v.column === 'VerifyFlag' ||
                        v.column === 'pSex' ||
                        v.column === 'PatAge'
                      ) {
                        return (
                          <TableCell key={i} align="center">
                            {v.name}
                          </TableCell>
                        );
                      } else if (
                        v.column === 'AI_Company' ||
                        v.column === 'AI_Score' ||
                        v.column === 'AI_Priority' ||
                        v.column === 'AI_Number_Of_Findings' ||
                        v.column === 'AI_Finding' ||
                        v.column === 'AI_Model_Name' ||
                        v.column === 'AI_Abnormal_YN'
                      ) {
                        return (
                          <TableCell key={i} align="center">
                            {v.name}
                          </TableCell>
                        );
                      } else if (
                        v.column === 'pID' ||
                        v.column === 'pName' ||
                        v.column === 'RefPhysicianName' ||
                        v.column === 'InsName' ||
                        v.column === 'studyDate'
                      ) {
                        return (
                          <TableCell key={i} align="center">
                            {v.name}
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell key={i} align="center">
                            {v.name}
                          </TableCell>
                        );
                      }
                    }
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {worklistArr.map((row: any) => (
                  <TableRow
                    key={row.studyKey}
                    onClick={() => {
                      handleWorklistItemClick(row);
                    }}
                    onDoubleClick={() => {
                      handleWorklistItemDoubleClick(row);
                    }}
                  >
                    {worklistColumnArray.map((v: any, i: number) => {
                      if (worklistSetting[v.column]) {
                        if (v.column === 'ReportStatus') {
                          return (
                            <TableCell align="center" key={i}>
                              {row[v.column] === 3
                                ? t('TID00013')
                                : row[v.column] === 5
                                ? t('TID00015')
                                : row[v.column] === 6
                                ? t('TID00016')
                                : row[v.column] === 9
                                ? t('TID00017')
                                : row[v.column] === 4
                                ? t('TID00014')
                                : t('TID00018')}
                            </TableCell>
                          );
                        } else if (v.column === 'VerifyFlag') {
                          return (
                            <TableCell align="center" key={i}>
                              {row[v.column] === 0 ? t('TID02823') : t('TID02822')}
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell align="center" key={i}>
                              {row[v.column]}
                            </TableCell>
                          );
                        }
                      }
                    })}
                  </TableRow>
                ))}
                {worklistArr.length ? (
                  <TableRow>
                    <TableCell colSpan={worklistSettingLength} sx={{ width: '100%', position: 'relative' }}>
                      <Box
                        sx={{
                          width: '85vw',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'left',
                          position: 'sticky',
                          left: '7.5vw',
                        }}
                      >
                        <Box>&nbsp;</Box>
                        <Box sx={{ width: '100%' }}>
                          <Button
                            sx={{
                              borderRadius: '15px',
                              color: 'white',
                              bgcolor: '#000000',
                              marginRight: '12px',
                              width: '100%',
                              height: '30px',
                              size: 'small',
                              // fontSize: '35px',
                              border: '1px solid transparent',
                              '&:hover': {
                                transitionDelay: '0.1s',
                                background: '#000000',
                                border: '1px solid #a00000',
                              },
                            }}
                            onClick={MoreButtonClick}
                          >
                            <p
                              style={{
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {t('TID02824')}
                              <ExpandMoreIcon sx={{ color: '#a00000', fontSize: '25px', verticalAlign: 'middle' }} />
                            </p>
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
          </TableContainer>
        )}
      </div>
    </MobileWorklistCss>
  );
};
export default MobileWorklist;
