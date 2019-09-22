import React from 'react';
import '../css/register.scss';
import {Button, Form, Input, Checkbox, message} from 'antd';
import {getPhoneCode, register} from '../api/index'
class Information extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '获取验证码',
            disabled: false,
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

    //注册
    handleSubmit(e) {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(this.props.role)
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
                    "password": values.password,
                    "phone": values.phone,
                    "phoneCode": values.phoneCode,
                    "role": this.props.role,
                    "verifyCode": values.verifyCode
                }
                register(params).then((res) => {
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
    createCode() {
        const num = Math.ceil(Math.random() * 10)
        this.setState({
            code: 'http://47.108.87.104:8080/user/verfiyCode?num=' + num
        })
    }

    componentDidMount() {

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
                        rules: [{required: true, message: '请输入密码!'}, {min: 6, message: '密码至少6位数'}],
                    })(
                        <Input
                            size={'large'}
                            type="password"
                            placeholder="请输入密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('check', {
                        rules: [{required: true, message: '请勾选同意相关协议!'}],
                    })(
                        <Checkbox
                            onChange={this.onChange}>我已阅读并同意<a>《e站房屋{this.props.tab}协议》</a>及<a>《e站房屋免责申明》</a></Checkbox>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        下一步
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const InformationForm = Form.create({name: 'retrieve'})(Information);

export default InformationForm