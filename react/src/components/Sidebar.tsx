import React from 'react';
import './Sidebar.css';
import Thumbnail from './Thumbnail';

interface Props {
  snapshots: string[];
  deleteSnapshot: (i: number) => void;
  saveSnapshot: (i: number) => void;
}

export default function Sidebar({snapshots, deleteSnapshot, saveSnapshot}: Props) {
  return (
    <div className="sidebar">
      {
        snapshots.map((snapshot, i) =>
          <div className="thumbnail-container" key={i}>
            <Thumbnail snapshot={snapshot} i={i} deleteSnapshot={deleteSnapshot} saveSnapshot={saveSnapshot}/>
          </div>
        )

      }
    </div>
  )
}
