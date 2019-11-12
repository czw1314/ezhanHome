import React from 'react'
import '../../css/bridalAdmin.scss'
import {connect} from "react-redux";
import axios from 'axios';
import {Route,withRouter} from 'react-router-dom'
import {newEstateId, getFileList,setHousingPictures} from "../../redux/action";
import {Tabs, Input, Button, Form, Upload, Icon, message,Select, Modal, Cascader,notification} from 'antd';
import {
    getDistrictRegions,
    estatePublished,
    delHousingPictures,
    getBuildingTypes,
    getBuildingStructures,
    getHousingStructures,
    getPropertyTypes,
    getTraits,
    getHouseTypes,
    delPhoto,
    getStreetEstates,
    updata,
    getEstateMsg,
    getHouseTraits,
    getEstateAgents,
    searchEstate
} from '../../api/index'

//上传户型
class HousingPicturesWal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            estateId: '',
            housingMsgId: ''
        };
    }
    handleCancel = () => this.setState({previewVisible: false});

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    remove(file) {
        let params = {
            "housingMsgId": this.state.housingMsgId,
        }
        delHousingPictures(params)
    }

    handleChange = ({file, fileList}) => {
        let arr = this.props.housingPictures
        arr[this.props.id] =fileList
        this.props.setHousingPictures(arr)
        this.setState({fileList})
        if (file.status === 'done' && file.response.estateId) {
            this.props.setId(this.props.id,file.response.estateId)
            this.setState({
                housingMsgId: file.response.estateId,
            })
        }
    };

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (

            <div className="clearfix" style={{marginLeft: '20px', width: '90%'}}>
                <Upload
                    action="http://47.108.87.104:8501/estate/housingPictures"
                    name={'files'}
                    data={{
                        housingMsgId:this.state. housingMsgId||0,
                    }}
                    fileList={this.props.housingPictures[this.props.id]||[]}
                    listType="picture-card"
                    onPreview={this.handlePreview}
                    onRemove={this.remove.bind(this)}
                    onChange={this.handleChange.bind(this)}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} className={'imgUp'}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}
const HousingPicturesWall = connect(state => (
    {housingPictures: state.housingPictures,estateId: state.estateId}), {setHousingPictures})(HousingPicturesWal);
