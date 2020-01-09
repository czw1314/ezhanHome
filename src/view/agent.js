import React from 'react'
import '../css/agent.scss'
import {Select, Button, Badge, Menu, Input, Checkbox, Modal, Pagination,Radio,Popconfirm,message} from 'antd';
import {searchAgent,getDistrictRegions} from '../api/index'

class Agent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positionChecked: [0],
            serviceChecked: [],
            streetIdChecked:[],
            titleChecked: [],
            searchText:'',
            position: [],
            visible: [],
            condition: !localStorage.getItem('userId'),
            service: [{label: '新房经纪', value: '新房经纪'}, {label: '二手房经纪', value: '二手房经纪'}, {
                label: '权证代办',
                value: '权证代办'
            }, {label: '贷款代办', value: '贷款代办'}, {label: '专车接送', value: '专车接送'}],
            title: ['房地产经纪人', '房地产经纪人协理'],
            togglePrice: true,
            toggleTime: true,
            models:[],
            orderType:0
        }
    }
    componentDidMount(){
        getDistrictRegions().then((res)=>{
            if(res.data.code==1){
                let arr=res.data.list.map((item,index)=>{
                    return{
                        value:item.id,
                        label:item.name,
                        regions:item.regions.map(items=>{
                            return{
                                value:items.id,
                                label:items.street,
                            }
                        })
                    }
                })
                arr.splice(0,0,{value:0,label:'不限'})
                this.setState({
                    position:arr
                })
                let params={
                    business:this.state.serviceChecked,
                    positions:this.state.titleChecked,
                    districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
                    streetId:[],
                    searchText:this.state.searchText||this.props.location.state?this.props.location.state.searchText:'',
                    pageNum:1,
                    pageSize:20
                }
                this.setState({
                    searchText:this.props.location.state?this.props.location.state.searchText:'',
                });
                searchAgent(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.models,
                            counts:res.data.counts
                        })
                    }
                })
            }
        })
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
    onChange =e => {
        let id=''
        if(e.target.value==0){
            id=[]
        }
        else {
            id=[e.target.value]
        }
            this.setState({
                positionChecked:[e.target.value],
                streetIdChecked:[]

            });
            let params={
                business:this.state.serviceChecked,
                positions:this.state.titleChecked,
                districtIds: id,
                orderType:this.state.orderType,
                streetIds:[],
                searchText:this.state.searchText,
                pageNum:1,
                pageSize:20
            }
            searchAgent(params).then((res)=>{
                if(res.data.code===1){
                    this.setState({
                        models:res.data.models,
                        counts:res.data.counts
                    })
                }
            })


    };
    onChangeStreetId = streetIdChecked => {
        console.log(streetIdChecked)
        this.setState({
            streetIdChecked
        });
        let params={
            business:this.state.serviceChecked,
            positions:this.state.titleChecked,
            districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetIds:streetIdChecked,
            orderType:this.state.orderType,
            searchText:this.state.searchText,
            pageNum:1,
            pageSize:20
        }
        searchAgent(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models,
                    counts:res.data.counts
                })
            }
        })
    };
    //选择服务
    onChangeService = serviceChecked => {
        this.setState({
            serviceChecked,
        });
        let params={
            business:serviceChecked,
            orderType:this.state.orderType,
            positions:this.state.titleChecked,
            districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetIds:this.state.streetIdChecked,
            searchText:this.state.searchText,
            pageNum:1,
            pageSize:20
        }
        searchAgent(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models,
                    counts:res.data.counts
                })
            }
        })
    };
    //选择职称
    onChangeTitle = titleChecked => {
        this.setState({
            titleChecked,
        });
        let params={
            business:this.state.serviceChecked,
            positions:titleChecked,
            orderType:this.state.orderType,
            districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetIds:this.state.streetIdChecked,
            searchText:this.state.searchText,
            pageNum:1,
            pageSize:20
        }

        searchAgent(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models,
                    counts:res.data.counts
                })
            }
        })
    };
    //价格排序
    selected(e) {
        this.setState({
            togglePrice: true,
            toggleTime: true
        })
        console.log(this.state.positionChecked)
    }
    search(value){
        let params={
            business:this.state.serviceChecked,
            positions:this.state.titleChecked,
            districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetIds:this.state.streetIdChecked,
            searchText:value,
            orderType:this.state.orderType,
            pageNum:1,
            pageSize:20
        }
        this.setState({
            searchText:value,
        })
        searchAgent(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models,
                    counts:res.data.counts
                })
            }
        })
    }
    clear(){
        this.setState({
            positionChecked: '',
            serviceChecked: [],
            streetIdChecked:[],
            titleChecked: [],
            searchText:'',
        })
        let params={
            business:[],
            positions:[],
            districtIds: [],
            streetId:[],
            searchText:''
        }
        searchAgent(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models,
                    counts:res.data.counts
                })
            }
        })
    }
    推荐经纪人

    recommend(str) {
        if(str=='star'){
            this.setState({
                orderType:1
            })
            let params={
                business:this.state.serviceChecked,
                positions:this.state.titleChecked,
                orderType:1,
                districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
                streetIds:this.state.streetIdChecked,
                searchText:this.state.searchText,
                pageNum:1,
                pageSize:20
            }
    
            searchAgent(params).then((res)=>{
                if(res.data.code===1){
                    this.setState({
                        models:res.data.models,
                        counts:res.data.counts
                    })
                }
            })
        }
        else{
            this.setState({
                orderType:0
            })
            let params={
                business:this.state.serviceChecked,
                positions:this.state.titleChecked,
                orderType:0,
                districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
                streetIds:this.state.streetIdChecked,
                searchText:this.state.searchText,
                pageNum:1,
                pageSize:20
            }
    
            searchAgent(params).then((res)=>{
                if(res.data.code===1){
                    this.setState({
                        models:res.data.models,
                        counts:res.data.counts
                    })
                }
            })
        }

    }
    info(src) {
        Modal.info({
            title: '',
            icon:'',
            okText:'',
            content: (
                <div>
                    <img src={'http://47.108.87.104:8601/user/'+src}/>
                </div>
            ),
            onOk() {},
        });
    }
    sure(){
        return false
    }
    //登录以后才能开二维码
    handleVisibleChange = (visible,index) => {

        // this.setState({ visible[index]:visible })

        // Determining condition before show the popconfirm.
        if (!localStorage.getItem('userId')) {
            message.info('请先登录');; // next step
        } else {
            let arr=this.state.visible
            arr[index]=!arr[index]
            this.setState({ visible:arr });
        }
    };
    page(index,size){
        let params={
            business:this.state.serviceChecked,
            positions:this.state.titleChecked,
            orderType:this.state.orderType,
            districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetIds:this.state.streetIdChecked,
            searchText:this.state.searchText,
            pageNum:index,
            pageSize:20
        }
        searchAgent(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models,
                    counts:res.data.counts
                })
            }
        })
    }
    render() {
        const {Search} = Input;
        const suffix = <Button><img src={require('../img/search1.png')}
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 5
                            }}/>
        </Button>;
        const CheckboxGroup = Checkbox.Group;
        return (
            <div className='agent'>
                                <div className={'title-box'}>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>经纪人</p>
                    <Search
                        placeholder="搜索经纪人"
                        value={this.state.searchText}
                        onChange={e=>this.setState({searchText:e.target.value})}
                        onSearch={this.search.bind(this)}
                        enterButton={suffix}
                        style={{width: 400}}
                        size={'large'}
                    />
                </div>
                <div className={'condition'}>
                    <div className={'first'}>
                        <p>区域</p>
                        <Radio.Group name="radiogroup" onChange={this.onChange.bind(this)} value={this.state.positionChecked[0]}>
                            {
                                this.state.position&&this.state.position.map(item=>{
                                        return(<Radio value={item.value} key={item.value}>{item.label}</Radio>)
                                })
                            }
                        </Radio.Group>

                    </div>
         
                    <div className={'second'} style={{marginTop: 10}}>
                        <p>服务</p>
                        <CheckboxGroup
                            options={this.state.service}
                            value={this.state.serviceChecked}
                            onChange={this.onChangeService}
                        />
                    </div>
                    <div className={'second'}>
                        <p>职称</p>
                        <CheckboxGroup
                            options={this.state.title}
                            value={this.state.titleChecked}
                            onChange={this.onChangeTitle}
                        />
                    </div>
                </div>
                <div className={'result'}>
                    <div className={'find'}>
                        找到<span>{this.state.counts}</span>个经纪人
                    </div>
                    <div className={'sort'}>
                        <Menu onSelect={this.selected.bind(this)} defaultSelectedKeys={['default']}>
                            <Menu.Item style={{fontSize: 18}} key={'default'} onClick={this.recommend.bind(this,'default')}>默认排序</Menu.Item>
                            <Menu.Item key={'star'}
                                       onClick={this.recommend.bind(this,'star')}>推荐经纪人</Menu.Item>
                            {/*<Menu.Item key={'time'}*/}
                            {/*onClick={this.toggle.bind(this, 'time')}>最新开盘{this.state.toggleTime ? '↑' : '↓'}</Menu.Item>*/}
                        </Menu>
                        <div className={'clear'} onClick={this.clear.bind(this)}>清空筛选条件</div>
                    </div>
                    </div>
                    </div>
                    <div className={'show'}>
                        <div className={'left'}>
                            {
                                this.state.models&&this.state.models.slice(0,10).map((item,index)=>{
                                    return(
                                        <div className={`showItem ${index === this.state.models.length-1||index === this.state.models.length-2 ? 'last' : ''}`} key={index}>
                                            <div className={'left'}>
                                                <div className={'item'}>
                                                    <div className={'pic'}>
                                                        <img src={'http://47.108.87.104:8601/user/'+item.head}/>
                                                    </div>
                                                    <div className={'textBox'}>
                                                        <div className={'text'}>
                                                            <p className={'name'}><span>{item.name}</span><span>{item.position}</span><span>工龄：{item.workingYears}年</span></p>
                                                            <div className={'service'}>
                                                                <p className={'area'}>区域：{
                                                                    item.streets&&item.streets.map(items=>{
                                                                        return(
                                                                            <span key={items}> 
                                                                                {items}
                                                                            </span>
                                                                        )
                                                                    })
                                                                }</p>
                                                                <p className={'tag'}><span>服务：</span>{
                                                                    item.businesses&&item.businesses.map(item=>{
                                                                        return(
                                                                            <span key={item}>{item}</span>
                                                                        )
                                                                    })
                                                                }</p>
                                                            </div>
                                                            <p className={'company'}>{item.agentType}</p>
                                                            <div className={'contact'}>
                                                                <p className={'weixin'}><img src={require('../img/weixin.png')}/>
                                                                    <Popconfirm
                                                                        title="微信扫描二维码添加经纪人"
                                                                        visible={this.state.visible[index]}
                                                                        icon={<img src={'http://47.108.87.104:8601/user/'+item.wechatQrCode}/>}
                                                                        onVisibleChange={this.handleVisibleChange.bind(this,index,index)}
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                    >
                                                                        <span>添加微信：查看微信二维码</span>
                                                                    </Popconfirm>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Pagination defaultCurrent={1} total={this.state.counts} pageSize={10} onChange={this.page.bind(this)}/>
                    </div>
                </div>
        )
    }
}

export default Agent