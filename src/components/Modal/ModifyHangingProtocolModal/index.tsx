import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModifyHangingProtocolCss } from './styles';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { setModifyHangingProtocolModalBool } from '@store/modal';
import axios from 'axios';
import { hangingActions } from '@store/hanging';
import { AppDispatch } from '@store/index';
import { Call } from '@utils/JwtHelper';
import { RootState } from '@store/index';
import ConstructionIcon from '@mui/icons-material/Construction';
import Tune from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import DecryptAES256 from '@utils/DecryptAES256';

export const ModifyHangingProtocolModal = (props: any) => {
  const call = new Call();
  const {t} = useTranslation()
  const dispatch = useDispatch<AppDispatch>();
  const { modifyHangingProtocolModalBool } = useSelector((state: RootState) => state.modal.modal);
  const hanging = useSelector((state: RootState) => state.hanging.hangingProtocolList);
  const [modality, setModality] = useState(' ');
  const [seriesRows, setSeriesRows] = useState('');
  const [seriesColumns, setSeriesColumns] = useState('');
  const [imageRows, setImageRows] = useState('');
  const [imageColumns, setImageColumns] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };

  const closeModifyHangingProtocolModalButton = useCallback(() => {
    dispatch(setModifyHangingProtocolModalBool(false));
  }, []);

  const ModifyHangingProtocol = useCallback(async() => {
    if (modality === ' ') {
      alert (t('TID03038'))
      return;
    }
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    const user_id :any =DecryptAES256(userID)
    const form = {
      userID:user_id,
      Modality : modality,
      SeriesRows: Number(seriesRows),
      SeriesColumns: Number(seriesColumns),
      ImageRows: Number(imageRows),
      ImageColumns: Number(imageColumns),
    };
    if (confirm(`'${props.items[0].Modality}'${t('TID03071')}`))
    await call.put(`/api/v1/hanging`, form,t('TID02712')).then((res) => {
      alert(res);
      closeModifyHangingProtocolModalButton();


      dispatch(hangingActions.getHangingProtocolList(user_id));
      props.onCompleted(props.items[0]);
    });
  }, [modality, seriesRows, seriesColumns, imageRows, imageColumns]);

  useEffect(() => {
    if (modifyHangingProtocolModalBool && props.items !== undefined) {
      setModality(props.items[0].Modality);
      setSeriesRows(props.items[0].SeriesRows);
      setSeriesColumns(props.items[0].SeriesColumns);
      setImageRows(props.items[0].ImageRows);
      setImageColumns(props.items[0].ImageColumns);
    }
  }, [modifyHangingProtocolModalBool]);

  useEffect(()=> {
    const user_id = JSON.parse(localStorage.getItem('user') as string).USERID;
    const userID :any =DecryptAES256(user_id)
   if (!hanging.length)  {
    dispatch(hangingActions.getHangingProtocolList(userID));
   } 
  },[])

  return (
    <Modal
      open={modifyHangingProtocolModalBool}
      onClose={closeModifyHangingProtocolModalButton}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModifyHangingProtocolCss>
        <Box
          className="ModifyHangingProtocolModalTitle"
        >
          <Tune sx={{ color:'#fff', marginRight:'10px'}}/>
          {t('TID03023')} {t('TID00102')}
        </Box>
        <Box
          sx={{m: 2}}
        >
          <FormControl sx={{
                width:' 100%',
                borderRadius: '5px',
          }}>
            <TextField
              select
              id="demo-simple-select"
              variant="outlined"
              value={modality}
              className='select'
              fullWidth 
              onChange={(event: any) => setModality(event.target.value)}
              sx={{
                width:'100%',
                backgroundColor: '#393939',
                color: '#fff',
              '&:focus': {
                backgroundColor: '#393939',
              },
              '.MuiInputLabel-shrink' :{
                borderRadius: '0px'
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                  color:'white'
                },
              },
            }}
              inputProps={{
                style :{
                  width : '100%',
                }
              }}
              SelectProps={{
                MenuProps: {
                  color:'white',
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                  },
                  PaperProps : {
                    style: {
                      maxHeight: "200px",

                    },
                  },
                }
              }}
            >
              <MenuItem 
                value=" " 
              >
                <em>{t('TID00031')}</em>
              </MenuItem>
              <MenuItem value={'AS'}>AS</MenuItem>
              <MenuItem value={'AU'}>AU</MenuItem>
              <MenuItem value={'BI'}>BI</MenuItem>
              <MenuItem value={'CD'}>CD</MenuItem>
              <MenuItem value={'CF'}>CF</MenuItem>
              <MenuItem value={'CP'}>CP</MenuItem>
              <MenuItem value={'CR'}>CR</MenuItem>
              <MenuItem value={'CS'}>CS</MenuItem>
              <MenuItem value={'CT'}>CT</MenuItem>
              <MenuItem value={'DD'}>DD</MenuItem>
              <MenuItem value={'DF'}>DF</MenuItem>
              <MenuItem value={'DG'}>DG</MenuItem>
              <MenuItem value={'DM'}>DM</MenuItem>
              <MenuItem value={'DR'}>DR</MenuItem>
              <MenuItem value={'DS'}>DS</MenuItem>
              <MenuItem value={'DX'}>DX</MenuItem>
              <MenuItem value={'EC'}>EC</MenuItem>
              <MenuItem value={'ES'}>ES</MenuItem>
              <MenuItem value={'FA'}>FA</MenuItem>
              <MenuItem value={'FS'}>FS</MenuItem>
              <MenuItem value={'LS'}>LS</MenuItem>
              <MenuItem value={'LP'}>LP</MenuItem>
              <MenuItem value={'MA'}>MA</MenuItem>
              <MenuItem value={'MR'}>MR</MenuItem>
              <MenuItem value={'MS'}>MS</MenuItem>
              <MenuItem value={'NM'}>NM</MenuItem>
              <MenuItem value={'OT'}>OT</MenuItem>
              <MenuItem value={'PT'}>PT</MenuItem>
              <MenuItem value={'RF'}>RF</MenuItem>
              <MenuItem value={'RG'}>RG</MenuItem>
              <MenuItem value={'ST'}>ST</MenuItem>
              <MenuItem value={'TG'}>TG</MenuItem>
              <MenuItem value={'US'}>US</MenuItem>
              <MenuItem value={'VF'}>VF</MenuItem>
              <MenuItem value={'XA'}>XA</MenuItem>
            </TextField>
          </FormControl>
        </Box>
        <Box sx={{ m: 2 }}>
          <TextField
            required
            type={'number'}
            label={t('TID03099')}
            variant="outlined"
            id="seriesRows"
            value={seriesRows}
            inputProps={{ min:1, max :5 }}
            onInput={(event: any) => {
              setSeriesRows(event.target.value);
            }}
            InputProps={{
              style:{
                backgroundColor:'#393939',
                color: '#fff',
              }
            }}
            sx={{
              width:' 100%',
              borderRadius: '10px',
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
            }}
          />
        </Box>
        <Box sx={{ m: 2 }}>
          <TextField
            required
            type={'number'}
            label={t('TID03100')}
            variant="outlined"
            id="seriesColumns"
            value={seriesColumns}
            inputProps={{ min:1, max :5 }}
            onInput={(event: any) => {
              setSeriesColumns(event.target.value);
            }}
            InputProps={{
              style:{
                backgroundColor:'#393939',
                color: '#fff',
              }
            }}
            sx={{
              width:' 100%',
              borderRadius: '10px',
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
            }}
          />
        </Box>
        <Box
          className="ModifyHangingProtocolModalButton"
        >
        <Button
          onClick={ModifyHangingProtocol}
          sx={{
            borderRadius: '15px',
            color: 'white',
            bgcolor: '#000000',
            marginTop: '10px',
            marginRight: '15px',
            width: '120px',
            height: '28px',
            size: 'small',
            fontSize: '11px',
            border :'1px solid transparent',
            '&:hover': {
              transitionDelay: '0.1s',
              background: '#000000',
              border: '1px solid #a00000' 
           },
          }}
        >
          {t('TID02979')}
          <ConstructionIcon sx={{ color: '#a00000',marginTop:'2px', marginLeft: '5px', fontSize: '20px' }} />
        </Button>
        <Button
          onClick={closeModifyHangingProtocolModalButton}
          sx={{
            borderRadius: '15px',
            color: 'white',
            bgcolor: '#000000',
            marginTop: '10px',
            width: '120px',
            height: '28px',
            size: 'small',
            fontSize: '11px',
            border :'1px solid transparent',
            '&:hover': {
              transitionDelay: '0.1s',
              background: '#000000',
              border: '1px solid #a00000' 
           },
          }}
        >
          {t('TID00048')}
          <CloseIcon sx={{ color: '#a00000',marginTop:'2px', marginLeft: '5px', fontSize: '20px' }} />
        </Button>
        </Box>
      </ModifyHangingProtocolCss>
    </Modal>
  );
};
