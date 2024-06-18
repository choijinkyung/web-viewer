import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModifyGroupPrivilegeCss } from './styles';
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

export const ModifyGroupPrivilege = (checkItems: any) => {
  const call = new Call();
  const {t} = useTranslation()
  const dispatch = useDispatch<AppDispatch>();
  const { modifyUserModalBool } = useSelector((state: RootState) => state.modal.modal);

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [crypt, setCrypt] = useState('');

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
      user_name: userName,
      password,
      crypt,
    };
    if (form && form.user_name && form.password) {
      await call.put(`/api/v1/user/${checkItems.props}`, form, t('TID03070')).then((res) => {
        alert(res);
        closeModifyUserModalButton();

        dispatch(userAction.getUserList());
      });
    } else {
      alert(t('TID02901'));
    }
  }, [userName, password, crypt]);

  return (
    <Modal
      open={modifyUserModalBool}
      onClose={closeModifyUserModalButton}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModifyGroupPrivilegeCss>
        <Box className="ModifyUserTitle">
          <PersonAddIcon sx={{ color: '#fff', marginRight: '10px' }} />
          그룹 수정
        </Box>
        <Box component="form" noValidate autoComplete="off">
          <Box sx={{ m: 2 }}>
            <TextField
              required
              label="그룹 이름"
              variant="outlined"
              id="userName"
              onInput={(event: any) => {
                setUserName(event.target.value);
              }}
              InputProps={{
                style: {
                  backgroundColor: '#fff',
                  color: '#393939',
                  border: '1px solid #fff',
                },
              }}
              sx={{
                width: ' 100%',
                borderRadius: '10px',
              }}
            />
          </Box>
          <Box sx={{ m: 2 }}>
            <TextField
              required
              type="password"
              label="그룹 설명"
              variant="outlined"
              id="password"
              onInput={(event: any) => {
                setPassword(event.target.value);
              }}
              InputProps={{
                style: {
                  backgroundColor: '#fff',
                  color: '#393939',
                  border: '1px solid #fff',
                },
              }}
              sx={{
                width: ' 100%',
                borderRadius: '10px',
              }}
            />
          </Box>
          <Box sx={{ m: 2 }}>
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
          </Box>
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
            수정
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
            취소
            <CloseIcon sx={{ color: '#a00000', marginTop: '2px', marginLeft: '5px', fontSize: '20px' }} />
          </Button>
        </Box>
      </ModifyGroupPrivilegeCss>
    </Modal>
  );
};
