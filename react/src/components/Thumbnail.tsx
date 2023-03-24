import React from 'react'

interface Props {
  snapshot: string;
  i: number;
}

export default function Thumbnail({snapshot, i}: Props) {
  return (
    <div>
      <img src={snapshot} alt={i.toString()}></img>
    </div>
  )
}
