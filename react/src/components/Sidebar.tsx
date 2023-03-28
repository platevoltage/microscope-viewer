import React from 'react';
import './Sidebar.css';
import Thumbnail from './Thumbnail';

interface Props {
  snapshots: string[];
  deleteSnapshot: (i: number) => void;
  saveSnapshot: (i: number) => void;
  snapshotToShow: number;
  setSnapshotToShow: (i: number) => void;
}

export default function Sidebar({snapshots, deleteSnapshot, saveSnapshot, snapshotToShow, setSnapshotToShow}: Props) {
  return (
    <div className="sidebar" onClick={() => {setSnapshotToShow(-1); console.log("close")}}>
      
      {
        snapshots.map((snapshot, i) =>
          <div className="thumbnail-container" key={i}>
            <Thumbnail snapshot={snapshot} i={i} deleteSnapshot={deleteSnapshot} saveSnapshot={saveSnapshot} snapshotToShow={snapshotToShow} setSnapshotToShow={setSnapshotToShow}/>
          </div>
        )
      }

    </div>
  )
}
