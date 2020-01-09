import React from 'react';
import '../css/RegistryCenter.scss';
import {connect} from "react-redux";
import {setUserInformation} from "../redux/action";
import {withRouter} from 'react-router-dom';
import {Input, Button, Form, Upload, Icon, message, Checkbox, Select, Cascader, Modal} from 'antd';
import {getDistrictRegions, agentRegister, getPersonMsg,} from '../api/index'

class Information extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            disabled: false,
            loading: false,
            loading1: false,
            loading2: false,
            loading3: false,
            loading4: false,
            head: '',
            weixin: '',
            title: '',
            frontCard: '',
            backCard: '',
            name: '',
            plainOptions: ['新房经纪', '二手房经纪', '权证代办', '贷款代办', '专车接送'],
            tags: ['Unremovable', 'Tag 2', 'Tag 3'],
            inputVisible: false,
            inputValue: '',
            agent: false,
            first: false,
            id: 3,
            districtRegionsList: [],
            bussinessId: [],
            regionId: '',
            regionId1: '',
            regionId2: '',
            agentType: 2,
            position: '',
            head: '',
            weixin: '',
            userInformation: {},
        }
        this.beforeUpload=this.beforeUpload.bind(this)
    }
    componentDidMount() {
        let params = {
            userId: localStorage.getItem('userId')
        }
        getPersonMsg(params).then((res) => {
            if (res.data.code === 1) {
                if(res.data.state==1){
                    this.props.history.push('/')
                    return true
                }
                let regions = []
                if(res.data.regions){
                    for (let i = 0; i < res.data.regions.length; i++) {
                        regions.push([res.data.regions[i].districtId, res.data.regions[i].streetId])
                    }
                }
                if(res.data.state==0||res.data.state=='-2'){
                    this.props.onPicUpdata()
                }
                this.props.setText(res.data.state)
                this.setState({
                    title:'http://47.108.87.104:8601/user/'+res.data.positionPicture,
                    name: res.data.name,
                    regionId: regions[0] ? regions[0] : [],
                    regionId1: regions[1] ? regions[1] : [],
                    regionId2: regions[2] ? regions[2] : [],
                    position: res.data.position,
                    head: 'http://47.108.87.104:8601/user/'+res.data.head,
                    weChatQrCode: 'http://47.108.87.104:8601/user/'+res.data.weChatQrCode,
                    bussinessId: res.data.businesses,
                    frontCard:'http://47.108.87.104:8601/user/'+res.data.frontCard,
                    backCard:'http://47.108.87.104:8601/user/'+res.data.backCard,
                    workYears: res.data.workingYears,
                    agentType: res.data.agentType,
                    company: res.data.company,
                    cardNo: res.data.cardNumber,
                    phone: res.data.phone,
                    state: res.data.state,
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

    //转化为base64
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    //注册
    handleSubmit(e) {
        if (!this.state.head) {
            message.error('请先上传头像')
            return
        }
        if (!this.state.weChatQrCode) {
            message.error('请先上传微信二维码')
            return
        }
        if (!this.state.title && localStorage.getItem('role') == 3) {
            message.error('请先上传职称照片')
            return
        }
        if ((!this.state.backCard || !this.state.frontCard) && localStorage.getItem('role') == 3) {
            message.error('请先上传身份证照片')
            return
        }

        if (this.state.state==0) {
            message.error('资料正在审核中，暂不支持修改')
            return
        }
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let re = []
            if (this.state.regionId[1]) {
                re.push(this.state.regionId[1])
            }
            if (this.state.regionId1[1]) {
                re.push(this.state.regionId1[1])
            }
            if (this.state.regionId2[1]) {
                re.push(this.state.regionId2[1])
            }
            let params = {}
            if (localStorage.getItem('role') == 3) {
                params = {
                    "name": values.name,
                    "regionIds": re,
                    "bussinessId": this.state.bussinessId,
                    "workingYears": values.workingYears,
                    "agentType": this.state.agentType || 2,
                    "company": this.state.company || '请输入公司名称',
                    "cardNo": this.state.cardNo,
                    "position": this.state.position || "房地产经纪人",
                    "userId": localStorage.getItem('userId')
                }
            }
            else {
                params = {
                    "name": values.name,
                    "company": this.state.company,
                    "userId": localStorage.getItem('userId')
                }
            }
            for (var key in params) {
                if (!params[key]) {
                    message.error('所有信息必填')
                    return;
                }
            }
            agentRegister(params).then((res) => {
                if (res.data.code === 0) {
                    if (res.data.verifyErrorMsg) {
                        this.props.form.setFields({
                            verifyCode: {
                                value: values.verifyCode,
                                errors: [new Error('验证码错误')],
                            },
                        })
                        this.createCode()
                    }
                    else if (res.data.phoneVerifyErrorMsg) {
                        this.props.form.setFields({
                            phoneCode: {
                                value: values.phoneCode,
                                errors: [new Error('手机验证码错误')],
                            },
                        })
                    }
                    else if (res.data.msg === '该手机号已绑定用户') {
                        message.success('该手机号已注册请去登录！')
                        setTimeout(this.props.handleClose, 1000)
                    }
                    else{

                    }
                }
                else {
                    message.success('信息填写成功！请等待管理员审核！')
                    localStorage.setItem('state',0)
                }
            })
        });
    };

    //职称照片上传
    titleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading2: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl1 =>
                this.setState({
                    title: imageUrl1,
                    loading2: false,
                }),
            );
        }
    };
    //身份证正面上传
    idTChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading3: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl1 =>
                this.setState({
                    frontCard: imageUrl1,
                    loading3: false,
                }),
            );
        }
    };
    //身份证反面上传
    idFChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading4: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl1 =>
                this.setState({
                    backCard: imageUrl1,
                    loading4: false,
                }),
            );
        }
    };
    //头像上传
    headChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    head: imageUrl,
                    loading: false,
                }),
            );
        }

    };
    //微信二维码上传
    weixinChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading1: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl1 =>
                this.setState({
                    weChatQrCode: imageUrl1,
                    loading1: false,
                }),
            );
        }
    };

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

    //服务选择
    bussinessIdChange(value) {
        if (value.length > 3) {
            this.props.form.setFields({
                working: {
                    value: '',
                    errors: [new Error('最多选择三个')],
                },
            })
        }
        else {
            this.setState({
                bussinessId: value
            })
        }
    }
    //公司选择（独立经纪人）
    onAgentType(value) {
        this.setState({
            agentType: value
        })
    }

    onPosition(value) {
        this.setState({
            position: value
        })
    }

    //上传
    beforeUpload(file) {
        if (localStorage.getItem('state') == 0) {
            this.props.onPicUpdata()
            return false
        }
        else {
            return true
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const base = 'http://47.108.87.104:8501/user/uploadFile';
        const {Option} = Select
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form center">
                <div className={'first'}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src={this.state.head} className={'headerPic'}/>
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={base}
                            name={'file'}
                            data={{
                                type: '1',
                                userId: this.props.userInformation.userId || localStorage.getItem('userId')
                            }}
                            beforeUpload={this.beforeUpload}
                            onChange={this.headChange}
                        >
                            <Button type="primary" size={'large'}> <Icon
                                type={this.state.loading ? 'loading' : 'plus'}/>上传头像</Button>
                        </Upload>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src={this.state.weChatQrCode} style={{borderRadius: 0,width:'120px',height:'120px'}}/>
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            data={{
                                type: '3',
                                userId: this.props.userInformation.userId || localStorage.getItem('userId')
                            }}
                            showUploadList={false}
                            action={base}
                            beforeUpload={this.beforeUpload}
                            onChange={this.weixinChange.bind(this)}
                        >
                            <Button type="primary" size={'large'}> <Icon
                                type={this.state.loading1 ? 'loading' : 'plus'}/>添加微信二维码</Button>
                        </Upload>
                    </div>
                </div>
                <p style={{marginTop: '40px'}}>账号：{this.state.phone}</p>
                <Form.Item label={'姓名：'} labelCol={{span: 1 }} labelAlign='left'>
                    {getFieldDecorator('name',{initialValue:this.state.name})(
                                <Input size={'large'} style={{width:'200px'}}/>
                    )}
                </Form.Item>
                <Form.Item className={'code'} style={{display: localStorage.getItem('role') == 3 ? 'block' : 'none'}} label={'区域：'} labelCol={{span: 1 }} labelAlign='left'>
                    <div className={'item'}>
                        <div className={'left'}>
                            <Cascader
                                options={this.state.districtRegionsList}
                                value={this.state.regionId}
                                onChange={this.onChange.bind(this)}
                                placeholder={'请选择区域'}
                                size={'large'}
                            />
                            <Cascader
                                options={this.state.districtRegionsList}
                                onChange={this.onChange1.bind(this)}
                                value={this.state.regionId1}
                                placeholder={'请选择区域'}
                                size={'large'}
                            />
                            <Cascader
                                options={this.state.districtRegionsList}
                                onChange={this.onChange2.bind(this)}
                                value={this.state.regionId2}
                                placeholder={'请选择区域'}
                                size={'large'}
                            />
                        </div>
                    </div>
                </Form.Item>
                <Form.Item style={{display: localStorage.getItem('role') == 3 ? 'block' : 'none'}} label={'服务：'} labelCol={{span: 1 }} labelAlign='left'>
                    {getFieldDecorator('working')(<div className={'item'}>
                            <div className={'left'} style={{marginTop:'8px'}}>
                                <Checkbox.Group options={this.state.plainOptions}
                                                value={this.state.bussinessId}
                                                onChange={this.bussinessIdChange.bind(this)}/>
                            </div>
                        </div>
                    )}
                </Form.Item>
                <Form.Item style={{display: localStorage.getItem('role') == 3 ? 'block' : 'none'}} label={'工龄：'} labelCol={{span: 1 }} labelAlign='left'>
                    {getFieldDecorator('workingYears',{initialValue:this.state.workYears})(
                                <Input size={'large'} addonAfter="年" style={{width:'200px'}}/>
                    )}
                </Form.Item>
                <Form.Item label={'公司：'} labelCol={{span: 1 }} labelAlign='left'>
                    {getFieldDecorator('check')(
                        <div className={'item'}>
                            <div className={'left'}>
                                <Select value={this.state.agentType.toString()} onSelect={this.onAgentType.bind(this)} style={{
                                    display: localStorage.getItem('role') == 3 ? 'block' : 'none',
                                    width: '200px'
                                }}
                                        size={'large'}>
                                    <Option value={2}>在职公司</Option>
                                    <Option value={1}>独立经纪人</Option>
                                </Select>
                                <Input disabled={this.state.agentType == 1 ? true : false} size={'large'} value={this.state.company} onChange={(e)=>this.setState({company:e.target.value})}/>
                            </div>
                        </div>
                    )}
                </Form.Item>
                <Form.Item style={{display: localStorage.getItem('role') == 3 ? 'block' : 'none'}} label={'职称：'} labelCol={{span: 1 }} labelAlign='left'>
                    <div className={'item'}>
                        <div className={'left'} style={{alignItems: 'flex-start'}}>
                            <Select defaultValue="房地产经纪人" style={{width: 200}} onSelect={this.onPosition.bind(this)}
                                    size={'large'}>
                                <Option value="房地产经纪人">房地产经纪人</Option>
                                <Option value="房地产经纪人协理">房地产经纪人协理</Option>
                            </Select>
                            <div className={'bottom'}>
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    data={{
                                        type: '2',
                                        userId: localStorage.getItem('userId')
                                    }}
                                    showUploadList={false}
                                    action={base}
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.titleChange}
                                >
                                    <Button type="primary" size={'large'}> <Icon
                                        type={this.state.loading2 ? 'loading' : 'plus'}/>上传职称证书</Button>
                                </Upload>
                                <img src={this.state.title} className={'headerPic'}
                                     style={{borderRadius: 0, width: '200px', height: '140px'}}/>
                            </div>
                        </div>
                    </div>

                </Form.Item>
                <Form.Item style={{display: localStorage.getItem('role') == 3 ? 'block' : 'none'}} label={'身份证号：'} labelCol={{span: 2 }} labelAlign='left'>
                    <div className={'item'}>
                        <div className={'left'} style={{alignItems: 'flex-start',marginLeft:'-20px'}}>
                            <Input size={'large'} style={{marginRight:'20px'}} onChange={(e)=>{this.setState({cardNo:e.target.value})}} value={this.state.cardNo}/>
                            <div className={'bottom'}>
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    data={{
                                        type: '4',
                                        userId: localStorage.getItem('userId')
                                    }}
                                    showUploadList={false}
                                    action={base}
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.idTChange}
                                >
                                    <Button type="primary" size={'large'}> <Icon
                                        type={this.state.loading3 ? 'loading' : 'plus'}/>上传身份证正面照片</Button>
                                </Upload>
                                <img src={this.state.frontCard} className={'headerPic'}
                                     style={{borderRadius: 0, width: '200px', height: '140px'}}/>
                            </div>
                            <div className={'bottom'}>
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    data={{
                                        type: '5',
                                        userId: localStorage.getItem('userId')
                                    }}
                                    showUploadList={false}
                                    action={base}
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.idFChange}
                                >
                                    <Button type="primary" size={'large'}> <Icon
                                        type={this.state.loading4 ? 'loading' : 'plus'}/>上传身份证反面照片</Button>
                                </Upload>
                                <img src={this.state.backCard} className={'headerPic'}
                                     style={{borderRadius: 0, width: '200px', height: '140px'}}/>
                            </div>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" size={'large'} style={{margin: '40px auto 20px'}}
                            onClick={this.handleSubmit.bind(this)}>提交注册信息申请</Button>
                    <p>温馨提示：当您注册成功后，预计1-3个工作日内审核，审核成功后即可使用所有功能如有需要，可微信咨询微信号：pangzhu2018</p>
                </Form.Item>
            </Form>
        );
    }
}

