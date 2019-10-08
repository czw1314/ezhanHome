import axios from 'axios';
import qs from 'qs';

axios.defaults.withCredentials = true;
const map = 'https://restapi.amap.com/v3/place/around';
const base = 'http://47.108.87.104:8501';
//加载高德地图
export const mapInformation = (params) =>
    axios.get(map, {params: params,}
    );
//获取手机验证码
export const getPhoneCode = (params) =>
    axios.get(`${base}/user/phoneCode`, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            params: params,
        }
    );
//注册
export const register = (params) =>
    axios.post(`${base}/user/register`, params, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//账号密码登陆
export const login = (params) =>
    axios.post(`${base}/user/login`, params, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//个人中心

//注册上传资料
export const agentRegister = (params) =>
    axios.post(`${base}/user/agentRegister`, params, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//上传图片
export const uploadFile = (params) =>
    axios.get(`${base}/user/agentRegister`, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取区域街道
export const getDistrictRegions = (params) =>
    axios.get(`${base}/dataList/districtRegions`, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取个人信息
export const getPersonMsg = (params) =>
    axios.get(`${base}/agent/personMsg`, {
            params: params,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//更新资料
export const putPersonMsg = (params) =>
    axios.put(`${base}/agent/personMsg`, params, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//修改密码
export const changeModifyPwd = (params) =>
    axios.post(`${base}/user/modifyPwd`, params, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取新房管理员列表
export const getAdmin = (params) =>
    axios.get(`${base}/super/admin`, {
            params: params,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//修改新房管理员密码
export const modifyHouseAdminPwd = (params) =>
    axios.post(`${base}/super/modifyHouseAdminPwd`, params, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取置业顾问未审核注册列表
export const getAdviser = (params) =>
    axios.get(`${base}/super/adviser`, {
            params,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//是否通过账号注册申请
export const aduitAgent = (params) =>
    axios.get(`${base}/super/aduitAgent`, {
            params,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取经纪人未审核注册列表
export const getAgent = (params) =>
    axios.get(`${base}/super/agent`, {
            params,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//楼盘审核通过
export const settledAduit = (params) =>
    axios.get(`${base}/super/settledAduit`, {
            params,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );

//删除经纪人、置业顾问
export const delUser = (params) =>
    axios.delete(`${base}/super/user`, {
            params,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//楼盘发布
export const estatePublished = (params) =>
    axios.post(`${base}/houseAdmin/estatePublished`, params,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取建筑类型
export const getBuildingTypes = (params) =>
    axios.get(`${base}/dataList/buildingTypes`,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取建筑结构
export const getBuildingStructures = (params) =>
    axios.get(`${base}/dataList/buildingStructures`,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取户型结构
export const getHousingStructures = (params) =>
    axios.get(`${base}/dataList/housingStructures`,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取物业类型
export const getPropertyTypes = (params) =>
    axios.get(`${base}/dataList/propertyTypes`,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取物业类型
export const getTraits= (params) =>
    axios.get(`${base}/dataList/traits`,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//获取物业权属
export const getHouseTypes= (params) =>
    axios.get(`${base}/dataList/houseTypes`,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//删除楼盘照片
export const delPhoto= (params) =>
    axios.delete(`${base}/estate/estatePhoto`,{
        params,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );
//删除指定户型图
export const delHousingPictures= (params) =>
    axios.delete(`${base}/estate/housingPictures`,{
            params,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }
    );