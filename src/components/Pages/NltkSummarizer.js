import React, { useState } from "react";

import { Col, Row, Card, Button, Input } from "antd";
import axios from "axios";
import Loading from "../Layout/Loading";

const NltkSummarizer = () => {
  const [url, setUrl] = useState("");
  const [sentences, setSentences] = useState(0);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");

  const onUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const onNumberChange = (e) => {
    setSentences(e.target.value);
  };

  const generateSummary = async () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(
      "http://13.233.225.63/api/wordfreq_summary",
      { url, sentences },
      config
    );


    const data = res.data;

    if(data.length === undefined) {
      setSummary(data.summary);
      setCategory(data.category);
    }else{
      setSummary(data);
    }
    setLoading(false);
  };

  return (
    <div>
      <Card>
        <h2>Word Frequency Summarizer</h2>
        <br />

        <Row>
          <Col span={12} offset={6}>
            <label>
              <h3>Enter Link</h3>
            </label>
            <Input
              type="url"
              name="url"
              value={url}
              placeholder="Enter Link..."
              onChange={onUrlChange}
              required
            />
          </Col>
        </Row>
        <br />

        <Row>
          <Col span={12} offset={6}>
            <label>
              <h3>Enter number of sentences</h3>
            </label>
            <Input
              type="number"
              name="number"
              value={sentences}
              placeholder="Enter number..."
              onChange={onNumberChange}
              min={1}
              required
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={12} offset={6}>
            <Button type="primary" onClick={generateSummary} block>
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
            <Card title={`Category - ${category}`}>{summary}</Card>
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

export default NltkSummarizer;
