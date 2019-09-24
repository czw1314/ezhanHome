import React from 'react';
import '../css/login.scss';
import {login} from "../api";
import {connect} from "react-redux";
import {setUserInformation} from "../redux/action";
import { Modal, Button,Tabs,Form, Input, message  } from 'antd';

class RetreivePassword extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };
    //生成验证码的方法
     createCode(length) {
        var code = "";
        var codeLength = parseInt(length); //验证码的长度
        var checkCode = document.getElementById("checkCode");
        ////所有候选组成验证码的字符，当然也可以用中文的
        var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        //循环组成验证码的字符串
        for (var i = 0; i < codeLength; i++)
        {
            //获取随机验证码下标
            var charNum = Math.floor(Math.random() * 62);
            //组合成指定字符验证码
            code += codeChars[charNum];
        }
        if (checkCode)
        {
            //为验证码区域添加样式名
            checkCode.className = "code";
            //将生成验证码赋值到显示区
            checkCode.innerHTML = code;
        }
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
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: '请输入手机号!' }],
                    })(
                        <Input
                            placeholder="请输入手机号"
                        />,
                    )}
                </Form.Item>
                <Form.Item className={'code'}>
                    {getFieldDecorator('code', {
                        rules: [
                            { required: true, message: '请输入验证码!' },
                        ],
                    })(
                        <Input
                            placeholder="请输入验证码"
                        />,
                    )}
                    <div id="checkCode" className="code" onClick={this.createCode.bind(this,4)}></div>
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入手机号!' }],
                    })(
                        <Input  addonAfter={<span style={{cursor:'pointer'}}>获取验证码</span>} />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input

                            type="password"
                            placeholder="请输入密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
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
        console.log(this.props)
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
                        <Retreive/>
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