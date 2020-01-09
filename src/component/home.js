import React from 'react';
import Memu from './menu'
import routes from '../router/index';
import {Img} from 'antd';
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
        //弹出注册登录框
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
            //退出登录
    clear(){
        this.props.setUserInformation({})
        localStorage.setItem('state','')
        localStorage.setItem('userName','')
        localStorage.setItem('role','')
        localStorage.setItem('userId','')
        localStorage.setItem('phone','')
        if(this.props.location.pathname=='/home/user'||this.props.location.pathname=='/home/agentMy'||this.props.location.pathname=='/home/consultant'||this.props.location.pathname=='/home/registryCenter'){
            this.props.history.push('/homePage')
        }
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
        if (this.props.userInformation.role === 5 || localStorage.getItem('role') == 5) {
            return (
                <Link to={'/home/user'}>
                    <img src={require('../img/login.png')} style={{marginRight: '10px'}}/>
                    <span
                        style={{marginRight: '20px'}}>{this.props.userInformation.name || localStorage.getItem('userName')}</span>
                </Link>
            )
        }
        else if ((this.props.userInformation.role === 3 || localStorage.getItem('role') == 3)&&localStorage.getItem('state')==1) {
            return (
                <Link to={'/home/agentMy'}>
                    <img src={require('../img/login.png')} style={{marginRight: '10px'}}/>
                    <span
                        style={{marginRight: '20px'}}>{this.props.userInformation.name || localStorage.getItem('userName')}</span>
                </Link>
            )
        }
        else if ((this.props.userInformation.role === 3 || localStorage.getItem('role') == 3)) {
            return (
                <Link to={'/home/registryCenter'}>
                    <img src={require('../img/login.png')} style={{marginRight: '10px'}}/>
                    <span
                        style={{marginRight: '20px'}}>{this.props.userInformation.name || localStorage.getItem('userName')}</span>
                </Link>
            )
        }
        else if ((this.props.userInformation.role === 4 || localStorage.getItem('role') == 4)&&localStorage.getItem('state')==1) {
            return (
                <Link to={'/home/consultant'}>
                    <img src={require('../img/login.png')} style={{marginRight: '10px'}}/>
                    <span
                        style={{marginRight: '20px'}}>{this.props.userInformation.name || localStorage.getItem('userName')}</span>
                </Link>
            )
        }
        else if ((this.props.userInformation.role === 4 || localStorage.getItem('role') == 4)) {
            return (
                <Link to={'/home/registryCenter'}>
                    <img src={require('../img/login.png')} style={{marginRight: '10px'}}/>
                    <span
                        style={{marginRight: '20px'}}>{this.props.userInformation.name || localStorage.getItem('userName')}</span>
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
                                <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp登录&nbsp&nbsp/'}} onClick={this.showModal.bind(this,'login')}/>
                                <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp&nbsp注册'}} onClick={this.showModal.bind(this,'register')}/>
                                <Login login={this.state.login} handleCancel={this.handleCancel.bind(this,'login')}/>
                                <Register register={this.state.register} handleCancel={this.handleCancel.bind(this,'register')}/>
                            </div>
                            <div className='right' style={{display:this.props.userInformation.userName||localStorage.getItem('userName')?'block':'none'}}>
                                {this.link()}
                                <span onClick={this.clear.bind(this)}>退出</span>
                            </div>
                    </div>
                </div>
                {this.props.children}
                <div style={{backgroundColor:"#f2f5f8"}}>
                <div className={'bottomSide'} style={{backgroundColor:(this.props.location.pathname=='/home/user'||this.props.location.pathname=='/home/consultant'||this.props.location.pathname=='/home/agentMy')?"#f2f5f8":"#fff"}}>
                    <p>友情链接</p>
                    <ul className={'chain'}>
                        <li><a target='_blank' href={'http://www.funi.com/'}>透明房产网</a></li>
                        <li><a  target='_blank' href={'https://www.cdfangxie.com/'}>成都住宅与房地产协会</a></li>
                        <li><a target='_blank' href={'http://cdzj.chengdu.gov.cn/'}>成都市住房和城乡建设局</a></li>
                        <li><a target='_blank' href={'http://cdzfgjj.chengdu.gov.cn/'}>成都市住房公积金管理中心</a></li>
                        <li><a target='_blank' href={'http://www.scfx.cn/Main.aspx'}>四川省房地产协会</a></li>
                        <li><a target='_blank' href={'http://www.agents.org.cn'}>中国房地产经纪人</a></li>
                        <li><a target='_blank' href={'http://mpnr.chengdu.gov.cn/'}>成都市规划与自然资源局</a></li>
                        <li><a target='_blank' href={'https://mcmcrt.china-emu.cn/Chengdu/'}>程话成都地铁</a></li>
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
                            <div style={{textAlign:'center'}}>
                        <span>Copyright©2019 成都叁城房地产经纪有限公司 版权所有 ©</span>
                        <a target={'_blank'} href={'http://beian.miit.gov.cn/'} style={{color:'#666'}}> 蜀ICP备18023206号-2</a>
                </div>
                </div>
                        </div>
                    </div>
          
                </div>
            </div>
        )
    }
}

export default connect(state=>(
    {userInformation:state.userInformation,estateId: state.estateId}),{setUserInformation,newEstateId})(withRouter(Home))