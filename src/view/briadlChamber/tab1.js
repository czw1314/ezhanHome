import React, { Component } from 'react';
import {Nav} from './nav'

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import {Tab4} from './tab4'
import {Tab5} from './tab5'
import {Tab6} from './tab6'
import {Tab7} from './tab7'

export class Tab1 extends React.Component {
    render() {
        return (
            <div className="tab">
                <div className="top">
                    <div className="left">
                        <Link to={`${this.props.match.path}/tab4`}>路由4</Link>
                        <Link to={`${this.props.match.path}/tab5`}>路由5</Link>
                        <Link to={`${this.props.match.path}/tab6`}>路由6</Link>
                        <Link to={`${this.props.match.path}/tab7`}>路由7</Link>
                    </div>
                    <div className="right">
                        <Route path={`${this.props.match.path}/tab4`} component={Tab4}></Route>
                        <Route path={`${this.props.match.path}/tab5`} component={Tab5}></Route>
                        <Route path={`${this.props.match.path}/tab6`} component={Tab6}></Route>
                        <Route path={`${this.props.match.path}/tab7`} component={Tab7}></Route>
                    </div>
                </div>
                <Nav></Nav>
            </div>
        )
    }

}