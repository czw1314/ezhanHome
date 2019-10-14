import React from 'react'
import '../css/agent.scss'
import {Select, Button, Badge, Menu, Input, Checkbox, Modal, Pagination,Radio,Popconfirm,message} from 'antd';
import {searchAgent,getDistrictRegions} from '../api/index'

class Agent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positionChecked: [],
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
                    districtIds: [],
                    streetId:[],
                    searchText:this.state.searchText
                }
                searchAgent(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.models
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
                positionChecked:e.target.value,
                streetIdChecked:[]

            });
            let params={
                business:this.state.serviceChecked,
                positions:this.state.titleChecked,
                districtIds: id,
                streetIds:[],
                searchText:this.state.searchText
            }
            searchAgent(params).then((res)=>{
                if(res.data.code===1){
                    this.setState({
                        models:res.data.models
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
            districtIds: [this.state.positionChecked],
            streetIds:streetIdChecked,
            searchText:this.state.searchText
        }
        searchAgent(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models
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
            positions:this.state.titleChecked,
            districtIds: [this.state.positionChecked],
            streetIds:this.state.streetIdChecked,
            searchText:this.state.searchText
        }
        searchAgent(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models
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
            districtIds:[this.state.positionChecked],
            streetIds:this.state.streetIdChecked,
            searchText:this.state.searchText
        }

        searchAgent(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models
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
            districtIds:this.state.positionChecked,
            streetIds:this.state.streetIdChecked,
            searchText:value,
        }
        this.setState({
            searchText:value,
        })
        searchAgent(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models
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
        searchAgent().then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.models
                })
            }
        })
    }
    推荐经纪人

    recommend() {

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
    //登陆以后才能开二维码
    handleVisibleChange = (visible,index) => {

        // this.setState({ visible[index]:visible })

        // Determining condition before show the popconfirm.
        if (this.state.condition) {
            message.info('请先登陆');; // next step
        } else {
            let arr=this.state.visible
            arr[index]=!arr[index]
            this.setState({ visible:arr });
        }
    };
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
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>经纪人</p>
                    <img src={require('../img/Location2.png')} style={{height: 24, width: 16}}/>
                    <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp成都'}} className={'location'}/>
                    <Search
                        placeholder="搜索经纪人"
                        onSearch={this.search.bind(this)}
                        enterButton={suffix}
                        style={{ width: 200 }}
                    />
                </div>
                <div className={'condition'}>
                    <div className={'first'}>
                        <p>区域</p>
                        <Radio.Group name="radiogroup" onChange={this.onChange.bind(this)} value={this.state.positionChecked}>
                            {
                                this.state.position&&this.state.position.map(item=>{
                                        return(<Radio value={item.value}>{item.label}</Radio>)
                                })
                            }
                        </Radio.Group>

                    </div>
                        <CheckboxGroup
                            styke={{marginBottom:20}}
                            options={this.state.position[this.state.positionChecked]?this.state.position[this.state.positionChecked].regions:[]}
                            value={this.state.streetIdChecked}
                            onChange={this.onChangeStreetId.bind(this)}
                        />
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
                        找到<span>{this.state.models.length}</span>个经纪人
                    </div>
                    <div className={'sort'}>
                        <Menu onSelect={this.selected.bind(this)}>
                            <Menu.Item style={{fontSize: 18}} key={'default'}>默认排序</Menu.Item>
                            <Menu.Item key={'price'}
                                       onClick={this.recommend.bind(this)}>推荐经纪人</Menu.Item>
                            {/*<Menu.Item key={'time'}*/}
                            {/*onClick={this.toggle.bind(this, 'time')}>最新开盘{this.state.toggleTime ? '↑' : '↓'}</Menu.Item>*/}
                        </Menu>
                        <div className={'clear'} onClick={this.clear.bind(this)}>清空筛选条件</div>
                    </div>
                    <div className={'show'}>
                        <div className={'left'}>
                            {
                                this.state.models&&this.state.models.map((item,index)=>{
                                    return(
                                        <div className={`showItem ${index === this.state.models.length-1 ? 'last' : ''}`}>
                                            <div className={'left'}>
                                                <div className={'item'}>
                                                    <div className={'pic'}>
                                                        <img src={'http://47.108.87.104:8601/user/'+item.head}/>
                                                    </div>
                                                    <div className={'textBox'}>
                                                        <div className={'text'}>
                                                            <div className={'information'}>
                                                                <p className={'name'}>{item.name}<span>{item.position}</span></p>
                                                                <p className={'year'}>从业年限：{item.workingYears}年</p>
                                                            </div>
                                                            <div className={'service'}>
                                                                <p className={'area'}>熟悉区域：{
                                                                    item.streets&&item.streets.map(items=>{
                                                                        return(
                                                                            <span>
                                                                                {items}
                                                                            </span>

                                                                        )
                                                                    })
                                                                }</p>
                                                                <p className={'tag'}><span>服务：</span>专车接送 新房经纪 权证代办 贷款代办 二手房经纪</p>
                                                            </div>
                                                            <div className={'contact'}>
                                                                <p className={'phone'}><img src={require('../img/Phone.png')}/><span>联系电话：</span>{item.contact}</p>
                                                                <p className={'weixin'}><img src={require('../img/weixin.png')}/>
                                                                    <Popconfirm
                                                                        title=""
                                                                        visible={this.state.visible[index]}
                                                                        icon={<img src={'http://47.108.87.104:8601/user/'+item.wechatQrCode}/>}
                                                                        onVisibleChange={this.handleVisibleChange.bind(this,index,index)}
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                    >
                                                                        <span>添加微信：查看二维码</span>
                                                                    </Popconfirm>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className={'company'}>独立经纪人</p>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <Pagination
                                // onShowSizeChange={onShowSizeChange}
                                defaultCurrent={1}
                                total={500}
                            />
                        </div>
                        {/*<div className={'hot'}>*/}
                            {/*<p className={'title'}>热门楼盘</p>*/}
                            {/*<div className={'hotItem'}>*/}
                                {/*<img src={require('../img/hotItem.png')}/>*/}
                                {/*<div className={'title'}>*/}
                                    {/*<p className={'name'}>青白江天美广场</p>*/}
                                    {/*<p className={'price'}>5000元/m²起</p>*/}
                                {/*</div>*/}
                                {/*<div className={'center'}>*/}
                                    {/*<p className={'address'}>温江·温江大学城</p>*/}
                                    {/*<p className={'area'}>建面：89-132m²</p>*/}
                                {/*</div>*/}
                                {/*<p className={'tag'}>超高层住宅 别墅</p>*/}
                            {/*</div>*/}

                        {/*</div>*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default Agent