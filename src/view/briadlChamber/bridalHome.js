import React from 'react'
import '../../css/bridalHome.scss'
import Memu from '../../component/menu'
import routes from '../../router/index';
import {Select, Button, Badge, Menu, Input, Checkbox, Modal, Pagination} from 'antd';
import {HashRouter as Router, Route, Switch, Redirect, withRouter} from 'react-router-dom';
import Agent from "../agent";

class BridalHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

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
            toggleTime: true,
            key: '/main/bridalChamber/bridalIndex',
        }
    }

    handleClickMenus = (e) => {
        this.setState({
            key1: e.key,
        });
    }

    render() {
        console.log(this.props.children)
        const {Search} = Input;
        const suffix = <img src={require('../../img/search1.png')}
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 5
                            }}/>;
        const CheckboxGroup = Checkbox.Group;
        return (
            <div className='bridalHome'>
                <div className='headerBx'>
                    <div className='header'>
                        <div className='left'>
                            <Memu
                                menus={routes.bridalMenus}
                                handle={this.handleClick}
                                state={this.state}
                            >
                            </Memu>
                        </div>
                        <div className='right'>
                            <span dangerouslySetInnerHTML={{__html: '&nbsp&nbsp登录/注册'}}/>
                        </div>
                    </div>
                </div>
                <Route path={'/main/bridalChamber/bridalIndex'} component={Agent}/>
                <div>sss</div>
            </div>
        )
    }
}

export default withRouter(BridalHome)