import React from 'react';
import { Menu,} from 'antd';
import { Link } from 'react-router-dom';

const renderMenuItem = item => ( // item.route 菜单单独跳转的路由
    <Menu.Item
        key={item.key}
    >
        <Link to={item.key}>
            {<span className="nav-text">{item.title}</span>}
        </Link>
    </Menu.Item>
);

export default ({menus,handle,state}) => (
    <Menu  mode="horizontal" selectedKeys={[state.key]} onClick={handle} defaultSelectedKeys={['1']}>
        {menus && menus.map(item =>
            renderMenuItem(item)
        )}
    </Menu>
);