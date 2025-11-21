import React, { useState, useRef, useEffect } from 'react';

export default function OverflowMenu({actions=[]}){
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(()=>{
    function onDoc(e){ if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('click', onDoc);
    return ()=> document.removeEventListener('click', onDoc);
  },[]);

  return (
    <div ref={ref} style={{position:'relative', display:'inline-block'}}>
      <button className="btn-outline small" onClick={()=>setOpen(o=>!o)} aria-label="Actions">⋯</button>
      {open && (
        <div style={{position:'absolute', right:0, top:'110%', background:'#fff', boxShadow:'0 8px 20px rgba(0,0,0,0.12)', borderRadius:8, padding:8, zIndex:60}}>
          {actions.map((a,i)=> (
            <div key={i} style={{padding:'6px 8px', cursor:'pointer'}} onClick={()=>{ setOpen(false); a.onClick && a.onClick(); }}>
              <div style={{fontWeight:700, color: a.danger ? '#b00020' : '#0b67d0'}}>{a.label}</div>
              {a.hint && <div style={{fontSize:12, color:'#666'}}>{a.hint}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
