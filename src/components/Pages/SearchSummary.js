import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'antd';
import { Col, Row } from 'antd';

const SearchSummary = () => {
  const [text, setText] = useState([]);

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  useEffect(() => {
    getSummary();
    // eslint-disable-next-line
  }, []);

  const getSummary = () => {
    axios.get('http://localhost:5000/api/getdata', config).then((res) => {
      const data = res.data;
      setText(data);
      console.log(data);
    });
  };

  return (
    <div>
      <br />
      <h1>Search Summaries</h1>
      <Row>
        {text.length !== 0 ? (
          text.map((t) => (
            <Col span={8} key={t.id}>
              <Card
                key={t.id}
                title={t.subject}
                //extra={<a href='#'>More</a>}
                style={{ width: 300 }}
              >
                <p>{t.summary}</p>
              </Card>
            </Col>
          ))
        ) : (
          <div>No data available</div>
        )}
      </Row>
    </div>
  );
};

export default SearchSummary;
