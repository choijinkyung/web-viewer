import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, FormControl, Modal, Typography } from '@mui/material';
import { ReportModalCSS } from './styles';
import { setReportModalChange } from '@store/settingbox';
import { AppDispatch } from '@store/index';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import BookmarksSharpIcon from '@mui/icons-material/BookmarksSharp';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import ClearIcon from '@mui/icons-material/Clear';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import axios from 'axios';
import { useParams } from 'react-router';
import moment from 'moment';
import { reportActions } from '@store/report';
import { jwtUtil, Call } from '@utils/JwtHelper';
import { RootState } from '@store/index';
import { useTranslation } from 'react-i18next';
import { worklistActions } from '@store/worklist';
import { splitData128 } from '@utils/splitData128';
import DecryptAES256 from '@utils/DecryptAES256';

export const ReportModal = (props :any) => {
  const { t } = useTranslation();
  const call = new Call();
  const { study_key } = useParams();

  const { reportModalBool } = useSelector((state: RootState) => state.setting.setting);

  const dispatch = useDispatch<AppDispatch>();

  const [comment, setComment] = useState('');
  const [report, setReport] = useState('');
  const [studyInfo, setStudyInfo] = useState<any>([]);
  const [reportCategory,setReportCategory] = useState([])
  const [macroName,setMacroName] = useState()
  const [savePoint,setSavePoint] = useState<any>('');
  const recentReport = useSelector((state: any) => state.report.recentReport);
  const recentReportInfo = useSelector((state: any) => state.reportInfo.recentReportInfo);
  const recnetComment = useSelector((state: any) => state.comment.recentComment);
  const userPrivileges = useSelector((state: any) => state.user.userPrivileges);
  const macroCategory = useSelector((state:RootState)=> state.macroCategory.reportMacroCategory);
  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };

  //comment 변경
  const onChangeComment = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setComment(event.target.value);
  }, []);

  //report finding 변경
  const onChangeFinding = useCallback((event: any) => {
    event.preventDefault();
    setReport(event.target.value);
    setSavePoint(event.target.value);
  }, []);



  //소견저장 버튼
  const saveComment = useCallback(
    async (event: any) => {
      event.preventDefault();
      const form = {
        studyKey: props.location ==='viewer' ? study_key : props.row,
        HisComments: comment,
      };
      await call.post(`/api/v1/report/ppw/comments`, form, t('TID02908')).then((res) => alert(res));
    },
    [comment],
  );

  //코멘트 삭제 버튼 (사실상 reset)
  const deleteComment = useCallback(
    (event: any) => {
      event.preventDefault();
      setComment('');
    },
    [comment],
  );

  //판독 지우기 버튼 (사실상 reset)
  const deleteReport = useCallback(
    (event: any) => {
      event.preventDefault();
      setReport('');
      setSavePoint("");
    },
    [report],
  );

  //판독버튼 
  const readingReport = useCallback(
    async (event: any) => {
      event.preventDefault();
      const userID = JSON.parse(localStorage.getItem('user')!).USERID
      const userName = JSON.parse(localStorage.getItem('user')!).USERNAME
      

      const data = {
        studyKey : studyInfo.studyKey,
        InterpretationArr : splitData128(report)
       }
      const form = {
        typeValue: 0,
        studyInsUID:studyInfo.studyInsUID,
        pID:studyInfo.pID,
        accessNum:studyInfo.accessNum,
        studyDate:studyInfo.studyDate,
        studyTime:studyInfo.studyTime,
        ReadingDrID:DecryptAES256(userID),
        ReadingDr:DecryptAES256(userName),
        ReadingDate:moment().format('YYYYMMDD'),
        ReadingTime:moment().format('HHMMSS'),
        InsertDate:moment().format('YYYYMMDD'),
        InsertTime:moment().format('HHMMSS'),
        ReportStatus:6,
        InserterName:DecryptAES256(userID),
        pName:studyInfo.pName,
        pSex:studyInfo.psex,
        PBirthDateTime:studyInfo.PBirthDateTime,
        studyDesc:studyInfo.studyDesc,
        modality:studyInfo.modality,
        studyKey:studyInfo.studyKey,
      };

      call
      .post(`/api/v1/report/ppw/contents`, data, t('TID02908'))
      .catch((err) => console.log(err));
      call
      .post(`/api/v1/report/ppw`, form, t('TID02908'))
      .then((res) => alert(res))
      .catch((err) => console.log(err));
      setSavePoint('')
    },
    [report, reportModalBool,studyInfo],
  );

  //예비판독
  const readingPreliminaryReport = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = {
      studyKey : studyInfo.studyKey,
      InterpretationArr : splitData128(report)
     }
     const userID = JSON.parse(localStorage.getItem('user')!).USERID
     const userName = JSON.parse(localStorage.getItem('user')!).USERNAME
     const form = {
       typeValue: 1,
       studyInsUID:studyInfo.studyInsUID,
       pID:studyInfo.pID,
       accessNum:studyInfo.accessNum,
       studyDate:studyInfo.studyDate,
       studyTime:studyInfo.studyTime,
       TranscriptionistID:DecryptAES256(userID),
       Transcriptionist:DecryptAES256(userName),
       ReadingDrID:DecryptAES256(userID),
       ReadingDr:DecryptAES256(userName),
       ReadingDate:moment().format('YYYYMMDD'),
       ReadingTime:moment().format('HHMMSS'),
       InsertDate:moment().format('YYYYMMDD'),
       InsertTime:moment().format('HHMMSS'),
       ReportStatus:5,
       InserterName:DecryptAES256(userName),
       pName:studyInfo.pName,
       pSex:studyInfo.psex,
       PBirthDateTime:studyInfo.PBirthDateTime,
       studyDesc:studyInfo.studyDesc,
       modality:studyInfo.modality,
       studyKey:studyInfo.studyKey,
     };
 
     call
     .post(`/api/v1/report/ppw/contents`, data, t('TID02908'))
     .catch((err) => console.log(err));
   call
     .post(`/api/v1/report/ppw`, form, t('TID02908'))
     .then((res) => alert(res))
     .catch((err) => console.log(err));
     setSavePoint('')
  }, [report, reportModalBool,studyInfo]);

  //모달닫기 버튼
  const handleClose = useCallback(() => {
    if ((savePoint !== '' || (savePoint ==='' && report ===''))  && savePoint !== `[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`) {
      if (confirm('저장하시겠습니까?')) {
        const userID = JSON.parse(localStorage.getItem('user')!).USERID
        const userName = JSON.parse(localStorage.getItem('user')!).USERNAME
        
  
        const data = {
          studyKey : studyInfo.studyKey,
          InterpretationArr : splitData128(savePoint)
         }
        const form = {
          typeValue: 0,
          studyInsUID:studyInfo.studyInsUID,
          pID:studyInfo.pID,
          accessNum:studyInfo.accessNum,
          studyDate:studyInfo.studyDate,
          studyTime:studyInfo.studyTime,
          ReadingDrID:DecryptAES256(userID),
          ReadingDr:DecryptAES256(userName),
          ReadingDate:moment().format('YYYYMMDD'),
          ReadingTime:moment().format('HHMMSS'),
          InsertDate:moment().format('YYYYMMDD'),
          InsertTime:moment().format('HHMMSS'),
          ReportStatus:6,
          InserterName:DecryptAES256(userID),
          pName:studyInfo.pName,
          pSex:studyInfo.psex,
          PBirthDateTime:studyInfo.PBirthDateTime,
          studyDesc:studyInfo.studyDesc,
          modality:studyInfo.modality,
          studyKey:studyInfo.studyKey,
        };
  
        call
        .post(`/api/v1/report/ppw/contents`, data, t('TID02908'))
        .catch((err) => console.log(err));
        call
        .post(`/api/v1/report/ppw`, form, t('TID02908'))
        .then((res) => alert(res))
        .catch((err) => console.log(err));
        setSavePoint('')
      }else {
        const propsLenght = JSON.stringify(recentReport).length
        let report: any = '';
        if (propsLenght > 2) {
          if (recentReport.length) {
            recentReport.map((v: any) => {
              if (v.Interpretation) {
                report += v.Interpretation;
              }
            });
            if (report === '') {
              setReport(`[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`)  
            }else {
              setReport(report);
            }
          }else {
            setReport(`[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`)  
          }
        }else {
          setReport(`[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`)  
        }
        setSavePoint('')
      }
    }
    dispatch(setReportModalChange(!reportModalBool));
  }, [reportModalBool,savePoint,recentReport,report, reportModalBool,studyInfo]);

  //현재 검사정보를 주기 위함 api 함수
  const getCurrentStudyInfo = useCallback(async () => {
    if (props.location ==='viewer') {

      const { data } = await call.get(`/api/v1/worklists/onestudy/${study_key}`);
      setStudyInfo(data);
    }else {
      const { data } = await call.get(`/api/v1/worklists/onestudy/${props.row}`);
      setStudyInfo(data);
    }
  }, [study_key,props]);

  //현재 검사정보를 확인을 위한 api 함수 호출 effect 검사가 바뀔때마다 호출
  useEffect(() => {
    getCurrentStudyInfo();
  }, [study_key]);

  useEffect(()=> {
    setSavePoint('');
  },[study_key])
  //현재 검사정보를 확인을 위한 api 함수 호출 effect 검사가 바뀔때마다 호출
  useEffect(() => {
    getCurrentStudyInfo();
  }, [props]);

  useEffect(()=> {
    setSavePoint('');
  },[props])

  //화면에 판독정보를 표출하기 위한 effect
  useEffect(() => {
    let report: any = '';
    // recentReport.map((v: any) => {
    //   if (v.Interpretation) {
    //     report += v.Interpretation;
    //   }
    // });
    // setreport(report);
    const propsLenght = JSON.stringify(recentReport).length
    if (propsLenght > 2) {
      if (recentReport.length) {
        recentReport.map((v: any) => {
          if (v.Interpretation) {
            report += v.Interpretation;
          }
        });
        if (report === '') {
          setReport(`[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`)  
        }else {
          setReport(report);
        }
      }else {
        setReport(`[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`)  
      }
    }else {
      setReport(`[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`)  
    }
  }, [recentReport, recnetComment, recentReportInfo]);

  function dateFormat(date?: any, time?: any) {
    const yyyymmdd = date && date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');

    const hhmmss = time && time.replace(/(\d{2})(\d{2})(\d{2})/g, '$1:$2:$3');
    return time !== null ? `${yyyymmdd} ${hhmmss}` : `${yyyymmdd}`;
  }

  useEffect(() => {
    const payload = {
      params: {
        study_key :props.location ==='viewer' ? study_key : props.row,
      },
      headers,
    };
    dispatch(reportActions.fetchRecentReport(payload));
    dispatch(reportActions.fetchRecentReportInfo(payload));
  }, [study_key]);

    //마운트시 판독 매크로 값을 가져오는 로직
  useEffect(()=> {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    const payload = {
      params: {
        userID:DecryptAES256(userID)
      },
      headers,
    };
    dispatch(reportActions.fetchReportMacroCategory(payload))
    dispatch(reportActions.fetchReportMacroCategory(payload)).then((data)=> {
      let filter:any = [];
      data.payload.forEach((v:any,i:number)=> {
        const categoryName = data.payload[i].CategoryName;
        if (!filter.includes(categoryName)) {
          filter.push(categoryName);
        }
      })
      setReportCategory(filter);
      setMacroName(filter[0]);
    })
  },[])

    //판독매크로 select change 시 발동 함수
  const reportMacroChnageEvent = useCallback((event:any)=> {
    setMacroName(event.target.value);
  },[])

  //report Code 클릭 (change) 시 발동 함수
  const reportCodeChangeEvent = useCallback((event:any)=> {
    //권한이 있을때 만 발동
    if (userPrivileges.includes(401) && userPrivileges.includes(211) &&userPrivileges.includes(212)) {
      setReport(report+event.target.value);
    }else {
      return;
    }
  },[report])
  return (
    <Modal
      open={reportModalBool}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ReportModalCSS>
        {studyInfo && (
          <Box
            sx={{
              width: '100%',
              color: '#fff',
              padding: '10px 12px',
              borderBottom: '1px solid #dedede',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              {t('TID03035')} : {studyInfo.pName} / {studyInfo.pID} / {studyInfo.PBirthDateTime}
            </p>
            <p
              style={{
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              {t('TID02740')} : {dateFormat(studyInfo.studyDate, studyInfo.studyTime)}
            </p>
            <p
              style={{
                fontSize: '14px',
              }}
            >
              {t('TID03036')} : {studyInfo.studyDesc}
            </p>
          </Box>
        )}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            // backgroundColor : '#affafa'
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: ' row',
              justifyContent: 'end',
              // backgroundColor : '#a2a2a2'
            }}
          >
            {userPrivileges.includes(220) ? (
              <>
                <Button
                  sx={{
                    // ml: '268px',
                    borderRadius: '15px',
                    color: 'white',
                    bgcolor: 'black',
                    mt: 2,
                    mr: 1,
                    width: '110px',
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
                  onClick={saveComment}
                  title={t('TID03144')}
                >
                  <p style={{
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    }}
                  >
                    {t('TID03144')}
                  </p>
                  <PlaylistAddCheckCircleIcon sx={{ color: '#a00000', fontSize: '20px', ml: '3px' }} />
                </Button>
                <Button
                  sx={{
                    ml: '8px',
                    borderRadius: '15px',
                    color: 'white',
                    bgcolor: 'black',
                    mt: 2,
                    mr: 1,
                    width: '110px',
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
                  onClick={deleteComment}
                  title={t('TID03145')}
                > 
                  <p style={{
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    }}
                  >
                    {t('TID03145')}
                  </p>
                  <ClearIcon sx={{ color: '#a00000', fontSize: '20px', ml: '3px' }} />
                </Button>
              </>
            ) : (
              ''
            )}
            {userPrivileges.includes(401) ? (
              <Button
                sx={{
                  ml: '8px',
                  borderRadius: '15px',
                  color: 'white',
                  bgcolor: 'black',
                  mt: 2,
                  mr: 1,
                  width: '110px',
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
                onClick={deleteReport}
                title={t('TID03143')}
              > 
              <p style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                }}
              >
                {t('TID03143')}
                </p>
                <LayersClearIcon sx={{ color: '#a00000', fontSize: '20px', ml: '3px' }} />
              </Button>
            ) : (
              ''
            )}
          </Box>
        </Box>
        {studyInfo && (
          <Box className="ReportItem">
            <div className="ReportTextArea">
              <textarea
                className="comment"
                placeholder={`[${t('TID02737')}]`}
                value={comment}
                disabled={userPrivileges.includes(220) ? false : true}
                onChange={() => {
                  onChangeComment;
                }}
              />
            {userPrivileges.includes(401) ? !userPrivileges.includes(211) && !userPrivileges.includes(212) ? (
              <textarea className="finding" placeholder={`[${t('TID02959')}]`} value={report} disabled/>
            ) : (<textarea className={report ===`[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`  ? "finding color" : "finding"} placeholder={t('TID02959')} value={report} onChange={onChangeFinding} disabled={JSON.stringify(studyInfo).length > 2 ? false : true}/>) : (
              <textarea className="finding" placeholder={`[${t('TID03147')}]`} disabled />
            )}
            </div>
            <Box className="ReportSearchBox">
              <FormControl
                sx={{
                  height: '100%',
                  backgroundColor: '#373737',
                  borderRadius: '15px',
                  ml: '12px',
                  mt: '10px',
                  mb: '15px',
                }}
              >
                <Box sx={{ marginTop: '16px', width: '100%' }}>
                  <Box
                    sx={{
                      marginLeft: '16px',
                      fontSize: '14px',
                      lineHeight: '24px',
                      color: 'white',
                    }}
                  >
                    {t('TID03010')}
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <select
                      style={{
                        width: '80%',
                        height: '25px',
                        marginTop: '10px',
                        backgroundColor: '#090900',
                        color: 'white',
                        borderRadius: '10px',
                        fontSize: '12px',
                        // lineHeight: '15px',
                      }}
                      onChange={reportMacroChnageEvent}
                    >
                      { reportCategory.map((v:any,i:number)=> {
                        return (
                          <option key={i} value={v}>{v}</option>
                        )
                      })}
                    </select>
                  </Box>
                </Box>
                <Box style={{ marginTop: '12px', width: '100%' }}>
                  <Box
                    style={{
                      marginLeft: '16px',
                      fontWeight: '500',
                      fontSize: '14px',
                      lineHeight: '24px',
                      color: 'white',
                    }}
                  >
                    Report Code
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <select
                      style={{
                        width: '80%',
                        height: '25px',
                        marginTop: '12px',
                        backgroundColor: '#090900',
                        color: 'white',
                        borderRadius: '10px',
                        fontSize: '12px',
                      }}
                      onChange={reportCodeChangeEvent}
                    >
                      <option value="">None</option>
                      {macroCategory && macroCategory.map((v:any,i:number)=> {
                        if (macroName === v.CategoryName) {
                          return(
                            <option key={i} value={v.ReadingContents}>{v.ReadingCode}</option>
                          )
                        }
                      })}
                    </select>
                  </Box>
                </Box>
                <Box style={{ marginTop: '12px' }}>
                  <Box
                    style={{
                      marginLeft: '16px',
                      fontSize: '14px',
                      lineHeight: '24px',
                      color: 'white',
                    }}
                  >
                    <Box>{t('TID00053')}</Box>
                    <Box className="readingWrapper">
                      {recentReportInfo.ReadingDate ? (
                        <p className="reading">
                          {' '}
                          {dateFormat(recentReportInfo.ReadingDate, recentReportInfo.ReadingTime)}{' '}
                        </p>
                      ) : (
                        <p className="unreading" />
                      )}
                    </Box>
                  </Box>
                  <Box
                    style={{
                      marginLeft: '16px',
                      fontSize: '14px',
                      lineHeight: '24px',
                      marginTop: '12px',
                      color: 'white',
                    }}
                  >
                    <p>{t('TID03022')}</p>
                    <Box className="readingWrapper">
                      {recentReportInfo.Transcriptionist ? (
                        <p className="reading"> {recentReportInfo.Transcriptionist} </p>
                      ) : (
                        <p className="unreading" />
                      )}
                    </Box>
                  </Box>
                  <Box
                    style={{
                      marginLeft: '16px',
                      fontSize: '14px',
                      lineHeight: '24px',
                      marginTop: '12px',
                      color: 'white',
                    }}
                  >
                    <p>{t('TID00055')}</p>
                    <Box className="readingWrapper">
                      {recentReportInfo.ReadingDr ? (
                        <p className="reading"> {recentReportInfo.ReadingDr} </p>
                      ) : (
                        <p className="unreading" />
                      )}
                    </Box>
                  </Box>
                  <Box
                    style={{
                      marginLeft: '16px',
                      fontSize: '14px',
                      lineHeight: '24px',
                      marginTop: '12px',
                      color: 'white',
                    }}
                  >
                    <p>{t('TID03009')}</p>
                    <Box className="readingWrapper">
                      {recentReportInfo.ConfirmDr ? (
                        <p className="reading"> {recentReportInfo.ConfirmDr} </p>
                      ) : (
                        <p className="unreading" />
                      )}
                    </Box>
                  </Box>
                </Box>
                {userPrivileges.includes(401) && userPrivileges.includes(211) && userPrivileges.includes(212) ? 
              (
                !userPrivileges.includes(211) && !userPrivileges.includes(212) ? (
                  ''
                ) :
                userPrivileges.includes(211) && !userPrivileges.includes(212) ? ('') :
                (
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    sx={{
                      // ml: '268px',
                      borderRadius: '15px',
                      color: 'white',
                      bgcolor: 'black',
                      mt: 3,
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
                    onClick={readingReport}
                    title={t('TID00016')}
                  > 
                  <p style={{
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    }}
                  >
                    {t('TID00016')}</p>
                    <CheckSharpIcon
                      sx={{
                        color: '#a00000',
                        fontSize: '20px',
                        ml: 1,
                      }}
                    />
                  </Button>
                  <Button
                    sx={{
                      // ml: '268px',
                      borderRadius: '15px',
                      color: 'white',
                      bgcolor: 'black',
                      ml: 2,
                      mt: 3,
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
                    onClick={readingPreliminaryReport}
                    title={t('TID00015')}
                  > 
                  <p style={{
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    }}
                  >
                    {t('TID00015')}
                    </p>
                    <BookmarksSharpIcon
                      sx={{
                        color: '#a00000',
                        fontSize: '20px',
                        ml: 1,
                      }}
                    />
                  </Button>
                </Box>
                )
                ) : (
                  ''
                )}
              </FormControl>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: '15px',
              color: 'white',
              bgcolor: 'black',
              ml: 2,
              mr: 2,
              mt: 1,
              mb: 2,
              width: '100px',
              height: '28px',
              size: 'small',
              fontSize: '11px',
              border: '1px solid transparent',
              '&:hover': {
                transitionDelay: '0.1s',
                background: '#621212',
              },
            }}
            title={t('TID00052')}
          >
            {t('TID00052')}
          </Button>
        </Box>
      </ReportModalCSS>
    </Modal>
  );
};
