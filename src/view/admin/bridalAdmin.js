import React from 'react'
import '../../css/bridalAdmin.scss'
import {connect} from "react-redux";
import {setBridalInformation} from "../../redux/action";
import {
    Tabs, Input, Button, Form, Upload, Icon, message, Checkbox,
    Select, Modal, Cascader, Divider
} from 'antd';
import {
    getDistrictRegions,
    agentRegister,
    estatePublished,
    delHousingPictures,
    getBuildingTypes,
    getBuildingStructures,
    getHousingStructures,
    getPropertyTypes,
    getTraits,
    getHouseTypes,
    delPhoto
} from '../../api/index'
//上传户型
class HousingPicturesWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            estateId: '',
            housingMsgId:''
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
        console.log(file)
        let params = {
            "housingMsgId": this.state.housingMsgId,
        }
        delHousingPictures(params)
    }

    handleChange = ({file, fileList}) => {
        this.setState({fileList})
        if (file.status === 'done' && file.response.estateId) {
            this.setState({
                housingMsgId: file.response.housingMsgId,
            })
        }
    };

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        console.log(fileList)
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
                        housingMsgId:0,
                    }}
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
            housingMsgs:['']
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
    }

    //转化为base64
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    //注册
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                this.props.setBridalInformation(values)
            }
        });
    };

    //生成验证码的方法
    //职称照片上传
    setDeliveryStandard(e) {
        this.setState({
            deliveryStandard: e
        })
    }

    setDecorateStandard(e) {
        this.setState({
            decorateStandard: e.value
        })
    }

    setDeliverDecorateStandard(e) {
        this.setState({
            deliverDecorateStandard: e.value
        })
    }
    delHousing(index){
        this.state.housingMsgs.splice(index, 1)
        this.setState({
            housingMsgs: this.state.housingMsgs
            }
        )
    }
    addHousing(index){
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

    //服务选择
    bussinessIdChange(value) {
        console.log(value)
        this.setState({
            bussinessId: value
        })
    }

    //公司选择（独立经纪人）
    onAgentType(value) {
        this.setState({
            agentType: value
        })
    }

    onPosition(value) {
        this.setState({
            position: value
        })
    }

    propertyTypeAdd() {
        let arr = this.state.propertyTypeLength;
        arr.push('')
        this.setState({
            propertyTypeLength: arr
        })
    }

    //公司填写
    company(e) {
        e.preventDefault();

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
                <Form.Item label={'1、填写基本信息：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label='楼盘名称（推广名）：'>
                    {getFieldDecorator('name')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label='备案名：'>
                    {getFieldDecorator('recordName')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label='物业类型：'>
                    {getFieldDecorator('propertyTypeIds')(
                        <Select mode="multiple">
                            {this.state.propertyTypes && this.state.propertyTypes.map(item => {
                                    return (<Option value={item.value}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'楼盘价格：'}>
                    {getFieldDecorator('price')(
                        <Input addonAfter="元m²/起"/>
                    )}
                </Form.Item>
                <Form.Item label={'楼盘区域：'}>
                    {getFieldDecorator('estateId')(
                        <Cascader options={this.state.districtRegionsList} placeholder={''}/>
                    )}
                </Form.Item>
                <Form.Item label="楼盘项目特色：">
                    {getFieldDecorator('traitIds',)(
                        <Select mode="multiple">
                            {this.state.traits && this.state.traits.map(item => {
                                    return (<Option value={item.value}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'建面区间：'}>
                    {getFieldDecorator('areaRange')(
                        <Input addonAfter="m²"/>
                    )}
                </Form.Item>
                <Form.Item label={'上市时间：'}>
                    {getFieldDecorator('timeToMarket')(
                        <Input placeholder="格式：2018-08-08"/>
                    )}
                </Form.Item>
                <Form.Item label={'产权年限：'}>
                    {getFieldDecorator('propertyRightsyears')(
                        <Input placeholder="默认70年"/>
                    )}
                </Form.Item>
                <Form.Item label={'项目地址：'}>
                    {getFieldDecorator('adress')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'地址经纬度：'}>
                    {getFieldDecorator('longitudeAndAtitude')(
                        <Input placeholder="164564561，154，4545645，546"/>
                    )}
                </Form.Item>
                <Form.Item label={'开发商：'}>
                    {getFieldDecorator('develpers')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'物业权属：'}>
                    {getFieldDecorator('housingType')(
                        <Select mode="multiple">
                            {this.state.housingType && this.state.housingType.map(item => {
                                    return (<Option value={item.value}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'建筑类型：'}>
                    {getFieldDecorator('buildingType')(
                        <Select>
                            {this.state.buildingTypes && this.state.buildingTypes.map(item => {
                                    return (<Option value={item.value}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'绿化率：'}>
                    {getFieldDecorator('greeningRate')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label="建筑结构：">
                    {getFieldDecorator('buildingStructure')(
                        <Select>
                            {this.state.buildingStructures && this.state.buildingStructures.map(item => {
                                    return (<Option value={item.value}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="户型结构：">
                    {getFieldDecorator('housingStructureIds')(
                        <Select mode="multiple">
                            {this.state.housingStructures && this.state.housingStructures.map(item => {
                                    return (<Option value={item.value}>{item.label}</Option>)
                                }
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'容积率：'}>
                    {getFieldDecorator('volumeRate')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'占地面积：'}>
                    {getFieldDecorator('areaCovered')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'拿地时间：'}>
                    {getFieldDecorator('holdingTime')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'总建筑面积：'}>
                    {getFieldDecorator('floorage')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'交房时间预计：'}>
                    {getFieldDecorator('housekeepingTime')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'楼栋总数：'}>
                    {getFieldDecorator('buildingAmount')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'梯户比：'}>
                    {getFieldDecorator('contact')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'总楼层：'}>
                    {getFieldDecorator('floors')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'规划户数：'}>
                    {getFieldDecorator('pannedHouseholds')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'层高：'}>
                    {getFieldDecorator('floorHeight')(
                        <Input addonAfter="m"/>
                    )}
                </Form.Item>
                <Form.Item label={'公摊：'}>
                    {getFieldDecorator('shareArea')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'交付标准：'}>
                    {getFieldDecorator('deliveryStandard')(
                        <Select>
                            <Option value="清水">清水</Option>
                            <Option value="精装">精装</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={'装修标准：'}>
                    {getFieldDecorator('decorateStandard')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'物管公司：'}>
                    {getFieldDecorator('propertyCompany')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'物管费：'}>
                    {getFieldDecorator('propertyFee')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'车位配比：'}>
                    {getFieldDecorator('parkingRatio')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'车位数：'}>
                    {getFieldDecorator('parkingNumbers')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'项目介绍：'}>
                    {getFieldDecorator('introduction')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'项目内部配套：'}>
                    {getFieldDecorator('internalMatching')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'交付装修标准：'}>
                    {getFieldDecorator('deliverDecorateStandard')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'不利因素：'}>
                    {getFieldDecorator('harmful_publicity')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'2、添加楼盘相册：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'楼盘封面宣传图'} className={'item'} labelCol={{span:3}}>
                    <PicturesWall photoType={'0'}></PicturesWall>
                </Form.Item>
                <Form.Item label={'区位图'} className={'item'} labelCol={{span:3}}>
                    <PicturesWall photoType={'1'}></PicturesWall>
                </Form.Item>
                <Form.Item label={'楼盘总平面图'} className={'item'} labelCol={{span:3}}>
                    <PicturesWall photoType={'2'}></PicturesWall>
                </Form.Item>
                <Form.Item label={'楼盘效果图'} className={'item'} labelCol={{span:3}}>
                    <PicturesWall photoType={'3'}></PicturesWall>
                </Form.Item>
                <Form.Item label={'楼盘实景图'} className={'item'} labelCol={{span:3}}>
                    <PicturesWall photoType={'4'}></PicturesWall >
                </Form.Item>
                <Form.Item label={'样板间'} className={'item'} labelCol={{span:3}}>
                    <PicturesWall photoType={'5'}></PicturesWall>
                </Form.Item>
                <Form.Item label={'添加预售'} className={'item'} labelCol={{span:3}}>
                    <PicturesWall photoType={'6'}></PicturesWall>
                </Form.Item>
                <Form.Item label={'3、楼盘动态：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'楼盘动态标题：'} className={'item'} labelCol={{span:3}}>
                    {getFieldDecorator('dynamicTitle')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label={'发布内容：'} className={'item'} labelCol={{span:3}}>
                    {getFieldDecorator('dynamicContent')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'4、项目外部配套（从近到远排序）（3公里范围）：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                <Form.Item label={'交通配套：'} className={'item'} labelCol={{span:3}}>
                    {getFieldDecorator('matching1')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'医疗配套：'} className={'item'} labelCol={{span:3}}>
                    {getFieldDecorator('matching2')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'商业配套：'} className={'item'} labelCol={{span:3}}>
                    {getFieldDecorator('matching3')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'教育配套：'} className={'item'} labelCol={{span:3}}>
                    {getFieldDecorator('matching4')(
                        <Input.TextArea/>
                    )}
                </Form.Item>
                <Form.Item label={'5、添加户型信息以及户型图（支持格式PNG，JPG）：'} className={'item'} labelAlign={'left'}>
                </Form.Item>
                {
                    this.state.housingMsgs&&this.state.housingMsgs.map((item,index)=>{
                        return(  <div style={{width:'100%',display:'flex',flexWrap:'wrap'}}>
                            <Form.Item label={'户型名称：'}>
                                {getFieldDecorator('matching5')(
                                    <Input/>
                                )}
                            </Form.Item>
                            <Form.Item label={'户型选择：'}>
                                {getFieldDecorator('matching5')(
                                    <Select>
                                        <Option value="1">一居室</Option>
                                        <Option value="2">两居室</Option>
                                        <Option value="3">三居室</Option>
                                        <Option value="4">四居室</Option>
                                        <Option value="5">五居室</Option>
                                        <Option value="6">六居室</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label={'户型详细名称：'}>
                                {getFieldDecorator('matching5')(
                                    <Input/>
                                )}
                            </Form.Item>
                            <Form.Item label={'建面：'}>
                                {getFieldDecorator('matching5')(
                                    <Input addonAfter="m²"/>
                                )}
                            </Form.Item>
                            <Form.Item label={'层高：'}>
                                {getFieldDecorator('matching5')(
                                    <Input addonAfter="m"/>
                                )}
                            </Form.Item>
                            <Form.Item label={'户型结构：'}>
                                {getFieldDecorator('matching5')(
                                    <Select>
                                        {this.state.housingStructures && this.state.housingStructures.map(item => {
                                                return (<Option value={item.value}>{item.label}</Option>)
                                            }
                                        )}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="户型特色：">
                                {getFieldDecorator('housingStructureIds')(
                                    <Select mode="multiple">
                                        {this.state.housingStructures && this.state.housingStructures.map(item => {
                                                return (<Option value={item.value}>{item.label}</Option>)
                                            }
                                        )}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('housingStructureIds')(
                                    <Input/>
                                )}
                            </Form.Item>
                            <Form.Item label={'户型优点：'}>
                                {getFieldDecorator('matching5')(
                                    <Input.TextArea/>
                                )}
                            </Form.Item>
                            <Form.Item label={'户型缺点：'}>
                                {getFieldDecorator('matching5')(
                                    <Input.TextArea/>
                                )}
                            </Form.Item>
                            <Form.Item label={'户型上传：'}>
                                <HousingPicturesWall></HousingPicturesWall>
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={this.delHousing.bind(this,index)}>删除户型</Button>
                            </Form.Item>
                        </div>)
                        }
                    )
                }
                <Form.Item>
                    <Button icon={'plus'} type="primary" onClick={this.addHousing.bind(this)}>继续添加户型</Button>
                </Form.Item>
            </Form>
        );
    }
}

const InformationForms = connect(state => (
    {bridalInformation: state.bridalInformation}), {setBridalInformation})(Form.create({name: 'retrieve'})(Information));

//上传图片
class PicturesWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            estateId: '',
            multiple: false,
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
        console.log(file)
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
                    action="http://47.108.87.104:8501/estate/estatePhoto"
                    name={'files'}
                    data={{
                        estateId: this.state.estateId || 0,
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

class bridalAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            left: 13,
            login: false,
            register: false,
            serviceChecked: [],
            service: ['新房经纪'],
            titleChecked: [],
            title: ['房地产经纪人', '房地产经纪人协理'],
            apartmentChecked: [],
            apartment: ['三室两厅'],
            characteristicChecked: [],
            characteristic: ['现房'],
            togglePrice: true,
            toggleTime: true,
            fileList: [],
            dynamic: ''

        }
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
        this.props.setUserInformation({})
        localStorage.clear()
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

    callback(key) {
        console.log(key);
    }

    推荐经纪人

    recommend() {

    }

    handleChange = info => {
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
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

    render() {
        const {TabPane} = Tabs;
        const {Option} = Select;
        const updata = 'http://47.108.87.104:8501/houseAdmin/paperPublished';

        function handleChange(value) {
            console.log(`selected ${value}`);
        }

        const props = {
            action: updata,
            onChange: this.handleChange,
            multiple: true,
        };
        const {TextArea} = Input;
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
                    <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition={'left'}>
                        <TabPane tab="一页纸发布" key="1">
                            <div className={'content'}>
                                <p className={'title'}>楼盘一页纸发布</p>
                                <div className={'item'}>
                                    <p>选择发布的楼盘：</p>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}}>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}}>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                    <Upload {...props} fileList={this.state.fileList}>
                                        <Button>
                                            <Icon type="upload"/> Upload
                                        </Button>
                                    </Upload>
                                    <Button type="primary" className={'push'}>
                                        确认发布
                                    </Button>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="楼盘发布" key="2">
                            <div className={'content'}>
                                <p className={'title'}>楼盘发布</p>
                                <InformationForms/>
                            </div>
                        </TabPane>
                        <TabPane tab="楼盘动态更新" key="3">
                            <div className={'content'}>
                                <p className={'title'}>楼盘动态发布</p>
                                <div className={'item'}>
                                    <p>选择更新的楼盘：</p>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}}>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}}>
                                        <Option value="lucy">Lucy</Option>
                                    </Select>
                                </div>
                                <div className={'item'}>
                                    <p>楼盘动态标题：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>发布内容：</p>
                                    <TextArea
                                        placeholder="Controlled autosize"
                                        style={{width: 300, marginLeft: 30}}
                                        autosize={{minRows: 3, maxRows: 5}}
                                    />
                                </div>
                                <Button type="primary" className={'push'}>
                                    确认发布
                                </Button>
                            </div>
                        </TabPane>
                        <TabPane tab="楼盘信息编辑更新" key="4">
                            <div className={'content'}>
                                <p className={'title'}>楼盘发布</p>
                                <p>1、填写基本信息：</p>
                                <InformationForms/>
                                <p style={{marginTop: '50px'}}>2、添加楼盘相册：</p>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘封面宣传图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>区位图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘总平面图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘效果图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>楼盘实景图</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>样板间</span>
                                    <PicturesWall></PicturesWall></div>
                                <div style={{display: 'flex', alignItems: 'center'}}><span>添加预售</span>
                                    <PicturesWall></PicturesWall></div>
                                <p style={{marginTop: '50px'}}>3、楼盘动态：</p>
                                <div className={'item'}>
                                    <p>楼盘动态标题：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>发布内容：</p>
                                    <TextArea
                                        placeholder="Controlled autosize"
                                        style={{width: 300, marginLeft: 30}}
                                        autosize={{minRows: 3, maxRows: 5}}
                                    />
                                </div>
                                <p style={{marginTop: '50px'}}>4、项目外部配套（从近到远排序）（3公里范围）：</p>
                                <div className={'item'}>
                                    <p>交通配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>医疗配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>商业配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <div className={'item'}>
                                    <p>教育配套：</p>
                                    <Input style={{width: 300, marginLeft: 30}}/>
                                </div>
                                <p style={{marginTop: '50px'}}>5、添加户型信息以及户型图（支持格式PNG，JPG）：</p>
                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>户型名称：</p>
                                        <Input/>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型选择：</p>
                                        <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型详细名称：</p>
                                        <Input/>
                                    </div>
                                </div>
                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>建面：</p>
                                        <Input/>
                                        <p>m²</p>
                                    </div>
                                    <div className={'items'}>
                                        <p>层高：</p>
                                        <Input/>
                                        <p>m</p>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型结构：</p>
                                        <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className={'item'}>
                                    <p>户型特色：</p>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Select defaultValue="lucy" style={{width: 200}} onChange={handleChange}>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                    <Input/>
                                </div>
                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>户型优点：</p>
                                        <Input/>
                                    </div>
                                    <div className={'items'}>
                                        <p>户型缺点：</p>
                                        <Input/>
                                    </div>
                                </div>

                                <div className={'item'}>
                                    <div className={'items'}>
                                        <p>户型图:</p>
                                        <HousingPicturesWall></HousingPicturesWall>
                                    </div>
                                    <Button>删除户型</Button>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>

        )
    }
}

export default bridalAdmin