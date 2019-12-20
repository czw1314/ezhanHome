import React from 'react';
import {withRouter} from 'react-router-dom';
import '../css/login.scss';
import {login} from "../api";
import {connect} from "react-redux";
import {setUserInformation} from "../redux/action";
import {Modal, Button, Tabs, Form, Input, message} from 'antd';
import {getPhoneCode, recoverPwd} from '../api/index'

class RetreivePassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            code: 'http://47.108.87.104:8501/user/verfiyCode',
            text: '获取验证码',
            disabled: false,
        }
    }

    componentDidMount() {
    }

    //获取手机验证码
    getCode() {

        if (!this.props.form.getFieldValue('phone')) {
            message.error('请输入手机号！')
            return
        }
        let params = {
            phone: this.props.form.getFieldValue('phone'),
            verifyCode: this.props.form.getFieldValue('verifyCode')
        }
        getPhoneCode(params).then((res) => {
            if (res.data.code == 0) {
                message.error(res.data.msg)
                return
            }
            else {
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
            }
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
                recoverPwd(params).then((res) => {
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
                        else {
                            message.error(res.data.msg)
                        }

                    }
                    else {
                        message.success('密码修改成功！请去登录！')
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
    validateCode(rule, value, callback) {
        var checkCode = document.getElementById("checkCode").innerHTML;
        if (value.toUpperCase() != checkCode.toUpperCase()) {
            callback('新密码不能与旧密码相同!');
        } else {
            callback();
        }

    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                <Form.Item>
                    {getFieldDecorator('phone', {
                        rules: [{required: true, message: '请输入手机号!'}],
                    })(
                        <Input
                            placeholder="请输入手机号"
                            autoComplete="off"
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
                            autoComplete="off"
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
                               autoComplete="off"
                               addonAfter={<Button style={{cursor: 'pointer', fontWeight: 'bold'}} block={true}
                                                   onClick={this.getCode.bind(this)}
                                                   disabled={this.state.disabled}>{this.state.text}</Button>}
                               placeholder="请输入短信验证码"/>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入新密码!'}, {min: 6, message: '密码至少6位数'}],
                    })(
                        <Input
                            autoComplete="off"
                            size={'large'}
                            type="password"
                            placeholder="请输入新密码"
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

const Retreive = Form.create({name: 'retrieve'})(RetreivePassword);

class NormalLoginForm extends React.Component {
    //登录
    handleSubmit = e => {
        e.preventDefault();
        let that = this
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
                        message.success('登录成功！')
                        localStorage.setItem('state', res.data.state)
                        this.props.setUserInformation(res.data)
                        localStorage.setItem('userName', res.data.name)
                        localStorage.setItem('role', res.data.role)
                        localStorage.setItem('userId', res.data.userId)
                        localStorage.setItem('phone', values.phone)
                        localStorage.setItem('bind', 'true')
                        if (res.data.state == '-1') {
                            message.error('请先去完善注册资料,3后自动跳转')
                            setTimeout(function () {
                                that.props.history.push({pathname: '/home/registryCenter'})
                            }, 3000)
                        }
                        setTimeout(this.props.handleClose, 1000)
                    }
                })
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('phone', {
                        rules: [{required: true, message: '请输入手机号!'}],
                    })(
                        <Input
                            autoComplete="off"
                            size={'large'}
                            placeholder="请输入手机号"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码!'}],
                    })(
                        <Input
                            autoComplete="off"
                            type="password"
                            size={'large'}
                            placeholder="请输入密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" size={'large'}>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = withRouter(connect(state => (
    {userInformation: state.userInformation}), {setUserInformation})(Form.create({name: 'normal_login'})(NormalLoginForm)))

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            weixin: false,
            retrieve: false,
            accountNumber: true,
            key: 5
        };
    }

    callback = e => {
        this.setState({
            key: e,
        });
    }

    weixin() {
        window.location = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx53ba91de253ea23a&redirect_uri=http%3A%2F%2Fwww.ezhanhome.com&response_type=code&scope=snsapi_login&state=' + this.state.key + '#wechat_redirect'
    }

    componentDidMount() {
        if (this.props.location.pathname == '/home/registryCenter') {
            return
        }
        else {
            let that = this
            if (this.props.userInformation.state == '-1' || localStorage.getItem('state') == '-1') {
                message.error('请完善注册资料,3后自动跳转')
                setTimeout(function () {
                    that.props.history.push({pathname: '/home/registryCenter'})
                }, 3000)
            }
        }
    }

    render() {
        const {TabPane} = Tabs;
        return (
            <div className={'login'}>
                <Modal
                    visible={this.props.login}
                    forceRender={true}
                    width={390}
                    destroyOnClose={true}
                    afterClose={() => this.setState({retrieve: false, accountNumber: true})}
                    onCancel={this.props.handleCancel}
                    footer={''}
                >
                    <div className={'accountNumber'} style={{display: this.state.accountNumber ? 'block' : 'none'}}>
                        <p className={'title'}>账号密码登录</p>
                        <Tabs defaultActiveKey="5" onChange={this.callback}>
                            <TabPane tab="普通用户" key="5">
                                <WrappedNormalLoginForm handleClose={this.props.handleCancel}
                                                        role={5}></WrappedNormalLoginForm>
                                <p className={'retrieve'}
                                   onClick={() => this.setState({retrieve: true, accountNumber: false})}><a>找回密码</a></p>
                            </TabPane>
                            <TabPane tab="经纪人" key="3">
                                <WrappedNormalLoginForm handleClose={this.props.handleCancel}
                                                        role={3}></WrappedNormalLoginForm>
                                <p className={'retrieve'}
                                   onClick={() => this.setState({retrieve: true, accountNumber: false})}><a>找回密码</a></p>
                            </TabPane>
                            <TabPane tab="置业顾问" key="4">
                                <WrappedNormalLoginForm handleClose={this.props.handleCancel}
                                                        role={4}></WrappedNormalLoginForm>
                                <p className={'retrieve'}
                                   onClick={() => this.setState({retrieve: true, accountNumber: false})}><a>找回密码</a></p>
                            </TabPane>
                        </Tabs>
                        <svg t="1576834249834" className="icon" viewBox="0 0 1024 1024" version="1.1" onClick={this.weixin.bind(this)}
                             xmlns="http://www.w3.org/2000/svg" p-id="2070" width="200" height="200">
                            <path
                                d="M512.73678 968.402751c-246.990301 0-447.905216-200.953801-447.905216-447.911356 0-246.943228 200.914916-447.898053 447.905216-447.898053 246.947322 0 447.904193 200.953801 447.904193 447.898053C960.640973 767.449973 759.684102 968.402751 512.73678 968.402751zM512.73678 89.832981c-237.487879 0-430.665577 193.171558-430.665577 430.658414s193.177698 430.658414 430.665577 430.658414c237.4449 0 430.664553-193.171558 430.664553-430.658414S750.180658 89.832981 512.73678 89.832981zM615.259782 454.626291c7.009647 0 13.96199 0.534166 20.772093 1.310855-18.720364-87.122243-111.826901-151.754263-217.995943-151.754263-118.79357 0-216.116129 80.980359-216.116129 183.831842 0 59.268872 32.413224 108.029412 86.48063 145.877415l-21.598924 64.989153 75.53944-37.912471c26.998911 5.342682 48.654117 10.849092 75.696006 10.849092 6.752798 0 13.477966-0.314155 20.117177-0.854461-4.188392-14.46034-6.639211-29.570479-6.639211-45.25674C431.512874 531.268856 512.564865 454.626291 615.259782 454.626291zM499.101225 396.056338c16.213263 0 27.027563 10.671037 27.027563 26.948769 0 16.2061-10.813277 27.055193-27.027563 27.055193-16.22759 0-32.483832-10.849092-32.483832-27.055193C466.618417 406.727375 482.873636 396.056338 499.101225 396.056338zM347.824847 450.060299c-16.213263 0-32.598442-10.849092-32.598442-27.055193 0-16.276708 16.384156-26.948769 32.598442-26.948769 16.184611 0 26.912953 10.671037 26.912953 26.948769C374.7378 439.211207 364.009458 450.060299 347.824847 450.060299zM812.484655 623.100354c0-86.424348-86.424348-156.841118-183.504384-156.841118-102.850459 0-183.874821 70.416769-183.874821 156.841118 0 86.573751 81.023338 156.798139 183.874821 156.798139 21.512966 0 43.169195-5.385661 64.796772-10.813277l59.311851 32.483832-16.299221-54.011124C780.214694 715.015763 812.484655 671.818939 812.484655 623.100354zM569.33994 596.044138c-10.770298 0-21.626553-10.714016-21.626553-21.606087 0-10.79281 10.856255-21.609157 21.626553-21.609157 16.3422 0 27.04189 10.81737 27.04189 21.609157C596.381829 585.331145 585.68214 596.044138 569.33994 596.044138zM688.205141 596.044138c-10.685363 0-21.456684-10.714016-21.456684-21.606087 0-10.79281 10.770298-21.609157 21.456684-21.609157 16.22759 0 27.083845 10.81737 27.083845 21.609157C715.290009 585.331145 704.432731 596.044138 688.205141 596.044138z"
                                p-id="2071" fill="#1afa29"></path>
                        </svg>
                        <p className={'agreement'}>登录即代表同意<a>《e站房屋经纪人协议》</a>及<a>《e站房屋免责申明》</a></p>
                    </div>
                    <div className={'retrieve'} style={{display: this.state.retrieve ? 'block' : 'none'}}>
                        <p className={'title'}>密码找回</p>
                        <Retreive handleClose={this.props.handleCancel}/>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <p className={'retrieve'}
                               onClick={() => this.setState({retrieve: false, accountNumber: true})}><a>账号密码登录</a></p>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withRouter(connect(state => (
    {userInformation: state.userInformation}))(Login))