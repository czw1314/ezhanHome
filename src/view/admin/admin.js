import React from 'react'
import '../../css/admin.scss'
import {Tabs, Table, Divider, Modal, Input, Button, Popconfirm, notification} from 'antd';
import ChangePassWord from '../../component/changePassWord'
import {connect} from "react-redux";
import {login, getAdmin, modifyHouseAdminPwd, getAdviser, aduitAgent, getAgent, settledAduit, delUser} from "../../api";
import {setUserInformation} from "../../redux/action";
import {Form, message} from "antd/lib/index";

class Login extends React.Component {
    //登录
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
                        message.success('登录成功！')
                        this.props.setUserInformation(res.data)
                        setTimeout(this.props.handleClose, 1000)
                    }
                })
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form" style={{marginTop: '30px'}}>
                <Form.Item>
                    {getFieldDecorator('phone', {
                        rules: [{required: true, message: '请输入手机号!'}],
                    })(
                        <Input
                            size={'large'}
                            autoComplete="off"
                            placeholder="请输入手机号"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码!'}],
                    })(
                        <Input
                            type="password"
                            autoComplete="off"
                            size={'large'}
                            placeholder="请输入密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" size={'large'}
                            style={{width: '100%'}}>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const Logins = connect(state => ({userInformation: state.userInformation}), {setUserInformation})(Form.create({name: 'normal_login'})(Login))
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
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
        this.setState({editing}, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const {record, handleSave} = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({...record, ...values});
        });
    };

    renderCell = form => {
        this.form = form;
        const {children, dataIndex, record, title} = this.props;
        const {editing} = this.state;
        return editing ? (
            <Form.Item style={{margin: 0}}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `请填写密码.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save}
                          style={{width: '200px'}}/>)}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{paddingRight: 24}}
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
                render: (text, record, index) =>
                    this.state.dataSource.length >= 1 ? (
                        <a onClick={() => this.handleDelete(record.key, index)}>确认修改</a>

                    ) : null,
            },
        ];

        this.state = {
            dataSource: [],
            count: 2,

        };
    }

    handleDelete = (key, index) => {
        let params = {
            phone: this.state.dataSource[index].phone,
            newPassword: this.state.dataSource[index].passWord,
            role: 0,

        }
        modifyHouseAdminPwd(params).then((res) => {
            if (res.data.code === 1) {
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确定
                    </Button>
                );
                notification.success({
                    message: '修改成功',
                    btn,
                    key,
                    duration: 0,
                });
            }
            else {
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确定
                    </Button>
                );
                notification.error({
                    message: '修改删除',
                    btn,
                    key,
                    duration: 0,
                });
            }
        })
    };


    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({dataSource: newData});
    };

    componentDidMount() {
        getAdmin().then((res) => {
            if (res.data.code === 1) {
                let data = res.data.admins, arr = []
                for (let i = 0; i < data.length; i++) {
                    let item = {
                        no: i + 1,
                        phone: data[i].phone,
                        passWord: '123456',
                    }
                    arr.push(item)
                }
                this.setState({
                    dataSource: arr
                })
            }

        })
    }

    render() {
        const {dataSource} = this.state;
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
                    pagination={false}
                />
            </div>
        );
    }
}

class Code extends React.Component {
    state = {visible: false};

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div>
                <p onClick={this.showModal} style={{cursor: 'pointer', marginBottom: 0}}>查看</p>
                <Modal
                    destroyOnClose={true}
                    title=""
                    centered
                    footer={null}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    className={'code'}
                >
                    <img src={this.props.src} style={{marginTop: '20px', with: '100%'}}/>
                </Modal>
            </div>
        );
    }
}

class CardCode extends React.Component {
    state = {visible: false};

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div>
                <p onClick={this.showModal} style={{cursor: 'pointer', marginBottom: 0}}>查看</p>
                <Modal
                    title=""
                    destroyOnClose={true}
                    footer={null}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    className={'code'}
                >
                    <img src={this.props.src} style={{marginTop: '20px', with: '100%'}}/>
                    <img src={this.props.src1} style={{marginTop: '20px', with: '100%'}}/>
                </Modal>
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
            adminData: [],
            consultantData: [],
            agentData: [],
            agentApplyData: [],
            consultantApplyData: [],
            agentControlData: [],
            consultantControlData: [],
            visible1: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
            visible6: false,
            visible7: false,
            visible8: false,
            visible9: false,
            visible10: false,
            visible11: false,
            visible12: false,
            userId: '',
            estateId: '',
            index: 0,
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

    //退出登录
    clear() {
        this.props.setUserInformation({})
        localStorage.clear()
    }

    //获取新房管理员列表
    callback(key) {

        if (key === '12') {
            let params = {
                type: 2
            }
            getAdviser(params).then((res) => {
                if (res.data.code === 1) {
                    this.setState({
                        consultantData: res.data.agentResponses
                    })
                }
            })
        }
        else if (key === '11' || key === '1') {
            let params = {
                type: 2
            }
            getAgent(params).then((res) => {
                if (res.data.code === 1) {
                    this.setState({
                        agentData: res.data.agentResponses
                    })
                }
            })
        }
        //经纪人楼盘入驻申请列表
        else if (key === '21' || key === '2') {
            let params = {
                type: 3
            }
            getAgent(params).then((res) => {
                if (res.data.code === 1) {
                    this.setState({
                        agentApplyData: res.data.agentResponses
                    })
                }
            })
        }
        //置业顾问楼盘入驻申请列表
        else if (key === '22') {
            let params = {
                type: 3
            }
            getAdviser(params).then((res) => {
                if (res.data.code === 1) {
                    this.setState({
                        consultantApplyData: res.data.agentResponses
                    })
                }
            })
        }
        //经纪人管理
        else if (key === '3' || key === '31') {
            let params = {
                type: 1
            }
            getAgent(params).then((res) => {
                if (res.data.code === 1) {
                    this.setState({
                        agentControlData: res.data.agentResponses
                    })
                }
            })
        }
        //置业顾问管理
        else if (key === '32') {
            let params = {
                type: 1
            }
            getAdviser(params).then((res) => {
                if (res.data.code === 1) {
                    this.setState({
                        consultantControlData: res.data.agentResponses
                    })
                }
            })
        }
    }

    //推荐经纪人
    recommend() {

    }

    //关闭登录弹框
    handleCancel() {
        this.setState({
            login: false
        })
    }

    //修改密码
    changePassWord(e) {
        console.log(e.target.value)
    }

    //是否通过
    pass(userId, type, str, index) {
        if (!this.props.userInformation.name) {
            const key = `open${Date.now()}`;
            const btn = (
                <Button type="primary" size="small" onClick={() => notification.close(key)}>
                    确定
                </Button>
            );
            notification.success({
                message: '请先登录',
                btn,
                key,
                duration: 0,
            });
            return
        }
        this.setState({
            visible4: false,
            visible5: false,
            visible6: false,
            visible7: false
        })
        let params = {
            userId: this.state.userId,
            pass: type,
        }
        aduitAgent(params).then((res) => {
                if (res.data.code === 1) {
                    if (type === 1) {
                        const key = `open${Date.now()}`;
                        const btn = (
                            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                确定
                            </Button>
                        );
                        notification.success({
                            message: '已通过注册',
                            btn,
                            key,
                            duration: 0,
                        });
                        if (str == 'agent') {
                            this.state.agentData.splice(this.state.index, 1)
                            this.setState({
                                    agentData: this.state.agentData
                                }
                            )

                        }
                        else if (str == 'consultant') {
                            this.state.consultantData.splice(this.state.index, 1)
                            this.setState({
                                    consultantData: this.state.consultantData
                                }
                            )
                        }
                    }
                    else {
                        const key = `open${Date.now()}`;
                        const btn = (
                            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                确定
                            </Button>
                        );
                        notification.success({
                            message: '已拒绝注册',
                            btn,
                            key,
                            duration: 0,
                        });
                        if (str == 'agent') {
                            this.state.agentData.splice(this.state.index, 1)
                            this.setState({
                                    agentData: this.state.agentData
                                }
                            )

                        }
                        else if (str == 'consultant') {
                            this.state.consultantData.splice(this.state.index, 1)
                            this.setState({
                                    consultantData: this.state.consultantData
                                }
                            )
                        }
                    }
                }
            }
        )
    }

    //是否通过楼盘入驻申请
    passApply(index, estateId, type, str, indexs) {
        if (!this.props.userInformation.name) {
            const key = `open${Date.now()}`;
            const btn = (
                <Button type="primary" size="small" onClick={() => notification.close(key)}>
                    确定
                </Button>
            );
            notification.success({
                message: '请先登录',
                btn,
                key,
                duration: 0,
            });
            return
        }
        this.setState({
            visible8: false, visible9: false, visible10: false, visible11: false
        })
        let params = {
            userId: this.state.userId,
            estateId: this.state.estateId,
            pass: type,
        }
        settledAduit(params).then((res) => {
                if (res.data.code === 1) {
                    if (type === 1) {
                        const key = `open${Date.now()}`;
                        const btn = (
                            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                确定
                            </Button>
                        );
                        notification.success({
                            message: '已通过申请',
                            btn,
                            key,
                            duration: 0,
                        });
                        if (str == 'agentApply') {
                            let params = {
                                type: 3
                            }
                            getAgent(params).then((res) => {
                                if (res.data.code === 1) {
                                    this.setState({
                                        agentApplyData: res.data.agentResponses
                                    })
                                }
                            })
                        }
                        else if (str == 'consultantApply') {
                            let params = {
                                type: 3
                            }
                            getAdviser(params).then((res) => {
                                if (res.data.code === 1) {
                                    this.setState({
                                        consultantApplyData: res.data.agentResponses
                                    })
                                }
                            })
                        }
                    }
                    else {
                        const key = `open${Date.now()}`;
                        const btn = (
                            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                确定
                            </Button>
                        );
                        notification.success({
                            message: '已拒绝申请',
                            btn,
                            key,
                            duration: 0,
                        });
                        if (str == 'agentApply') {
                            let params = {
                                type: 3
                            }
                            getAgent(params).then((res) => {
                                if (res.data.code === 1) {
                                    this.setState({
                                        agentApplyData: res.data.agentResponses
                                    })
                                }
                            })
                        }
                        else if (str == 'consultantApply') {
                            let params = {
                                type: 3
                            }
                            getAdviser(params).then((res) => {
                                if (res.data.code === 1) {
                                    this.setState({
                                        consultantApplyData: res.data.agentResponses
                                    })
                                }
                            })
                        }

                    }
                }
            }
        )
    }

    //删除经纪人、置业顾问
    delUserData(userId, str, index) {
        if (!this.props.userInformation.name) {
            console.log(1)
            const key = `open${Date.now()}`;
            const btn = (
                <Button type="primary" size="small" onClick={() => notification.close(key)}>
                    确定
                </Button>
            );
            notification.success({
                message: '请先登录',
                btn,
                key,
                duration: 0,
            });
            return
        }
        this.setState({
            visible6: false
        })
        let params = {
            userId: this.state.userId
        }
        delUser(params).then((res) => {
            if (res.data.code === 1) {
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确定
                    </Button>
                );
                notification.success({
                    message: '成功删除',
                    btn,
                    key,
                    duration: 0,
                });
                if (str === 'agent') {
                    this.state.agentControlData.splice(this.state.index, 1)
                    this.setState({
                            agentControlData: this.state.agentControlData
                        }
                    )

                }
                else if (str === 'consultant') {
                    this.state.consultantControlData.splice(this.state.index, 1)
                    this.setState({
                            consultantControlData: this.state.consultantControlData
                        }
                    )

                }

            }
            else {
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确定
                    </Button>
                );
                notification.success({
                    message: '删除失败',
                    btn,
                    key,
                    duration: 0,
                });
                // if (str === 'agent') {
                //     this.state.agentControlData.splice(0, 1)
                //     this.setState({
                //             agentControlData: this.state.agentControlData
                //         }
                //     )

                // }
                // else if (str === 'consultant') {
                //     this.state.consultantControlData.splice(0, 1)
                //     this.setState({
                //             consultantControlData: this.state.consultantControlData
                //         }
                //     )

                // }
            }
        })
    }

    componentDidMount() {
        if (!this.props.userInformation.name) {
            this.setState({login: true})
        }
        let params = {
            type: 2
        }
        getAgent(params).then((res) => {
            if (res.data.code === 1) {
                this.setState({
                    agentData: res.data.agentResponses
                })
            }
        })
    }

    render() {
        const {TabPane} = Tabs;
        //经纪人注册申请
        const agentColumns = [
            {
                title: '时间',
                dataIndex: 'createTime',
            },
            {
                title: '姓名',
                dataIndex: 'name',
            },
            {
                title: '头像',
                dataIndex: 'head',
                render: (text, record, index) => (
                    <img src={'http://47.108.87.104:8601/user/' + text} style={{width: 60}}/>
                ),
            },
            {
                title: '账号',
                dataIndex: 'phone',
            },
            {
                title: '二维码',
                dataIndex: 'weChatQrCode',
                render: (text, record, index) => (
                    <Code src={'http://47.108.87.104:8601/user/' + text}/>
                ),
            },
            {
                title: '公司',
                dataIndex: 'company',
            },
            {
                title: '服务区域',
                dataIndex: 'regions',
                render: (text, record, index) => (
                    <div>
                        {text && text.map(item => {
                            return (<p>{item.districtName + '—' + item.streetName}</p>)
                        })
                        }
                    </div>
                ),
            },
            {
                title: '身份证',
                dataIndex: 'cardNumber',
            },
            {
                title: '身份证照片',
                dataIndex: 'frontCard',
                render: (text, record, index) => (
                    <CardCode src={'http://47.108.87.104:8601/user/' + text}
                              src1={'http://47.108.87.104:8601/user/' + this.state.agentData[index].backCard}/>
                ),
            },
            {
                title: '职称',
                dataIndex: 'position',
            },
            {
                title: '职称照片',
                dataIndex: 'positionPicture',
                render: (text, record, index) => (
                    <Code src={'http://47.108.87.104:8601/user/' + text}/>
                ),
            },
            {
                title: '审核',
                key: 'action',
                render: (text, record, index) => (
                    <span>
                   <a onClick={() => {
                       if (!this.props.userInformation.name) {
                           const key = `open${Date.now()}`;
                           const btn = (
                               <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                   确定
                               </Button>
                           );
                           notification.success({
                               message: '请先登录',
                               btn,
                               key,
                               duration: 0,
                           });
                           return
                       }
                       this.setState({
                           visible5: true,
                           userId: this.state.agentData[index].personId,
                           index: index,
                           onOk: this.pass.bind(this, this.state.agentData[index].personId, 1, 'agent'),
                           title: '通过经纪人注册申请'
                       })
                   }}>是</a>
                  <Divider type="vertical"/>
                  <a onClick={() => {
                      if (!this.props.userInformation.name) {
                          const key = `open${Date.now()}`;
                          const btn = (
                              <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                  确定
                              </Button>
                          );
                          notification.success({
                              message: '请先登录',
                              btn,
                              key,
                              duration: 0,
                          });
                          return
                      }
                      this.setState({
                          visible5: true,
                          userId: this.state.agentData[index].personId,
                          index: index,
                          onOk: this.pass.bind(this, this.state.agentData[index].personId, -1, 'agent'),
                          title: "拒绝经纪人注册申请"
                      })
                  }}>否</a>
                </span>
                ),
            },
        ];
        //置业顾问注册申请
        const consultantColumns = [
            {
                title: '时间',
                dataIndex: 'createTime',
                key: 'createTime',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '头像',
                dataIndex: 'head',
                key: 'head',
                render: (text, record, index) => (
                    <img src={'http://47.108.87.104:8601/user/' + text} style={{width: 60}}/>
                ),
            },
            {
                title: '账号',
                key: 'phone',
                dataIndex: 'phone',
            },
            {
                title: '二维码',
                key: 'weChatQrCode',
                dataIndex: 'weChatQrCode',
                render: (text, record, index) => (
                    <Code src={'http://47.108.87.104:8601/user/' + text}/>
                ),
            },
            {
                title: '公司',
                key:
                    'company',
                dataIndex:
                    'company',
            }
            ,
            {
                title: '审核',
                key: 'action',
                render: (text, record, index) => (
                    <span>
                  <a onClick={() => {
                      if (!this.props.userInformation.name) {
                          const key = `open${Date.now()}`;
                          const btn = (
                              <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                  确定
                              </Button>
                          );
                          notification.success({
                              message: '请先登录',
                              btn,
                              key,
                              duration: 0,
                          });
                          return
                      }
                      this.setState({
                          visible5: true,
                          userId: this.state.consultantData[index].personId,
                          index: index,
                          onOk: this.pass.bind(this, this.state.consultantData[index].personId, 1, 'consultant'),
                          title: "通过置业顾问注册申请"
                      })
                  }}>是</a>
                  <Divider type="vertical"/>
                  <a onClick={() => {
                      if (!this.props.userInformation.name) {
                          const key = `open${Date.now()}`;
                          const btn = (
                              <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                  确定
                              </Button>
                          );
                          notification.success({
                              message: '请先登录',
                              btn,
                              key,
                              duration: 0,
                          });
                          return
                      }
                      this.setState({
                          visible7: true,
                          userId: this.state.consultantData[index].personId,
                          index: index,
                          onOk: this.pass.bind(this, this.state.consultantData[index].personId, -1, 'consultant'),
                          title: "拒绝置业顾问注册申请"
                      })
                  }}>否</a>
                </span>
                ),
            }
            ,
        ];
        //经纪人申请入驻
        const agentApply = [
            {
                title: '时间',
                dataIndex: 'createTime',
            },
            {
                title: '姓名',
                dataIndex: 'name',
            },
            {
                title: '头像',
                dataIndex: 'head',
                render: (text, record, index) => (
                    <img src={'http://47.108.87.104:8601/user/' + text} style={{width: 60}}/>
                ),
            },
            {
                title: '账号',
                dataIndex: 'phone',
            },
            {
                title: '二维码',
                dataIndex: 'weChatQrCode',
                render: (text, record, index) => (
                    <Code src={'http://47.108.87.104:8601/user/' + text}/>
                ),
            },
            {
                title: '公司',
                dataIndex: 'company',
            },
            {
                title: '服务区域',
                dataIndex: 'regions',
                render: (text, record, index) => (
                    <div>
                        {text && text.map(item => {
                            return (<p>{item.districtName + '—' + item.streetName}</p>)
                        })
                        }
                    </div>
                ),
            },
            {
                title: '职称',
                dataIndex: 'position',
            },
            {
                title: '入驻',
                dataIndex: 'estates',
                render: (text, record, index) => (
                    <ul>
                        {text && text.map(item => {
                            return (<li>{item.estateName}</li>)
                        })
                        }
                    </ul>
                ),
            },
            {
                title: '审核',
                dataIndex: 'estates',
                key: 'action',
                render: (text, record, index) => (
                    <div>
                        {text && text.map((item, indexs) => {
                            return (
                                <p>
                                    <a onClick={() => {
                                        if (!this.props.userInformation.name) {
                                            console.log(1)
                                            const key = `open${Date.now()}`;
                                            const btn = (
                                                <Button type="primary" size="small"
                                                        onClick={() => notification.close(key)}>
                                                    确定
                                                </Button>
                                            );
                                            notification.success({
                                                message: '请先登录',
                                                btn,
                                                key,
                                                duration: 0,
                                            });
                                            return
                                        }
                                        this.setState({
                                            visible5: true,
                                            userId: this.state.agentApplyData[index].personId,
                                            estateId: item.estateId,
                                            index: index,
                                            onOk: this.passApply.bind(this, index, item.estateId, 1, 'agentApply', indexs),
                                            title: "通过经纪人申请入驻"
                                        })
                                    }}>是</a>
                                    <Divider type="vertical"/>
                                    <a onClick={() => {
                                        this.setState({
                                            visible5: true,
                                            userId: this.state.agentApplyData[index].personId,
                                            estateId: item.estateId,
                                            index: index,
                                            onOk: this.passApply.bind(this, index, item.estateId, -1, 'agentApply', indexs),
                                            title: "拒绝经纪人申请入驻"
                                        })
                                    }}>否</a>
                                </p>
                            )
                        })
                        }
                    </div>

                ),
            },
        ];
        //置业顾问申请入驻
        const consultantApply = [
            {
                title: '时间',
                dataIndex: 'createTime',
                key: 'createTime',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '头像',
                dataIndex: 'head',
                key: 'head',
                render: (text, record, index) => (
                    <img src={'http://47.108.87.104:8601/user/' + text} style={{width: 60}}/>
                ),
            },
            {
                title: '账号',
                key: 'phone',
                dataIndex: 'phone',
            },
            {
                title: '二维码',
                key: 'weChatQrCode',
                dataIndex: 'weChatQrCode',
                render: (text, record, index) => (
                    <Code src={'http://47.108.87.104:8601/user/' + text}/>
                ),
            },
            {
                title: '公司',
                key:
                    'company',
                dataIndex:
                    'company',
            },
            {
                title: '入驻',
                dataIndex: 'estates',
                render: (text, record, index) => (
                    <div>
                        {text && text.map(item => {
                            return (<li>{item.estateName}</li>)
                        })
                        }
                    </div>
                ),
            },
            {
                title: '审核',
                key: 'action',
                dataIndex: 'estates',
                render: (text, record, index) => (
                    <div>
                        {text && text.map((item, indexs) => {
                            return (
                                <p>
                                    <a onClick={() => {
                                        if (!this.props.userInformation.name) {
                                            console.log(1)
                                            const key = `open${Date.now()}`;
                                            const btn = (
                                                <Button type="primary" size="small"
                                                        onClick={() => notification.close(key)}>
                                                    确定
                                                </Button>
                                            );
                                            notification.success({
                                                message: '请先登录',
                                                btn,
                                                key,
                                                duration: 0,
                                            });
                                            return
                                        }
                                        this.setState({
                                            visible10: true,
                                            userId: this.state.consultantApplyData[index].personId,
                                            estateId: item.estateId,
                                            index: index,
                                            onOk: this.passApply.bind(this, index, item.estateId, 1, 'consultantApply', indexs),
                                            title: "通过置业顾问申请入驻"
                                        })
                                    }}>是</a>
                                    <Divider type="vertical"/>
                                    <a onClick={() => {
                                        if (!this.props.userInformation.name) {
                                            const key = `open${Date.now()}`;
                                            const btn = (
                                                <Button type="primary" size="small"
                                                        onClick={() => notification.close(key)}>
                                                    确定
                                                </Button>
                                            );
                                            notification.success({
                                                message: '请先登录',
                                                btn,
                                                key,
                                                duration: 0,
                                            });
                                            return
                                        }
                                        this.setState({
                                            visible5: true,
                                            userId: this.state.consultantApplyData[index].personId,
                                            estateId: item.estateId,
                                            index: index,
                                            onOk: this.passApply.bind(this, index, item.estateId, -1, 'consultantApply', indexs),
                                            title: "拒绝置业顾问申请入驻"
                                        })
                                    }}>否</a>
                                </p>
                            )
                        })
                        }
                    </div>
                ),
            }
        ]
        //管理经纪人
        const agentControl = [
            {
                title: '时间',
                dataIndex: 'createTime',
            },
            {
                title: '姓名',
                dataIndex: 'name',
            },
            // {
            //     title: '头像',
            //     dataIndex: 'head',
            //     render: (text, record, index) => (
            //         <img src={'http://47.108.87.104:8601/user/' + text} style={{width: 60}}/>
            //     ),
            // },
            {
                title: '账号',
                dataIndex: 'phone',
            },
            {
                title: '状态',
                dataIndex: 'state',
            },
            // {
            //     title: '联系电话',
            //     dataIndex: 'contact',
            // },
            // {
            //     title: '微信二维码',
            //     dataIndex: 'weChatQrCode',
            //     render: (text, record, index) => (
            //         <Code src={'http://47.108.87.104:8601/user/' + text}/>
            //     ),
            // },
            // {
            //     title: '公司',
            //     dataIndex: 'company',
            // },
            // {
            //     title: '经纪人服务区域',
            //     dataIndex: 'regions',
            //     render: (text, record, index) => (
            //         <div>
            //             {text && text.map(item => {
            //                 return (<p>{item.districtName + '—' + item.streetName}</p>)
            //             })
            //             }
            //         </div>
            //     ),
            // },
            // {
            //     title: '身份证号',
            //     dataIndex: 'cardNumber',
            // },
            // {
            //     title: '查看身份证',
            //     dataIndex: 'frontCard',
            //     render: (text, record, index) => (
            //         <CardCode src={'http://47.108.87.104:8601/user/' + text}
            //                   src1={'http://47.108.87.104:8601/user/' + this.state.agentControlData[index].backCard}/>
            //     ),
            // },
            // {
            //     title: '职称',
            //     dataIndex: 'position',
            // },
            // {
            //     title: '查看职称证件',
            //     dataIndex: 'positionPicture',
            //     render: (text, record, index) => (
            //         <Code src={'http://47.108.87.104:8601/user/' + text}/>
            //     ),
            // },
            {
                title: '权限管理',
                key: 'action',
                render: (text, record, index) => (
                    <span>
                   <a onClick={() => {
                       if (!this.props.userInformation.name) {
                           const key = `open${Date.now()}`;
                           const btn = (
                               <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                   确定
                               </Button>
                           );
                           notification.success({
                               message: '请先登录',
                               btn,
                               key,
                               duration: 0,
                           });
                           return
                       }
                       this.setState({
                           visible6: true,
                           userId: this.state.agentControlData[index].personId,
                           index: index,
                           onOk1: this.delUserData.bind(this, 1, 'agent', index),
                           title1: "是否删除"
                       })
                   }}>删除</a>
                </span>
                ),
            },
        ];
        //管理置业顾问
        const consultantControl = [
            {
                title: '时间',
                dataIndex: 'createTime',
            },
            {
                title: '姓名',
                dataIndex: 'name',
            },
            {
                title: '账号',
                dataIndex: 'phone',
            },
            {
                title: '状态',
                dataIndex: 'state',
            },
            {
                title: '权限管理',
                key: 'action',
                render: (text, record, index) => (
                    <span>
                    <a onClick={() => {
                        if (!this.props.userInformation.name) {
                            const key = `open${Date.now()}`;
                            const btn = (
                                <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                    确定
                                </Button>
                            );
                            notification.success({
                                message: '请先登录',
                                btn,
                                key,
                                duration: 0,
                            });
                            return
                        }
                        this.setState({
                            visible6: true,
                            userId: this.state.consultantControlData[index].personId,
                            index: index,
                            onOk1: this.delUserData.bind(this, this.state.consultantControlData[index].personId, 'consultant'),
                            title1: "是否删除"
                        })
                    }}>删除</a>
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
                render: () => (<Input onChange={this.changePassWord.bind(this)}/>)
            },
            {
                title: '更新密码',
                render: () => (<Button>确认修改</Button>)
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
                render: (text, record, index) => (
                    <img src={''}/>
                ),
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
                render: (text, record, index) => (
                    <span>
                            <a>是</a>
                            <Divider type="vertical"/>
                            <a>否</a>
                            </span>
                ),
            },
        ];
        return (
            <div className='admin'>
                <Modal
                    title={this.state.title}
                    visible={this.state.visible5}
                    centered
                    keyboard={false}
                    destroyOnClose={true}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.state.onOk}
                    onCancel={() => {
                        this.setState({visible5: false})
                    }}
                >
                </Modal>
                <Modal
                    title={this.state.title1}
                    destroyOnClose={true}
                    okText="确认"
                    cancelText="取消"
                    visible={this.state.visible6}
                    onOk={this.state.onOk1}
                    onCancel={() => {
                        this.setState({visible6: false})
                    }}
                >
                    <p>删除以后将不可恢复，请谨慎选择!</p>
                </Modal>
                <div className={'header'}>
                    <div className='left'>
                        <div className='logo'>
                            <img src={require('../../img/LOGO2.png')}/>
                        </div>
                        <p>管理员中心</p>
                    </div>
                    <div className='right' style={{display: this.props.userInformation.name ? 'none' : 'block'}}>
                        <img src={require('../../img/admin.png')}/>
                        <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp登录'}}
                              onClick={this.showModal.bind(this, 'login')}/>
                        <Modal
                            visible={this.state.login}
                            maskStyle={{backgroundColor: "black"}}
                            destroyOnClose={true}
                            maskClosable={false}
                            closable={false}
                            width={390}
                            onCancel={this.handleCancel.bind(this)}
                            footer={''}
                        >
                            <p style={{fontSize: '22px'}}>超级管理员登录</p>
                            <Logins handleClose={this.handleCancel.bind(this)}/>
                        </Modal>
                        {/* <Login login={this.state.login} handleCancel={this.handleCancel.bind(this,'login')}/>
                                <Register register={this.state.register} handleCancel={this.handleCancel.bind(this,'register')}/> */}
                    </div>
                    <div className='right' style={{display: this.props.userInformation.name ? 'block' : 'none'}}>
                        <img src={require('../../img/admin.png')} style={{marginRight: '10px'}}/>
                        <span style={{marginRight: '20px'}}>{this.props.userInformation.name}</span>
                        <span onClick={this.clear.bind(this)} style={{marginLeft: '10px'}}>退出</span>
                    </div>
                </div>
                <div className={'menu'}>
                    <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)} tabPosition={'left'}>
                        <TabPane tab="注册审核" key="1">
                            <Tabs defaultActiveKey="11" onChange={this.callback.bind(this)}>
                                <TabPane tab="待审核经纪人" key="11">
                                    <Table columns={agentColumns} dataSource={this.state.agentData} pagination={false}/>
                                </TabPane>
                                <TabPane tab="待审核置业顾问" key="12">
                                    <Table columns={consultantColumns} dataSource={this.state.consultantData}
                                           pagination={false}/>
                                </TabPane>
                            </Tabs>
                        </TabPane>
                        <TabPane tab="入驻审核" key="2" onChange={this.callback.bind(this)}>
                            <Tabs defaultActiveKey="21" onChange={this.callback.bind(this)}>
                                <TabPane tab="经纪人入驻申请" key="21">
                                    <Table columns={agentApply} dataSource={this.state.agentApplyData}
                                           pagination={false}/>
                                </TabPane>
                                <TabPane tab="置业顾问入驻申请" key="22" onChange={this.callback.bind(this)}>
                                    <Table columns={consultantApply} dataSource={this.state.consultantApplyData}
                                           pagination={false}/>
                                </TabPane>
                            </Tabs>
                        </TabPane>
                        <TabPane tab="权限管理" key="3">
                            <Tabs defaultActiveKey="31" onChange={this.callback.bind(this)}>
                                <TabPane tab="管理经纪人" key="31">
                                    <Table columns={agentControl} dataSource={this.state.agentControlData}
                                           pagination={false}/>
                                </TabPane>
                                <TabPane tab="管理置业顾问" key="32">
                                    <Table columns={consultantControl} dataSource={this.state.consultantControlData}
                                           pagination={false}/>
                                </TabPane>
                                <TabPane tab="管理新房管理员" key='33'>
                                    <EditableTable dataSource={this.state.adminData} pagination={false}/>
                                </TabPane>
                            </Tabs>
                        </TabPane>
                        <TabPane tab="密码修改" key="4">
                            <p>修改登录密码</p>
                            <ChangePassWord></ChangePassWord>
                        </TabPane>
                    </Tabs>
                </div>
            </div>

        )
    }
}

export default connect(state => (
    {userInformation: state.userInformation}), {setUserInformation})(Admin);