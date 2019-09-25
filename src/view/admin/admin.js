import React from 'react'
import '../../css/admin.scss'
import {Select, Button, Badge, Menu, Input, Checkbox, Modal, Pagination,Tabs,Table, Divider, Tag} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            left: 13,
            login:false,
            register:false,
            serviceChecked: [],
            service: ['新房经纪'],
            titleChecked: [],
            title: ['房地产经纪人', '房地产经纪人协理'],
            apartmentChecked: [],
            apartment: ['三室两厅'],
            characteristicChecked: [],
            characteristic: ['现房'],
            togglePrice: true,
            toggleTime: true
        }
    }
    showModal = (str) => {
        if(str==='login'){
            this.setState({
                login: true,
            });
        }
        else if(str==='register'){
            this.setState({
                register: true,
            });
        }
    };
    //退出登陆
    clear(){
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

    render() {
        const { TabPane } = Tabs;
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
                  <Divider type="vertical" />
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
        return (
            <div className='admin'>
                <div className={'header'}>
                <div className='left'>
                    <div className='logo'>
                        <img src={require('../../img/LOGO2.png')}/>
                    </div>
                    <p>管理员中心</p>
            </div>
                    <div className='right' style={{display:localStorage.getItem('userName')?'none':'block'}}>
                                <img src={require('../../img/login.png')}/>
                                <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp登陆&nbsp&nbsp/'}} onClick={this.showModal.bind(this,'login')}/>
                                <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp&nbsp注册'}} onClick={this.showModal.bind(this,'register')}/>
                                {/* <Login login={this.state.login} handleCancel={this.handleCancel.bind(this,'login')}/>
                                <Register register={this.state.register} handleCancel={this.handleCancel.bind(this,'register')}/> */}
                            </div>
                            <div className='right' style={{display:localStorage.getItem('userName')?'block':'none'}}>
                                <img src={require('../../img/login.png')} style={{marginRight:'10px'}}/>
                        
                                <span onClick={this.clear.bind(this)}>退出</span>
                            </div>
                </div>
                <div className={'menu'}>
                <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition={'left'}>
    <TabPane tab="审核经纪人、置业顾问注册" key="1">
    <Tabs defaultActiveKey="11" onChange={this.callback}>
    <TabPane tab="待审核经纪人" key="11">
    <Table columns={columns} dataSource={data} scroll={{ x: 1800 }}/>
    </TabPane>
    <TabPane tab="待审核置业顾问" key="12">
      Content of Tab Pane 2
    </TabPane>
  </Tabs>,
    </TabPane>
    <TabPane tab="审核入驻申请" key="2">
      Content of Tab Pane 2
    </TabPane>
    <TabPane tab="管理经纪人、置业顾问、新房管理员权限" key="3">
      Content of Tab Pane 3
    </TabPane>
    <TabPane tab="修改密码" key="4">
      Content of Tab Pane 3
    </TabPane>
  </Tabs>
                    </div>
                </div>
    
        )
    }
}

export default Admin