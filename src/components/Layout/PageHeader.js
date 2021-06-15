import React from 'react';
import { Layout, Menu, Image } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo512.png'

const Title = () => {
  const { Header } = Layout;

  const layout = {
    float: 'right',
  };
  return (
    <div>
      <Header style={{backgroundColor: "black"}}>
        <Image src={logo} height={50} width={50} style={{float: 'left'}} />
        <h2 style={{float: 'left', color:"whitesmoke", paddingLeft: "10px"}}>Research Paper Summarizer</h2>
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
            <Link to='/nltk'>Word Frequency Summarizer</Link>
          </Menu.Item>
        </Menu>
      </Header>
    </div>
  );
};

export default Title;
