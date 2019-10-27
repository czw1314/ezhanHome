import React from 'react'
import '../../css/bridalIndex.scss'
import {downloadPaper,getEstateMsg,getHousingMsg,getEstateAdvisers,delconcernedEstate,concernedEstate } from '../../api/index'
import {connect} from "react-redux";
import {newEstateId} from "../../redux/action";
import routes from '../../router/index';
import {Select, Button, Rate, Icon,Pagination, Input, Checkbox, Modal,Tabs,message,Popconfirm} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';

class BridalIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slideData: [
                {
                    albumName: "图集1",
                    photo: [{
                        img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568139456624&di=cfd00c334bc0e65cd8cc3693898873c7&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_70%2Cc_zoom%2Cw_640%2Fimages%2F20180622%2F68f11fbd447a4fe2a4183b5e8c9a4ba3.jpeg'
                    },],
                    count: 0
                }, {
                    albumName: "图集2",
                    photo: [{
                        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                    }],
                    count: 1
                },
                {
                    albumName: "图集3",
                    photo: [{
                        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                    }],
                    count: 2
                },
                {
                    albumName: "图集4",
                    photo: [{
                        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                    }],
                    count: 3
                },
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
            num: 24,//图片数量-1
            nums: -1,//图集-5
            active: 0,//第n张相片激活，
            keys: 0,
            location:'104.081525,30.406772',
            map:'',
            values:'',
            dynamicsLength:1,
            models:[],
            agent:[],
            consultantShow:[],
            consultant:[],
            visible: [],
            visible1:[],
            star:this.props.location.state?this.props.location.state.star:0,
        }
    }
    
        sortByKey(array, key) {
            return array.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            })
        }
    handleClickMenus = (e) => {
        this.setState({
            key: e.key,
        });
    }

    //大图向左
    goLeft() {
        this.setState({
            translateX: this.state.translateX + 792 > 0 ? 0 : this.state.translateX + 792,
            active: this.state.active - 1 <= 0 ? 0 : this.state.active - 1
        })
        for (let i = this.state.slideData.length - 1; i > this.state.slideData.length; i--) {
            if (this.state.slideData[i].count+1 === this.state.active) {
                this.setState({
                    translateXs: this.state.translateXs + 142 >= 0 ? 0 : this.state.translateXs + 142,
                })
            }
        }

    }

    //大图向右
    goRight() {
        this.setState({
            translateX: this.state.translateX -792 > (-this.state.num * 792) ? this.state.translateX - 792 : -this.state.num * 792,
            active: this.state.active + 1 > this.state.num ? this.state.num : this.state.active + 1
        })
        for (let i = 5; i < this.state.slideData.length; i++) {
            if (this.state.slideData[i - 1].count === this.state.active) {
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
    goRights() {
        this.setState({
            translateXs: this.state.translateXs - 142 >= (-this.state.nums * 142) ? this.state.translateXs - 142 : -this.state.nums * 142

        })
    }

    //指定跳转到某一图集
    goTo(str,l) {
        this.setState({
            translateX: -792 * (str - l+1) >= 0 ? 0 : -792 * (str - l+1),
            active: str > 0 ? str - l+1 : 0
        })
    }
    callback(key) {
        this.setState(
            {
                keys:key
            }
        )
    }
    goTo1(id){
        this.props.history.push({pathname:'/home/bridalHome/bridalApartment', state:{
            id: id,
            key:this.state.keys
            }})
    }
    componentDidMount() {
        //eslint-disable-next-line
        let params = {
            estateId: this.props.estateId||localStorage.getItem('estateId'),
        }
        let param1 = {
            estateId: this.props.estateId||localStorage.getItem('estateId'),
            role:3
        }
        let param2 = {
            estateId: this.props.estateId||localStorage.getItem('estateId'),
            role:4
        }
        getEstateMsg(params).then((res) => {
            if (res.data.code == 1) {
                let address=res.data.estate.distinctRegion.split('—')
                localStorage.setItem('address0',address[0])
                localStorage.setItem('address1',address[1])
                res.data.estate.estatePictures = this.sortByKey(res.data.estate.estatePictures, 'type')
                res.data.estate.estateMatchings = this.sortByKey(res.data.estate.estateMatchings, 'matchingType')
                let arr = res.data.estate.estatePictures.map(item => {
                    let arr = eval("(" + item.name + ")")
                    return arr
                })
                let albumName=['楼盘封面宣传图','区位图','楼盘总平面图','效果图','实景图','样板间','预售'],x=[],l=0;
                for(let i=0;i<arr.length;i++){
             
                            l+=arr[i].length
                            let ll=l-1
                    let obj={
                        albumName: albumName[i],
                        photo:[],
                        count:ll
                    }
                    for(let j=0;j<arr[i].length;j++){
                        obj.photo.push({img: 'http://47.108.87.104:8601/building/' + arr[i][j]})
                    }
                    x.push(obj)
                }
                var map = new window.AMap.Map('container', {
                    resizeEnable: true, //是否监控地图容器尺寸变化
                    zoom: 15, //初始化地图层级
                    center: res.data.estate.longitudeAtitude.split(",").map(Number) //初始化地图中心点
                });
                this.setState({
                    map: map
                })
                //标记项目位置
                var text = new window.AMap.Text({
                    text: res.data.estate.name,
                    anchor: 'center', // 设置文本标记锚点
                    cursor: 'pointer',
                    style: {
                        'padding': '.35rem .55rem',
                        'margin-bottom': '1rem',
                        'border-radius': '2rem',
                        'background-color': 'rgb(50,162,95)',
                        'border-width': 0,
                        'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                        'text-align': 'center',
                        'font-size': '14px',
                        'color': '#fff'
                    },
                    position: [104.081525, 30.406772]
                });
                text.setMap(map);
                this.setState({
                    slideData:x
                })
                console.log(l,res.data.estate.length-5)
           this.setState({
                    values: res.data.estate,
                    address:address,
                    num:l-1,
                    nums:res.data.estate.estatePictures.length-5
                })
            }
        })
        getHousingMsg(params).then((res)=>{
            if(res.data.code===1){
                let arr = res.data.models.map((item,index) => {
                    item.housingMsgs.map((itema,indexa)=>{
                        res.data.models[index].housingMsgs[indexa].picturePath=eval("(" + itema.picturePath + ")")
                    })
                })
                this.setState({
                    models:res.data.models
                })
            }

        })
        getEstateAdvisers(param1).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    agent:res.data.users
                })
            }
        })
        getEstateAdvisers(param2).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    consultant:res.data.users
                })
                this.setState({
                    consultantShow:this.state.consultant.slice(0,3)
                })
            }
        })

    }
    star(star){
        if(!localStorage.getItem('userId')){
            message.info('请先登陆');
            return // next step
        }
        if(star==1){
            let params = {
                estateId: this.props.estateId||localStorage.getItem('estateId'),
                userId:localStorage.getItem('userId')
            }
            concernedEstate(params).then((res)=>{
                if(res.data.code==1){
                    message.success('成功关注楼盘')
                    this.setState({
                        star
                    })
                }
            })
        }
        else{
            let params = {
                estateId: this.props.estateId||localStorage.getItem('estateId'),
                userId:localStorage.getItem('userId')
            }
            delconcernedEstate(params).then((res)=>{
                if(res.data.code==1){
                    message.success('成功取消关注楼盘')
                    this.setState({
                        star
                    })
                }
            }) 
        }
    }
    handleVisibleChange = (visible,index) => {

        // this.setState({ visible[index]:visible })

        // Determining condition before show the popconfirm.
        if (this.state.condition) {
            message.info('请先登陆'); // next step
        } else {
            let arr=this.state.visible
            arr[index]=!arr[index]
            this.setState({ visible:arr });
        }
    };
    handleVisibleChange1 = (visible,index) => {

        // this.setState({ visible[index]:visible })

        // Determining condition before show the popconfirm.
        if (!localStorage.getItem('userId')) {
            message.info('请先登陆'); // next step
        } else {
            let arr=this.state.visible1
            arr[index]=!arr[index]
            this.setState({ visible1:arr });
        }
    };
    page(index,size){
        this.setState({
            consultantShow:this.state.consultant.slice(index*size-4,index*size-1)
        })
    }
    down(){
        let params={
            estateId:this.props.estateId||localStorage.getItem('estateId'),
        }
        downloadPaper(params)
    }
    render() {
        const { TabPane } = Tabs,{values}=this.state;
        const estateId=this.props.estateId||localStorage.getItem('estateId')
        return (
            <div className='bridalIndex'>
                <div className={'title'}>
                    <p>{this.state.values.name}</p>
                    <div className={'tag'}>{this.state.values&&this.state.values.estatePropertyTypes.map(item=>{
                                        return(<span style={{marginRight:'10px'}} key={item.propertyType}>{item.propertyType}</span>)
                                    })}</div>
                </div>
                <p>备案名：XXXXXXXXX</p>
                <div className="banner">
                    <div className={'left'}>
                        <div className="large_box">
                            <div className={'go-left'} onClick={this.goLeft.bind(this)}>
                                <img src={require('../../img/go-left.png')}/>
                            </div>
                            <div className={'go-right'} onClick={this.goRight.bind(this)}>
                                <img src={require('../../img/go-right.png')}/>
                            </div>
                            <ul ref={'col-nav'} style={{transform: `translateX(${this.state.translateX}px)`}}>
                                {this.state.slideData.map((item, index) =>
                                    item.photo.map((items, index) =>
                                        <li className="item" data-index={index} key={index}>
                                            <img src={items.img}/>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div className="small_box">
                            <span className="btns lefts_btn" onClick={this.goLefts.bind(this)}></span>
                            <div className="small_list">
                                <ul style={{transform: `translateX(${this.state.translateXs}px)`}}>
                                    {this.state.slideData.map((item,index) =>
                                        <li className={`${this.state.active > (item.count - item.photo.length) ? (this.state.active <(item.count + 1) ? 'active' : '') : '' } `} key={index}
                                            data-count={item.photo.length} onClick={this.goTo.bind(this, item.count,item.photo.length)}
                                            data-index={item.count}>
                                            <img src={item.photo[0].img}/>
                                            <p>{item.albumName + '(' + item.photo.length + ')'}</p>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <span className="btns rights_btn" onClick={this.goRights.bind(this)}></span>
                        </div>
                        <div className={'center'}>
                            <p>楼盘详情</p>
                            <Button type="primary" icon="download" size={'large'} onClick={this.down.bind(this)}>
                                <a href={'http://47.108.87.104:8601/show/downloadPaper?estateId='+estateId} download style={{color:'#fff'}}>下载一页纸</a>
                            </Button>
                            <div className={'information'}>
                                <div className={'item'}>
                                    <p>物业类型：{this.state.values&&this.state.values.estatePropertyTypes.map(item=>{
                                        return(<span style={{marginRight:'10px'}} key={item.propertyType}>{item.propertyType}</span>)
                                    })}</p>
                                    <p>区域：{values.distinctRegion}</p>
                                </div>
                                <div className={'item'}>
                                    <p>楼盘地址：{this.state.values.adress}</p>
                                    <p>开发商：{this.state.values.develpers}</p>
                                </div>
                                <div className={'item'}>
                                    <p>产权年限：{values.propertyRightsYears}</p>
                                    <p>物业权属：{values.housingType}</p>
                                </div>
                                <div className={'item'}>
                                    <p>建筑类型：{values.buildingType}</p>
                                    <p>绿化率：{values.greeningRate}%</p>
                                </div>
                                <div className={'item'}>
                                    <p>建筑结构：{values.buildingStructure}</p>
                                    <p>容积率：{values.volumeRatio}%</p>
                                </div>
                                <div className={'item'}>
                                    <p>占地面积：{values.areaCovered}</p>
                                    <p>拿地时间：{values.holdedTime}</p>
                                </div>
                                <div className={'item'}>
                                    <p>总建筑面积：{values.floorage}</p>
                                    <p>交房时间（预计）：{values.housekeepingTime}</p>
                                </div>
                            </div>
                            <Button block>更多</Button>
                        </div>
                        <div className={'dynamic'}>
                            <h3>楼盘动态</h3>
                            {
                                values.estateDynamics&&values.estateDynamics.map((item,index)=>{
                                    return(
                                        <div className={'item'} style={{display:index<this.state.dynamicsLength?'block':'none'}} key={index}>
                                        <p><span>{item.title}</span>发布时间：{item.dynamicTime}</p>
                                        <p>{item.description}
                                        </p>
                                    </div>
                                    )
                                })
                            }
                            <Button block onClick={()=>this.setState({dynamicsLength:values.estateDynamics.length})} style={{display:this.state.dynamicsLength==1?'block':'none'}}>更多</Button>
                            <Button block onClick={()=>this.setState({dynamicsLength:1})} style={{display:this.state.dynamicsLength!=1?'block':'none'}}>收起</Button>
                        </div>
                        <div className={'nearby'}>
                            <h3>楼盘周边配套</h3>
                            <div id="container"></div>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="交通" key="1">
                                    <div style={{paddingTop:'14px',paddingBottom:'14px'}}>
                                    {values.estateMatchings&&values.estateMatchings[0]&&values.estateMatchings[0].description}
                                    </div>
                                </TabPane>
                                <TabPane tab="医疗" key="2">
                                <div style={{paddingTop:'14px',paddingBottom:'14px'}}>
                                    {values.estateMatchings&&values.estateMatchings[1]&&values.estateMatchings[1].description}
                                    </div>
                                </TabPane>
                                <TabPane tab="商业" key="3">
                                <div style={{paddingTop:'14px',paddingBottom:'14px'}}>
                                    {values.estateMatchings&&values.estateMatchings[2]&&values.estateMatchings[2].description}
                                    </div>
                                </TabPane>
                                <TabPane tab="教育" key="4">
                                <div style={{paddingTop:'14px',paddingBottom:'14px'}}>
                                    {values.estateMatchings&&values.estateMatchings[3]&&values.estateMatchings[3].description}
                                    </div>
                                </TabPane>
                            </Tabs>

                            <Button block>更多</Button>
                        </div>
                        <div className={'apartmentShow'}>
                            <div className={'title'}>
                                <h3>户型介绍</h3>
                                <p>查看全部户型详情</p>
                            </div>
                            <Tabs onChange={this.callback.bind(this)}  defaultActiveKey="0" >
                                {
                                    this.state.models&&this.state.models.map((item,index)=>{
                                        return(<TabPane  tab={item.housingType} key={index}>
                                            {
                                                  item.housingMsgs&&item.housingMsgs.map((items,index1)=>{
                                                      return(
                                                        <div className={'item'} key={index1}>
                                                        <div className={'left'}>
                                                       <div className={'pic'}>
                                                       <img src={ ('http://47.108.87.104:8601/housing/'+items.picturePath[0])||''}/>
                                                       </div>
                                                        <div className={'center'}>
                                                        <p>{items.housingTypeTitle}</p>
                                                        <p>户型：{items.housingDetailName}</p>
                                                        <p>建面：{items.area}</p>
                                                        <p>朝向：{items.orientations}</p>
                                                        <div className={'tag'}>
                                                        {
                                                                                items.housingTraits && items.housingTraits.map((itema, indexa) => {
                                                                                    return (
                                                                                        <span key={indexa}>{itema.traitName}</span>
                                                                                    )
                                                                                })
                                                                            }
                                                        </div>
                                                        </div>
                
                                                    </div>
                                                        <Button type="primary" style={{width:120}} onClick={this.goTo1.bind(this,index1)}>查看</Button>
                                                    </div>
                                                      )
                                                  })
                                            }
                              
                                        </TabPane>)
                                    })
                                }
                            </Tabs>
                        </div>
                    </div>
                    <div className={'right'}>
                        <div className={'first'}>
                            <div className={'titles'}>
                        <p className={'price'}><span>{values.referencePrice}</span>元/m²起</p>
                            <Rate character={<div><Icon type="heart" /><p>{this.state.star==1?"取消关注":'关注'}</p></div>}   count={1}  onChange={this.star.bind(this)} value={this.state.star}/>
                        </div>

                        <p className={'name'}>{values.distinctRegion}</p>
                        <p className={'tag'}>
                            {
                                values.estateTraits&&values.estateTraits.map(item=>{
                                    return(
                                        <span key={item.trait.traitName}>{item.trait.traitName}</span>
                                    )
                                })
                            }
                        </p>
                        <p className={'apartment'}>楼盘户型：{
                             this.state.models&&this.state.models.map((item,index)=>{
                                 return(
                                     <span style={{marginRight:'10px'}} key={index}>{item.housingType}</span>
                                 )
                        })
                    }</p>
                        <p className={'address'}>项目地址：<span>{values.adress}</span></p>
                            <p className={'star'}>推荐经纪人</p>
                            {
                                this.state.agent&&this.state.agent.map((item,index)=>{
                                    return(
                                        <div className={'item'} key={index}>
                                        <img src={'http://47.108.87.104:8601/user/'+item.head}/>
                                        <div className={'right'}>
                                        <p className={'name'}>{item.name}</p>
                                        <p className={'title'}>{item.position}</p>
                                        <p className={'phone'}><span>联系电话：</span>{item.contact}</p>
                                        <p className={'weixin'}>
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
                                    )
                                })
                            }
                     
                    </div>
                        <div className={'second'}>
                            <p className={'star'}>置业顾问</p>
                            {
                                this.state.consultantShow&&this.state.consultantShow.map((item,index)=>{
                                    return(        <div className={'item'} key={index}>
                                    <img src={'http://47.108.87.104:8601/user/'+item.head}/>
                                    <div className={'right'}>
                                    <p className={'name'}>{item.name}</p>
                                        <p className={'title'}>{item.position}</p>
                                        <p className={'phone'}><span>联系电话：</span>{item.contact}</p>
                                        <p className={'weixin'}>
                                                                    <Popconfirm
                                                                        title=""
                                                                        visible={this.state.visible1[index]}
                                                                        icon={<img src={'http://47.108.87.104:8601/user/'+item.wechatQrCode}/>}
                                                                        onVisibleChange={this.handleVisibleChange1.bind(this,index,index)}
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                    >
                                                                        <span>添加微信：查看二维码</span>
                                                                    </Popconfirm>
                                                                </p>
                                    </div>
                                </div>)
                                })

                            }
                            <Pagination defaultCurrent={1} total={this.state.consultant.length} defaultPageSize={4} onChange={this.page.bind(this)}/>
                        </div>
                </div>
                </div>
            </div>
        )
    }
}

export default  connect(state => (
    {estateId: state.estateId}), {newEstateId})(BridalIndex)