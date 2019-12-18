import React from 'react';
import '../css/consultant.scss';
import {connect} from "react-redux";
import {newEstateId} from "../redux/action";
import { Tabs,Input,Button,Cascader,Upload, Icon, message,Checkbox,
    Select,Tag,Tooltip,} from 'antd';
import {getPersonMsg, putPersonMsg,cancelWechat,getDistrictRegions,getStreetEstates,settledInEstate,delcancelSettledInEstate,searchEstate} from '../api'
import {Modal} from "antd/lib/index";
import ChangePassWord from '../component/changePassWord'
//上传头像


class Consultant extends React.Component {
    constructor(props){
        super(props)
        this.state={
            loading: false,
            loading1: false,
            name:'',
            contact:'',
            company:"",
            districtRegionsList: [],
            tags: [],
            inputVisible: false,
            inputValue: '',
            head:'',
            weixinImg:'',
            weixin:{
                weChatName:'',
                weChatNumber:'',
                weChatAddr:'',
                weChatSex:'',
                weChatHeadUrl:''
            },  
        }
    }
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
    //设置楼盘id
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
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            let params = {
                userId: localStorage.getItem('userId')
            }
            getPersonMsg(params).then((res) => {
                if (res.data.code === 1) {
                    this.setState({
                        head:res.data.head,
                        loading:false,
                        name: res.data.name,
                        position: res.data.position,
                        bussinessId: res.data.businesses,
                        workYears: res.data.workYears,
                        agentType: res.data.agentType,
                        company: res.data.company,
                        contact: res.data.contact,
                        userInformation: res.data,
                        weixinImg:res.data.weChatQrCode,
                    })
                }
            })
        }
    };
    //微信二维码上传
    handleChange1 = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading1: true });
            return;
        }
        if (info.file.status === 'done') {
            let params = {
                userId: localStorage.getItem('userId')
            }
            // Get this url from response in real world.
            getPersonMsg(params).then((res) => {
                if (res.data.code === 1) {
                    this.setState({
                        head:res.data.head,
                        name: res.data.name,
                        position: res.data.position,
                        bussinessId: res.data.businesses,
                        workYears: res.data.workYears,
                        agentType: res.data.agentType,
                        company: res.data.company,
                        contact: res.data.contact,
                        userInformation: res.data,
                        weixinImg:res.data.weChatQrCode,
                        loading1:false
                    })
                }
            })
        }
    };
    handleChange(value) {
        console.log(`selected ${value}`);
    }

    callback(key) {
        console.log(key);
    }
    //电话
    onChangeContact(e) {
        this.setState({contact: e.target.value});
    }
    //姓名
    onChangeName(e) {
        this.setState({name: e.target.value});
    }
    //公司
    onChangeCompany(e) {
        this.setState({company: e.target.value});
    }
    componentDidMount(){
        let params = {
            userId: localStorage.getItem('userId')
        }
        getPersonMsg(params).then((res) => {
            if (res.data.code === 1) {
                this.setState({
                    head:res.data.head,
                    name: res.data.name,
                    position: res.data.position,
                    bussinessId: res.data.businesses,
                    workYears: res.data.workYears,
                    agentType: res.data.agentType,
                    company: res.data.company,
                    contact: res.data.contact,
                    userInformation: res.data,
                    bindWechatOrNot:res.data.bindWechatOrNot,
                    weixinImg:res.data.weChatQrCode,
                    weixin:res.data.weChatPersonMsg?res.data.weChatPersonMsg:this.state.weixin,
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
        let params2={
            area:[],
            housingTypes:[],
            orderType:0,
            prices:[],
            traitIds:[],
            districtIds: [],
            streetId:[],
            searchText:'',
        }
        searchEstate(params2).then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.estates.length; i++) {
                    let item = {
                        value: res.data.estates[i].id,
                        label: res.data.estates[i].name,
                        url:'http://47.108.87.104:8601/show/downloadPaper?estateId='+res.data.estates[i].id
                    }
                    option.push(item)
                }
                this.setState({
                    estates: option
                })
            }
        })
    }
    onSubmit() {
        let params = {
            "name": this.state.name,
            "company": this.state.company,
            "userId": localStorage.getItem('userId')
        }
        for(var key in params){
            if(!params[key]){
                message.error('所有信息必填')
                return;
            }
        }
        putPersonMsg(params).then((res) => {
            if (res.data.code === 1) {
                message.success('修改成功')
                let params = {
                    userId: localStorage.getItem('userId')
                }
                getPersonMsg(params).then((res) => {
                    if(res.data.code==1){
                        this.setState({
                            name: res.data.name,
                            head:res.data.head,
                            weixinImg:res.data.weChatQrCode,
                            weixin:res.data.weChatPersonMsg?res.data.weChatPersonMsg:this.state.weixin,
                            company: res.data.company,
                            contact: res.data.contact,
                            tags:res.data.estates,
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
            cancelText:'取消',
            okText:'确定',
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
        //确认修改？
        showConfirm1() {
            const {confirm} = Modal;
            const that = this
            confirm({
                title: '是否确认申请入驻?',
                content: '',
                okText:"确认",
                cancelText:"取消",
                onOk: () => {
                    this.apply()
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        showConfirm2(e,tag,index) {
            const {confirm} = Modal;
            e.preventDefault();
            const that = this
            confirm({
                title: '确认退出该楼盘?',
                content: '',
                okText:"确认",
                cancelText:"取消",
                onOk: () => {
                    this.state.tags.splice(index, 1)
                    this.setState({tags:this.state.tags})
                    this.preventDefault(tag)
                },
                onCancel:()=> {
                },
            });
        }
    render(){
        const { TabPane } = Tabs;
        const { imageUrl,imageUrl1 } = this.state;
        const { Option } = Select;
        const { tags, inputVisible, inputValue } = this.state;
        const base = 'http://47.108.87.104:8601/user/';
        const updata = 'http://47.108.87.104:8501/user/uploadFile';
        console.log(this.state.weixinImg)
        return(
            <div className={'consultant'}>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>置业顾问中心</p>
                </div>
                <div className={'userBox'}>
                    <div className={'container'}>
                        <div className={'menu'}>
                            <img className={'headerPic'} src={base + this.state.head}/>
                            <p>欢迎您，{this.state.name}</p>
                            {/* <p>账号：{localStorage.getItem('phone')}</p> */}
                        </div>
                        <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition={'left'} tabBarStyle={{textAlign:'center',marginRight:20}}>
                            <TabPane tab="个人信息" key="1">
                                <p className={'data'}>个人资料/编辑</p>
                                <div className={'first'}>
                                    <div style={{display:'flex',alignItems:'center'}} className={'headerPic'}>
                                        <img src={ base + this.state.head} style={{width:'102px',height:'136px'}}/>
                                        <Upload
                                            name="file"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            data={{
                                                type: '1',
                                                userId: localStorage.getItem('userId')
                                            }}
                                            action={updata}
                                            beforeUpload={this.beforeUpload}
                                            onChange={this.handleChange.bind(this)}
                                        >
                                            <Button type="primary"  size={'large'}> <Icon type={this.state.loading ? 'loading' : 'plus'} />上传头像</Button>
                                        </Upload>
                                    </div>
                                    <div style={{display:'flex',alignItems:'center'}}>
                                        <img src={base + this.state.weixinImg} style={{width:'120px',height:'120px'}}/>
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
                                            onChange={this.handleChange1.bind(this)}
                                        >
                                            <Button type="primary"  size={'large'}> <Icon type={this.state.loading1 ? 'loading' : 'plus'} />更新微信二维码</Button>
                                        </Upload>
                                    </div>
                                </div>
                                <p style={{marginTop: '30px',fontWeight:'bold'}}>账号：{localStorage.getItem('phone')}</p>
                                <div className={'center'}>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>姓名：</p>
                                            <Input value={this.state.name} onChange={this.onChangeName.bind(this)}/>
                                        </div>
                                    </div>
                                    {/* <div className={'item'}>
                                        <div className={'left'}>
                                            <p>联系电话：</p>
                                            <Input value={this.state.contact} onChange={this.onChangeContact.bind(this)}/>
                                        </div>
                                    </div> */}
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>公司：</p>
                                            <Input value={this.state.company} onChange={this.onChangeCompany.bind(this)}/>
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
                                    <div className={'weixinBox'} style={{marginTop:'30px'}}>
                                        <Button type="primary" style={{marginLeft:'40px'}} size={'large'} onClick={this.bindWeixin}>微信绑定</Button>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="楼盘入驻" key="2">
                            <p className={'data'} style={{marginBottom: '-20px'}}>入驻申请</p>
                                <div className={'item'}>
                                    <div className={'left'}>
                                        <p>选择入驻的楼盘：</p>
                                        <Select style={{width: 200,marginRight:'20px'}} onChange={this.setEstates.bind(this)} value={this.state.estateId}
                                        allowClear
                                        showSearch
                                        placeholder="输入楼盘名搜索"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                    {this.state.estates && this.state.estates.map(item => {
                                            return (<Option value={item.value} key={item.value}>{item.label}</Option>)
                                        }
                                    )}
                                </Select>
                                    </div>
                                    <Button type="primary" style={{marginLeft: '40px'}} size={'large'} onClick={this.showConfirm1.bind(this)}>确认申请</Button>
                                </div>
                                <p style={{marginTop: '20px'}}>已入驻的楼盘：</p>
                                {tags.map((tag, index) => {
                                    return  (
                                     <Tag key={index} closable onClose={(e)=>{this.showConfirm2(e,tag,index)}}>
                                            {tag.estateName}
                                        </Tag>
                                      
                                    ) ;
                                })}
                            </TabPane>
                            <TabPane tab="合作协议" key="3">
                                <p className={'data'}>置业顾问协议</p>
                            </TabPane>
                            <TabPane tab="修改密码" key="4">
                                <p className={'data'}>修改密码</p>
                                <ChangePassWord role={4}></ChangePassWord>
                            </TabPane>
                        </Tabs>
                    </div>

                </div>
            </div>
        )
    }

}
export default connect(state => (
    {estateId: state.estateId}), {newEstateId})(Consultant)