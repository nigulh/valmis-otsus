import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
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
    'ootan',
    (s) => s.toString(),
    (s) => (Number(s) !== Number.NaN ? Number(s) : 30)
  );
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
    let count = 0;
    while (count <= 100) {
      const date = new Date().addDays(start + count);
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
      count += 1;
    }
    return newDivs;
  }


  return (
    <>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>
          Ootan {count} päeva
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
