import React from 'react';
import '../css/user.scss';
import { Tabs,Input,Button,message,} from 'antd';
    import {getPersonMsg, cancelWechat, normalPersonMsg, concernedEstates, delconcernedEstate} from '../api'
    import ChangePassWords from '../component/changePassWord'
    import {connect} from "react-redux";
import {newEstateId} from "../redux/action";
class User extends React.Component {
    constructor(props){
        super(props)
        this.state={
            phone:'',
            head:'',
            name:'',
            weixin:{
                weChatName:'',
                weChatNumber:'',
                weChatAddr:'',
                weChatSex:''
            },
            nickname:'',
            estates:[]
        }
    }
    callback(key) {
        console.log(key);
    }
    //取消关注
    delStar(id,index){
        console.log(1)
        let params = {
            estateId:id,
            userId:localStorage.getItem('userId')
        }
        delconcernedEstate(params).then((res)=>{
            if(res.data.code==1){
                this.state.estates.splice(index, 1)
                message.success('成功取消关注楼盘')
                this.setState({
                    estates:this.state.estates
                })
            }
        })
    }
    changeName(){
        let params={
            "name": this.state.nickname,
  "userId": localStorage.getItem('userId')
        }
        normalPersonMsg(params).then((res)=>{
            if(res.data.code===1){
                message.success('昵称修改成功！')
                this.setState({
                    name:this.state.nickname
                })
                localStorage.setItem('userName',this.state.nickname)
            }
            else{
                message.error('昵称修改失败！')
            }
        })
    }
    componentDidMount(){
        let params={
            userId: localStorage.getItem('userId')
        }
        getPersonMsg(params).then((res) => {
            if(res.data.code===1){
                this.setState({
                    name:res.data.name,
                    phone:res.data.phone,
                    head:res.data.head,
                    weixin:res.data.weChatPersonMsg?res.data.weChatPersonMsg:this.state.weixin,
                    bindWechatOrNot:res.data.bindWechatOrNot
                })
            }
        })
        concernedEstates(params).then((res)=>{
            if(res.data.code===1){
                this.setState({estates:res.data.estates})
            }
        })
    }
    //绑定微信
    bindWeixin(){
        window.location='https://open.weixin.qq.com/connect/qrconnect?appid=wx53ba91de253ea23a&redirect_uri=http%3A%2F%2Fwww.ezhanhome.com&response_type=code&scope=snsapi_login&state=bind#wechat_redirect'
    }
    //解绑微信
    cancleWeixin(){
        let params={
            userId:localStorage.getItem('userId')
        }
        cancelWechat(params).then((res)=>{
            if(res.data.code===1){
                message.success('解绑成功')
                this.setState({
                    bindWechatOrNot:false
                })
            }
        })
    }
    //跳转到关注楼盘首页
    goTo(estateId){
        this.props.newEstateId(estateId)
        localStorage.setItem('estateId',estateId)
        this.props.history.push({pathname:'/home/bridalHome/bridalIndex', state:{
            star: 1,
            }})
    }
    render(){
        const { TabPane } = Tabs;

        return(
            <div className={'user'}>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>用户个人中心</p>
                </div>
                <div className={'userBox'}>
                    <div className={'container'}>
                    <div className={'menu'}>
                        <img className={'headerPic'} src={require('../img/agent.png')}/>
                        <p>欢迎您，{this.state.name}</p> 
                    </div>
                        <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition={'left'} tabBarStyle={{textAlign:'center',marginRight:20}}>
                            <TabPane tab="个人信息" key="1">
                                <p className={'data'}>基本资料</p>
                                <p>账号：{this.state.phone}</p>
                                <div style={{display:'flex',alignItems:'center'}}>
                                    <p className={'nickname'}>昵称</p>
                                    <Input placeholder="请输入昵称" style={{width:'160px',marginLeft:'18px'}} size={'large'} onChange={e=>this.setState({nickname:e.target.value})}/>
                                    <Button type="primary" style={{marginLeft:'40px'}} size={'large'} onClick={this.changeName.bind(this)}>确认修改</Button>
                                </div>
                                <div className={'weixin'} style={{display:this.state.bindWechatOrNot?'block':'none'}}>
                                    <p className={'h2'} >微信绑定（已绑定）</p>
                                    <div className={'weixinBox'}>
                                        <img src={this.state.weixin.weChatHeadUrl}/>
                                        <p>微信昵称：{this.state.weixin.weChatName}<br></br>微信账号：{this.state.weixin.weChatNumber}
                                        </p>
                                        <p>地区：{this.state.weixin.weChatAddr}<br></br>性别：{this.state.weixin.weChatSex}
                                        </p>
                                        <Button type="primary" style={{marginLeft:'40px'}} size={'large'} onClick={this.cancleWeixin}>解除绑定</Button>
                                    </div>
                                </div>
                                <div className={'weixin'} style={{display:this.state.bindWechatOrNot?'none':'block'}}>
                                    <div className={'weixinBox'} style={{marginTop:'30px'}}>
                                        <Button type="primary" style={{marginLeft:'40px'}} size={'large'} onClick={this.bindWeixin}>微信绑定</Button>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="关注的楼盘" key="2">
                                <p className={'data'} style={{marginBottom:'-20px'}}>关注的楼盘</p>
                                <div className={'synopsis'}>
                                    {
                                        this.state.estates&&this.state.estates.map((item,index)=>{
                                            return(
                                                <div className={'item'} key={index}>
                                                <img src={'http://47.108.87.104:8601/building/'+item.picture} onClick={this.goTo.bind(this,item.id)}/>
                                                <div className={'first'}>
                                                    <p className={'name'}>{item.name}</p>
                                                    <p className={'price'}>{item.referencePrice}<span style={{display:isNaN(parseInt(item.referencePrice))?'none':'inline-block'}}>元/m²起</span></p>
                                                </div>
                                                <div className={'second'}>
                                                    <p className={'address'}>{item.distinctName}</p>
                                                    <p className={'area'}>建面：{item.areaRange}m²</p>
                                                </div>
                                                <p className={'tag'}>{item.propertyType}</p>
                                                    <Button type="primary" style={{width:'200px',margin:'auto',display:'block'}} block onClick={this.delStar.bind(this,item.id,index)}>取消关注</Button>
                                            </div>
                                            )
                                        })
                                    }
                                </div>
                            </TabPane>
                            <TabPane tab="修改密码" key="3">
                                <p className={'data'}>修改密码</p>
                                <ChangePassWords role={5}></ChangePassWords>
                            </TabPane>
                        </Tabs>
                    </div>

                </div>
            </div>
        )
    }

}
export default connect(state => (
    {estateId: state.estateId}), {newEstateId})(User)