import React from 'react'
import '../../css/apartment.scss'
import {mapInformation} from '../../api/index'
import routes from '../../router/index';
import {Select, Button, Rate, Icon,Pagination, Input, Checkbox, Modal,Tabs} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';

class Apartment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slideData: [
                {
                    img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                }, {
                    img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                },
                {
                    img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                }, {
                    img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                }, {
                    img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                }, {
                    img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                }, {
                    img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                }, {
                    img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                }
            ],
            isShowing: !0,
            slideAnimate: "",
            sca: [],
            caIdx: 0,
            cpIdx: 0,
            currUrl: "",
            previewLeft: 0,
            currWidth: 0,
            prevNextVisible: !1,
            key: this.props.location.pathname || '/bridalChamber',
            translateX: 0,
            translateXs: 0,
            num: 1,//图片数量-1
            nums: 1,//图集-5
            active: 0,//第n张相片激活，
            keys: 1,
            location:'104.081525,30.406772',
            map:''
        }
    }

    handleClickMenus = (e) => {
        this.setState({
            key: e.key,
        });
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

    //大图向左
    goLeft() {
        this.setState({
            translateX: this.state.translateX + 700 > 0 ? 0 : this.state.translateX + 700,
            active: this.state.active - 1 <= 0 ? 0 : this.state.active - 1
        })
    }

    //大图向右
    goRight() {
        this.setState({
            translateX: this.state.translateX - 700 > (-this.state.num * 700) ? this.state.translateX - 700 : -this.state.num * 700,
            active: this.state.active + 1 > this.state.num ? this.state.num : this.state.active + 1
        })
    }

    //小图向左
    goLefts() {
        this.setState({
            translateXs: this.state.translateXs + 142 >= 0 ? 0 : this.state.translateXs + 142,

        })
    }

    //小图向右
    goRights() {
        this.setState({
            translateXs: this.state.translateXs - 142 >= (-this.state.nums * 142) ? this.state.translateXs - 142 : -this.state.nums * 142

        })
    }

    //指定跳转到某一图集
    goTo(str) {
        console.log(str)
        this.setState({
            translateX: -1100 * (str - 1) >= 0 ? 0 : -1100 * (str - 1),
            active: str > 0 ? str - 1 : 0
        })
    }
    callback(key) {
        console.log(key);
    }

    render() {
        const { TabPane } = Tabs;
        return (
            <div className='apartment'>
                <div className={'title'}>
                    <p>楼盘名称相册</p>
                </div>
                <div className="banner">
                    <Tabs defaultActiveKey="1" onChange={this.callback} style={{textAlign:'left'}}>
                        <TabPane tab="区位图（20）" key="1">
                            <Tabs defaultActiveKey="1" onChange={this.callback} style={{textAlign:'left'}} className={'item-box'}>
                                <TabPane tab="C1户型-39m²" key="1">
                                    <div className={'item'}>
                                    <div className="large_box">
                                        <div className={'go-left'} onClick={this.goLeft.bind(this)}>
                                            <img src={require('../../img/go-left.png')}/>
                                        </div>
                                        <div className={'go-right'} onClick={this.goRight.bind(this)}>
                                            <img src={require('../../img/go-right.png')}/>
                                        </div>
                                        <ul ref={'col-nav'} style={{transform: `translateX(${this.state.translateX}px)`}}>
                                            <li>
                                                <img src={require('../../img/itemApartment.png')}/>
                                            </li>
                                            <li>
                                                <img src={require('../../img/apartment.png')}/>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className={'information'}>
                                        <p className={'title'}>
                                            C1户型-39m²
                                        </p>
                                        <p className={'apartment'}>1室1厅两卫</p>
                                        <p className={'tag'}><span>户型方正</span><span>户型方正</span><span>户型方正</span><span>户型方正</span><span>户型方正</span></p>
                                        <p dangerouslySetInnerHTML={{__html: '建面：106m²&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp朝向：朝南'}} ></p>
                                        <p dangerouslySetInnerHTML={{__html: '层高：15.0m&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp户型结构：XXX'}} ></p>
                                        <p>物业类型：xxxxx</p>
                                        <p>户型优点： 1.格局方正，方便后家具摆放，利于后期
                                            空间改造。2.空间分割多为非承重墙，可根据个人需
                                            要进行空间改造。3.室内过道面积少，可实现功能空
                                            间充分利用。</p>
                                        <p>户型缺点： 1.格局方正，方便后家具摆放，利于后期
                                            空间改造。2.空间分割多为非承重墙，可根据个人需
                                            要进行空间改造。3.室内过道面积少，可实现功能空
                                            间充分利用。</p>
                                    </div>
                                    </div>
                                </TabPane>
                                <TabPane tab="C1户型-39m²" key="2">
                                </TabPane>
                                <TabPane tab="C1户型-39m²" key="3">
                                </TabPane>
                            </Tabs>
                        </TabPane>
                        <TabPane tab="区位图（20）" key="2">
                        </TabPane>
                        <TabPane tab="区位图（20）" key="3">
                        </TabPane>
                    </Tabs>

                    {/*<div className={'nearby'}>*/}
                    {/*<h3>楼盘周边配套</h3>*/}
                    {/*<div id="container"></div>*/}
                    {/*<Tabs defaultActiveKey="1" onChange={this.callback}>*/}
                    {/*<TabPane tab="交通" key="1">*/}
                    {/*<div>*/}
                    {/*附近地铁站<br></br>*/}
                    {/*海昌路*/}
                    {/*</div>*/}
                    {/*</TabPane>*/}
                    {/*<TabPane tab="医疗" key="2">*/}
                    {/*Content of Tab Pane 2*/}
                    {/*</TabPane>*/}
                    {/*<TabPane tab="商业" key="3">*/}
                    {/*Content of Tab Pane 3*/}
                    {/*</TabPane>*/}
                    {/*<TabPane tab="教育" key="4">*/}
                    {/*Content of Tab Pane 3*/}
                    {/*</TabPane>*/}
                    {/*</Tabs>*/}
                    {/*<Button block>更多</Button>*/}
                    {/*</div>*/}

                </div>
            </div>
        )
    }
}

export default Apartment