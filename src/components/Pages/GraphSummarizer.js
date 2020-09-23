import React, { useState } from 'react';
import { Input } from 'antd';
import { Button } from 'antd';
import axios from 'axios';
import { Col, Row } from 'antd';
import { Card } from 'antd';
import Loading from '../Layout/Loading';

const GraphSummarizer = () => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const onUrlChange = (e) => {
    console.log(e.target.value);
    setUrl(e.target.value);
  };

  const generateSummary = async () => {
    setLoading(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post(
      'http://localhost:5000/api/graph_summary',
      { url },
      config
    );
    const data = res.data;
    setSummary(data);
    console.log(data);
    setLoading(false);
  };

  return (
    <div>
      <Card>
        <h2>Graph based Summarizer</h2>
        <Row>
          <Col span={12} offset={6}>
            <label>
              <h3>Enter Link</h3>
            </label>
            <Input
              type='url'
              name='url'
              value={url}
              placeholder='Enter Link...'
              onChange={onUrlChange}
              required
            />
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col span={12} offset={6}>
            <Button type='primary' onClick={generateSummary} block>
              Generate Summary
            </Button>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col span={12} offset={6}>
          <h2>Summay</h2>
        </Col>
      </Row>
      <br />

      <Row>
        {loading === false ? (
          <Col span={12} offset={6}>
            <Card>
              <p>{summary}</p>
            </Card>
          </Col>
        ) : (
          <Col span={12} offset={6}>
            <Loading />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default GraphSummarizer;
