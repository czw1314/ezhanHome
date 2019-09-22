import React from 'react'
import '../css/agent.scss'
import {Select, Button, Badge, Menu, Input, Checkbox, Modal, Pagination} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';

class Agent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            left: 13,
            positionChecked: [],
            position: ['不限', '青羊', '锦江'],
            serviceChecked: [],
            service: ['新房经纪'],
            titleChecked: [],
            title: ['房地产经纪人', '房地产经纪人协理'],
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
    onChangeService = serviceChecked => {
        this.setState({
            serviceChecked,
            // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            // checkAll: checkedList.length === plainOptions.length,
        });
    };
    //选择面积
    onChangeTitle = titleChecked => {
        this.setState({
            titleChecked,
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

    推荐经纪人

    recommend() {

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
            <div className='agent'>
                <div className={'title'}>
                    <div className='logo'>
                        <img src={require('../img/LOGO2.png')}/>
                    </div>
                    <p>经纪人</p>
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
                    {/*<div className={'second'}>*/}
                    {/*<p>户型</p>*/}
                    {/*<CheckboxGroup*/}
                    {/*options={this.state.apartment}*/}
                    {/*value={this.state.apartmentChecked}*/}
                    {/*onChange={this.onChangeApartment}*/}
                    {/*/>*/}
                    {/*</div>*/}
                    {/*<div className={'second'}>*/}
                    {/*<p>特色</p>*/}
                    {/*<CheckboxGroup*/}
                    {/*options={this.state.characteristic}*/}
                    {/*value={this.state.characteristicChecked}*/}
                    {/*onChange={this.onChangeCharacteristic}*/}
                    {/*/>*/}
                    {/*</div>*/}

                </div>
                <div className={'result'}>
                    <div className={'find'}>
                        找到<span>300</span>个经纪人
                    </div>
                    <div className={'sort'}>
                        <Menu onSelect={this.selected.bind(this)}>
                            <Menu.Item style={{fontSize: 18}} key={'default'}>默认排序</Menu.Item>
                            <Menu.Item key={'price'}
                                       onClick={this.recommend.bind(this)}>推荐经纪人</Menu.Item>
                            {/*<Menu.Item key={'time'}*/}
                            {/*onClick={this.toggle.bind(this, 'time')}>最新开盘{this.state.toggleTime ? '↑' : '↓'}</Menu.Item>*/}
                        </Menu>
                        <div className={'clear'}>清空筛选条件</div>
                    </div>
                    <div className={'show'}>
                        <div className={'left'}>
                            <div className={'showItem'}>
                                <div className={'left'}>
                                    <div className={'item'}>
                                        <div className={'pic'}>
                                            <img src={require('../img/headPortrait.png')}/>
                                        </div>
                                        <div className={'textBox'}>
                                            <div className={'text'}>
                                                <div className={'information'}>
                                                    <p className={'name'}>周宇航<span>房地产经纪人</span></p>
                                                    <p className={'year'}>从业年限：五年</p>
                                                </div>
                                                <div className={'service'}>
                                                    <p className={'area'}>熟悉区域：天府新区 - 华阳街道 天府新区 - 万安镇 天府新区 - 太平镇</p>
                                                    <p className={'tag'}><span>服务：</span>专车接送 新房经纪 权证代办 贷款代办 二手房经纪</p>
                                                </div>
                                                <div className={'contact'}>
                                                    <p className={'phone'}><img src={require('../img/Phone.png')}/><span>联系电话：</span>165435132165</p>
                                                    <p className={'weixin'}><img src={require('../img/weixin.png')}/>添加微信：查看二维码</p>
                                                </div>
                                            </div>
                                            <p className={'company'}>独立经纪人</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className={'showItem'}>
                                <div className={'left'}>
                                    <div className={'item'}>
                                        <div className={'pic'}>
                                            <img src={require('../img/headPortrait.png')}/>
                                        </div>
                                        <div className={'textBox'}>
                                            <div className={'text'}>
                                                <div className={'information'}>
                                                    <p className={'name'}>周宇航<span>房地产经纪人</span></p>
                                                    <p className={'year'}>从业年限：五年</p>
                                                </div>
                                                <div className={'service'}>
                                                    <p className={'area'}>熟悉区域：天府新区 - 华阳街道 天府新区 - 万安镇 天府新区 - 太平镇</p>
                                                    <p className={'tag'}><span>服务：</span>专车接送 新房经纪 权证代办 贷款代办 二手房经纪</p>
                                                </div>
                                                <div className={'contact'}>
                                                    <p className={'phone'}><img src={require('../img/Phone.png')}/><span>联系电话：</span>165435132165</p>
                                                    <p className={'weixin'}><img src={require('../img/weixin.png')}/>添加微信：查看二维码</p>
                                                </div>
                                            </div>
                                            <p className={'company'}>独立经纪人</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className={'showItem last'}>
                                <div className={'left'}>
                                    <div className={'item'}>
                                        <div className={'pic'}>
                                            <img src={require('../img/headPortrait.png')}/>
                                        </div>
                                        <div className={'textBox'}>
                                            <div className={'text'}>
                                                <div className={'information'}>
                                                    <p className={'name'}>周宇航<span>房地产经纪人</span></p>
                                                    <p className={'year'}>从业年限：五年</p>
                                                </div>
                                                <div className={'service'}>
                                                    <p className={'area'}>熟悉区域：天府新区 - 华阳街道 天府新区 - 万安镇 天府新区 - 太平镇</p>
                                                    <p className={'tag'}><span>服务：</span>专车接送 新房经纪 权证代办 贷款代办 二手房经纪</p>
                                                </div>
                                                <div className={'contact'}>
                                                    <p className={'phone'}><img src={require('../img/Phone.png')}/><span>联系电话：</span>165435132165</p>
                                                    <p className={'weixin'}><img src={require('../img/weixin.png')}/>添加微信：查看二维码</p>
                                                </div>
                                            </div>
                                            <p className={'company'}>独立经纪人</p>
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