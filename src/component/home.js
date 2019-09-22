import React from 'react';
import Memu from './menu'
import routes from '../router/index';
import {Img, Button, DatePicker, Table, Input, message, Modal, InputNumber} from 'antd';
import '../css/home.scss'
import {HashRouter as Router, Route, Switch, Redirect, withRouter,Link} from 'react-router-dom';
import Agent from "../view/agent";
import BridalHome from "./bridalHome";
import BridalChamber from "../view/bridalChamber";
class Home extends React.Component {
    state = {
        key: this.props.location.pathname || '/bridalChamber',
        userName:'陈宗伟'
    }
    handleClick = (e) => {
        this.setState({
            key: e.key,

        });
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
                                state={this.state}
                            >
                            </Memu>
                        </div>
                        <div className='right' style={{display:this.state.userName?'none':'block'}}>
                            <img src={require('../img/login.png')}/>
                            <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp登陆/注册'}}/>
                        </div>
                        <div className='right' style={{display:this.state.userName?'block':'none'}}>
                            <img src={require('../img/login.png')} style={{marginRight:'10px'}}/>
                            <Link to={'/home/user'}>
                            <span style={{marginRight:'20px'}}>{this.state.userName}</span>
                            </Link>
                            <span>退出</span>
                        </div>
                    </div>
                </div>
                {this.props.children}
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

export default withRouter(Home);