import React from 'react'
import '../css/briadlChamber.scss'
import {Select, Button, Badge, Menu, Input, Checkbox, Modal, Pagination} from 'antd';
import { Link } from 'react-router-dom';

class BridalChamber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            left: 13,
            positionChecked: [],
            position: ['不限', '青羊', '锦江'],
            priceChecked: [],
            price: ['15000元/m²以下'],
            areaChecked: [],
            area: ['80m²以下'],
            apartmentChecked: [],
            apartment: ['三室两厅'],
            characteristicChecked: [],
            characteristic: ['现房'],
            togglePrice: true,
            toggleTime: true
        }
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
    onChange = positionChecked => {
        this.setState({
            positionChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };
    //选择价格
    onChangePrice = priceChecked => {
        this.setState({
            priceChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };
    //选择面积
    onChangeArea = areaChecked => {
        this.setState({
            areaChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };
    //选择户型
    onChangeApartment = apartmentChecked => {
        this.setState({
            apartmentChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };
    //选择特色
    onChangeCharacteristic = characteristicChecked => {
        this.setState({
            characteristicChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };

    //价格排序
    selected(e) {
        this.setState({
            togglePrice: true,
            toggleTime: true
        })
        console.log(this.state.togglePrice)
    }

    toggle(str) {
        if (str === 'price') {
            this.setState({
                togglePrice: !this.state.togglePrice
            })
        }
        else if (str === 'time') {
            this.setState({
                toggleTime: !this.state.toggleTime
            })
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
                        <CheckboxGroup
                            options={this.state.position}
                            value={this.state.positionChecked}
                            onChange={this.onChange}
                        />
                    </div>
                    <div className={'second'} style={{marginTop: 10}}>
                        <p>单价</p>
                        <CheckboxGroup
                            options={this.state.price}
                            value={this.state.priceChecked}
                            onChange={this.onChangePrice}
                        />
                    </div>
                    <div className={'second'}>
                        <p>面积</p>
                        <CheckboxGroup
                            options={this.state.area}
                            value={this.state.areaChecked}
                            onChange={this.onChangeArea}
                        />
                    </div>
                    <div className={'second'}>
                        <p>户型</p>
                        <CheckboxGroup
                            options={this.state.apartment}
                            value={this.state.apartmentChecked}
                            onChange={this.onChangeApartment}
                        />
                    </div>
                    <div className={'second'}>
                        <p>特色</p>
                        <CheckboxGroup
                            options={this.state.characteristic}
                            value={this.state.characteristicChecked}
                            onChange={this.onChangeCharacteristic}
                        />
                    </div>

                </div>
                </div>
                <div className={'result'}>
                    <div className={'find'}>
                        找到<span>300</span>个成都楼盘
                    </div>
                    <div className={'sort'}>
                        <Menu onSelect={this.selected.bind(this)}>
                            <Menu.Item style={{fontSize: 18}} key={'default'}>默认排序</Menu.Item>
                            <Menu.Item key={'price'}
                                       onClick={this.toggle.bind(this, 'price')}>价格{this.state.togglePrice ? '↑' : '↓'}</Menu.Item>
                            <Menu.Item key={'time'}
                                       onClick={this.toggle.bind(this, 'time')}>最新开盘{this.state.toggleTime ? '↑' : '↓'}</Menu.Item>
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