//上传楼盘信息
class Information extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            buildingTypes: [],
            deliveryStandard: '',
            decorateStandard: '',
            deliverDecorateStandard: '',
            buildingStructures: [],
            propertyTypes: [],
            propertyTypeLength: [''],
            traits: [],
            houseTypes: [],
            houseTraits: [],
            housingMsgs: [{
                advantage: '',
                area: '',
                drawback: '',
                height: '',
                housingDetailName: '',
                housingStructure: '',
                housingTraitIds: [],
                housingType: '',
                housingTypeTitle: '',
                orientations: '',
                propertyType: '',
            }],
            id:[]
        }
    }

    componentDidMount() {
        getBuildingTypes().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].buildingType,
                    }
                    option.push(item)
                }
                this.setState({
                    buildingTypes: option
                })
            }
        })
        getHouseTraits().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].houseTraitName,
                    }
                    option.push(item)
                }
                this.setState({
                    houseTraits: option
                })
            }
        })
        getHouseTypes().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].houseType,
                    }
                    option.push(item)
                }
                this.setState({
                    houseTypes: option
                })
            }
        })
        getBuildingStructures().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].buildingStructure,
                    }
                    option.push(item)
                }
                this.setState({
                    buildingStructures: option
                })
            }
        })
        getHousingStructures().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].housingStructure,
                    }
                    option.push(item)
                }
                this.setState({
                    housingStructures: option
                })
            }
        })
        getPropertyTypes().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].propertyType
                    }
                    option.push(item)
                }
                this.setState({
                    propertyTypes: option
                })
            }
        })
        getTraits().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].traitName
                    }
                    option.push(item)
                }
                this.setState({
                    traits: option
                })
            }
        })
        getDistrictRegions().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].name,
                        children: []
                    }
                    for (let j = 0; j < res.data.list[i].regions.length; j++) {
                        let items = {
                            value: res.data.list[i].regions[j].id,
                            label: res.data.list[i].regions[j].street,
                        }
                        item.children.push(items)
                    }
                    option.push(item)
                }
                this.setState({
                    districtRegionsList: option
                })
            }
        })
        this.props.form.setFieldsValue({
            nam: this.props.values
        })
    }
    setValue(index,value){
        let arr=this.state.id
        arr[index]=value
        this.setState({
            id:arr
        })
    }
    //转化为base64
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    //上传楼盘信息
    handleSubmit = e => {

        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.regionId = values.regionId[1]
                values.estateId = this.props.estateId
                values.matchings.map((item, index) => {
                    item.type = index + 1
                    item.matching=item.matching.replace(/\n/g,"<br></br>")
                })
                let params = values

                estatePublished(params).then((res) => {
                    if (res.data.code === 1) {
                        const key = `open${Date.now()}`;
                        const btn = (
                            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                确定
                            </Button>
                        );
                        notification.success({
                            message: '楼盘信息发布成功',
                            btn,
                            key,
                            duration: 0,
                        });
                    }
                    else{
                        const key = `open${Date.now()}`;
                        const btn = (
                            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                确定
                            </Button>
                        );
                        notification.error({
                            message: '楼盘信息发布失败',
                            btn,
                            key,
                            duration: 0,
                        });
                    }
                })
            }
        });
    };

    delHousing(index) {
        this.state.housingMsgs.splice(index, 1)
        let arr = this.props.form.getFieldValue('housingMsgs')
        arr.splice(index, 1)
        this.setState({
                housingMsgs: arr,
                visible:true
            }
        )
        this.props.form.setFieldsValue({
            housingMsgs: arr
        })
    }

    addHousing(index) {
        this.state.housingMsgs.push('')
        this.setState({
                housingMsgs: this.state.housingMsgs
            }
        )
    }

    //区域选择
    onChange(checkedValues) {
        this.setState({
            regionId: checkedValues[1]
        })
    }

    onChange1(checkedValues) {
        this.setState({
            regionId1: checkedValues[1]
        })
    }

    onChange2(checkedValues) {
        this.setState({
            regionId2: checkedValues[1]
        })
    }

    onPosition(value) {
        this.setState({
            position: value
        })
    }
    //确定弹出框
    showConfirm(fun) {
        const { confirm } = Modal;
        confirm({
          title: '是否发布楼盘信息?',
          content: '',
          okText:"确认",
          cancelText:"取消",
          onOk:()=> {
            fun()
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 10},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
            },
        };
        const {getFieldDecorator} = this.props.form;
        const base = 'http://47.108.87.104:8501/user/uploadFile';
        const {Option} = Select
        return (
            <Form onSubmit={this.handleSubmit} className="login-form first" {...formItemLayout}>
                <Form.Item label={'一、填写基本信息：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'地址经纬度：'}  labelAlign={'left'} labelCol={{span: 5}}>
                    {getFieldDecorator('longitudeAndAtitude')(
                        <Input placeholder="164564561，154，4545645，546" style={{width:200}}/>
                    )}
                </Form.Item>
                <a href='https://lbs.amap.com/console/show/picker' target="_blank" style={{width:'60%',marginLeft:20,marginTop:10}}>高德地图经纬度查询</a>
                <Form.Item label='1、楼盘名称（推广名）：'>
                    {getFieldDecorator('name')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label='2、备案名：'>
                    {getFieldDecorator('recordName')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'3、区域位置：'}>
                    {getFieldDecorator('regionId')(
                        <Cascader options={this.state.districtRegionsList} placeholder={''}/>
                    )}
                </Form.Item>
                {/* <Form.Item label='4、物业类型：'>
                    {getFieldDecorator('propertyTypeIds')(
                        <Select mode="multiple">
                            {this.state.propertyTypes && this.state.propertyTypes.map(item => {
                                    return (<Option value={item.value}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item> */}
                {/*<Form.Item label={'楼盘价格：'}>*/}
                    {/*{getFieldDecorator('referencePrice')(*/}
                        {/*<Input addonAfter="元m²/起"/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label={'楼盘区域：'}>*/}
                    {/*{getFieldDecorator('regionId')(*/}
                        {/*<Cascader options={this.state.districtRegionsList} placeholder={''}/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                <Form.Item label={'4、开发商：'}>
                    {getFieldDecorator('develpers')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'5、楼盘地址：'}>
                    {getFieldDecorator('adress')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'6、物业权属：'}>
                    {getFieldDecorator('housingType')(
                        <Select>
                            {this.state.houseTypes && this.state.houseTypes.map(item => {
                                    return (<Option value={item.label}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'7、产权年限：'}>
                    {getFieldDecorator('propertyRightsyears')(
                        <Input placeholder="默认70年"/>
                    )}
                </Form.Item>
                <Form.Item label={'8、建筑类型：'}>
                    {getFieldDecorator('buildingType')(
                        <Select>
                            {this.state.buildingTypes && this.state.buildingTypes.map(item => {
                                    return (<Option value={item.label}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'9、占地面积：'}>
                    {getFieldDecorator('areaCovered')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'10、绿化率：'}>
                    {getFieldDecorator('greeningRate')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'11、总建筑面积：'}>
                    {getFieldDecorator('floorage')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'12、容积率：'}>
                    {getFieldDecorator('volumeRate')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'13、拿地日期：'}>
                    {getFieldDecorator('holdedTime')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'14、交房日期：'}>
                    {getFieldDecorator('housekeepingTime')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'15、规划户数：'}>
                    {getFieldDecorator('pannedHouseholds')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'16、楼栋总数：'}>
                    {getFieldDecorator('buildingAmount')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'17、梯户比：'}>
                    {getFieldDecorator('staircasesRatio')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'18、楼层状况：'}>
                    {getFieldDecorator('floors')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'19、装修状况：'}>
                    {getFieldDecorator('decorateStandard')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'20、车位数：'}>
                    {getFieldDecorator('parkingNumbers')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'21、物管公司：'}>
                    {getFieldDecorator('propertyCompany')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'22、物管费：'}>
                    {getFieldDecorator('propertyFee')(
                        <Input/>
                    )}
                </Form.Item>
                {/*<Form.Item label="楼盘项目特色：">*/}
                    {/*{getFieldDecorator('traitIds',)(*/}
                        {/*<Select mode="multiple">*/}
                            {/*{this.state.traits && this.state.traits.map(item => {*/}
                                    {/*return (<Option value={item.value}>{item.label}</Option>)*/}
                                {/*}*/}
                            {/*)}*/}
                        {/*</Select>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label={'建面区间：'}>*/}
                    {/*{getFieldDecorator('areaRange')(*/}
                        {/*<Input addonAfter="m²" placeholder="格式：100-200"/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label={'上市时间：'}>*/}
                    {/*{getFieldDecorator('timeToMarket')(*/}
                        {/*<Input placeholder="格式：2018-08-08"/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label="建筑结构：">*/}
                    {/*{getFieldDecorator('buildingStructure')(*/}
                        {/*<Select>*/}
                            {/*{this.state.buildingStructures && this.state.buildingStructures.map(item => {*/}
                                    {/*return (<Option value={item.label}>{item.label}</Option>)*/}
                                {/*}*/}
                            {/*)}*/}
                        {/*</Select>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label="户型结构：">*/}
                    {/*{getFieldDecorator('housingStructureIds')(*/}
                        {/*<Select mode="multiple">*/}
                            {/*{this.state.housingStructures && this.state.housingStructures.map(item => {*/}
                                    {/*return (<Option value={item.value}>{item.label}</Option>)*/}
                                {/*}*/}
                            {/*)}*/}
                        {/*</Select>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label={'层高：'}>*/}
                    {/*{getFieldDecorator('floorHeight')(*/}
                        {/*<Input addonAfter="m"/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label={'公摊：'}>*/}
                    {/*{getFieldDecorator('shareArea')(*/}
                        {/*<Input/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label={'交付标准：'}>*/}
                    {/*{getFieldDecorator('deliveryStandard')(*/}
                        {/*<Select>*/}
                            {/*<Option value="清水">清水</Option>*/}
                            {/*<Option value="精装">精装</Option>*/}
                        {/*</Select>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}


                {/*<Form.Item label={'车位配比：'}>*/}
                    {/*{getFieldDecorator('parkingRatio')(*/}
                        {/*<Input/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}

                {/*<Form.Item label={'项目介绍：'}>*/}
                    {/*{getFieldDecorator('introduction')(*/}
                        {/*<Input.TextArea/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/* <Form.Item label={'项目内部配套：'}>
                    {getFieldDecorator('internalMatching')(
                        <Input.TextArea/>
                    )}
                </Form.Item> */}
                {/* <Form.Item label={'交付装修标准：'}>
                    {getFieldDecorator('deliverDecorateStandard')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'不利因素：'}>
                    {getFieldDecorator('harmful_publicity')(
                        <Input.TextArea/>
                    )}
                </Form.Item> */}
                <Form.Item label={'二、添加楼盘相册：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'楼盘封面宣传图'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallId photoType={'0'}></PicturesWallId>
                </Form.Item>
                <Form.Item label={'区位图'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallId photoType={'1'}></PicturesWallId>
                </Form.Item>
                <Form.Item label={'楼盘总平面图'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallId photoType={'2'}></PicturesWallId>
                </Form.Item>
                <Form.Item label={'楼盘效果图'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallId photoType={'3'}></PicturesWallId>
                </Form.Item>
                <Form.Item label={'楼盘实景图'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallId photoType={'4'}></PicturesWallId>
                </Form.Item>
                <Form.Item label={'样板间'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallId photoType={'5'}></PicturesWallId>
                </Form.Item>
                <Form.Item label={'添加预售'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallId photoType={'6'}></PicturesWallId>
                </Form.Item>
                {/*<Form.Item label={'3、楼盘动态：'} className={'item'} labelAlign={'left'}>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label={'楼盘动态标题：'} className={'item'} labelCol={{span: 3}}>*/}
                    {/*{getFieldDecorator('dynamic.dynamicTitle')(*/}
                        {/*<Input/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label={'发布内容：'} className={'item'} labelCol={{span: 3}}>*/}
                    {/*{getFieldDecorator('dynamic.dynamicContent')(*/}
                        {/*<Input.TextArea/>*/}
                    {/*)}*/}
                {/*</Form.Item>*/}
                <Form.Item label={'三、项目外部配套（从近到远排序）（3公里范围）：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'交通配套：'} className={'item'} labelCol={{span: 3}} wrapperCol={{span: 17}}>
                    {getFieldDecorator('matchings[0].matching')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'医疗配套：'} className={'item'} labelCol={{span: 3}} wrapperCol={{span: 17}}>
                    {getFieldDecorator('matchings[1].matching')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'商业配套：'} className={'item'} labelCol={{span: 3}} wrapperCol={{span: 17}}>
                    {getFieldDecorator('matchings[2].matching')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'教育配套：'} className={'item'} labelCol={{span: 3}} wrapperCol={{span: 17}}>
                    {getFieldDecorator('matchings[3].matching')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'四、添加户型信息以及户型图（支持格式PNG，JPG）：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                {
                    this.state.housingMsgs && this.state.housingMsgs.map((item, index) => {
                            return (<div style={{width: '100%', display: 'flex', flexWrap: 'wrap'}}>
                                <Form.Item label={'1、户型图上传：'}>
                                    <HousingPicturesWall id={index} setId={this.setValue.bind(this)}></HousingPicturesWall>
                                </Form.Item>
                                <Form.Item label={'2、户型编码：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingTypeTitle`)(
                                        <Input/>
                                    )}
                                </Form.Item>
                                <Form.Item label={'3、户型选择：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingType`)(
                                        <Select>
                                            <Option value="一居室">一居室</Option>
                                            <Option value="两居室">两居室</Option>
                                            <Option value="三居室">三居室</Option>
                                            <Option value="四居室">四居室</Option>
                                            <Option value="五居室">五居室</Option>
                                            <Option value="五居室以上">五居室以上</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label={'4、套型：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingDetailName`)(
                                        <Input/>
                                    )}
                                </Form.Item>
                                <Form.Item label={'5、建面：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].area`)(
                                        <Input addonAfter="m²"/>
                                    )}
                                </Form.Item>
                                <Form.Item label={'6、层高：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].height`)(
                                        <Input addonAfter="m"/>
                                    )}
                                </Form.Item>
                                <Form.Item label={'7、物业类型：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].propertyType`)(
                                        <Select>
                                            {this.state.propertyTypes && this.state.propertyTypes.map(item => {
                                                    return (<Option value={item.label}>{item.label}</Option>)
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label={'8、户型朝向：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].orientations`)(
                                       <Select>
                                       <Option value="东">东</Option>
                                       <Option value="东南">东南</Option>
                                       <Option value="南">南</Option>
                                       <Option value="西南">西南</Option>
                                       <Option value="西">西</Option>
                                       <Option value="西北">西北</Option>
                                       <Option value="北">北</Option>
                                       <Option value="东北">东北</Option>
                                   </Select>
                                    )}
                                </Form.Item>
                    
                                <Form.Item label={'9、户型结构：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingStructure`)(
                                        <Select>
                                            {this.state.housingStructures && this.state.housingStructures.map(item => {
                                                    return (<Option value={item.label}>{item.label}</Option>)
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label="10、户型特色：">
                                    {getFieldDecorator(`housingMsgs[${index}].housingTraitIds`)(
                                        <Select mode="multiple">
                                            {this.state.houseTraits && this.state.houseTraits.map(item => {
                                                    return (<Option value={item.value}>{item.label}</Option>)
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label="户型特色：" style={{display:'none'}}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingMsgId`, {initialValue: this.state.id?this.state.id[index]:''})(
                                        <Select mode="multiple">
                                            {this.state.houseTraits && this.state.houseTraits.map(item => {
                                                    return (<Option value={item.value}>{item.label}</Option>)
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>

                                <Form.Item label={'11、户型点评：'}  style={{width:'66%'}}>
                                    {getFieldDecorator(`housingMsgs[${index}].advantage`)(
                                        <Input.TextArea style={{width:348}}/>
                                    )}
                                </Form.Item>
                                {/* <Form.Item label={'户型缺点：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].drawback`)(
                                        <Input.TextArea/>
                                    )}
                                </Form.Item> */}
                                <Form.Item labelCol={{span: 13}}>
                                    <Button type="primary" onClick={()=>{this.props.delHousing(index);this.delHousing(index)}}
                                            style={{marginLeft: '200px', marginTop: '-50px'}}>删除户型</Button>
                                </Form.Item>
                            </div>)
                        }
                    )
                }
                <Form.Item>
                    <Button icon={'plus'} type="primary" onClick={this.addHousing.bind(this)}>继续添加户型</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.showConfirm.bind(this,this.handleSubmit.bind(this))}>确认发布并打开该楼盘详情页</Button>
                </Form.Item>
            </Form>
        );
    }
}

const InformationForms = connect(state => (
    {estateId: state.estateId}), {newEstateId})(Form.create({name: 'retrieve'})(Information));

//上传图片
class PicturesWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            estateId: '',
            multiple: true,
        };
    }


    handleCancel = () => this.setState({previewVisible: false});

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    remove(file) {
        let params = {
            "estateId": this.state.estateId,
            "photoName": file.response.paths[0],
            "photoType": this.props.photoType
        }
        delPhoto(params)
    }

    handleChange = ({file, fileList}) => {
        this.setState({fileList})
        if (file.status === 'done' && file.response.estateId) {
            this.setState({
                estateId: file.response.estateId,
                multiple: true
            })
            this.props.newEstateId(file.response.estateId)
        }
    };

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        console.log(this.props.fileList)
        return (
            <div className="clearfix" style={{marginLeft: '20px', width: '90%'}}>
                <Upload
                    action="http://47.108.87.104:8501/estate/estatePhoto"
                    name={'files'}
                    data={{
                        estateId: this.props.estateId || 0,
                        photoType: this.props.photoType
                    }}
                    listType="picture-card"
                    multiple={this.state.multiple}
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onRemove={this.remove.bind(this)}
                    onChange={this.handleChange.bind(this)}
                >
                    {uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} className={'imgUp'}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

const PicturesWallId = connect(state => (
    {estateId: state.estateId}), {newEstateId})(PicturesWall);

//更新户型
class HousingPicturesWallUpdata extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            estateId: '',
            housingMsgId: ''
        };
    }


    handleCancel = () => this.setState({previewVisible: false});

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    //

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    remove(file) {
        let params = {
            "housingMsgId": file.id,
        }
        let fileList = this.props.housingPictures[this.props.id]
        fileList.splice(-file.uid - 1, 1)
        let arr = this.props.housingPictures
        arr[this.props.id] = fileList
        this.props.setHousingPictures(arr)
        this.setState({
            remove: file.id
        })
        delHousingPictures(params)
    }

    handleChange = ({file, fileList}) => {
        let arr = this.props.housingPictures
        arr[this.props.id] =fileList
        this.props.setHousingPictures(arr)
        this.setState({
            x:1
        })
        if(file.response){
            this.props.setId(this.props.id,file.response.estateId)
        }
    };

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <div className="clearfix" style={{marginLeft: '20px', width: '90%'}}>
                <Upload
                    action="http://47.108.87.104:8501/estate/housingPictures"
                    name={'files'}
                    data={{
                        housingMsgId: this.props.estateId||0,
                    }}
                    fileList={this.props.housingPictures[this.props.id]||[]}
                    listType="picture-card"
                    onPreview={this.handlePreview}
                    onRemove={this.remove.bind(this)}
                    onChange={this.handleChange.bind(this)}
                >
                    {this.props.housingPictures[this.props.id]&&this.props.housingPictures[this.props.id].length>= 1 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} className={'imgUp'}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}
const HousingPicturesWallUpdataId = connect(state => (
    {housingPictures: state.housingPictures,estateId: state.estateId}), {setHousingPictures})(HousingPicturesWallUpdata);
//更新楼盘信息
class InformationUpdata extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            buildingTypes: [],
            deliveryStandard: '',
            decorateStandard: '',
            deliverDecorateStandard: '',
            buildingStructures: [],
            propertyTypes: [],
            propertyTypeLength: [''],
            traits: [],
            houseTypes: [],
            list: [],
            housingMsgs: [{
                advantage: '',
                area: '',
                drawback: '',
                height: '',
                housingDetailName: '',
                housingStructure: '',
                housingTraitIds: [],
                housingType: '',
                housingTypeTitle: '',
                orientations: '',
                propertyType: ''
            }],
            id:[],
            visible:true
        }
    }

    componentDidMount() {
        getBuildingTypes().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].buildingType,
                    }
                    option.push(item)
                }
                this.setState({
                    buildingTypes: option
                })
            }
        })
        getHouseTypes().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].houseType,
                    }
                    option.push(item)
                }
                this.setState({
                    houseTypes: option
                })
            }
        })
        getHouseTraits().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].houseTraitName,
                    }
                    option.push(item)
                }
                this.setState({
                    houseTraits: option
                })
            }
        })
        getBuildingStructures().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].buildingStructure,
                    }
                    option.push(item)
                }
                this.setState({
                    buildingStructures: option
                })
            }
        })
        getHousingStructures().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].housingStructure,
                    }
                    option.push(item)
                }
                this.setState({
                    housingStructures: option
                })
            }
        })
        getPropertyTypes().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].propertyType
                    }
                    option.push(item)
                }
                this.setState({
                    propertyTypes: option
                })
            }
        })
        getTraits().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].traitName
                    }
                    option.push(item)
                }
                this.setState({
                    traits: option
                })
            }
        })
        getDistrictRegions().then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = {
                        value: res.data.list[i].id,
                        label: res.data.list[i].name,
                        children: []
                    }
                    for (let j = 0; j < res.data.list[i].regions.length; j++) {
                        let items = {
                            value: res.data.list[i].regions[j].id,
                            label: res.data.list[i].regions[j].street,
                        }
                        item.children.push(items)
                    }
                    option.push(item)
                }
                this.setState({
                    districtRegionsList: option
                })
            }
        })
        this.props.form.setFieldsValue({
            nam: this.props.values
        })
    }

    //转化为base64
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    //上传楼盘信息
    handleSubmit = e => {
        this.setState({
            visible:true
        })
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.estateId = this.props.values.id
                values.regionId=values.regionId[1]
                values.matchings.map((item, index) => {
                    item.type = index + 1
                    item.matching=item.matching.replace(/\n/g,"<br></br>")
                })
                let params = values
                estatePublished(params).then((res) => {
                    if (res.data.code === 1) {
                        const key = `open${Date.now()}`;
                        const btn = (
                            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                确定
                            </Button>
                        );
                        notification.success({
                            message: '楼盘信息发布成功',
                            btn,
                            key,
                            duration: 0,
                        });
                    }
                    else{
                        const key = `open${Date.now()}`;
                        const btn = (
                            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                                确定
                            </Button>
                        );
                        notification.error({
                            message: '楼盘信息发布失败',
                            btn,
                            key,
                            duration: 0,
                        });
                    }
                })
            }
        });
    };

    delHousing(index) {
        this.state.housingMsgs.splice(index, 1)
        let arr = this.props.form.getFieldValue('housingMsgs')
        arr.splice(index, 1)
        this.setState({
                housingMsgs: arr,
                visible:true
            }
        )
        this.props.form.setFieldsValue({
            housingMsgs: arr
        })
    }
    addHousing(index) {
        this.props.values.housingMsgs.push('')
        this.setState({
                housingMsgs: this.state.housingMsgs
            }
        )
    }

    //区域选择
    onChange(checkedValues) {
        this.setState({
            regionId: checkedValues[1]
        })
    }

    onChange1(checkedValues) {
        this.setState({
            regionId1: checkedValues[1]
        })
    }

    onChange2(checkedValues) {
        this.setState({
            regionId2: checkedValues[1]
        })
    }

    onPosition(value) {
        this.setState({
            position: value
        })
    }
    setValue(index,value){
        let arr=this.state.id
        arr[index]=value
        this.setState({
            id:arr
        })
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.values !== nextProps.values){
            this.props.form.resetFields();
        }
    }
    changeValues = (rule ,value , callback)=> {
        const { setFieldsValue } = this.props.form ;
        let newArr ;
        if (value.length > 3){
            newArr = [].concat(value.slice(0,2), value.slice(-1) ) ;
            setFieldsValue({
                "languages" : newArr ,
            })
            callback('最多推荐三个经纪人')
        } else {
            newArr = value ;
            callback()
        }
    }
    //确定弹出框
    showConfirm(fun) {
        const { confirm } = Modal;
        confirm({
          title: '是否更新楼盘信息?',
          content: '',
          okText:"确认",
          cancelText:"取消",
          onOk:()=> {
            fun()
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 10},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
            },
        };
        const {getFieldDecorator} = this.props.form;
        const base = 'http://47.108.87.104:8501/user/uploadFile';
        const {Option} = Select
        return (
           <Form onSubmit={this.handleSubmit} className="login-form first" {...formItemLayout}>
                <Form.Item label={'一、填写基本信息：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'地址经纬度：'}  labelAlign={'left'} labelCol={{span: 5}}>
                {getFieldDecorator('longitudeAndAtitude', {initialValue: this.props.values.longitudeAtitude || ''})(
                        <Input placeholder="164564561，154，4545645，546"/>
                    )}
                </Form.Item>
                <a href='https://lbs.amap.com/console/show/picker' target="_blank" style={{width:'60%',marginLeft:20,marginTop:10}}>高德地图经纬度查询</a>
                <Form.Item label='1、楼盘名称（推广名）：'>
                    {getFieldDecorator('name', {initialValue: this.props.values.name || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label='2、备案名：'>
                    {getFieldDecorator('recordName', {initialValue: this.props.values.recordName || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'3、区域位置：'}>
                    {getFieldDecorator('regionId', {initialValue: this.props.values.distinctRegionIds || []})(
                        <Cascader options={this.state.districtRegionsList}/>
                    )}
                </Form.Item>
                <Form.Item label={'4、开发商：'}>
                    {getFieldDecorator('develpers', {initialValue: this.props.values.develpers || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'5、楼盘地址：'}>
                    {getFieldDecorator('adress', {initialValue: this.props.values.adress || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'6、物业权属：'}>
                    {getFieldDecorator('housingType', {initialValue: this.props.values.housingType || ''})(
                        <Select>
                            {this.state.houseTypes && this.state.houseTypes.map(item => {
                                    return (<Option value={item.label}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'7、产权年限：'}>
                    {getFieldDecorator('propertyRightsyears', {initialValue: this.props.values.propertyRightsYears || ''})(
                        <Input placeholder="默认70年"/>
                    )}
                </Form.Item>
                <Form.Item label={'8、建筑类型：'}>
                    {getFieldDecorator('buildingType', {initialValue: this.props.values.buildingType || ''})(
                        <Select>
                            {this.state.buildingTypes && this.state.buildingTypes.map(item => {
                                    return (<Option value={item.label}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'9、占地面积：'}>
                    {getFieldDecorator('areaCovered', {initialValue: this.props.values.areaCovered || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'10、绿化率：'}>
                    {getFieldDecorator('greeningRate', {initialValue: this.props.values.greeningRate || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'11、总建筑面积：'}>
                    {getFieldDecorator('floorage', {initialValue: this.props.values.floorage || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'12、容积率：'}>
                    {getFieldDecorator('volumeRate', {initialValue: this.props.values.volumeRatio || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'13、拿地日期：'}>
                    {getFieldDecorator('holdedTime', {initialValue: this.props.values.holdedTime || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'14、交房日期：'}>
                    {getFieldDecorator('housekeepingTime', {initialValue: this.props.values.housekeepingTime || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'15、规划户数：'}>
                    {getFieldDecorator('pannedHouseholds', {initialValue: this.props.values.pannedHouseholds || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'16、楼栋总数：'}>
                    {getFieldDecorator('buildingAmount', {initialValue: this.props.values.buildingAmount || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'17、梯户比：'}>
                    {getFieldDecorator('staircasesRatio', {initialValue: this.props.values.staircasesRatio || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'18、楼层状况：'}>
                    {getFieldDecorator('floors', {initialValue: this.props.values.floors || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'19、装修状况：'}>
                    {getFieldDecorator('decorateStandard', {initialValue: this.props.values.decorateStandard || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'20、车位数：'}>
                    {getFieldDecorator('parkingNumbers', {initialValue: this.props.values.parkingNumbers || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'21、物管公司：'}>
                    {getFieldDecorator('propertyCompany', {initialValue: this.props.values.propertyCompany || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'22、物管费：'}>
                    {getFieldDecorator('propertyFee', {initialValue: this.props.values.propertyFee || ''})(
                        <Input/>
                    )}
                </Form.Item>
{/*         
                              <Form.Item label={'项目介绍：'}>
                    {getFieldDecorator('introduction', {initialValue: this.props.values.introduction || ''})(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label='物业类型：'>
                    {getFieldDecorator('propertyTypeIds', {initialValue: this.props.values.propertyTypeIds || []})(
                        <Select mode="multiple">
                            {this.state.propertyTypes && this.state.propertyTypes.map(item => {
                                    return (<Option value={item.value}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'楼盘价格：'}>
                    {getFieldDecorator('referencePrice', {initialValue: this.props.values.referencePrice || ''})(
                        <Input addonAfter="元m²/起"/>
                    )}
                </Form.Item>
        
                <Form.Item label="楼盘项目特色：">
                    {getFieldDecorator('traitIds', {initialValue: this.props.values.traitIds || []})(
                        <Select mode="multiple">
                            {this.state.traits && this.state.traits.map(item => {
                                    return (<Option value={item.value}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'建面区间：'}>
                    {getFieldDecorator('areaRange', {initialValue: this.props.values.areaRange || ''})(
                        <Input addonAfter="m²"/>
                    )}
                </Form.Item>
                <Form.Item label={'上市时间：'}>
                    {getFieldDecorator('timeToMarket', {initialValue: this.props.values.timeToMarket || ''})(
                        <Input placeholder="格式：2018-08-08"/>
                    )}
                </Form.Item>
     
         
     
   

        
                <Form.Item label="建筑结构：">
                    {getFieldDecorator('buildingStructure', {initialValue: this.props.values.buildingStructure || ''})(
                        <Select>
                            {this.state.buildingStructures && this.state.buildingStructures.map(item => {
                                    return (<Option value={item.label} key={item.label}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="户型结构：">
                    {getFieldDecorator('housingStructureIds', {initialValue: this.props.values.housingStructureIds || []})(
                        <Select mode="multiple">
                            {this.state.housingStructures && this.state.housingStructures.map(item => {
                                    return (<Option value={item.value}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
        
  
        
        
      
        
       

                <Form.Item label={'层高：'}>
                    {getFieldDecorator('floorHeight', {initialValue: this.props.values.floorHeight || ''})(
                        <Input addonAfter="m"/>
                    )}
                </Form.Item>
                <Form.Item label={'公摊：'}>
                    {getFieldDecorator('shareArea', {initialValue: this.props.values.shareArea || ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'交付标准：'}>
                    {getFieldDecorator('deliveryStandard', {initialValue: this.props.values.deliveryStandard || ''})(
                        <Select>
                            <Option value="清水">清水</Option>
                            <Option value="精装">精装</Option>
                        </Select>
                    )}
                </Form.Item>
    

                <Form.Item label={'车位配比：'}>
                    {getFieldDecorator('parkingRatio', {initialValue: this.props.values.parkingRatio || ''})(
                        <Input/>
                    )}
                </Form.Item>
        */}
  
                {/* <Form.Item label={'项目内部配套：'}>
                    {getFieldDecorator('internalMatching', {initialValue: this.props.values.internalMatching || ''})(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'交付装修标准：'}>
                    {getFieldDecorator('deliverDecorateStandard', {initialValue: this.props.values.deliverDecorateStandard || ''})(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'不利因素：'}>
                    {getFieldDecorator('harmful_publicity', {initialValue: this.props.values.harmfulPublicity || ''})(
                        <Input.TextArea/>
                    )}
                </Form.Item> */}
                <Form.Item label={'二、添加楼盘相册：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'楼盘封面宣传图'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallUpdataId photoType={'0'} estateId={this.props.values.id}></PicturesWallUpdataId>
                </Form.Item>
                <Form.Item label={'区位图'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallUpdataId photoType={'1'} estateId={this.props.values.id}></PicturesWallUpdataId>
                </Form.Item>
                <Form.Item label={'楼盘总平面图'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallUpdataId photoType={'2'} estateId={this.props.values.id}></PicturesWallUpdataId>
                </Form.Item>
                <Form.Item label={'楼盘效果图'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallUpdataId photoType={'3'}
                                        estateId={this.props.values.id}></PicturesWallUpdataId>
                </Form.Item>
                <Form.Item label={'楼盘实景图'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallUpdataId photoType={'4'}

                                        estateId={this.props.values.id}></PicturesWallUpdataId>
                </Form.Item>
                <Form.Item label={'样板间'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallUpdataId photoType={'5'}

                                        estateId={this.props.values.id}></PicturesWallUpdataId>
                </Form.Item>
                <Form.Item label={'添加预售'} className={'item'} labelCol={{span: 3}}>
                    <PicturesWallUpdataId photoType={'6'}
                                        estateId={this.props.values.id}></PicturesWallUpdataId>
                </Form.Item>
                <Form.Item label={'三、推荐经纪人选择：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'推荐经纪人选择：'} className={'item'} labelCol={{span: 3}}>
                    {getFieldDecorator('agentIds', {
                        rules:[{message : '最多推荐三个经纪人',
                            validator : this.changeValues,
                        }],
                        validateTrigger : 'onChange',
                        initialValue:this.props.values.agentIds
                    })(
                        <Select mode="multiple">
                            {this.props.agentIds && this.props.agentIds.map(item => {
                                    return (<Option value={item.id}>{item.name}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                {/* <Form.Item label={'3、楼盘动态：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'楼盘动态标题：'} className={'item'} labelCol={{span: 3}}>
                    {getFieldDecorator('dynamic.dynamicTitle', {initialValue: this.props.values.estateDynamics ? this.props.values.estateDynamics[0].title : ''})(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'发布内容：'} className={'item'} labelCol={{span: 3}}>
                    {getFieldDecorator('dynamic.dynamicContent', {initialValue: this.props.values.estateDynamics ? this.props.values.estateDynamics[0].description : ''})(
                        <Input.TextArea/>
                    )}
                </Form.Item> */}
                <Form.Item label={'四、项目外部配套（从近到远排序）（3公里范围）：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'交通配套：'} className={'item'} labelCol={{span: 3}}>
                    {getFieldDecorator('matchings[0].matching', {initialValue: this.props.values.estateMatchings ? this.props.values.estateMatchings[0] ? this.props.values.estateMatchings[0].description : '' : ''})(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'医疗配套：'} className={'item'} labelCol={{span: 3}}>
                    {getFieldDecorator('matchings[1].matching', {initialValue: this.props.values.estateMatchings ? this.props.values.estateMatchings[1] ? this.props.values.estateMatchings[1].description : '' : ''})(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'商业配套：'} className={'item'} labelCol={{span: 3}}>
                    {getFieldDecorator('matchings[2].matching', {initialValue: this.props.values.estateMatchings ? this.props.values.estateMatchings[2] ? this.props.values.estateMatchings[2].description : '' : ''})(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'教育配套：'} className={'item'} labelCol={{span: 3}}>
                    {getFieldDecorator('matchings[3].matching', {initialValue: this.props.values.estateMatchings ? this.props.values.estateMatchings[3] ? this.props.values.estateMatchings[3].description : '' : ''})(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'五、添加户型信息以及户型图（支持格式PNG，JPG）：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                {
                    this.state.visible&&this.props.values.housingMsgs && this.props.values.housingMsgs.map((item, index) => {
                            return (<div style={{width: '100%', display: 'flex', flexWrap: 'wrap'}}>
                                <Form.Item label={'1、户型图上传：'}>
                                    <HousingPicturesWallUpdataId id={index} setId={this.setValue.bind(this)}></HousingPicturesWallUpdataId>
                                </Form.Item>
                                <Form.Item label={'2、户型编码：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingTypeTitle`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].housingTypeTitle : ''})(
                                        <Input/>
                                    )}
                                </Form.Item>
                                <Form.Item label={'3、户型选择：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingType`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].housingType : ''})(
                                        <Select>
                                            <Option value="一居室">一居室</Option>
                                            <Option value="两居室">两居室</Option>
                                            <Option value="三居室">三居室</Option>
                                            <Option value="四居室">四居室</Option>
                                            <Option value="五居室">五居室</Option>
                                            <Option value="五居室以上">五居室以上</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label={'4、户型套型：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingDetailName`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].housingDetailName : ''})(
                                        <Input/>
                                    )}
                                </Form.Item>
                                <Form.Item label={'5、建面：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].area`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].area : ''})(
                                        <Input/>
                                    )}
                                </Form.Item>
                                <Form.Item label={'6、层高：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].height`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].height : ''})(
                                        <Input addonAfter="m"/>
                                    )}
                                </Form.Item>
                                <Form.Item label={'7、物业类型：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].propertyType`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].propertyType : ''})(
                                        <Select>
                                            {this.state.propertyTypes && this.state.propertyTypes.map(item => {
                                                    return (<Option value={item.label}>{item.label}</Option>)
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label={'8、户型朝向：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].orientations`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].orientations : ''})(
                                        <Select>
                                            <Option value="东">东</Option>
                                            <Option value="东南">东南</Option>
                                            <Option value="南">南</Option>
                                            <Option value="西南">西南</Option>
                                            <Option value="西">西</Option>
                                            <Option value="西北">西北</Option>
                                            <Option value="北">北</Option>
                                            <Option value="东北">东北</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                      
                                <Form.Item label={'9、户型结构：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingStructure`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].housingStructure : ''})(
                                        <Select>
                                            {this.state.housingStructures && this.state.housingStructures.map(item => {
                                                    return (<Option value={item.label}>{item.label}</Option>)
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label="10、户型特色：">
                                    {getFieldDecorator(`housingMsgs[${index}].housingTraitIds`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].housingTraitIds : []})(
                                        <Select mode="multiple">
                                            {this.state.houseTraits && this.state.houseTraits.map(item => {
                                                    return (<Option value={item.value}>{item.label}</Option>)
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label="户型特色：" style={{display:'none'}}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingMsgId`, {initialValue: this.state.id?this.state.id[index]:''})(
                                        <Select mode="multiple">
                                            {this.state.houseTraits && this.state.houseTraits.map(item => {
                                                    return (<Option value={item.value}>{item.label}</Option>)
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>

                                <Form.Item label={'11、户型点评：'} style={{width:'66%'}}>
                                    {getFieldDecorator(`housingMsgs[${index}].advantage`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].advantage : ''})(
                                        <Input.TextArea style={{width:348}}/>
                                    )}
                                </Form.Item>
                                {/* <Form.Item label={'户型缺点：'}>
                                    {getFieldDecorator(`housingMsgs[${index}].drawback`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].drawback : ''})(
                                        <Input.TextArea/>
                                    )}
                                </Form.Item> */}
                                <Form.Item style={{display:'none'}}>
                                    {getFieldDecorator(`housingMsgs[${index}].housingMsgId`, {initialValue: this.props.values.housingMsgs ? this.props.values.housingMsgs[index].id : ''})(
                                        <Input.TextArea/>
                                    )}
                                </Form.Item>
                                <Form.Item labelCol={{span: 13}}>
                                    <Button type="primary" onClick={this.props.delHousing.bind(this, index)}
                                            style={{marginLeft: '200px', marginTop: '-50px'}}>删除户型</Button>
                                </Form.Item>
                            </div>)
                        }
                    )
                }
                <Form.Item>
                    <Button icon={'plus'} type="primary" onClick={this.addHousing.bind(this)}>继续添加户型</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.showConfirm.bind(this,this.handleSubmit.bind(this))}>确认更新楼盘信息并打开该楼盘详情页</Button>
                </Form.Item>
            </Form>
        );
    }
}

const InformationFormUpdatas = connect(state => (
    {bridalInformation: state.bridalInformation}), {newEstateId})(Form.create({name: 'retrieve'})(withRouter(InformationUpdata)));

//更新图片
class PicturesWallUpdata extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            estateId: '',
            multiple: false,
            remove: '',
        };
    }

    handleCancel = () => this.setState({previewVisible: false});

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    remove(file) {
        let params = {
            "estateId": this.props.estateId,
            "photoName": file.name,
            "photoType": this.props.photoType
        }
        let fileList = this.props.fileList[this.props.photoType]
        fileList.splice(-file.uid - 1, 1)
        let arr = this.props.fileList
        arr[this.props.photoType] = fileList
        this.props.getFileList(arr)
        this.setState({
            remove: 1
        })
        delPhoto(params)
    }

    handleChange = ({file, fileList}) => {
        let list=fileList.map((item,index)=>{
            item.uid=-index-1
            item.status='done'
            return item
        })
        let arr = this.props.fileList
        arr[this.props.photoType] =list
        this.props.getFileList(arr)
        this.setState({
            remove: 1
        })
        if (file.status === 'done') {
            this.setState({
                multiple: true
            })
        }
    };

    render() {
        const {previewVisible, previewImage} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <div className="clearfix" style={{marginLeft: '20px', width: '90%'}}>
                <Upload
                    action="http://47.108.87.104:8501/estate/estatePhoto"
                    name={'files'}
                    data={{
                        estateId: this.props.estateId,
                        photoType: this.props.photoType
                    }}
                    listType="picture-card"
                    multiple={this.state.multiple}
                    fileList={this.props.fileList[this.props.photoType]||[]}
                    onPreview={this.handlePreview}
                    onRemove={this.remove.bind(this)}
                    onChange={this.handleChange.bind(this)}
                >
                    {uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} className={'imgUp'}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

const PicturesWallUpdataId = connect(state => (
    {fileList: state.fileList,estateId:state.estateId}), {getFileList})(PicturesWallUpdata);

class bridalAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: '',
            login: false,
            register: false,
            serviceChecked: [],
            region: [],
            titleChecked: [],
            districtRegionsList: [],
            apartmentChecked: [],
            characteristicChecked: [],
            estateId: '',
            togglePrice: true,
            toggleTime: true,
            fileList: [],
            dynamic: '',
            title: '',
            description: '',
            estatesL: [],
            values: {
                key: 2
            },
            visible8:false,
            visible9:false,
            agentIds:[],
            fileList1: [],
            uploading: false,
            fileList2: [
                {
                    uid: '-1',
                    name: 'xxx.png',
                    status: 'done',
                    url: 'http://www.baidu.com/xxx.png',
                },
                ],           
           estates:[],
           price:'',
           time:'',

        }
    }

    componentDidMount() {
        let params={
            area:[],
            housingTypes:[],
            orderType:0,
            prices:[],
            traitIds:[],
            districtIds: [],
            streetId:[],
            searchText:'',
        }
        searchEstate(params).then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.estates.length; i++) {
                    let item = {
                        value: res.data.estates[i].id,
                        label: res.data.estates[i].name,
                        url:'http://47.108.87.104:8601/show/downloadPaper?estateId='+res.data.estates[i].id
                    }
                    option.push(item)
                }
                this.setState({
                    estates: option
                })
            }
        })
    }

    showModal = (str) => {
        if (str === 'login') {
            this.setState({
                login: true,
            });
        }
        else if (str === 'register') {
            this.setState({
                register: true,
            });
        }
    };

    //退出登陆
    clear() {
        // this.props.setUserInformation({})
        localStorage.clear()
    }

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
    //上传一页纸
    handleUpload = () => {
        const { fileList1 } = this.state;
        const formData = new FormData();
        fileList1.forEach(file => {
          formData.append('file', file);
        });
        formData.append('estateId', this.state.estateId);
        this.setState({
          uploading: true,
        });
    
        // You can use any AJAX library you like
        axios({
          url: 'http://47.108.87.104:8501/houseAdmin/paperPublished',
          method: 'post',
          processData: false,
          data: formData,
        }).then((res)=>{
            if(res.data.code==1){
                this.setState({
                    fileList1: [],
                    uploading: false,
                  });
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确定
                    </Button>
                );
                notification.success({
                    message: '楼盘一页纸发布成功',
                    btn,
                    key,
                    duration: 0,
                });
            }
            else{
                const key = `open${Date.now()}`;
                const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close(key)}>
                        确定
                    </Button>
                );
                notification.error({
                    message: '楼盘一页纸发布失败',
                    btn,
                    key,
                    duration: 0,
                });
            }
        }).catch((res)=>{
            this.setState({
                uploading: false,
              });
            const key = `open${Date.now()}`;
            const btn = (
                <Button type="primary" size="small" onClick={() => notification.close(key)}>
                    确定
                </Button>
            );
            notification.error({
                message: '楼盘一页纸发布失败',
                btn,
                key,
                duration: 0,
            });
        })
      };
//tag切换回调
    callback(key) {
        this.setState({
            key: key,
            estateId: '',
            show:false
        })
        this.props.newEstateId('')
        localStorage.setItem('estateId','')
        if (key == 4) {
        }
    }

    handleChange = info => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-2);

        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        this.setState({fileList});
    };
    //选择楼盘
    setRegion(value) {
        this.setState({
            region: value,
            estateId: ''
        })
        let params = {
            districtId: value[1]
        }
        getStreetEstates(params).then((res) => {
            if (res.data.code === 1) {
                let option = [];
                for (let i = 0; i < res.data.estates.length; i++) {
                    let item = {
                        value: res.data.estates[i].id,
                        label: res.data.estates[i].name,
                    }
                    option.push(item)
                }
                this.setState({
                    estates: option
                })
            }
        })
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        })
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        })
    }

    setEstates(value) {
        this.setState({
            values: [],
            visible8:false,
            visible9:false,
            show:false
        })
        this.props.getFileList([])
        this.setState({
            estateId: value
        })
        let params = {
            estateId: value
        }
        this.props.newEstateId(value?value:'')
        localStorage.setItem('estateId',value)
        getEstateMsg(params).then((res) => {
            if (res.data.code == 1) {
                res.data.estate.estatePictures = this.sortByKey(res.data.estate.estatePictures, 'type')
                res.data.estate.estateMatchings = this.sortByKey(res.data.estate.estateMatchings, 'matchingType')
                let arr = res.data.estate.estatePictures.map(item => {
                    let arr = eval("(" + item.name + ")")
                    return arr
                })
                let x = arr.map(item => {
                    return (item.map((items, index) => {
                        return ({
                            uid: -1 - index,
                            name: items,
                            status: 'done',
                            url: 'http://47.108.87.104:8601/building/' + items
                        })
                    }))
                })
                let y = res.data.estate.housingMsgs.map(item => {
                    return (item.picturePaths.map((items, index) => {
                        return ({
                            uid: -1 - index,
                            id:item.id,
                            name: items,
                            status: 'done',
                            url: 'http://47.108.87.104:8601/housing/' + items
                        })
                    }))
                })
                this.props.getFileList(x)
                this.props.setHousingPictures(y)
                this.setState({
                    values: res.data.estate,
                })
            }
        })
        getEstateAgents(params).then((res)=>{
            if(res.data.code===1){
                this.setState({
                    agentIds: res.data.users
                })
            }
        })
    }
    setEstates1(value) {
        this.props.getFileList([])
        this.setState({
            estateId: value
        })
        let params = {
            estateId: value
        }
        this.props.newEstateId(value?value:'')
        localStorage.setItem('estateId',value)
        getEstateMsg(params).then((res) => {
            if (res.data.code == 1) {
                res.data.estate.estatePictures = this.sortByKey(res.data.estate.estatePictures, 'type')
                res.data.estate.estateMatchings = this.sortByKey(res.data.estate.estateMatchings, 'matchingType')
                let arr = res.data.estate.estatePictures.map(item => {
                    let arr = eval("(" + item.name + ")")
                    return arr
                })
                this.setState({
                    fileList1: [
                        {
                            uid: '-1',
                            name: res.data.estate.name+'一页纸',
                            status: 'done',
                            url: 'http://47.108.87.104:8601/show/downloadPaper?estateId='+value,
                        },
                    ],

                })
            }
        })
    }
    //删除户型，由于户型是props下传的，所以要更改此组件的state
    delHousing(index) {
        this.state.values.housingMsgs.splice(index, 1)
        this.setState({
            values:this.state.values
            }
        )
        let arr=this.props.housingPictures
        arr.splice(index, 1)
        this.props.setHousingPictures(arr)
    }
    //删除户型，由于户型是props下传的，所以要更改此组件的state
    delHousing1(index) {
        this.setState({
                values:this.state.values
            }
        )
        let arr=this.props.housingPictures
        arr.splice(index, 1)
        this.props.setHousingPictures(arr)
    }

    push() {
        let params = {
            description: this.state.description,
            title: this.state.title,
            estateId: this.state.estateId
        }
        updata(params).then((res) => {
            if (res.data.code == 1) {
                message.success('成功更新楼盘动态')
            }
            else {
                message.error('更新楼盘动态失败')
            }
        })
    }
    sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        })
    }
    showConfirm(tit,fun) {
        const { confirm } = Modal;
        confirm({
            title: tit,
            content: 'Some descriptions',
            okText:"确认",
            cancelText:"取消",
            onOk:()=>{
                fun()
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    render() {
        const {TabPane} = Tabs;
        const {Option} = Select;
        const updata = 'http://47.108.87.104:8501/houseAdmin/paperPublished';
        const propsFile = {
            name: 'file',
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            data: {
                estateId: this.state.estateId
            },
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        const {TextArea} = Input;
        const { uploading, fileList1 } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList1.indexOf(file);
          const newFileList = state.fileList1.slice();
          newFileList.splice(index, 1);
          return {
            fileList1: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList1: [file],
        }));
        return false;
      },
      fileList:fileList1,
    };
        return (
            <div className='bridalAdmin'>
                <div className={'header'}>
                    <div className='left'>
                        <div className='logo'>
                            <img src={require('../../img/LOGO2.png')}/>
                        </div>
                        <p>新房管理中心</p>
                    </div>
                    <div className='right' style={{display: localStorage.getItem('userName') ? 'none' : 'block'}}>
                        <img src={require('../../img/admin.png')}/>
                        <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp登陆&nbsp&nbsp/'}}
                              onClick={this.showModal.bind(this, 'login')}/>
                        <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp&nbsp注册'}}
                              onClick={this.showModal.bind(this, 'register')}/>
                        {/* <Login login={this.state.login} handleCancel={this.handleCancel.bind(this,'login')}/>
                                <Register register={this.state.register} handleCancel={this.handleCancel.bind(this,'register')}/> */}
                    </div>
                    <div className='right' style={{display: localStorage.getItem('userName') ? 'block' : 'none'}}>
                        <img src={require('../../img/admin.png')} style={{marginRight: '10px'}}/>

                        <span onClick={this.clear.bind(this)}>退出</span>
                    </div>
                </div>
                <div className={'menu'}>
                    <Tabs defaultActiveKey="4" onChange={this.callback.bind(this)} tabPosition={'left'}>

                        <TabPane tab="楼盘信息编辑更新" key="4">
                            <div className={'content'}>
                                <span className={'title'}>楼盘信息编辑更新</span>
                                <span style={{marginLeft: '50px'}}>选择编辑的楼盘：</span>
                                <Select style={{width: 200,marginRight:'20px'}} onChange={this.setEstates.bind(this)} value={this.state.estateId}
                                        allowClear
                                        showSearch
                                        placeholder="输入楼盘名搜索"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                    {this.state.estates && this.state.estates.map(item => {
                                            return (<Option value={item.value} key={item.value}>{item.label}</Option>)
                                        }
                                    )}
                                </Select>
                                <Button type="primary" style={{display:this.state.estateId?'none':'inline'}} onClick={()=>{this.setState({visible8:true})}}>新增</Button>
                                <Button type="primary" style={{display:this.state.estateId?'inline':'none'}} onClick={()=>{this.setState({visible9:true})}}>更新</Button>
                                <div style={{display:this.state.visible8?'block':'none'}}><InformationForms delHousing={this.delHousing1.bind(this)}/></div>
                                <div  style={{display:this.state.visible9?'block':'none'}}  ><InformationFormUpdatas values={this.state.values} agentIds={this.state.agentIds} delHousing={this.delHousing.bind(this)}/></div>
                            </div>
                        </TabPane>
                        <TabPane tab="楼盘动态更新" key="3">
                            <div className={'content'}>
                                <p className={'title'}>楼盘动态发布</p>
                                <div className={'item'}>
                                    <p>选择更新的楼盘：</p>
                                    <Select style={{width: 200,marginRight:'20px'}} onChange={this.setEstates.bind(this)} value={this.state.estateId}
                                            allowClear
                                            showSearch
                                            placeholder="输入楼盘名搜索"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }>
                                        {this.state.estates && this.state.estates.map(item => {
                                                return (<Option value={item.value} key={item.value}>{item.label}</Option>)
                                            }
                                        )}
                                    </Select>
                                    <Button type='primary' onClick={()=>{this.setState({show:true})}}>新增动态</Button>
                                </div>
                                <p style={{fontSize:30}}>{this.state.values.name}</p>
                                <div style={{display:this.state.show?'block':'none'}}>
                                <div className={'item'}>
                                    <p>新增楼盘动态：</p>
                                </div>
                                <div className={'item'}>
                                    <p>上市时间：</p>
                                    <Input style={{width: 300, marginLeft: 30}}
                                           onChange={(e)=>{this.setState({time:e.target.value})}}/>
                                </div>
                                <div className={'item'}>
                                    <p>最低单价：</p>
                                    <Input style={{width: 300, marginLeft: 30}}
                                           onChange={(e)=>{this.setState({price:e.target.value})}}/>
                                </div>
                                <div className={'item'}>
                                    <p>楼盘动态标题：</p>
                                    <Input style={{width: 300, marginLeft: 30}}
                                           onChange={this.onChangeTitle.bind(this)}/>
                                </div>
                                <div className={'item'}>
                                    <p>发布内容：</p>
                                    <TextArea
                                        onChange={this.onChangeDescription.bind(this)}
                                        style={{width: 300, marginLeft: 30}}
                                        autosize={{minRows: 3, maxRows: 5}}
                                    />
                                </div>
                                <Button type="primary" className={'push'} onClick={this.showConfirm.bind(this,this.push.bind(this))}>
                                    确认发布
                                </Button>
                            </div>
                            <div>
                            <div className={'item'}>
                                    <p>现有动态信息：</p>
                                </div>
                                <div className={'item'}>
                                {
                                this.state.values.estateDynamics&&this.state.values.estateDynamics.map((item,index)=>{
                                    return(
                                        <div style={{display:'block'}} key={index}>
                                        <p>{item.description}</p>
                                        <p>上市日期：{item.timeToMarket}</p>
                                        <p>最低单价：{item.referencePrice}</p>
                                    </div>
                                    )
                                })
                            }
                                </div>
                            </div>
                            </div>
                        </TabPane>
                        <TabPane tab="一页纸发布" key="1">
                            <div className={'content'}>
                                <p className={'title'}>楼盘一页纸发布</p>
                                <div className={'item'}>
                                    <p>选择发布的楼盘：</p>
                                    <Select style={{width: 200}} onChange={this.setEstates1.bind(this)} value={this.state.estateId}
                                            showSearch
                                            placeholder="Select a person"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }>
                                        {this.state.estates && this.state.estates.map(item => {
                                                return (<Option value={item.value} key={item.value}>{item.label}</Option>)
                                            }
                                        )}
                                    </Select>
                                    <Upload {...props} fileList={this.state.fileList1}>
          <Button>
            <Icon type="upload" /> 选择楼盘一页纸
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          loading={uploading}
          style={{ marginLeft: 16 }}
        >
            {fileList1.length === 0?'发布':'更新'}
        </Button>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>

        )
    }
}

export default connect(state => (
    {estateId: state.estateId, fileList: state.fileList,housingPictures: state.housingPictures}), {newEstateId, getFileList,setHousingPictures})(withRouter(bridalAdmin))