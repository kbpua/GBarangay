import React, { useState } from 'react';

const canned = [
  {q:['barangay clearance','clearance','barangay clearance requirements','clearance requirements'], a:'Barangay Clearance requirements: Valid government ID (e.g., passport, driver\'s license), proof of address (if requested), and a completed application form. Fee: ₱50. Processing: 1-3 business days.'},
  {q:['barangay id','id','barangay id requirements'], a:'Barangay ID requirements: Two recent 2x2 photos, proof of residency, and one valid ID. Fee: ₱50. Processing: 3-5 business days.'},
  {q:['certificate of residency','residency','residency certificate'], a:'Certificate of Residency: Provide a valid ID and proof of address. This certifies you reside in the barangay. Fee: ₱50; Processing: usually 1-2 business days.'},
  {q:['certificate of indigency','indigency','indigency certificate'], a:'Certificate of Indigency: Provide ID and supporting documents showing financial need. This may require an interview with barangay staff. Fee: usually waived or minimal; Processing: 3-7 business days.'},
  {q:['requirements','what do i need','documents needed'], a:'Tell me which document you want (e.g., Barangay Clearance, Barangay ID, Certificate of Residency, Certificate of Indigency) and I\'ll list the requirements.'},
  {q:['fees','fee','cost','price'], a:'Fees vary per LGU. Common prototype fees: Barangay Clearance ₱50, Barangay ID ₱50. The app will show exact fees at request time.'},
  {q:['processing','time','how long'], a:'Processing times vary by document and workload. Typical times: Clearance 1-3 days, ID 3-5 days, Residency 1-2 days, Indigency 3-7 days.'},
  {q:['pickup','pick up','where do i pick up'], a:'Pick-up: When ready, you can collect documents at the Barangay Hall during office hours. The admin may schedule a pick-up time and notify you.'},
  {q:['digital','copy','email','pdf','receipt'], a:'Digital copies: After payment and approval, a PDF receipt and, if applicable, a digital certificate can be sent to your email or accessed in your account.'},
  {q:['hello','hi','hey'], a:'Hello! I can help with document requests (clearance, ID, residency, indigency). Ask for requirements, fees, processing time, or pick-up instructions.'}
];

function matchResponse(text){
  const t = text.toLowerCase();
  for (const item of canned){
    for (const kw of item.q) if (t.includes(kw)) return item.a;
  }
  return "Sorry, I don't have an answer for that in the prototype. Try asking about requirements, fees, or pickup.";
}

export default function Chatbot(){
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{from:'bot', text:'Hi — I am the GBarangay assistant. Ask me about requirements, fees, processing time, or pick-up.'}]);
  const [value, setValue] = useState('');

  function send(){
    if (!value.trim()) return;
    const user = {from:'you', text:value};
    setMessages(m=>[...m, user]);
    const resp = matchResponse(value);
    setTimeout(()=>{
      setMessages(m => [...m, {from:'bot', text:resp}]);
    }, 350);
    setValue('');
  }

  return (
    <div>
      {open && (
        <div className="chat-panel">
          <div className="chat-header">GBarangay Assistant <button className="chat-close" onClick={()=>setOpen(false)}>✕</button></div>
          <div className="chat-body">
            {messages.map((m,i)=>(
              <div key={i} className={"chat-msg "+(m.from==='bot'?'bot':'you')}>{m.text}</div>
            ))}
          </div>
          <div className="chat-input">
            <input value={value} onChange={e=>setValue(e.target.value)} placeholder="Ask about requirements, fees, pickup..." onKeyDown={e=> e.key==='Enter' && send()} />
            <button className="btn small" onClick={send}>Send</button>
          </div>
        </div>
      )}

      <button className="chat-button" onClick={()=>setOpen(o=>!o)} aria-label="Open chat">💬</button>
    </div>
  );
}
