import React from 'react';
import '../css/consultant.scss';
import { Tabs,Input,Button,Form,Upload, Icon, message,Checkbox,
    Select,Tag,Tooltip,} from 'antd';
//上传头像
class Avatar extends React.Component {
    state = {
        loading: false,
    };
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
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;
        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
            >
                {uploadButton}
            </Upload>
        );
    }
}
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
class Consultant extends React.Component {
    constructor(props){
        super(props)
        this.state={
            loading: false,
            loading1: false,
            imgUrl:'',
            imgUrl1:'',
            plainOptions :['Apple', 'Pear', 'Orange'],
            tags: ['Unremovable', 'Tag 2', 'Tag 3'],
            inputVisible: false,
            inputValue: '',
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
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };
    //微信二维码上传
    handleChange1 = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading1: true });
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
    handleChange(value) {
        console.log(`selected ${value}`);
    }

    callback(key) {
        console.log(key);
    }
    //多选
    onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }
    render(){
        const { TabPane } = Tabs;
        const { imageUrl,imageUrl1 } = this.state;
        const { Option } = Select;
        const { tags, inputVisible, inputValue } = this.state;

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
                            <img className={'headerPic'} src={require('../img/agent.png')}/>
                            <p>欢迎您，晨晨</p>
                            <p>账号：12909138409</p>
                        </div>
                        <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition={'left'} tabBarStyle={{textAlign:'center',marginRight:20}}>
                            <TabPane tab="个人信息/微信绑定" key="1">
                                <p className={'data'}>个人资料/编辑</p>
                                <div className={'first'}>
                                    <div style={{display:'flex',alignItems:'center'}}>
                                        <img src={imageUrl} className={'headerPic'}/>
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            beforeUpload={this.beforeUpload}
                                            onChange={this.handleChange}
                                        >
                                            <Button type="primary"  size={'large'}> <Icon type={this.state.loading ? 'loading' : 'plus'} />上传头像</Button>
                                        </Upload>
                                    </div>
                                    <div style={{display:'flex',alignItems:'center'}}>
                                        <img src={imageUrl1} className={'headerPic'}/>
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            beforeUpload={this.beforeUpload}
                                            onChange={this.handleChange1}
                                        >
                                            <Button type="primary"  size={'large'}> <Icon type={this.state.loading1 ? 'loading' : 'plus'} />添加/更新微信二维码</Button>
                                        </Upload>
                                    </div>
                                </div>
                                <p>账号：12909138409</p>
                                <div className={'center'}>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>编辑姓名：</p>
                                            <Input placeholder="Basic usage" />
                                        </div>
                                        <Button type="primary" style={{marginLeft:'40px'}} size={'large'}>更新修改</Button>
                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>联系电话：</p>
                                            <Input placeholder="Basic usage" />
                                        </div>
                                        <Button type="primary" style={{marginLeft:'40px'}} size={'large'}>更新修改</Button>
                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>服务公司：</p>
                                            <Input placeholder="Basic usage" />
                                        </div>
                                        <Button type="primary" style={{marginLeft:'40px'}} size={'large'}>更新修改</Button>
                                    </div>
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
                            <TabPane tab="申请入住楼盘" key="2">
                                <p className={'data'} style={{marginBottom:'-20px'}}>入驻申请</p>
                                <div className={'item'}>
                                    <div className={'left'}>
                                        <p>选择入驻的楼盘：</p>
                                        <Select defaultValue="lucy" style={{ width: 200 }} onChange={this.handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                            </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                        <Select defaultValue="lucy" style={{ width: 200 }} onChange={this.handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                            </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </div>
                                    <Button type="primary" style={{marginLeft:'40px'}} size={'large'}>更新修改</Button>
                                </div>
                                <p style={{marginTop:'20px'}}>已入驻的楼盘：</p>
                                {tags.map((tag, index) => {
                                    const isLongTag = tag.length > 20;
                                    const tagElem = (
                                        <Tag key={tag} closable={'true'} onClose={() => this.handleClose(tag)}>
                                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                        </Tag>
                                    );
                                    return isLongTag ? (
                                        <Tooltip title={tag} key={tag}>
                                            {tagElem}
                                        </Tooltip>
                                    ) : (
                                        tagElem
                                    );
                                })}
                            </TabPane>
                            <TabPane tab="置业顾问协议" key="3">
                                <p className={'data'}>置业顾问协议</p>
                                <ChangePassWords></ChangePassWords>
                            </TabPane>
                            <TabPane tab="修改密码" key="4">
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
export default Consultant