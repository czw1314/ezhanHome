import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom'
import './App.css';

const Dz = () => {
    return <div>
        <h3>达州,四川的一个市,也是我的家乡</h3>
    </div>
};

const Cd = ({match}) => {
    return <div>
        <h3>成都,四川省会,天府之国</h3>
        <ul>
            <li><Link to={`${match.url}/lqyq`}>龙泉驿区</Link></li>
            <li><Link to={`${match.url}/jjq`}>锦江区</Link></li>
            <li><Link to={`${match.url}/gxq`}>高新区</Link></li>
        </ul>
        <Route path={`${match.url}/lqyq`} component={Lqy} />
        <Route path={`${match.url}/jjq`} render={ () => { return <div>锦江区：春熙路就在那</div> } } />
        <Route path={`${match.url}/gxq`} render={ () => { return <div>高新区：成都最有逼格的地方</div> } } />

    </div>
};
const Lqy = ({match}) => {
    return <div>
        <h3>成都,四川省会,天府之国</h3>
        <ul>
            <li><Link to={`${match.url}/lqyq`}>龙泉驿区</Link></li>
        </ul>
        <Route path={`${match.url}/lqyq`} render={ () => { return <div>龙泉驿区：汽车城asdasd</div> } } />

    </div>
};

const Bj = () => {
    return  <div>
        <h3>北京,中国首都,政治中心</h3>
    </div>
};
class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <ul>
                        <li><Link to="/dazhou">达州</Link></li>
                        <li><Link to="/chengdu">成都</Link></li>
                        <li><Link to="/beijing">北京</Link></li>
                    </ul>
                    <Route path="/dazhou" component={Dz} />
                    <Route path="/chengdu" component={Cd} />
                    <Route path="/beijing" component={Bj} />
                </div>
            </Router>
        );
    }
}
export default App