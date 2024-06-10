import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./SimpleTable.css";

const SimpleTable = () => {
  const [rowCount, setRowCount] = useState(17);
  const [colCount, setColCount] = useState(20);
  const [rowData, setRowData] = useState(
    Array.from({ length: rowCount }, () => [
      Array.from({ length: colCount }, (v, i) => ({
        text: "Data",
        value: i === 8 || i === 17 ? "Data" : "1",
        changed: false,
        isEditable: false,
      })),
    ])
  );
  const [rowHeaders, setRowHeaders] = useState([
    "Bankruptcy",
    "Fair Lending",
    "ECOA",
    "TILA - Closed End",
    "MLA",
    "Privacy",
    "UDAAP",
    "CAN-SPAM",
    "E-Sign",
    "FCRA",
    "FDCPA",
    "SCRA",
    "TCPA",
    "TSR",
    "BSA",
    "FACTA Red Flags",
    "Reg E",
  ]);
  const [columnHeaders, setColumnHeaders] = useState([
    "Summary of Potential Regulatory Risk",
    "Penalties Litigation/Fines",
    "Exam Scrutiny",
    "Relevant Regulatory Actions in Industry",
    "Flagged Issue (Complaints, issue management)",
    "Third-Party Dependency Risk",
    "Consumer Protection Risk",
    "New Areas of Business",
    "Inherent Risk",
    "Controls",
    "Management Oversight & Reporting",
    "Policies & Procedures",
    "Relevant Technology Solution",
    "Relevant Staffing",
    "Training",
    "Monitoring & Testing",
    "Issue & Complaint Management",
    "Effectiveness of Controls Assessment",
    "Overall Residual Risk",
    "Comments",
  ]);

  useEffect(() => {
    calculateInherentRisk();
    //   calculateOverallResidualRisk();
    //   calculateEffectivenessOfControlsAssessment();
  }, []);

  const toggleEdit = (rowIndex, g_index, colIndex) => {
    const updatedRowData = [...rowData];
    updatedRowData[g_index][rowIndex][colIndex].isEditable =
      !updatedRowData[g_index][rowIndex][colIndex].isEditable;
    setRowData(updatedRowData);
  };

  const increaseRow = (index) => {
    setRowCount(rowCount + 1);
    const newRow = Array.from({ length: colCount }, (v, i) => ({
      text: "Data",
      value: i === 8 || i === 17 ? "Data" : "1",
      changed: false,
      isEditable: false,
    }));
    const updatedRowData = JSON.parse(JSON.stringify(rowData));
    updatedRowData[index].push(newRow);
    setRowData(updatedRowData);
    toast.success(`Row has been added in the ${rowHeaders[index]} category`);
  };

  const calculateInherentRisk = () => {
    const inherentRiskValues = rowData.map((g_row) => {
      return [
        g_row.map((row) => {
          const numericValues = row
            .slice(1, 8)
            .map((cell) => (cell.changed ? parseInt(cell.value, 10) || 0 : 0));
          return numericValues.reduce((acc, curr) => acc + curr, 0);
        }),
      ];
    });
    const updatedRowData = [...rowData];
    updatedRowData.forEach((g_row, g_index) => {
      g_row.forEach((row, index) => {
        row[8].text =
          inherentRiskValues[g_index][index][0] === 0
            ? "Data"
            : inherentRiskValues[g_index][index][0].toString();
      });
    });
    setRowData(updatedRowData);
  };

  const calculateEffectivenessOfControlsAssessment = () => {
    const effectivenessOfControlsValues = rowData.map((row) => {
      const numericValues = row
        .slice(10, 17)
        .map((cell) => (cell.changed ? parseInt(cell.value, 10) || 0 : 0));
      return numericValues.reduce((acc, curr) => acc + curr, 0);
    });
    const updatedRowData = [...rowData];
    updatedRowData.forEach((row, index) => {
      row[17].text =
        effectivenessOfControlsValues[index] === 0
          ? "Data"
          : effectivenessOfControlsValues[index].toString();
    });
    setRowData(updatedRowData);
  };

  const calculateOverallResidualRisk = () => {
    const updatedRowData = [...rowData];
    updatedRowData.forEach((row, index) => {
      const sumOfDropdowns = row
        .slice(10, 17)
        .reduce((acc, cell) => acc + (parseInt(cell.value, 10) || 0), 0);
      row[17].text = sumOfDropdowns.toString();
      if (sumOfDropdowns !== 0) {
        const inherentRisk = parseInt(row[8].text, 10) || 0;
        const ratio = inherentRisk / sumOfDropdowns;
        row[18].text = ratio.toFixed(2);
      } else {
        row[18].text = "Data";
      }
    });
    setRowData(updatedRowData);
  };

  const handleSliderChange = (rowIndex, colIndex, g_index, newValue) => {
    const updatedRowData = JSON.parse(JSON.stringify(rowData));
    updatedRowData[g_index][rowIndex][colIndex].value = newValue.toString();
    updatedRowData[g_index][rowIndex][colIndex].changed = true;
    setRowData(updatedRowData);
  };

  const handleTextChange = (rowIndex, colIndex, g_index, event) => {
    const { value } = event.target;
    const updatedRowData = JSON.parse(JSON.stringify(rowData));

    const lines = (
      updatedRowData[g_index][rowIndex][colIndex].text || ""
    ).split("\n");
    lines[event.target.dataset.index] = value;
    updatedRowData[g_index][rowIndex][colIndex].text = lines.join("\n");
    setRowData(updatedRowData);
  };

  const addInputBox = (rowIndex, colIndex, g_index) => {
    const updatedRowData = JSON.parse(JSON.stringify(rowData));
    updatedRowData[g_index][rowIndex][colIndex].text += "\n";
    setRowData(updatedRowData);
  };

  const getBackgroundColor = (cell, colIndex) => {
    if (!cell.changed) {
      return "white";
    }
    if (colIndex >= 1 && colIndex <= 7) {
      return cell.value === "1"
        ? "green"
        : cell.value === "2"
        ? "yellow"
        : cell.value === "3"
        ? "red"
        : "";
    } else if (colIndex >= 10 && colIndex <= 17) {
      return cell.value === "1"
        ? "red"
        : cell.value === "2"
        ? "yellow"
        : cell.value === "3"
        ? "green"
        : "";
    }
    return "";
  };

  const getSliderLabel = (value, colIndex) => {
    if (colIndex >= 1 && colIndex <= 7) {
      return value === "1"
        ? "Low"
        : value === "2"
        ? "Moderate"
        : value === "3"
        ? "High"
        : "";
    } else if (colIndex >= 10 && colIndex <= 17) {
      return value === "1"
        ? "Low"
        : value === "2"
        ? "Adequate"
        : value === "3"
        ? "Strong"
        : "";
    }
    return "";
  };

  return (
    <div
      className="table-container"
      style={{ overflowX: "auto", maxWidth: "100%" }}
    >
      <ToastContainer />
      <table>
        <thead>
          <tr>
            <th
              className="header"
              style={{
                backgroundColor: "#65ad93",
                position: "sticky",
                left: "0",
                zIndex: "2",
              }}
            >
              Regulatory Risk Category
            </th>
            {columnHeaders.map((header, index) => (
              <th
                key={index}
                className="header"
                rowSpan={2}
                style={{
                  backgroundColor: "#86aae3",
                  wordBreak: "break-all",
                  whiteSpace: "nowrap",
                  position: "sticky",
                  top: "0",
                  zIndex: "1",
                }}
              >
                <input
                  type="text"
                  value={header}
                  onChange={(event) => {
                    const newHeaders = [...columnHeaders];
                    newHeaders[index] = event.target.value;
                    setColumnHeaders(newHeaders);
                  }}
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    fontWeight: "bold",
                    width: "300px",
                    height: "30px",
                    backgroundColor: "inherit",
                  }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowHeaders.map((header, g_index) => (
            <React.Fragment key={g_index}>
              {rowData[g_index].map((value, index) => (
                <tr>
                  {index === 0 ? (
                    <td
                      rowSpan={rowData[g_index].length || 1}
                      className="header"
                      style={{
                        backgroundColor: "#65ad93",
                        position: "sticky",
                        left: "0",
                        zg_index: "2",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="text"
                          value={header}
                          onChange={(event) => {
                            const newHeaders = [...rowHeaders];
                            newHeaders[g_index] = event.target.value;
                            setRowHeaders(newHeaders);
                          }}
                          style={{
                            border: "none",
                            outline: "none",
                            fontSize: "14px",
                            fontWeight: "bold",
                            backgroundColor: "inherit",
                            width: "150px",
                            height: "30px",
                          }}
                        />
                        <AddCircleOutlineOutlinedIcon
                          onClick={() => increaseRow(g_index)}
                          style={{
                            cursor: "pointer",
                            marginLeft: "10px",
                            color: "#006400",
                          }}
                        />
                      </div>
                    </td>
                  ) : null}
                  <>
                    {value.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className={`cell ${
                          colIndex === 0 ? "editor" : cell.value.toLowerCase()
                        }`}
                        style={{
                          backgroundColor:
                            getBackgroundColor(cell, colIndex) || "white",
                          width: "300px",
                          height: "40px",
                          textAlign: "center",
                        }}
                      >
                        {colIndex === 0 ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              position: "relative",
                            }}
                          >
                            <EditOutlinedIcon
                              onClick={() => toggleEdit(index, g_index, colIndex)}
                              style={{
                                cursor: "pointer",
                                position: "absolute",
                                top: "-11px",
                                right: "-8px",
                                color: "#00008B",
                              }}
                            />
                            {(cell.text || "").split("\n").map((line, idx) => (
                              <div
                                key={idx}
                                style={{
                                  marginBottom: "5px",
                                  width: "100%",
                                  margin: "5px",
                                  borderRadius: "5px",
                                }}
                              >
                                {cell.isEditable ? (
                                  <input
                                    type="text"
                                    value={line}
                                    onChange={(event) =>
                                      handleTextChange(
                                        index,
                                        colIndex,
                                        g_index,
                                        event
                                      )
                                    }
                                    data-index={idx}
                                    style={{
                                      width: "calc(100% - 10px)",
                                      height: "60px",
                                      margin: "2px",
                                      padding: "5px",
                                      resize: "none",
                                      overflow: "auto",
                                      wordWrap: "break-word",
                                      whiteSpace: "pre-wrap",
                                      textAlign: "center",
                                      maxWidth: "300px",
                                      borderRadius: "5px",
                                      border: "1px solid blue",
                                    }}
                                  />
                                ) : (
                                  <p
                                    style={{
                                      width: "calc(100% - 10px)",
                                      height: "60px",
                                      margin: "2px",
                                      padding: "5px",
                                      resize: "none",
                                      overflow: "auto",
                                      wordWrap: "break-word",
                                      whiteSpace: "pre-wrap",
                                      textAlign: "center",
                                      maxWidth: "300px",
                                      borderRadius: "5px",
                                      border: "1px solid gray",
                                    }}
                                  >
                                    {line}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (colIndex >= 1 && colIndex <= 7) ||
                          (colIndex >= 10 && colIndex <= 16) ? (
                          <div className="slider-container">
                            <Slider
                              value={parseInt(cell.value, 10) || 1}
                              min={1}
                              max={3}
                              step={1}
                              onChange={(event, newValue) =>
                                handleSliderChange(
                                  index,
                                  colIndex,
                                  g_index,
                                  newValue
                                )
                              }
                              marks={[
                                { value: 1, label: "Low" },
                                { value: 2, label: "Moderate" },
                                { value: 3, label: "High" },
                              ]}
                              valueLabelDisplay="auto"
                              sx={{
                                width: "80%",
                                height: "6px",
                                "& .MuiSlider-track": {
                                  color: "black",
                                },
                                "& .MuiSlider-thumb": {
                                  color: "black",
                                  width: "14px",
                                  height: "14px",
                                },
                              }}
                            />
                            <div className="slider-label">
                              {getSliderLabel(cell.value, colIndex)}
                            </div>
                          </div>
                        ) : (
                          cell.text
                        )}
                      </td>
                    ))}
                  </>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
