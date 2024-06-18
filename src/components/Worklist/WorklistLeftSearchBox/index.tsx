import { Box, Button } from '@mui/material';
import {
  endDateAction,
  modalityAction,
  pagingNumAction,
  resetTriggerChange,
  startDateAction,
  verifyFlagAction,
} from '@store/filter';
import { AppDispatch } from '@store/index';
import { worklistActions } from '@store/worklist';
import moment from 'moment';
import React, { useCallback, useEffect, useState, useRef, MutableRefObject } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { Filter } from './styles';
import { RootState } from '@store/index';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

const WorklistLeftSeacrhBox = () => {
  const { t } = useTranslation();
  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };
  const [_modality, setModality] = useState('');
  const [verifyFlag, setVerifyFlag] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const [firstRandering, setFirstRandering] = useState(false);
  const [lang, setLang] = useState('');
  const modalityRef = useRef() as MutableRefObject<HTMLSelectElement>;
  const VerifyRef = useRef() as MutableRefObject<HTMLSelectElement>;
  const dispatch = useDispatch<AppDispatch>();

  const { patient_id, patient_name, reading_status, modality, verify_flag, startDate, endDate, resetTrigger, limit } =
    useSelector((state: RootState) => state.filter.filter);

  const { language } = useSelector((state: RootState) => state.language.lang);

  const isBigScreen = useMediaQuery({ minWidth: 1921, maxWidth: 7680  })
  const isSmallScreen = useMediaQuery({ minWidth: 0, maxWidth: 1280 })
  const isFHD = useMediaQuery({ minWidth: 1281, maxWidth: 1920  })
  const isHD = useMediaQuery({ minWidth: 961, maxWidth: 1280  })
  const isQHD = useMediaQuery({ minWidth: 641, maxWidth: 960  })
  const isNHD = useMediaQuery({ minWidth: 0, maxWidth: 640  })

  useEffect(() => {
    const current = modalityRef.current;
    current.value = '';
  }, []);

  /**
   * 달력에 언어팩을 적용하기위한 이펙트
   */
  useEffect(() => {
    const langStorage = localStorage.getItem('lang');
    if (langStorage !== undefined && langStorage !== null) {
      setLang(langStorage);
    }
  }, []);
  /**
   * modality(장비) select 변경 시 상태값을 변경하는 함수
  */
  const handleChangeModality = useCallback(
    (event: any) => {
      event.preventDefault();
      setModality(event.target.value);
    },
    [_modality],
  );

  /**
   * verify select 변경 시 상태값을 변경하는 함수
  */
  const handleChangeVerifyFlag = useCallback(
    (event: any) => {
      event.preventDefault();
      setVerifyFlag(event.target.value);
    },
    [verifyFlag],
  );

  /**
   * 달력에서 지정한 날짜로 상태값(전역 : 리덕스 store)를 변경하는 함수
  */
  const changeCalendarDate = (e: any) => {
    setDisableButton(false); //버튼 비활성화 푸는 state

    dispatch(startDateAction(moment(e[0]).format('YYYYMMDD')));
    dispatch(endDateAction(moment(e[1]).format('YYYYMMDD')));
  };

  /**
   * 날짜 입력창(input) 선택 시 상태값을 변경하는 함수(시작일)
   */
  const chnageStartDateInput = useCallback((event: any) => {
    dispatch(startDateAction(moment(event.target.value).format('YYYYMMDD')));
  }, []);

  /**
   * 날짜 입력창(input) 선택 시 상태값을 변경하는 함수(종료일)
   */
  const chnageEndDateInput = useCallback((event: any) => {
    dispatch(endDateAction(moment(event.target.value).format('YYYYMMDD')));
  }, []);

  /**
   * 조회 버튼 클릭 함수(검색기능)
   */
  const handleFilterSearch = useCallback(() => {
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
  }, [startDate, endDate, modality, verify_flag, patient_id, patient_name, reading_status, headers, limit]);

  /**
   * 재설정 버튼 함수
  */
  const handleSearchFilterReset = useCallback(() => {
    setModality('');
    setVerifyFlag('');

    dispatch(startDateAction('19900101'));
    dispatch(endDateAction(moment().format('YYYYMMDD')));
    dispatch(resetTriggerChange(!resetTrigger));
    modalityRef.current.value = '';
    VerifyRef.current.value = '';
  }, [_modality, verifyFlag, resetTrigger]);

  useEffect(() => {
    dispatch(modalityAction(_modality));
    dispatch(verifyFlagAction(verifyFlag));
  }, [_modality, verifyFlag]);

