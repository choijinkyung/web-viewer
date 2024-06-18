import { Box, Button, createTheme, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { HangingProtocolSettingCss } from './styles';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import { AddHangingProtocolModal } from '@components/Modal/AddHangingProtocolModal';
import { setAddHangingProtocolModalBool, setModifyHangingProtocolModalBool } from '@store/modal';
import { useDispatch, useSelector } from 'react-redux';
import { hangingActions } from '@store/hanging';
import { AppDispatch } from '@store/index';
import axios from 'axios';
import { ModifyHangingProtocolModal } from '@components/Modal/ModifyHangingProtocolModal';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import { Call } from '@utils/JwtHelper';
import { RootState } from '@store/index';
import { useTranslation } from 'react-i18next';
import DecryptAES256 from '@utils/DecryptAES256';

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
};

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      fourk: 1921,
      laptop: 361,
      fullhd: 1281,
      desktop: 641,
    },
  },
});

const HangingProtocolSetting = () => {
  const {t} = useTranslation();
  const call = new Call();
  const dispatch = useDispatch<AppDispatch>();
  const { addHangingProtocolModalBool, modifyHangingProtocolModalBool } = useSelector(
    (state: RootState) => state.modal.modal,
  );

  

  const hanging = useSelector((state: RootState) => state.hanging.hangingProtocolList);
  const [checkItems, setCheckItems] = useState<string[]>([]); //체크된 검사 리스트

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  };

  const openAddHangingProtocolModal = useCallback(() => {
    dispatch(setAddHangingProtocolModalBool(!addHangingProtocolModalBool));
  }, [addHangingProtocolModalBool]);

  const openModifyHangingProtocolModal = useCallback(() => {
    if (checkItems && checkItems.length===1) {
      dispatch(setModifyHangingProtocolModalBool(!modifyHangingProtocolModalBool));
    } else {
      alert(t('TID03045'));
    }    
   }, [modifyHangingProtocolModalBool,checkItems]);
  
  // 체크박스 단일 선택
  const handleSingleCheck = (checked: boolean, row: any) => {
    if (checked) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems((prev: any[]): any => [...prev, row]);
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(checkItems.filter((el: any) => el !== row));
    }
  };

  //modifiHanging에서 수정이 완료되었을때 발동하는 함수
  //checkItems 배열에서 선택된 아이템을 제외시키는 함수
  const CompletedItem = useCallback((Item : any)=> {
    setCheckItems(checkItems.filter((el: any) => el !== Item));
  },[])


  // 체크박스 전체 선택
  const handleAllCheck = (checked: any) => {
    if (checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      const rowData: any = [];
      hanging.forEach((el: any) => {rowData.push(el)});
      setCheckItems(rowData);
    } else {
      // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
      setCheckItems([]);
    }
  };

  const deleteHangingProtocol = useCallback(() => {
    const user_id = JSON.parse(localStorage.getItem('user') as string).USERID;
    const userID :any= DecryptAES256(user_id);
    if (confirm(t('TID03001'))) {
      checkItems.forEach(async(item:any) => {
        const modality = item.Modality;
        await call.delete(`/api/v1/hanging/${userID}/${modality}`,t('TID02708')).then((res) => {
          alert(res);
          dispatch(hangingActions.getHangingProtocolList(userID));
        });
      });
    }
  }, [checkItems]);

  useEffect(() => {
    const user_id = JSON.parse(localStorage.getItem('user') as string).USERID;
    const userID :any= DecryptAES256(user_id);
    dispatch(hangingActions.getHangingProtocolList(userID));
  }, []);

  return (
    <ThemeProvider theme={theme}>
    <HangingProtocolSettingCss>
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
                    checked={checkItems.length === hanging.length ? true : false}
                  />
                </TableCell>
                <TableCell>{t('TID00944')}</TableCell>
                <TableCell>{t('TID01922')}</TableCell>
                <TableCell>{t('TID01923')}</TableCell>
                {/* <TableCell>{t('TID01925')}</TableCell>
                <TableCell>{t('TID01924')}</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {hanging.map((row: any,i:number) => (
                <TableRow key={i}>
                  <TableCell>
                    <input
                      type="checkbox"
                      name={`select-${row.modality}`}
                      onChange={(e) => handleSingleCheck(e.target.checked, row)}
                      // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                      checked={checkItems.includes(row) ? true : false}
                    />
                  </TableCell>
                  <TableCell>{row.Modality}</TableCell>
                  <TableCell>{row.SeriesRows}</TableCell>
                  <TableCell>{row.SeriesColumns}</TableCell>
                  {/* <TableCell>{row.ImageRows}</TableCell>
                  <TableCell>{row.ImageColumns}</TableCell> */}
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
                  fourk : '20px',
                  fullhd : '20px',
                  desktop : '10px',
                },
                marginBottom: {
                  fourk: '30px',
                  fullhd : '30px',
                  desktop: '10px',
                },
                width: '120px',
                height: '28px',
                size: 'small',
                fontSize: '11px',
              }}
              onClick={deleteHangingProtocol}
            ><p style={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              }}
            >
              
              {t('TID00047')}</p>
              <DeleteOutlineIcon sx={{ color: '#a00000', fontSize: '20px', ml: '5px' }} />
            </Button>
            <Button
              sx={{
                borderRadius: '15px',
                color: 'white',
                bgcolor: '#000000',
                marginRight: {
                  fourk : '20px',
                  fullhd : '20px',
                  desktop : '10px',
                },
                marginBottom: {
                  fourk: '30px',
                  fullhd : '30px',
                  desktop: '10px',
                },
                width: '120px',
                height: '28px',
                size: 'small',
                fontSize: '11px',
              }}
              onClick={openModifyHangingProtocolModal}
            ><p style={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              }}
            >
              {t('TID00102')}</p>
              <AutoFixNormalIcon sx={{ color: '#a00000', fontSize: '20px', ml: '5px' }} />
            </Button>
            <Button
              sx={{
                borderRadius: '15px',
                color: 'white',
                bgcolor: '#000000',
                marginRight: {
                  fourk : '20px',
                  fullhd : '20px',
                  desktop : '10px',
                },
                marginBottom: {
                  fourk: '30px',
                  fullhd : '30px',
                  desktop: '10px',
                },
                width: '120px',
                height: '28px',
                size: 'small',
                fontSize: '11px',
              }}
              onClick={openAddHangingProtocolModal}
            ><p style={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              }}
            >
              {t('TID00063')}</p>
              <AddIcon sx={{ color: '#a00000', fontSize: '20px', ml: '5px' }} />
            </Button>
          </Box>
        </Box>
      </Box>
      <AddHangingProtocolModal />
      <ModifyHangingProtocolModal items={checkItems} onCompleted={CompletedItem}/>
    </HangingProtocolSettingCss>
    </ThemeProvider>
  );
};

export default HangingProtocolSetting;
