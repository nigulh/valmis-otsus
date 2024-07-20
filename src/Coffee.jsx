import React from 'react';
import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

const states = [
  ["Paypal", "Osta mulle kohvi",  "Seda on liiga vähe"],
  ["Gmail", "Saada mulle suur tänu",  "Nii tore!"],
  ["Back", "Tee veel üks otsus",  "Kas keegi mainis kohvi?"],
];

const Coffee = () => {
  const [state, setState] = useState(0);
  const navigate = useNavigate();

  const handleButtonClick = (button) => {
    if (stateType === "Gmail")
    {
      states[state % 3][2] = [
        "Suur tänu!",
        "Minugi poolest!",
        "Teine kordki!",
      ][Math.floor(Math.random() * 3)];
    }
    setState(state + 1);
  };
  let stateType = states[state % 3][0];
  let labelNext = states[state % 3][2];

  return (
    <>
      <div className="card">
        {states[state % 3][1]}
      </div>
      <div className="card">
        <div>
          { stateType === "Paypal" && <button onClick={() => window.location.href = 'https://www.paypal.com/paypalme/nigulh/2'}><img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" border="0" alt="PayPal Logo"/></button>}
          { stateType === "Gmail" && <button onClick={() => window.location.href = 'mailto:hendrik.nigul+otsus@gmail.com?subject=Tagasiside'}>✉️ E-postiga</button>}
          <button onClick={() => handleButtonClick()}>{labelNext}</button>
          { stateType === "Back" && <button onClick={() => navigate(-1)}><span className="important">𐄷</span> Valmis otsus</button> }
        </div>
      </div>
    </>
  );
};

export default Coffee;