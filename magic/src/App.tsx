import { useEffect, useLayoutEffect, useState } from 'react'
import './App.css'
import classNames from 'classnames';
import i0 from './assets/0.svg';
import i1 from './assets/1.svg';
import i2 from './assets/2.svg';
import i3 from './assets/3.svg';
import i4 from './assets/4.svg';
import i5 from './assets/5.svg';
import i6 from './assets/6.svg';
import i7 from './assets/7.svg';
import i8 from './assets/8.svg';
import i9 from './assets/9.svg';
import i10 from './assets/10.svg';
import i11 from './assets/11.svg';
import i12 from './assets/12.svg';
import i13 from './assets/13.svg';
import i16 from './assets/16.svg';
import iB from './assets/B.svg';
import iR from './assets/R.svg';
import iG from './assets/G.svg';
import iW from './assets/W.svg';
import iU from './assets/U.svg';
import iT from './assets/T.svg';
import iC from './assets/C.svg';
import iX from './assets/X.svg';
import {Image} from 'image-js';

// const palette = [0, 35, 70, 105, 140, 175, 210, 245]
const palette = [0, 10, 40, 80, 120, 150, 160, 180, 200, 220, 230, 240, 255]
function closest(n: number, palette: number[]) {
  let m = null
  let mval = null
  for (const opt of palette) {
    const diff = Math.abs(n - opt)
    if (m === null || diff < m) {
      m = diff;
      mval = opt;
    }
  }

  console.log("orig: ", n, "new: ", mval)
  return mval || 0;
}

function App() {
  const [card, setCard] = useState([])
  const [text, setText] = useState('')

  function handleSubmit() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const numAndNames = text.split('\n')
    const newCounts: Record<string, number> = {};
    const deets = numAndNames.map(x => {
      const y = x.split(/ (.*)/s)
      newCounts[y[1]] = Number(y[0])
      return y[1];
    })

    const requestOptions: RequestInit = {
      method: 'POST',
      credentials: 'omit',
      headers: myHeaders,
      body: JSON.stringify({cards: deets})
    };

    fetch("http://localhost:3000/deck", requestOptions)
      .then(response => response.json())
      .then(r => {
        const out = [];
        for (const c of r.cards) {
          for (let i = 0; i < newCounts[c.name]; i++) {
            out.push(c);
          }
        }
        setCard(out);
      });
  }

  const cardsToPrint = card.flatMap(c => 'card_faces' in c ? c.card_faces : [c])

  return (
    <>
      <div className="print:hidden">
        <textarea value={text} onChange={e => setText(e.target.value)} name="" id="" />
        <button onClick={handleSubmit}>Load</button>
        <h1>Deck Builder</h1>
      </div>
      <div className="grid grid-cols-3">
        {cardsToPrint.map((c, i) => {
          return (
            <>
              <Card key={c.name} {...c} />
            </>
          )
        })}
      </div>
    </>
  )
}

function Card(props) {
  const cost = props?.mana_cost?.replaceAll('{', '').replaceAll('}', '').split('') || []
  const [imgData, setImageData] = useState(null);

  useEffect(() => {
    async function inner() {
      let im = await Image.load(props.image_uris.art_crop)
      // console.log("Hello:", im);
      im = im.grey()
      for (let y =0; y < im.height; y++) {
        for (let x =0; x < im.width; x++) {
          const val = im.getPixelXY(x, y)[0];
          const clamped = closest(val, palette)
          const quant_error = val - clamped;
          im.setPixelXY(x, y, [clamped])
          im.setPixelXY(x+1, y, [im.getPixelXY(x+1, y)[0] + quant_error * 7 / 16]);
          im.setPixelXY(x+1, y+1, [im.getPixelXY(x+1, y+1)[0] + quant_error * 3 / 16]);
          im.setPixelXY(x, y+1, [im.getPixelXY(x, y+1)[0] + quant_error * 5 / 16]);
          im.setPixelXY(x-1, y+1, [im.getPixelXY(x-1, y+1)[0] + quant_error * 1 / 16]);
        }
      }
      // console.log("DU: ", im.toDataURL());
      setImageData(im.toDataURL());
    }
    inner();
  }, [props.image_uris.art_crop])

  console.log(props);
  let updatedOracle = props.oracle_text;
  for (const [k, v] of Object.entries(imgMap)) {
    updatedOracle = updatedOracle.replaceAll(`{${k}}`, `<img style="height: 12px" src="${v}" />`)
  }

  return (
    <div className="flex flex-col items-center text-xs border border-solid rounded h-[8.80cm] w-[6.35cm]">
      <div className="flex justify-between p-2 w-full">
        <div className="text-sm text-left font-bold pr-1">{props.name}</div>

        <div className="flex justify-end gap-1">
          {cost.map((pip, i) => <ManaPip key={i} color={pip} />)}
        </div>
      </div>

      {imgData && <img className="h-[4cm] w-full p-2 object-contain" src={imgData} alt="" />}
      <div className="w-full p-2 text-left border-t border-b border-solid border-l-0 border-r-0">{props.type_line}</div>
      <div className="w-full pt-2 px-2 text-left text-xs whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: updatedOracle}}></div>
      {props.power && props.toughness && (
        <div className="w-full font-bold text-sm text-right px-2 mt-auto">
          {props.power} / {props.toughness}
        </div>
      )}
    </div>
  )
}

const imgMap = {
  '0': i0,
  '1': i1,
  '2': i2,
  '3': i3,
  '4': i4,
  '5': i5,
  '6': i6,
  '7': i7,
  '8': i8,
  '9': i9,
  '10': i10,
  '11': i11,
  '12': i12,
  '13': i13,
  '16': i16,
  'U': iU,
  'B': iB,
  'G': iG,
  'R': iR,
  'W': iW,
  'T': iT,
  'C': iC,
  'X': iX,
}

function ManaPip(props) {
  return <img className="h-4 w-4" src={imgMap[props.color]} alt="" />

  // return <div className={classNames("w-4 h-4 rounded-full bg-black border border-solid", cls[props.color] || 'bg-gray-100')}></div>
}

export default App
