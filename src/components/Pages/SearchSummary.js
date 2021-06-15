import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Select, Card } from "antd";

const { Option } = Select;

const SearchSummary = () => {
  const [summary, setSummary] = useState([]);
  const [filteredSummay, setFilteredSummary] = useState([]);

  const categoryList = ['Computer Science', 'Maths', 'Physics', 'Statistics', 'Select Category']

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };


  useEffect(() => {
    getSummary();
    // eslint-disable-next-line
  }, []);

  const getSummary = () => {
    axios.get("http://localhost:5000/api/getdata", config).then((res) => {
      const data = res.data;
      setSummary(data);
      setFilteredSummary(data)
    });
  };

  const onOptionChange = (option) => {
    const summaryOption = summary.filter(s => s.subject === option)
    setFilteredSummary(summaryOption)
    if (option === "Select Category") {
      setFilteredSummary(summary)
    }
  }

  return (
    <div>
      <br />
      <h1>Summary Collection</h1>

      <Row>
        <Col>
          <Select style={{ width: 170, borderColor: 'red', paddingLeft: "22px" }} defaultValue="Select Category" onChange={onOptionChange}>
            {
              categoryList.map((category, index) =>
                <Option value={category} key={index}>{category}</Option>
              )
            }
          </Select>
        </Col>
      </Row>


      {filteredSummay.length !== 0 ? (
        filteredSummay.map((s, index) => (
          <Card key={index} >
            <Card
              type="inner"
              title={`Category - ${s.subject}`}
              style={{ borderColor: "black" }}
            >
              {s.summary}
            </Card>
          </Card>
        ))
      ) : (
        <div>No Data available</div>
      )}
    </div>
  );
};

export default SearchSummary;
