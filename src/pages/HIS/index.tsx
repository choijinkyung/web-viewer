import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Call } from '@utils/JwtHelper';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { pagingNumAction, patientIDAction, startDateAction } from '@store/filter';
import { setWorklistArrChange, worklistActions } from '@store/worklist';
import { AppDispatch } from '@store/index';
import { useTranslation } from 'react-i18next';
const HIS = () => {
  const call = new Call();
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { patient_id, access_number } = useParams();

  function logic(value: any) {
    if (value !== undefined && value !== null && value !== '') {
      return true;
    } else {
      return false;
    }
  }
  async function getSeriesList(pID: any, accessNumber: any) {
    try {
      let seriesList = await call
        .get(`/api/v1/worklists/patient-id/${pID}/access-number/${accessNumber}`)
        .then(({ data }) => {
          navigate(`/pacs/viewer/${data.studyKey}/${data.studyInsUID}/${patient_id}`);
        });
    } catch (error) {
      console.log(error);
    }
  }
  
  async function worklistArrAdd(payload:any) {
    await call.get(`/api/v1/worklists?pID=${payload.params.patient_id}&pName=${payload.params.patient_name}&reportStatus=${payload.params.reading_status}&startDate=${payload.params.start_date}&endDate=${payload.params.end_date}&modality=${payload.params.modality}&verifyFlag=${payload.params.verify_flag}&pagingNum=${payload.params.pagingNum}&limit=${payload.params.limit}`).then(({data})=> {
      dispatch(setWorklistArrChange(data))
    })
  }
  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    };
    if (logic(patient_id) && logic(access_number)) {
      getSeriesList(patient_id, access_number);
    } else if (logic(patient_id) && !logic(access_number)) {
      const payload = {
        params: {
          patient_id,
          patient_name: '',
          reading_status: '',
          modality: '',
          verify_flag: '',
          start_date: '1990-01-01',
          end_date: moment().format('YYYY-MM-DD'),
          pagingNum: 0,
          limit : 10
        },
        headers,
      };
      sessionStorage.setItem('search', JSON.stringify(payload.params));
      dispatch(pagingNumAction(0));
      dispatch(patientIDAction(patient_id))
      // dispatch(worklistActions.fetchWorklist(payload));
      worklistArrAdd(payload)
      dispatch(startDateAction(moment().subtract(7, 'd').format('YYYY-MM-DD')));
      navigate('/pacs/worklist');
    } else if (!logic(patient_id) && !logic(access_number)) {
      alert(t('TID03059'));
      // window.history.back();
      navigate('/pacs/worklist');
    }
  }, []);

  return <></>;
};

export default HIS;
