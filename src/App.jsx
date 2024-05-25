import {useEffect, useState} from 'react'
import './App.css'

Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}
Date.prototype.isoString = function() {
  let currentDate = new Date(this.valueOf());
  const offset = currentDate.getTimezoneOffset();
  const yourDate = new Date(currentDate.getTime() - (offset*60*1000));
  return yourDate.toISOString().split('T')[0];
}
Date.prototype.displayString = function() {
  let currentDate = new Date(this.valueOf());
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return currentDate.toLocaleString("et-EE", options);
}

const prefix = !true ? 'https://cors-anywhere.herokuapp.com/' : '';
const apiUrl = prefix + "https://xn--riigiphad-v9a.ee/en?output=json";


function App() {
  const [count, setCount] = useState(0);
  const [holidays, setHolidays] = useState([]);
  const [holidayState, setHolidayState] = useState("Laen puhkuseid");
  const [okDate, setOkDate] = useState("");

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(response => response.filter(x => ['1', '2'].includes(x.kind_id)).map(x => [x.date, x.title, x.kind_id]))
      .then(response => setHolidays(response))
      .then(() => setHolidayState(""))
      .catch(x => {
        setHolidayState("Puhkuste laadimine ebaõnnestus");
        console.error('paha', x)
      })
    ;
  }, []);

  const generateDivs = (start) => {
    if (!holidays) return [];
    const newDivs = [];
    let count = start;
    while (count <= 100) {
      const date = new Date().addDays(count);
      const formatted = date.isoString();
      const row = holidays.find(x => x[0] === formatted) || [];
      const label = row[1] || [0, 6].includes(date.getDay()) && date.toLocaleString('et-EE', { weekday: "long"});
      const local = date.displayString();
      if (!label) {
        if (okDate !== local) {
          setOkDate(local);
        }
        break;
      }
      newDivs.push(<div key={count}>{label}: {local}</div>);
      count +=1;
    }
    return newDivs;
  }


  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Oota {count} päeva
        </button>
      </div>
      <div className="read-the-docs">
        {generateDivs(count)}
        {holidayState}
      </div>
      <div><span className="read-the-docs">Järgmine tööpäev:</span> <span className="important">{okDate}</span></div>
    </>
  )
}

export default App
