import React from 'react';
import './Sidebar.css';
import Thumbnail from './Thumbnail';

interface Props {
  snapshots: string[];
}

export default function Sidebar({snapshots}: Props) {
  return (
    <div className="sidebar">
      {
        snapshots.map((snapshot, i) =>
          // <img src={snapshot} alt={i.toString()} key={i}></img>
          <div key={i}>
            <Thumbnail snapshot={snapshot} i={i}/>
          </div>
        )

      }
    </div>
  )
}
