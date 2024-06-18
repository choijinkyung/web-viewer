import { Box, Button, FormControl } from '@mui/material';
import React, { ChangeEvent, useEffect } from 'react';
import { useCallback, useState } from 'react';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import BookmarksSharpIcon from '@mui/icons-material/BookmarksSharp';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import { useDispatch, useSelector } from 'react-redux';
import { Report } from './styles';
import moment from 'moment';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Call } from '@utils/JwtHelper';
import { userAction } from '@store/user';
import { AppDispatch } from '@store/index';
import { useTranslation } from 'react-i18next';
import { splitData128 } from '@utils/splitData128';
import { reportActions } from '@store/report';
import { RootState } from '@store/index';
import DecryptAES256 from '@utils/DecryptAES256';
import { isSmallScreen } from '@utils/Resolution';

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

type Row = {
  row: any;
};
const WorklistReportBox = (props: Row) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [comment, setComment] = useState('');
  const [report, setReport] = useState('');
  const [reportInputReset, setReportInputReset] = useState(false);
  const [reportCategory, setReportCategory] = useState([]);
  const [macroName, setMacroName] = useState();
  const [savePoint, setSavePoint] = useState('');
  const [checkList, setCheckList] = useState<any>();
  const recentReport = useSelector((state: any) => state.report.recentReport);
  const recentReportInfo = useSelector((state: any) => state.reportInfo.recentReportInfo);
  const recnetComment = useSelector((state: any) => state.comment.recentComment);
  const userPrivileges = useSelector((state: any) => state.user.userPrivileges);
  const macroCategory = useSelector((state: RootState) => state.macroCategory.reportMacroCategory);
  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };
  const call = new Call();

  useEffect(() => {
    if (props.row !== '') {
      setCheckList(props.row);
    }
  }, [props.row]);

  /**
   * report(판독)창에 판독 내용을 적은 후 저장 하지 않고 다른 검사를 클릭 시 발동되는 함수(저장 알림 기능)
   */
  const reportChnageLogic = useCallback(() => {
    if (
      (savePoint !== '' || (savePoint === '' && report === '')) &&
      savePoint !== `[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`
    ) {
      if (props.row !== '' && props.row !== checkList) {
        if (confirm(t('TID03148'))) {
          const data = {
            studyKey: checkList.studyKey,
            InterpretationArr: splitData128(savePoint),
          };
          const userID = JSON.parse(localStorage.getItem('user')!).USERID;
          const userName = JSON.parse(localStorage.getItem('user')!).USERNAME;
          const form = {
            typeValue: 0,
            studyInsUID: checkList.studyInsUID,
            pID: checkList.pID,
            accessNum: checkList.accessNum,
            studyDate: checkList.studyDate,
            studyTime: checkList.studyTime,
            ReadingDrID: DecryptAES256(userID),
            ReadingDr: DecryptAES256(userName),
            ReadingDate: moment().format('YYYYMMDD'),
            ReadingTime: moment().format('HHMMSS'),
            InsertDate: moment().format('YYYYMMDD'),
            InsertTime: moment().format('HHMMSS'),
            ReportStatus: 6,
            InserterName: DecryptAES256(userName),
            pName: checkList.pName,
            pSex: checkList.psex,
            PBirthDateTime: checkList.PBirthDateTime,
            studyDesc: checkList.studyDesc,
            modality: checkList.modality,
            studyKey: checkList.studyKey,
          };
          call.post(`/api/v1/report/ppw/contents`, data, t('TID02712')).catch((err) => console.log(err));
          call
            .post(`/api/v1/report/ppw`, form, t('TID02712'))
            .then((res) => alert(res))
            .catch((err) => console.log(err));
        } else {
          setSavePoint('');
        }
      }
    }
  }, [props.row, savePoint, report, checkList]);

  useEffect(() => {
    reportChnageLogic();
  }, [props.row, savePoint]);

  /**
   * 검사 클릭 시 판독내용이 없는 경우 발동되는 이펙트(기본 템플릿)
   */
  useEffect(() => {
    let report: any = '';
    const propsLenght = JSON.stringify(props.row).length;
    if (propsLenght > 2) {
      if (recentReport.length) {
        recentReport.map((v: any) => {
          if (v.Interpretation) {
            report += v.Interpretation;
          }
        });
        if (report === '') {
          setReport(`[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`);
        } else {
          setReport(report);
        }
        setReportInputReset(false);
      } else {
        setReport(`[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`);
      }
    } else {
      setReportInputReset(true);
      setReport(`[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`);
    }
  }, [recentReport, props.row]);

  useEffect(() => {
    if (props) {
      setComment(recnetComment);
    } else {
      setComment('');
    }
  }, [recnetComment]);

  /**
   * comment 상태값 변경 함수
   */
  const onChangeComment = useCallback((event: any) => {
    event.preventDefault();
    setComment(event.target.value);
  }, []);

  /**
   * finding 상태값 변경 함수
   */
  const onChangeFinding = useCallback((event: any) => {
    event.preventDefault();
    setReport(event.target.value);
    setSavePoint(event.target.value);
  }, []);

  /**
   * 코멘트 저장 버튼 함수
   */
  const saveComment = useCallback(
    (event: any) => {
      event.preventDefault();
      if (props.row === '') {
        alert(t('TID03055'));
        return;
      }
      const form = {
        studyKey: props.row.studyKey,
        HisComments: comment,
      };
      call.post(`/api/v1/report/ppw/comments`, form, t('TID02712')).then((res) => alert(res));
    },
    [comment, props],
  );

  /**
   * 코멘트 내용 삭제 함수
   */
  const deleteComment = useCallback(
    (event: any) => {
      event.preventDefault();
      setComment('');
    },
    [comment],
  );

  /**
   * 판독 내용 삭제 함수
   */
  const deleteReport = useCallback(
    (event: any) => {
      event.preventDefault();
      setReport('');
    },
    [report],
  );

  /**
   * 판독 버튼 클릭 함수(판독저장)
   */
  const readingReport = useCallback(
    async (event: any) => {
      event.preventDefault();
      if (props.row === '') {
        alert(t('TID03057'));
        return;
      }
      const data = {
        studyKey: props.row.studyKey,
        InterpretationArr: splitData128(report),
      };
      const userID = JSON.parse(localStorage.getItem('user')!).USERID;
      const userName = JSON.parse(localStorage.getItem('user')!).USERNAME;
      const form = {
        typeValue: 0,
        studyInsUID: props.row.studyInsUID,
        pID: props.row.pID,
        accessNum: props.row.accessNum,
        studyDate: props.row.studyDate,
        studyTime: props.row.studyTime,
        ReadingDrID: DecryptAES256(userID),
        ReadingDr: DecryptAES256(userName),
        ReadingDate: moment().format('YYYYMMDD'),
        ReadingTime: moment().format('HHMMSS'),
        InsertDate: moment().format('YYYYMMDD'),
        InsertTime: moment().format('HHMMSS'),
        ReportStatus: 6,
        InserterName: DecryptAES256(userName),
        pName: props.row.pName,
        pSex: props.row.psex,
        PBirthDateTime: props.row.PBirthDateTime,
        studyDesc: props.row.studyDesc,
        modality: props.row.modality,
        studyKey: props.row.studyKey,
      };

      call.post(`/api/v1/report/ppw/contents`, data, t('TID02908')).catch((err) => console.log(err));
      call
        .post(`/api/v1/report/ppw`, form, t('TID02908'))
        .then((res) => alert(res))
        .catch((err) => console.log(err));
      setSavePoint('');
    },
    [props, report],
  );

  /**
   * 예비 판독 버튼 클릭 함수(예비판독 저장)
   */
  const readingPreliminaryReport = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (props.row === '') {
        alert(t('TID03058'));
        return;
      }
      const data = {
        studyKey: props.row.studyKey,
        InterpretationArr: splitData128(report),
      };
      const userID = JSON.parse(localStorage.getItem('user')!).USERID;
      const userName = JSON.parse(localStorage.getItem('user')!).USERNAME;
      const form = {
        typeValue: 1,
        studyInsUID: props.row.studyInsUID,
        pID: props.row.pID,
        accessNum: props.row.accessNum,
        studyDate: props.row.studyDate,
        studyTime: props.row.studyTime,
        TranscriptionistID: DecryptAES256(userID),
        Transcriptionist: DecryptAES256(userName),
        ReadingDrID: DecryptAES256(userID),
        ReadingDr: DecryptAES256(userName),
        ReadingDate: moment().format('YYYYMMDD'),
        ReadingTime: moment().format('HHMMSS'),
        InsertDate: moment().format('YYYYMMDD'),
        InsertTime: moment().format('HHMMSS'),
        ReportStatus: 5,
        InserterName: DecryptAES256(userName),
        pName: props.row.pName,
        pSex: props.row.psex,
        PBirthDateTime: props.row.PBirthDateTime,
        studyDesc: props.row.studyDesc,
        modality: props.row.modality,
        studyKey: props.row.studyKey,
      };

      call.post(`/api/v1/report/ppw/contents`, data, t('TID02908')).catch((err) => console.log(err));
      call
        .post(`/api/v1/report/ppw`, form, t('TID02908'))
        .then((res) => alert(res))
        .catch((err) => console.log(err));
      setSavePoint('');
    },
    [props, report],
  );

  /**
   * 마운트시 판독 매크로 값을 가져오는 로직
   */
  useEffect(() => {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    const payload = {
      params: {
        userID: DecryptAES256(userID),
      },
      headers,
    };
    dispatch(reportActions.fetchReportMacroCategory(payload));
    dispatch(reportActions.fetchReportMacroCategory(payload)).then((data) => {
      let filter: any = [];
      data.payload.forEach((v: any, i: number) => {
        const categoryName = data.payload[i].CategoryName;
        if (!filter.includes(categoryName)) {
          filter.push(categoryName);
        }
      });
      setReportCategory(filter);
      setMacroName(filter[0]);
    });
  }, []);

  /**
   * 판독매크로 select change 시 발동 함수
   */
  const reportMacroChnageEvent = useCallback((event: any) => {
    setMacroName(event.target.value);
  }, []);

  /**
   * report Code 클릭 (change) 시 발동 함수
   */
  const reportCodeChangeEvent = useCallback(
    (event: any) => {
      //권한이 있을때 만 발동
      if (userPrivileges.includes(401) && userPrivileges.includes(211) && userPrivileges.includes(212)) {
        setReport(report + event.target.value);
      } else {
        return;
      }
    },
    [report],
  );

  return (
    <ThemeProvider theme={theme}>
      <Report className={!isSmallScreen() ? '' : 'displayNone'}>
        <Box className="ButtonWrapper">
          <h3 className="ReportTitle">{t('TID00076')}</h3>
          <Box>
            {userPrivileges.includes(220) ? (
              <>
                <Button
                  sx={{
                    // ml: '268px',
                    borderRadius: '15px',
                    color: 'white',
                    bgcolor: 'black',
                    mr: {
                      fullhd: 1,
                      desktop: 0.25,
                    },
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
                  title={t('TID03144')}
                  onClick={saveComment}
                >
                  {t('TID03144')}
                  <PlaylistAddCheckCircleIcon sx={{ color: '#a00000', fontSize: '20px', ml: '5px' }} />
                </Button>
                <Button
                  sx={{
                    ml: {
                      fullhd: '8px',
                      desktop: '2px',
                    },
                    borderRadius: '15px',
                    color: 'white',
                    bgcolor: 'black',
                    mr: {
                      fullhd: 1,
                      desktop: 0.25,
                    },
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
                  title={t('TID03145')}
                  onClick={deleteComment}
                >
                  {t('TID03145')}
                  <ClearIcon sx={{ color: '#a00000', fontSize: '20px', ml: '3px' }} />
                </Button>
              </>
            ) : (
              ''
            )}
            {userPrivileges.includes(401) ? (
              <Button
                sx={{
                  ml: {
                    fullhd: '8px',
                    desktop: '2px',
                  },
                  borderRadius: '15px',
                  color: 'white',
                  bgcolor: 'black',
                  mr: {
                    fullhd: 1,
                    desktop: 0.25,
                  },
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
                title={t('TID03143')}
                onClick={deleteReport}
              >
                {t('TID03143')}
                <LayersClearIcon sx={{ color: '#a00000', fontSize: '20px', ml: '3px' }} />
              </Button>
            ) : (
              ''
            )}
          </Box>
        </Box>
        <Box className="ReportItem">
          <div className="ReportTextArea">
            <textarea
              className="comment"
              placeholder={`[${t('TID02737')}]`}
              value={comment}
              disabled={userPrivileges.includes(220) ? false : true}
              onChange={onChangeComment}
            />
            {userPrivileges.includes(401) ? (
              !userPrivileges.includes(211) && !userPrivileges.includes(212) ? (
                <textarea
                  className={comment === '' ? 'finding' : 'finding color'}
                  placeholder={`[${t('TID02959')}]`}
                  value={report}
                  disabled
                />
              ) : (
                <textarea
                  className={
                    report === `[${t('TID02959')}]\n\n\n\n[${t('TID02960')}]\n\n\n\n[${t('TID02961')}]`
                      ? 'finding color'
                      : 'finding'
                  }
                  placeholder={t('TID02959')}
                  value={report}
                  onChange={onChangeFinding}
                  disabled={JSON.stringify(props.row).length > 2 ? false : true}
                />
              )
            ) : (
              <textarea className="finding" placeholder={`[${t('TID03147')}]`} disabled />
            )}
          </div>
          <Box className="ReportSearchBox">
            <FormControl
              sx={{
                height: 'calc(100% - 40px)',
                backgroundColor: '#373737',
                borderRadius: '15px',
                ml: {
                  fullhd: '12px',
                  desktop: '5px',
                },
                mt: {
                  fullhd: '1%',
                  desktop: '5px',
                },
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  overflowY: 'auto',
                }}
              >
                <Box
                  sx={{
                    marginTop: {
                      fourk: '0.5%',
                      // fullhd: '1%',
                    },
                    width: '100%',
                    height: '50px',
                  }}
                >
                  <Box
                    sx={{
                      marginLeft: {
                        fullhd: '16px',
                        desktop: '8px',
                      },
                      fontSize: {
                        fourk: '14px',
                        fullhd: '14px',
                        desktop: '12px',
                      },
                      lineHeight: '24px',
                    }}
                  >
                    {t('TID03010')}
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <select onChange={reportMacroChnageEvent}>
                      {reportCategory.length < 1 ? (
                        <option>None</option>
                      ) : (
                        reportCategory.map((v: any, i: number) => {
                          return (
                            <option key={i} value={v}>
                              {v}
                            </option>
                          );
                        })
                      )}
                    </select>
                  </Box>
                </Box>
                <Box
                  sx={{                    
                    marginTop: {
                      fourk: '0.5%',
                      // fullhd: '1%',
                    },
                    width: '100%',
                    height: '50px',
                  }}
                >
                  <Box
                    sx={{
                      marginLeft: {
                        fullhd: '16px',
                        desktop: '8px',
                      },
                      fontWeight: '500',
                      fontSize: {
                        fourk: '14px',
                        fullhd: '14px',
                        desktop: '12px',
                      },
                      lineHeight: '24px',
                    }}
                  >
                    Report Code
                  </Box>
                  <Box
                    sx={{
                      textAlign: 'center',
                      marginTop: {
                        fourk: '0.5%',
                        // fullhd: '1%',
                      },
                    }}
                  >
                    <select onChange={reportCodeChangeEvent}>
                      <option value="">None</option>
                      {macroCategory &&
                        macroCategory.map((v: any, i: number) => {
                          if (macroName === v.CategoryName) {
                            return (
                              <option key={i} value={v.ReadingContents}>
                                {v.ReadingCode}
                              </option>
                            );
                          }
                        })}
                    </select>
                  </Box>
                </Box>
                <Box
                  sx={{
                    marginTop: {
                      fourk: '0.5%',
                      // fullhd: '1%',
                    },
                    height: '50px',
                  }}
                >
                  <Box
                    sx={{
                      marginLeft: {
                        fullhd: '16px',
                        desktop: '8px',
                      },
                      fontSize: {
                        fourk: '14px',
                        fullhd: '14px',
                        desktop: '12px',
                      },
                      lineHeight: '24px',
                    }}
                  >
                    <Box>{t('TID03022')}</Box>
                    <Box className="readingWrapper">
                      {recentReportInfo ? (
                        <p className="reading"> {reportInputReset ? '' : recentReportInfo.Transcriptionist} </p>
                      ) : (
                        <p className="unreading" />
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    marginTop: {
                      fourk: '0.5%',
                      // fullhd: '1%',
                    },
                    height: '50px',
                  }}
                >
                  <Box
                    sx={{
                      marginLeft: {
                        fullhd: '16px',
                        desktop: '8px',
                      },
                      fontSize: {
                        fourk: '14px',
                        fullhd: '14px',
                        desktop: '12px',
                      },
                      lineHeight: '24px',
                    }}
                  >
                    <Box>{t('TID00055')}</Box>
                    <Box className="readingWrapper">
                      {recentReportInfo ? (
                        <p className="reading"> {reportInputReset ? '' : recentReportInfo.ReadingDr} </p>
                      ) : (
                        <p className="unreading" />
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: '50px',
                    marginTop: {
                      fourk: '0.5%',
                      // fullhd: '1%',
                    },
                  }}
                >
                  <Box
                    sx={{
                      marginLeft: {
                        fullhd: '16px',
                        desktop: '8px',
                      },
                      fontSize: {
                        fourk: '14px',
                        fullhd: '14px',
                        desktop: '12px',
                      },
                      lineHeight: '24px',
                      marginTop: {
                        fourk: '0.5%',
                        fullhd: '1%',
                      },
                    }}
                  >
                    <Box>{t('TID03009')}</Box>
                    <Box className="readingWrapper">
                      {recentReportInfo ? (
                        <p className="reading"> {reportInputReset ? '' : recentReportInfo.ConfirmDr} </p>
                      ) : (
                        <p className="unreading" />
                      )}
                    </Box>
                  </Box>
                </Box>
                {userPrivileges.includes(401) && userPrivileges.includes(211) && userPrivileges.includes(212) ? (
                !userPrivileges.includes(211) && !userPrivileges.includes(212) ? (
                  ''
                ) : userPrivileges.includes(211) && !userPrivileges.includes(212) ? (
                  ''
                ) : (
                  <Box
                    sx={{
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignContent: 'flex-end',
                      justifyContent: 'center',
                      height: '50px',
                    }}
                  >
                    <Button
                      sx={{
                        borderRadius: '15px',
                        color: 'white',
                        bgcolor: 'black',
                        mb: {
                          fourk: 1,
                          fullhd: 1,
                          desktop: 0.5,
                        },
                        width: {
                          fourk: '100px',
                          fullhd: '40%',
                          desktop: '80%',
                        },
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
                      title={t('TID00016')}
                      onClick={readingReport}
                    >
                      <p
                        style={{
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t('TID00016')}
                      </p>
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
                        borderRadius: '15px',
                        color: 'white',
                        bgcolor: 'black',
                        ml: {
                          fourk: 2,
                          fullhd: 2,
                        },
                        mb: {
                          fourk: 1,
                          fullhd: 1,
                          desktop: '5%',
                        },
                        width: {
                          fourk: '100px',
                          fullhd: '40%',
                          desktop: '80%',
                        },
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
                      title={t('TID00015')}
                      onClick={readingPreliminaryReport}
                    >
                      <p
                        style={{
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
              </Box>              
            </FormControl>
          </Box>
        </Box>
      </Report>
    </ThemeProvider>
  );
};

export default WorklistReportBox;
