import React from 'react';
import { Tabs,Input,Button,Form,Upload, Icon, message,Checkbox,
    Select,Tag,Tooltip,Cascader,Modal} from 'antd';
import {changeModifyPwd} from '../api'
import { withRouter } from 'react-router-dom';

class ChangePassWord extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            password:'',
            newPassword:'',
            confirmPassword:'',
        };
    }
    password=(rule,value) => {
        this.setState({password:value})
    };
    handleSubmit () {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params={
                    "newPassword": values.confirmPassword,
  "oldPassword": values.password,
  "phone": localStorage.getItem('phone'),
  "role": this.props.role
                }
                changeModifyPwd(params).then((res)=>{
                    if(res.data.code===1){
                        message.success('修改成功,请重新登录!')
                        localStorage.clear()
                        this.props.history.push('/homePage');
                    }
                    else{
                        message.error(res.data.msg)
                    }
                })
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
        //确认修改？
        showConfirm() {
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    const { confirm } = Modal;
                    const that=this
                    confirm({
                      title: '是否确认修改密码?',
                      content: '',
                      okText:"确认",
                      cancelText:"取消",
                      onOk:()=> {
                          that.handleSubmit()
                      },
                      onCancel() {
                        console.log('Cancel');
                      },
                    });
                }
            })

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
            <Form {...formItemLayout}  style={{width:'400px',margin:'auto'}}>
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
                    <Button type="primary" onClick={this.showConfirm.bind(this)}>
                        确认修改
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}
const ChangePassWords = Form.create({ name: 'register' })(ChangePassWord);

export default withRouter(ChangePassWords);