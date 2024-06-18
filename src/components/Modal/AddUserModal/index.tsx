import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddUserModalCss } from './styles';
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
import { setAddUserModalBool } from '@store/modal';
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

export const AddUserModal = () => {
  const call = new Call();
  const {t} = useTranslation()
  const dispatch = useDispatch<AppDispatch>();
  const { addUserModalBool } = useSelector((state: RootState) => state.modal.modal);

  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState('');
  const [crypt, setCrypt] = useState('');

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };

  const closeAddUserModalButton = useCallback(() => {
    dispatch(setAddUserModalBool(false));
  }, []);

  const AddUser = useCallback(async() => {
    const form = {
      userID: userID,
      username: userName,
      password,
      // crypt,
      groupName :group
    };

    if (form && form.userID && form.username && form.password) {
      await call.post(`/api/v1/account`, form,t('TID02712')).then((res) => {
        alert(res);
        closeAddUserModalButton();

        dispatch(userAction.getUserList());
      });
    } else {
      alert(t('TID02901'));
    }
  }, [userID, userName, password,crypt,group]);

  return (
    <Modal
      open={addUserModalBool}
      onClose={closeAddUserModalButton}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <AddUserModalCss>
        <Box
          className="AddUserTitle"
        >
          <PersonAddIcon sx={{ color: '#fff', marginRight: '10px'}}/>
          {t('TID03030')}
        </Box>
        <Box component="form" noValidate autoComplete="off">
          <Box sx={{ m: 2}}>
            <TextField
              required
              label="사용자 ID"
              variant="outlined"
              id="userID"
              onInput={(event: any) => {
                setUserID(event.target.value);
              }}
              InputProps={{
                style:{
                  backgroundColor:'#fff',
                  color: '#393939',
                  border: '1px solid #fff',
                }
              }}
              sx={{
                width:' 100%',  
                borderRadius: '10px'                     
              }}
            />
          </Box>
          <Box sx={{ m: 2 }}>
            <TextField
              required
              label="사용자 이름"
              variant="outlined"
              id="userName"
              onInput={(event: any) => {
                setUserName(event.target.value);
              }}
              InputProps={{
                style:{
                  backgroundColor:'#fff',
                  color: '#393939',
                  border: '1px solid #fff',
                }
              }}
              sx={{
                width:' 100%',
                borderRadius: '10px'                     
              }}
            />
          </Box>
          <Box sx={{ m: 2 }}>
            <TextField
              required
              label="비밀번호"
              variant="outlined"
              id="password"
              onInput={(event: any) => {
                setPassword(event.target.value);
              }}
              InputProps={{
                style:{
                  backgroundColor:'#fff',
                  color: '#393939',
                  border: '1px solid #fff',
                }
              }}
              sx={{
                width:' 100%',
                borderRadius: '10px'                
              }}
            />
          </Box>
          <Box
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
                >그룹 설정</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={group}
                label="그룹 설정"
                fullWidth
                onChange={(event: SelectChangeEvent) => setGroup(event.target.value)}
                sx={{width:'100%'}}
                inputProps={{
                  style :{
                    width : '100%',
                  }
                }}
              >
                <MenuItem value={'Admin'}>Admin</MenuItem>
                <MenuItem value={'Radiologist'}>Radiologist</MenuItem>                
                <MenuItem value={'Technician'}>Technician</MenuItem>                
                <MenuItem value={'Doctor'}>Doctor</MenuItem>                
                <MenuItem value={'etc'}>기타</MenuItem>                
              </Select>
            </FormControl>
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
                >암호화 방법</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={crypt}
                label="암호화 방법"
                autoWidth
                onChange={(event: SelectChangeEvent) => setCrypt(event.target.value)}
                sx={{width:'100%'}}
                inputProps={{
                  style :{
                    width : '100%',
                  }
                }}
              >
                <MenuItem value={''}>None</MenuItem>
                <MenuItem value={'sha256'}>sha256</MenuItem>                
              </Select>
            </FormControl>
          </Box> */}
        </Box>
        <Box
          className="AddUserButton"
        >
          <Button
            onClick={AddUser}
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
            {t('TID03030')}
            <AddIcon sx={{ color: '#a00000',marginTop:'2px', marginLeft: '5px', fontSize: '20px' }} />
          </Button>

          <Button
            onClick={closeAddUserModalButton}
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
            취소
            <CloseIcon sx={{ color: '#a00000',marginTop:'2px', marginLeft: '5px', fontSize: '20px' }} />
          </Button>
        </Box>
      </AddUserModalCss>
    </Modal>
  );
};
