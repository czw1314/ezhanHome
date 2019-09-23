import React from 'react';
import '../css/RegistryCenter.scss';
import {connect} from "react-redux";
import {setUserInformation} from "../redux/action";
import {
    Tabs, Input, Button, Form, Upload, Icon, message, Checkbox,
    Select, Radio, Cascader
} from 'antd';
import {getDistrictRegions} from '../api/index'
import InformationForm from '../component/informationForm'

class Information extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '获取验证码',
            disabled: false,
            code: 'http://47.108.87.104:8501/user/verfiyCode',
            loading: false,
            loading1: false,
            loading2: false,
            loading3: false,
            loading4: false,
            head: '',
            weixin: '',
            title: '',
            idT: '',
            idF: '',
            name: '',
            plainOptions: ['新房经纪', '二手房经济', '权证代办', '贷款代办', '专车接送'],
            tags: ['Unremovable', 'Tag 2', 'Tag 3'],
            inputVisible: false,
            inputValue: '',
            agent: true,
            first: false,
            id: 3,
            districtRegionsList: []
        }
    }
    //转化为base64
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    //注册
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!(/^1[3456789]\d{9}$/.test(values.phone))) {
                this.props.form.setFields({
                    phone: {
                        value: values.phone,
                        errors: [new Error('请输入正确的手机号')],
                    },
                });
                return false
            }
            if (!err) {
                let params = {
                    "bussinessId": values.bussinessId,
                    "phone": values.phone,
                    "phoneCode": values.phoneCode,
                    "role": this.props.role,
                    "verifyCode": values.verifyCode
                }
                setUserInformation(params).then((res) => {
                    if (res.data.code === 0) {
                        console.log(res.data.msg === '该手机号已绑定用户')
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
                            message.success('该手机号已注册请去登陆！')
                            setTimeout(this.props.handleClose, 1000)

                        }
                    }
                    else {
                        message.success('注册成功！请去登陆！')
                        setTimeout(this.props.handleClose, 1000)
                    }

                })
            }
        });
    };

    //生成验证码的方法
    //职称照片上传
    titleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading2: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
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
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl1 =>
                this.setState({
                    idT: imageUrl1,
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
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl1 =>
                this.setState({
                    idF: imageUrl1,
                    loading4: false,
                }),
            );
        }
    };
    onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }


    componentDidMount() {
        console.log(this.props.form.validateFields)
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const base = 'http://47.108.87.104:8501/user/uploadFile';
        const {Option} = Select
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form center">
                <Form.Item>
                    {getFieldDecorator('name')(
                        <div className={'item'}>
                            <div className={'left'}>
                                <p>编辑姓名：</p>
                                <Input size={'large'}/>
                            </div>
                        </div>
                    )}
                </Form.Item>
                <Form.Item className={'code'}>
                    {getFieldDecorator('verifyCode')(
                        <div className={'item'} style={{display: this.state.agent ? 'block' : 'none'}}>
                            <div className={'left'}>
                                <p>服务区域：</p>
                                <Cascader
                                    options={this.state.districtRegionsList}
                                    onChange={this.onChange}
                                    placeholder={'请选择区域'}
                                    size={'large'}
                                />
                                <Cascader
                                    options={this.state.districtRegionsList}
                                    onChange={this.onChange}
                                    placeholder={'请选择区域'}
                                    size={'large'}
                                />
                                <Cascader
                                    options={this.state.districtRegionsList}
                                    onChange={this.onChange}
                                    placeholder={'请选择区域'}
                                    size={'large'}
                                />
                            </div>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('bussinessId')(
                        <div className={'item'} style={{display: this.state.agent ? 'block' : 'none'}}>
                            <div className={'left'}>
                                <p>选择服务：</p>
                                <Checkbox.Group options={this.state.plainOptions} defaultValue={['Apple']}
                                                onChange={this.onChange.bind(this)}/>
                            </div>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password')(
                        <div className={'item'} style={{display: this.state.agent ? 'block' : 'none'}}>
                            <div className={'left'}>
                                <p>从业年限：</p>
                                <Input size={'large'}/>
                            </div>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('check')(
                        <div className={'item'}>
                            <div className={'left'}>
                                <p>服务公司：</p>
                                <Select defaultValue="在职公司" style={{width: 200}} onChange={this.handleChange}
                                        size={'large'}>
                                    <Option value="在职公司">在职公司</Option>
                                    <Option value="独立经纪人">独立经纪人</Option>
                                </Select>
                                <Input placeholder="独立经纪人不填" size={'large'}/>
                            </div>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    <div className={'item'} style={{display: this.state.agent ? 'block' : 'none'}}>
                        <div className={'left'} style={{alignItems: 'flex-start'}}>
                            <p dangerouslySetInnerHTML={{__html: '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp职称：'}}></p>
                            <Select defaultValue="房地产经纪人" style={{width: 200}} onChange={this.handleChange}
                                    size={'large'}>
                                <Option value="房地产经纪人">房地产经纪人</Option>
                                <Option value="房地产经纪人协理">房地产经纪人协理</Option>
                            </Select>
                            <div className={'bottom'}>
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    data={{
                                        type: '3',
                                        userId:localStorage.getItem('userId')
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
                <Form.Item>
                    <div className={'item'} style={{display: this.state.agent ? 'block' : 'none'}}>
                        <div className={'left'} style={{alignItems: 'flex-start'}}>
                            <p>身份证号：</p>
                            <Input size={'large'}/>
                            <div className={'bottom'}>
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    data={{
                                    type: '3',
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
                                <img src={this.state.idT} className={'headerPic'}
                                     style={{borderRadius: 0, width: '200px', height: '140px'}}/>
                            </div>
                            <div className={'bottom'}>
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    data={{
                                        type: '3',
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
                                <img src={this.state.idF} className={'headerPic'}
                                     style={{borderRadius: 0, width: '200px', height: '140px'}}/>
                            </div>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item>
                    <div className={'weixin'}>
                        <p className={'h2'}>微信绑定（已绑定）</p>
                        <div className={'weixinBox'}>
                            <img src={require('../img/weixinHeader.png')}/>
                            <p>微信昵称：CSD000000<br></br>微信账号：SACSDVV
                            </p>
                            <p>地区：成都<br></br>性别：男
                            </p>
                            <Button type="primary" style={{marginLeft: '40px'}} size={'large'}>解除绑定</Button>
                        </div>
                    </div>
                    <div className={'weixin'}>
                        <p className={'h2'}>微信绑定（未绑定）</p>
                        <div className={'weixinBox'}>
                            <Button type="primary" style={{marginLeft: '40px'}} size={'large'}>微信绑定</Button>
                        </div>
                    </div>
                    <Button type="primary" size={'large'} style={{margin: '40px 0 20px'}} onClick={this.handleSubmit.bind(this)}>提交注册信息申请</Button>
                    <p>温馨提示：当您注册成功后，预计1-3个工作日内审核，审核成功后即可使用所有功能如有需要，可微信咨询微信号：pangzhu2018</p>
                </Form.Item>
            </Form>
        );
    }
}

const InformationForms = Form.create({name: 'retrieve'})(Information);

//上传头像

class RegistryCenter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            loading1: false,
            loading2: false,
            loading3: false,
            loading4: false,
            head: '',
            weixin: '',
            title: '',
            idT: '',
            idF: '',
            name: '',
            plainOptions: ['新房经纪', '二手房经济', '权证代办', '贷款代办', '专车接送'],
            tags: ['Unremovable', 'Tag 2', 'Tag 3'],
            inputVisible: false,
            inputValue: '',
            agent: true,
            first: false,
            id: 3,
            districtRegionsList: []
        }
    }

    componentDidMount() {
        getDistrictRegions().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].name,
                        label: res.data.list[i].name,
                        children: []
                    }
                    for (let j = 0; j < res.data.list[i].regions.length; j++) {
                        let items = {
                            value: res.data.list[i].regions[j].street,
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

    //限制大小
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //     message.error('Image must smaller than 2MB!');
        // }
        return isJpgOrPng;
    }

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
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl1 =>
                this.setState({
                    imageUrl1,
                    loading1: false,
                }),
            );
        }
    };
    //职称照片上传
    titleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading2: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl1 =>
                this.setState({
                    title: imageUrl1,
                    loading1: false,
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
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl1 =>
                this.setState({
                    idT: imageUrl1,
                    loading1: false,
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
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl1 =>
                this.setState({
                    idF: imageUrl1,
                    loading1: false,
                }),
            );
        }
    };
    // handleChange(value) {
    //     console.log(`selected ${value}`);
    // }

    callback(key) {
        console.log(key);
    }

    //多选
    onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }

    //单选
    onRadio = e => {
        this.setState({
            id: e.target.value,
        });
    };

    render() {
        const {TabPane} = Tabs;
        const {Option} = Select
        const {imageUrl, imageUrl1} = this.state;
        const {tags, inputVisible, inputValue} = this.state;
        const fileList = [];
        const props2 = {
            action: 'http://47.108.87.104:8501/user/uploadFile',
            listType: 'picture',
            name: 'file',
            defaultFileList: [...fileList],
            data: {type: '2', userId: this.props.userInformation.userId || localStorage.getItem('userId')},
            className: 'upload-list-inline',
        };
        const base = 'http://47.108.87.104:8501/user/uploadFile';
        return (

            <div className={'registryCenter'}>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>注册中心</p>
                </div>
                <div className={'userBox'}>
                    <div className={'container'}>
                        <div className="first" style={{display: this.state.first ? "block" : 'none'}}>
                            <p className={'data'}>第一步：注册信息</p>
                            <div className={'radio-box'}>
                                <p>账号类型：</p>
                                <Radio.Group name="radiogroup" defaultValue={3} onChange={this.onRadio.bind(this)}>
                                    <Radio value={3}>经纪人</Radio>
                                    <Radio value={4}>置业顾问</Radio>
                                </Radio.Group>
                            </div>
                            <InformationForm role={this.state.id}/>
                        </div>
                        <div className={'second'} style={{display: this.state.first ? "none" : 'block'}}>
                            <p className={'data'}>第二步：填写资料</p>
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
                                    <img src={this.state.weixin} className={'headerPic'} style={{borderRadius: 0}}/>
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
                                        onChange={this.weixinChange}
                                    >
                                        <Button type="primary" size={'large'}> <Icon
                                            type={this.state.loading1 ? 'loading' : 'plus'}/>添加微信二维码</Button>
                                    </Upload>
                                </div>
                            </div>
                            <p style={{marginTop: '40px'}}>账号：{this.props.userInformation.userName || localStorage.getItem('userName')}</p>
                            <InformationForms userInformation={this.props.userInformation}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default connect(state => (
    {userInformation: state.userInformation}), {setUserInformation})(RegistryCenter);