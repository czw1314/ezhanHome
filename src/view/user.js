import React from 'react';
import '../css/user.scss';
import { Tabs,Input,Button,Form,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    AutoComplete, } from 'antd';
class ChangePassWord extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            password:'',
            newPassword:'',
            confirmPassword:''
        };
    }

    password=(rule,value) => {
        this.setState({password:value})
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };
    newPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value === form.getFieldValue('password')) {
            callback('新密码不能与旧密码相同!');
        } else {
            callback();
        }
    };
    confirmPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('两次密码不同!');
        } else {
            callback();
        }
    };
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        return(
            <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{width:'400px',margin:'auto'}}>
                <Form.Item label="输入旧密码" >
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: '请输入旧密码',
                            },
                        ],
                    })(<Input.Password />)}
                </Form.Item>
                <Form.Item label="输入新密码" >
                    {getFieldDecorator('newPassword', {
                        rules: [
                            {
                                required: true,
                                message: '请输入新密码',
                            },
                            {
                                validator: this.newPassword,
                            },
                        ],
                    })(<Input.Password />)}
                </Form.Item>
                <Form.Item label="确认新密码">
                    {getFieldDecorator('confirmPassword', {
                        rules: [
                            {
                                required: true,
                                message: '请确认新密码',
                            },
                            {
                                validator: this.confirmPassword,
                            },
                        ],
                    })(<Input.Password />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" onSubmit={this.handleSubmit}>
                        确认修改
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}
const ChangePassWords = Form.create({ name: 'register' })(ChangePassWord);
class User extends React.Component {
    callback(key) {
        console.log(key);
    }
    render(){
        const { TabPane } = Tabs;

        return(
            <div className={'user'}>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>个人中心</p>
                </div>
                <div className={'userBox'}>
                    <div className={'container'}>
                    <div className={'menu'}>
                        <img className={'headerPic'} src={require('../img/agent.png')}/>
                        <p>欢迎您，晨晨</p>
                        <p>账号：12909138409</p>
                    </div>
                        <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition={'left'} tabBarStyle={{textAlign:'center',marginRight:20}}>
                            <TabPane tab="个人信息/微信绑定" key="1">
                                <p className={'data'}>基本资料</p>
                                <p>账号：2109212</p>
                                <div style={{display:'flex',alignItems:'center'}}>
                                    <p className={'nickname'}>昵称</p>
                                    <Input placeholder="请输入昵称" style={{width:'160px',marginLeft:'18px'}} size={'large'}/>
                                    <Button type="primary" style={{marginLeft:'40px'}} size={'large'}>确认修改</Button>
                                </div>
                                <div className={'weixin'}>
                                    <p className={'h2'}>微信绑定（已绑定）</p>
                                    <div className={'weixinBox'}>
                                        <img src={require('../img/weixinHeader.png')}/>
                                        <p>微信昵称：CSD000000<br></br>微信账号：SACSDVV
                                        </p>
                                        <p>地区：成都<br></br>性别：男
                                        </p>
                                        <Button type="primary" style={{marginLeft:'40px'}} size={'large'}>解除绑定</Button>
                                    </div>
                                </div>
                                <div className={'weixin'}>
                                    <p className={'h2'}>微信绑定（未绑定）</p>
                                    <div className={'weixinBox'}>
                                        <Button type="primary" style={{marginLeft:'40px'}} size={'large'}>微信绑定</Button>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="关注的楼盘" key="2">
                                <p className={'data'} style={{marginBottom:'-20px'}}>关注的楼盘</p>
                                <div className={'synopsis'}>
                                    <div className={'item'}>
                                        <img src={require('../img/hot.png')}/>
                                        <div className={'first'}>
                                            <p className={'name'}>蓝光·西环里</p>
                                            <p className={'price'}>15972元/m²起</p>
                                        </div>
                                        <div className={'second'}>
                                            <p className={'address'}>温江大学城</p>
                                            <p className={'area'}>建面：89-232m²</p>
                                        </div>
                                        <p className={'tag'}>高层 住宅 洋房住宅 超高层住宅 别墅</p>
                                    </div>
                                    <div className={'item'}>
                                        <img src={require('../img/hot.png')}/>
                                    </div>
                                    <div className={'item'}>
                                        <img src={require('../img/hot.png')}/>
                                    </div>
                                    <div className={'item'}>
                                        <img src={require('../img/hot.png')}/>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="修改密码" key="3">
                                <p className={'data'}>修改密码</p>
                                <ChangePassWords></ChangePassWords>
                            </TabPane>
                        </Tabs>
                    </div>

                </div>
            </div>
        )
    }

}
export default User