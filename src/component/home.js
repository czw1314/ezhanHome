import React from 'react';
import Memu from './menu'
import routes from '../router/index';
import {Img, Button, DatePicker, Table, Input, message, Modal, InputNumber} from 'antd';
import '../css/home.scss'
import {HashRouter as Router, Route, Switch, Redirect, withRouter,Link} from 'react-router-dom';
import Agent from "../view/agent";
import BridalHome from "./bridalHome";
import {connect} from "react-redux";
import {setUserInformation,newEstateId} from "../redux/action";
import BridalChamber from "../view/bridalChamber";
import Login from './login'
import Register from './register'
class Home extends React.Component {
    state = {
        key: this.props.location.pathname || '/bridalChamber',
        userName:this.props.userInformation.name||localStorage.getItem('userName'),
        role:this.props.userInformation.role||localStorage.getItem('role'),
    }
    handleClick = (e) => {
        this.setState({
            key: e.key,

        });
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
    link(){
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
        return (
            <div className='home'>
                <div className='headerBox'>
                    <div className='header'>
                        <div className='left'>
                            <Memu
                                menus={routes.menus}
                                handle={this.handleClick}
                                state={this.props.location.pathname}
                            >
                            </Memu>
                        </div>
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
                {this.props.children}
                <div className={'bottomSide'}>
                    <p>友情链接</p>
                    <ul className={'chain'}>
                        <li><a target='_blank' href={'https://cd.5i5j.com/ershoufang?pmf_group=baidu&pmf_medium=cpc&pmf_plan=%E4%BA%8C%E6%89%8B%E6%88%BF-%E9%80%9A%E7%94%A8%E8%AF%8D&pmf_unit=%E4%BA%8C%E6%89%8B%E6%88%BF-%E4%B8%AD%E4%BB%8B&pmf_keyword=%E6%88%90%E9%83%BD%E6%88%BF%E4%BA%A7%E7%BD%91%E7%AB%99&pmf_account=21&pmf_id=135771085814'}>透明房产网</a></li>
                        <li><a  target='_blank' href={'https://www.cdfangxie.com/'}>成都住宅与房地产协会</a></li>
                        <li><a target='_blank' href={'http://cdzj.chengdu.gov.cn/'}>成都市住房和城乡建设局</a></li>
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
    {userInformation:state.userInformation,estateId: state.estateId}),{setUserInformation,newEstateId})(withRouter(Home))