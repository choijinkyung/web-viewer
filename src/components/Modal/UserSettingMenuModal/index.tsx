import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useCallback,useState,useEffect,useLayoutEffect } from 'react';
import { SettingMenuModalCss } from './styles';
import AppsIcon from '@mui/icons-material/Apps';
import LanguageIcon from '@mui/icons-material/Language';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useDispatch, useSelector } from 'react-redux';
import { setShowHangingProtocolModalBool } from '@store/modal';
import { RootState } from '@store/index';
import NotesIcon from '@mui/icons-material/Notes';
import ListIcon from '@mui/icons-material/List';
import {useTranslation} from 'react-i18next'
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

const UserSettingMenuModal = () => {
  const path = useParams();
  const {t} = useTranslation()
  //  const dispatch = useDispatch();
  // const { showHangingProtocolModalBool } = useSelector((state: RootState) => state.modal.modal);
  
  //  const showHangingProtocolModalButtonClick = useCallback(() => {
  //    dispatch(setShowHangingProtocolModalBool(!showHangingProtocolModalBool));
  //  }, [showHangingProtocolModalBool]);
  const [currentClickIconValue,setCurrentClickIconValue] = useState('worklist')
  const IconButtonClick = useCallback((value:string)=> {
    setCurrentClickIconValue(value)
  },[path])
  useLayoutEffect(()=> {
    if (String(path['*']) === "") {
      setCurrentClickIconValue('worklist')
    }else {
      setCurrentClickIconValue(String(path['*']))
    }
  },[])
  return (
    <SettingMenuModalCss>
      <Box className="Menuwrapper">
      <List>
          <ListItem disablePadding>
            <Link to='worklist' style={{color:"white",textDecoration:"none"}} onClick={()=>IconButtonClick('worklist')}>
            <ListItemButton>
              <ListItemIcon>
                <Box>
                  <Box className={currentClickIconValue ==="worklist" ? 'icon active' : 'icon'}>
                    <ListIcon sx={{ color: '#a00000' }} />
                  </Box>
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('TID00009')} />
            </ListItemButton>
            </Link>
          </ListItem>
        </List>
        <List>
          <ListItem disablePadding>
            <Link to='language' style={{color:"white",textDecoration:"none"}}onClick={()=>IconButtonClick('language')}>
            <ListItemButton>
              <ListItemIcon>
                <Box>
                  <Box className={currentClickIconValue ==="language" ? 'icon active' : 'icon'}>
                    <LanguageIcon sx={{ color: '#a00000',fontSize:"30" }} />
                  </Box>
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('TID01540')} />
            </ListItemButton>
            </Link>
          </ListItem>
        </List>
        <List>
          <ListItem disablePadding>
            <Link to='Tool' style={{color:"white",textDecoration:"none"}}onClick={()=>IconButtonClick('Tool')}>
            <ListItemButton>
              <ListItemIcon>
                <Box>
                  <Box className={currentClickIconValue ==="Tool" ? 'icon active' : 'icon'}>
                    <HandymanIcon sx={{ color: '#a00000',fontSize:"30" }} />
                  </Box>
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('TID01667')} />
            </ListItemButton>
            </Link>
          </ListItem>
        </List>
        <List>
          <ListItem disablePadding>
            <Link to='hanging' style={{color:"white",textDecoration:"none"}} onClick={()=>IconButtonClick('hanging')}>
            <ListItemButton>
              <ListItemIcon>
                <Box>
                  <Box className={currentClickIconValue ==="hanging" ? 'icon active' : 'icon'}>
                    <AppsIcon sx={{ color: '#a00000' }} />
                  </Box>
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('TID03023')} />
            </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Box>
    </SettingMenuModalCss>
  );
};

export default UserSettingMenuModal;
