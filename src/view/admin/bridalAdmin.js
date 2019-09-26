import React from 'react'
import '../../css/bridalAdmin.scss'
import { Tabs, Table, Divider, Tag,Input,Select,Upload, Button, Icon} from 'antd';

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
            fileList:[]
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

        this.setState({ fileList });
    };
    render() {
        const {TabPane} = Tabs;
        const { Option } = Select;
        const updata='http://47.108.87.104:8501/houseAdmin/paperPublished';
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
                render:()=>(<Input/>)
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
        const { TextArea } = Input;
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
                                    <Select defaultValue="lucy" style={{ width: 200 }} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{ width: 200 }}>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{ width: 200 }} >
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                    <Upload {...props} fileList={this.state.fileList}>
                                        <Button>
                                            <Icon type="upload" /> Upload
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
                            </div>
                        </TabPane>
                        <TabPane tab="楼盘动态更新" key="3">
                            <div className={'content'}>
                                <p className={'title'}>楼盘动态发布</p>
                                <div className={'item'}>
                                    <p>选择更新的楼盘：</p>
                                    <Select defaultValue="lucy" style={{ width: 200 }} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{ width: 200 }}>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{ width: 200 }} >
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                </div>
                                <div className={'item'}>
                                    <p>楼盘动态标题：</p>
                                    <Input style={{width:300,marginLeft:30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>发布内容：</p>
                                    <TextArea
                                        placeholder="Controlled autosize"
                                        style={{width:300,marginLeft:30}}
                                        autosize={{ minRows: 3, maxRows: 5 }}
                                    />
                                </div>
                                    <Button type="primary" className={'push'}>
                                        确认发布
                                    </Button>
                            </div>
                        </TabPane>
                        <TabPane tab="楼盘信息编辑更新" key="4">
                        </TabPane>
                    </Tabs>
                </div>
            </div>

        )
    }
}

export default bridalAdmin