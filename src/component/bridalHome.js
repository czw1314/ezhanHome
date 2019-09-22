import React from 'react';
import Memu from './menu'
import routes from '../router/index';
import {Select, Button, Badge, Menu, Input, Checkbox, Modal, Pagination, Img} from 'antd';
import '../css/bridalHome.scss'
import {Route, Switch, Redirect, withRouter, Link} from 'react-router-dom';
import BridalIndex from '../view/briadlChamber/bridalIndex'
import Album from '../view/briadlChamber/Album'
import Apartment from '../view/briadlChamber/apartment'

class BridalHome extends React.Component {
    state = {
        key: this.props.location.pathname || '/bridalChamber',
    }
    handleClick = (e) => {
        console.log(e)
        this.setState({
            key: e.key,
        });
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
            <div className='bridalHome'>
                <div className={'headerHome'}>
                    <div className={'title'}>
                        <div className='logo'>
                            <img src={require('../img/LOGO2.png')}/>
                        </div>
                        <p>新房</p>
                        <img src={require('../img/Location2.png')} style={{height: 24, width: 16}}/>
                        <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp成都'}} className={'location'}/>
                        <p className={'address'}>找新房>天府新区楼盘>万安镇楼盘</p>
                        <Search
                            placeholder="input search text"
                            onSearch={value => console.log(value)}
                            style={{width: 400}}
                            size={'large'}
                            suffix={suffix}
                        />
                    </div>

                    <Memu
                        menus={routes.bridalMenus}
                        handle={this.handleClick}
                        state={this.state}
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

export default withRouter(BridalHome);