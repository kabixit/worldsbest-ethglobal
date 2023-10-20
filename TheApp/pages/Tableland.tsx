import React, { useState, useEffect } from 'react';
import { Database } from '@tableland/sdk';

const TablelandPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = new Database();
        const tableName = "projects_table_80001_7901";
        const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
        console.log(results);
        setData(results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from Tableland:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Tableland Page</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Projects ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Link</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.projects_id}</td>
                <td>{row.name}</td>
                <td>{row.description}</td>
                <td>{row.link}</td>
                <td>{row.votes}</td>
                {/* Add more table cells for additional columns */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablelandPage;
