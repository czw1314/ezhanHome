import React from 'react'
import '../../css/bridalAdmin.scss'
import {connect} from "react-redux";
import {setUserInformation} from "../../redux/action";
import {
    Tabs, Input, Button, Form, Upload, Icon, message, Checkbox,
    Select, Modal, Cascader, Divider
} from 'antd';
import {getDistrictRegions, agentRegister} from '../../api/index'

class Information extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            disabled: false,
            loading2: false,
            loading3: false,
            loading4: false,
            head: '',
            weixin: '',
            title: '',
            idT: '',
            idF: '',
            name: '',
            plainOptions: ['新房经纪', '二手房经纪', '权证代办', '贷款代办', '专车接送'],
            tags: ['Unremovable', 'Tag 2', 'Tag 3'],
            inputVisible: false,
            inputValue: '',
            agent: false,
            first: false,
            id: 3,
            districtRegionsList: [],
            bussinessId: [],
            regionId: '',
            regionId1: '',
            regionId2: '',
            agentType: '',
            position: ''
        }
    }

    componentDidMount() {
        getDistrictRegions().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].name,
                        children: []
                    }
                    for (let j = 0; j < res.data.list[i].regions.length; j++) {
                        let items = {
                            value: res.data.list[i].regions[j].id,
                            label: res.data.list[i].regions[j].street,
                        }
                        item.children.push(items)
                    }
                    option.push(item)
                }
                console.log(option)
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

    //注册
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let re = []
                if (this.state.regionId) {
                    re.push(this.state.regionId)
                }
                if (this.state.regionId1) {
                    re.push(this.state.regionId1)
                }
                if (this.state.regionId2) {
                    re.push(this.state.regionId2)
                }
                let params = {
                    "name": values.name,
                    "regionIds": re,
                    "bussinessId": this.state.bussinessId,
                    "workingYears": values.workingYears,
                    "agentType": this.state.agentType || 2,
                    "company": this.refs.company.state.value,
                    "cardNo": this.refs.cardNo.state.value,
                    "position": this.state.position || "房地产经纪人",
                    "contact": values.contact,
                    "userId": localStorage.getItem('userId')
                }

                agentRegister(params).then((res) => {
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

    //区域选择
    onChange(checkedValues) {
        this.setState({
            regionId: checkedValues[1]
        })
    }

    onChange1(checkedValues) {
        this.setState({
            regionId1: checkedValues[1]
        })
    }

    onChange2(checkedValues) {
        this.setState({
            regionId2: checkedValues[1]
        })
    }

    //服务选择
    bussinessIdChange(value) {
        console.log(value)
        this.setState({
            bussinessId: value
        })
    }

    //公司选择（独立经纪人）
    onAgentType(value) {
        this.setState({
            agentType: value
        })
    }

    onPosition(value) {
        this.setState({
            position: value
        })
    }

    //公司填写
    company(e) {
        e.preventDefault();
        console.log(e)
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const base = 'http://47.108.87.104:8501/user/uploadFile';
        const {Option} = Select
        const options = [
            {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                    {
                        value: 'hangzhou',
                        label: 'Hangzhou',
                        children: [
                            {
                                value: 'xihu',
                                label: 'West Lake',
                            },
                        ],
                    },
                ],
            },
            {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [
                    {
                        value: 'nanjing',
                        label: 'Nanjing',
                        children: [
                            {
                                value: 'zhonghuamen',
                                label: 'Zhong Hua Men',
                            },
                        ],
                    },
                ],
            },
        ];
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form first">
                <Form.Item>
                    {getFieldDecorator('name')(
                        <div className={'item'}>
                            <p>楼盘名称（推广名）：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('name')(
                        <div className={'item'}>
                            <p>备案名：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>楼盘价格：</p>
                            <Input/>
                            <p>元m²/起</p>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>楼盘区域：</p>
                            <Cascader options={options}/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item style={{display: this.state.agent ? 'block' : 'none'}}>
                    <div className={'item'}>
                        <div className={'left'}>
                            <p>选择服务：</p>
                            <Checkbox.Group options={this.state.plainOptions}
                                            onChange={this.bussinessIdChange.bind(this)}/>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item>
                    <div className={'item'}>
                        <p>楼盘项目特色：</p>
                        <Select defaultValue="lucy" style={{width: 120}}>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="disabled" disabled>
                                Disabled
                            </Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                        <Select defaultValue="lucy" style={{width: 120}} disabled>
                            <Option value="lucy">Lucy</Option>
                        </Select>
                        <Select defaultValue="lucy" style={{width: 120}} loading>
                            <Option value="lucy">Lucy</Option>
                        </Select>
                    </div>
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>建面区间：</p>
                            <Input/>
                            <p>m²</p>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>上市时间：</p>
                            <Input placeholder="格式：2018-08-08"/>
                            <p>元m²/起</p>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>产权年限：</p>
                            <Input placeholder="默认70年"/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>项目地址：</p>
                            <Input placeholder="格式：2018-08-08"/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>地址经纬度：</p>
                            <Input placeholder="164564561，154，4545645，546"/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>开发商：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>物业权属：</p>
                            <Select defaultValue="lucy" style={{width: 120}} loading>
                                <Option value="lucy">Lucy</Option>
                            </Select>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>建筑类型：</p>
                            <Select defaultValue="lucy" style={{width: 120}} loading>
                                <Option value="lucy">Lucy</Option>
                            </Select>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>绿化率：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>建筑结构：</p>
                            <Select defaultValue="lucy" style={{width: 120}} loading>
                                <Option value="lucy">Lucy</Option>
                            </Select>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>户型结构：</p>
                            <Select defaultValue="lucy" style={{width: 120}} loading>
                                <Option value="lucy">Lucy</Option>
                            </Select>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>容积率：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>占地面积：</p>
                            <Input/>
                            <p>m²（约5亩）</p>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>拿地时间：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>总建筑面积：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>交房时间预计：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>梯户比：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>总楼层：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>规划户数：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>层高：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>公摊：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>交付标准：</p>
                            <Select defaultValue="lucy" style={{width: 120}} loading>
                                <Option value="lucy">Lucy</Option>
                            </Select>
                            <p>装修标准：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>物管公司：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>物管费：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>车位配比：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>车位数：</p>
                            <Input/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>项目介绍：</p>
                            <Input.TextArea/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>项目内部配套：</p>
                            <Input.TextArea/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>交付装修标准：</p>
                            <Input.TextArea/>
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('contact')(
                        <div className={'item'}>
                            <p>不利因素：</p>
                            <Input.TextArea/>
                        </div>
                    )}
                </Form.Item>

                <Form.Item style={{display: this.state.agent ? 'block' : 'none'}}>
                    {getFieldDecorator('workingYears')(
                        <div className={'item'}>
                            <div className={'left'}>
                                <p>交房时间预计：</p>
                                <Input size={'large'}/>
                                <p>m²</p>
                            </div>
                        </div>
                    )}
                </Form.Item>
            </Form>
        );
    }
}

const InformationForms = Form.create({name: 'retrieve'})(Information);

//上传图片
class PicturesWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
        };
    }


    handleCancel = () => this.setState({previewVisible: false});

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({fileList}) => this.setState({fileList});

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <div className="clearfix" style={{marginLeft: '20px'}}>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} className={'imgUp'}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

class bridalAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            left: 13,
            login: false,
            register: false,
            serviceChecked: [],
            service: ['新房经纪'],
            titleChecked: [],
            title: ['房地产经纪人', '房地产经纪人协理'],
            apartmentChecked: [],
            apartment: ['三室两厅'],
            characteristicChecked: [],
            characteristic: ['现房'],
            togglePrice: true,
            toggleTime: true,
            fileList: [],

        }
    }

    showModal = (str) => {
        if (str === 'login') {
            this.setState({
                login: true,
            });
        }
        else if (str === 'register') {
            this.setState({
                register: true,
            });
        }
    };

    //退出登陆
    clear() {
        this.props.setUserInformation({})
        localStorage.clear()
    }

    //找房与找经纪人互相切换
    handleClick = e => {
        if (e.key == 2) {

            this.setState({left: 80});
        }
        else {
            this.setState({left: 13});
        }

    };
    //选择区域
    onChange = positionChecked => {
        this.setState({
            positionChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };
    //选择价格
    onChangeService = serviceChecked => {
        this.setState({
            serviceChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };
    //选择面积
    onChangeTitle = titleChecked => {
        this.setState({
            titleChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };
    //选择户型
    onChangeApartment = apartmentChecked => {
        this.setState({
            apartmentChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };
    //选择特色
    onChangeCharacteristic = characteristicChecked => {
        this.setState({
            characteristicChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };

    //价格排序
    selected(e) {
        this.setState({
            togglePrice: true,
            toggleTime: true
        })
        console.log(this.state.togglePrice)
    }

    callback(key) {
        console.log(key);
    }

    推荐经纪人

    recommend() {

    }

    handleChange = info => {
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);

        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        this.setState({fileList});
    };

    render() {
        const {TabPane} = Tabs;
        const {Option} = Select;
        const updata = 'http://47.108.87.104:8501/houseAdmin/paperPublished';

        function handleChange(value) {
            console.log(`selected ${value}`);
        }

        const columns = [
            {
                title: '时间',
                dataIndex: '时间',
                key: '时间',
                render: text => <a>{text}</a>,
            },
            {
                title: '申请人姓名',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '头像',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '申请人账号（电话）',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '联系电话',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '微信二维码',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '申请人公司',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '经纪人服务区域',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '身份证号',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '查看身份证',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '职称',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '查看职称证件',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '是否通过',
                key: 'action',
                render: (text, record) => (
                    <span>
                  <a>Invite {record.name}</a>
                  <Divider type="vertical"/>
                  <a>Delete</a>
                </span>
                ),
            },
        ];
        //经纪人入驻申请
        const agentColumns = [
            {
                title: '时间',
                dataIndex: '时间',
                key: '时间',
                render: text => <a>{text}</a>,
            },
            {
                title: '申请人姓名',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '头像',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '申请人账号（电话）',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '联系电话',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '微信二维码',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '申请人公司',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '经纪人服务区域',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '职称',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '申请入驻的楼盘',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '是否通过',
                key: 'action',
                render: (text, record) => (
                    <span>
                  <a>Invite {record.name}</a>
                  <Divider type="vertical"/>
                  <a>Delete</a>
                </span>
                ),
            },
        ];
        //置业顾问申请
        const consultantColumns = [
            {
                title: '时间',
                dataIndex: '时间',
                key: '时间',
                render: text => <a>{text}</a>,
            },
            {
                title: '申请人姓名',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '头像',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '申请人账号（电话）',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '联系电话',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '微信二维码',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '申请人公司',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '申请入驻的楼盘',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '是否通过',
                key: 'action',
                render: (text, record) => (
                    <span>
                  <a>Invite {record.name}</a>
                  <Divider type="vertical"/>
                  <a>Delete</a>
                </span>
                ),
            },
        ];
        //管理经纪人
        const agentControl = [
            {
                title: '时间',
                dataIndex: '时间',
                key: '时间',
                render: text => <a>{text}</a>,
            },
            {
                title: '姓名',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '头像',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '账号（电话）',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '联系电话',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '微信二维码',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '公司',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '经纪人服务区域',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '身份证号',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '查看身份证',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '职称',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '查看职称证件',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '是否删除经纪人',
                key: 'action',
                render: (text, record) => (
                    <span>
                  <a>Invite {record.name}</a>
                  <Divider type="vertical"/>
                  <a>Delete</a>
                </span>
                ),
            },
        ];
        //管理置业顾问
        const consultantControl = [
            {
                title: '注册时间',
                dataIndex: '时间',
                key: '时间',
                render: text => <a>{text}</a>,
            },
            {
                title: '姓名',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '头像',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '账号（电话）',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '联系电话',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '微信二维码',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '公司',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '是否删除置业顾问',
                key: 'action',
                render: (text, record) => (
                    <span>
                  <a>Invite {record.name}</a>
                  <Divider type="vertical"/>
                  <a>Delete</a>
                </span>
                ),
            },
        ];
        //管理新房管理员
        const bridalControl = [
            {
                title: '序号',
                dataIndex: '时间',
                key: '时间',
                render: text => <a>{text}</a>,
            },
            {
                title: '账号',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '修改密码',
                dataIndex: 'address',
                key: 'address',
                render: () => (<Input/>)
            },
            {
                title: '更新密码',
                key: 'tags',
                dataIndex: 'tags',
            },
        ];
        const consultant = [
            {
                title: '时间',
                dataIndex: '时间',
                key: '时间',
                render: text => <a>{text}</a>,
            },
            {
                title: '申请人姓名',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '头像',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '申请人账号（电话）',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '联系电话',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '微信二维码',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '申请人公司',
                key: 'tags',
                dataIndex: 'tags',
            },
            {
                title: '是否通过',
                key: 'action',
                render: (text, record) => (
                    <span>
                  <a>Invite {record.name}</a>
                  <Divider type="vertical"/>
                  <a>Delete</a>
                </span>
                ),
            },
        ];

        const data = [
            {
                key: '1',
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
                tags: ['nice', 'developer'],
            },
            {
                key: '2',
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
                tags: ['loser'],
            },
            {
                key: '3',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
                tags: ['cool', 'teacher'],
            },
        ];
        const props = {
            action: updata,
            onChange: this.handleChange,
            multiple: true,
        };
        const {TextArea} = Input;
        return (
            <div className='bridalAdmin'>
                <div className={'header'}>
                    <div className='left'>
                        <div className='logo'>
                            <img src={require('../../img/LOGO2.png')}/>
                        </div>
                        <p>新房管理中心</p>
                    </div>
                    <div className='right' style={{display: localStorage.getItem('userName') ? 'none' : 'block'}}>
                        <img src={require('../../img/admin.png')}/>
                        <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp登陆&nbsp&nbsp/'}}
                              onClick={this.showModal.bind(this, 'login')}/>
                        <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp&nbsp注册'}}
                              onClick={this.showModal.bind(this, 'register')}/>
                        {/* <Login login={this.state.login} handleCancel={this.handleCancel.bind(this,'login')}/>
                                <Register register={this.state.register} handleCancel={this.handleCancel.bind(this,'register')}/> */}
                    </div>
                    <div className='right' style={{display: localStorage.getItem('userName') ? 'block' : 'none'}}>
                        <img src={require('../../img/admin.png')} style={{marginRight: '10px'}}/>

                        <span onClick={this.clear.bind(this)}>退出</span>
                    </div>
                </div>
                <div className={'menu'}>
                    <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition={'left'}>
                        <TabPane tab="一页纸发布" key="1">
                            <div className={'content'}>
                                <p className={'title'}>楼盘一页纸发布</p>
                                <div className={'item'}>
                                    <p>选择发布的楼盘：</p>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}}>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}}>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                    <Upload {...props} fileList={this.state.fileList}>
                                        <Button>
                                            <Icon type="upload"/> Upload
                                        </Button>
                                    </Upload>
                                    <Button type="primary" className={'push'}>
                                        确认发布
                                    </Button>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="楼盘发布" key="2">
                            <div className={'content'}>
                                <p className={'title'}>楼盘发布</p>
                                <p>1、填写基本信息：</p>
                                <InformationForms/>
                                <p style={{marginTop: '50px'}}>2、添加楼盘相册：</p>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘封面宣传图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>区位图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘总平面图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘效果图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘实景图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>样板间</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>添加预售</span>
                                    <PicturesWall></PicturesWall></div>
                                <p style={{marginTop: '50px'}}>3、楼盘动态：</p>
                                <div className={'item'}>
                                    <p>楼盘动态标题：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>发布内容：</p>
                                    <TextArea
                                        placeholder="Controlled autosize"
                                        style={{width: 300, marginLeft: 30}}
                                        autosize={{minRows: 3, maxRows: 5}}
                                    />
                                </div>
                                <p style={{marginTop: '50px'}}>4、项目外部配套（从近到远排序）（3公里范围）：</p>
                                <div className={'item'}>
                                    <p>交通配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>医疗配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>商业配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>教育配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <p style={{marginTop: '50px'}}>5、添加户型信息以及户型图（支持格式PNG，JPG）：</p>
                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>户型名称：</p>
                                        <Input/>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型选择：</p>
                                        <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型详细名称：</p>
                                        <Input/>
                                    </div>
                                </div>
                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>建面：</p>
                                        <Input/>
                                        <p>m²</p>
                                    </div>
                                    <div className={'items'}>
                                        <p>层高：</p>
                                        <Input/>
                                        <p>m</p>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型结构：</p>
                                        <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className={'item'}>
                                        <p>户型特色：</p>
                                        <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                        <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                        <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                        <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                        <Input/>
                                </div>
                                    <div className={'item'}>
                                    <div className={'items'}>
                                        <p>户型优点：</p>
                                        <Input/>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型缺点：</p>
                                        <Input/>
                                    </div>
                                </div>

                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>户型图:</p>
                                        <PicturesWall></PicturesWall>
                                    </div>
                                    <Button>删除户型</Button>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="楼盘动态更新" key="3">
                            <div className={'content'}>
                                <p className={'title'}>楼盘动态发布</p>
                                <div className={'item'}>
                                    <p>选择更新的楼盘：</p>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}}>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}}>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                </div>
                                <div className={'item'}>
                                    <p>楼盘动态标题：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>发布内容：</p>
                                    <TextArea
                                        placeholder="Controlled autosize"
                                        style={{width: 300, marginLeft: 30}}
                                        autosize={{minRows: 3, maxRows: 5}}
                                    />
                                </div>
                                <Button type="primary" className={'push'}>
                                    确认发布
                                </Button>
                            </div>
                        </TabPane>
                        <TabPane tab="楼盘信息编辑更新" key="4">
                            <div className={'content'}>
                                <p className={'title'}>楼盘发布</p>
                                <p>1、填写基本信息：</p>
                                <InformationForms/>
                                <p style={{marginTop: '50px'}}>2、添加楼盘相册：</p>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘封面宣传图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>区位图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘总平面图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘效果图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘实景图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>样板间</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>添加预售</span>
                                    <PicturesWall></PicturesWall></div>
                                <p style={{marginTop: '50px'}}>3、楼盘动态：</p>
                                <div className={'item'}>
                                    <p>楼盘动态标题：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>发布内容：</p>
                                    <TextArea
                                        placeholder="Controlled autosize"
                                        style={{width: 300, marginLeft: 30}}
                                        autosize={{minRows: 3, maxRows: 5}}
                                    />
                                </div>
                                <p style={{marginTop: '50px'}}>4、项目外部配套（从近到远排序）（3公里范围）：</p>
                                <div className={'item'}>
                                    <p>交通配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>医疗配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>商业配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>教育配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <p style={{marginTop: '50px'}}>5、添加户型信息以及户型图（支持格式PNG，JPG）：</p>
                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>户型名称：</p>
                                        <Input/>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型选择：</p>
                                        <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型详细名称：</p>
                                        <Input/>
                                    </div>
                                </div>
                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>建面：</p>
                                        <Input/>
                                        <p>m²</p>
                                    </div>
                                    <div className={'items'}>
                                        <p>层高：</p>
                                        <Input/>
                                        <p>m</p>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型结构：</p>
                                        <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className={'item'}>
                                    <p>户型特色：</p>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Input/>
                                </div>
                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>户型优点：</p>
                                        <Input/>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型缺点：</p>
                                        <Input/>
                                    </div>
                                </div>

                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>户型图:</p>
                                        <PicturesWall></PicturesWall>
                                    </div>
                                    <Button>删除户型</Button>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>

        )
    }
}

export default bridalAdmin