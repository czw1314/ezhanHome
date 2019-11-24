import React from 'react';
import '../css/agentMy.scss';
import {getPersonMsg, getDistrictRegions, putPersonMsg,cancelWechat,getStreetEstates,settledInEstate,delcancelSettledInEstate} from '../api'
import {connect} from "react-redux";
import {newEstateId} from "../redux/action";
import {
    Tabs, Input, Button, Popconfirm, Upload, Icon, message, Checkbox,
    Select, Tag, Tooltip, Cascader, Modal
} from 'antd';
import ChangePassWords from '../component/changePassWord'

class AgentMy extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            loading1: false,
            imgUrl: '',
            imgUrl1: '',
            tags: ['Unremovable', 'Tag 2', 'Tag 3'],
            inputVisible: false,
            inputValue: '',
            userInformation: {},
            name: '',
            districtRegionsList: [],
            bussinessId: [],
            regionId: [],
            regionId1: [],
            regionId2: [],
            company: '',
            contact: '',
            workYears: '',
            agentType: '',
            position: '',
            weixinImg:'',
            weixin:{
                weChatName:'',
                weChatNumber:'',
                weChatAddr:'',
                weChatSex:''
            },                                                                                                                                                                                                                 
            plainOptions: [{label: '新房经纪', value: '新房经纪'}, {label: '二手房经纪', value: '二手房经纪'}, {
                label: '权证代办',
                value: '权证代办'
            }, {label: '贷款代办', value: '贷款代办'}, {label: '专车接送', value: '专车接送'}],

        }
    }

    //转化为base64
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    //限制大小
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
    }

    //头像上传
    headChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            let params = {
                userId: localStorage.getItem('userId')
            }
            getPersonMsg(params).then((res) => {
                if (res.data.code === 1) {
                    let regions = []
                    for (let i = 0; i < res.data.regions.length; i++) {
                        regions.push([res.data.regions[i].districtId, res.data.regions[i].streetId])
                    }
                    this.setState({
                        userInformation: res.data,
                        name: res.data.name,
                        regionId: regions[0] ? regions[0] : [],
                        regionId1: regions[1] ? regions[1] : [],
                        regionId2: regions[2] ? regions[2] : [],
                        position: res.data.position,
                        bussinessId: res.data.businesses,
                        workYears: res.data.workYears,
                        agentType: res.data.agentType,
                        company: res.data.company,
                        contact: res.data.contact,
                        tags:res.data.estates,
                        weixin:res.data.weChatPersonMsg
                    })
                }
            })
        }
    };
    //微信二维码上传
    weixinChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading1: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    Img: imageUrl,
                    loading1: false,
                }),
            );
        }
    };

    handleChange(value) {
        console.log(`selected ${value}`);
    }

    callback(key) {
        console.log(key);
    }

    //改名
    onChangeName(e) {
        this.setState({name: e.target.value});
    }

    //改电话
    onChangeContact(e) {
        this.setState({contact: e.target.value});
    }

    //区域选择
    onChange(checkedValues) {

        this.setState({
            regionId: checkedValues
        })
    }

    onChange1(checkedValues) {
        this.setState({
            regionId1: checkedValues
        })
    }

    onChange2(checkedValues) {
        this.setState({
            regionId2: checkedValues
        })
    }

    componentDidMount() {
        let params = {
            userId: localStorage.getItem('userId')
        }
        getPersonMsg(params).then((res) => {
            if (res.data.code === 1) {
                let regions = []
                for (let i = 0; i < res.data.regions.length; i++) {
                    regions.push([res.data.regions[i].districtId, res.data.regions[i].streetId])
                }
                this.setState({
                    userInformation: res.data,
                    name: res.data.name,
                    regionId: regions[0] ? regions[0] : [],
                    regionId1: regions[1] ? regions[1] : [],
                    regionId2: regions[2] ? regions[2] : [],
                    position: res.data.position,
                    bussinessId: res.data.businesses,
                    workYears: res.data.workYears,
                    agentType: res.data.agentType,
                    company: res.data.company,
                    contact: res.data.contact,
                    tags:res.data.estates,
                    bindWechatOrNot:res.data.bindWechatOrNot,
                    weixin:res.data.weChatPersonMsg?res.data.weChatPersonMsg:this.state.weixin
                })
            }
        })
        getDistrictRegions().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].name,
                        children: []
                    }
                    for (let j = 0; j < res.data.list[i].regions.length; j++) {
                        let items = {
                            value: res.data.list[i].regions[j].id,
                            label: res.data.list[i].regions[j].street,
                        }
                        item.children.push(items)
                    }
                    option.push(item)
                }

                this.setState({
                    districtRegionsList: option
                })
            }
        })
    }
        //选择区域
    setRegion(value) {
        this.setState({
            region: value
        })
        let params = {
            districtId: value[1]
        }
        getStreetEstates(params).then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.estates.length; i++) {
                    let item = {
                        value: res.data.estates[i].id,
                        label: res.data.estates[i].name,
                    }
                    option.push(item)
                }
                this.setState({
                    estates: option
                })
            }
        })
    }
    setEstates(value) {
        this.setState({
            estateId: value
        })
        let params = {
            estateId: value
        }
        this.props.newEstateId(value)
        localStorage.setItem('estateId',value)
    }
    //职称改变
    changePosition(e) {
        this.setState({
            position: e
        })
    }

    //工作年限
    changeWorkYears(e) {
        this.setState({workYears: e.target.value});
    }

    //公司
    changeCompany(e) {
        this.setState({company: e.target.value});
    }

    //服务选择
    bussinessIdChange(value) {
        this.setState({
            bussinessId: value
        })
    }

    //公司选择（独立经纪人）
    onAgentType(value) {
        this.setState({
            agentType: value
        })
    }

    onSubmit() {
        let re = []
        if (this.state.regionId) {
            re.push(this.state.regionId[1])
        }
        if (this.state.regionId1) {
            re.push(this.state.regionId1[1])
        }
        if (this.state.regionId2) {
            re.push(this.state.regionId2[1])
        }
        let params = {
            "name": this.state.name,
            "regionIds": re,
            "bussinessId": this.state.bussinessId,
            "workingYears": this.state.workingYears,
            "agentType": this.state.agentType,
            "company": this.state.company,
            "position": this.state.position,
            "contact": this.state.contact,
            "userId": localStorage.getItem('userId')
        }
        putPersonMsg(params).then((res) => {
            if (res.data.code === 1) {
                message.success('修改成功')
                let params = {
                    userId: localStorage.getItem('userId')
                }
                getPersonMsg(params).then((res) => {
                    if (res.data.code === 1) {
                        let regions = []
                        for (let i = 0; i < res.data.regions.length; i++) {
                            regions.push([res.data.regions[i].districtId, res.data.regions[i].streetId])
                        }
                        this.setState({
                            userInformation: res.data,
                            name: res.data.name,
                            regionId: regions[0] ? regions[0] : [],
                            regionId1: regions[1] ? regions[1] : [],
                            regionId2: regions[2] ? regions[2] : [],
                            position: res.data.position,
                            bussinessId: res.data.businesses,
                            workYears: res.data.workYears,
                            agentType: res.data.agentType,
                            company: res.data.company,
                            contact: res.data.contact,
                            
                        })
                    }
                })
            }
            else {
                message.error('修改失败')
            }
        })

    }

    //确认修改？
    showConfirm() {
        const {confirm} = Modal;
        const that = this
        confirm({
            title: '是否确认更新修改信息?',
            content: '',
            okText:"确认",
            cancelText:"取消",
            onOk: () => {
                this.onSubmit()
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
  //绑定微信
  bindWeixin(){
    window.location='https://open.weixin.qq.com/connect/qrconnect?appid=wx53ba91de253ea23a&redirect_uri=http%3A%2F%2Fwww.ezhanhome.com&response_type=code&scope=snsapi_login&state=bind#wechat_redirect'
}
//解绑微信
cancleWeixin(){
    let params={
        userId:localStorage.getItem('userId')
    }
    cancelWechat(params).then((res)=>{
        if(res.data.code===1){
            message.success('解绑成功')
            this.setState({
                bindWechatOrNot:false
            })
        }
    })
}
//申请入驻楼盘
apply(){
    let params={
        userId:localStorage.getItem('userId'),
        estateId:this.state. estateId

    }
    settledInEstate(params).then((res)=>{
        if(res.data.code==1){
            message.success('申请成功，等待管理员通过申请')
        }
    })
}
confirm(e) {
    message.success('Click on Yes');
  }
//取消关注楼盘
preventDefault(e) {
    console.log(e)
    let params={
        userId:localStorage.getItem('userId'),
        estateId:e.estateId

    }
    delcancelSettledInEstate(params).then((res)=>{
        if(res.data.code==1){
            message.success('成功取消入驻该楼盘')
        }
    })
  }
    render() {
        const {TabPane} = Tabs;
        const {imageUrl, imageUrl1} = this.state;
        const {Option} = Select;
        const {tags, inputVisible, inputValue} = this.state;
        const base = 'http://47.108.87.104:8601/user/';
        const updata = 'http://47.108.87.104:8501/user/uploadFile';
        return (
            <div className={'agentMy'}>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>经纪人中心</p>
                </div>
                <div className={'userBox'}>
                    <div className={'container'}>
                        <div className={'menu'}>
                            <img className={'headerPic'} src={base + this.state.userInformation.head}/>
                            <p>欢迎您，{this.state.userInformation.name}</p>
                            <p>账号：{localStorage.getItem('phone')}</p>
                        </div>
                        <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition={'left'}
                              tabBarStyle={{textAlign: 'center', marginRight: 20}}>
                            <TabPane tab="个人信息/微信绑定" key="1">
                                <p className={'data'}>个人资料/编辑</p>
                                <div className={'first'}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <img src={base + this.state.userInformation.head}
                                             className={'headerPic'}/>
                                        <Upload
                                            name={'file'}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            data={{
                                                type: '1',
                                                userId: localStorage.getItem('userId')
                                            }}
                                            showUploadList={false}
                                            action={updata}
                                            beforeUpload={this.beforeUpload}
                                            onChange={this.headChange.bind(this)}
                                        >
                                            <Button type="primary" size={'large'}> <Icon
                                                type={this.state.loading ? 'loading' : 'plus'}/>上传头像</Button>
                                        </Upload>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <img src={this.state.Img || base + this.state.userInformation.weChatQrCode}
                                             className={'headerPic'} style={{borderRadius: 0}}/>
                                        <Upload
                                            name="file"
                                            data={{
                                                type: '3',
                                                userId: localStorage.getItem('userId')
                                            }}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action={updata}
                                            beforeUpload={this.beforeUpload}
                                            onChange={this.weixinChange.bind(this)}
                                        >
                                            <Button type="primary" size={'large'}> <Icon
                                                type={this.state.loading1 ? 'loading' : 'plus'}/>更新微信二维码</Button>
                                        </Upload>
                                    </div>
                                </div>
                                <p style={{marginTop: '30px'}}>账号：{localStorage.getItem('phone')}</p>
                                <div className={'center'}>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>编辑姓名：</p>
                                            <Input value={this.state.name} onChange={this.onChangeName.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>服务区域：</p>
                                            <Cascader
                                                value={this.state.regionId}
                                                options={this.state.districtRegionsList}
                                                onChange={this.onChange.bind(this)}
                                                placeholder={'请选择区域'}
                                                size={'large'}
                                            />
                                            <Cascader
                                                value={this.state.regionId1}
                                                options={this.state.districtRegionsList}
                                                onChange={this.onChange1.bind(this)}
                                                placeholder={'请选择区域'}
                                                size={'large'}
                                            />
                                            <Cascader
                                                value={this.state.regionId2}
                                                options={this.state.districtRegionsList}
                                                onChange={this.onChange2.bind(this)}
                                                placeholder={'请选择区域'}
                                                size={'large'}
                                            />
                                        </div>
                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p dangerouslySetInnerHTML={{__html: '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp职称：'}}></p>
                                            <Select value={this.state.position} style={{width: 200}}
                                                    onChange={this.changePosition.bind(this)}>
                                                <Option value="房地产经纪人">房地产经纪人</Option>
                                                <Option value="房地产经纪人协理">房地产经纪人协理</Option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>选择服务：</p>
                                            <Checkbox.Group options={this.state.plainOptions}
                                                            value={this.state.bussinessId}
                                                            onChange={this.bussinessIdChange.bind(this)}/>
                                        </div>
                                    </div>

                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>从业年限：</p>
                                            <Input value={this.state.workYears}
                                                   onChange={this.changeWorkYears.bind(this)} addonAfter="年"/>
                                        </div>

                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>服务公司：</p>
                                            <Select value={this.state.agentType} onSelect={this.onAgentType.bind(this)}
                                                    size={'large'}>
                                                <Option value={2}>在职公司</Option>
                                                <Option value={1}>独立经纪人</Option>
                                            </Select>
                                            <Input disabled={this.state.agentType == 2 ? false : true} size={'large'}
                                                   value={this.state.company}
                                                   onChange={this.changeCompany.bind(this)}/>
                                        </div>

                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'} style={{textAlign: 'center'}}>
                                            <Button type="primary" style={{width: '200px'}} size={'large'}
                                                    onClick={this.showConfirm.bind(this)}>更新修改</Button>
                                        </div>

                                    </div>
                                </div>
                                <div className={'weixin'} style={{display:this.state.bindWechatOrNot?'block':'none'}}>
                                    <p className={'h2'} >微信绑定（已绑定）</p>
                                    <div className={'weixinBox'}>
                                        <img src={this.state.weixin.weChatHeadUrl}/>
                                        <p>微信昵称：{this.state.weixin.weChatName}<br></br>微信账号：{this.state.weixin.weChatNumber}
                                        </p>
                                        <p>地区：{this.state.weixin.weChatAddr}<br></br>性别：{this.state.weixin.weChatSex}
                                        </p>
                                        <Button type="primary" style={{marginLeft:'40px'}} size={'large'} onClick={this.cancleWeixin}>解除绑定</Button>
                                    </div>
                                </div>
                                <div className={'weixin'} style={{display:this.state.bindWechatOrNot?'none':'block'}}>
                                    <p className={'h2'}>微信绑定（未绑定）</p>
                                    <div className={'weixinBox'}>
                                        <Button type="primary" style={{marginLeft:'40px'}} size={'large'} onClick={this.bindWeixin}>微信绑定</Button>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="申请入住楼盘" key="2">
                                <p className={'data'} style={{marginBottom: '-20px'}}>入驻申请</p>
                                <div className={'item'}>
                                    <div className={'left'}>
                                        <p>选择入驻的楼盘：</p>
                                        <Cascader options={this.state.districtRegionsList} placeholder={''}
                                              onChange={this.setRegion.bind(this)} style={{width: 200}} className={'apply'}/>
                                    <Select style={{width: 200}} onChange={this.setEstates.bind(this)}>
                                        {this.state.estates && this.state.estates.map(item => {
                                                return (<Option value={item.value}>{item.label}</Option>)
                                            }
                                        )}
                                    </Select>
                                    </div>
                                    <Button type="primary" style={{marginLeft: '40px'}} size={'large'} onClick={this.apply.bind(this)}>确认申请</Button>
                                </div>
                                <p style={{marginTop: '20px'}}>已入驻的楼盘：</p>
                                {tags.map((tag, index) => {
                                    return  (
                                     <Tag key={index} closable onClose={this.preventDefault.bind(this,tag)}>
                                            {tag.estateName}
                                        </Tag>
                                      
                                    ) ;
                                })}
                            </TabPane>
                            <TabPane tab="经纪人协议" key="3">
                                <p className={'data'}>经纪人协议</p>
                                <ChangePassWords></ChangePassWords>
                            </TabPane>
                            <TabPane tab="修改密码" key="4">
                                <p className={'data'}>修改密码</p>
                                <ChangePassWords role={3}></ChangePassWords>
                            </TabPane>
                        </Tabs>
                    </div>

                </div>
            </div>
        )
    }

}

export default connect(state => (
    {estateId: state.estateId}), {newEstateId})(AgentMy)