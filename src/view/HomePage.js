import React from 'react'
import '../css/homePage.scss'
import Login from '../component/login'
import Register from '../component/register'
import { Link } from 'react-router-dom';
import {Select, Button, Badge, Menu, Input, message, Modal, InputNumber} from 'antd';
import {connect} from "react-redux";
import {setUserInformation} from "../redux/action";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            left: 13,
            userName:this.props.userInformation.name||localStorage.getItem('userName'),
            role:this.props.userInformation.role||localStorage.getItem('role'),
            login:false,
            register:false
        }
    }
    //弹出注册登陆框
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
    handleCancel = (str,userName) => {
        if(str==='login'){
            this.setState({
                login: false,
                userName,userName
            });
        }
        else if(str==='register'){
            this.setState({
                register: false,
            });
        }

    };
    //找房与找经纪人互相切换
    handleClick = e => {
        if (e.key == 2) {

            this.setState({left: 80});
        }
        else {
            this.setState({left: 13});
        }

    };
    //根据用户类型跳转不同页面
    link(){
        console.log(localStorage.getItem('role'))
            if(this.props.userInformation.role===5||localStorage.getItem('role')==5){
                return(
                    <Link to={'/home/user'}>
                        <span style={{marginRight:'20px'}}>{this.props.userInformation.userName||localStorage.getItem('userName')}</span>
                    </Link>
                )
            }
            else if(this.props.userInformation.role===5||localStorage.getItem('role')==3){
                return(
                    <Link to={'/home/agentMy'}>
                        <span style={{marginRight:'20px'}}>{this.props.userInformation.userName||localStorage.getItem('userName')}</span>
                    </Link>
                )
            }
            else if(this.props.userInformation.role===4||localStorage.getItem('role')==4){
                return(
                    <Link to={'/home/consultant'}>
                        <span style={{marginRight:'20px'}}>{this.props.userInformation.userName||localStorage.getItem('userName')}</span>
                    </Link>
                )
            }
    }

    render() {
        const {Search} = Input;
        const enterButton = <div style={{fontSize: 18, fontWeight: 'bold'}}><img src={require('../img/search.png')}
                                                                                 style={{
                                                                                     width: 20,
                                                                                     height: 20,
                                                                                     marginRight: 5
                                                                                 }}/><span>搜索</span></div>;
        return (
            <div className='homePage'>
                <div className='headerBox'>
                    <div className='header'>
                        <div className='left'>
                            <img src={require('../img/LOGO.png')} className='logo'/>
                            <img src={require('../img/Location.png')}/>
                            <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp成都'}}/>
                        </div>
                        <div className='right'>
                            <Menu>
                            <Menu.Item
                                key='a'
                            >
                                <Link to={'/home/bridalChamber'}>
                                找新房
                                </Link>
                            </Menu.Item>
                            <Menu.Item
                                key='b'
                            >
                                找经纪人
                            </Menu.Item>
                                <Menu.Item
                                    key='c'
                                >
                                    关于我们
                                </Menu.Item>
                        </Menu>
                            <div className='right' style={{display:this.props.userInformation.userName||localStorage.getItem('userName')?'none':'block'}}>
                                <img src={require('../img/login.png')}/>
                                <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp登陆&nbsp&nbsp/'}} onClick={this.showModal.bind(this,'login')}/>
                                <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp&nbsp注册'}} onClick={this.showModal.bind(this,'register')}/>
                                <Login login={this.state.login} handleCancel={this.handleCancel.bind(this,'login')}/>
                                <Register register={this.state.register} handleCancel={this.handleCancel.bind(this,'register')}/>
                            </div>
                            <div className='right' style={{display:this.props.userInformation.userName||localStorage.getItem('userName')?'block':'none'}}>
                                <img src={require('../img/login.png')} style={{marginRight:'10px'}}/>
                                {this.link()}
                                <span onClick={this.clear.bind(this)}>退出</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='background'>
                    <div className={'search-box'}>
                    <div className={'search'}>
                        <div className={'advertisement'}><span style={{fontSize: 90}}>e</span>站房屋 成都住宅专家</div>
                        <Menu mode="horizontal" defaultSelectedKeys={['1']} className={'menu'}
                              onClick={this.handleClick}>
                            <Menu.Item
                                key='1'
                            >
                                找新房
                            </Menu.Item>
                            <Menu.Item
                                key='2'
                            >
                                找经纪人
                            </Menu.Item>
                            <i style={{left: this.state.left}}></i>
                        </Menu>
                        <Search placeholder="input search text" onSearch={value => console.log(value)} enterButton
                                size="large" style={{marginTop: 5}} enterButton={enterButton}/>
                    </div>
                    </div>
                </div>
                <div className={'main'}>
                    <div className={'hot'}>
                        <div className={'header'}>
                            <p className={'left'}>热门楼盘</p>
                            <p className={'more'}>查看更多楼盘</p>
                        </div>
                        <div className={'synopsis'}>
                            <div className={'item'}>
                                <div className={'rank'}>TOP1</div>
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
                    </div>
                    <div className={'new'}>
                        <div className={'header'}>
                            <p className={'left'}>最新开盘</p>
                            <p className={'more'}>查看更多楼盘</p>
                        </div>
                        <div className={'synopsis'}>
                            <div className={'item'}>
                                <div className={'rank'}>TOP1</div>
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
                                <p className={'time'}>上市时间：2019-08-8</p>
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
                    </div>
                    <div className={'agent'}>
                        <div className={'header'}>
                            <p className={'left'}>优秀经纪人</p>
                            <p className={'more'}>更多优秀经纪人</p>
                        </div>
                        <div className={'synopsis'}>
                            <div className={'item'}>
                                <div className={'rank'}></div>
                                <img src={require('../img/hot.png')}/>
                                <div className={'first'}>
                                    <p className={'name'}>周宇航</p>
                                    <p className={'identity'}>房地产经纪人</p>
                                </div>
                                <div className={'second'}>
                                    <div className={'address'}>
                                        <p>熟悉区域：</p>
                                        <p>天府新区 - 华阳街道</p>
                                    </div>
                                    <div className={'area'}>
                                        <p>天府新区 - 万安镇</p>
                                        <p>天府新区 - 太平镇</p>
                                    </div>
                                </div>
                                <div className={'thirst'}>
                                    <p className={'service'}>服务：</p>
                                    <p className={'tag'}>专车接送 新房经纪 权证代办 贷款代办 二手房经纪</p>
                                </div>
                                <p className={'phone'}>联系电话：登陆后可查看</p>
                                <p className={'weixin'}>添加微信：登陆后可查看</p>
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
                    </div>
                </div>
                <div className={'bottomSide'}>
                    <p>友情链接</p>
                    <ul className={'chain'}>
                        <li><a href={''}>透明房产网</a></li>
                        <li><a href={''}>成都住宅与房地产协会</a></li>
                        <li><a href={''}>成都市住房和城乡建设局</a></li>
                    </ul>
                    <div className={'company'}>
                        <img src={require('../img/bottomLogo.png')}/>
                        <div className={'right'}>
                            <ul>
                                <li><a href={''}>关于我们</a></li>
                                <li><a href={''}>联系我们</a></li>
                                <li><a href={''}>用户协议</a></li>
                                <li><a href={''}>免责申明</a></li>
                            </ul>
                            {/*<div>*/}
                                {/*<a target={'_blank'} href={''}>成都XXXXX科技有限公司| 成ICP备18000836号-1 | ©版权所有©2019 ke.com版权所有</a>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state=>(
    {userInformation:state.userInformation}),{setUserInformation})(HomePage);