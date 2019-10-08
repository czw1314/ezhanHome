import React from 'react';
import '../css/login.scss';
import {login} from "../api";
import {connect} from "react-redux";
import {setUserInformation} from "../redux/action";
import { Modal, Button,Tabs,Form, Input, message  } from 'antd';
import {getPhoneCode, register} from '../api/index'

class RetreivePassword extends React.Component {
    constructor(props){
        super(props)
        this.state={
            code: 'http://47.108.87.104:8501/user/verfiyCode'
        }
    }
    //获取手机验证码
    getCode() {
        let that = this
        var wait = 60;

        function time() {
            if (wait == 0) {
                that.setState({text: "免费获取验证码", disabled: false})
                wait = 60;
            } else {
                that.setState({text: "重新发送(" + wait + ")", disabled: true})
                wait--;
                setTimeout(function () {
                    time()
                }, 1000)
            }
        }

        time()
        let params = {phone: this.props.form.getFieldValue('phone')}
        getPhoneCode(params).then((res) => {
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    "password": values.password,
                    "phone": values.phone,
                    "phoneCode": values.phoneCode,
                    "verifyCode": values.verifyCode
                }
                register(params).then((res) => {
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

                    }
                    else {
                        message.success('密码修改成功！请去登陆！')
                        setTimeout(this.props.handleClose, 1000)
                    }

                })
            }
        });
    };
    //生成验证码的方法
    createCode() {
        const num = Math.ceil(Math.random() * 10)
        this.setState({
            code: 'http://47.108.87.104:8501/user/verfiyCode?num=' + num
        })
    }
    //检查验证码是否正确
     validateCode(rule, value, callback){
         var checkCode = document.getElementById("checkCode").innerHTML;
         if (value.toUpperCase() != checkCode.toUpperCase()) {
             callback('新密码不能与旧密码相同!');
         } else {
             callback();
         }

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                <Form.Item>
                    {getFieldDecorator('phone', {
                        rules: [{required: true, message: '请输入手机号!'}],
                    })(
                        <Input
                            placeholder="请输入手机号"
                            size={'large'}
                        />,
                    )}
                </Form.Item>
                <Form.Item className={'code'}>
                    {getFieldDecorator('verifyCode', {
                        rules: [
                            {required: true, message: '请输入验证码!'},

                        ],
                    })(
                        <Input
                            placeholder="请输入验证码"
                            size={'large'}
                        />,
                    )}
                    <div id={this.props.id} className="code" onClick={this.createCode.bind(this, 4)}><img
                        src={this.state.code}/></div>
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('phoneCode', {
                        rules: [{required: true, message: '请输入短信验证码!'}],
                    })(
                        <Input size={'large'}
                               addonAfter={<Button style={{cursor: 'pointer', fontWeight: 'bold'}} block={true}
                                                   onClick={this.getCode.bind(this)}
                                                   disabled={this.state.disabled}>{this.state.text}</Button>}
                               placeholder="请输入短线验证码"/>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入新密码!'}, {min: 6, message: '密码至少6位数'}],
                    })(
                        <Input
                            size={'large'}
                            type="password"
                            placeholder="请输入密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" size={'large'}>
                        修改密码
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const Retreive = Form.create({ name: 'retrieve' })(RetreivePassword);
class NormalLoginForm extends React.Component {
    //登陆
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    "password": values.password,
                    "phone": values.phone,
                    "role": this.props.role,
                    "loginType": 2
                };
                login(params).then((res) => {
                    if (res.data.code === 0) {
                        message.error(res.data.msg)
                    }
                    else {
                        message.success('登陆成功！')
                        setTimeout(this.props.handleClose, 1000)
                        this.props.setUserInformation(res.data)
                        localStorage.setItem('userName',res.data.name)
                        localStorage.setItem('role',res.data.role)
                        localStorage.setItem('userId',res.data.userId)
                        localStorage.setItem('phone',values.phone)
                    }
                })
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: '请输入手机号!' }],
                    })(
                        <Input
                            size={'large'}
                            placeholder="请输入手机号"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input
                            type="password"
                            size={'large'}
                            placeholder="请输入密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" size={'large'}>
                        登陆
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedNormalLoginForm =connect(state=>(
    {userInformation:state.userInformation}),{setUserInformation})(Form.create({ name: 'normal_login' })(NormalLoginForm))

class Login extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            weixin:true,
            retrieve:false,
            accountNumber:false
        };
    }

    callback(key) {
        console.log(key);
    }

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        const { TabPane } = Tabs;

        return (
            <div className={'login'}>
                <Modal
                    visible={this.props.login}
                    onCancel={this.props.handleCancel}
                    footer={''}
                >
                    <div className={'weixin'} style={{display:this.state.weixin?'block':'none'}}>
                        <p className={'title'}>微信快捷登陆</p>
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab="普通用户" key="1">
                                Content of Tab Pane 1
                            </TabPane>
                            <TabPane tab="经纪人" key="2">
                                Content of Tab Pane 2
                            </TabPane>
                            <TabPane tab="置业顾问" key="3">
                                Content of Tab Pane 3
                            </TabPane>
                        </Tabs>
                        <p className={'accountNumber'} onClick={()=>this.setState({weixin:false,accountNumber:true})}>账号密码登陆</p>
                        <p className={'agreement'}>登录即代表同意<a>《e站房屋经纪人协议》</a>及<a>《e站房屋免责申明》</a></p>
                    </div>
                    <div className={'accountNumber'} style={{display:this.state.accountNumber?'block':'none'}}>
                        <p className={'title'}>账号密码登陆</p>
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab="普通用户" key="1">
                                <WrappedNormalLoginForm handleClose={this.props.handleCancel} role={5}></WrappedNormalLoginForm>
                                <p className={'retrieve'}  onClick={()=>this.setState({retrieve:true,accountNumber:false})}><a>找回密码</a></p>
                            </TabPane>
                            <TabPane tab="经纪人" key="2">
                                <WrappedNormalLoginForm handleClose={this.props.handleCancel} role={3}></WrappedNormalLoginForm>
                                <p className={'retrieve'}  onClick={()=>this.setState({retrieve:true,accountNumber:false})}><a>找回密码</a></p>
                            </TabPane>
                            <TabPane tab="置业顾问" key="3">
                                <WrappedNormalLoginForm handleClose={this.props.handleCancel} role={4}></WrappedNormalLoginForm>
                                <p className={'retrieve'}  onClick={()=>this.setState({retrieve:true,accountNumber:false})}><a>找回密码</a></p>
                            </TabPane>
                        </Tabs>
                        <p className={'accountNumber'} onClick={()=>this.setState({weixin:true,accountNumber:false})}>微信快捷登陆</p>
                        <p className={'agreement'}>登录即代表同意<a>《e站房屋经纪人协议》</a>及<a>《e站房屋免责申明》</a></p>
                    </div>
                    <div className={'retrieve'} style={{display:this.state.retrieve?'block':'none'}}>
                        <p className={'title'}>密码找回</p>
                        <Retreive handleClose={this.props.handleCancel}/>
                        <div style={{display:'flex',justifyContent:'space-between'}}>
                            <p className={'retrieve'}  onClick={()=>this.setState({retrieve:false,weixin:true})}><a>微信快捷登陆</a></p>
                            <p className={'retrieve'}  onClick={()=>this.setState({retrieve:false,accountNumber:true})}><a>账号密码登陆</a></p>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default Login