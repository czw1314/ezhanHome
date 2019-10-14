import React from 'react'
import '../css/briadlChamber.scss'
import {Select, Button,Radio, Menu, Input, Checkbox, Modal, Pagination} from 'antd';
import { Link } from 'react-router-dom';
import {searchEstate,getDistrictRegions,getTraits} from '../api/index'
import {searchAgent} from "../api";

class BridalChamber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            left: 13,
            positionChecked: [],
            position: [],
            priceChecked: [],
            streetIdChecked:[],
            areasChecked:[],
            price: [{label: '8000元/m²以下', value: '8000'},{label: '8000-11000元/m²', value: '8000-11000'},
                {label: '11000-15000元/m²', value: '11000-15000'},{label: '15000-20000元/m²', value: '15000-20000'},{label: '20000-30000元/m²', value: '20000-30000'},{label: '30000元/m²以上', value: '30000'}],
            areaChecked: [],
            area: [{label: '50/m²以下', value: '50'},{label: '50-80m²', value: '50-80'},{label: '80-110m²', value: '80-110'},{label: '110-150m²', value: '110-150'},{label: '125-200m²', value: '150-200'},{label: '200m²以上', value: '200'}],
            apartmentChecked: [],
            apartment: [{label: '一居室', value: '一居室'},{label: '二居室', value: '二居室'},{label: '三居室', value: '三居室'},{label: '四居室', value: '四居室'},{label: '五居室', value: '五居室'},{label: '五居室以上', value: '五居室以上'}],
            characteristicChecked: [],
            characteristic: [],
            togglePrice: true,
            toggleTime: true,
            orderType:0,
            models:[],
            key:''
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
                    area:this.state.areasChecked,
                    housingTypes:this.state.apartmentChecked,
                    orderType:0,
                    prices:this.state.priceChecked,
                    traitIds:this.state.characteristicChecked,
                    districtIds: [],
                    streetId:[],
                    searchText:this.state.searchText
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates
                        })
                    }
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
    onChange = e => {
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
            area:this.state.areasChecked,
            housingTypes:this.state.apartmentChecked,
            orderType:this.state.orderType,
            prices:this.state.priceChecked,
            traitIds:this.state.characteristicChecked,
            districtIds:id,
            streetId:this.state.streetIdChecked,
            searchText:this.state.searchText
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates
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
            districtIds: [this.state.positionChecked],
            streetId:streetIdChecked,
            searchText:this.state.searchText
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates
                })
            }
        })
    };
    //选择价格
    onChangePrice = e => {
        this.setState({
            priceChecked:e.target.value,
        });
        let params={
            area:this.state.areasChecked,
            housingTypes:this.state.apartmentChecked,
            orderType:this.state.orderType,
            prices:[e.target.value],
            traitIds:this.state.characteristicChecked,
            districtIds: this.state.positionChecked,
            streetId:this.state.streetIdChecked,
            searchText:this.state.searchText
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates
                })
            }
        })
    };
    //选择面积
    onChangeArea = e => {
        this.setState({
            areaChecked:e.target.value,
        });
        let params={
            area:[e.target.value],
            housingTypes:this.state.apartmentChecked,
            orderType:this.state.orderType,
            prices:this.state.priceChecked,
            traitIds:this.state.characteristicChecked,
            districtIds: this.state.positionChecked,
            streetId:this.state.streetIdChecked,
            searchText:this.state.searchText
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates
                })
            }
        })
    };
    //选择户型
    onChangeApartment = e => {
        this.setState({
            apartmentChecked:e.target.value,
        });
        let params={
            area:this.state.areasChecked,
            housingTypes:[e.target.value],
            orderType:this.state.orderType,
            prices:this.state.priceChecked,
            traitIds:this.state.characteristicChecked,
            districtIds: this.state.positionChecked,
            streetId:this.state.streetIdChecked,
            searchText:this.state.searchText
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates
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
            districtIds: this.state.positionChecked,
            streetId:this.state.streetIdChecked,
            searchText:this.state.searchText
        }
        searchEstate(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    models:res.data.estates
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
        if (str === 'price') {
            console.log(this.state.key)
            if(this.state.togglePrice&&this.state.key=='price'){
                console.log(1)
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
                    districtIds: this.state.positionChecked,
                    streetId:this.state.streetIdChecked,
                    searchText:this.state.searchText
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates    
                        })
                    }
                })
            }
            else if(this.state.key=='price'){
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
                    districtIds: this.state.positionChecked,
                    streetId:this.state.streetIdChecked,
                    searchText:this.state.searchText
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates
                        })
                    }
                })
            }
            else{
                let params={
                    area:this.state.areasChecked,
                    housingTypes:this.state.apartmentChecked,
                    orderType:this.state.orderType?this.state.orderType:1,
                    prices:this.state.priceChecked,
                    traitIds:this.state.characteristicChecked,
                    districtIds: this.state.positionChecked,
                    streetId:this.state.streetIdChecked,
                    searchText:this.state.searchText
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates
                        })
                    }
                })
            }

        }
        else if (str === 'time') {
            if(this.state.togglePrice){
                this.setState({
                    orderType:3
                })
                let params={
                    area:this.state.areasChecked,
                    housingTypes:this.state.apartmentChecked,
                    orderType:3,
                    prices:this.state.priceChecked,
                    traitIds:this.state.characteristicChecked,
                    districtIds: this.state.positionChecked,
                    streetId:this.state.streetIdChecked,
                    searchText:this.state.searchText
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates
                        })
                    }
                })
            }
        }
        else if (str === 'default') {
            if(this.state.togglePrice){
                this.setState({
                    orderType:0
                })
                let params={
                    area:this.state.areasChecked,
                    housingTypes:this.state.apartmentChecked,
                    orderType:0,
                    prices:this.state.priceChecked,
                    traitIds:this.state.characteristicChecked,
                    districtIds: this.state.positionChecked,
                    streetId:this.state.streetIdChecked,
                    searchText:this.state.searchText
                }
                searchEstate(params).then((res)=>{
                    if(res.data.code===1){
                        this.setState({
                            models:res.data.estates
                        })
                    }
                })
            }
        }
    }

    render() {
        const {Search} = Input;
        const suffix = <img src={require('../img/search1.png')}
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 5
                            }}/>;
        const CheckboxGroup = Checkbox.Group;
        console.log(this.state.togglePrice)
        return (
            <div className='bridalChamber'>
                <div className={'title-box'}>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>新房</p>
                    <img src={require('../img/Location2.png')} style={{height: 24, width: 16}}/>
                    <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp成都'}} className={'location'}/>
                    <Search
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{width: 400}}
                        size={'large'}
                        suffix={suffix}
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
                        <p>单价</p>
                        <Radio.Group  onChange={this.onChangePrice.bind(this)} value={this.state.priceChecked}>
                            {
                                this.state.price&&this.state.price.map(item=>{
                                    return(<Radio value={item.value}>{item.label}</Radio>)
                                })
                            }
                        </Radio.Group>
                    </div>
                    <div className={'second'}>
                        <p>面积</p>
                        <Radio.Group  onChange={this.onChangeArea.bind(this)} value={this.state.areaChecked}>
                            {
                                this.state.area&&this.state.area.map(item=>{
                                    return(<Radio value={item.value}>{item.label}</Radio>)
                                })
                            }
                        </Radio.Group>
                    </div>
                    <div className={'second'}>
                        <p>户型</p>
                        <Radio.Group  onChange={this.onChangeApartment.bind(this)} value={this.state.apartmentChecked}>
                            {
                                this.state.apartment&&this.state.apartment.map(item=>{
                                    return(<Radio value={item.value}>{item.label}</Radio>)
                                })
                            }
                        </Radio.Group>
                    </div>
                    <div className={'second'}>
                        <p>特色</p>
                        <CheckboxGroup
                            options={this.state.characteristic}
                            value={this.state.characteristicChecked}
                            onChange={this.onChangeCharacteristic.bind(this)}

                        />
                    </div>

                </div>
                </div>
                <div className={'result'}>
                    <div className={'find'}>
                        找到<span>{this.state.models.length}</span>个成都楼盘
                    </div>
                    <div className={'sort'}>
                        <Menu onSelect={this.selected.bind(this)} defaultSelectedKeys={['default']}>
                            <Menu.Item style={{fontSize: 18}} key={'default'} onClick={this.toggle.bind(this, 'default')}>默认排序</Menu.Item>
                            <Menu.Item key={'price'}
                                       onClick={this.toggle.bind(this, 'price')}>价格{this.state.togglePrice ? '↑' : '↓'}</Menu.Item>
                            <Menu.Item key={'time'} onClick={this.toggle.bind(this, 'time')}>最新开盘</Menu.Item>
                        </Menu>
                        <div className={'clear'}>清空筛选条件</div>
                    </div>
                    <div className={'show'}>
                        <div className={'left'}>
                            <div className={'showItem'}>
                                <div className={'left'}>
                                    <div className={'item'}>
                                        <Link to={'/home/bridalHome'}>
                                            <div className={'pic'}>
                                                <img src={require('../img/bridalChamberItem.png')}/>
                                            </div>
                                        </Link>
                                        <div className={'information'}>
                                            <div className={'title'}>
                                                <p className={'name'}>青白江天美广场</p>
                                                <p className={'price'}>5000元/m²起</p>
                                            </div>
                                            <p className={'address'}>温江·温江大学城</p>
                                            <p className={'apartment'}>户型：一居室（2），二居室（2），三居室（2），四居室（1），五居室（2）</p>
                                            <p className={'area'}>建面：89-132m²</p>
                                            <p className={'tag'}>高层住宅 洋房住宅 超高层住宅 别墅</p>
                                            <p className={'advantage'}>
                                                <span className={'advantageItem'}>品牌房企</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={'showItem last'}>
                                <div className={'left'}>
                                    <div className={'item'}>
                                        <div className={'pic'}>
                                            <img src={require('../img/bridalChamberItem.png')}/>
                                        </div>
                                        <div className={'information'}>
                                            <div className={'title'}>
                                                <p className={'name'}>青白江天美广场</p>
                                                <p className={'price'}>5000元/m²起</p>
                                            </div>
                                            <p className={'address'}>温江·温江大学城</p>
                                            <p className={'apartment'}>户型：一居室（2），二居室（2），三居室（2），四居室（1），五居室（2）</p>
                                            <p className={'area'}>建面：89-132m²</p>
                                            <p className={'tag'}>高层住宅 洋房住宅 超高层住宅 别墅</p>
                                            <p className={'advantage'}>
                                                <span className={'advantageItem'}>品牌房企</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Pagination
                                // onShowSizeChange={onShowSizeChange}
                                defaultCurrent={1}
                                total={500}
                            />
                        </div>
                        <div className={'hot'}>
                            <p className={'title'}>热门楼盘</p>
                            <div className={'hotItem'}>
                                <img src={require('../img/hotItem.png')}/>
                                <div className={'title'}>
                                    <p className={'name'}>青白江天美广场</p>
                                    <p className={'price'}>5000元/m²起</p>
                                </div>
                                <div className={'center'}>
                                    <p className={'address'}>温江·温江大学城</p>
                                    <p className={'area'}>建面：89-132m²</p>
                                </div>
                                <p className={'tag'}>超高层住宅 别墅</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BridalChamber