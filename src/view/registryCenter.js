import React from 'react';
import '../css/RegistryCenter.scss';
import {connect} from "react-redux";
import {setUserInformation} from "../redux/action";
import { Tabs,Input,Button,Form,Upload, Icon, message,Checkbox,
    Select,Radio,Tooltip,} from 'antd';
import InformationForm from '../component/informationForm'

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
    // //限制大小
    // beforeUpload(file) {
    //     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //     if (!isJpgOrPng) {
    //         message.error('You can only upload JPG/PNG file!');
    //     }
    //     const isLt2M = file.size / 1024 / 1024 < 2;
    //     if (!isLt2M) {
    //         message.error('Image must smaller than 2MB!');
    //     }
    //     return isJpgOrPng && isLt2M;
    // }
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

class RegistryCenter extends React.Component {
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
            agent:true,
            first:false,
            id:3
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
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //     message.error('Image must smaller than 2MB!');
        // }
        return isJpgOrPng;
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
    render(){
        const { TabPane } = Tabs;
        const { imageUrl,imageUrl1 } = this.state;
        const { Option } = Select;
        const { tags, inputVisible, inputValue } = this.state;
        const fileList = [
            {
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-2',
                name: 'yyy.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
        ];
        const props2 = {
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            listType: 'picture',
            defaultFileList: [...fileList],
            className: 'upload-list-inline',
        };
        const base='http://47.108.87.104:8501/user/agentRegister';
        return(

            <div className={'registryCenter'}>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>注册中心</p>
                </div>
                <div className={'userBox'}>
                    <div className={'container'}>
                        <div className="first" style={{display:this.state.first?"block":'none'}}>
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
                        <div className={'second'} style={{display:this.state.first?"none":'block'}}>
                                <p className={'data'}>第二步：填写资料</p>
                                <div className={'first'}>
                                    <div style={{display:'flex',alignItems:'center'}}>
                                        <img src={imageUrl} className={'headerPic'}/>
                                        <Upload
                                            listType="picture-card"
                                            // headers={{
                                            //     'Content-Type': 'multipart/form-data;multipart/file; boundary=----WebKitFormBoundarym6KMqPswxD3pPMeI'}
                                            // }
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action={base}
                                            name={'head'}
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
                                <p style={{marginTop:'40px'}}>账号：{this.props.userInformation.userName||localStorage.getItem('userName')}</p>
                                <div className={'center'}>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>编辑姓名：</p>
                                            <Input size={'large'} />
                                        </div>
                                    </div>
                                    <div className={'item'} style={{display:this.state.agent?'block':'none'}}>
                                        <div className={'left'}>
                                            <p>服务区域：</p>
                                            <Select defaultValue="lucy"  onChange={this.handleChange} size={'large'}>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="disabled" disabled>
                                                    Disabled
                                                </Option>
                                                <Option value="Yiminghe">yiminghe</Option>
                                            </Select>    <Select defaultValue="lucy"  onChange={this.handleChange} size={'large'}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                            </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                            <Select defaultValue="lucy"  onChange={this.handleChange} size={'large'}>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="disabled" disabled>
                                                    Disabled
                                                </Option>
                                                <Option value="Yiminghe">yiminghe</Option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>联系电话：</p>
                                            <Input placeholder="Basic usage" size={'large'}/>
                                        </div>
                                    </div>
                                    <div className={'item'}  style={{display:this.state.agent?'block':'none'}}>
                                        <div className={'left'}>
                                            <p>选择服务：</p>
                                            <Checkbox.Group options={this.state.plainOptions} defaultValue={['Apple']} onChange={this.onChange.bind(this)} />
                                        </div>
                                    </div>

                                    <div className={'item'}  style={{display:this.state.agent?'block':'none'}}>
                                        <div className={'left'}>
                                            <p>从业年限：</p>
                                            <Input placeholder="Basic usage" size={'large'}/>
                                        </div>
                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <p>服务公司：</p>
                                            <Select defaultValue="lucy" style={{ width: 200 }} onChange={this.handleChange} size={'large'}>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="disabled" disabled>
                                                    Disabled
                                                </Option>
                                                <Option value="Yiminghe">yiminghe</Option>
                                            </Select>
                                            <Input placeholder="Basic usage" size={'large'} />
                                        </div>
                                    </div>
                                    <div className={'item'} style={{display:this.state.agent?'block':'none'}}>
                                        <div className={'left'} style={{alignItems:'flex-start'}}>
                                            <p dangerouslySetInnerHTML={{__html: '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp职称：'}}></p>
                                            <Select defaultValue="lucy" style={{ width: 200 }} onChange={this.handleChange} size={'large'}>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="disabled" disabled>
                                                    Disabled
                                                </Option>
                                                <Option value="Yiminghe">yiminghe</Option>
                                            </Select>
                                            <Upload {...props2}>
                                                <Button type="primary" size={'large'}>上传职称证书照片</Button>
                                            </Upload>
                                        </div>
                                    </div>
                                    <div className={'item'}  style={{display:this.state.agent?'block':'none'}}>
                                        <div className={'left'} style={{alignItems:'flex-start'}}>
                                            <p>身份证号：</p>
                                            <Input placeholder="Basic usage" size={'large'}/>
                                            <Upload {...props2}>
                                                <Button type="primary" size={'large'}>上传身份证正面照片</Button>
                                            </Upload>
                                            <Upload {...props2}>
                                                <Button type="primary" size={'large'}>上传身份证反面照片</Button>
                                            </Upload>
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
                        <Button type="primary" size={'large'} style={{margin:'40px 0 20px'}}>提交注册信息申请</Button>
                        <p>温馨提示：当您注册成功后，预计1-3个工作日内审核，审核成功后即可使用所有功能如有需要，可微信咨询微信号：pangzhu2018</p>
                    </div>
                    </div></div>
            </div>
        )
    }

}

export default connect(state=>(
    {userInformation:state.userInformation}),{setUserInformation})(RegistryCenter);