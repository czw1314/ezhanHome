import React from 'react'
import '../css/briadlChamber.scss'
import {Radio, Menu, Input, Checkbox, Pagination} from 'antd';
import { Link } from 'react-router-dom';
import {searchEstate,getDistrictRegions,getTraits,getPopularEstate} from '../api/index'
import {connect} from "react-redux";
import {newEstateId} from "../redux/action";

class BridalChamber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positionChecked: [],
            position: [],
            priceChecked: [],
            streetIdChecked:[],
            areasChecked:[],
            price: [{label: '8000元/m²以下', value: '8000'},{label: '8000-11000元/m²', value: '8000-11000'},
                {label: '11000-15000元/m²', value: '11000-15000'},{label: '15000-20000元/m²', value: '15000-20000'},{label: '20000-30000元/m²', value: '20000-30000'},{label: '30000元/m²以上', value: '30000'}],
            areaChecked: [],
            area: [{label: '50/m²以下', value: '50'},{label: '50-80m²', value: '50-80'},{label: '80-110m²', value: '80-110'},{label: '110-150m²', value: '110-150'},{label: '150-200m²', value: '150-200'},{label: '200m²以上', value: '200'}],
            apartmentChecked: [],
            apartment: [{label: '一居室', value: '一居室'},{label: '二居室', value: '二居室'},{label: '三居室', value: '三居室'},{label: '四居室', value: '四居室'},{label: '五居室', value: '五居室'},{label: '五居室以上', value: '五居室以上'}],
            characteristicChecked: [],
            characteristic: [],
            togglePrice: true,
            toggleTime: true,
            orderType:0,
            models:[],
            key:'',
            estates:[],
            modelsShow:[],
            counts:'',
            searchText:'',
            index:1
        }
    }
    componentDidMount(){
        //获取区域
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
            }
        })
        //搜索楼盘
        let params={
            area:this.state.areasChecked,
            housingTypes:this.state.apartmentChecked,
            orderType:0,
            prices:this.state.priceChecked,
            traitIds:this.state.characteristicChecked,
            districtIds: (this.props.location.state&&this.props.location.state.districtIds)?[this.props.location.state.districtIds]:[],
            streetId:[],
            searchText:this.state.searchText||this.props.location.state?this.props.location.state.searchText:'',
            pageNum:1,
            pageSize:10,
        }
        this.setState({
            searchText:this.props.location.state?this.props.location.state.searchText:'',
            positionChecked:(this.props.location.state&&this.props.location.state.districtIds==0)?[this.props.location.state.districtIds]:[0],
        });
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates,
                    counts:res.data.counts,
                })
            }
        })
        getTraits().then(res=>{
            if(res.data.code===1){
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].traitName
                    }
                    option.push(item)
                }
                this.setState({
                    characteristic: option
                })
            }
        })
        getPopularEstate().then((res)=>{
            this.setState({
                estates:res.data.estates
            })
        })
    }
    //选择区域
    onChange = e => {
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
            area:this.state.areasChecked,
            housingTypes:this.state.apartmentChecked,
            orderType:this.state.orderType,
            prices:this.state.priceChecked,
            traitIds:this.state.characteristicChecked,
            districtIds:id,
            streetId:[],
            searchText:this.state.searchText,
            pageNum:1,
            pageSize:10,
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates,
                    counts:res.data.counts
                })
            }
        })
    };
    //选择街道
    onChangeStreetId = streetIdChecked => {
        this.setState({
            streetIdChecked
        });
        let params={
            area:this.state.areasChecked,
            housingTypes:this.state.apartmentChecked,
            orderType:this.state.orderType,
            prices:this.state.priceChecked,
            traitIds:this.state.characteristicChecked,
            districtIds: this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetId:streetIdChecked,
            searchText:this.state.searchText,
            pageNum:1,
            pageSize:10
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates,
                    counts:res.data.counts
                })
            }
        })
    };
    //选择价格
    onChangePrice = e => {
        this.setState({
            priceChecked:[e.target.value],
        });
        let params={
            area:this.state.areasChecked,
            housingTypes:this.state.apartmentChecked,
            orderType:this.state.orderType,
            prices:[e.target.value],
            traitIds:this.state.characteristicChecked,
            districtIds: this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetId:this.state.streetIdChecked,
            searchText:this.state.searchText,
            pageNum:1,
            pageSize:10
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates,
                    counts:res.data.counts
                })
            }
        })
    };
    //选择面积
    onChangeArea= areaChecked => {
        this.setState({
            areaChecked
        });
        let params={
            area:areaChecked,
            housingTypes:this.state.apartmentChecked,
            orderType:this.state.orderType,
            prices:this.state.priceChecked,
            traitIds:this.state.characteristicChecked,
            districtIds: this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetId:this.state.streetIdChecked,
            searchText:this.state.searchText,
            pageNum:1,
            pageSize:10
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates,   
                    counts:res.data.counts    
                })
            }
        })
    };
    //选择户型
    onChangeApartment = e => {
        this.setState({
            apartmentChecked:[e.target.value],
        });
        let params={
            area:this.state.areasChecked,
            housingTypes:[e.target.value],
            orderType:this.state.orderType,
            prices:this.state.priceChecked,
            traitIds:this.state.characteristicChecked,
            districtIds: this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetId:this.state.streetIdChecked,
            searchText:this.state.searchText,
            pageNum:1,
            pageSize:10
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates,
                    counts:res.data.counts
                })
            }
        })
    };
    //选择特色
    onChangeCharacteristic = characteristicChecked => {
        this.setState({
            characteristicChecked,
        });
        let params={
            area:this.state.areasChecked,
            housingTypes:this.state.apartmentChecked,
            orderType:this.state.orderType,
            prices:this.state.priceChecked,
            traitIds:characteristicChecked,
            districtIds: this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetId:this.state.streetIdChecked,
            searchText:this.state.searchText,
            pageNum:1,
            pageSize:10
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates,
                    counts:res.data.counts
                })
            }
        })
    };

    //价格排序
    selected(e) {
        this.setState({
            key:e.key
        })
    
       }
    //价格排序
    toggle(str) {
        this.setState({index:1})
        if(!this.state.key){
            this.setState({
                orderType:1
            })
        }
        if (str == 'price') {
            if(this.state.togglePrice&&this.state.key=='price'){
                this.setState({
                    togglePrice: !this.state.togglePrice,
                    orderType:2
                })
                let params={
                    area:this.state.areasChecked,
                    housingTypes:this.state.apartmentChecked,
                    orderType:2,
                    prices:this.state.priceChecked,
                    traitIds:this.state.characteristicChecked,
                    districtIds: this.state.positionChecked[0]==0?[]:this.state.positionChecked,
                    streetId:this.state.streetIdChecked,
                    searchText:this.state.searchText,
                    pageNum:1,
                    pageSize:10
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates,
                            counts:res.data.counts
                        })
                    }
                })
            }
            else if(!this.state.togglePrice&&this.state.key=='price'){
                this.setState({
                    togglePrice: !this.state.togglePrice,
                    orderType:1
                })
                let params={
                    area:this.state.areasChecked,
                    housingTypes:this.state.apartmentChecked,
                    orderType:1,
                    prices:this.state.priceChecked,
                    traitIds:this.state.characteristicChecked,
                    districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
                    streetId:this.state.streetIdChecked,
                    searchText:this.state.searchText,
                    pageNum:1,
                    pageSize:10
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates,
                            counts:res.data.counts
                        })
                    }
                })
            }
            else{
                let params={
                    area:this.state.areasChecked,
                    housingTypes:this.state.apartmentChecked,
                    orderType:(this.state.orderType==0||this.state.orderType==3)&&this.state.togglePrice?1:2,
                    prices:this.state.priceChecked,
                    traitIds:this.state.characteristicChecked,
                    districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
                    streetId:this.state.streetIdChecked,
                    searchText:this.state.searchText,
                    pageNum:1,
                    pageSize:10
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates,
                            counts:res.data.counts
                        })
                    }
                })
            }

        }
        else if (str == 'time') {
                this.setState({
                    orderType:3
                })
                let params={
                    area:this.state.areasChecked,
                    housingTypes:this.state.apartmentChecked,
                    orderType:3,
                    prices:this.state.priceChecked,
                    traitIds:this.state.characteristicChecked,
                    districtIds: this.state.positionChecked[0]==0?[]:this.state.positionChecked,
                    streetId:this.state.streetIdChecked,
                    searchText:this.state.searchText,
                    pageNum:1,
                    pageSize:10
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates,
                            counts:res.data.counts
                        })
                    }
                })
    
        }
        else if (str == 'default') {

                this.setState({
                    orderType:0
                })
                let params={
                    area:this.state.areasChecked,
                    housingTypes:this.state.apartmentChecked,
                    orderType:0,
                    prices:this.state.priceChecked,
                    traitIds:this.state.characteristicChecked,
                    districtIds:this.state.positionChecked[0]==0?[]:this.state.positionChecked,
                    streetId:this.state.streetIdChecked,
                    searchText:this.state.searchText,
                    pageNum:1,
                    pageSize:10
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates,
                            counts:res.data.counts
                        })
                    }
                })
            
        }
    }
    link(estateId){
        this.props.newEstateId(estateId)
        localStorage.setItem('estateId',estateId)
        this.props.history.push('/home/bridalHome/bridalIndex')
    }
    link1(estateId){
        this.props.newEstateId(estateId)
        localStorage.setItem('estateId',estateId)
        this.props.history.push('/home/bridalHome/bridalApartment')
    }
    search(searchText){
        this.setState({
            searchText
        });
        let params={
            area:this.state.areasChecked,
            housingTypes:this.state.apartmentChecked,
            orderType:this.state.orderType,
            prices:this.state.priceChecked,
            traitIds:this.state.characteristicChecked,
            districtIds: this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetId:this.state.streetIdChecked,
            searchText:searchText,
            pageNum:1,
            pageSize:10
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates,
                    counts:res.data.counts
                })
            }
        })
    }
    page(index,size){
        this.setState({index})
        let params={
            area:this.state.areasChecked,
            housingTypes:this.state.apartmentChecked,
            orderType:this.state.orderType,
            prices:this.state.priceChecked,
            traitIds:this.state.characteristicChecked,
            districtIds: this.state.positionChecked[0]==0?[]:this.state.positionChecked,
            streetId:this.state.streetIdChecked,
            searchText:this.state.searchText,
            pageNum:index,
            pageSize:10
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates,
                    counts:res.data.counts
                })
            }
        })
    }
    clear(){
        this.setState({
            areaChecked:[],
            apartmentChecked:[],
            orderType:0,
           priceChecked:[],
            characteristicChecked:[],
           positionChecked:[],
            streetIdChecked:[],
            searchText:'',
        })
        this.props.history.push({pathname:'/home/bridalChamber'})
            let params={
            area:[],
            housingTypes:[],
            orderType:0,
            prices:[],
            traitIds:[],
            districtIds: [],
            streetId:[],
            searchText:'',
            pageNum:1,
            pageSize:10,
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates,
                    counts:res.data.counts
                })
            }
        })
    }

    render() {
        const {Search} = Input;
        const enterButton= <img src={require('../img/search1.png')}
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 5
                            }}/>;
        const CheckboxGroup = Checkbox.Group;
        return (
            <div className='bridalChamber'>
                <div className={'title-box'}>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>新房</p>
                    {/*<img src={require('../img/Location2.png')} style={{height: 24, width: 16}}/>*/}
                    {/*<span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp成都'}} className={'location'}/>*/}
                    <Search
                        placeholder="请输入楼盘名"
                        value={this.state.searchText}
                        onChange={e=>this.setState({searchText:e.target.value})}
                        onSearch={this.search.bind(this)}
                        style={{width: 400}}
                        size={'large'}
                        enterButton={enterButton}
                    />
                </div>
                <div className={'condition'}>
                    <div className={'first'}>
                        <p>区域</p>
                        <Radio.Group name="radiogroup" onChange={this.onChange.bind(this)} value={this.state.positionChecked[0]}>
                            {
                                this.state.position&&this.state.position.map((item,index)=>{
                                    return(<Radio value={item.value} key={index}>{item.label}</Radio>)
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
                        <p>单价</p>
                        <Radio.Group  onChange={this.onChangePrice.bind(this)} value={this.state.priceChecked[0]}>
                            {
                                this.state.price&&this.state.price.map((item,index)=>{
                                    return(<Radio value={item.value} key={index}>{item.label}</Radio>)
                                })
                            }
                        </Radio.Group>
                    </div>
                    <div className={'second'}>
                        <p>面积</p>
                        <CheckboxGroup
                            style={{marginTop:'-10px'}}
                            options={this.state.area}
                            value={this.state.areaChecked}
                            onChange={this.onChangeArea.bind(this)}
                        />
                    </div>
                    <div className={'second'}>
                        <p>户型</p>
                        <Radio.Group  onChange={this.onChangeApartment.bind(this)} value={this.state.apartmentChecked[0]}>
                            {
                                this.state.apartment&&this.state.apartment.map((item,index)=>{
                                    return(<Radio value={item.value} key={index}>{item.label}</Radio>)
                                })
                            }
                        </Radio.Group>
                    </div>
                    <div className={'second'}>
                        <p>特色</p>
                        <CheckboxGroup
                        style={{marginTop:'-10px'}}
                            options={this.state.characteristic}
                            value={this.state.characteristicChecked}
                            onChange={this.onChangeCharacteristic.bind(this)}
                        />
                    </div>

                </div>

                <div className={'result'}>
                    <div className={'find'}>
                        找到<span>{this.state.counts}</span>个成都楼盘
                    </div>
                    <div className={'sort'}>
                        <Menu onSelect={this.selected.bind(this)} defaultSelectedKeys={['default']}>
                            <Menu.Item style={{fontSize: 18}} key={'default'} onClick={this.toggle.bind(this, 'default')}>默认排序</Menu.Item>
                            <Menu.Item key={'price'}
                                       onClick={this.toggle.bind(this, 'price')}>价格{this.state.togglePrice ? '↑' : '↓'}</Menu.Item>
                            <Menu.Item key={'time'} onClick={this.toggle.bind(this, 'time')}>最新开盘</Menu.Item>
                        </Menu>
                        <div className={'clear'} onClick={this.clear.bind(this)}>清空筛选条件</div>
                    </div>
                    </div>
                    </div>
                    <div className={'show'}>
                        <div className={'left'}>
                            {
                                this.state.models&&this.state.models.map((item,index)=>{
                                    return(
                                        <div className={`showItem ${index === this.state.models.length-1? 'last' : ''}`} key={index}>
                                        <div className={'left'}>
                                            <div className={'item'}>
                                                    <div className={'pic'} onClick={this.link.bind(this,item.id)}>
                                                        <img src={'http://47.108.87.104:8601/building/'+item.picture}/>
                                                    </div>
                                                <div className={'information'}>
                                                    <div className={'title'}>
                                                        <p className={'name'} onClick={this.link.bind(this,item.id)}>{item.name}</p>
                                                        <p className={'price'}>{item.referencePrice}<span style={{display:isNaN(parseInt(item.referencePrice))?'none':'inline-block'}}>元/m²起</span></p>
                                                    </div>
                                                    <p className={'address'} onClick={this.link.bind(this,item.id)}>{item.distinctName}-{item.street}</p>
                                                    <p className={'apartment'} onClick={this.link1.bind(this,item.id)}>户型：{item.houseType}</p>
                                                    <p className={'area'} onClick={this.link.bind(this,item.id)}>建面：{item.areaRange}m²</p>
                                                    <p className={'tag'}>{item.propertyType}</p>
                                                    <p className={'advantage'}>
                                                        {
                                                            item.estateTraits&&item.estateTraits.map((items,index)=>{
                                                                return(
                                                                    <span className={'advantageItem'} key={index}>{items}</span>
                                                                )
                                                            })
                                                        }
                                                        
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )
                                })
                            }
                        <Pagination defaultCurrent={1} total={this.state.counts} pageSize={10} onChange={this.page.bind(this)} current={this.state.index}/>
                        </div>
                        <div className={'hot'}>
                            <p className={'title'}>热门楼盘</p>
                            {
                                this.state.estates&&this.state.estates.map((item,index)=>{
                                    return(
                          
                                        <div className={'hotItem'} onClick={this.link.bind(this,item.id)} key={index}>
                                        <img src={'http://47.108.87.104:8601/building/'+item.picture}/>
                                        <div className={'title'}>
                                            <p className={'name'}>{item.name}</p>
                                            <p className={'price'}>{item.referencePrice}<span style={{display:isNaN(parseInt(item.referencePrice))?'none':'inline-block'}}>元/m²起</span></p>
                                        </div>
                                        <div className={'center'}>
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
                </div>

        )
    }
}

export default connect(state => (
    {estateId: state.estateId,userInformation:state.userInformation}), {newEstateId})(BridalChamber)