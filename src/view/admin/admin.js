import React from 'react'
import '../../css/admin.scss'
import { Tabs, Table, Divider, Modal,Input,Button,Popconfirm} from 'antd';
import ChangePassWord from '../../component/changePassWord'
import {connect} from "react-redux";
import {login,getAdmin,modifyHouseAdminPwd,getAdviser} from "../../api";
import {setUserInformation} from "../../redux/action";
import {Form, message} from "antd/lib/index";
class Login extends React.Component {
    //登陆
    handleSubmit = e => {
        console.log(this.props)
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    "password": values.password,
                    "phone": values.phone,
                    "role": 1,
                    "loginType": 2
                };
                login(params).then((res) => {
                    if (res.data.code === 0) {
                        message.error(res.data.msg)
                    }
                    else {
                        message.success('登陆成功！')
                        this.props.setUserInformation(res.data)
                        setTimeout(this.props.handleClose, 1000)
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
            <Form onSubmit={this.handleSubmit} className="login-form" style={{marginTop:'30px'}}>
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
                    <Button type="primary" htmlType="submit" className="login-form-button" size={'large'} style={{width:'100%'}}>
                        登陆
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
const Logins =connect(state=>({userInformation:state.userInformation}),{setUserInformation})(Form.create({ name: 'normal_login' })(Login))
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `请填写密码.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} style={{width:'200px'}}/>)}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        );
    }
}
//可编辑表格
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '序号',
                dataIndex: 'no',
                key: 'no',
            },
            {
                title: '账号',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '修改密码',
                dataIndex: 'passWord',
                editable: true,
            },
            {
                title: '确认修改',
                dataIndex: 'operation',
                render: (text, record,index) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="确认修改密码?" onConfirm={() => this.handleDelete(record.key,index)} cancelText={'取消'} okText={'确认'}>
                            <a>确认修改</a>
                        </Popconfirm>
                    ) : null,
            },
        ];

        this.state = {
            dataSource: [],
            count: 2,
        };
    }

    handleDelete = (key,index) => {
        let params={
            phone:this.state.dataSource[index].phone,
            newPassword:this.state.dataSource[index].passWord,
            role:0
        }
        modifyHouseAdminPwd(params).then((res)=>{

        })
        // const dataSource = [...this.state.dataSource];
        // this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    };


    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
    };
    componentDidMount(){
        getAdmin().then((res)=>{
            if(res.data.code===1){
                let data=res.data.admins,arr=[]
                for (let i=0;i<data.length;i++){
                    let item={
                        no:i+1,
                        phone:data[i].phone,
                        passWord:'123456',
                    }
                    arr.push(item)
                }
                this.setState({
                    dataSource:arr
                })
            }

        })
    }

    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}

class Admin extends React.Component {
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
            adminData:[],
            consultantData:[]
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
    }


    //获取新房管理员列表
    callback(key) {
        if(key==='12'){
            let params={
                type:2
            }
            getAdviser(params).then((res)=>{
                if(res.data.code===1){
                    console.log(res.data.agentResponses)
                    this.setState({
                        consultantData:res.data.agentResponses
                    })
                    console.log(this.state.consultantData)
                }

            })
        }
        console.log(key);
    }
    //推荐经纪人
    recommend() {

    }
    //关闭登陆弹框
    handleCancel(){
        console.log('s')
        this.setState({
            login:false
        })
    }
    //修改密码
    changePassWord(e){
        console.log(e.target.value)
    }


    render() {
        const {TabPane} = Tabs;
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
                dataIndex: 'createTime',
                key: 'createTime',
            },
            {
                title: '申请人姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '头像',
                dataIndex: 'head',
                key: 'head',
                // render:(text, record,index)=>(
                //     <img src={''}/>
                // ),
            },
            {
                title: '申请人账号（电话）',
                key: 'phone',
                dataIndex: 'phone',
            },
            {
                title: '联系电话',
                key: 'contact',
                dataIndex: 'contact',
            },
            {
                title: '微信二维码',
                key: 'weChatQrCode',
                dataIndex: 'weChatQrCode',
            },
            {
                title: '申请人公司',
                key: 'company',
                dataIndex: 'company',
            },
            {
                title: '是否通过',
                key: 'action',
                render: (text, record,index) => (
                    <span>
                  <a>是</a>
                  <Divider type="vertical"/>
                  <a>否</a>
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
                dataIndex: 'no',
                key: 'no',
            },
            {
                title: '账号',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '修改密码',
                dataIndex: 'passWord',
                key: 'passWord',
                render:()=>(<Input onChange={this.changePassWord.bind(this)}/>)
            },
            {
                title: '更新密码',
                render:()=>(<Button>确认修改</Button>)
            },
        ];
        const consultant = [
            {
                title: '时间',
                dataIndex: 'createTime',
                key: 'createTime',
            },
            {
                title: '申请人姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '头像',
                dataIndex: 'head',
                key: 'head',
                // render:(text, record,index)=>(
                //     <img src={''}/>
                // ),
            },
            {
                title: '申请人账号（电话）',
                key: 'phone',
                dataIndex: 'phone',
            },
            {
                title: '联系电话',
                key: 'contact',
                dataIndex: 'contact',
            },
            {
                title: '微信二维码',
                key: 'weChatQrCode',
                dataIndex: 'weChatQrCode',
            },
            {
                title: '申请人公司',
                key: 'company',
                dataIndex: 'company',
            },
            {
                title: '是否通过',
                key: 'action',
                render: (text, record,index) => (
                    <span>
                  <a>是</a>
                  <Divider type="vertical"/>
                  <a>否</a>
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
        return (
            <div className='admin'>
                <div className={'header'}>
                    <div className='left'>
                        <div className='logo'>
                            <img src={require('../../img/LOGO2.png')}/>
                        </div>
                        <p>管理员中心</p>
                    </div>
                    <div className='right' style={{display: localStorage.getItem('userName') ? 'none' : 'block'}}>
                        <img src={require('../../img/admin.png')}/>
                        <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp登陆'}}
                              onClick={this.showModal.bind(this, 'login')}/>
                        <Modal
                            visible={this.state.login}
                            onCancel={this.handleCancel.bind(this)}
                            footer={''}
                        >
                            <Logins handleClose={this.handleCancel.bind(this)}/>
                        </Modal>
                        {/* <Login login={this.state.login} handleCancel={this.handleCancel.bind(this,'login')}/>
                                <Register register={this.state.register} handleCancel={this.handleCancel.bind(this,'register')}/> */}
                    </div>
                    <div className='right' style={{display: localStorage.getItem('userName') ? 'block' : 'none'}}>
                        <img src={require('../../img/admin.png')} style={{marginRight: '10px'}}/>
                        {localStorage.getItem('userName')}
                        <span onClick={this.clear.bind(this)} style={{marginLeft:'10px'}}>退出</span>
                    </div>
                </div>
                <div className={'menu'}>
                    <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition={'left'}>
                        <TabPane tab="审核经纪人、置业顾问注册" key="1">
                            <Tabs defaultActiveKey="11" onChange={this.callback.bind(this)}>
                                <TabPane tab="待审核经纪人" key="11">
                                    <Table columns={columns} dataSource={data} scroll={{x: 1800}}/>
                                </TabPane>
                                <TabPane tab="待审核置业顾问" key="12">
                                    <Table columns={consultant} dataSource={this.state.consultantData}/>
                                </TabPane>
                            </Tabs>
                        </TabPane>
                        <TabPane tab="审核入驻申请" key="2">
                            <Tabs defaultActiveKey="21" onChange={this.callback}>
                                <TabPane tab="经纪人入驻申请" key="21">
                                    <Table columns={agentColumns} dataSource={data} scroll={{x: 1400}}/>
                                </TabPane>
                                <TabPane tab="置业顾问入驻申请" key="22">
                                    <Table columns={consultantColumns} dataSource={data}/>
                                </TabPane>
                            </Tabs>
                        </TabPane>
                        <TabPane tab="管理经纪人、置业顾问、新房管理员权限" key="3">
                            <Tabs defaultActiveKey="31" onChange={this.callback.bind(this)}>
                                <TabPane tab="管理经纪人" key="31">
                                    <Table columns={agentControl} dataSource={data} scroll={{x: 1400}}/>
                                </TabPane>
                                <TabPane tab="管理置业顾问" key="32">
                                    <Table columns={consultantControl} dataSource={data}/>
                                </TabPane>
                                <TabPane tab="管理新房管理员" key={33}>
                                    <EditableTable dataSource={this.state.adminData}/>
                                    {/*<Table columns={bridalControl} dataSource={this.state.adminData} pagination={false}/>*/}
                                </TabPane>
                            </Tabs>
                        </TabPane>
                        <TabPane tab="修改密码" key="4">
                            <p>修改登陆密码</p>
                            <ChangePassWord></ChangePassWord>
                        </TabPane>
                    </Tabs>
                </div>
            </div>

        )
    }
}

export default connect(state=>(
    {userInformation:state.userInformation}),{setUserInformation})(Admin);