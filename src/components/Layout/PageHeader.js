import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const Title = () => {
  const { Header } = Layout;

  const layout = {
    float: 'right',
  };
  return (
    <div>
      <Header>
        <Menu
          style={layout}
          theme='dark'
          mode='horizontal'
          defaultSelectedKeys={['1']}
        >
          <Menu.Item key='1'>
            <Link to='/'>Home</Link>
          </Menu.Item>
          <Menu.Item key='2'>
            <Link to='/nltk'>WF Summarizer</Link>
          </Menu.Item>
        </Menu>
      </Header>
    </div>
  );
};

export default Title;
