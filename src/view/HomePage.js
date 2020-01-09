import React from 'react'
import '../css/homePage.scss'
import Login from '../component/login'
import Register from '../component/register'
import {HashRouter as Router, Route, Switch, Redirect, withRouter,Link} from 'react-router-dom';
import {Button, Form, Menu, Input, message, Modal, Popconfirm} from 'antd';
import {connect} from "react-redux";
import {setUserInformation, newEstateId} from "../redux/action";
import {getPopularEstate, searchEstate, searchAgent, login, getPhoneCode, bindPhone, bindWechat} from '../api/index'

class Phone extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '获取验证码',
            disabled: false,
            code: 'http://47.108.87.104:8501/user/verfiyCode'
        }
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    "phoneCode": values.phoneCode,
                    "phone": values.phone,
                    "userId":localStorage.getItem("userId")
                };
                bindPhone(params).then((res) => {
                    if (res.data.code === 0) {
                        message.error(res.data.msg)
                    }
                    else {
                        localStorage.setItem('phone',values.phone)
                        localStorage.setItem('password',values.phone.slice(5))
                        message.success('绑定成功！')
                        if((this.props.userInformation.role==3||this.props.userInformation.role==4)&&!this.props.userInformation.fillOrNot){
                            this.props.history.push({pathname: '/home/registryCenter'})
                        }
                        this.props.show()
                    }
                })
            }
        });
    };
    //获取手机验证码git 
    getCode() {
        if(!this.props.form.getFieldValue('phone')){
            message.error('请输入手机号！')
            return
        }
        let params = {phone: this.props.form.getFieldValue('phone')}
        getPhoneCode(params).then((res) => {
            if(res.data.code==0){
                message.error(res.data.msg)
                return
            }
            else{
                let that = this
                var wait = 60;
                function time() {
                    if (wait == 0) {
                        that.setState({text: "免费获取验证码", disabled: false})
                        wait = 60;
                    } else {
                        that.setState({text: "重新发送(" + wait + ")", disabled: true})
                        wait--;
                        setTimeout(function () {
                            time()
                        }, 1000)
                    }
                }
                time()
            }
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form" id={'phone'}>
                <Form.Item>
                    {getFieldDecorator('phone', {
                        rules: [{required: true, message: '请输入手机号!'}],
                    })(
                        <Input
                            size={'large'}
                            placeholder="请输入手机号"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('phoneCode', {
                        rules: [{required: true, message: '请输入短信验证码!'}],
                    })(
                        <Input size={'large'}
                               addonAfter={<Button style={{cursor: 'pointer', fontWeight: 'bold'}} block={true}
                                                   onClick={this.getCode.bind(this)}
                                                   disabled={this.state.disabled}>{this.state.text}</Button>}
                               placeholder="请输入短信验证码"/>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" size={'large'}>
                        确认绑定
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

const PhoneBind = connect(state => (
    {userInformation: state.userInformation}), {setUserInformation})(Form.create({name: 'normal_login'})(withRouter(Phone)));

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            left: 18,
            userName: this.props.userInformation.name || localStorage.getItem('userName'),
            role: this.props.userInformation.role || localStorage.getItem('role'),
            login: false,
            register: false,
            estates: [],
            new: [],
            agent: [],
            visible: [],
            condition: !this.props.userInformation.userId || !localStorage.getItem('userId'),
            placeholder: '请输入楼盘名',
            phoneShow: false,
            translateX: 0
        }
    }
    //获取信息
    componentDidMount() {
        //热门楼盘
        getPopularEstate().then((res) => {
            this.setState({
                estates: res.data.estates
            })
        })
        if(localStorage.getItem('phone')&&localStorage.getItem('password')){
            let params = {
                "password": localStorage.getItem('password'),
                "phone": localStorage.getItem('phone'),
                "role":localStorage.getItem('role'),
                "loginType": 2
            };
            login(params).then((res) => {
                if (res.data.code === 0) {
                }
                else {
                    localStorage.setItem('state', res.data.state)
                    localStorage.setItem('userName', res.data.name)
                    localStorage.setItem('role', res.data.role)
                    localStorage.setItem('userId', res.data.userId)
                }
            })
        }
        let params = {
            pageSize: 4,
            orderType: 3
        }
        //最新楼盘
        searchEstate(params).then((res) => {
            if (res.data.code === 1) {
                this.setState({
                    new: res.data.estates
                })
            }
        })
        //优秀经纪人
        let params1 = {
            business: [],
            positions: [],
            districtIds: [],
            streetId: [],
            searchText: '',
            pageSize: 12
        }
        searchAgent(params1).then((res) => {
            if (res.data.code === 1) {
                this.setState({
                    agent: res.data.models,
                    num: Math.floor(res.data.models.length / 4)
                })
            }
        })
        if (!localStorage.getItem('phone') && localStorage.getItem('role') == 3) {
            this.setState({phoneShow: true})
        }
        else if(!localStorage.getItem('phone')&& localStorage.getItem('role') == 4){
            this.setState({phoneShow: true})
        }
        else if (!localStorage.getItem('phone')&& localStorage.getItem('role') == 5) {
            this.setState({phoneShow: true})
        }
        else if(localStorage.getItem('phone')){
            if((localStorage.getItem('role')==3||localStorage.getItem('role')==4)&&localStorage.getItem('state')=='-1'){
                // this.props.history.push({pathname: '/home/registryCenter'})
            }
        }
        if (this.getQueryVariable('state') == 'bind') {
            let params = {
                userId: localStorage.getItem('userId'),
                code: this.getQueryVariable('code')
            }
            bindWechat(params).then((res) => {
                if (res.data.code === 1) {
                    message.success('微信绑定成功！')
                }
                else {
                    message.error(res.data.msg)
                }
            })
        }
        //微信登录
        else if (this.state.condition && this.getQueryVariable('state')) {
            let params = {
                "code": this.getQueryVariable('code'),
                "state": this.getQueryVariable('state'),
                "role": Number(this.getQueryVariable('state')),
                "loginType": 3
            }
            login(params).then((res) => {
                if (res.data.code === 0) {
                    message.error(res.data.msg)
                }
                else {
                    if(res.data.phone){
                        localStorage.setItem('password',res.data.phone.slice(5))
                    }
                    this.props.setUserInformation(res.data)
                    localStorage.setItem('state',res.data.state)
                    localStorage.setItem('phone',res.data.phone)
                    localStorage.setItem('userName', res.data.name)
                    localStorage.setItem('role', res.data.role)
                    localStorage.setItem('userId', res.data.userId)
                    localStorage.setItem('bind', res.data.bind)
                    if (!res.data.bind && this.getQueryVariable('state') == 3) {
                        this.setState({phoneShow: true})
                    }
                    else if(!res.data.bind && this.getQueryVariable('state') == 4){
                        this.setState({phoneShow: true})
                    }
                    else if (!res.data.bind && this.getQueryVariable('state') == 5) {
                        this.setState({phoneShow: true})
                    }
                    else if(res.data.bind){
                        if((res.data.role==3||res.data.role==4)&&!this.props.userInformation.fillOrNot){
                            this.props.history.push({pathname: '/home/registryCenter'})
                        }
                    }
                }
            })
        }
    }

    //弹出注册登录框
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
        localStorage.setItem('state','')
        localStorage.setItem('userName','')
        localStorage.setItem('role','')
        localStorage.setItem('userId','')
        localStorage.setItem('phone','')
        localStorage.setItem('password','')
        localStorage.setItem('bind','')
    }

    //登录或注册以后关闭弹框
    handleCancel = (str, userName) => {
        if (str === 'login') {
            this.setState({
                login: false,
                userName, userName
            });
        }
        else if (str === 'register') {
            this.setState({
                register: false,
            });
        }

    };
    //找房与找经纪人互相切换
    handleClick = e => {
        if (e.key == 2) {
            this.setState({left: 94, placeholder: '请输入经纪人名字',key:2});
        }
        else {
            this.setState({left: 18, placeholder: '请输入楼盘名',key:1});
        }

    };

    //根据url获取微信登录的code、state
    getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }

    //根据用户类型跳转不同页面
    link() {
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

    //跳转到对应楼盘的首页
    linkTo(estateId) {
        this.props.newEstateId(estateId)
        localStorage.setItem('estateId',estateId)
        this.props.history.push('/home/bridalHome/bridalIndex')
    }

    //登录以后才能开二维码
    handleVisibleChange = (visible, index) => {
        if (!localStorage.getItem('userId')) {
            message.info('请先登录');
            ; // next step
        } else {
            let arr = this.state.visible
            arr[index] = !arr[index]
            this.setState({visible: arr});
        }
    };

    search(value) {
        if (this.state.key == 1) {
            this.props.history.push({
                pathname: '/home/bridalChamber', state: {
                    searchText: value
                }
            })
        }
        else {
            this.props.history.push({
                pathname: '/home/agent', state: {
                    searchText: value
                }
            })
        }
    }

    show() {
        this.setState({
            phoneShow: false
        })
    }

    goLeft() {
        this.setState({
            translateX: this.state.translateX + 1201 > 0 ? 0 : this.state.translateX + 1201,
        })
    }

    goRight() {
        this.setState({
            translateX: this.state.translateX - 1201 > (-this.state.num * 1201) ? this.state.translateX - 1201: -this.state.num * 1201,
        })
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
                <Modal
                    visible={this.state.phoneShow}
                    width={400}
                    maskClosable={false}
                    closable={false}
                    footer={''}
                    onCancel={this.show.bind(this)}
                >
                    <p className={'title'}>您还未绑定手机号，请先绑定手机号</p>
                    <PhoneBind show={this.show.bind(this)}></PhoneBind>
                </Modal>
                <div className='headerBox'>
                    <div className='header'>
                        <div className='left'>
                            <img src={require('../img/LOGO.png')} className='logo'/>
                        </div>
                        <div className='right'>
                            <Menu>
                                <Menu.Item
                                    key='/home/bridalChamber'
                                >
                                    <Link to={'/home/bridalChamber'}>
                                        <span>
                                        找新房
                                        </span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key='/home/agent'
                                >
                                    <Link to={'/home/agent'}>
                                        找经纪人
                                    </Link>

                                </Menu.Item>
                                <Menu.Item
                                    key='c'
                                >
                                    关于我们
                                </Menu.Item>
                            </Menu>
                            <div className='login'
                                 style={{display: this.props.userInformation.name || localStorage.getItem('userName') ? 'none' : 'flex'}}>
                                <img src={require('../img/login.png')}/>
                                <span dangerouslySetInnerHTML={{__html: '登录'}}
                                      onClick={this.showModal.bind(this, 'login')}/>
                                      <span style={{cursor: 'default'}}>/</span>
                                <span dangerouslySetInnerHTML={{__html: '注册'}}
                                      onClick={this.showModal.bind(this, 'register')}/>
                                <Login login={this.state.login} handleCancel={this.handleCancel.bind(this, 'login')}/>
                                <Register register={this.state.register}
                                          handleCancel={this.handleCancel.bind(this, 'register')}/>
                            </div>
                            <div className='login' style={{display: this.props.userInformation.name || localStorage.getItem('userName') ? 'block' : 'none'}}>
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
                            <Search placeholder={this.state.placeholder} onSearch={this.search.bind(this)}
                                    size="large" style={{marginTop: 5}} enterButton={enterButton}/>
                        </div>
                    </div>
                </div>
                <div className={'main'}>
                    <div className={'hot'}>
                        <div className={'header'}>
                            <p className={'left'}>热门楼盘</p>
                            <p className={'more'} onClick={(e) => {
                                this.props.history.push('/home/bridalChamber')
                            }}>查看更多楼盘</p>
                        </div>
                        <div className={'synopsis'}>
                            {
                                this.state.estates && this.state.estates.map((item, index) => {
                                    return (
                                        <div className={'item'} onClick={this.linkTo.bind(this, item.id)} key={index}>
                                            <div className={'rank'}>TOP{index + 1}</div>
                                            <div className={'text'}>效果图</div>
                                            <img src={'http://47.108.87.104:8601/building/' + item.picture}/>
                                            <div className={'first'}>
                                                <p className={'name'}>{item.name}</p>
                                                <p className={'price'}>{item.referencePrice}<span style={{display:isNaN(parseInt(item.referencePrice))?'none':'inline-block'}}>元/m²起</span></p>
                                            </div>
                                            <div className={'second'}>
                                                <p className={'address'}>{item.distinctName}-{item.street}</p>
                                                <p className={'area'}>建面：{item.areaRange}m²</p>
                                            </div>
                                            <p className={'tag'}>{item.propertyType}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={'new'}>
                        <div className={'header'}>
                            <p className={'left'}>最新开盘</p>
                            <p className={'more'} onClick={(e) => {
                                this.props.history.push('/home/bridalChamber')
                            }}>查看更多楼盘</p>
                        </div>
                        <div className={'synopsis'}>
                            {
                                this.state.new && this.state.new.map((item, index) => {
                                    return (
                                        <div className={'item'} onClick={this.linkTo.bind(this, item.id)} key={index}>
                                            <div className={'rank'}>TOP{index + 1}</div>
                                            <div className={'text'}>效果图</div>
                                            <img src={'http://47.108.87.104:8601/building/' + item.picture}/>
                                            <div className={'first'}>
                                                <p className={'name'}>{item.name}</p>
                                                <p className={'price'}>{item.referencePrice}<span style={{display:isNaN(parseInt(item.referencePrice))?'none':'inline-block'}}>元/m²起</span></p>
                                            </div>
                                            <div className={'second'}>
                                                <p className={'address'}>{item.distinctName}-{item.street}</p>
                                                <p className={'area'}>建面：{item.areaRange}m²</p>
                                            </div>
                                            <p className={'tag'}>{item.propertyType}</p>
                                            <p className={'time'}>上市时间：{item.timeToMarket}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={'agent'}>
                        <div className={'header'}>
                            <p className={'left'}>优秀经纪人</p>
                            <p className={'more'} onClick={(e) => {
                                this.props.history.push('/home/agent')
                            }}>更多优秀经纪人</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '1360px',
                            margin: 'auto',
                            justifyContent: 'space-between'
                        }}>
                            <div><img src={require('../img/go_left.png')} style={{width: '50px', height: '50px'}}
                                      onClick={this.goLeft.bind(this)}/></div>
                            <div style={{width: '1201px', overflow: 'hidden'}}>
                                <div className={'synopsis'}
                                     style={{transform: `translateX(${this.state.translateX}px)`}}>
                                    {
                                        this.state.agent && this.state.agent.map((item, index) => {
                                            return (
                                                <div className={'item'} key={index}>
                                                    <div className={'rank'}></div>
                                                    <img src={'http://47.108.87.104:8601/user/' + item.head}/>
                                                    <div className={'first'}>
                                                        <p className={'name'}>{item.name}</p>
                                                        <p className={'identity'}>{item.position}</p>
                                                    </div>
                                                    <div className={'second'}>
                                                        <div className={'address'}>
                                                            <p>区域：{
                                                                item.streets && item.streets.map((items, indexs) => {
                                                                    return (
                                                                        <span style={{marginRight: '10px'}}
                                                                              key={indexs}>
                                                                                {items}
                                                                            </span>

                                                                    )
                                                                })
                                                            }</p>
                                                        </div>
                                                    </div>
                                                    <div className={'thirst'}>
                                                        <p className={'service'}>服务：{
                                                            item.businesses && item.businesses.map((items, indexs) => {
                                                                return (
                                                                    <span className={'tag'} key={indexs}>{items}</span>
                                                                )
                                                            })
                                                        }</p>
                                                    </div>
                                                    {/* <p className={'phone'}>联系电话：{localStorage.getItem('userId') ? item.contact : '登录后查看'}
                                                    </p> */}
                                                    <p className={'weixin'}>
                                                        <Popconfirm
                                                        title="微信扫描二维码添加经纪人"
                                                        placement="topLeft"
                                                        visible={this.state.visible[index]}
                                                        icon={<img
                                                            src={'http://47.108.87.104:8601/user/' + item.wechatQrCode}/>}
                                                        onVisibleChange={this.handleVisibleChange.bind(this, index, index)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <span>添加微信：查看微信二维码</span>
                                                    </Popconfirm></p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div><img src={require('../img/go_right.png')} style={{width: '50px', height: '50px'}}
                                      onClick={this.goRight.bind(this)}/></div>
                        </div>

                    </div>
                </div>
                <div className={'bottomSide'}>
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
        )
    }
}

export default connect(state => (
    {userInformation: state.userInformation, estateId: state.estateId}), {setUserInformation, newEstateId})(HomePage);