/**
 * 해당 컴포넌트가 아닌 워크리스트 상단의 재설정 버튼 클릭 시 실행되는 이펙트
 */
  useEffect(() => {
    if (firstRandering) {
      setModality('');
      setVerifyFlag('');
      modalityRef.current.value = '';
      VerifyRef.current.value = '';
    } else {
      setFirstRandering(true);
    }
  }, [resetTrigger]);
  return (
    <Filter>
      <Calendar
        onChange={changeCalendarDate}
        formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
        selectRange
        // nextLabel={<NextIcon />}
        // prevLabel={<PrevIcon />}
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={false}
        calendarType="US"
        locale={lang !== '' ? lang : language}
        value={[new Date(moment(startDate).format('YYYY-MM-DD')), new Date(moment(endDate).format('YYYY-MM-DD'))]}
        defaultActiveStartDate={new Date()}
      />
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CalendarPicker date={date} onChange={(newDate) => setDate(newDate)} />
        </LocalizationProvider> */}
      <Box className="date">
        <label>
          <Box className="date-title">{t('TID02356')}</Box>
          <Box
            className="date-select
            "
          >
            <input
              type="date"
              className="date-start"
              value={moment(startDate).format('YYYY-MM-DD')}
              onChange={chnageStartDateInput}
            />
            <span>~</span>
            <input
              type="date"
              className="date-end"
              value={moment(endDate).format('YYYY-MM-DD')}
              onChange={chnageEndDateInput}
            />
          </Box>
        </label>
      </Box>
      <Box className="modality">
        <label>
          <Box className="modality-title">{t('TID00031')}</Box>
          <select onChange={handleChangeModality} ref={modalityRef}>
            <option value="" defaultValue={''}>
              {t('TID03029')}
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
        </label>
      </Box>
      <Box className="verify">
        <label>
          <Box className="verify-title">{t('TID02825')}</Box>
          <select onChange={handleChangeVerifyFlag} ref={VerifyRef}>
            <option value="" defaultValue={''}>
              {t('TID03029')}
            </option>
            <option value="0">{t('TID00019')}</option>
            <option value="1">{t('TID00020')}</option>
          </select>
        </label>
      </Box>
      <Box>
        <Button
          onClick={handleFilterSearch}
          sx={{
            // ml: '268px',
            borderRadius: '15px',
            color: 'white',
            bgcolor: 'black',
            ml: 2,
            mt: 3,
            width: '40%',
            height: '28px',
            size: 'small',
            fontSize: '11px',
          }}
          title={t('TID00021')}
        >
          {t('TID00021')}
          <ArrowCircleRightOutlinedIcon
            sx={{
              ml: '3px',
              color: '#a00000',
            }}
          />
        </Button>
        <Button
          onClick={handleSearchFilterReset}
          sx={{
            // ml: '268px'
            borderRadius: '15px',
            color: 'white',
            bgcolor: 'black',
            ml: 2,
            mt: 3,
            width: '40%',
            height: '28px',
            size: 'small',
            fontSize: '11px',
          }}
          title={t('TID02999')}
        >
          {t('TID02999')}
          <RestartAltIcon
            sx={{
              ml: '3px',
              color: '#a00000',
            }}
          />
        </Button>
      </Box>
    </Filter>
  );
};

export default WorklistLeftSeacrhBox;
