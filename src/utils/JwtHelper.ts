import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DecryptAES256 from './DecryptAES256';
import { store } from '@store/index';
import { setAccessToken, setRefreshToken } from '@store/token';

const dispatch = (action: any) => {
  store.dispatch(action);
};
export const setAccess = (token: string) => {
  dispatch(setAccessToken({ accessToken: token }));
};
export const setRefresh = (token: string) => {
  dispatch(setRefreshToken({ refreshToken: token }));
};

const refresh = async ({ response }: any) => {
  // const {t} = useTranslation();
  axios.defaults.headers.common['x-refresh-token'] = localStorage.getItem('refreshToken')!;
  let json = null;
  try {
    json = await axios.get('/api/v1/auth/refresh', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
    });
  } catch (error: any) {
    const user_id = JSON.parse(localStorage.getItem('user') as string).USERID;
    json = error;
    if (json.response.data.message === 'No authorized!') {
      // alert(useTranslation().t('TID03065'));
      alert('로그인 시간이 만료되었습니다 다시 로그인 해주세요');
      const payload = {
        USERID: DecryptAES256(user_id),
      };
      try {
        axios.post('/api/v1/auth/logout', payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
      } catch (error) {
        console.error(error);
      }
      // localStorage.clear()
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.replace('/');
      return;
    }
    return json;
  }

  localStorage.setItem('accessToken', json.data.data.accessToken);
  setAccess(json.data.data.accessToken);
  // localStorage.setItem("expiredTime", res.data.data.expiredTime);
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + json.data.data.accessToken;
  let Retry = null;
  let jwtStatus = null;
  try {
    if (response.config.data !== undefined) {
      Retry = await axios({
        method: response.config.method,
        url: response.config.url,
        data: JSON.parse(response.config.data),
        headers: {
          Authorization: `Bearer ${json.data.data.accessToken}`,
        },
      });
    } else {
      Retry = await axios({
        method: response.config.method,
        url: response.config.url,
        headers: {
          Authorization: `Bearer ${json.data.data.accessToken}`,
        },
      });
    }
  } catch (error: any) {
    const user_id = JSON.parse(localStorage.getItem('user') as string).USERID;
    const payload = {
      USERID: DecryptAES256(user_id),
    };
    try {
      axios.post('/api/v1/auth/logout', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
    } catch (error) {
      console.error(error);
    }
    alert('INTERNAL SERVER ERROR: Please check Server');
    // localStorage.clear()
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.replace('/');

    return;
  }
  if (Retry !== null && Retry !== undefined) {
    jwtStatus = {
      message: 'Retry success',
      response: Retry,
    };
    return jwtStatus;
  }
};
const jwtUtil = async (error: any) => {
  // const {t} = useTranslation()
  if (error.response.data.message === 'jwt malformed' || error.response.data.message === 'non-existent user') {
    alert(useTranslation().t('TID03064'));
    // alert('다시 로그인 해주세요');
    const payload = {
      USERID: DecryptAES256(JSON.parse(localStorage.getItem('user')!).USERID),
    };
    try {
      axios.post('/api/v1/auth/logout', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
    } catch {
      console.error(error);
    }
    // localStorage.clear();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.replace('/');
    return;
  } else if (error.response.data.message === 'jwt expired') {
    const a = refresh(error);
    return a;
  } else if (error.response.data.message === 'Already exists') {
    //행잉프로토콜 추가 위한 예외처리
    alert(useTranslation().t('TID03066'));
    // alert(`해당 장비에 대한 설정은 이미 존재합니다\n해당 장비의 '레이아웃 수정' 을 원할 경우 목록에서 선택 후\n'레이아웃 수정'을 선택해주세요`)
  } else if (error.response.status === 500) {
    alert('INTERNAL SERVER ERROR: Please check Server');
  } else {
    return error;
  }
};
export class Call {
  async get(url: string) {
    let response = null;
    try {
      return await axios({
        method: 'get',
        url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.getState().token.accessToken,
        },
      }).then((res) => {
        response = res;
      });
    } catch (error) {
      const jwt = await jwtUtil(error);
      if (jwt.message === 'Retry success') {
        response = jwt.response;
        return;
      }
    } finally {
      return response;
    }
  }

  async post(url: string, payload: any, msg: string) {
    try {
      await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.getState().token.accessToken,
        },
      });
    } catch (error) {
      const jwt = await jwtUtil(error);
      if (jwt.message === 'Retry success') {
        return msg;
      }
    }
    return msg;
  }

  async put(url: string, payload: any, msg: string) {
    try {
      await axios.put(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.getState().token.accessToken,
        },
      });
    } catch (error) {
      const jwt = await jwtUtil(error);
      if (jwt.message === 'Retry success') {
        return msg;
      }
    }
    return msg;
  }

  async delete(url: string, msg: string) {
    try {
      await axios.delete(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.getState().token.accessToken,
        },
      });
    } catch (error) {
      const jwt = await jwtUtil(error);
      if (jwt.message === 'Retry success') {
        return msg;
      }
    }
    return msg;
  }
}

export { jwtUtil, refresh };
