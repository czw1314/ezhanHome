import axios from 'axios';
import qs from 'qs';
axios.defaults.withCredentials=true;
const map = 'https://restapi.amap.com/v3/place/around';
const base='http://47.108.87.104:8501';
//加载高德地图
export const mapInformation = (params) =>
    axios.get(map, {params: params,}
    );
//获取手机验证码
export const getPhoneCode = (params) =>
    axios.get(`${base}/user/phoneCode`,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        params: params,
        }
    );
//注册
export const register = (params) =>
    axios.post(`${base}/user/register`, params,{
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        }
    );
//账号密码登陆
export const login = (params) =>
    axios.post(`${base}/user/login`, params,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//个人中心
export const personMsg = (params) =>
    axios.get(`${base}/agent/personMsg`,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//注册上传资料
export const agentRegister = (params) =>
    axios.get(`${base}/user/agentRegister`,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );