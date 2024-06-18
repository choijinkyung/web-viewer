import React, { ChangeEvent, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddHangingProtocolCss } from './styles';
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
import { setAddHangingProtocolModalBool } from '@store/modal';
import axios from 'axios';
import { hangingActions } from '@store/hanging';
import { AppDispatch } from '@store/index';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Call } from '@utils/JwtHelper';
import { RootState } from '@store/index';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js'
import DecryptAES256 from '@utils/DecryptAES256';

export const AddHangingProtocolModal = () => {
  const call = new Call();
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { addHangingProtocolModalBool } = useSelector((state: RootState) => state.modal.modal);
  const hanging = useSelector((state: RootState) => state.hanging.hangingProtocolList);

  const [modality, setModality] = useState(' ');
  const [seriesRows, setSeriesRows] = useState('1');
  const [seriesColumns, setSeriesColumns] = useState('1');
  const [imageRows, setImageRows] = useState('1');
  const [imageColumns, setImageColumns] = useState('1');

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };

  const closeAddHangingProtocolModalButton = useCallback(() => {
    setModality(' ');
    setSeriesColumns('1');
    setSeriesRows('1');
    setImageColumns('1');
    setSeriesRows('1');
    dispatch(setAddHangingProtocolModalBool(false));
  }, []);

  const AddHangingProtocolButton = useCallback(async () => {
    const userID = JSON.parse(localStorage.getItem('user') as string).USERID;
    const ListCheck = hanging.filter((v:any)=> {
      if (v.Modality === modality) {
        return true
      }else {
        return false
      }
    })
    if (modality === ' ') {
      alert (t('TID03038'))
      return;
    }
    if (ListCheck.length) {
      if (confirm(t('TID03150'))) {
      }else {
        closeAddHangingProtocolModalButton();
        return;
      }
    }
    const form = {
      userID : DecryptAES256(userID),
      Modality:modality,
      SeriesRows: seriesRows,
      SeriesColumns: seriesColumns,
      ImageRows: imageRows,
      ImageColumns: imageColumns,
    };
    await call.post(`/api/v1/hanging`, form, t('TID02712')).then((res) => {
      alert(res);
      closeAddHangingProtocolModalButton();
      location.reload()
  
      // dispatch(hangingActions.getHangingProtocolList(userID));
    }).catch((error)=> {
      dispatch(setAddHangingProtocolModalBool(false));
    })
  }, [hanging,modality, seriesRows, seriesColumns, imageRows, imageColumns]);

  return (
    <Modal
      open={addHangingProtocolModalBool}
      onClose={closeAddHangingProtocolModalButton}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <AddHangingProtocolCss>
        <Box
          className="AddHangingProtocolModalTitle"
        >
          <PlaylistAddIcon sx={{ color: '#fff', marginRight: '10px'}}/>
          {t('TID03023')} {t('TID00947')}
        </Box>
        <Box
          sx={{
            m: 2,
            width: 'calc(100% - 32px)',
            position :'relative'
          }}
        >
          <FormControl sx={{
                width:' 100%',
                borderRadius: '5px',
                color:'white'
              }}>
            <TextField
              select
              variant="outlined"
              id="demo-simple-select"
              className="select"
              value={modality}
              // label={t('TID00031')}
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
                  color :'white'
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
                {t('TID00031')}
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
              autoComplete:'off',
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
            inputProps={{ min:1, max :5 }}
            value={seriesColumns}
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
          className="AddHangingProtocolModalButton"
        >
          <Button
            onClick={AddHangingProtocolButton}
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
            {t('TID00063')}
            <AddIcon sx={{ color: '#a00000',marginTop:'2px', marginLeft: '5px', fontSize: '20px' }} />
          </Button>
          <Button
            onClick={closeAddHangingProtocolModalButton}
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
      </AddHangingProtocolCss>
    </Modal>
  );
};
