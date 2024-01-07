// DataTable.tsx
import React, { useState, useEffect } from 'react';
import AddDataForm from './AddDataForm';
import './DataTable.css';
import { BASE_URL } from './helper';
interface TableRow {
  _id: string; // <-- Add this line
  name: string;
  phoneNumber: string;
  email: string;
  hobbies: string;
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [isAddFormOpen, setAddFormOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [selectedata, setSelecteddata] = useState<TableRow>()
  const [status, setStatus] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/user/list`);
        if (response.ok) {
          const fetchedData = await response.json();
          setData(fetchedData);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [status]);



  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/user/delete/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update the state by filtering out the deleted user
        setData((prevData) => prevData.filter((row) => row._id !== userId));
      } else {
        console.error('Error deleting user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  const handleUpdate = (row: TableRow) => {
    setSelectedRow(row);
    setAddFormOpen(true);
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            "name": selectedata?.name,
            "email": selectedata?.email,
            "phoneNumber": selectedata?.phoneNumber,
            "hobbies": selectedata?.hobbies
          }
        ),

      });
      if (response.ok) {
        alert('send suceefully')
      } else {
        alert('send failed')
      }

    } catch (error) {
      console.error('Error updating user:', error);
    }

  };


  return (
    <div className="page-container">
      <div className="table-container">
        <div className="buttons-container">
          <button className="button add-button" onClick={() => setAddFormOpen(true)}>
            Add New Data
          </button>
          <button className="button send-button" onClick={handleSendEmail}>
            Send
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="checkbox-header" />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Hobbies</th>
              <th>Update/Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row._id}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox-row"
                    onChange={() =>
                      setSelecteddata(row)
                    }
                  />
                </td>
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.phoneNumber}</td>
                <td>{row.email}</td>
                <td>{row.hobbies}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="button action-button"
                      onClick={() => handleUpdate(row)}
                    >
                      Update
                    </button>
                    <button
                      className="button action-button"
                      onClick={() => {
                        console.log('row.id:', row._id);
                        handleDelete(row._id);
                      }}

                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isAddFormOpen && (
          <AddDataForm
            onClose={() => {
              setSelectedRow(null);
              setAddFormOpen(false);
              setStatus(!status)
            }}
            onAdd={(newData) => {
              if (selectedRow) {
                setData((prevData) =>
                  (prevData.map((row) => (row._id === selectedRow._id ? newData : row)) as TableRow[])
                );
              } else {
                setData((prevData) => [...prevData, newData] as TableRow[]);
              }
            }}
            initialData={selectedRow || undefined} // Pass undefined instead of null

          />
        )}
      </div>
    </div>
  );
};

export default DataTable;