import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useCallback,useState,useLayoutEffect } from 'react';
import { SettingMenuModalCss } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupIcon from '@mui/icons-material/Group';
import { setShowUserInfoModalBool } from '@store/modal';
import { RootState } from '@store/index';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const AdminSettingMenuModal = () => {
  const path = useParams();
  const { t } = useTranslation();
  //  const dispatch = useDispatch();
  //  const { showUserInfoModalBool } = useSelector((state: RootState) => state.modal.modal);

  //  const showHangingProtocolModalButtonClick = useCallback(() => {
  //    dispatch(setShowUserInfoModalBool(!showUserInfoModalBool));
  //  }, [showUserInfoModalBool]);
  const [currentClickIconValue,setCurrentClickIconValue] = useState('userinfo')
  const IconButtonClick = useCallback((value:string)=> {
    setCurrentClickIconValue(value)
  },[])
  useLayoutEffect(()=> {
    if (String(path['*']) === "") {
      setCurrentClickIconValue('userinfo')  
    }else {
      setCurrentClickIconValue(String(path['*']))
    }
  },[])
  return (
    <SettingMenuModalCss>
      <Box className="Menuwrapper">
        <List>
          <ListItem disablePadding>
          <Link to='userinfo' style={{color:"white",textDecoration:"none"}}onClick={()=>IconButtonClick('userinfo')}>
            <ListItemButton>
              <ListItemIcon>
                <Box onClick={()=>IconButtonClick("userinfo")}>
                  <Box className={currentClickIconValue ==="userinfo" ? 'icon active' : 'icon'}>
                    <AssignmentIndIcon sx={{ color: '#a00000' }} />
                  </Box>
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('TID03142')} />
            </ListItemButton>
            </Link>
          </ListItem>
        </List>
        {/* <List>
          <ListItem disablePadding>
          <Link to='groupprivilege' style={{color:"white",textDecoration:"none"}}onClick={()=>IconButtonClick('groupprivilege')}>
            <ListItemButton>
              <ListItemIcon>
                <Box onClick={()=>IconButtonClick("groupprivilege")}>
                  <Box className={currentClickIconValue ==="groupprivilege" ? 'icon active' : 'icon'}>
                    <GroupIcon sx={{ color: '#a00000' }} />
                  </Box>
                </Box>
              </ListItemIcon>
              <ListItemText primary="그룹 권한 설정" />
            </ListItemButton>
            </Link>
          </ListItem>
        </List> */}
      </Box>
    </SettingMenuModalCss>
  );
};

export default AdminSettingMenuModal;
