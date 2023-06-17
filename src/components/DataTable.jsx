import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';


const DataTable = ({
  typeOfData,
  dataApi,
  fetchingParam,
  fieldsHeading,
  fieldsName,
  setEditMode,
  setEditData,
  forceUpdate,
  setForceUpdate
}) => {

  const searchDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const allTableDataRefVariable = useRef([]);

  const [allTableData, setAllTableData] = useState([])
  const [searchCategory, setSearchCategory] = useState("all");
  const [allSearchCategory, setAllSearchCategory] = useState([]);
  const [searchText, setSearchText] = useState("")


  if (typeOfData == undefined)
    typeOfData = "data";
  if (Array(fieldsHeading).length == 0 || fieldsHeading == undefined) {
    fieldsHeading = ["Id", "First", "Second"]
  }

  useEffect(() => {
    if (forceUpdate == true) {
      console.log("Force Updating all the data...");
      getAllData();

      setForceUpdate(() => false)
    }
  }, [forceUpdate])



  const getAllData = () => {
    if (dataApi === undefined)
      return;
    console.log("Fetching all data...");

    const fetchingParameterName = Object.keys(fetchingParam)[0]
    // console.log(fetchingParameterName, fetchingParam[fetchingParameterName]);

    let formData = new FormData();
    formData.append(fetchingParameterName, fetchingParam[fetchingParameterName]);

    const params = { method: "POST", body: formData };

    fetch(dataApi, params).then(data => data.text()).then((_rawData) => {
      // console.log(_rawData);

      let data;
      try {
        data = JSON.parse(_rawData);
      } catch (error) {
        console.log(error);
        toast.error(`INVALID Data Sent by Server`);
        return;
      }

      console.log(data);
      if (data.status === 'error') {
        console.log(`${data.type} error in Server during fetching all data`);
        return;
      }

      setAllTableData(data.data);
      allTableDataRefVariable.current = data.data;

      // Set all categoreis in search filter
      let allKeys = [];
      let oneData = data.data[0];
      for (let key in oneData)
        allKeys.push(key);

      setAllSearchCategory(() => {
        return allKeys;
      })

    }).catch((error) => {
      console.log(error);

      if (error.message == "Failed to fetch")
        toast.error(`ERROR - Server not responding`);
      else
        toast.error(`ERROR in fetching all ${typeOfData} data`);
    });

  }

  const changeSearchCategory = () => {
    setSearchCategory(() => {
      return searchDropdownRef.current.value;
    })
  }


  const changeSearchText = () => {
    setSearchText(() => {
      return searchInputRef.current.value
    })
    searchData();
  }


  const editData = (id) => {
    // toast(`Editing with id ${id}`);

    let newItem = allTableDataRefVariable.current.filter((item) => {
      return item['id'] == id
    })[0]

    console.log(newItem);
    setEditMode(() => {
      return true;
    });

    if (typeOfData.toLowerCase() == 'voter')
      newItem['fatherName'] = newItem['father_name'];

    console.log(newItem);

    setEditData(() => {
      return newItem;
    })

    window.scrollTo(0, 0)
  }


  const searchData = () => {
    console.log(`search category: ${searchCategory}`);
    console.log(`search text: ${searchText}`);

    setAllTableData(() => {
      return allTableDataRefVariable.current
    })

    if (searchText == '') {
      return;
    }

    let searchString = searchText.toLowerCase();

    let sArr = searchString.split(" ");
    sArr = sArr.filter((e) => {
      return e.length != 0
    });

    // m for Male, f for Female
    if (searchCategory == 'gender') {
      let i;

      i = sArr.indexOf('male');
      sArr[i] = "m";
      li = sArr.indexOf('female');
      sArr[i] = "f";
      i = sArr.indexOf('transgender');
      sArr[i] = "t";
      i = sArr.indexOf('other');
      sArr[i] = "o";
    }

    if (searchCategory === 'all' || searchCategory == 'active') {
      let allData = allTableDataRefVariable.current.map((item) => {
        // console.log(item);
        let flag = 0;

        // console.log(sArr);
        sArr.map((keyword) => {
          // console.log(`(${keyword})`);

          for (let key in item) {
            let value = new String(item[key]).toLowerCase();
            // let value = new String("First Chakraborty").toLowerCase();
            // console.log(value);

            if (value.includes(keyword)) {
              console.log(`[${keyword}] found at item[${key}] = (${value})`);
              flag = 1;
              break;
            }
          }

        });

        if (flag == 1) {
          return item;
        }

      })

      console.log(allData);

      allData = allData.filter((data) => {
        return data !== undefined;
      });

      console.log(allData);

      setAllTableData(() => {
        return allData;
      })
    }
    else {
      console.log(searchCategory);
      let allData = allTableDataRefVariable.current.map((item) => {
        // console.log(item);
        let flag = 0;

        // console.log(sArr);
        sArr.map((keyword) => {
          // console.log(`(${keyword})`);

          for (let key in item) {
            if (key == searchCategory) {
              let value = new String(item[key]).toLowerCase();
              // let value = new String("First Chakraborty").toLowerCase();
              // console.log(value);

              if (value.includes(keyword)) {
                console.log(`[${keyword}] found at item[${key}] = (${value})`);
                flag = 1;
                break;
              }
            }
          }

        });

        if (flag == 1) {
          return item;
        }

      })

      console.log(allData);

      allData = allData.filter((data) => {
        return data !== undefined;
      });

      console.log(allData);

      setAllTableData(() => {
        return allData;
      })

    }
  }


  return (
    <div className="mt-4 py-3">
      <h2 className="mb-3">Show all {typeOfData}</h2>

      {/* <!-- Search bar --> */}
      <div className="d-flex" role="search">

        <select ref={searchDropdownRef} onChange={changeSearchCategory} className="form-select w-fit me-1" name='booth' aria-label="Default select example" defaultValue={'active'} required={true}>
          <option value="active" disabled={true}>Search by Category</option>
          <option value="all">All</option>
          {
            allSearchCategory.map((item) => {
              return <option key={item} value={item}>{item}</option>
            })
          }
        </select>

        <input ref={searchInputRef} value={searchText} onChange={changeSearchText} className="form-control me-2" type="search" placeholder={`Search a ${typeOfData.toLowerCase()}`} aria-label="Search" />
        <button onClick={searchData} className="btn btn-outline-success">Search</button>
      </div>

      <button onClick={getAllData} className="btn btn-warning mt-3">Get All {typeOfData}</button>

      {/* <!-- Data Table --> */}
      <table className="table table-bordered table-hover my-3">
        <thead>
          <tr className="table-dark text-center">
            {
              fieldsHeading.map((booth, index) => (
                <th scope="col" key={index}>{booth}</th>
              ))
            }
            <th scope="col" >Action</th>
          </tr>
        </thead>

        <tbody id="table-body">

          {allTableData.map((voter, index1) => (
            <tr key={`v${index1}`}>
              {/* {console.log(voter)} */}
              {fieldsName.map((keyName, index2) => {
                // console.log(fieldsName[index2]);

                if (fieldsName[index2] === 'gender') {
                  let gender;
                  switch (voter[fieldsName[index2]]) {
                    case 'm':
                      gender = "Male";
                      break;
                    case 'f':
                      gender = "Female";
                      break;
                    case 't':
                      gender = "Transgender";
                      break;
                    case 'o':
                      gender = "Other";
                      break;
                  }

                  return (
                    <td key={`v${index1}-${index2}`}>
                      {gender}
                    </td>
                  );
                }

                else if (fieldsName[index2] === 'status') {
                  switch (voter[fieldsName[index2]]) {
                    case 'active':
                      return (<td key={`v${index1}-${index2}`}><span className="badge text-bg-success">Active</span></td>)

                    case 'banned':
                      return (<td key={`v${index1}-${index2}`}><span className="badge text-bg-warning">Banned</span></td>)

                    case 'inactive':
                      return (<td key={`v${index1}-${index2}`}><span className="badge text-bg-danger">Inactive</span></td>)

                    case 'dead':
                      return (<td key={`v${index1}-${index2}`}><span className="badge text-bg-danger">Dead</span></td>)
                  }
                }

                else
                  return (
                    <td key={`v${index1}-${index2}`}>
                      {voter[fieldsName[index2]]}
                    </td>
                  );
              })}

              <td className="text-center">
                <button onClick={() => editData(voter['id'])} className="btn btn-outline-primary">Edit</button>
              </td>
            </tr>
          ))
          }

          {
            allTableData.length == 0 && <tr><td colSpan={fieldsHeading.length + 1}>
              <center>No Data</center>
            </td></tr>
          }

          {/* <!-- <tr>
            <td>1</td>
            <td>Saptarshi Chakraborty</td>
            <td>Father Chakraborty</td>
            <td>Male</td>
            <td>23-10-2000</td>
            <td>59, B N Sen, Saidabad, Berhampore, Murshidabad, 742103</td>
            <td>Booth 1</td>
            <td>
                <span className="badge text-bg-success">Active</span>
            </td>
            <td className="text-center">
                <button className="btn btn-outline-primary" onclick="editVoter()">Edit</button>
            </td>
        </tr> --> */}

        </tbody>
      </table>

    </div>
  )
}

export default DataTable