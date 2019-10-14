import React from 'react'
import '../../css/Album.scss'
import {connect} from "react-redux";
import {newEstateId} from "../../redux/action";
import {mapInformation,getStreetEstatess} from '../../api/index'
import routes from '../../router/index';
import {Select, Button, Rate, Icon,Pagination, Input, Checkbox, Modal,Tabs} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import {getHousingMsg} from "../../api";

class Album extends React.Component {
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
            num: 0,//图片数量-1
            nums:0,//图集-5
            active: 0,//第n张相片激活，
            keys: 1,
            location:'104.081525,30.406772',
            map:'',
            models:[]
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
    goLeft(index) {
        console.log(index)
        this.setState({
            translateX: this.state.translateX + 1100 > 0 ? 0 : this.state.translateX + 1100,
            active: this.state.active - 1 <= 0 ? 0 : this.state.active - 1
        })
        for (let i = this.state.models[index].length - 1; i > this.state.models[index].length - 6; i--) {
            if (this.state.slideData[i].count+1 === this.state.active) {
                this.setState({
                    translateXs: this.state.translateXs + 142 >= 0 ? 0 : this.state.translateXs + 142,
                })
            }
        }

    }

    //大图向右
    goRight(index) {
        this.setState({
            translateX: this.state.translateX - 1100 > (-(this.state.models[index].picturePaths.length-1) * 1100) ? this.state.translateX - 1100 : -(this.state.models[index].picturePaths.length-1)* 1100,
            active: this.state.active + 1 > this.state.num ? this.state.num : this.state.active + 1
        })
        for (let i = 5; i < this.state.slideData.length; i++) {
            if (this.state.slideData[i - 1].count === this.state.active) {
                console.log(this.state.slideData[i - 1].count)
                this.setState({
                    translateXs: this.state.translateXs - 142 >= (-this.state.nums * 142) ? this.state.translateXs - 142 : -this.state.nums * 142
                })
            }
        }
    }

    //小图向左
    goLefts() {
        this.setState({
            translateXs: this.state.translateXs + 142 >= 0 ? 0 : this.state.translateXs + 142,

        })
    }

    //小图向右
    goRights(index) {
        if(this.state.models[index].picturePaths.length<=8){
            return
        }
        else {
            this.setState({
                translateXs: this.state.translateXs - 142 >= (-(this.state.models[index].picturePaths.length - 1) * 142) ? this.state.translateXs - 142 : -(this.state.models[index].picturePaths.length - 1) * 142
            })
        }
    }

    //指定跳转到某一图集
    goTo(str) {
        this.setState({
            translateX: -1100 * (str - 1) >= 0 ? 0 : -1100 * (str - 1),
            active: str > 0 ? str - 1 : 0
        })
    }
    callback(key) {
        this.setState({
            translateX: 0,
            active: 0
        })
    }
    componentDidMount(){
        let params={
            estateId:this.props.estateId
        }
        getStreetEstatess(params).then((res)=>{
            if(res.data.code===1){
                let l=0
                for (let i=0;i<res.data.models.length;i++){
                    l+=res.data.models[i].picturePaths.length
                }
                this.setState({
                    models:res.data.models,
                    nums:res.data.models.length,
                    num:l
                })
            }

        })
    }
    render() {
        const { TabPane } = Tabs;
        return (
            <div className='album'>
                <div className={'title'}>
                    <p>楼盘名称相册</p>
                </div>
                <div className="banner">
                    <Tabs defaultActiveKey="0" onChange={this.callback.bind(this)} style={{textAlign:'left'}}>
                        {
                            this.state.models&&this.state.models.map((item,index)=>{
                                return (<TabPane tab={item.type} key={index}>
                                    <div className="large_box">
                                        <div className={'go-left'} onClick={this.goLeft.bind(this,index)}>
                                            <img src={require('../../img/go-left.png')}/>
                                        </div>
                                        <div className={'go-right'} onClick={this.goRight.bind(this,index)}>
                                            <img src={require('../../img/go-right.png')}/>
                                        </div>
                                        <ul ref={'col-nav'} style={{transform: `translateX(${this.state.translateX}px)`}}>
                                            {item.picturePaths.map((items, indexs) =>
                                                <li className="item" data-index={indexs}>
                                                    <img src={'http://47.108.87.104:8601/building/'+items}/>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="small_box">
                                        <span className="btns lefts_btn" onClick={this.goLefts.bind(this,index)}></span>
                                        <div className="small_list">
                                            <ul style={{transform: `translateX(${this.state.translateXs}px)`}}>
                                                {item.picturePaths.map((items, index) =>
                                                    <li className="item" data-index={index} onClick={this.goTo.bind(this,index+1)}>
                                                        <img src={'http://47.108.87.104:8601/building/'+items}/>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                        <span className="btns rights_btn" onClick={this.goRights.bind(this,index)}></span>
                                    </div>
                                </TabPane>)
                            })
                        }
                        {/*<TabPane tab="区位图（20）" key="1">*/}
                            {/*<div className="large_box">*/}
                                {/*<div className={'go-left'} onClick={this.goLeft.bind(this)}>*/}
                                    {/*<img src={require('../../img/go-left.png')}/>*/}
                                {/*</div>*/}
                                {/*<div className={'go-right'} onClick={this.goRight.bind(this)}>*/}
                                    {/*<img src={require('../../img/go-right.png')}/>*/}
                                {/*</div>*/}
                                {/*<ul ref={'col-nav'} style={{transform: `translateX(${this.state.translateX}px)`}}>*/}
                                    {/*{this.state.models[0]&&this.state.models[0].picturePaths.map((item, index) =>*/}
                                            {/*<li className="item" data-index={index}>*/}
                                                {/*<img src={'http://47.108.87.104:8601/building/'+item}/>*/}
                                            {/*</li>*/}
                                    {/*)}*/}
                                {/*</ul>*/}
                            {/*</div>*/}
                            {/*<div className="small_box">*/}
                                {/*<span className="btns lefts_btn" onClick={this.goLefts.bind(this)}></span>*/}
                                {/*<div className="small_list">*/}
                                    {/*<ul style={{transform: `translateX(${this.state.translateXs}px)`}}>*/}
                                        {/*{this.state.slideData.map((item, index) =>*/}
                                            {/*<li className="item" data-index={index} onClick={this.goTo.bind(this,index+1)}>*/}
                                                {/*<img src={item.img}/>*/}
                                            {/*</li>*/}
                                        {/*)}*/}
                                    {/*</ul>*/}
                                {/*</div>*/}
                                {/*<span className="btns rights_btn" onClick={this.goRights.bind(this)}></span>*/}
                            {/*</div>*/}
                        {/*</TabPane>*/}
                    </Tabs>,

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

export default connect(state => (
    {estateId: state.estateId}), {newEstateId})(Album)