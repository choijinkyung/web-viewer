import React, { useCallback, useState, useEffect } from 'react';
import { WorklistReportBoxCss } from './styled';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import DecryptAES256 from '@utils/DecryptAES256';
import { Call } from '@utils/JwtHelper';
import { splitData128 } from '@utils/splitData128';
const WorklistReportBox = (props: any) => {
  const { t } = useTranslation();
  const call = new Call();
  const userPrivileges = useSelector((state: any) => state.user.userPrivileges);
  const recentReport = useSelector((state: any) => state.report.recentReport);
  const recnetComment = useSelector((state: any) => state.comment.recentComment);
  const [comment, setComment] = useState('');
  const [report, setReport] = useState('');
  const [savePoint, setSavePoint] = useState('');
  const [reportInputReset, setReportInputReset] = useState(false);
  const [checkList, setCheckList] = useState<any>();
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
   * 검사 클릭 시 컴포넌트로 넘어온 props(선택된 검사 정보) 저장 이펙트
   */
  useEffect(() => {
    if (props.row !== '') {
      setCheckList(props.row);
    }
  }, [props.row]);

  useEffect(() => {
    if (props) {
      setComment(recnetComment);
    } else {
      setComment('');
    }
  }, [recnetComment]);

  /**
   * 검사 클릭 시 내용이 없을 경우 발동되는 이펙트
   */
  useEffect(() => {
    let report: any = '';
    let propsLength;
    if (props.row !== undefined) {
      propsLength = JSON.stringify(props.row).length;
    }
    if (propsLength !== undefined && propsLength > 2) {
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

  /**
   * 내용을 써놓은 후 저장을 누르지 않고 다른 검사 선택 시 발동되는 함수(저장 알림 기능)
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

  /**
   * 예비 판독 버튼 클릭 함수(예비판독 저장)
   */
  const readingPreliminaryReport = useCallback(
    async (event: any) => {
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
   * 자동 저장 알림 실행 이펙트
   */
  useEffect(() => {
    reportChnageLogic();
  }, [props.row, savePoint]);

  return (
    <WorklistReportBoxCss>
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
              placeholder={`[${t('TID02959')}]`}
              value={report}
              onChange={onChangeFinding}
            />
          )
        ) : (
          <textarea className="finding" placeholder={`[${t('TID03147')}]`} disabled />
        )}
        <div className="button">
          <button onTouchStart={saveComment}>코멘트 저장</button>
          <button onTouchStart={readingPreliminaryReport}>예비판독</button>
          <button onTouchStart={readingReport}>판독</button>
        </div>
      </div>
    </WorklistReportBoxCss>
  );
};
export default WorklistReportBox;
