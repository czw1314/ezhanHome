import React from 'react'
import '../../css/apartment.scss'
import {connect} from "react-redux";
import {getFileList, newEstateId, setHousingPictures} from "../../redux/action";
import {mapInformation,getHousingMsg} from '../../api/index'
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
            map:'',
            models:[],
            modal1Visible:false,
            key2:this.props.location.state?this.props.location.state.id:'0',
            key1:this.props.location.state?this.props.location.state.key:'0'

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
    callback1(key) {
        this.setState({key1:key})
    }
    callback2(key) {
        this.setState({key2:key})
    }
    componentDidMount(){
        let params={
            estateId:this.props.estateId||localStorage.getItem('estateId')
        }
        getHousingMsg(params).then((res)=>{
            if(res.data.code===1){
                let arr = res.data.models.map((item,index) => {
                    item.housingMsgs.map((itema,indexa)=>{
                        console.log(itema.picturePath)
                        res.data.models[index].housingMsgs[indexa].picturePath=eval("(" + itema.picturePath + ")")
                    })
                })
                this.setState({
                    models:res.data.models
                })
            }

        })
    }
    setModal1Visible(modal1Visible) {
        this.setState({ modal1Visible });
        // if(modal1Visible){
        //     console.log(d)
        //     this.refs.model.style.height='1000px'
        // }
      }
    render() {
        const { TabPane } = Tabs;
        const messages = this.props.location.state?this.props.location.state.id:'0'
        const key = this.props.location.state?this.props.location.state.key:'0'
        return (
            <div className='apartment'>
                <div className={'title'}>
                    <p>楼盘名称相册</p>
                </div>
                <div className="banner">
                    <Tabs defaultActiveKey="0" onChange={this.callback1.bind(this)} style={{textAlign:'left'}} activeKey={this.state.key1.toString()}>
                        {
                            this.state.models&&this.state.models.map((item,index)=>{
                                return(
                                    <TabPane tab={item.housingType} key={index}>
                                        <Tabs defaultActiveKey="0" onChange={this.callback2.bind(this)} style={{textAlign:'left'}} className={'item-box'} activeKey={this.state.key2.toString()}>
                                        {
                                            item.housingMsgs&&item.housingMsgs.map((items,index1)=>{
                                                return(
                                                            <TabPane tab={items.housingTypeTitle} key={index1}>
                                                                <div className={'item'}>
                                                                    <div className="large_box">
                                                                        {/*<div className={'go-left'} onClick={this.goLeft.bind(this)}>*/}
                                                                            {/*<img src={require('../../img/go-left.png')}/>*/}
                                                                        {/*</div>*/}
                                                                        {/*<div className={'go-right'} onClick={this.goRight.bind(this)}>*/}
                                                                            {/*<img src={require('../../img/go-right.png')}/>*/}
                                                                        {/*</div>*/}
                                                                        <ul ref={'col-nav'} style={{transform: `translateX(${this.state.translateX}px)`,position:'relative'}}>
                                                                            <Button style={{position:'absolute',top:40,right:40,backgroundColor:'#000',color:'#fff',zIndex:1}} onClick={this.setModal1Visible.bind(this,true)}>查看原图</Button>
                                                                            <Modal
          title=""
          ref={'model'}
          className={'s'}
          style={{ top: 20 ,zIndex:7778,width:'1200px'}}
          footer={''}
          width={1200}
          visible={this.state.modal1Visible}
          onOk={this.setModal1Visible.bind(this,false)}
          onCancel={this.setModal1Visible.bind(this,false)}
        >
       <img src={ ('http://47.108.87.104:8601/housing/'+items.picturePath[0])||''}/>
        </Modal>
                                                                            <li>
                                                                                <img src={ ('http://47.108.87.104:8601/housing/'+items.picturePath[0])||''}/>
                                                                            </li>
                                                                            {/* <li>
                                                                                <img src={require('../../img/apartment.png')}/>
                                                                            </li> */}
                                                                        </ul>
                                                                    </div>
                                                                    <div className={'information'}>
                                                                        <p className={'title'}>
                                                                            {items.housingTypeTitle}
                                                                        </p>
                                                                        <p className={'apartment'}>{items.housingDetailName}</p>
                                                                        <p className={'tag'}>
                                                                            {
                                                                                items.housingTraits && items.housingTraits.map((itema, indexa) => {
                                                                                    return (
                                                                                        <span>{itema.traitName}</span>
                                                                                    )
                                                                                })
                                                                            }

                                                                        </p>
                                                                        <p dangerouslySetInnerHTML={{__html:`建面：${items.area}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp朝向：${items.orientations}`}} ></p>
                                                                        <p dangerouslySetInnerHTML={{__html: `层高：${items.height}m&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp户型结构：${items.housingStructure}`}} ></p>
                                                                        <p>物业类型：{items.propertyType}</p>
                                                                        <p>户型优点： {items.advantage}</p>
                                                                        <p>户型缺点： {items.drawback}</p>
                                                                    </div>
                                                                </div>
                                                            </TabPane>

                                                )
                                            })
                                        }
                                        </Tabs>
                                    </TabPane>
                                )
                            })
                        }
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default connect(state => (
    {estateId: state.estateId}), {newEstateId})(Apartment)