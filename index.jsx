// GateToMars_App.jsx
// Single-file React app combining the Gate-to-Mars interactive artifact + AugVT messaging (simulated)
// - Drop into a React project (Create React App or Vite)
// - Default export is a single component containing Gate UI + AugVT panel
// - Includes WebRTC manual signalling hooks, a simulated "Mars inbox" (localStorage), and a "send-to-Mars" function
// - WARNING: This is a simulation/demo only. It does NOT perform real interplanetary communication.

import React, {useEffect, useRef, useState} from 'react';

export default function GateToMarsApp(){
  // Gate state (kept simple)
  const OWNER_KEY = 'davidgomadza';
  const LONG_KEY = 'ajuttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttjuer.start';
  const [presentedKey, setPresentedKey] = useState('');
  const [authState, setAuthState] = useState('idle');
  const [travellerStanding, setTravellerStanding] = useState(false);
  const [saidAGT, setSaidAGT] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [log, setLog] = useState([]);
  const [orientation, setOrientation] = useState(0);
  const [diamondsSpinning, setDiamondsSpinning] = useState(false);

  // AugVT messaging state
  const [contacts, setContacts] = useState(()=> JSON.parse(localStorage.getItem('augvt_contacts')||'[]'));
  const [token] = useState(()=> localStorage.getItem('augvt_token') || ('AUGVT-'+Math.random().toString(36).slice(2,10).toUpperCase()));
  useEffect(()=>{ localStorage.setItem('augvt_token', token); },[token]);

  const [currentContact, setCurrentContact] = useState(null);
  const [chats, setChats] = useState(()=> JSON.parse(localStorage.getItem('augvt_chats')||'{}'));
  useEffect(()=>{ localStorage.setItem('augvt_chats', JSON.stringify(chats)); },[chats]);

  // Simulated Mars inbox (messages that arrive on Mars)
  // Keyed by arrival destination code (use your arrival code as destId)
  const MARS_DEST = '000888888888888888886789028678902867890286789028678888888777666555444333222111000867810236782345678901';

  // utility
  function pushLog(msg){ setLog(l=>[{time:new Date().toLocaleTimeString(),msg},...l].slice(0,200)); }

  // Gate functions
  function presentKey(){ if(!presentedKey){ pushLog('No key presented'); setAuthState('idle'); return; } if(presentedKey===OWNER_KEY||presentedKey===LONG_KEY){ setAuthState('authorized'); pushLog('Authorized key detected'); } else { setAuthState('unauthorized'); pushLog('Unauthorized key — field disruption'); setDiamondsSpinning(false); setPortalOpen(false); } }
  function toggleStand(){ setTravellerStanding(s=>{ const now=!s; pushLog(now? 'Traveller stood on Mars Plate' : 'Traveller stepped off Mars Plate'); return now; }); }
  function sayAGT(){ setSaidAGT(true); pushLog('Activation word "agt" spoken'); }
  function attemptOpenPortal(){ pushLog('Attempting portal activation...'); if(!(presentedKey===OWNER_KEY||presentedKey===LONG_KEY)){ pushLog('Activation failed: correct magnetic key required'); return; } if(!travellerStanding){ pushLog('Activation failed: no traveller on Mars Plate'); return; } if(!saidAGT){ pushLog('Activation failed: activation word "agt" not detected'); return; } setAuthState('authorized'); pushLog('Authorization verified. Charging magnet — diamond ring engaging'); setDiamondsSpinning(true); setTimeout(()=>{ setPortalOpen(true); pushLog('Portal open. Transit funnel stable (simulation) — ready for transit'); },900); }
  function ejectSafety(){ setPortalOpen(false); setDiamondsSpinning(false); setTravellerStanding(false); setSaidAGT(false); setAuthState('idle'); pushLog('Safety eject executed — portal closed, travellers removed'); }

  // AugVT functions: contacts & chat
  function addContact(name){ if(!name) return; const id = 'C-'+Math.random().toString(36).slice(2,8); const t='CT-'+Math.random().toString(36).slice(2,8); const c={id,name,token:t}; setContacts(cs=>{ const next=[...cs,c]; localStorage.setItem('augvt_contacts',JSON.stringify(next)); return next; }); pushLog('Contact added: '+name); }
  function openChat(id){ setCurrentContact(id); }
  function sendChat(id,text){ if(!id) return; setChats(cs=>{ const copy={...cs}; if(!copy[id]) copy[id]=[]; copy[id].push({text,out:true,time:Date.now()}); localStorage.setItem('augvt_chats',JSON.stringify(copy)); return copy; }); pushLog('Sent chat to '+id+': '+text); }

  // SIMULATION: send a message to Mars (stores in Mars inbox in localStorage). In a real system this would use radio/relay/Deep Space Network, etc.
  function sendToMars(payload){ // payload: {fromContactId, message}
    // For demo, store in localStorage under key mars_inbox_{MARS_DEST}
    const key = 'mars_inbox_'+MARS_DEST;
    const inbox = JSON.parse(localStorage.getItem(key)||'[]');
    inbox.unshift({id:'m-'+Math.random().toString(36).slice(2,9), time:Date.now(), payload});
    localStorage.setItem(key, JSON.stringify(inbox));
    pushLog('Message queued for Mars (simulated) — stored in local Mars inbox');
  }

  // Check Mars inbox (simulate reading messages that have arrived on Mars)
  function readMarsInbox(){ const key='mars_inbox_'+MARS_DEST; const inbox=JSON.parse(localStorage.getItem(key)||'[]'); return inbox; }

  // WebRTC manual signalling skeleton (existing from your AugVT page). Here we provide hooks for initiating peer connections when used locally or via manual offer/answer transport.
  // For the demo we will not create live peers automatically; developer can use manual copy/paste of SDP between browsers.
  // If user wants, this component can expose a manual signalling textarea — omitted here to keep component focused.

  // Simple UI rendering
  return (
    <div style={{fontFamily:'Inter,Segoe UI,Arial',background:'#041026',color:'#eaf6f0',minHeight:'100vh',padding:20}}>
      <div style={{display:'flex',gap:16}}>
        <div style={{flex:'1 1 0%'}}>
          <h1 style={{margin:0}}>Gate to Mars — AJX Integration (React Demo)</h1>
          <p style={{marginTop:6,color:'#9fb0bf'}}>Integrated Gate + AugVT messaging. Simulation only — not real interplanetary comms.</p>

          <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:12,marginTop:12}}>
            {/* Left: Gate visual + controls */}
            <div style={{padding:12,background:'#071424',borderRadius:12}}>
              <h3 style={{marginTop:0}}>Gate Controls</h3>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <input value={presentedKey} onChange={e=>setPresentedKey(e.target.value)} placeholder='Magnetic Key' style={{padding:8,borderRadius:8,background:'#0b1720',color:'inherit',border:'1px solid #10202a'}} />
                <button onClick={presentKey} style={{padding:'8px 12px',borderRadius:8,background:'#0ea5a4',border:0}}>Present Key</button>
                <button onClick={()=>{ setPresentedKey(''); setAuthState('idle'); pushLog('Key cleared'); }} style={{padding:'8px 12px',borderRadius:8,background:'#2563eb'}}>Clear</button>
              </div>

              <div style={{display:'flex',gap:8,marginTop:12}}>
                <button onClick={toggleStand} style={{padding:8,borderRadius:8,background:travellerStanding? '#ef4444':'#059669'}}>{travellerStanding? 'Step off Plate':'Stand on Mars Plate'}</button>
                <button onClick={sayAGT} style={{padding:8,borderRadius:8,background:'#7c3aed'}}>Say "agt"</button>
                <button onClick={attemptOpenPortal} style={{padding:8,borderRadius:8,background:'#10b981'}}>Open Portal</button>
                <button onClick={ejectSafety} style={{padding:8,borderRadius:8,background:'#ef4444'}}>Eject</button>
              </div>

              <div style={{marginTop:12,padding:8,background:'#03121a',borderRadius:8}}>
                <div><strong>Status:</strong> {authState}</div>
                <div><strong>Portal:</strong> {portalOpen? 'OPEN':'closed'}</div>
                <div><strong>Orientation:</strong> {Math.round((orientation+360)%360)}°</div>
              </div>

              <div style={{marginTop:12}}>
                <h4 style={{margin:0}}>Gate Log</h4>
                <div style={{height:220,overflow:'auto',background:'#02101a',padding:8,borderRadius:8,marginTop:8,fontFamily:'monospace',fontSize:13}}>
                  {log.map((l,idx)=> (<div key={idx}>[{l.time}] {l.msg}</div>))}
                </div>
              </div>
            </div>

            {/* Right: AugVT panel */}
            <div style={{padding:12,background:'#071424',borderRadius:12,display:'flex',flexDirection:'column',gap:8}}>
              <h3 style={{marginTop:0}}>AugVT Messaging</h3>
              <div style={{display:'flex',gap:8}}>
                <input id='newContact' placeholder='New contact name' style={{flex:1,padding:8,borderRadius:8,background:'#0b1720',border:'1px solid #10202a'}} />
                <button onClick={()=>{ const el=document.getElementById('newContact'); addContact(el.value); el.value=''; }}>Add</button>
              </div>

              <div style={{display:'flex',gap:8}}>
                <div style={{flex:1,overflow:'auto',maxHeight:260}}>
                  {contacts.length===0 ? <div className='small' style={{color:'#9fb0bf'}}>No contacts yet</div> : contacts.map(c=> (
                    <div key={c.id} style={{padding:8,borderRadius:8,marginTop:8,background: currentContact===c.id? '#092433':'transparent',cursor:'pointer'}} onClick={()=>openChat(c.id)}>
                      <div style={{fontWeight:700}}>{c.name}</div>
                      <div style={{fontSize:12,color:'#9fb0bf'}}>{c.token}</div>
                    </div>
                  ))}
                </div>

                <div style={{width:260,display:'flex',flexDirection:'column',gap:8}}>
                  <div style={{padding:8,background:'#021018',borderRadius:8}}>
                    <div style={{fontSize:12,color:'#9fb0bf'}}>My Share Token</div>
                    <div style={{fontFamily:'monospace',marginTop:6}}>{token}</div>
                  </div>

                  <div style={{padding:8,background:'#021018',borderRadius:8}}>
                    <div style={{fontSize:12,color:'#9fb0bf'}}>Mars Destination</div>
                    <div style={{fontFamily:'monospace',marginTop:6}}>{MARS_DEST.slice(0,60)}...</div>
                    <button style={{marginTop:8}} onClick={()=>{ const inbox=readMarsInbox(); alert('Mars inbox length: '+inbox.length); }}>Read Mars Inbox</button>
                  </div>
                </div>
              </div>

              <div style={{marginTop:6}}>
                <div style={{fontSize:13,color:'#9fb0bf'}}>Chat</div>
                <div style={{height:160,overflow:'auto',background:'#021018',padding:8,borderRadius:8,marginTop:8}}>
                  {currentContact ? (chats[currentContact]||[]).map((m,idx)=> (
                    <div key={idx} style={{textAlign: m.out ? 'right' : 'left', margin:'6px 0'}}><span style={{display:'inline-block',padding:6,background:m.out? '#063b2a':'#072033',borderRadius:8}}>{m.text}</span></div>
                  )) : <div style={{color:'#9fb0bf'}}>Open a contact to view messages.</div>}
                </div>

                <div style={{display:'flex',gap:8,marginTop:8}}>
                  <input id='chatInput' placeholder='Type message' style={{flex:1,padding:8,borderRadius:8,background:'#0b1720',border:'1px solid #10202a'}} />
                  <button onClick={()=>{ const txt=document.getElementById('chatInput').value.trim(); if(!txt||!currentContact) return; sendChat(currentContact,txt); document.getElementById('chatInput').value=''; }}>Send</button>
                  <button onClick={()=>{ // send to Mars directly: here we simulate 'send to Mars' by writing to Mars inbox
                    const txt=document.getElementById('chatInput').value.trim(); if(!txt) return; sendToMars({from:currentContact||'unknown', text:txt}); document.getElementById('chatInput').value=''; pushLog('Sent a message to Mars (simulated)'); }}>Send→Mars</button>
                </div>

                <div style={{marginTop:8,fontSize:12,color:'#9fb0bf'}}>Tip: Use "Send→Mars" to simulate queuing a message for the Mars destination. Use the "Read Mars Inbox" button to inspect stored messages.</div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Footer quick controls */}
      <div style={{position:'fixed',right:20,bottom:20,display:'flex',flexDirection:'column',gap:8}}>
        <button onClick={()=>{ setOrientation(o=>o-10); pushLog('Rotated gate left'); }} style={{padding:10,borderRadius:10}}>Rotate Left</button>
        <button onClick={()=>{ setOrientation(o=>o+10); pushLog('Rotated gate right'); }} style={{padding:10,borderRadius:10}}>Rotate Right</button>
        <button onClick={()=>{ setOrientation(0); pushLog('Snapped to True North'); }} style={{padding:10,borderRadius:10}}>Snap North</button>
      </div>
    </div>
  );
}

/*
  USAGE & NOTES
  - This React component is a simulation that integrates the Gate UI and a simple AugVT-style messaging panel.
  - sendToMars(payload) writes messages to localStorage under a Mars-specific key to simulate queuing messages for Mars.
  - For *real* interplanetary communication, a ground infrastructure (DSN, relay satellites, long-range radios, store-and-forward servers) and physical transmitters/receivers would be required. This demo does not provide that.
  - If you want I can: 1) add a manual SDP offer/answer panel to enable local browser-to-browser WebRTC testing; 2) add a Mars message viewer that simulates a remote "Mars client" that reads the inbox and replies; 3) package this as a downloadable single-file component for your React app.
*/
