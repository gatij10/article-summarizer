import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "antd";
// import { Col, Row } from "antd";

const SearchSummary = () => {
  const [text, setText] = useState([]);

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
      setText(data);
      console.log(data);
    });
  };

  return (
    <div>
      <br />
      <h1>Summary Collection</h1>

      {text.length !== 0 ? (
        text.map((t) => (
          <Card key={t.id} >
            <Card
              type="inner"
              title={`Category - ${t.subject}`}
              // extra={<a href="#">More</a>}
            >
              {t.summary}
            </Card>
          </Card>
        ))
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default SearchSummary;
