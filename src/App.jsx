import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import './App.css'
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import { et } from 'date-fns/locale/et';
registerLocale('et', et)

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

// https://www.pierrehedkvist.com/posts/react-state-url
function useStateParams(
  initialState, //: T,
  paramsName, //: string,
  serialize, //: (state: T) => string,
  deserialize, //: (state: string) => T
)//: [T, (state: T) => void]
{
  const navigate = useNavigate();
  const search = new URLSearchParams(window.location.search);

  const existingValue = search.get(paramsName);
  const [state, setState] = useState(
    existingValue ? deserialize(existingValue) : initialState
  );

  useEffect(() => {
    // Updates state when user navigates backwards or forwards in browser history
    if (existingValue && deserialize(existingValue) !== state) {
      setState(deserialize(existingValue));
    }
  }, [existingValue]);

  const onChange = (s) => {
    setState(s);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(paramsName, serialize(s));
    const pathname = window.location.pathname;
    navigate(pathname + "?" + searchParams.toString());
  };

  return [state, onChange];
}

//const prefix = !true ? 'https://cors-anywhere.herokuapp.com/' : '';
//const apiUrl = prefix + "https://xn--riigiphad-v9a.ee/en?output=json";
const apiUrl = "pyhad.json";


function App() {
  const [count, setCount] = useStateParams(
    30,
    'skip',
    (s) => s.toString(),
    (s) => (!isNaN(Number(s)) ? Number(s) : 30)
  );
  const [holidays, setHolidays] = useState([]);
  const [holidayState, setHolidayState] = useState("Laen puhkuseid");
  const [startDate, setStartDate] = useState(new Date());
  let okDate = "";

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

  const generateDivs = (startDate, skip) => {
    if (!holidays) return [];
    const newDivs = [];
    let count = 0;
    while (count <= 100) {
      const date = startDate.addDays(skip + count);
      const formatted = date.isoString();
      const row = holidays.find(x => x[0] === formatted) || [];
      const label = row[1] || [0, 6].includes(date.getDay()) && date.toLocaleString('et-EE', { weekday: "long"});
      const local = date.displayString();
      if (!label) {
        okDate = local;
        break;
      }
      newDivs.push(<div key={count}>{label}: {local}</div>);
      count += 1;
    }
    return newDivs;
  }

  const notLoaded = holidays.find(x => x[0] > (startDate.addDays(count + 100).isoString())) ? "" : "Pühade graafik lõpeb varem ära";

  return (
    <>
      <div className="card">
        <label>Alguskuupäev: </label>
        <DatePicker
          locale="et"
          dateFormat="dd.MM.yyyy"
          size="10"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <button onClick={() => setStartDate(startDate.addDays(-1))}>-</button>
        <button onClick={() => setStartDate(startDate.addDays(1))}>+</button>
      </div>
      <div className="card">
        <label>Vahe päevades: </label>
        <input type="number" min="-9999" max="9999" value={count} onChange={e => setCount(e.target.value)}/>
        <button onClick={() => setCount(count - 1)}>-</button>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div className="read-the-docs">
        {generateDivs(startDate, count)}
        {holidayState}
        {notLoaded}
      </div>
      <div><span className="read-the-docs">Järgmine tööpäev:</span> <span className="important">{okDate}</span></div>
    </>
  )
}

export default App