const InformationForms = Form.create({name: 'retrieve'})(withRouter(Information));


class RegistryCenter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            loading1: false,
            loading2: false,
            loading3: false,
            loading4: false,
            title: '',
            frontCard: '',
            backCard: '',
            name: '',
            plainOptions: ['新房经纪', '二手房经济', '权证代办', '贷款代办', '专车接送'],
            text:'',
            inputVisible: false,
            inputValue: '',
            agent: true,
            first: false,
            id: 3,
            districtRegionsList: [],
            visible: false,
            visible1: false,
        }
    }
    setText(text){
        this.setState({
            text
        })
    }

    callback(key) {
        console.log(key);
    }
    //多选
    onPicUpdata() {
        this.setState({
            visible:true
        })
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className={'registryCenter'}>
                <Modal
                    title=""
                    width={520}
                    bodyStyle={{textAlign:'left',color:'#333'}}
                    visible={this.state.visible}
                    onOk={()=>this.setState({visible:false})}
                    onCancel={()=>this.setState({visible:false})}
                    footer={[<Button key='confirm' className='ant-btn-custom-circle' type='primary'  onClick={()=>this.setState({visible:false})}>确认</Button>]}
                >
                    <p>尊敬的用户：</p>
                    <p style={{fontWeight:'bold',display:this.state.text==0?'block':'none'}}>你的资料正在审核中，请耐心等候。</p>
                    <p style={{fontWeight:'bold',display:this.state.text=='-2'?'block':'none'}}>你的资料不全或相关图片模糊被工作人员驳回，请修改后再次申请。</p>
                    <p>如有疑问，请联系“e站房屋”工作人员。</p>
                    <p><span style={{marginRight:'30px'}}>微信号：pangzhu2018</span>联系电话：13032872245</p>
                </Modal>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>注册中心</p>
                </div>
                <div className={'userBox'}>
                    <div className={'container'}>
                        <div className={'second'} style={{display: this.state.first ? "none" : 'block'}}>
                            <p className={'data'}>第二步：填写资料</p>
                            <InformationForms userInformation={this.props.userInformation} go={this.props.history} onPicUpdata={this.onPicUpdata.bind(this)} setText={this.setText.bind(this)}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default connect(state => (
    {userInformation: state.userInformation}), {setUserInformation})(RegistryCenter);