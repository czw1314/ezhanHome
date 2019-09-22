import React from 'react'
import '../../css/bridalIndex.scss'
import {mapInformation} from '../../api/index'
import routes from '../../router/index';
import {Select, Button, Rate, Icon,Pagination, Input, Checkbox, Modal,Tabs} from 'antd';
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
                    }, {
                        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                    }],
                    count: 2
                },
                {
                    albumName: "图集3",
                    photo: [{
                        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                    }, {
                        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                    }],
                    count: 4
                },
                {
                    albumName: "图集4",
                    photo: [{
                        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                    }, {
                        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                    }],
                    count: 6
                },
                {
                    albumName: "图集5",
                    photo: [{
                        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                    }, {
                        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                    }],
                    count: 8
                },
                {
                    albumName: "图集6",
                    photo: [{
                        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                    }, {
                        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                    }],
                    count: 10
                },
                {
                    albumName: "图集7",
                    photo: [{
                        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                    }, {
                        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                    }], count: 12
                },
                {
                    albumName: "图集8",
                    photo: [{
                        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                    }, {
                        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                    }],
                    count: 14
                },
                {
                    albumName: "图集9",
                    photo: [{
                        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586307270,557719933&fm=26&gp=0.jpg'
                    }, {
                        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3860023217,389419090&fm=26&gp=0.jpg'
                    }], count: 16
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
            num: 16,//图片数量-1
            nums: 4,//图集-5
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
            translateX: this.state.translateX + 800 > 0 ? 0 : this.state.translateX + 800,
            active: this.state.active - 1 <= 0 ? 0 : this.state.active - 1
        })
        for (let i = this.state.slideData.length - 1; i > this.state.slideData.length - 6; i--) {
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
            translateX: this.state.translateX - 800 > (-this.state.num * 800) ? this.state.translateX - 800 : -this.state.num * 800,
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
    goTo(str) {
        console.log(str)
        this.setState({
            translateX: -800 * (str - 1) >= 0 ? 0 : -800 * (str - 1),
            active: str > 0 ? str - 1 : 0
        })
    }
    callback(key) {
        console.log(key);
    }
    componentDidMount() {
        //eslint-disable-next-line
        var map = new window.AMap.Map('container', {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom: 15, //初始化地图层级
            center: [104.081525, 30.406772] //初始化地图中心点
        });
        this.setState({
            map: map
        })
        //标记项目位置
        var text = new window.AMap.Text({
            text: '北鑫苑',
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
    }
    //
    //
    //
    //         // });
    // }
    // getTraffic(){
    //     let parma={
    //         key:'e599ab72f8f09500a0e82df45258c061',
    //         location:this.state.location,
    //         keywords:'美食',
    //         radius:3000
    //     }
    //     var map=this.state.map
    //     mapInformation(parma).then((res)=>{
    //         window.AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'],
    //             function(MarkerList, SimpleMarker, SimpleInfoWindow) {
    //
    //                 //即jQuery/Zepto
    //                 var $ = MarkerList.utils.$;
    //
    //                 var defaultIconStyle = 'red', //默认的图标样式
    //                     hoverIconStyle = 'green', //鼠标hover时的样式
    //                     selectedIconStyle = 'purple' //选中时的图标样式
    //                 ;
    //                 var markerList = new MarkerList({
    //                     map: map,
    //                     //ListElement对应的父节点或者ID
    //                     listContainer: "myList", //document.getElementById("myList"),
    //                     //选中后显示
    //
    //                     //从数据中读取位置, 返回lngLat
    //                     getPosition: function (item) {
    //                         // console.log(item.loaction)
    //                         return item.location.split(',');
    //                     },
    //                     //数据ID，如果不提供，默认使用数组索引，即index
    //                     getDataId: function (item, index) {
    //
    //                         return item.id;
    //                     },
    //                     getInfoWindow: function (data, context, recycledInfoWindow) {
    //
    //                         if (recycledInfoWindow) {
    //
    //                             recycledInfoWindow.setInfoTitle(data.name);
    //                             recycledInfoWindow.setInfoBody(data.address);
    //
    //                             return recycledInfoWindow;
    //                         }
    //
    //                         return new SimpleInfoWindow({
    //                             infoTitle: data.name,
    //                             infoBody: data.address,
    //                             offset: new window.AMap.Pixel(0, -37)
    //                         });
    //                     },
    //                     //构造marker用的options对象, content和title支持模板，也可以是函数，返回marker实例，或者返回options对象
    //                     getMarker: function (data, context, recycledMarker) {
    //
    //                         var label = String.fromCharCode('A'.charCodeAt(0) + context.index);
    //
    //                         if (recycledMarker) {
    //                             recycledMarker.setIconLabel(label);
    //                             return;
    //                         }
    //
    //                         return new SimpleMarker({
    //                             containerClassNames: 'my-marker',
    //                             iconStyle: defaultIconStyle,
    //                             iconLabel: label
    //                         });
    //                     },
    //                     //构造列表元素，与getMarker类似，可以是函数，返回一个dom元素，或者模板 html string
    //                     getListElement: function (data, context, recycledListElement) {
    //
    //                         var label = String.fromCharCode('A'.charCodeAt(0) + context.index);
    //
    //                         //使用模板创建
    //                         var innerHTML = MarkerList.utils.template('<div class="poi-imgbox">' +
    //                             '    <span class="poi-img" style="background-image:url(<%- data.pic %>)"></span>' +
    //                             '</div>' +
    //                             '<div class="poi-info-left">' +
    //                             '    <h3 class="poi-title">' +
    //                             '        <%- label %>. <%- data.name %>' +
    //                             '    </h3>' +
    //                             '    <div class="poi-info">' +
    //                             '        <span class="poi-price">' +
    //                             '            <%= data.price %>' +
    //                             '        </span>' +
    //                             '        <p class="poi-addr"><%- data.address %></p>' +
    //                             '    </div>' +
    //                             '</div>' +
    //                             '<div class="clear"></div>', {
    //                             data: data,
    //                             label: label
    //                         });
    //
    //                         if (recycledListElement) {
    //                             recycledListElement.innerHTML = innerHTML;
    //                             return recycledListElement;
    //                         }
    //
    //                         return '<li class="poibox">' +
    //                             innerHTML +
    //                             '</li>';
    //                     },
    //                     //列表节点上监听的事件
    //                     listElementEvents: ['click', 'mouseenter', 'mouseleave'],
    //                     //marker上监听的事件
    //                     markerEvents: ['click', 'mouseover', 'mouseout'],
    //                     //makeSelectedEvents:false,
    //                     selectedClassNames: 'selected',
    //                     autoSetFitView: true
    //                 });
    //
    //                 window.markerList = markerList;
    //
    //                 markerList.on('selectedChanged', function (event, info) {
    //
    //                     checkBtnStats();
    //
    //                     if (info.selected) {
    //
    //                         console.log(info);
    //
    //                         if (info.selected.marker) {
    //                             //更新为选中样式
    //                             info.selected.marker.setIconStyle(selectedIconStyle);
    //                         }
    //
    //                         //选中并非由列表节点上的事件触发，将关联的列表节点移动到视野内
    //                         if (!info.sourceEventInfo.isListElementEvent) {
    //
    //                             if (info.selected.listElement) {
    //                                 scrollListElementIntoView($(info.selected.listElement));
    //                             }
    //                         }
    //                     }
    //
    //                     if (info.unSelected && info.unSelected.marker) {
    //                         //更新为默认样式
    //                         info.unSelected.marker.setIconStyle(defaultIconStyle);
    //                     }
    //                 });
    //
    //                 markerList.on('listElementMouseenter markerMouseover', function (event, record) {
    //
    //                     if (record && record.marker) {
    //
    //                         forcusMarker(record.marker);
    //
    //                         //this.openInfoWindowOnRecord(record);
    //
    //                         //非选中的id
    //                         if (!this.isSelectedDataId(record.id)) {
    //                             //设置为hover样式
    //                             record.marker.setIconStyle(hoverIconStyle);
    //                             //this.closeInfoWindow();
    //                         }
    //                     }
    //                 });
    //
    //                 markerList.on('listElementMouseleave markerMouseout', function (event, record) {
    //
    //                     if (record && record.marker) {
    //
    //                         if (!this.isSelectedDataId(record.id)) {
    //                             //恢复默认样式
    //                             record.marker.setIconStyle(defaultIconStyle);
    //                         }
    //                     }
    //                 });
    //
    //                 //数据输出完成
    //                 markerList.on('renderComplete', function (event, records) {
    //
    //                     checkBtnStats();
    //                 });
    //
    //                 // markerList.on('*', function(type, event, res) {
    //                 //     console.log(type, event, res);
    //                 // });
    //
    //                 //加载数据
    //                 function loadData(src, callback) {
    //
    //                     $.getJSON(src, function (data) {
    //
    //                         markerList._dataSrc = src;
    //                         console.log(data)
    //                         console.log(res.data.pois)
    //                         //渲染数据
    //                         markerList.render(res.data.pois);
    //
    //                         if (callback) {
    //                             callback(null, data);
    //                         }
    //                     });
    //                 }
    //
    //                 var $btns = $('#btnList input[data-path]');
    //
    //                 /**
    //                  * 检测各个button的状态
    //                  */
    //                 function checkBtnStats() {
    //                     $('#btnList input[data-enable]').each(function () {
    //
    //                         var $input = $(this),
    //                             codeEval = $input.attr('data-enable');
    //
    //                         $input.prop({
    //                             disabled: !eval(codeEval)
    //                         });
    //                     });
    //                 }
    //
    //                 $('#btnList').on('click', 'input', function () {
    //                     var $input = $(this),
    //                         dataPath = $input.attr('data-path'),
    //                         codeEval = $input.attr('data-eval');
    //
    //                     if (dataPath) {
    //                         loadData(dataPath);
    //                     } else if (codeEval) {
    //                         eval(codeEval);
    //                     }
    //
    //                     checkBtnStats();
    //                 });
    //
    //                 loadData($btns.attr('data-path'));
    //
    //                 function forcusMarker(marker) {
    //                     marker.setTop(true);
    //
    //                     //不在地图视野内
    //                     if (!(map.getBounds().contains(marker.getPosition()))) {
    //
    //                         //移动到中心
    //                         map.setCenter(marker.getPosition());
    //                     }
    //                 }
    //
    //                 function isElementInViewport(el) {
    //                     var rect = el.getBoundingClientRect();
    //
    //                     return (
    //                         rect.top >= 0 &&
    //                         rect.left >= 0 &&
    //                         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
    //                         rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    //                     );
    //                 }
    //
    //                 function scrollListElementIntoView($listEle) {
    //
    //                     if (!isElementInViewport($listEle.get(0))) {
    //                         $('#panel').scrollTop($listEle.offset().top - $listEle.parent().offset().top);
    //                     }
    //
    //                     //闪动一下
    //                     $listEle
    //                         .one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
    //                             function (e) {
    //                                 $(this).removeClass('flash animated');
    //                             }).addClass('flash animated');
    //                 }
    //             })
    //     })
    // }
    render() {
        const { TabPane } = Tabs;
        return (
            <div className='bridalIndex'>
                <div className={'title'}>
                    <p>楼盘名称推广名</p>
                    <div className={'tag'}><span>高层住宅</span><span>高层住宅</span><span>高层住宅</span></div>
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
                                        <li className="item" data-index={index}>
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
                                    {this.state.slideData.map(item =>
                                        <li className={this.state.active > (item.count - item.photo.length) ? (this.state.active < (item.count + 1) ? 'active' : '') : ''}
                                            data-count={item.photo.length} onClick={this.goTo.bind(this, item.count)}
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
                            <Button type="primary" icon="download" size={'large'}>
                                下载一页纸
                            </Button>
                            <div className={'information'}>
                                <div className={'item'}>
                                    <p>物业类型：</p>
                                    <p>区域：</p>
                                </div>
                                <div className={'item'}>
                                    <p>楼盘地址：</p>
                                    <p>开发商：</p>
                                </div>
                                <div className={'item'}>
                                    <p>产权年限：</p>
                                    <p>物业权属：</p>
                                </div>
                                <div className={'item'}>
                                    <p>建筑类型：</p>
                                    <p>绿化率：</p>
                                </div>
                                <div className={'item'}>
                                    <p>建筑结构：</p>
                                    <p>容积率：</p>
                                </div>
                                <div className={'item'}>
                                    <p>占地面积：</p>
                                    <p>容积率：</p>
                                </div>
                                <div className={'item'}>
                                    <p>总占地面积：</p>
                                    <p>交房时间（预计）：</p>
                                </div>
                            </div>
                            <Button block>更多</Button>
                        </div>
                        <div className={'dynamic'}>
                            <h3>楼盘动态</h3>
                                <div className={'item'}>
                                    <p><span>项目相关介绍楼盘资讯</span>发布时间：2019-06-08</p>
                                    <p>市中心·东大街·太古里旁，新希望D10天府，首批次住宅产品在售中，建面约200-500㎡国际城央天际大宅，6梯4户奢华配置，2
                                        82°视野，详询售楼部。
                                    </p>
                                </div>
                            <Button block>更多</Button>
                        </div>
                        <div className={'nearby'}>
                            <h3>楼盘周边配套</h3>
                            <div id="container"></div>
                            <Tabs defaultActiveKey="1" onChange={this.callback}>
                                <TabPane tab="交通" key="1">
                                    <div>
                                        附近地铁站<br></br>
                                        海昌路
                                    </div>
                                </TabPane>
                                <TabPane tab="医疗" key="2">
                                    Content of Tab Pane 2
                                </TabPane>
                                <TabPane tab="商业" key="3">
                                    Content of Tab Pane 3
                                </TabPane>
                                <TabPane tab="教育" key="4">
                                    Content of Tab Pane 3
                                </TabPane>
                            </Tabs>
                            {/*<ul id="btnList">*/}
                                {/*<li>*/}
                                    {/*<input value="美食数据" type="button" data-path="//a.amap.com/amap-ui/static/data/restaurant.json" />*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                    {/*<input value="酒店数据" type="button" data-path="//a.amap.com/amap-ui/static/data/hotel.json" />*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                    {/*<input value="选中第一个" type="button" data-enable='markerList.getData().length>0' data-eval='markerList.selectByDataIndex(0)' />*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                    {/*<input value="选中最后一个" type="button" data-enable='markerList.getData().length>0' data-eval='markerList.selectByDataReverseIndex(0)' />*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                    {/*<input value="清除选中" type="button" data-enable='!!markerList.getSelectedDataId()' data-eval='markerList.clearSelected()' />*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                    {/*<input value="清除数据" type="button" data-enable='markerList.getData().length>0' data-eval='markerList.clearData()' />*/}
                                {/*</li>*/}
                            {/*</ul>*/}
                            {/*<div id="panel" className="scrollbar1">*/}
                                {/*<ul id="myList">*/}
                                {/*</ul>*/}
                                {/*1w*/}
                            {/*</div>*/}
                            <Button block>更多</Button>
                        </div>
                        <div className={'apartment'}>
                            <div className={'title'}>
                                <h3>户型介绍</h3>
                                <p>查看全部户型详情</p>
                            </div>
                            <Tabs defaultActiveKey="1" onChange={this.callback}>
                                <TabPane tab="一居室" key="1">
                                    <div className={'item'}>
                                        <div className={'left'}>
                                       <div className={'pic'}>
                                           <img src={require('../../img/apartment.png')}/>
                                       </div>
                                        <div className={'center'}>
                                        <p>C1户型-56m²</p>
                                        <p>户型：1室2厅2卫</p>
                                        <p>建面：56m²</p>
                                        <p>朝向：东南</p>
                                        <div className={'tag'}>
                                            <span>精装</span>
                                            <span>南北通透</span>
                                            <span>户型方正</span>
                                        </div>
                                        </div>

                                    </div>
                                        <Button type="primary" style={{width:120}}>查看</Button>
                                    </div>
                                    <div className={'item'}>
                                        <div className={'left'}>
                                            <div className={'pic'}>
                                                <img src={require('../../img/apartment.png')}/>
                                            </div>
                                            <div className={'center'}>
                                                <p>C1户型-56m²</p>
                                                <p>户型：1室2厅2卫</p>
                                                <p>建面：56m²</p>
                                                <p>朝向：东南</p>
                                                <div className={'tag'}>
                                                    <span>精装</span>
                                                    <span>南北通透</span>
                                                    <span>户型方正</span>
                                                </div>
                                            </div>

                                        </div>
                                        <Button type="primary" style={{width:120}}>查看</Button>
                                    </div>
                                </TabPane>
                                <TabPane tab="二居室" key="2">
                                    Content of Tab Pane 2
                                </TabPane>
                                <TabPane tab="三居室" key="3">
                                    Content of Tab Pane 3
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                    <div className={'right'}>
                        <div className={'first'}>
                            <div className={'titles'}>
                        <p className={'price'}><span>18000</span>元/m²起</p>
                            <Rate character={<div><Icon type="heart" /><p>关注</p></div>}   count='1'  />
                        </div>

                        <p className={'name'}>天府新区-麓山</p>
                        <p className={'tag'}>
                            <span>品牌房企</span>
                            <span>品牌房企</span>
                        </p>
                        <p className={'apartment'}><span>楼盘户型：</span>一居室（2）</p>
                        <p className={'address'}>项目地址：<span>柳荫路新希望锦官府</span></p>
                            <p className={'star'}>推荐经纪人</p>
                            <div className={'item'}>
                                <img src={require('../../img/agent.png')}/>
                                <div className={'right'}>
                                <p className={'name'}>周航与</p>
                                <p className={'title'}>房地产经纪人</p>
                                <p className={'phone'}><span>联系电话：</span>156515645645</p>
                                <p className={'weixin'}>添加微信：查看二维码</p>
                                </div>
                            </div>
                    </div>
                        <div className={'second'}>
                            <p className={'star'}>置业顾问</p>
                            <div className={'item'}>
                                <img src={require('../../img/agent.png')}/>
                                <div className={'right'}>
                                    <p className={'name'}>周航与</p>
                                    <p className={'title'}>房地产经纪人</p>
                                    <p className={'phone'}><span>联系电话：</span>156515645645</p>
                                    <p className={'weixin'}>添加微信：查看二维码</p>
                                </div>
                            </div>
                            <Pagination defaultCurrent={1} total={50} />
                        </div>
                </div>
                </div>
            </div>
        )
    }
}

export default BridalIndex