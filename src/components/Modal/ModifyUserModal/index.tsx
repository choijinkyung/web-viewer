import React, { useCallback, useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModifyUserModalCss } from './styles';
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
import { setModifyUserModalBool } from '@store/modal';
import axios from 'axios';
import { AppDispatch } from '@store/index';
import { userAction } from '@store/user';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { RootState } from '@store/index';
import { Call } from '@utils/JwtHelper';
import sha256 from 'sha256';
import { useTranslation } from 'react-i18next';

export const ModifyUserModal = (checkItems: any) => {
  const call = new Call();
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { modifyUserModalBool } = useSelector((state: RootState) => state.modal.modal);
  const userList = useSelector((state: RootState) => state.user.userList);

  
  const [OriginalUserName,SetOriginalUserName] = useState('')
  const [OriginalGroup,SetOriginalGroup] = useState('')
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [crypt, setCrypt] = useState('');
  const [group, setGroup] = useState('');
  const [userID,setUserID] = useState('')

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };

  const closeModifyUserModalButton = useCallback(() => {
    dispatch(setModifyUserModalBool(false));
  }, []);

  const ModifyUserButton = useCallback(async () => {
    const form = {
      userID,
      username: userName,
      now_password:password,
      // groupID:group,
    };
      if (form && form.username && form.now_password) {
        if (confirm(`'${userID}'${t('TID03072')}`)) {
          await call.put(`/api/v1/account/user-info`, form, t('TID03070')).then((res) => {
            alert(res);
            closeModifyUserModalButton();
            
            dispatch(userAction.getUserList());
        });
        }
      } else {
        alert(t('TID02901'));
      }
  }, [userName, password, crypt,userID,userID]);

  useEffect(()=> {
    if (userList) {
      const value :any = userList.find((v:any)=> v.USERID === checkItems.props[0])
      if (value) {
        let groupCase = null;
        switch (value.GROUPID) {
          case 1100 :
            groupCase = 'Admin';
            break;
          case 1200:
            groupCase = 'Radiologist';
            break;
          case 1300:
            groupCase = 'Technician';
            break;
          case 1500:
            groupCase = 'Doctor';
            break;
          default :
            groupCase = 'etc';
        }
        setGroup(groupCase)
        SetOriginalGroup(groupCase)
        setUserName(value.USERNAME)
        SetOriginalGroup(value.USERNAME)
        setUserID(value.USERID)
      }
    }
  },[checkItems])

  return (
    <Modal
      open={modifyUserModalBool}
      onClose={closeModifyUserModalButton}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModifyUserModalCss>
        <Box className="ModifyUserTitle">
          <PersonAddIcon sx={{ color: '#fff', marginRight: '10px' }} />
          {t('TID03031')}
        </Box>
        <Box component="form" noValidate autoComplete="off">
          <Box sx={{ m: 2 }}>
            <TextField
              required
              label={t('TID02951')}
              variant="outlined"
              id="userName"
              value={userName}
              onInput={(event: any) => {
                setUserName(event.target.value);
              }}
              InputProps={{
                style:{
                  backgroundColor:'#393939',
                  color: '#fff',
                }
              }}
              sx={{
                width: ' 100%',
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
              type="password"
              label={t('TID00003')}
              variant="outlined"
              id="password"
              autoComplete='off'
              onInput={(event: any) => {
                setPassword(event.target.value);
              }}
              InputProps={{
                autoComplete:'off',
                style:{
                  backgroundColor:'#393939',
                  color: '#fff',
                }
              }}
              sx={{
                width: ' 100%',
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
          {/* <Box
            sx={{m: 2}}
          >
            <FormControl 
              sx={{ 
                width:' 100%',
                borderRadius: '5px',
                backgroundColor: '#fff',
                border: '1px solid #fff'    
                }}>
              <InputLabel 
                id="demo-simple-select-label"
                sx={{width:'100%'}}
                >{t('TID02953')}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={group}
                label={t('TID02953')}
                fullWidth
                onChange={(event: SelectChangeEvent) => setGroup(event.target.value)}
                sx={{width:'100%'}}
                inputProps={{
                  style :{
                    width : '100%',
                  }
                }}
              >
                <MenuItem value={'1100'}>Admin</MenuItem>
                <MenuItem value={'1200'}>Radiologist</MenuItem>                
                <MenuItem value={'1300'}>Technician</MenuItem>                
                <MenuItem value={'1500'}>Doctor</MenuItem>                
                <MenuItem value={'etc'}>{t('TID01752')}</MenuItem>                
              </Select>
            </FormControl>
          </Box> */}
          {/* <Box sx={{ m: 2 }}>
            <FormControl
              sx={{
                width: ' 100%',
                borderRadius: '5px',
                backgroundColor: '#fff',
                border: '1px solid #fff',
              }}
            >
              <InputLabel id="demo-simple-select-label" sx={{ width: '100%' }}>
                암호화 방법
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={crypt}
                label="암호화 방법"
                autoWidth
                onChange={(event: SelectChangeEvent) => setCrypt(event.target.value)}
                sx={{ width: '100%' }}
                inputProps={{
                  style: {
                    width: '100%',
                  },
                }}
              >
                <MenuItem value={''}>None</MenuItem>
                <MenuItem value={'sha256'}>sha256</MenuItem>
              </Select>
            </FormControl>
          </Box> */}
        </Box>
        <Box className="ModifyUserButton">
          <Button
            onClick={ModifyUserButton}
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
              border: '1px solid transparent',
              '&:hover': {
                transitionDelay: '0.1s',
                background: '#000000',
                border: '1px solid #a00000',
              },
            }}
          >
            {t('TID00102')}
            <AddIcon sx={{ color: '#a00000', marginTop: '2px', marginLeft: '5px', fontSize: '20px' }} />
          </Button>

          <Button
            onClick={closeModifyUserModalButton}
            sx={{
              borderRadius: '15px',
              color: 'white',
              bgcolor: '#000000',
              marginTop: '10px',
              width: '120px',
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
          >
            {t('TID00048')}
            <CloseIcon sx={{ color: '#a00000', marginTop: '2px', marginLeft: '5px', fontSize: '20px' }} />
          </Button>
        </Box>
      </ModifyUserModalCss>
    </Modal>
  );
};
