import { useRef } from 'react';
import { useEffect, useState } from 'react';

function App() {
  const [customers, setCustomers] = useState([]);
  const url = window.location.href.split(window.location.host)[1];
  const firstNameRef = useRef();
  const lastNameRef = useRef();

  useEffect(() => {
      fetch("https://localhost:7134/api/customer")
        .then(res => res.json())
        .then(json => {
          setCustomers(json);
        });
  }, []);

  function deleteCustomer(index) {
    const id = customers[index].id;
    fetch("https://localhost:7134/api/customer/" + id, { method: "DELETE" })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(json => setCustomers(json))
  .catch(error => console.error('Fetch error:', error));
  }

  function addCustomer() {
    const newCustomer = {
      "FirstName": firstNameRef.current.value,
      "LastName": lastNameRef.current.value
    }
    fetch("https://localhost:7134/api/customer/", {method: "POST", body: JSON.stringify(newCustomer), headers: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .then(json => {
          setCustomers(json);
          firstNameRef.current.value = "";
          lastNameRef.current.value = "";
    });
  }

  const [customerUsages, setCustomerUsages] = useState([]);
  const [customerSum, setCustomerSum] = useState(-1);
  const [usagesShownCustomerId, setUsagesShownCustomerId] = useState(-1);

  function getCustomerUsages(customerId) {
    fetch("https://localhost:7134/api/usage-customer?customerId=" + customerId)
    .then(res => res.json())
    .then(json => {
      setCustomerUsages(json);
      setUsagesShownCustomerId(customerId);
      setCustomerSum(-1);
      setAddUsageCustomerId(-1);
    });
  }

  function getCustomerSum() {
    fetch("https://localhost:7134/api/usage-customer-sum?customerId=" + usagesShownCustomerId)
    .then(res => res.json())
    .then(json => {
      setCustomerSum(json);
    });
  }

  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const [addUsageCustomerId, setAddUsageCustomerId] = useState(-1);

  function showAddUsage(customerId) {
    setCustomerUsages([]);
    setUsagesShownCustomerId(-1);
    setAddUsageCustomerId(customerId);
  }

  function addUsage() {
    const newUsage = {
      "deviceId": Number(deviceSelected),
      "customerId": Number(addUsageCustomerId),
      "start": new Date(startTimeRef.current.value).toISOString(),
      "end": new Date(endTimeRef.current.value).toISOString(),
    }
    fetch("https://localhost:7134/api/usage/", {method: "POST", body: JSON.stringify(newUsage), headers: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .then(json => {
          setAddUsageCustomerId(-1);
    });
  }

  const [devices, setDevices] = useState([]);
  const [deviceSelected, setDeviceSelected] = useState(-1);
  const deviceNameRef = useRef();
  const wattsRef = useRef();

  useEffect(() => {
    fetch("https://localhost:7134/api/device")
      .then(res => res.json())
      .then(json => {
        setDevices(json);
      });
  }, []);

  function deleteDevice() {
    fetch("https://localhost:7134/api/device/" + deviceSelected, {method: "DELETE"})
      .then(res => res.json())
      .then(json => {
        setDevices(json);
        setDeviceSelected(-1);
      });
  }

  function selectDevice(e) {
    setDeviceSelected(e.target.value);
  }

  function addDevice() {
    const newDevice = {
      "name": deviceNameRef.current.value,
      "watts": Number(wattsRef.current.value)
    }
    fetch("https://localhost:7134/api/device/", {method: "POST", body: JSON.stringify(newDevice), headers: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .then(json => {
          setDevices(json);
          deviceNameRef.current.value = "";
          wattsRef.current.value = "";
    });
  }

  const [usages, setUsages] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [filterByEnd, setFilterByEnd] = useState(false);
  const startRef = useRef();
  const endRef = useRef();

  useEffect(() => {
    if (start !== null && end !== null) {
      const endpoint = filterByEnd ? "usage/usage-end-period" : "usage/usage-start-period";
      fetch("https://localhost:7134/api/" + endpoint + "?startDate=" + start + "&endDate=" + end)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.text();
        })
        .then(text => {
          console.log("Response:", text);
          if (text) {
            const json = JSON.parse(text);
            setUsages(json);
          } else {
            setUsages([]);
          }
        })
        .catch(error => {
          console.error('Fetch error:', error);
          setUsages([]);
        });
    } else {
      fetch("https://localhost:7134/api/usage")
        .then(res => res.json())
        .then(json => {
          setUsages(json);
        })
        .catch(error => console.error('Fetch error:', error));
    }
  }, [start, end, filterByEnd]);

  function updateStart() {
    const startIso = new Date(startRef.current.value).toISOString();
    setStart(startIso);
  }

  function updateEnd() {
    const endIso = new Date(endRef.current.value).toISOString();
    setEnd(endIso);
  }

  function deleteUsage(usageId) {
    fetch("https://localhost:7134/api/usage/" + usageId, { method: "DELETE" })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(json => setUsages(json))
      .catch(error => console.error('Fetch error:', error));
  }

  const navigationStyles = {
    backgroundColor: '#333',
    height: '50px',
  };

  const listStyles = {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  };

  const itemStyles = {
    float: 'left',
  };

  const linkStyles = {
    display: 'block',
    color: 'white',
    textAlign: 'center',
    padding: '16px',
    textDecoration: 'none',
  };

  return (
    <div>
      <nav style={navigationStyles}>
      <ul style={listStyles}>
        <li style={itemStyles}>
          <a href="/" style={linkStyles}>
            Avaleht
          </a>
        </li>
        <li style={itemStyles}>
          <a href="tarbijad" style={linkStyles}>
            Tarbijad
          </a>
        </li>
        <li style={itemStyles}>
          <a href="seadmed" style={linkStyles}>
            Seadmed
          </a>
        </li>
        <li style={itemStyles}>
          <a href="kasutused" style={linkStyles}>
            Kasutused
          </a>
        </li>
      </ul>
    </nav>
      {url === "/" && 
      <div style={{"margin": "50px"}}>
        Tegemist on eesrakendusega, mis on mõeldud näitamaks, kuidas kasutada tagarakenduse API otspunkte.
        <br />
        Rakendus on kõigest näiterakendus, eesrakenduse osas ei ole kasutatud parimaid praktikaid, välja arvatud API otspunktidega suhtlemise osas.
        <br />
        Toome välja järgnevad parendused eesrakenduse osas:
        <ul>
          <li>Kasutada CSS klassi HTMLi style= asemel</li>
          <li>Kasutada komponentide põhist lähenemist</li>
          <li>Kasutada navigeerimiseks react-router-dom moodulit</li>
        </ul>
        Rakendus on samas ideaalne näide, kui kooditihedaks võib rakendus kujuneda, kui ei kasutata komponentide põhist lähenemist.
      </div>}
      {url === "/tarbijad" && 
      <div>
        <br />
        <table style={{marginLeft: "100px"}}>
          <thead>
            <tr>
              <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Eesnimi</th>
              <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Perenimi</th>
              <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Tegevused</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((data, index) => 
            <tr key={index}>
              <td style={{border: "1px solid #ddd", padding: "8px"}}>{data.firstName}</td>
              <td style={{border: "1px solid #ddd", padding: "8px"}}>{data.lastName}</td>
              <td style={{border: "1px solid #ddd", padding: "8px"}}> 
                <button onClick={() => deleteCustomer(index)}>Kustuta andmebaasist</button> <br /> 
                <button onClick={() => getCustomerUsages(data.id)}>Näita tarbija kasutusi</button> <br />
                <button onClick={() => showAddUsage(data.id)}>Lisa tarbijale uus kasutus</button> 
              </td>
            </tr>)}
            <tr>
              <td style={{border: "1px solid #ddd", padding: "8px"}}> <input ref={firstNameRef} type="text" /> </td>
              <td style={{border: "1px solid #ddd", padding: "8px"}}> <input ref={lastNameRef} type="text" /> </td>
              <td style={{border: "1px solid #ddd", padding: "8px"}}> <button onClick={addCustomer}>Lisa</button> </td>
            </tr>
          </tbody>
        </table>
        <div>
          {customerUsages.length > 0 && <div>{customerUsages.map(e => <div key={e.id}>Tarbimine ID-ga: {e.id}, summas {e.totalUsageCost} €</div>)}</div>}
          {customerUsages.length > 0 && customerSum === -1 && <button onClick={getCustomerSum}>Näita kogusummat</button> }
          {customerUsages.length > 0 && customerSum !== -1 && <div>{customerSum} €</div> }
          {usagesShownCustomerId >= 0 && customerUsages.length === 0 && <div>Tarbijal pole ühtegi kasutuskorda.</div>}
        </div>
        {addUsageCustomerId !== -1 &&
        <div>
          <div><b>Lisad kasutajale {customers.find(e => e.id === Number(addUsageCustomerId))?.firstName} uut kasutuskorda</b></div>
          Seade:
          <select onChange={selectDevice}>
            {devices.map((data, index) => <option key={index} value={data.id}>{data.name} ({data.watts} watti)</option> )}
          </select>
          {deviceSelected >= 0 && 
            <div>
              Valitud: {devices.find(e => e.id === Number(deviceSelected)).name} 
              <div>Kasutuse algus: <input ref={startTimeRef} type="datetime-local" /></div>
              <div>Kasutuse lõpp: <input ref={endTimeRef} type="datetime-local" /></div>
              <button onClick={addUsage}>Lisa kasutuskord andmebaasi</button> 
            </div>}
        </div>}
      </div>}
      { url === "/seadmed" && <div style={{"marginLeft": "100px"}}>
          <br />
          <div>Kõik seadmed:</div>
          <select onChange={selectDevice}>
            {devices.map((data, index) => <option key={index} value={data.id}>{data.name} ({data.watts} watti)</option> )}
          </select>
          <div><i>Vali ülevalt milline kustutada</i></div>
          {deviceSelected >= 0 && 
            <div>
              Valitud: {devices.find(e => e.id === Number(deviceSelected)).name} 
              <button onClick={deleteDevice}>Kustuta andmebaasist</button> 
            </div>}
            <br /><br />
          <div>Lisa uus seade:</div>
          <label>Seadme nimi</label> <br />
          <input ref={deviceNameRef} type="text" /> <br />
          <label>Seadme võimsus wattides</label> <br />
          <input ref={wattsRef} type="number" /> <br />
          <button onClick={addDevice}>Lisa</button>
        </div> }
        { url === "/kasutused" && 
          <div>
            <div style={{marginLeft: "2%", marginTop: "20px"}}>
              <label>
                <input 
                  type="radio" 
                  name="filterType" 
                  checked={!filterByEnd} 
                  onChange={() => setFilterByEnd(false)}
                /> Filtreeri algusaja järgi
              </label>
              <label style={{marginLeft: "20px"}}>
                <input 
                  type="radio" 
                  name="filterType" 
                  checked={filterByEnd} 
                  onChange={() => setFilterByEnd(true)}
                /> Filtreeri lõpuaja järgi
              </label>
            </div>
            <div style={{marginLeft: "2%", marginTop: "10px"}}>
              <input ref={startRef} onChange={updateStart} type="datetime-local" />
              <input ref={endRef} onChange={updateEnd} type="datetime-local" style={{marginLeft: "10px"}} />
            </div>
            <table style={{marginLeft: "2%", marginTop: "20px"}}>
              <thead>
                <tr>
                  <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Kasutaja</th>
                  <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Seade</th>
                  <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Algus</th>
                  <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Lõpp</th>
                  <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Maksumus</th>
                  <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Tegevused</th>
                </tr>
              </thead>
              <tbody>
                {usages.map((data, index) => 
                <tr key={index}>
                  <td style={{border: "1px solid #ddd", padding: "8px"}}>{data.customerId}</td>
                  <td style={{border: "1px solid #ddd", padding: "8px"}}>{data.deviceId}</td>
                  <td style={{border: "1px solid #ddd", padding: "8px"}}>{data.start}</td>
                  <td style={{border: "1px solid #ddd", padding: "8px"}}>{data.end}</td>
                  <td style={{border: "1px solid #ddd", padding: "8px"}}>{data.totalUsageCost}</td>
                  <td style={{border: "1px solid #ddd", padding: "8px"}}>
                    <button onClick={() => deleteUsage(data.id)}>Kustuta</button>
                  </td>
                </tr>)}
              </tbody>
            </table>
          </div>
        }
    </div>
  );
}

export default App;