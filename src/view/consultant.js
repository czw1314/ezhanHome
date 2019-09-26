import React from 'react';
import '../css/consultant.scss';
import { Tabs,Input,Button,Form,Upload, Icon, message,Checkbox,
    Select,Tag,Tooltip,} from 'antd';
import {getPersonMsg, putPersonMsg} from '../api'
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
            plainOptions :['Apple', 'Pear', 'Orange'],
            tags: ['Unremovable', 'Tag 2', 'Tag 3'],
            inputVisible: false,
            inputValue: '',
            head:'',
            weixin:'',
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
                    head:imageUrl,
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
            this.getBase64(info.file.originFileObj, imageUrl=>
                this.setState({
                    weixin:imageUrl,
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
                    contact: res.data.contact
                })
            }
        })
    }
    onSubmit() {
        let params = {
            "name": this.state.name,
            "company": this.state.company,
            "contact": this.state.contact,
            "userId": localStorage.getItem('userId')
        }
        putPersonMsg(params).then((res) => {
            if (res.data.code === 1) {
                message.success('修改成功')
                let params = {
                    userId: localStorage.getItem('userId')
                }
                getPersonMsg(params).then((res) => {
                        this.setState({
                            name: res.data.name,
                            head:res.data.head,
                            weixin:res.data.weixin,
                            company: res.data.company,
                            contact: res.data.contact
                        })
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
            onOk: () => {
                this.onSubmit()
            },
            onCancel() {
                console.log('Cancel');
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
                            <p>欢迎您，晨晨</p>
                            <p>账号：{localStorage.getItem('phone')}</p>
                        </div>
                        <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition={'left'} tabBarStyle={{textAlign:'center',marginRight:20}}>
                            <TabPane tab="个人信息/微信绑定" key="1">
                                <p className={'data'}>个人资料/编辑</p>
                                <div className={'first'}>
                                    <div style={{display:'flex',alignItems:'center'}} className={'headerPic'}>
                                        <img src={this.state.head || base + this.state.head}/>
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
                                        <img src={this.state.weixin || base + this.state.weixin} />
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
                                <p>账号：12909138409</p>
                                <div className={'center'}>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>编辑姓名：</p>
                                            <Input value={this.state.name} onChange={this.onChangeName.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>联系电话：</p>
                                            <Input value={this.state.contact} onChange={this.onChangeContact.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>服务公司：</p>
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
                            </TabPane>
                            <TabPane tab="修改密码" key="4">
                                <p className={'data'}>修改密码</p>
                                <ChangePassWord></ChangePassWord>
                            </TabPane>
                        </Tabs>
                    </div>

                </div>
            </div>
        )
    }

}
export default Consultant