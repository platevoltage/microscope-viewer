import React from 'react'
import './Thumbnail.css';

interface Props {
  snapshot: string;
  i: number;
  deleteSnapshot: (i: number) => void;
}

export default function Thumbnail({snapshot, i, deleteSnapshot}: Props) {
  return (
    <>
      <div className="delete" onClick={() => deleteSnapshot(i)}>X</div>
      <img src={snapshot} alt={i.toString()}></img>
    </>
  )
}
