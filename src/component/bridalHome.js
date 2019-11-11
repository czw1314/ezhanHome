import React from 'react';
import Memu from './menu'
import routes from '../router/index';
import {Input,Img} from 'antd';
import '../css/bridalHome.scss'
import {Route, Switch, Redirect, withRouter, Link} from 'react-router-dom';
import BridalIndex from '../view/briadlChamber/bridalIndex'
import Album from '../view/briadlChamber/Album'
import Apartment from '../view/briadlChamber/apartment'
import {connect} from "react-redux";
import {getEstateMsg} from '../api/index'

class BridalHome extends React.Component {
    state = {
        key: '',
        searchText:'',
        address:''
    }
    handleClick = (e) => {
        this.setState({
            key: e.key,
        });
    }
    search(){
        this.props.history.push({pathname:'/home/bridalChamber', state:{
            searchText:this.state.searchText
            }})
        localStorage.setItem('searchText',this.state.searchText)
    }
    go(){
        this.props.history.push({pathname:'/home/bridalChamber', state:{
                districtIds:this.state.districtIds
        }})
    }
    componentDidMount(){
        let params = {
            estateId: this.props.estateId||localStorage.getItem('estateId'),
        }
        getEstateMsg(params).then((res) => {
            if (res.data.code == 1) {
                let address=res.data.estate.distinctRegion.split('—')
                this.setState({
                    address,
                    districtIds:res.data.estate.distinctRegionIds[0]
                })
            }
        })
    }
    render() {
        const {Search} = Input;
        const enterButton= <img src={require('../img/search1.png')}
        style={{
            width: 20,
            height: 20,
            marginRight: 5
        }}/>;
        return (
            <div className='bridalHome'>
                <div className={'headerHome'}>
                    <div className={'title'}>
                        <div className='logo'>
                            <img src={require('../img/LOGO2.png')}/>
                        </div>
                        <p>新房</p>
                        {/*<img src={require('../img/Location2.png')} style={{height: 24, width: 16}}/>*/}
                        {/*<span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp成都'}} className={'location'}/>*/}
                        <p className={'address'}><span onClick={()=>{ this.props.history.push({pathname:'/home/bridalChamber'})}}>找新房></span><span onClick={this.go.bind(this)}>{this.state.address[0]?this.state.address[0]:localStorage.getItem('address0')}楼盘</span>>{this.state.address[1]?this.state.address[1]:localStorage.getItem('address1')}楼盘</p>
                        <Search
                        placeholder="请输入楼盘名"
                        value={this.state.searchText}
                        onChange={e=>this.setState({searchText:e.target.value})}
                        onSearch={this.search.bind(this)}
                        style={{width: 400}}
                        size={'large'}
                        enterButton={enterButton}
                    />
                    </div>

                    <Memu
                        menus={routes.bridalMenus}
                        handle={this.handleClick}
                        state={this.props.location.pathname}
                    >
                    </Memu>
                </div>
                <Route path="/home/bridalHome/bridalIndex" component={BridalIndex}/>
                <Route path="/home/bridalHome/bridalAlbum" component={Album}/>
                <Route path="/home/bridalHome/bridalApartment" component={Apartment}/>
            </div>
        )
    }
}

export default  connect(state => (
    {bridalInformation: state.bridalInformation}))(withRouter(BridalHome))