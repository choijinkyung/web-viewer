import {
  Box,
  Button,
  createTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { UserInfoSettingCss } from './styles';
import AddIcon from '@mui/icons-material/Add';
import { setAddUserModalBool, setModifyUserModalBool } from '@store/modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@store/index';
import axios from 'axios';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import { userAction } from '@store/user';
import { AddUserModal } from '@components/Modal/AddUserModal';
import { RootState } from '@store/index';
import { ModifyUserModal } from '@components/Modal/ModifyUserModal';
import { Call } from '@utils/JwtHelper';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

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
      fullhd: 1281,
      desktop: 641,
      laptop: 361,
    },
  },
});

const UserInfoSetting = () => {
  const call = new Call();
  const {t} = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector((state: RootState) => state.user.userList);
  const [checkItems, setCheckItems] = useState<string[]>([]); //체크된 검사 리스트
  const { addUserModalBool, modifyUserModalBool } = useSelector((state: RootState) => state.modal.modal);

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };
  // 체크박스 단일 선택
  const handleSingleCheck = (checked: boolean, USERID: any) => {
    if (checked) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems((prev: any[]): any => [...prev, USERID]);
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(checkItems.filter((el: any) => el !== USERID));
    }
  };

  // 체크박스 전체 선택
  const handleAllCheck = (checked: any) => {
    if (checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      const rowData: any = [];
      userList.forEach((el: any) => rowData.push(el.USERID));
      setCheckItems(rowData);
    } else {
      // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
      setCheckItems([]);
    }
  };

  //사용자 수정 버튼
  const openModifyUserModal = useCallback(() => {
    if (checkItems.length === 0) {
      alert(t('TID02983'));
      return;
    } else if (checkItems.length > 1) {
      alert(t('TID02982'));
      return;
    }
    dispatch(setModifyUserModalBool(!modifyUserModalBool));
  }, [modifyUserModalBool, checkItems]);

  //사용자 추가 버튼
  //5.5는 시스매니져가 있어 추가는 뺌
  // const openAddUserModal = useCallback(() => {
  //   dispatch(setAddUserModalBool(!addUserModalBool));
  // }, [addUserModalBool]);

  const deleteUser = useCallback(async () => {
    if (checkItems.length === 0) {
      alert(t('TID02983'));
      return;
    } else if (checkItems.length > 1) {
      alert(t('TID02982'))
    }else {
      if (window.confirm(`${checkItems} ${t('TID03042')}`)) {
         await call.delete(`/api/v1/account/${checkItems}`, t('TID03043')).then((res) => {
           alert(res);

           dispatch(userAction.getUserList());
           setCheckItems(checkItems.filter((el: any) => el !== checkItems[0]));
         });
      } else {
        alert(t('TID03044'))
      }
      
     
    }
  }, [checkItems]);

  useEffect(() => {
    dispatch(userAction.getUserList());
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <UserInfoSettingCss>
        <Box className="tableBox">
          <TableContainer className="tablewrapper" component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '2%' }} align="center">
                    <input
                      type="checkbox"
                      name="select-all"
                      onChange={(e) => handleAllCheck(e.target.checked)}
                      // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                      checked={checkItems.length === userList.length ? true : false}
                    />
                  </TableCell>
                  <TableCell sx={{ width: '33%' }} align="center">
                    {t('TID02950')}
                  </TableCell>
                  <TableCell sx={{ width: '33%' }} align="center">
                  {t('TID02951')}
                  </TableCell>
                  {/* <TableCell sx={{ width: '32%' }} align="center">
                    그룹 아이디
                  </TableCell> */}
                  {/* <TableCell sx={{ width: '20%', overflow: 'auto' }} align="center">
                    저장 일시(UTC)
                  </TableCell>
                  <TableCell sx={{ width: '5%' }} align="center">
                    저장 사용자ID
                  </TableCell>
                  <TableCell sx={{ width: '20%' }} align="center">
                    갱신 일시(UTC)
                  </TableCell>
                  <TableCell sx={{ width: '7%' }} align="center">
                    갱신 사용자ID
                  </TableCell>
                  <TableCell sx={{ width: '20%' }} align="center">
                    삭제 일시(UTC)
                  </TableCell>
                  <TableCell sx={{ width: '7%' }} align="center">
                    삭제 사용자ID
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.map((row: any) => (
                  <TableRow key={row.USERID}>
                    <TableCell>
                      <input
                        type="checkbox"
                        name={`select-${row.USERID}`}
                        onChange={(e) => handleSingleCheck(e.target.checked, row.USERID)}
                        // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                        checked={checkItems.includes(row.USERID) ? true : false}
                      />
                    </TableCell>
                    <TableCell>{row.USERID}</TableCell>
                    <TableCell>{row.USERNAME}</TableCell>
                    {/* <TableCell>{row.GROUPID === 1100 ? "Admin" : row.GROUPID === 1200 ? 'Radiologist':row.GROUPID ===1300 ?'Technician' : row.GROUPID ===1500 ? 'Doctor' : 'etc' }</TableCell> */}
                    {/* <TableCell>{row.inserted ? moment(row.inserted).format('YYYY-MM-DD HH:mm'): ''}</TableCell>
                    <TableCell>{row.inserted_by}</TableCell>
                    <TableCell>{row.updated ? moment(row.updated).format('YYYY-MM-DD HH:mm'): ''}</TableCell>
                    <TableCell>{row.updated_by}</TableCell>
                    <TableCell>{row.deleted ? moment(row.deleted).format('YYYY-MM-DD HH:mm'): ''}</TableCell>
                    <TableCell>{row.deleted_by}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Box>
              <Button
                sx={{
                  borderRadius: '15px',
                  color: 'white',
                  bgcolor: '#000000',
                  marginRight: {
                    fourk: '20px',
                    fullhd: '20px',
                    desktop: '10px',
                  },
                  marginBottom: {
                    fourk: '30px',
                    fullhd: '30px',
                    desktop: '10px',
                  },
                  width: '120px',
                  height: '28px',
                  size: 'small',
                  fontSize: '11px',
                }}
                onClick={deleteUser}
              >
                <p style={{
                  width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                }}
              >
                {t('TID03032')}</p>
                <DeleteOutlineIcon sx={{ color: '#a00000', fontSize: '20px', ml: '5px' }} />
              </Button>
              <Button
                sx={{
                  borderRadius: '15px',
                  color: 'white',
                  bgcolor: '#000000',
                  marginRight: {
                    fourk: '20px',
                    fullhd: '20px',
                    desktop: '10px',
                  },
                  marginBottom: {
                    fourk: '30px',
                    fullhd: '30px',
                    desktop: '10px',
                  },
                  width: '120px',
                  height: '28px',
                  size: 'small',
                  fontSize: '11px',
                }}
                onClick={openModifyUserModal}
              ><p style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                }}
              >
                {t('TID03031')}</p>
                <AutoFixNormalIcon sx={{ color: '#a00000', fontSize: '20px', ml: '5px' }} />
              </Button>
              {/* <Button
                sx={{
                  borderRadius: '15px',
                  color: 'white',
                  bgcolor: '#000000',
                  marginRight: {
                    fourk: '20px',
                    fullhd: '20px',
                    desktop: '10px',
                  },
                  marginBottom: {
                    fourk: '30px',
                    fullhd: '30px',
                    desktop: '10px',
                  },
                  width: '120px',
                  height: '28px',
                  size: 'small',
                  fontSize: '11px',
                }}
                onClick={openAddUserModal}
              >
                {t('TID03030')}&nbsp;
                <AddIcon sx={{ color: '#a00000' }} />
              </Button> */}
            </Box>
          </Box>
        </Box>
        <AddUserModal />
        <ModifyUserModal props={ checkItems} />
      </UserInfoSettingCss>
    </ThemeProvider>
  );
};

export default UserInfoSetting;
