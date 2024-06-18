import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import DecryptAES256 from "./DecryptAES256";



function apiCall() {
  async function get(thunkName:string,url:string, header:any) {
    try {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + localStorage.getItem("accessToken");

      createAsyncThunk(thunkName, async (payload, { rejectWithValue }) => {
   
    return axios({
      method: 'get',
      url,
      headers: {
        header
      },
    })
      .then((res) => res.data)
      .catch((error) => rejectWithValue(error.res.data));
      })       
    
    } catch (err:any) {
      console.log("API call get err", err);
      if (
        err.response.data.message === "jwt malformed" ||
        err.response.data.message === "non-existent user"
      ) {
        alert("Please Log in Again!");
        const payload = {
          USERID: DecryptAES256(JSON.parse(localStorage.getItem("user")!).USERID)
        };

        axios
          .post("/api/v1/auth/logout", payload)
          .then(() => {
            // localStorage.clear();
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
          })
          .then(() => {
            window.location.replace('/');
          })
          .catch(err => {
            console.error(err);
          });
      } else if (err.response.data.message === "jwt expired") {
        refresh();
      }
      else if (err.response.status === 500) {
          alert('INTERNAL SERVER ERROR: Please check Server')
      }else {
        console.log(err);
      }
    }
  }
  async function post(url:string, payload:any, header:any) {
    try {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + localStorage.getItem("accessToken");

      const res = await axios.post(url, payload, header);
      return res;
    } catch (err:any) {
      console.log("API call post err", err);
      if (
        err.response.data.message === "jwt malformed" ||
        err.response.data.message === "non-existent user"
      ) {
        alert("Please Log in Again!");
        const payload = {
          USERID: DecryptAES256(JSON.parse(localStorage.getItem("user")!).USERID)
        };

        axios
          .post("/api/v1/auth/logout", payload)
          .then(() => {
            // localStorage.clear();
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
          })
          .then(() => {
            window.location.replace('/');
          })
          .catch(err => {
            console.error(err);
          });
      } else if (err.response.data.message === "jwt expired") {
        refresh();
      } else if (err.response.status === 500) {
        alert('INTERNAL SERVER ERROR: Please check Server')
      }
      else {
        console.log(err);
      }
    }
  }

  return {
    get: get,
    post: post
  };
}

async function refresh() {
  axios.defaults.headers.common["x-refresh-token"] = localStorage.getItem(
    "refreshToken"
  )!;
  await axios.get("/api/v1/auth/refresh").then(res => {
    localStorage.setItem("accessToken", res.data.data.accessToken);
    // localStorage.setItem("expiredTime", res.data.data.expiredTime);
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("accessToken");
  });
}

export default apiCall;
