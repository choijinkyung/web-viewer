import React, { useCallback, useState, useEffect } from 'react';
import { WorklistSearchCss } from './styled';
import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { worklistActions } from '@store/worklist';
import { endDateAction, modalityAction, pagingNumAction, patientIDAction, patientNameAction, readingStatusAction, startDateAction } from '@store/filter';
import { AppDispatch } from '@store/index';
import moment from 'moment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { setMobileDetailSearchBoolChange } from '@store/worklist';
import { RootState } from '@store/index';
import SearchIcon from '@mui/icons-material/Search';
const WorklistSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
  };
  const [searchSelect, setSearchSelect] = useState('PID');
  const [input, setInput] = useState('');
  const [PNAME, setPNAME] = useState('');
  const [PID, setPID] = useState('');
  const [Modality,setModality] = useState('');
  const [status,setStatus] = useState('');
  const [StartDate,setStartDate] = useState('1990-01-01');
  const [EndDate,setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const { mobileDetailSearchBool } = useSelector((state: RootState) => state.worklistReducer.worklist);
  const { patient_id, patient_name, reading_status, modality, verify_flag, startDate, endDate, resetTrigger, limit } =
    useSelector((state: RootState) => state.filter.filter);

  const ChnagePname = useCallback((event: any) => {
    setPNAME(event.target.value);
  }, []);

  const DetailSearchButton = useCallback(() => {
    dispatch(setMobileDetailSearchBoolChange(!mobileDetailSearchBool));
  }, [mobileDetailSearchBool]);

  /**
   * 날짜 입력창(input) 선택 시 상태값을 변경하는 함수(시작일)
   */
  const chnageStartDateInput = useCallback((event: any) => {
    setStartDate(moment(event.target.value).format('YYYY-MM-DD'))
    dispatch(startDateAction(moment(event.target.value).format('YYYYMMDD')));
  }, []);

  /**
   * 날짜 입력창(input) 선택 시 상태값을 변경하는 함수(종료일)
   */
  const chnageEndDateInput = useCallback((event: any) => {
    setEndDate(moment(event.target.value).format('YYYY-MM-DD'))
    dispatch(endDateAction(moment(event.target.value).format('YYYYMMDD')));
  }, []);

  /**
   * 초기화 버튼 클릭 시 발생함수
   */
  const ResetButton = useCallback((event:any)=> {
    event.preventDefault()
    setPNAME('')
    setPID('')
    setModality('')
    setStatus('')
    setStartDate('1990-01-01')
    setEndDate(moment().format('YYYY-MM-DD'))
  },[])

  /**
   * 장비(Modality) 변경 함수
   */
  const ModalityChange = useCallback((event:any)=> {
    setModality(event.target.value);
  },[])

  /**
   * 판독상태(Status) 변경 함수
   */
  const StatusChange = useCallback((event:any)=> {
    setStatus(event.target.value);
  },[])


  const fetchWorklist = useCallback(
    async (event: any) => {
      event.preventDefault();
      const payload = {
        params: {
          patient_id: PID,
          patient_name: PNAME,
          reading_status: status,
          start_date: StartDate,
          // start_date: moment().subtract(3, 'months').format('YYYY-MM-DD'),
          end_date: EndDate,
          modality: Modality,
          verify_flag: '',
          pagingNum: 0,
          limit: 15,
        },
        headers,
      };
      sessionStorage.setItem('search', JSON.stringify(payload.params));
      dispatch(pagingNumAction(0));
      dispatch(worklistActions.fetchWorklist(payload));
      dispatch(patientNameAction(PNAME));
      dispatch(patientIDAction(PID));
      dispatch(startDateAction(moment(StartDate).format('YYYYMMDD')));
      dispatch(endDateAction(moment(EndDate).format('YYYYMMDD')));
      dispatch(modalityAction(Modality));
      dispatch(readingStatusAction(status));
    },
    [PNAME, PID,status,StartDate,EndDate,Modality],
  );
  return (
    <WorklistSearchCss>
      <div className="normalSearch">
        <form onSubmit={fetchWorklist}>
          <input type="text" value={PNAME} onChange={ChnagePname} placeholder={'PNAME'}></input>
          <button>
            <SearchIcon className="searchIcon" />
          </button>
        </form>
        <button onTouchStart={DetailSearchButton}>
          상세검색 <ExpandMoreIcon />
        </button>
      </div>
      {mobileDetailSearchBool && (
        <div className="detailSearch">
            <div className="first">
              <form onSubmit={fetchWorklist}>
              <input type="text" value={PID} onChange={(event) => setPID(event.target.value)} placeholder={'PID'} />
              </form>
              <select onChange={ModalityChange} value={Modality}>
                <option value="" defaultValue={''}>
                  {t('TID00031')}
                </option>
                <option value="AS">AS</option>
                <option value="AU">AU</option>
                <option value="BI">BI</option>
                <option value="CD">CD</option>
                <option value="CF">CF</option>
                <option value="CP">CP</option>
                <option value="CR">CR</option>
                <option value="CS">CS</option>
                <option value="CT">CT</option>
                <option value="DD">DD</option>
                <option value="DF">DF</option>
                <option value="DG">DG</option>
                <option value="DM">DM</option>
                <option value="DR">DR</option>
                <option value="DS">DS</option>
                <option value="DX">DX</option>
                <option value="EC">EC</option>
                <option value="ES">ES</option>
                <option value="FA">FA</option>
                <option value="FS">FS</option>
                <option value="LS">LS</option>
                <option value="LP">LP</option>
                <option value="MA">MA</option>
                <option value="MR">MR</option>
                <option value="MS">MS</option>
                <option value="NM">NM</option>
                <option value="OT">OT</option>
                <option value="PT">PT</option>
                <option value="RF">RF</option>
                <option value="RG">RG</option>
                <option value="ST">ST</option>
                <option value="TG">TG</option>
                <option value="US">US</option>
                <option value="VF">VF</option>
                <option value="XA">XA</option>
              </select>
              <select onChange={StatusChange} defaultValue={status}>
                <option value="" disabled>
                  <em>{t('TID00033')}</em>
                </option>
                <option value="">{t('TID03024')}</option>
                <option value="3">{t('TID00013')}</option>
                <option value="9">{t('TID00017')}</option>
                <option value="5">{t('TID00015')}</option>
                <option value="6">{t('TID00016')}</option>
              </select>
            </div>
            <div className="second">
              <input
                type="date"
                className="date-start"
                value={moment(StartDate).format('YYYY-MM-DD')}
                onChange={chnageStartDateInput}
              />
              <span>~</span>
              <input
                type="date"
                className="date-end"
                value={moment(EndDate).format('YYYY-MM-DD')}
                onChange={chnageEndDateInput}
              />
              <button type='button' onTouchStart={ResetButton}>초기화</button>
              <button onTouchStart={fetchWorklist}>검색</button>
            </div>
        </div>
      )}
    </WorklistSearchCss>
  );
};
export default WorklistSearch;
