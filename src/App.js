import "babel-polyfill"
import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,withRouter,
} from 'react-router-dom'
import './App.css';

import Home from './component/home'
import HomePage from './view/HomePage'
import BridalChamber from './view/bridalChamber'
import Agent from './view/agent'
import BridalHome from './component/bridalHome'
import User from './view/user'
import AgentMy from './view/agentMy'
import Consultant from './view/consultant'
import RegistryCenter from './view/registryCenter'
import Admin from './view/admin/admin'
import BridalAdmin from './view/admin/bridalAdmin'
import ScrollToTop from './component/ScrollToTop'

const MainPaper = ({match}) => {
    return <div>
        <Home>
            <Route path={'/home/bridalChamber'} exact component={BridalChamber}/>
            <Route path={'/home/bridalHome'} component={BridalHome}/>
            <Route path={'/home/agent'} exact component={Agent}/>
            <Route path={'/home/user'} exact component={User}/>
            <Route path={'/home/agentMy'} exact component={AgentMy}/>
            <Route path={'/home/consultant'} exact component={Consultant}/>
            <Route path={'/home/registryCenter'} exact component={RegistryCenter}/>
        </Home>
    </div>
};
class Div extends Component{
    render(){
        return(
            <Router>
                <ScrollToTop>
            <Route exact path="/" component={HomePage}/>
            <Route path="/home" component={MainPaper}/>
            <Route path="/homePage" component={HomePage}/>
            <Route path="/admin" component={Admin}/>
            <Route path="/bridaladmin" component={BridalAdmin}/>
            </ScrollToTop>
        </Router>
        )
    }
}
withRouter(Div)

class App extends Component {
    componentDidMount(){
        
    }
    render() {
        return (
            <div>
<Div></Div>
    
            </div>
        );
    };
}

export default  App