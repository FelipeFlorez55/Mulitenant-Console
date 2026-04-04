import { useState, useEffect, createContext, useContext } from "react";

const C = {
  bg: "#f8f9fa", sidebar: "#1e293b", sidebarHover: "#334155", sidebarActive: "#3b82f6",
  card: "#fff", border: "#e2e8f0", text: "#1e293b", muted: "#64748b",
  pri: "#3b82f6", ok: "#22c55e", warn: "#f59e0b", err: "#ef4444",
  purp: "#8b5cf6", ph: "#f1f5f9", inBg: "#f8fafc"
};

const ThemeCtx = createContext({ pc: C.pri, sc: C.sidebar, setPc:()=>{}, setSc:()=>{} });
function useC() { const { pc, sc } = useContext(ThemeCtx); return { ...C, pri: pc, sidebar: sc, sidebarActive: pc }; }
const isLightColor = (hex) => { if(!hex||hex.length<7) return false; const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return (r*299+g*587+b*114)/1000>150; };

function useM() {
  const [m, s] = useState(window.innerWidth < 700);
  useEffect(() => {
    const h = () => s(window.innerWidth < 700);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}

function Bd({ color, children }) {
  const C = useC();
  const c = color || C.pri;
  return <span style={{ background: c + "20", color: c, padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{children}</span>;
}

function Cd({ title, children, style = {} }) {
  return (
    <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 8, padding: 16, ...style }}>
      {title && <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: C.text }}>{title}</div>}
      {children}
    </div>
  );
}

function Inp({ label, placeholder = "", note }) {
  const C = useC();
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: C.muted, display: "block", marginBottom: 4 }}>{label}</label>
      <div style={{ background: C.inBg, border: "1px solid " + C.border, borderRadius: 6, padding: "8px 12px", fontSize: 13, color: C.muted }}>{placeholder || label}</div>
      {note && <div style={{ fontSize: 11, color: C.pri, marginTop: 3 }}>{note}</div>}
    </div>
  );
}

function Bt({ children, variant = "primary", size = "md", style = {}, onClick }) {
  const C = useC();
  const base = { border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 };
  const sz = { sm: { padding: "4px 10px", fontSize: 11 }, md: { padding: "8px 16px", fontSize: 13 }, lg: { padding: "10px 20px", fontSize: 14 } };
  const vr = {
    primary: { background: C.pri, color: "#fff" },
    outline: { background: "transparent", color: C.pri, border: "1px solid " + C.pri },
    danger: { background: C.err, color: "#fff" },
    ghost: { background: "transparent", color: C.muted },
    success: { background: C.ok, color: "#fff" },
    warn: { background: C.warn, color: "#fff" },
  };
  return <button onClick={onClick} style={{ ...base, ...sz[size], ...vr[variant] || vr.primary, ...style }}>{children}</button>;
}

function Tb({ headers, rows, style = {} }) {
  return (
    <div style={{ overflowX: "auto", ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 400 }}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid " + C.border, color: C.muted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => <tr key={i} style={{ borderBottom: "1px solid " + C.border }}>{r.map((c, j) => <td key={j} style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

function PB({ value, max, label, color, showPct = false }) {
  const C = useC(); color = color || C.pri;
  const p = max === -1 ? 10 : Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: C.text, fontWeight: 500 }}>{label}</span>
        <span style={{ color: C.muted }}>{showPct ? Math.round(p) + "%" : value + "/" + max}</span>
      </div>
      <div style={{ background: C.ph, borderRadius: 4, height: 8 }}>
        <div style={{ background: p > 80 ? C.warn : color, width: p + "%", height: "100%", borderRadius: 4 }} />
      </div>
    </div>
  );
}

function SC2({ label, value, sub, color, trend }) {
  const C = useC(); color = color || C.pri;
  return (
    <Cd style={{ textAlign: "center", flex: 1, minWidth: 90 }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, margin: "4px 0" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: trend === "up" ? C.ok : trend === "down" ? C.err : C.muted }}>{trend === "up" ? "↑ " : trend === "down" ? "↓ " : ""}{sub}</div>}
    </Cd>
  );
}

function Modal({ show, onClose, title, width = 480, children }) {
  const mob = useM();
  if (!show) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: mob ? 16 : 24, width: mob ? "100%" : width, maxWidth: "95vw", maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
          <div onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: C.ph, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: C.muted }}>✕</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function Alert({ type = "info", children }) {
  const C = useC();
  const cfg = { info: { color: C.pri, icon: "ℹ️" }, warn: { color: C.warn, icon: "⚠️" }, ok: { color: C.ok, icon: "✅" }, err: { color: C.err, icon: "❌" } };
  const { color, icon } = cfg[type];
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "10px 12px", borderRadius: 8, background: color + "10", border: "1px solid " + color + "30", marginBottom: 12 }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
      <div style={{ fontSize: 12, color, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

function SectionHeader({ title, sub, prd }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
        {prd && <Bd color={C.muted}>{prd}</Bd>}
      </div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ data, color, height = 40 }) {
  const C = useC(); color = color || C.pri;
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, background: i === data.length - 1 ? color : color + "50", borderRadius: "2px 2px 0 0", height: (v / max * height) + "px" }} />
      ))}
    </div>
  );
}

function SI({ steps, current, mobile }) {
  const C = useC();
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 24, overflowX: mobile ? "auto" : "visible" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: mobile ? 60 : "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: i < current ? C.ok : i === current ? C.pri : C.border, color: i <= current ? "#fff" : C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{i < current ? "✓" : i + 1}</div>
            <div style={{ fontSize: mobile ? 8 : 10, color: i <= current ? C.pri : C.muted, marginTop: 4, textAlign: "center", maxWidth: 80 }}>{s}</div>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < current ? C.ok : C.border, margin: "0 4px", marginBottom: 18, minWidth: 10 }} />}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// TENANT SCREENS (compactas, sin cambios)
// ─────────────────────────────────────────────
function LoginScreen() {
  const m = useM();
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100%", background:C.bg, padding: m?12:20 }}>
      <Cd style={{ width:m?"100%":380, textAlign:"center", padding:m?20:32 }}>
        <div style={{ width:56, height:56, borderRadius:12, background:C.ph, margin:"0 auto 8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:C.muted }}>Logo</div>
        <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>Iniciar sesión</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Ingresa a tu espacio</div>
        <Inp label="Email" placeholder="usuario@empresa.com" />
        <Inp label="Contraseña" placeholder="••••••••" />
        <Bt variant="primary" size="lg" style={{ width:"100%", justifyContent:"center", marginTop:8 }}>Iniciar sesión</Bt>
      </Cd>
    </div>
  );
}

function RegisterScreen() {
  const m = useM();
  const [step, setStep] = useState(0);
  const [sub, setSub] = useState(false);
  const steps = ["Subdominio","Empresa","Contacto","Plan"];
  const nx = () => { if (step<3) setStep(step+1); else setSub(true); };
  const pv = () => { if (step>0) setStep(step-1); };
  if (sub) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100%", background:C.bg, padding:20 }}>
      <Cd style={{ width:m?"100%":520, padding:40, textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:8 }}>📧</div>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>¡Solicitud enviada!</div>
        <div style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Revisa <strong>juan@empresa.com</strong></div>
        <div style={{ background:C.pri+"10", borderRadius:8, padding:12, marginBottom:20 }}><div style={{ fontSize:16, fontWeight:700, color:C.pri, fontFamily:"monospace" }}>REQ-2026-0417</div></div>
        <Bt variant="outline" onClick={()=>{setSub(false);setStep(0);}}>← Volver</Bt>
      </Cd>
    </div>
  );
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"center", minHeight:"100%", background:C.bg, padding:m?8:20 }}>
      <Cd style={{ width:m?"100%":580, padding:m?16:32 }}>
        <div style={{ textAlign:"center", marginBottom:20 }}><div style={{ fontSize:20, fontWeight:700 }}>Crea tu espacio</div></div>
        <SI steps={steps} current={step} mobile={m} />
        {step===0&&<Cd title="Subdominio" style={{background:C.inBg}}><div style={{display:"flex",alignItems:"center",border:"1px solid "+C.border,borderRadius:6,overflow:"hidden",marginBottom:6}}><div style={{padding:"10px 14px",fontSize:14,color:C.text,background:"#fff",flex:1,fontWeight:500}}>mi-empresa</div><div style={{padding:"10px 14px",fontSize:13,color:C.muted,background:C.ph,borderLeft:"1px solid "+C.border}}>.plataforma.com</div></div><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:C.ok}}/><span style={{fontSize:11,color:C.ok}}>✓ Disponible</span></div></Cd>}
        {step===1&&<Cd title="Empresa" style={{background:C.inBg}}><div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:12}}><Inp label="Razón social *" placeholder="Empresa S.A.S."/><Inp label="NIT *" placeholder="900.123.456-7"/></div><Inp label="Dirección *" placeholder="Cra 7 #45-12"/><div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:12}}><Inp label="Ciudad *" placeholder="Bogotá"/><Inp label="Sector *" placeholder="Seleccionar..."/></div></Cd>}
        {step===2&&<Cd title="Contacto" style={{background:C.inBg}}><div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:12}}><Inp label="Nombre *" placeholder="Juan Pérez"/><Inp label="Cargo *" placeholder="Director"/></div><Inp label="Email *" placeholder="juan@empresa.com" note="⚠ Credenciales aquí"/><Inp label="Celular *" placeholder="+57 300 123 4567"/></Cd>}
        {step===3&&<div><Cd title="Plan" style={{background:C.inBg,marginBottom:16}}><div style={{display:"flex",gap:8,flexDirection:m?"column":"row"}}>{[{n:"Starter",p:"$180"},{n:"Professional",p:"$580"},{n:"Enterprise",p:"$1,850+"}].map((pl,i)=><div key={pl.n} style={{flex:1,border:"2px solid "+(i===1?C.pri:C.border),borderRadius:8,padding:12,background:i===1?C.pri+"06":"#fff",textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color:i===1?C.pri:C.text}}>{pl.n}</div><div style={{fontSize:20,fontWeight:700,color:C.pri}}>{pl.p}</div><div style={{fontSize:10,color:C.muted}}>USD/mes</div></div>)}</div></Cd><Cd title="Términos" style={{background:C.inBg}}><div style={{display:"flex",alignItems:"center",gap:8}}><input type="checkbox" defaultChecked style={{width:16,height:16}}/><span style={{fontSize:12}}>Acepto TOS y Ley 1581</span></div></Cd></div>}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:20,flexWrap:"wrap",gap:8}}>
          <div>{step>0&&<Bt variant="ghost" onClick={pv}>← Anterior</Bt>}</div>
          <Bt variant="primary" onClick={nx}>{step<3?"Siguiente →":"Enviar →"}</Bt>
        </div>
      </Cd>
    </div>
  );
}

function OnboardingScreen() {
  const m = useM();
  const [step, setStep] = useState(0);
  const [pc, setPc] = useState("#3B82F6");
  const [sc, setSc] = useState("#1E40AF");
  const [logo, setLogo] = useState(null);
  const [showLogo, setShowLogo] = useState(false);
  const [pt, setPt] = useState(0);
  const steps = ["Verificar","Config","Branding","¡Listo!"];
  const nx = () => { if (step < 3) setStep(step + 1); };
  const pv = () => { if (step > 0) setStep(step - 1); };

  function LS({ size = 20, forL }) {
    const s = forL ? Math.max(size, 44) : size;
    if (logo === "epm") return <div style={{ width:s, height:s, borderRadius:forL?8:4, background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", margin:forL?"0 auto 6px":0 }}><span style={{ fontSize:s*0.35, fontWeight:800, color:"#5CB85C" }}>epm</span></div>;
    if (logo === "argos") return <div style={{ width:s, height:s, borderRadius:forL?8:4, background:"#f5f5f0", display:"flex", alignItems:"center", justifyContent:"center", margin:forL?"0 auto 6px":0 }}><span style={{ fontSize:s*0.18, fontWeight:800, color:"#1B3A6B" }}>ARGOS</span></div>;
    return <div style={{ width:s, height:s, borderRadius:forL?8:4, background:pc+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:s*0.22, color:pc, fontWeight:600, border:"1.5px solid "+pc+"30", margin:forL?"0 auto 6px":0 }}>Logo</div>;
  }

  const isLight = (hex) => { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return (r*299+g*587+b*114)/1000>150; };
  const sideText = isLight(sc) ? "#1E293B" : "#fff";
  const tabs = ["Login","Dashboard","Componentes","Formularios","Feedback","Tablas","Navegación","Charts"];
  const themes = [
    { n:"Corporativo", p:"#3B82F6", s:"#1E40AF", b:"#1E293B" },
    { n:"Claro",       p:"#6366F1", s:"#F8FAFC", b:"#F1F5F9" },
    { n:"Oscuro",      p:"#A78BFA", s:"#0F172A", b:"#0F172A" },
    { n:"Natural",     p:"#22C55E", s:"#14532D", b:"#14532D" },
    { n:"Natural Claro", p:"#22C55E", s:"#F8FAFC", b:"#F1F5F9" },
    { n:"Sunset",      p:"#F59E0B", s:"#9A3412", b:"#7C2D12" },
    { n:"Elegante",    p:"#3B82F6", s:"#1E293B", b:"#1E293B" },
    { n:"Océano",      p:"#06B6D4", s:"#164E63", b:"#0C4A6E" },
  ];

  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"center", minHeight:"100%", background:C.bg, padding:m?8:20 }}>
      <Cd style={{ width:m?"100%":680, padding:m?16:32 }}>
        <div style={{ textAlign:"center", marginBottom:8 }}><div style={{ fontSize:m?18:20, fontWeight:700 }}>Configura tu espacio</div></div>
        <SI steps={steps} current={step} mobile={m} />

        {/* ── PASO 0: Verificar ── */}
        {step===0 && (
          <div>
            <Cd title="Datos empresa" style={{ background:C.inBg, marginBottom:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12 }}>
                <Inp label="Razón social" placeholder="Empresa S.A.S." />
                <Inp label="NIT" placeholder="900.123.456-7" />
              </div>
              <Inp label="Dirección" placeholder="Bogotá" />
            </Cd>
            <Cd title="Contacto" style={{ background:C.inBg }}>
              <Inp label="Nombre" placeholder="Juan Pérez" />
              <Inp label="Email" placeholder="juan@empresa.com" note="🔒 No editable" />
            </Cd>
          </div>
        )}

        {/* ── PASO 1: Config ── */}
        {step===1 && (
          <div>
            <Cd title="Regional" style={{ background:C.inBg, marginBottom:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12 }}>
                <Inp label="Zona horaria" placeholder="América/Bogotá" />
                <Inp label="Moneda" placeholder="COP" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12 }}>
                <Inp label="Idioma" placeholder="Español" />
                <Inp label="Retención" placeholder="10 años" />
              </div>
            </Cd>
            <div style={{ border:"2px dashed "+C.pri+"30", borderRadius:8, padding:16, textAlign:"center", background:C.pri+"04" }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.pri }}>Pasos del dominio (Capa 2)</div>
            </div>
          </div>
        )}

        {/* ── PASO 2: Branding ── */}
        {step===2 && (
          <div>
            {/* Logo */}
            <Cd title="Logo" style={{ background:C.inBg, marginBottom:12 }}>
              <div onClick={()=>{ if(!logo) setShowLogo(true); }} style={{ border:"2px dashed "+C.border, borderRadius:8, padding:logo?12:20, textAlign:"center", background:"#fff", cursor:logo?"default":"pointer" }}>
                {logo ? (
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <LS size={56} />
                    <div style={{ textAlign:"left", flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600 }}>{logo==="epm"?"EPM":"Argos"}</div>
                      <div style={{ fontSize:10, color:C.pri, cursor:"pointer" }} onClick={e=>{e.stopPropagation();setShowLogo(true);}}>Cambiar</div>
                    </div>
                    <div onClick={e=>{e.stopPropagation();setLogo(null);}} style={{ padding:"4px 10px", borderRadius:6, border:"1px solid "+C.err, color:C.err, fontSize:11, cursor:"pointer" }}>✕</div>
                  </div>
                ) : (
                  <div><div style={{ fontSize:32 }}>📁</div><div style={{ fontSize:13, fontWeight:600 }}>Clic para subir logo</div></div>
                )}
              </div>
              <Modal show={showLogo} onClose={()=>setShowLogo(false)} title="Seleccionar logo">
                <div style={{ display:"flex", gap:12, marginBottom:12 }}>
                  {[{id:"epm",bg:"#1a1a1a",label:"EPM"},{id:"argos",bg:"#f5f5f0",label:"Argos"}].map(o=>(
                    <div key={o.id} onClick={()=>{setLogo(o.id);setShowLogo(false);}} style={{ flex:1, border:"2px solid "+(logo===o.id?C.pri:C.border), borderRadius:8, overflow:"hidden", cursor:"pointer" }}>
                      <div style={{ background:o.bg, padding:20, textAlign:"center" }}>{o.id==="epm"?<span style={{ fontSize:28, fontWeight:800, color:"#5CB85C" }}>epm</span>:<span style={{ fontSize:24, fontWeight:800, color:"#1B3A6B" }}>ARGOS</span>}</div>
                      <div style={{ padding:8, textAlign:"center", fontSize:13, fontWeight:600 }}>{o.label}</div>
                    </div>
                  ))}
                </div>
                {logo && <div onClick={()=>{setLogo(null);setShowLogo(false);}} style={{ border:"1px solid "+C.border, borderRadius:6, padding:"8px 12px", textAlign:"center", cursor:"pointer", fontSize:12, color:C.muted }}>🚫 Quitar logo</div>}
              </Modal>
            </Cd>

            {/* Temas */}
            <Cd title="Temas predefinidos" style={{ background:C.inBg, marginBottom:12 }}>
              <div style={{ display:"grid", gridTemplateColumns:m?"repeat(4,1fr)":"repeat(7,1fr)", gap:6 }}>
                {themes.map(t=>{
                  const active = pc===t.p && sc===t.s;
                  return (
                    <div key={t.n} onClick={()=>{setPc(t.p);setSc(t.s);}} style={{ cursor:"pointer", borderRadius:8, border:"2px solid "+(active?t.p:C.border), overflow:"hidden", transform:active?"scale(1.05)":"scale(1)", transition:"transform .15s" }}>
                      <div style={{ background:t.b, padding:"8px 4px 4px", textAlign:"center" }}>
                        <div style={{ background:"#fff", borderRadius:4, padding:"4px 3px", margin:"0 auto" }}>
                          <div style={{ width:12, height:12, borderRadius:3, background:t.p+"25", margin:"0 auto 2px", border:"1.5px solid "+t.p }} />
                          <div style={{ height:6, background:t.p, borderRadius:2 }} />
                        </div>
                      </div>
                      <div style={{ padding:"4px 2px", textAlign:"center", background:"#fff" }}>
                        <div style={{ fontSize:m?8:9, fontWeight:600 }}>{t.n}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Cd>

            {/* Colores */}
            <Cd title="Colores personalizados" style={{ background:C.inBg, marginBottom:12 }}>
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:16 }}>
                <div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>Color primario</div>
                  <div style={{ display:"flex", gap:5, marginBottom:8, flexWrap:"wrap" }}>
                    {["#3B82F6","#22C55E","#8B5CF6","#EF4444","#F59E0B","#06B6D4","#EC4899"].map(c=>(
                      <div key={c} onClick={()=>setPc(c)} style={{ width:28, height:28, borderRadius:6, background:c, border:c===pc?"3px solid #1e293b":"2px solid #fff", cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,.15)" }} />
                    ))}
                  </div>
                  <div style={{ background:"#fff", border:"1px solid "+C.border, borderRadius:6, padding:"4px 8px", display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:20, height:20, borderRadius:4, background:pc, flexShrink:0 }} />
                    <input value={pc} onChange={e=>{const v=e.target.value;if(v.match(/^#?[0-9A-Fa-f]{0,6}$/))setPc(v.startsWith("#")?v:"#"+v);}} style={{ border:"none", outline:"none", fontFamily:"monospace", fontSize:13, width:"100%", background:"transparent" }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>Color secundario / Sidebar</div>
                  <div style={{ display:"flex", gap:5, marginBottom:8, flexWrap:"wrap" }}>
                    {["#1E40AF","#14532D","#4C1D95","#1E293B","#164E63","#0F172A","#7C2D12"].map(c=>(
                      <div key={c} onClick={()=>setSc(c)} style={{ width:28, height:28, borderRadius:6, background:c, border:c===sc?"3px solid #94a3b8":"2px solid #fff", cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,.15)" }} />
                    ))}
                  </div>
                  <div style={{ background:"#fff", border:"1px solid "+C.border, borderRadius:6, padding:"4px 8px", display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:20, height:20, borderRadius:4, background:sc, flexShrink:0 }} />
                    <input value={sc} onChange={e=>{const v=e.target.value;if(v.match(/^#?[0-9A-Fa-f]{0,6}$/))setSc(v.startsWith("#")?v:"#"+v);}} style={{ border:"none", outline:"none", fontFamily:"monospace", fontSize:13, width:"100%", background:"transparent" }} />
                  </div>
                </div>
              </div>
            </Cd>

            {/* Preview tabs */}
            <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>Preview en vivo</div>
            <div style={{ display:"flex", background:"#fff", borderRadius:"8px 8px 0 0", border:"1px solid "+C.border, borderBottom:"none", overflowX:"auto" }}>
              {tabs.map((t,i)=>(
                <div key={t} onClick={()=>setPt(i)} style={{ padding:"8px 10px", fontSize:m?9:11, fontWeight:pt===i?700:400, color:pt===i?pc:C.muted, borderBottom:"2px solid "+(pt===i?pc:"transparent"), cursor:"pointer", whiteSpace:"nowrap" }}>{t}</div>
              ))}
            </div>
            <div style={{ border:"1px solid "+C.border, borderRadius:"0 0 8px 8px", background:"#fff", padding:12, minHeight:220 }}>

              {/* TAB 0 — Login */}
              {pt===0 && (
                <div style={{ background:sc, borderRadius:8, padding:16 }}>
                  <div style={{ background:"#fff", borderRadius:10, padding:16, maxWidth:220, margin:"0 auto", textAlign:"center" }}>
                    <LS size={44} forL />
                    <div style={{ fontSize:12, fontWeight:700, marginBottom:8, color:sc }}>Iniciar sesión</div>
                    <div style={{ background:C.inBg, border:"1px solid "+C.border, borderRadius:4, padding:"4px 6px", fontSize:9, color:C.muted, marginBottom:4, textAlign:"left" }}>usuario@empresa.com</div>
                    <div style={{ background:C.inBg, border:"1px solid "+C.border, borderRadius:4, padding:"4px 6px", fontSize:9, color:C.muted, marginBottom:8, textAlign:"left" }}>••••••••</div>
                    <div style={{ background:pc, color:"#fff", borderRadius:4, padding:"5px 0", fontSize:10, fontWeight:600 }}>Iniciar sesión</div>
                  </div>
                </div>
              )}

              {/* TAB 1 — Dashboard */}
              {pt===1 && (
                <div style={{ display:"flex", height:280, borderRadius:8, overflow:"hidden", border:"1px solid "+C.border }}>
                  <div style={{ width:110, background:sc, padding:"8px 4px", display:"flex", flexDirection:"column", gap:2, flexShrink:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 6px", marginBottom:4 }}>
                      <LS size={18} /><div style={{ color:sideText, fontSize:8, fontWeight:600 }}>Mi Empresa</div>
                    </div>
                    {[["📊","Dashboard",true],["👥","Usuarios",false],["📋","Auditoría",false],["🔔","Notif.",false],["💎","Plan",false]].map(it=>(
                      <div key={it[1]} style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 6px", borderRadius:4, background:it[2]?pc:"transparent", fontSize:8, color:it[2]?"#fff":(isLight(sc)?"#64748B":"#94a3b8") }}><span>{it[0]}</span>{it[1]}</div>
                    ))}
                  </div>
                  <div style={{ flex:1, background:C.bg, padding:8, overflow:"auto" }}>
                    <div style={{ display:"flex", gap:4, marginBottom:6 }}>
                      {[["Usuarios","3",pc],["Storage","0.1",C.ok],["Plan","Starter",C.purp]].map(it=>(
                        <div key={it[0]} style={{ flex:1, background:"#fff", borderRadius:4, padding:"4px 2px", textAlign:"center", border:"1px solid "+C.border }}>
                          <div style={{ fontSize:6, color:C.muted, textTransform:"uppercase" }}>{it[0]}</div>
                          <div style={{ fontSize:11, fontWeight:700, color:it[2] }}>{it[1]}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background:"#fff", borderRadius:4, padding:6, border:"1px solid "+C.border, marginBottom:4 }}>
                      <div style={{ fontSize:7, fontWeight:600, marginBottom:3 }}>Botones</div>
                      <div style={{ display:"flex", gap:3, flexWrap:"wrap", marginBottom:3 }}>
                        <div style={{ background:pc, color:"#fff", padding:"2px 6px", borderRadius:3, fontSize:7, fontWeight:600 }}>Primario</div>
                        <div style={{ color:pc, padding:"2px 6px", borderRadius:3, fontSize:7, fontWeight:600, border:"1px solid "+pc }}>Outline</div>
                        <div style={{ background:C.err, color:"#fff", padding:"2px 6px", borderRadius:3, fontSize:7, fontWeight:600 }}>Danger</div>
                      </div>
                    </div>
                    <div style={{ background:"#fff", borderRadius:4, padding:6, border:"1px solid "+C.border }}>
                      <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                        {[["ACTIVE",pc],["OK",C.ok],["PENDING",C.warn],["ERROR",C.err]].map(it=>(
                          <span key={it[0]} style={{ background:it[1]+"20", color:it[1], padding:"1px 5px", borderRadius:9999, fontSize:7, fontWeight:600 }}>{it[0]}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2 — Componentes */}
              {pt===2 && (
                <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:10 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {/* Toggles */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Toggles</div>
                      {[["Notificaciones email",true],["SMS",false],["Dark mode",true]].map(it=>(
                        <div key={it[0]} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                          <span style={{ fontSize:9 }}>{it[0]}</span>
                          <div style={{ width:26, height:14, borderRadius:7, background:it[1]?pc:C.border, position:"relative", flexShrink:0 }}>
                            <div style={{ width:10, height:10, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:it[1]?14:2, boxShadow:"0 1px 2px rgba(0,0,0,.2)" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Radio buttons */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Radio buttons</div>
                      {[["Administrador",true],["Operador",false],["Visor",false]].map(it=>(
                        <div key={it[0]} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                          <div style={{ width:14, height:14, borderRadius:"50%", border:"2px solid "+(it[1]?pc:C.border), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            {it[1]&&<div style={{ width:6, height:6, borderRadius:"50%", background:pc }} />}
                          </div>
                          <span style={{ fontSize:9, color:it[1]?pc:C.text, fontWeight:it[1]?600:400 }}>{it[0]}</span>
                        </div>
                      ))}
                    </div>
                    {/* Chips seleccionables */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Chips / Tags</div>
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                        {[["Res. 631",true],["Res. 2254",true],["Res. 627",false],["Res. 909",false],["ANLA",true]].map(it=>(
                          <div key={it[0]} style={{ padding:"2px 8px", borderRadius:9999, fontSize:8, fontWeight:600, background:it[1]?pc:C.ph, color:it[1]?"#fff":C.muted, border:"1px solid "+(it[1]?pc:C.border), cursor:"pointer" }}>{it[0]}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {/* Slider */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Slider / Range</div>
                      {[["Límite pH","65%"],["Temperatura","40%"],["Caudal","82%"]].map(it=>(
                        <div key={it[0]} style={{ marginBottom:8 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:8, marginBottom:3 }}>
                            <span style={{ color:C.muted }}>{it[0]}</span><span style={{ color:pc, fontWeight:600 }}>{it[1]}</span>
                          </div>
                          <div style={{ background:C.ph, borderRadius:4, height:6, position:"relative" }}>
                            <div style={{ background:pc, width:it[1], height:"100%", borderRadius:4 }} />
                            <div style={{ width:12, height:12, borderRadius:"50%", background:pc, border:"2px solid #fff", position:"absolute", top:-3, left:it[1], marginLeft:-6, boxShadow:"0 1px 3px rgba(0,0,0,.2)" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* File upload */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>File upload</div>
                      <div style={{ border:"2px dashed "+pc+"50", borderRadius:6, padding:"10px 6px", textAlign:"center", background:pc+"05" }}>
                        <div style={{ fontSize:16, marginBottom:2 }}>📎</div>
                        <div style={{ fontSize:8, fontWeight:600, color:pc }}>Arrastra o clic</div>
                        <div style={{ fontSize:7, color:C.muted }}>PDF, XLSX · Máx 10MB</div>
                      </div>
                      <div style={{ marginTop:4, display:"flex", gap:4, alignItems:"center", background:"#fff", border:"1px solid "+C.border, borderRadius:4, padding:"3px 6px" }}>
                        <span style={{ fontSize:10 }}>📄</span>
                        <span style={{ fontSize:8, flex:1 }}>reporte_q1.pdf</span>
                        <div style={{ width:30, height:4, background:C.ph, borderRadius:2, overflow:"hidden" }}><div style={{ width:"70%", height:"100%", background:pc }} /></div>
                        <span style={{ fontSize:7, color:C.muted }}>70%</span>
                      </div>
                    </div>
                    {/* Dropdown */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Dropdown</div>
                      <div style={{ background:"#fff", border:"1px solid "+pc, borderRadius:4, overflow:"hidden" }}>
                        {["ANLA","CAR Cundinamarca","Cornare"].map((o,i)=>(
                          <div key={o} style={{ padding:"3px 6px", fontSize:8, background:i===0?pc+"15":"#fff", color:i===0?pc:C.text, fontWeight:i===0?600:400, borderLeft:i===0?"2px solid "+pc:"2px solid transparent" }}>{i===0?"✓ ":""}{o}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3 — Formularios */}
              {pt===3 && (
                <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:10 }}>
                  <div>
                    <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Estados de input</div>
                    {[
                      { l:"Normal",   b:C.border, bg:C.inBg },
                      { l:"Focus",    b:pc,       bg:"#fff", sh:"0 0 0 3px "+pc+"20" },
                      { l:"Error",    b:C.err,    bg:"#fff", note:"Campo obligatorio" },
                      { l:"Disabled", b:C.border, bg:C.ph,  op:0.5 },
                    ].map((s,i)=>(
                      <div key={i} style={{ marginBottom:6, opacity:s.op||1 }}>
                        <div style={{ fontSize:7, color:C.muted, marginBottom:2 }}>{s.l}</div>
                        <div style={{ background:s.bg, border:"1.5px solid "+s.b, borderRadius:5, padding:"4px 8px", fontSize:9, boxShadow:s.sh||"none" }}>{s.op?"Deshabilitado":"Texto ejemplo"}</div>
                        {s.note&&<div style={{ fontSize:7, color:C.err, marginTop:1 }}>{s.note}</div>}
                      </div>
                    ))}
                    {/* Select estilizado */}
                    <div style={{ fontSize:9, fontWeight:600, margin:"8px 0 4px" }}>Select</div>
                    <div style={{ background:"#fff", border:"1.5px solid "+C.border, borderRadius:5, padding:"4px 8px", fontSize:9, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span>Resolución 631</span><span style={{ color:C.muted, fontSize:8 }}>▾</span>
                    </div>
                    {/* Textarea */}
                    <div style={{ fontSize:9, fontWeight:600, margin:"8px 0 4px" }}>Textarea</div>
                    <div style={{ background:C.inBg, border:"1.5px solid "+C.border, borderRadius:5, padding:"4px 8px", fontSize:8, color:C.muted, minHeight:36, lineHeight:1.5 }}>Observaciones del muestreo...</div>
                  </div>
                  <div>
                    {/* Campos con prefijo/sufijo */}
                    <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Prefijo / Sufijo</div>
                    {[
                      { pre:"pH", val:"6.8",    suf:"" },
                      { pre:"",   val:"12,500",  suf:"mg/L" },
                      { pre:"$",  val:"580",     suf:"USD/mes" },
                      { pre:"",   val:"25.4",    suf:"°C" },
                    ].map((f,i)=>(
                      <div key={i} style={{ display:"flex", marginBottom:5, border:"1.5px solid "+C.border, borderRadius:5, overflow:"hidden", fontSize:9 }}>
                        {f.pre&&<div style={{ background:C.ph, padding:"3px 6px", color:C.muted, borderRight:"1px solid "+C.border, fontWeight:600, display:"flex", alignItems:"center" }}>{f.pre}</div>}
                        <div style={{ background:"#fff", padding:"3px 8px", flex:1, color:C.text }}>{f.val}</div>
                        {f.suf&&<div style={{ background:pc+"15", padding:"3px 6px", color:pc, borderLeft:"1px solid "+C.border, fontWeight:600, display:"flex", alignItems:"center", fontSize:8 }}>{f.suf}</div>}
                      </div>
                    ))}
                    {/* Search con resultados */}
                    <div style={{ fontSize:9, fontWeight:600, margin:"8px 0 4px" }}>Search + dropdown</div>
                    <div style={{ position:"relative" }}>
                      <div style={{ background:"#fff", border:"1.5px solid "+pc, borderRadius:"5px 5px 0 0", padding:"4px 8px", fontSize:9, display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ color:C.muted }}>🔍</span><span>vertim</span>
                      </div>
                      <div style={{ border:"1px solid "+C.border, borderRadius:"0 0 5px 5px", background:"#fff", borderTop:"none" }}>
                        {["Vertimientos Q1 2026","Vertimientos Q4 2025"].map((r,i)=>(
                          <div key={i} style={{ padding:"3px 8px", fontSize:8, background:i===0?pc+"10":"#fff", color:i===0?pc:C.text, borderBottom:i===0?"1px solid "+C.border:"none" }}>{r}</div>
                        ))}
                      </div>
                    </div>
                    {/* Date picker activo */}
                    <div style={{ fontSize:9, fontWeight:600, margin:"8px 0 4px" }}>Date picker</div>
                    <div style={{ background:"#fff", border:"1px solid "+C.border, borderRadius:6, padding:6 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:8, color:pc, cursor:"pointer" }}>◀</span>
                        <span style={{ fontSize:8, fontWeight:700 }}>Abril 2026</span>
                        <span style={{ fontSize:8, color:pc, cursor:"pointer" }}>▶</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1, textAlign:"center" }}>
                        {["L","M","M","J","V","S","D"].map((d,i)=><div key={i} style={{ fontSize:6, color:C.muted, fontWeight:600 }}>{d}</div>)}
                        {[...Array(2).fill(""),3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map((d,i)=>(
                          <div key={i} style={{ fontSize:6, padding:"2px 0", borderRadius:2, background:d===3?pc:d>=7&&d<=11?pc+"15":"transparent", color:d===3?"#fff":d>=7&&d<=11?pc:d?"":C.ph, fontWeight:d===3?700:400 }}>{d||""}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4 — Feedback */}
              {pt===4 && (
                <div>
                  {/* Alertas inline */}
                  <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Alertas inline</div>
                  {[{i:"✅",t:"Reporte guardado correctamente",c:C.ok},{i:"ℹ️",t:"Recuerda adjuntar el soporte documental",c:C.pri},{i:"⚠️",t:"Cuota de reportes al 80%",c:C.warn},{i:"❌",t:"Error al procesar el archivo",c:C.err}].map(a=>(
                    <div key={a.t} style={{ display:"flex", gap:6, alignItems:"center", padding:"5px 8px", borderRadius:5, background:a.c+"08", border:"1px solid "+a.c+"30", marginBottom:4 }}>
                      <span style={{ fontSize:10 }}>{a.i}</span>
                      <div style={{ flex:1, fontSize:8, fontWeight:600, color:a.c }}>{a.t}</div>
                      <span style={{ fontSize:9, color:C.muted }}>✕</span>
                    </div>
                  ))}
                  {/* Toast / Snackbar */}
                  <div style={{ fontSize:9, fontWeight:600, margin:"10px 0 6px" }}>Toast / Snackbar</div>
                  <div style={{ position:"relative", height:80, background:C.inBg, borderRadius:6, overflow:"hidden" }}>
                    <div style={{ position:"absolute", bottom:8, right:8, display:"flex", flexDirection:"column", gap:4 }}>
                      <div style={{ background:"#1e293b", color:"#fff", padding:"6px 10px", borderRadius:6, fontSize:8, display:"flex", alignItems:"center", gap:6, boxShadow:"0 4px 12px rgba(0,0,0,.2)", minWidth:160 }}>
                        <span>✅</span><span style={{ flex:1 }}>Cambios guardados</span><span style={{ color:"#64748b" }}>✕</span>
                      </div>
                      <div style={{ background:C.err, color:"#fff", padding:"6px 10px", borderRadius:6, fontSize:8, display:"flex", alignItems:"center", gap:6, boxShadow:"0 4px 12px rgba(0,0,0,.2)", minWidth:160 }}>
                        <span>❌</span><span style={{ flex:1 }}>Error de conexión</span><span style={{ color:"rgba(255,255,255,.6)" }}>✕</span>
                      </div>
                    </div>
                  </div>
                  {/* Progress de carga */}
                  <div style={{ fontSize:9, fontWeight:600, margin:"10px 0 6px" }}>Carga de archivo</div>
                  {[{name:"informe_marzo.pdf",pct:100,done:true},{name:"muestras_q1.xlsx",pct:67,done:false},{name:"foto_punto_3.jpg",pct:12,done:false}].map((f,i)=>(
                    <div key={i} style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4, background:"#fff", border:"1px solid "+C.border, borderRadius:5, padding:"4px 6px" }}>
                      <span style={{ fontSize:12 }}>{f.done?"📄":"📤"}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:8, fontWeight:500, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                        <div style={{ background:C.ph, borderRadius:2, height:4 }}>
                          <div style={{ background:f.done?C.ok:pc, width:f.pct+"%", height:"100%", borderRadius:2 }} />
                        </div>
                      </div>
                      <span style={{ fontSize:7, color:f.done?C.ok:C.muted, fontWeight:600, flexShrink:0 }}>{f.done?"✓":f.pct+"%"}</span>
                    </div>
                  ))}
                  {/* Banner sticky cuota */}
                  <div style={{ fontSize:9, fontWeight:600, margin:"10px 0 6px" }}>Banner sticky de cuota</div>
                  <div style={{ background:C.warn+"12", border:"1px solid "+C.warn+"40", borderRadius:6, padding:"6px 10px", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:14 }}>⚠️</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:8, fontWeight:700, color:C.warn }}>Cuota de reportes al 80%</div>
                      <div style={{ fontSize:7, color:C.muted }}>8 de 10 usados · Renueva el 01/05/2026</div>
                    </div>
                    <div style={{ background:pc, color:"#fff", padding:"3px 8px", borderRadius:4, fontSize:8, fontWeight:600, cursor:"pointer" }}>Actualizar plan</div>
                  </div>
                  {/* Badge sobre ícono */}
                  <div style={{ fontSize:9, fontWeight:600, margin:"10px 0 6px" }}>Badge sobre ícono</div>
                  <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                    {[[3,C.err,"🔔"],[12,pc,"📧"],[0,C.ok,"💬"]].map(([n,c,icon],i)=>(
                      <div key={i} style={{ position:"relative", display:"inline-block" }}>
                        <span style={{ fontSize:22 }}>{icon}</span>
                        {n>0&&<div style={{ position:"absolute", top:-4, right:-6, minWidth:14, height:14, borderRadius:9999, background:c, color:"#fff", fontSize:8, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px", border:"2px solid #fff" }}>{n>9?"9+":n}</div>}
                        {n===0&&<div style={{ position:"absolute", top:-2, right:-2, width:8, height:8, borderRadius:"50%", background:C.ok, border:"2px solid #fff" }}/>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5 — Tablas */}
              {pt===5 && (
                <div style={{ overflowX:"auto" }}>
                  <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Tabla con heat-map de cumplimiento</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:8, minWidth:320 }}>
                    <thead>
                      <tr style={{ background:C.ph }}>
                        {["Parámetro","Límite","Medido","Estado","Cumple"].map((h,i)=><th key={i} style={{ textAlign:"left", padding:"4px 6px", fontWeight:700, color:C.muted, fontSize:7, textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { p:"pH",          lim:"6.0–9.0", med:"7.2",  ok:true },
                        { p:"DBO₅",        lim:"≤ 30 mg/L",med:"18",  ok:true },
                        { p:"SST",         lim:"≤ 50 mg/L",med:"62",  ok:false },
                        { p:"Temperatura", lim:"≤ 30 °C",  med:"28",  ok:true },
                        { p:"Grasas y aceites",lim:"≤ 10 mg/L",med:"11.4",ok:false },
                      ].map((r,i)=>(
                        <tr key={i} style={{ borderTop:"1px solid "+C.border, background:r.ok?"transparent":C.err+"08" }}>
                          <td style={{ padding:"4px 6px", fontWeight:600 }}>{r.p}</td>
                          <td style={{ padding:"4px 6px", color:C.muted }}>{r.lim}</td>
                          <td style={{ padding:"4px 6px", fontWeight:700, color:r.ok?C.ok:C.err }}>{r.med}</td>
                          <td style={{ padding:"4px 6px" }}><div style={{ width:40, height:5, borderRadius:2, background:C.ph, overflow:"hidden" }}><div style={{ width:r.ok?"75%":"105%", height:"100%", background:r.ok?pc:C.err, borderRadius:2 }}/></div></td>
                          <td style={{ padding:"4px 6px" }}><span style={{ background:r.ok?C.ok+"20":C.err+"20", color:r.ok?C.ok:C.err, padding:"1px 6px", borderRadius:9999, fontSize:7, fontWeight:700 }}>{r.ok?"✓ Cumple":"✗ Excede"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ fontSize:9, fontWeight:600, margin:"12px 0 6px" }}>Tabla de usuarios (mini)</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:8, minWidth:280 }}>
                    <thead><tr style={{ background:C.ph }}>{["Usuario","Rol","Estado"].map((h,i)=><th key={i} style={{ textAlign:"left", padding:"4px 6px", fontWeight:700, color:C.muted, fontSize:7, textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
                    <tbody>{[{n:"Cesar E.",r:"Admin",rc:pc,st:"Activo",stc:C.ok},{n:"Carlos M.",r:"Operador",rc:C.purp,st:"Activo",stc:C.ok},{n:"María L.",r:"Visor",rc:C.muted,st:"Pendiente",stc:C.warn}].map((u,i)=>(
                      <tr key={i} style={{ borderTop:"1px solid "+C.border }}>
                        <td style={{ padding:"4px 6px", fontWeight:600 }}>{u.n}</td>
                        <td style={{ padding:"4px 6px" }}><span style={{ background:u.rc+"20", color:u.rc, padding:"1px 5px", borderRadius:9999, fontSize:7, fontWeight:600 }}>{u.r}</span></td>
                        <td style={{ padding:"4px 6px" }}><span style={{ background:u.stc+"20", color:u.stc, padding:"1px 4px", borderRadius:9999, fontSize:7, fontWeight:600 }}>{u.st}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}

              {/* TAB 6 — Navegación */}
              {pt===6 && (
                <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:10 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {/* Breadcrumbs */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Breadcrumbs</div>
                      <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:8, flexWrap:"wrap" }}>
                        {["Plataforma","Mi Empresa","Reportes","Vertimientos Q1"].map((s,i,arr)=>(
                          <span key={s} style={{ display:"flex", alignItems:"center", gap:3 }}>
                            <span style={{ color:i===arr.length-1?C.text:pc, fontWeight:i===arr.length-1?600:400, cursor:i<arr.length-1?"pointer":"default", textDecoration:i<arr.length-1?"underline":"none" }}>{s}</span>
                            {i<arr.length-1&&<span style={{ color:C.muted }}>/</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Sidebar estados */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Sidebar — estados</div>
                      <div style={{ display:"flex", gap:6 }}>
                        {/* Expandido */}
                        <div style={{ background:sc, borderRadius:4, padding:"6px 4px", width:80 }}>
                          <div style={{ fontSize:7, color:"#64748b", fontWeight:700, padding:"2px 4px", marginBottom:2 }}>EXPANDIDO</div>
                          {[["📊","Dashboard",true],["👥","Usuarios",false],["📋","Auditoría",false]].map(it=>(
                            <div key={it[1]} style={{ display:"flex", alignItems:"center", gap:3, padding:"2px 4px", borderRadius:3, background:it[2]?pc:"transparent", fontSize:7, color:it[2]?"#fff":"#94a3b8" }}><span>{it[0]}</span>{it[1]}</div>
                          ))}
                        </div>
                        {/* Colapsado */}
                        <div style={{ background:sc, borderRadius:4, padding:"6px 4px", width:28 }}>
                          <div style={{ fontSize:7, color:"#64748b", fontWeight:700, marginBottom:4, textAlign:"center" }}>≡</div>
                          {[["📊",true],["👥",false],["📋",false]].map((it,i)=>(
                            <div key={i} style={{ padding:"3px 0", textAlign:"center", background:it[1]?pc+"30":"transparent", borderRadius:3, marginBottom:2, fontSize:12 }}>{it[0]}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Tabs horizontales */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Tabs horizontales</div>
                      <div style={{ display:"flex", background:"#fff", borderRadius:6, border:"1px solid "+C.border, overflow:"hidden", marginBottom:6 }}>
                        {["General","Seguridad","Avanzado"].map((t,i)=>(
                          <div key={t} style={{ flex:1, padding:"4px 0", textAlign:"center", fontSize:8, fontWeight:i===0?700:400, color:i===0?pc:C.muted, borderBottom:"2px solid "+(i===0?pc:"transparent") }}>{t}</div>
                        ))}
                      </div>
                      {/* Tabs pill */}
                      <div style={{ display:"flex", gap:4 }}>
                        {["Todos","Activos","Pendientes"].map((t,i)=>(
                          <div key={t} style={{ padding:"3px 8px", borderRadius:9999, fontSize:8, fontWeight:i===0?700:400, background:i===0?pc:C.ph, color:i===0?"#fff":C.muted, cursor:"pointer" }}>{t}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {/* Tabs verticales */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Tabs verticales</div>
                      <div style={{ display:"flex", gap:6 }}>
                        <div style={{ display:"flex", flexDirection:"column", gap:2, width:80 }}>
                          {["Datos empresa","Branding","Subdominio","Regional"].map((t,i)=>(
                            <div key={t} style={{ padding:"4px 6px", borderRadius:4, fontSize:8, fontWeight:i===0?700:400, color:i===0?pc:C.muted, background:i===0?pc+"12":"transparent", borderLeft:"2px solid "+(i===0?pc:"transparent"), cursor:"pointer" }}>{t}</div>
                          ))}
                        </div>
                        <div style={{ flex:1, background:"#fff", borderRadius:4, padding:6, border:"1px solid "+C.border }}>
                          <div style={{ fontSize:8, fontWeight:700, color:pc, marginBottom:4 }}>Datos empresa</div>
                          <div style={{ height:6, background:C.ph, borderRadius:3, marginBottom:3 }}/>
                          <div style={{ height:6, background:C.ph, borderRadius:3, width:"80%" }}/>
                        </div>
                      </div>
                    </div>
                    {/* Paginación */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Paginación</div>
                      <div style={{ display:"flex", gap:3, alignItems:"center", marginBottom:6 }}>
                        {["←","1","2","3","...","12","→"].map((p,i)=>(
                          <div key={i} style={{ padding:"2px 6px", borderRadius:4, fontSize:8, background:p==="2"?pc:"transparent", color:p==="2"?"#fff":C.muted, border:p==="2"?"none":"1px solid "+C.border, cursor:"pointer", fontWeight:p==="2"?700:400 }}>{p}</div>
                        ))}
                      </div>
                      <div style={{ fontSize:7, color:C.muted }}>Mostrando 11–20 de 142 resultados</div>
                    </div>
                    {/* Bottom nav mobile */}
                    <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:6 }}>Mobile bottom nav</div>
                      <div style={{ background:"#fff", border:"1px solid "+C.border, borderRadius:8, display:"flex", overflow:"hidden" }}>
                        {[["📊","Inicio",true],["📋","Reportes",false],["🔔","Notif.",false],["👤","Perfil",false]].map(it=>(
                          <div key={it[1]} style={{ flex:1, padding:"6px 4px", textAlign:"center", borderTop:it[2]?"2px solid "+pc:"2px solid transparent" }}>
                            <div style={{ fontSize:14 }}>{it[0]}</div>
                            <div style={{ fontSize:7, color:it[2]?pc:C.muted, fontWeight:it[2]?700:400 }}>{it[1]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7 — Charts */}
              {pt===7 && (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
                  {/* Línea de tendencia */}
                  <div>
                    <div style={{ fontSize:9, fontWeight:600, marginBottom:4 }}>Línea — Tendencia DBO₅ (mg/L)</div>
                    <div style={{ background:C.inBg, borderRadius:6, padding:"8px 8px 4px", position:"relative", height:70 }}>
                      <svg width="100%" height="52" viewBox="0 0 260 52" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={pc} stopOpacity="0.15"/>
                            <stop offset="100%" stopColor={pc} stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        {/* línea límite */}
                        <line x1="0" y1="18" x2="260" y2="18" stroke={C.err} strokeWidth="1" strokeDasharray="4,3" opacity="0.6"/>
                        {/* área */}
                        <path d="M0,42 L32,38 L65,30 L97,34 L130,22 L162,28 L195,16 L227,20 L260,12 L260,52 L0,52 Z" fill="url(#lineGrad)"/>
                        {/* línea */}
                        <path d="M0,42 L32,38 L65,30 L97,34 L130,22 L162,28 L195,16 L227,20 L260,12" fill="none" stroke={pc} strokeWidth="2" strokeLinejoin="round"/>
                        {/* puntos */}
                        {[[0,42],[65,30],[130,22],[195,16],[260,12]].map(([x,y],i)=>(
                          <circle key={i} cx={x} cy={y} r="3" fill={pc} stroke="#fff" strokeWidth="1.5"/>
                        ))}
                        {/* label límite */}
                        <text x="200" y="14" fontSize="6" fill={C.err} opacity="0.8">Límite: 30 mg/L</text>
                      </svg>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:7, color:C.muted, marginTop:2 }}>
                        {["Oct","Nov","Dic","Ene","Feb","Mar","Abr"].map(m2=><span key={m2}>{m2}</span>)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {/* Barras comparativas */}
                    <div>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:4 }}>Barras — Parámetros vs límite</div>
                      <div style={{ background:C.inBg, borderRadius:6, padding:8 }}>
                        {[{l:"pH",v:78,ok:true},{l:"DBO₅",v:60,ok:true},{l:"SST",v:124,ok:false},{l:"Grasas",v:114,ok:false}].map(b=>(
                          <div key={b.l} style={{ marginBottom:6 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", fontSize:7, marginBottom:2 }}>
                              <span style={{ fontWeight:500 }}>{b.l}</span>
                              <span style={{ color:b.ok?C.ok:C.err, fontWeight:600 }}>{b.v}%</span>
                            </div>
                            <div style={{ background:C.ph, borderRadius:3, height:8, overflow:"hidden" }}>
                              <div style={{ background:b.ok?pc:C.err, width:Math.min(b.v,100)+"%", height:"100%", borderRadius:3 }}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Donut */}
                    <div>
                      <div style={{ fontSize:9, fontWeight:600, marginBottom:4 }}>Donut — Cumplimiento</div>
                      <div style={{ background:C.inBg, borderRadius:6, padding:8, display:"flex", alignItems:"center", gap:8 }}>
                        <svg width="56" height="56" viewBox="0 0 56 56" style={{ flexShrink:0 }}>
                          <circle cx="28" cy="28" r="20" fill="none" stroke={C.ph} strokeWidth="10"/>
                          <circle cx="28" cy="28" r="20" fill="none" stroke={pc} strokeWidth="10" strokeDasharray="75.4 125.6" strokeLinecap="round" transform="rotate(-90 28 28)"/>
                          <circle cx="28" cy="28" r="20" fill="none" stroke={C.err} strokeWidth="10" strokeDasharray="25.1 175.9" strokeDashoffset="-75.4" strokeLinecap="round" transform="rotate(-90 28 28)"/>
                          <text x="28" y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill={pc}>75%</text>
                        </svg>
                        <div>
                          {[[pc,"Cumple","9 params"],[C.err,"Excede","3 params"]].map(([c,l,n])=>(
                            <div key={l} style={{ display:"flex", alignItems:"center", gap:4, marginBottom:4 }}>
                              <div style={{ width:8, height:8, borderRadius:2, background:c }}/>
                              <span style={{ fontSize:7, color:C.muted }}>{l}</span>
                              <span style={{ fontSize:7, fontWeight:700, color:c }}>{n}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Spinners loading chart */}
                  <div style={{ display:"flex", gap:16, alignItems:"center", background:C.inBg, borderRadius:6, padding:8 }}>
                    {[20,28,36].map(s=>(
                      <div key={s} style={{ width:s, height:s, border:"3px solid "+C.ph, borderTop:"3px solid "+pc, borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
                    ))}
                    <div style={{ fontSize:9, color:C.muted }}>Cargando datos del servidor...</div>
                  </div>
                </div>
              )}

            </div>{/* fin preview */}
          </div>
        )}

        {/* ── PASO 3: Listo ── */}
        {step===3 && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:8 }}>🎉</div>
            <div style={{ fontSize:m?18:22, fontWeight:700, marginBottom:6 }}>¡Listo!</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Configuración completada</div>
            <Bt variant="primary" size="lg" style={{ width:"100%", justifyContent:"center" }}>🚀 Ir al Dashboard</Bt>
          </div>
        )}

        {step<3 ? (
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:20, flexWrap:"wrap", gap:8 }}>
            <div>{step>0&&<Bt variant="ghost" onClick={pv}>← Anterior</Bt>}</div>
            <div style={{ display:"flex", gap:8 }}>
              <Bt variant="ghost" size="sm" style={{ color:C.warn }}>Saltar ⏭</Bt>
              <Bt variant="primary" onClick={nx}>Siguiente →</Bt>
            </div>
          </div>
        ) : (
          <div style={{ textAlign:"center", marginTop:8 }}><Bt variant="ghost" onClick={pv}>← Volver</Bt></div>
        )}
      </Cd>
    </div>
  );
}

function PasswordResetScreen() {
  const m = useM();
  const [step, setStep] = useState(0);
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"center", minHeight:"100%", background:C.bg, padding:m?12:20 }}>
      <div style={{ width:m?"100%":440 }}>
        <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
          {["Solicitar","Enviado","Nueva clave","Expirado","Éxito"].map((s,i)=>(
            <div key={s} onClick={()=>setStep(i)} style={{ padding:"4px 10px", borderRadius:9999, fontSize:11, fontWeight:600, cursor:"pointer", background:step===i?C.pri:C.ph, color:step===i?"#fff":C.muted }}>{s}</div>
          ))}
        </div>
        {step===0&&<Cd style={{padding:32,textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>🔑</div><div style={{fontSize:18,fontWeight:700,marginBottom:4}}>¿Olvidaste tu contraseña?</div><div style={{fontSize:12,color:C.muted,marginBottom:20}}>Ingresa tu email y te enviaremos un link</div><Inp label="Email" placeholder="usuario@empresa.com"/><Bt variant="primary" size="lg" style={{width:"100%",justifyContent:"center"}}>Enviar link</Bt></Cd>}
        {step===1&&<Cd style={{padding:32,textAlign:"center"}}><div style={{fontSize:48,marginBottom:8}}>📧</div><div style={{fontSize:18,fontWeight:700,marginBottom:6}}>Revisa tu correo</div><div style={{background:C.inBg,border:"1px solid "+C.border,borderRadius:8,padding:12,margin:"0 0 16px"}}><div style={{color:C.muted,fontSize:12,marginBottom:4}}>Expira en:</div><div style={{fontSize:20,fontWeight:700,color:C.warn,fontFamily:"monospace"}}>01:59:32</div></div><Bt variant="ghost" size="sm">Reenviar email</Bt></Cd>}
        {step===2&&<Cd style={{padding:32}}><div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:32}}>🔒</div><div style={{fontSize:18,fontWeight:700}}>Nueva contraseña</div></div><Inp label="Nueva contraseña *" placeholder="••••••••" note="Mínimo 8 caracteres"/><Inp label="Confirmar *" placeholder="••••••••"/><Bt variant="primary" size="lg" style={{width:"100%",justifyContent:"center"}}>Cambiar contraseña</Bt></Cd>}
        {step===3&&<Cd style={{padding:32,textAlign:"center"}}><div style={{fontSize:48,marginBottom:8}}>⏰</div><div style={{fontSize:18,fontWeight:700,color:C.err}}>Link expirado</div><div style={{fontSize:12,color:C.muted,margin:"8px 0 20px"}}>El link expiró. Los links son válidos por 2 horas.</div><Bt variant="primary" style={{width:"100%",justifyContent:"center"}}>Solicitar nuevo link</Bt></Cd>}
        {step===4&&<Cd style={{padding:32,textAlign:"center"}}><div style={{fontSize:48,marginBottom:8}}>✅</div><div style={{fontSize:18,fontWeight:700,marginBottom:6}}>¡Contraseña actualizada!</div><div style={{fontSize:12,color:C.muted,marginBottom:20}}>Se cerraron todas las sesiones activas.</div><Bt variant="primary" size="lg" style={{width:"100%",justifyContent:"center"}}>Ir al login →</Bt></Cd>}
      </div>
    </div>
  );
}

function InvitationAcceptScreen() {
  const m = useM();
  const [step, setStep] = useState(0);
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"center", minHeight:"100%", background:C.bg, padding:m?12:20 }}>
      <div style={{ width:m?"100%":460 }}>
        <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
          {["Invitación válida","Crear cuenta","Éxito","Expirada"].map((s,i)=>(
            <div key={s} onClick={()=>setStep(i)} style={{ padding:"4px 10px", borderRadius:9999, fontSize:11, fontWeight:600, cursor:"pointer", background:step===i?C.pri:C.ph, color:step===i?"#fff":C.muted }}>{s}</div>
          ))}
        </div>
        {step===0&&<Cd style={{padding:32}}><div style={{textAlign:"center",marginBottom:20}}><div style={{width:64,height:64,borderRadius:12,background:C.ph,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.muted}}>Logo</div><div style={{fontSize:18,fontWeight:700}}>Te han invitado a</div><div style={{fontSize:16,fontWeight:700,color:C.pri,marginTop:4}}>Empresa S.A.S.</div></div><Cd style={{background:C.inBg,marginBottom:16}}>{[["Invitado por","Cesar E. (Admin)"],["Tu rol","Operador"],["Email","nuevo@empresa.com"],["Expira","04/04/2026"]].map(([k,v],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<3?"1px solid "+C.border:"none"}}><span style={{fontSize:12,color:C.muted}}>{k}</span><span style={{fontSize:12,fontWeight:500}}>{v}</span></div>)}</Cd><Bt variant="primary" size="lg" style={{width:"100%",justifyContent:"center"}} onClick={()=>setStep(1)}>Aceptar →</Bt></Cd>}
        {step===1&&<Cd style={{padding:32}}><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:16,fontWeight:700}}>Crea tu contraseña</div></div><Inp label="Nombre *" placeholder="Carlos Martínez"/><Inp label="Contraseña *" placeholder="••••••••"/><Inp label="Confirmar *" placeholder="••••••••"/><Bt variant="primary" size="lg" style={{width:"100%",justifyContent:"center"}} onClick={()=>setStep(2)}>Crear cuenta</Bt></Cd>}
        {step===2&&<Cd style={{padding:32,textAlign:"center"}}><div style={{fontSize:48,marginBottom:8}}>🎉</div><div style={{fontSize:20,fontWeight:700,marginBottom:6}}>¡Bienvenido!</div><div style={{fontSize:13,color:C.muted,marginBottom:20}}>Ya puedes acceder como <strong>Operador</strong>.</div><Bt variant="primary" size="lg" style={{width:"100%",justifyContent:"center"}}>Ir al Dashboard →</Bt></Cd>}
        {step===3&&<Cd style={{padding:32,textAlign:"center"}}><div style={{fontSize:48,marginBottom:8}}>⏰</div><div style={{fontSize:18,fontWeight:700,color:C.err}}>Invitación expirada</div><div style={{fontSize:12,color:C.muted,margin:"8px 0 16px"}}>Pide al admin que envíe una nueva invitación.</div><Bt variant="outline">Solicitar nueva</Bt></Cd>}
      </div>
    </div>
  );
}

// NUEVA: Subdominio no encontrado
function SubdomainNotFoundScreen() {
  const m = useM();
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100%", background:C.bg, padding:m?12:20 }}>
      <div style={{ width:m?"100%":480, textAlign:"center" }}>
        <div style={{ fontSize:72, marginBottom:8, lineHeight:1 }}>🔍</div>
        <div style={{ fontSize:m?22:28, fontWeight:700, marginBottom:8 }}>Espacio no encontrado</div>
        <div style={{ fontSize:14, color:C.muted, marginBottom:24, lineHeight:1.6 }}>
          El workspace <code style={{ background:C.ph, padding:"2px 8px", borderRadius:4, fontSize:13, color:C.text }}>empresa-xyz.plataforma.com</code> no existe o fue eliminado.
        </div>
        <Cd style={{ marginBottom:24, textAlign:"left" }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>¿Qué puede haber pasado?</div>
          {[
            { icon:"🔤", text:"El subdominio tiene un error tipográfico" },
            { icon:"🗑️", text:"El workspace fue eliminado por el administrador" },
            { icon:"⏸️", text:"La cuenta está suspendida por falta de pago" },
            { icon:"🔗", text:"El link que usaste está desactualizado" },
          ].map((r,i) => (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom: i<3?"1px solid "+C.border:"none" }}>
              <span style={{ fontSize:18 }}>{r.icon}</span>
              <span style={{ fontSize:13, color:C.muted }}>{r.text}</span>
            </div>
          ))}
        </Cd>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <Bt variant="primary" size="lg">Ir a plataforma.com</Bt>
          <Bt variant="outline" size="lg">Crear mi espacio</Bt>
        </div>
        <div style={{ marginTop:20, fontSize:12, color:C.muted }}>
          ¿Eres administrador? <span style={{ color:C.pri, cursor:"pointer" }}>Contacta soporte →</span>
        </div>
      </div>
    </div>
  );
}

// NUEVA: Mantenimiento global 503
function MaintenanceScreen() {
  const m = useM();
  const [tab, setTab] = useState(0);
  const tabs = ["En mantenimiento","Emergencia"];
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"center", minHeight:"100%", background:"#0f172a", padding:m?12:20 }}>
      <div style={{ width:m?"100%":500 }}>
        <div style={{ display:"flex", gap:6, marginBottom:16 }}>
          {tabs.map((t,i) => (
            <div key={t} onClick={()=>setTab(i)} style={{ padding:"4px 10px", borderRadius:9999, fontSize:11, fontWeight:600, cursor:"pointer", background:tab===i?C.pri:C.sidebarHover, color:tab===i?"#fff":"#94a3b8" }}>{t}</div>
          ))}
        </div>

        {tab===0 && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:64, marginBottom:16, lineHeight:1 }}>🔧</div>
            <div style={{ fontSize:m?22:28, fontWeight:700, color:"#f1f5f9", marginBottom:8 }}>Mantenimiento programado</div>
            <div style={{ fontSize:14, color:"#94a3b8", marginBottom:32, lineHeight:1.6 }}>
              Estamos mejorando la plataforma. Volveremos pronto con todo funcionando perfectamente.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:32 }}>
              {[["00","Días"],["02","Horas"],["45","Min"],["12","Seg"]].map(([n,l])=>(
                <div key={l} style={{ background:"#1e293b", borderRadius:8, padding:"12px 4px" }}>
                  <div style={{ fontSize:28, fontWeight:700, color:"#f1f5f9", fontFamily:"monospace" }}>{n}</div>
                  <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
            <Cd style={{ background:"#1e293b", border:"1px solid #334155", marginBottom:24, textAlign:"left" }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#94a3b8", marginBottom:10 }}>DETALLES DEL MANTENIMIENTO</div>
              {[["Inicio","19/04/2026 02:00 COT"],["Fin estimado","19/04/2026 04:00 COT"],["Tipo","Rutinario — actualización de infraestructura"],["Servicios","API, Portal web, Autenticación"]].map(([k,v],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom: i<3?"1px solid #334155":"none", gap:12 }}>
                  <span style={{ fontSize:12, color:"#64748b", flexShrink:0 }}>{k}</span>
                  <span style={{ fontSize:12, color:"#cbd5e1", textAlign:"right" }}>{v}</span>
                </div>
              ))}
            </Cd>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <Bt variant="outline" style={{ borderColor:"#334155", color:"#94a3b8" }}>🔔 Notifícame cuando vuelva</Bt>
              <a href="#" style={{ color:"#64748b", fontSize:12, display:"flex", alignItems:"center", textDecoration:"none" }}>Estado del servicio →</a>
            </div>
          </div>
        )}

        {tab===1 && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:64, marginBottom:16, lineHeight:1 }}>🚨</div>
            <div style={{ fontSize:m?20:26, fontWeight:700, color:"#fca5a5", marginBottom:8 }}>Interrupción del servicio</div>
            <div style={{ fontSize:14, color:"#94a3b8", marginBottom:24, lineHeight:1.6 }}>
              Estamos experimentando una interrupción no planificada. Nuestro equipo está trabajando para resolver el problema.
            </div>
            <div style={{ background:"#7f1d1d20", border:"1px solid #991b1b50", borderRadius:8, padding:16, marginBottom:24 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#fca5a5", marginBottom:6 }}>INCIDENTE ACTIVO</div>
              <div style={{ fontSize:13, color:"#fecaca" }}>Degradación en el servicio de autenticación</div>
              <div style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>Detectado: 03/04/2026 14:22 COT · Investigando</div>
            </div>
            <Cd style={{ background:"#1e293b", border:"1px solid #334155", marginBottom:24, textAlign:"left" }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#94a3b8", marginBottom:10 }}>ACTUALIZACIONES</div>
              {[
                { time:"14:35", msg:"Identificado el origen: fallo en nodo de Keycloak. Iniciando failover.", color:"#fbbf24" },
                { time:"14:28", msg:"Equipo de ingeniería notificado. Investigando causa raíz.", color:"#94a3b8" },
                { time:"14:22", msg:"Alertas disparadas. Usuarios reportan errores de login.", color:"#f87171" },
              ].map((u,i)=>(
                <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:i<2?"1px solid #334155":"none" }}>
                  <span style={{ fontSize:11, color:"#64748b", fontFamily:"monospace", flexShrink:0 }}>{u.time}</span>
                  <span style={{ fontSize:12, color:u.color, lineHeight:1.5 }}>{u.msg}</span>
                </div>
              ))}
            </Cd>
            <Bt variant="outline" style={{ borderColor:"#334155", color:"#94a3b8" }}>Ver página de estado completa →</Bt>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPageScreen() {
  const m = useM();
  const [expandedGroup, setExpandedGroup] = useState({0:true,1:true,2:true});
  const toggleGroup = (i) => setExpandedGroup(p=>({...p,[i]:!p[i]}));

  const services = [
    { group:"Plataforma Core", items:[
      { name:"Portal Web / Dashboard", status:"operational", uptime:"99.98%" },
      { name:"Autenticación (Login / SSO)", status:"operational", uptime:"99.95%" },
      { name:"API REST", status:"operational", uptime:"99.99%" },
      { name:"Base de Datos", status:"operational", uptime:"99.99%" },
    ]},
    { group:"Servicios", items:[
      { name:"Notificaciones (Email / Push)", status:"degraded", uptime:"98.70%" },
      { name:"Almacenamiento de Archivos", status:"operational", uptime:"99.97%" },
      { name:"Motor de Reportes", status:"operational", uptime:"99.90%" },
      { name:"Procesamiento en Background", status:"operational", uptime:"99.95%" },
    ]},
    { group:"Integraciones", items:[
      { name:"Webhooks", status:"operational", uptime:"99.92%" },
      { name:"API Pública (v2)", status:"operational", uptime:"99.98%" },
      { name:"Integración SMTP", status:"maintenance", uptime:"97.50%" },
    ]},
  ];

  const statusCfg = {
    operational:  { label:"Operativo",     color:"#22c55e", bg:"#22c55e15" },
    degraded:     { label:"Degradado",     color:"#f59e0b", bg:"#f59e0b15" },
    major:        { label:"Incidencia mayor", color:"#f97316", bg:"#f9731615" },
    outage:       { label:"Caída total",   color:"#ef4444", bg:"#ef444415" },
    maintenance:  { label:"Mantenimiento", color:"#3b82f6", bg:"#3b82f615" },
  };

  const allStatuses = services.flatMap(g=>g.items.map(i=>i.status));
  const globalStatus = allStatuses.includes("outage") ? "outage" : allStatuses.includes("major") ? "major" : allStatuses.includes("degraded") ? "degraded" : allStatuses.includes("maintenance") ? "operational" : "operational";
  const globalCfg = globalStatus==="operational" ? { label:"Todos los sistemas operativos", color:"#22c55e", icon:"✅" } : globalStatus==="degraded" ? { label:"Degradación parcial detectada", color:"#f59e0b", icon:"⚠️" } : globalStatus==="major" ? { label:"Incidencia mayor en curso", color:"#f97316", icon:"🔶" } : { label:"Interrupción del servicio", color:"#ef4444", icon:"🔴" };

  // Generate mock 90-day uptime data per service
  const gen90 = (status) => Array.from({length:90},(_,i)=> {
    if(status==="degraded" && i>85) return "degraded";
    if(status==="maintenance" && i>87) return "maintenance";
    if(i===45) return "degraded";
    return Math.random()>0.97 ? "degraded" : "operational";
  });

  const incidents = [
    { date:"3 Abr 2026", title:"Latencia elevada en servicio de notificaciones", status:"investigating", severity:"degraded",
      updates:[
        { time:"16:45", text:"Identificado cuello de botella en cola de mensajes. Escalando workers.", state:"Identificado" },
        { time:"16:20", text:"Usuarios reportan retraso en emails. Investigando.", state:"Investigando" },
      ]},
    { date:"28 Mar 2026", title:"Mantenimiento programado — Migración SMTP", status:"completed", severity:"maintenance",
      updates:[
        { time:"06:00", text:"Migración completada exitosamente. Servicio restaurado.", state:"Completado" },
        { time:"02:00", text:"Inicio de mantenimiento programado.", state:"En progreso" },
      ]},
    { date:"15 Mar 2026", title:"Caída parcial del servicio de autenticación", status:"resolved", severity:"major",
      updates:[
        { time:"10:15", text:"Servicio completamente restaurado. Causa raíz: certificado TLS expirado en nodo secundario.", state:"Resuelto" },
        { time:"09:30", text:"Failover ejecutado. Servicio recuperándose.", state:"Mitigado" },
        { time:"09:10", text:"Alertas disparadas. 30% de intentos de login fallando.", state:"Investigando" },
      ]},
  ];

  const scheduled = [
    { date:"12 Abr 2026, 02:00–04:00 COT", title:"Actualización de infraestructura de base de datos", services:"API REST, Base de Datos", impact:"Posible latencia elevada durante la ventana" },
  ];

  const stateLabel = { investigating:"Investigando", resolved:"Resuelto", completed:"Completado", monitoring:"Monitoreando" };

  return (
    <div style={{ minHeight:"100%", background:"#f8fafc" }}>
      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:m?"12px 16px":"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"#1e293b", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:700 }}>P</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#1e293b" }}>Plataforma Status</div>
            <div style={{ fontSize:11, color:"#64748b" }}>status.plataforma.com</div>
          </div>
        </div>
        <button style={{ padding:"6px 14px", borderRadius:6, fontSize:12, fontWeight:600, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", color:"#475569" }}>🔔 Suscribirse</button>
      </div>

      <div style={{ maxWidth:720, margin:"0 auto", padding:m?12:24 }}>
        {/* Global status banner */}
        <div style={{ background:globalCfg.color+"12", border:"1px solid "+globalCfg.color+"30", borderRadius:10, padding:m?"16px 14px":"20px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:28 }}>{globalCfg.icon}</span>
          <div>
            <div style={{ fontSize:m?16:18, fontWeight:700, color:globalCfg.color }}>{globalCfg.label}</div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>Última verificación: hace 2 minutos</div>
          </div>
        </div>

        {/* Services by group */}
        {services.map((g,gi)=>(
          <div key={gi} style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, marginBottom:12, overflow:"hidden" }}>
            <div onClick={()=>toggleGroup(gi)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", cursor:"pointer", background:"#f8fafc" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>{g.group}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, color:"#64748b" }}>{g.items.filter(i=>i.status==="operational").length}/{g.items.length} operativos</span>
                <span style={{ fontSize:12, color:"#94a3b8", transform:expandedGroup[gi]?"rotate(180deg)":"rotate(0deg)", transition:"transform .15s" }}>▾</span>
              </div>
            </div>
            {expandedGroup[gi]&&g.items.map((svc,si)=>{
              const st = statusCfg[svc.status];
              return (
                <div key={si} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", borderTop:"1px solid #f1f5f9", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:st.color, flexShrink:0 }}/>
                    <span style={{ fontSize:13, color:"#334155", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{svc.name}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
                    <span style={{ fontSize:11, color:"#94a3b8", fontFamily:"monospace" }}>{svc.uptime}</span>
                    <span style={{ fontSize:11, fontWeight:600, color:st.color, background:st.bg, padding:"2px 8px", borderRadius:9999 }}>{st.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* 90-day uptime bars */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:16, marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:4 }}>Uptime — últimos 90 días</div>
          <div style={{ fontSize:11, color:"#94a3b8", marginBottom:12 }}>Cada barra representa un día</div>
          {services.flatMap(g=>g.items).slice(0,5).map((svc,i)=>{
            const days = gen90(svc.status);
            return (
              <div key={i} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:11, color:"#475569" }}>{svc.name}</span>
                  <span style={{ fontSize:11, color:"#94a3b8", fontFamily:"monospace" }}>{svc.uptime}</span>
                </div>
                <div style={{ display:"flex", gap:1, height:16, borderRadius:3, overflow:"hidden" }}>
                  {days.map((d,j)=>(
                    <div key={j} style={{ flex:1, background:statusCfg[d]?.color||"#22c55e", opacity:d==="operational"?0.7:1, borderRadius:1 }}/>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#94a3b8", marginTop:4 }}>
            <span>90 días atrás</span><span>Hoy</span>
          </div>
        </div>

        {/* Scheduled maintenance */}
        {scheduled.length>0&&(
          <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:8, padding:16, marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <span style={{ fontSize:14 }}>🔧</span>
              <div style={{ fontSize:13, fontWeight:700, color:"#1e40af" }}>Mantenimiento programado</div>
            </div>
            {scheduled.map((s,i)=>(
              <div key={i} style={{ background:"#fff", borderRadius:6, padding:12, border:"1px solid #dbeafe" }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#1e293b", marginBottom:4 }}>{s.title}</div>
                <div style={{ fontSize:12, color:"#64748b", marginBottom:2 }}>📅 {s.date}</div>
                <div style={{ fontSize:12, color:"#64748b", marginBottom:2 }}>🔗 Servicios: {s.services}</div>
                <div style={{ fontSize:12, color:"#f59e0b" }}>⚠️ {s.impact}</div>
              </div>
            ))}
          </div>
        )}

        {/* Incident history */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:16, marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:12 }}>Historial de incidentes</div>
          {incidents.map((inc,i)=>{
            const sev = statusCfg[inc.severity];
            return (
              <div key={i} style={{ marginBottom:i<incidents.length-1?16:0, paddingBottom:i<incidents.length-1?16:0, borderBottom:i<incidents.length-1?"1px solid #f1f5f9":"none" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:sev.color }}/>
                    <span style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{inc.title}</span>
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, color:inc.status==="resolved"||inc.status==="completed"?"#22c55e":sev.color, background:inc.status==="resolved"||inc.status==="completed"?"#22c55e15":sev.bg, padding:"2px 8px", borderRadius:9999 }}>{stateLabel[inc.status]||inc.status}</span>
                </div>
                <div style={{ fontSize:11, color:"#94a3b8", marginBottom:8 }}>{inc.date}</div>
                <div style={{ paddingLeft:16, borderLeft:"2px solid #e2e8f0" }}>
                  {inc.updates.map((u,j)=>(
                    <div key={j} style={{ marginBottom:j<inc.updates.length-1?8:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:10, color:"#94a3b8", fontFamily:"monospace" }}>{u.time}</span>
                        <span style={{ fontSize:11, fontWeight:600, color:"#475569" }}>{u.state}</span>
                      </div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:2, lineHeight:1.5 }}>{u.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center", padding:"16px 0 8px", fontSize:11, color:"#94a3b8" }}>
          Powered by <span style={{ fontWeight:600 }}>Plataforma</span> · <span style={{ cursor:"pointer", textDecoration:"underline" }}>RSS</span> · <span style={{ cursor:"pointer", textDecoration:"underline" }}>API</span>
        </div>
      </div>
    </div>
  );
}

// NUEVA: Verificación de email
function VerifyEmailScreen() {
  const m = useM();
  const [step, setStep] = useState(0); // 0=pendiente, 1=verificado, 2=expirado, 3=ya verificado
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"center", minHeight:"100%", background:C.bg, padding:m?12:20 }}>
      <div style={{ width:m?"100%":460 }}>
        <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
          {["Pendiente","Verificado","Link expirado","Ya verificado"].map((s,i)=>(
            <div key={s} onClick={()=>setStep(i)} style={{ padding:"4px 10px", borderRadius:9999, fontSize:11, fontWeight:600, cursor:"pointer", background:step===i?C.pri:C.ph, color:step===i?"#fff":C.muted }}>{s}</div>
          ))}
        </div>

        {step===0 && (
          <Cd style={{ padding:m?20:40, textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:12, lineHeight:1 }}>📬</div>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>Verifica tu correo electrónico</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:24, lineHeight:1.6 }}>
              Enviamos un link de verificación a<br/>
              <strong style={{ color:C.text }}>juan@empresa.com</strong>
            </div>
            <div style={{ background:C.inBg, border:"1px solid "+C.border, borderRadius:8, padding:16, marginBottom:24 }}>
              <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Debes verificar tu email para continuar.</div>
              <div style={{ fontSize:12, color:C.muted }}>El link expira en <strong style={{ color:C.warn }}>24 horas</strong>.</div>
            </div>
            <Bt variant="primary" size="lg" style={{ width:"100%", justifyContent:"center", marginBottom:10 }}>Abrir Gmail →</Bt>
            <Bt variant="ghost" style={{ width:"100%", justifyContent:"center" }}>Reenviar email de verificación</Bt>
            <div style={{ marginTop:16, fontSize:11, color:C.muted }}>
              ¿Email incorrecto? <span style={{ color:C.pri, cursor:"pointer" }}>Cambiar dirección →</span>
            </div>
          </Cd>
        )}

        {step===1 && (
          <Cd style={{ padding:m?20:40, textAlign:"center" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:C.ok+"20", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:36 }}>✅</span>
            </div>
            <div style={{ fontSize:20, fontWeight:700, marginBottom:6 }}>¡Email verificado!</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:24 }}>
              <strong>juan@empresa.com</strong> ha sido verificado exitosamente.
            </div>
            <Alert type="ok">Tu cuenta está lista. Serás redirigido automáticamente en 3 segundos...</Alert>
            <Bt variant="primary" size="lg" style={{ width:"100%", justifyContent:"center" }}>Continuar al dashboard →</Bt>
          </Cd>
        )}

        {step===2 && (
          <Cd style={{ padding:m?20:40, textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:12, lineHeight:1 }}>⏰</div>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:6, color:C.err }}>Link expirado</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
              El link de verificación expiró o ya fue utilizado. Los links son válidos por 24 horas.
            </div>
            <Alert type="warn">Tu cuenta existe pero no está verificada. Solicita un nuevo link para activarla.</Alert>
            <Inp label="Confirma tu email" placeholder="juan@empresa.com"/>
            <Bt variant="primary" size="lg" style={{ width:"100%", justifyContent:"center" }}>Reenviar link de verificación</Bt>
            <div style={{ marginTop:12 }}>
              <span style={{ fontSize:12, color:C.pri, cursor:"pointer" }}>← Volver al login</span>
            </div>
          </Cd>
        )}

        {step===3 && (
          <Cd style={{ padding:m?20:40, textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:12, lineHeight:1 }}>👍</div>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>Ya verificado</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:24, lineHeight:1.6 }}>
              Este email ya fue verificado anteriormente. Puedes iniciar sesión directamente.
            </div>
            <Bt variant="primary" size="lg" style={{ width:"100%", justifyContent:"center" }}>Ir al login →</Bt>
          </Cd>
        )}
      </div>
    </div>
  );
}

function ErrorPages() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <Cd style={{ textAlign:"center", padding:24 }}><div style={{ fontSize:48, marginBottom:8 }}>🔍</div><div style={{ fontSize:20, fontWeight:700 }}>No encontrado</div><Bt variant="primary" style={{ marginTop:16 }}>Ir a plataforma.com</Bt></Cd>
      <Cd style={{ textAlign:"center", padding:24 }}><div style={{ fontSize:48, marginBottom:8 }}>🔒</div><div style={{ fontSize:20, fontWeight:700, color:C.err }}>Suspendido</div><div style={{ fontSize:13, color:C.muted, marginTop:8 }}>Contacta soporte</div></Cd>
    </div>
  );
}

function EmailPreviewScreen() {
  return (
    <div>
      <SectionHeader title="Emails transaccionales" prd="PRD 006-E" />
      {[{subj:"🔑 Bienvenido",body:"Tu espacio está listo. URL: mi-empresa.plataforma.com."},{subj:"👥 Invitación",body:"Cesar te invitó como Operador. Link expira en 48h."},{subj:"✅ Solicitud aprobada",body:"REQ-2026-0417 aprobada. Credenciales en camino."}].map((e,i)=>(
        <Cd key={i} style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>De: no-reply@plataforma.com</div>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>{e.subj}</div>
          <div style={{ borderTop:"1px solid "+C.border, paddingTop:12, fontSize:13 }}>{e.body}</div>
          <div style={{ background:C.pri, color:"#fff", padding:"8px 16px", borderRadius:6, display:"inline-block", fontSize:12, fontWeight:600, marginTop:12 }}>Ir a la plataforma →</div>
        </Cd>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTES DE ESTADO REUTILIZABLES
// ─────────────────────────────────────────────

function EmptyState({ icon, title, sub, action, onAction }) {
  return (
    <div style={{ border:"2px dashed "+C.border, borderRadius:12, padding:"40px 24px", textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:12, lineHeight:1 }}>{icon}</div>
      <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:6 }}>{title}</div>
      {sub && <div style={{ fontSize:13, color:C.muted, marginBottom:action?20:0, lineHeight:1.6 }}>{sub}</div>}
      {action && <Bt variant="primary" onClick={onAction}>{action}</Bt>}
    </div>
  );
}

function NetworkError({ onRetry }) {
  return (
    <div style={{ border:"1px solid "+C.err+"30", borderRadius:12, padding:"40px 24px", textAlign:"center", background:C.err+"05" }}>
      <div style={{ fontSize:48, marginBottom:12, lineHeight:1 }}>📡</div>
      <div style={{ fontSize:15, fontWeight:700, color:C.err, marginBottom:6 }}>Error de conexión</div>
      <div style={{ fontSize:13, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
        No pudimos conectar con el servidor.<br/>Verifica tu conexión a internet e intenta de nuevo.
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
        <Bt variant="primary" onClick={onRetry}>↻ Reintentar</Bt>
        <Bt variant="ghost">Reportar problema</Bt>
      </div>
      <div style={{ marginTop:16, fontSize:11, color:C.muted, fontFamily:"monospace" }}>
        Error: Network timeout · 30,000ms · GET /api/v1/...
      </div>
    </div>
  );
}

function SkeletonRow({ cols = 4 }) {
  return (
    <div style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:"1px solid "+C.border, alignItems:"center" }}>
      <div style={{ width:32, height:32, borderRadius:"50%", background:C.ph, flexShrink:0, animation:"pulse 1.5s infinite" }}/>
      {Array.from({length:cols-1}).map((_,i) => (
        <div key={i} style={{ flex:i===0?2:1, height:12, background:C.ph, borderRadius:4, animation:"pulse 1.5s infinite", opacity:1-i*0.15 }}/>
      ))}
    </div>
  );
}

function TableSkeleton({ rows=4, cols=4 }) {
  return (
    <div>
      <style>{"@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}"}</style>
      <div style={{ display:"flex", gap:12, padding:"10px 12px", borderBottom:"2px solid "+C.border, marginBottom:4 }}>
        {Array.from({length:cols}).map((_,i) => <div key={i} style={{ flex:i===0?2:1, height:10, background:C.ph, borderRadius:3, animation:"pulse 1.5s infinite" }}/>)}
      </div>
      {Array.from({length:rows}).map((_,i) => <SkeletonRow key={i} cols={cols}/>)}
    </div>
  );
}

// ─────────────────────────────────────────────
// PANTALLA DE ESTADOS — galería completa
// ─────────────────────────────────────────────
function StatesGalleryScreen({ setNav }) {
  const m = useM(); const C = useC();
  const [netErr, setNetErr] = useState(false);
  const [section, setSection] = useState(0);
  const sections = ["Vacíos","Carga / Skeleton","Error de red","Primer uso"];

  return (
    <div>
      <SectionHeader title="Estados de pantalla" prd="UX States" sub="Vacíos, carga, errores de red y primer uso — reutilizables en toda la plataforma"/>

      <div style={{ display:"flex", gap:6, marginBottom:24, flexWrap:"wrap" }}>
        {sections.map((s,i) => (
          <div key={s} onClick={()=>setSection(i)} style={{ padding:"6px 14px", borderRadius:9999, fontSize:12, fontWeight:600, cursor:"pointer", background:section===i?C.pri:C.ph, color:section===i?"#fff":C.muted }}>{s}</div>
        ))}
      </div>

      {/* ── ESTADOS VACÍOS ── */}
      {section===0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          <Cd title="Tabla de usuarios — sin usuarios aún">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
              <div style={{ fontSize:13, color:C.muted }}>0 usuarios</div>
              <Bt variant="primary" size="sm">+ Invitar primer usuario</Bt>
            </div>
            <div style={{ border:"1px solid "+C.border, borderRadius:8, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead><tr>{["Usuario","Rol","Estado",""].map((h,i)=><th key={i} style={{ textAlign:"left", padding:"8px 12px", borderBottom:"2px solid "+C.border, color:C.muted, fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
                <tbody><tr><td colSpan={4} style={{ padding:"40px 12px" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>👥</div>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>Aún no hay usuarios</div>
                    <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Invita a tu equipo para comenzar a colaborar.</div>
                    <Bt variant="primary" size="sm">+ Invitar usuario</Bt>
                  </div>
                </td></tr></tbody>
              </table>
            </div>
          </Cd>

          <Cd title="Notificaciones — sin notificaciones">
            <div style={{ display:"flex", gap:8, marginBottom:16 }}><Bt variant="primary" size="sm">Todas (0)</Bt><Bt variant="ghost" size="sm">No leídas (0)</Bt></div>
            <EmptyState icon="🔔" title="Sin notificaciones" sub="Cuando ocurran eventos importantes en tu cuenta, aparecerán aquí."/>
          </Cd>

          <Cd title="Auditoría — sin registros">
            <EmptyState icon="📋" title="Sin registros de auditoría" sub="Las acciones realizadas por los usuarios de tu workspace quedarán registradas aquí."/>
          </Cd>

          <Cd title="Archivos — sin archivos">
            <div style={{ border:"2px dashed "+C.border, borderRadius:12, padding:"48px 24px", textAlign:"center", background:C.inBg, cursor:"pointer" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📁</div>
              <div style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>Arrastra archivos aquí</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:16 }}>o haz clic para seleccionarlos · PNG, JPG, PDF · Máx 10MB</div>
              <Bt variant="outline">Seleccionar archivos</Bt>
            </div>
          </Cd>

          <Cd title="Tickets de soporte — sin tickets">
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}><Bt variant="primary" size="sm">+ Nuevo ticket</Bt></div>
            <EmptyState icon="💬" title="Sin tickets de soporte" sub="¿Todo funcionando bien? Si tienes algún problema, crea un ticket y te ayudamos."/>
          </Cd>

          <Cd title="Admin · Tenants — plataforma recién creada">
            <EmptyState icon="🏢" title="Aún no hay tenants" sub="Cuando las primeras empresas se registren o crees un tenant manualmente, aparecerán aquí." action="+ Crear primer tenant"/>
          </Cd>

          <Cd title="Admin · Aprobaciones — sin solicitudes pendientes">
            <EmptyState icon="✅" title="Todo al día" sub="No hay solicitudes de nuevos tenants pendientes de revisión."/>
          </Cd>
        </div>
      )}

      {/* ── CARGA / SKELETON ── */}
      {section===1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <style>{"@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes spin{to{transform:rotate(360deg)}}"}</style>

          <Cd title="Skeleton — tabla de usuarios cargando">
            <TableSkeleton rows={5} cols={4}/>
          </Cd>

          <Cd title="Skeleton — dashboard cargando">
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:16 }}>
              {[1,2,3,4].map(i=>(
                <div key={i} style={{ background:C.ph, borderRadius:8, padding:16, animation:"pulse 1.5s infinite" }}>
                  <div style={{ height:10, background:"#e2e8f0", borderRadius:3, width:"60%", marginBottom:8 }}/>
                  <div style={{ height:24, background:"#e2e8f0", borderRadius:3, width:"40%" }}/>
                </div>
              ))}
            </div>
            <div style={{ background:C.ph, borderRadius:8, padding:16, animation:"pulse 1.5s infinite" }}>
              <div style={{ height:12, background:"#e2e8f0", borderRadius:3, width:"30%", marginBottom:16 }}/>
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(3,1fr)", gap:8 }}>
                {[1,2,3].map(i=><div key={i} style={{ height:72, background:"#e2e8f0", borderRadius:6 }}/>)}
              </div>
            </div>
          </Cd>

          <Cd title="Skeleton — lista de notificaciones cargando">
            {[1,2,3].map(i=>(
              <div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:"1px solid "+C.border, alignItems:"flex-start" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:C.ph, flexShrink:0, animation:"pulse 1.5s infinite" }}/>
                <div style={{ flex:1 }}>
                  <div style={{ height:10, background:C.ph, borderRadius:3, width:(80-i*10)+"%", marginBottom:8, animation:"pulse 1.5s infinite" }}/>
                  <div style={{ height:8, background:C.ph, borderRadius:3, width:(60-i*5)+"%", animation:"pulse 1.5s infinite" }}/>
                </div>
                <div style={{ width:30, height:8, background:C.ph, borderRadius:3, animation:"pulse 1.5s infinite" }}/>
              </div>
            ))}
          </Cd>

          <Cd title="Skeleton — perfil de empresa cargando">
            <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:20 }}>
              <div style={{ width:64, height:64, borderRadius:12, background:C.ph, flexShrink:0, animation:"pulse 1.5s infinite" }}/>
              <div style={{ flex:1 }}>
                <div style={{ height:14, background:C.ph, borderRadius:3, width:"50%", marginBottom:8, animation:"pulse 1.5s infinite" }}/>
                <div style={{ height:10, background:C.ph, borderRadius:3, width:"70%", marginBottom:6, animation:"pulse 1.5s infinite" }}/>
                <div style={{ display:"flex", gap:6 }}>
                  <div style={{ width:60, height:18, background:C.ph, borderRadius:9999, animation:"pulse 1.5s infinite" }}/>
                  <div style={{ width:60, height:18, background:C.ph, borderRadius:9999, animation:"pulse 1.5s infinite" }}/>
                </div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12 }}>
              {[1,2,3,4,5,6].map(i=>(
                <div key={i}>
                  <div style={{ height:8, background:C.ph, borderRadius:3, width:"40%", marginBottom:6, animation:"pulse 1.5s infinite" }}/>
                  <div style={{ height:36, background:C.ph, borderRadius:6, animation:"pulse 1.5s infinite" }}/>
                </div>
              ))}
            </div>
          </Cd>

          <Cd title="Spinners — variantes">
            <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap", padding:8 }}>
              {[20,28,36,48].map(s=>(
                <div key={s} style={{ textAlign:"center" }}>
                  <div style={{ width:s, height:s, border:"3px solid "+C.ph, borderTop:"3px solid "+C.pri, borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto" }}/>
                  <div style={{ fontSize:10, color:C.muted, marginTop:6 }}>{s}px</div>
                </div>
              ))}
              <div style={{ textAlign:"center" }}>
                <div style={{ display:"inline-flex", gap:4 }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:8, height:8, borderRadius:"50%", background:C.pri, animation:`pulse 1.2s ${i*0.2}s infinite` }}/>)}
                </div>
                <div style={{ fontSize:10, color:C.muted, marginTop:6 }}>Dots</div>
              </div>
              <div style={{ flex:1, minWidth:140 }}>
                <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>Barra de progreso</div>
                <div style={{ background:C.ph, borderRadius:4, height:8, overflow:"hidden" }}>
                  <div style={{ background:C.pri, width:"65%", height:"100%", borderRadius:4, animation:"pulse 2s infinite" }}/>
                </div>
                <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>Cargando... 65%</div>
              </div>
            </div>
          </Cd>
        </div>
      )}

      {/* ── ERROR DE RED ── */}
      {section===2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          <Cd title="Error de red — pantalla completa (tabla)">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontSize:16, fontWeight:700 }}>Usuarios</div>
              <Bt variant="primary" size="sm" style={{ opacity:0.4 }} >+ Invitar</Bt>
            </div>
            <NetworkError onRetry={()=>setNetErr(false)}/>
          </Cd>

          <Cd title="Error de red — banner inline (no bloquea toda la pantalla)">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontSize:16, fontWeight:700 }}>Dashboard</div>
            </div>
            <div style={{ background:C.err+"08", border:"1px solid "+C.err+"30", borderRadius:8, padding:"10px 14px", display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <span style={{ fontSize:16 }}>⚠️</span>
              <div style={{ flex:1, fontSize:12, color:C.err }}>No se pudieron cargar algunos datos. La información puede estar desactualizada.</div>
              <Bt variant="ghost" size="sm" style={{ color:C.err, border:"1px solid "+C.err+"40" }}>Reintentar</Bt>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(4,1fr)", gap:10 }}>
              {["Módulos","Usuarios","Storage","Plan"].map((l,i)=>(
                <Cd key={l} style={{ textAlign:"center", opacity: i===1||i===2?1:0.4 }}>
                  <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", fontWeight:600 }}>{l}</div>
                  {i===1||i===2 ? <div style={{ fontSize:22, fontWeight:700, color:C.pri, margin:"4px 0" }}>{i===1?"3":"0.1"}</div> : <div style={{ height:22, background:C.ph, borderRadius:4, margin:"4px 8px", animation:"pulse 1.5s infinite" }}/>}
                </Cd>
              ))}
            </div>
          </Cd>

          <Cd title="Error 500 — fallo interno del servidor">
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{ fontSize:56, marginBottom:12 }}>💥</div>
              <div style={{ fontSize:18, fontWeight:700, marginBottom:6, color:C.err }}>Algo salió mal</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:8, lineHeight:1.6 }}>
                Ocurrió un error inesperado en el servidor. Nuestro equipo fue notificado automáticamente.
              </div>
              <div style={{ fontFamily:"monospace", fontSize:11, color:C.muted, background:C.ph, padding:"6px 12px", borderRadius:6, display:"inline-block", marginBottom:20 }}>
                Error ID: ERR-2026-04-abc123
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                <Bt variant="primary">↻ Recargar página</Bt>
                <Bt variant="ghost">Reportar problema</Bt>
              </div>
            </div>
          </Cd>

          <Cd title="Error 403 — sin permisos">
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{ fontSize:56, marginBottom:12 }}>🔒</div>
              <div style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>Acceso restringido</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
                No tienes permisos para ver esta sección.<br/>Contacta al administrador de tu workspace.
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                <Bt variant="outline">← Volver</Bt>
                <Bt variant="ghost">Contactar admin</Bt>
              </div>
            </div>
          </Cd>
        </div>
      )}

      {/* ── PRIMER USO ── */}
      {section===3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          <Cd title="Dashboard — tenant recién creado, sin datos">
            <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>Dashboard</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Workspace creado hace 5 minutos</div>

            {/* Banner bienvenida */}
            <div style={{ background:"linear-gradient(135deg, "+C.pri+"15, "+C.purp+"10)", border:"1px solid "+C.pri+"30", borderRadius:12, padding:20, marginBottom:16, display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ fontSize:40 }}>🎉</div>
              <div style={{ flex:1, minWidth:180 }}>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>¡Bienvenido a la plataforma, Cesar!</div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>Tu workspace <strong>mi-empresa.plataforma.com</strong> está listo. Sigue los pasos para comenzar.</div>
              </div>
              <Bt variant="primary" onClick={()=>setNav&&setNav("onboarding-inc")}>Iniciar configuración →</Bt>
            </div>

            {/* KPIs en cero */}
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:16 }}>
              {[["Módulos","0","Disponibles en Fase 1",C.muted],["Usuarios","1","Solo tú por ahora",C.pri],["Storage","0 GB","de 5 GB",C.ok],["Plan","Starter","$180/mes",C.purp]].map(([l,v,s,c])=>(
                <Cd key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", fontWeight:600 }}>{l}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:c, margin:"4px 0" }}>{v}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{s}</div>
                </Cd>
              ))}
            </div>

            {/* Checklist de primeros pasos */}
            <Cd title="Primeros pasos" style={{ background:C.inBg }}>
              {[
                { done:true,  label:"Crear tu workspace",        time:"Completado" },
                { done:true,  label:"Verificar tu email",        time:"Completado" },
                { done:false, label:"Completar perfil de empresa", time:"~2 min" },
                { done:false, label:"Subir tu logo",              time:"~1 min" },
                { done:false, label:"Invitar a tu equipo",        time:"~3 min" },
                { done:false, label:"Explorar los módulos",       time:"~5 min" },
              ].map((s,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<5?"1px solid "+C.border:"none" }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:s.done?C.ok+"20":C.ph, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {s.done ? <span style={{ fontSize:12 }}>✓</span> : <span style={{ fontSize:11, fontWeight:700, color:C.muted }}>{i+1}</span>}
                  </div>
                  <div style={{ flex:1, fontSize:13, color:s.done?C.muted:C.text, textDecoration:s.done?"line-through":"none", fontWeight:s.done?400:500 }}>{s.label}</div>
                  <div style={{ fontSize:11, color:s.done?C.ok:C.muted, fontWeight:s.done?600:400 }}>{s.time}</div>
                  {!s.done && <Bt variant="outline" size="sm">Ir →</Bt>}
                </div>
              ))}
            </Cd>
          </Cd>

          <Cd title="Admin Overview — plataforma recién lanzada, sin tenants">
            <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>Overview ejecutivo</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Plataforma iniciada hace 1 día</div>

            <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:16 }}>
              {[["MRR","$0",C.muted],["Tenants activos","0",C.muted],["Churn","—",C.muted],["ARR proyectado","$0",C.muted]].map(([l,v,c])=>(
                <Cd key={l} style={{ textAlign:"center", opacity:0.6 }}>
                  <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", fontWeight:600 }}>{l}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:c, margin:"4px 0" }}>{v}</div>
                </Cd>
              ))}
            </div>

            <div style={{ background:C.pri+"06", border:"2px dashed "+C.pri+"30", borderRadius:12, padding:32, textAlign:"center", marginBottom:16 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🚀</div>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>La plataforma está lista</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
                Aún no hay tenants registrados. Comparte el link de registro<br/>o crea el primer tenant manualmente.
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
                <Bt variant="primary">+ Crear primer tenant</Bt>
                <Bt variant="outline">📋 Copiar link de registro</Bt>
              </div>
            </div>

            <Cd title="Lista de verificación inicial" style={{ background:C.inBg }}>
              {[
                { done:true,  label:"Infraestructura desplegada" },
                { done:true,  label:"Dominio configurado" },
                { done:true,  label:"Templates de email activos" },
                { done:false, label:"Primer tenant creado" },
                { done:false, label:"Plan de precios publicado" },
                { done:false, label:"Webhooks configurados" },
              ].map((s,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<5?"1px solid "+C.border:"none" }}>
                  <span style={{ fontSize:14 }}>{s.done?"✅":"⬜"}</span>
                  <span style={{ fontSize:13, color:s.done?C.muted:C.text, textDecoration:s.done?"line-through":"none" }}>{s.label}</span>
                </div>
              ))}
            </Cd>
          </Cd>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TENANT SCREENS — completas
// ─────────────────────────────────────────────
function ShellScreen({ setNav }) {
  const m = useM(); const C = useC();
  return (
    <div>
      <SectionHeader title="Dashboard" prd="PRD 004" sub="Shell de la consola tenant" />
      <div style={{ background:C.pri+"08", border:"1px solid "+C.pri+"30", borderRadius:8, padding:12, marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:20 }}>👋</span>
        <div><div style={{ fontSize:13, fontWeight:600, color:C.pri }}>¡Bienvenido, Cesar!</div><div style={{ fontSize:11, color:C.muted }}>Completa la configuración inicial para empezar.</div></div>
        <Bt variant="primary" size="sm" style={{ marginLeft:"auto", flexShrink:0 }} onClick={()=>setNav("onboarding-inc")}>Completar →</Bt>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        <SC2 label="Módulos" value="0" sub="Fase 1+" color={C.muted}/>
        <SC2 label="Usuarios" value="3" sub="de 5" color={C.pri}/>
        <SC2 label="Storage" value="0.1" sub="GB" color={C.ok}/>
        <SC2 label="Plan" value="Starter" color={C.purp}/>
      </div>
      <Cd title="Acciones rápidas">
        <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(3,1fr)", gap:8 }}>
          {[["⚙️","Config","config"],["👥","Usuarios","users"],["📋","Auditoría","audit"],["🔔","Notif.","notif-prefs"],["📊","Mi Plan","my-plan"],["📁","Archivos","files"]].map(it=>(
            <div key={it[2]} onClick={()=>setNav(it[2])} style={{ padding:12, border:"1px solid "+C.border, borderRadius:8, textAlign:"center", cursor:"pointer" }}>
              <div style={{ fontSize:20 }}>{it[0]}</div>
              <div style={{ fontSize:12, fontWeight:500, marginTop:4 }}>{it[1]}</div>
            </div>
          ))}
        </div>
      </Cd>
    </div>
  );
}

function OnboardingIncompleteScreen({ setNav }) {
  const m = useM(); const C = useC();
  const steps2 = [
    { label:"Datos de empresa",       done:true,  screen:"company-profile" },
    { label:"Configuración regional", done:true,  screen:"config" },
    { label:"Branding y logo",        done:false, screen:"company-profile" },
    { label:"Invitar primer usuario", done:false, screen:"users" },
    { label:"Explorar módulos",       done:false, screen:"dashboard" },
  ];
  const done = steps2.filter(s=>s.done).length;
  const pct = Math.round((done/steps2.length)*100);
  return (
    <div>
      <SectionHeader title="Configura tu espacio" sub="Completa los pasos para activar todas las funciones"/>
      <Cd style={{ marginBottom:16, background:C.pri+"04", border:"1px solid "+C.pri+"20" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ fontSize:14, fontWeight:600 }}>Progreso de configuración</div>
          <span style={{ fontSize:14, fontWeight:700, color:C.pri }}>{pct}%</span>
        </div>
        <div style={{ background:C.ph, borderRadius:4, height:10, marginBottom:8 }}>
          <div style={{ background:C.pri, width:pct+"%", height:"100%", borderRadius:4 }}/>
        </div>
        <div style={{ fontSize:12, color:C.muted }}>{done} de {steps2.length} pasos completados</div>
      </Cd>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {steps2.map((s,i)=>(
          <Cd key={i} style={{ borderLeft:"3px solid "+(s.done?C.ok:C.border), cursor:s.done?"default":"pointer" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:s.done?C.ok+"20":C.ph, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                {s.done?"✅":<span style={{ fontSize:13, fontWeight:700, color:C.muted }}>{i+1}</span>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:s.done?C.muted:C.text }}>{s.label}</div>
                <div style={{ fontSize:11, color:C.muted }}>{s.done?"Completado":"Pendiente"}</div>
              </div>
              {!s.done&&<Bt variant="primary" size="sm" onClick={()=>setNav(s.screen)}>Completar →</Bt>}
            </div>
          </Cd>
        ))}
      </div>
      <div style={{ marginTop:16, textAlign:"center" }}>
        <span style={{ fontSize:12, color:C.muted, cursor:"pointer" }}>Saltar por ahora — completar más tarde</span>
      </div>
    </div>
  );
}

function CompanyProfileScreen() {
  const m = useM(); const C = useC();
  const { pc, sc, setPc, setSc } = useContext(ThemeCtx);
  const [tab, setTab] = useState(0);
  const tabs = ["Datos generales","Branding","Subdominio"];
  const priSwatches = ["#3B82F6","#6366F1","#22C55E","#EF4444","#F59E0B","#06B6D4","#8B5CF6","#EC4899"];
  const secSwatches = ["#1E40AF","#14532D","#4C1D95","#1E293B","#164E63","#0F172A","#F8FAFC","#7C2D12"];
  return (
    <div>
      <SectionHeader title="Perfil de Empresa" prd="PRD 009" sub="Información corporativa y configuración visual del tenant"/>
      <div style={{ display:"flex", background:"#fff", borderRadius:"8px 8px 0 0", border:"1px solid "+C.border, borderBottom:"none", overflowX:"auto" }}>
        {tabs.map((t,i)=><div key={t} onClick={()=>setTab(i)} style={{ padding:"10px 16px", fontSize:13, fontWeight:tab===i?700:400, color:tab===i?C.pri:C.muted, borderBottom:"2px solid "+(tab===i?C.pri:"transparent"), cursor:"pointer", whiteSpace:"nowrap" }}>{t}</div>)}
      </div>
      <div style={{ border:"1px solid "+C.border, borderRadius:"0 0 8px 8px", background:"#fff", padding:20, marginBottom:16 }}>
        {tab===0&&(
          <div>
            <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:20 }}>
              <div style={{ width:64, height:64, borderRadius:12, background:C.ph, border:"2px dashed "+C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:C.muted, cursor:"pointer", flexShrink:0 }}>Logo</div>
              <div>
                <div style={{ fontSize:16, fontWeight:700 }}>Empresa S.A.S.</div>
                <div style={{ fontSize:12, color:C.muted }}>mi-empresa.plataforma.com · Plan Starter</div>
                <div style={{ display:"flex", gap:6, marginTop:6 }}><Bd color={C.ok}>ACTIVE</Bd><Bd color={C.purp}>Starter</Bd></div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12 }}>
              <Inp label="Razón social *" placeholder="Empresa S.A.S."/>
              <Inp label="NIT *" placeholder="900.123.456-7"/>
              <Inp label="Dirección" placeholder="Cra 7 #45-12, Bogotá"/>
              <Inp label="Teléfono corporativo" placeholder="+57 1 234 5678"/>
              <Inp label="Sector industrial" placeholder="Manufactura"/>
              <Inp label="Sitio web" placeholder="https://empresa.com"/>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}><Bt variant="primary">Guardar cambios</Bt></div>
          </div>
        )}
        {tab===1&&(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:20 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Logo actual</div>
                <div style={{ border:"2px dashed "+C.border, borderRadius:8, padding:24, textAlign:"center", marginBottom:12 }}>
                  <div style={{ width:80, height:80, borderRadius:12, background:C.ph, margin:"0 auto 8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:C.muted }}>Logo</div>
                  <Bt variant="outline" size="sm">Cambiar logo</Bt>
                </div>
                <div style={{ fontSize:11, color:C.muted }}>PNG o SVG · Máx 2MB · Recomendado 200×60px</div>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Colores del tema</div>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>Color primario</div>
                  <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                    {priSwatches.map(c=><div key={c} onClick={()=>setPc(c)} style={{ width:28, height:28, borderRadius:6, background:c, cursor:"pointer", border:pc===c?"2px solid #000":"2px solid transparent" }}/>)}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:C.inBg, border:"1px solid "+C.border, borderRadius:6, padding:"6px 10px" }}>
                    <div style={{ width:24, height:24, borderRadius:4, background:pc, flexShrink:0 }}/>
                    <input value={pc} onChange={e=>{const v=e.target.value;if(v.match(/^#?[0-9A-Fa-f]{0,6}$/))setPc(v.startsWith("#")?v:"#"+v);}} style={{ border:"none", background:"transparent", fontFamily:"monospace", fontSize:13, outline:"none", width:"100%" }}/>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>Color secundario / Sidebar</div>
                  <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                    {secSwatches.map(c=><div key={c} onClick={()=>setSc(c)} style={{ width:28, height:28, borderRadius:6, background:c, cursor:"pointer", border:sc===c?"2px solid #000":"2px solid transparent" }}/>)}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:C.inBg, border:"1px solid "+C.border, borderRadius:6, padding:"6px 10px" }}>
                    <div style={{ width:24, height:24, borderRadius:4, background:sc, flexShrink:0 }}/>
                    <input value={sc} onChange={e=>{const v=e.target.value;if(v.match(/^#?[0-9A-Fa-f]{0,6}$/))setSc(v.startsWith("#")?v:"#"+v);}} style={{ border:"none", background:"transparent", fontFamily:"monospace", fontSize:13, outline:"none", width:"100%" }}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab===2&&(
          <div>
            <Alert type="info">El subdominio no puede cambiarse después de la creación. Contacta soporte si necesitas migrar.</Alert>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:500, color:C.muted, marginBottom:6 }}>URL de acceso</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:C.inBg, border:"1px solid "+C.border, borderRadius:6, padding:"10px 14px" }}>
                <span style={{ fontFamily:"monospace", fontSize:14, fontWeight:600 }}>mi-empresa</span>
                <span style={{ color:C.muted, fontSize:14 }}>.plataforma.com</span>
                <Bt variant="ghost" size="sm" style={{ marginLeft:"auto" }}>📋 Copiar</Bt>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActiveSessionsScreen() {
  const m = useM(); const C = useC();
  const [showConfirm, setShowConfirm] = useState(false);
  const sessions = [
    { device:"Chrome · macOS",    ip:"181.55.32.14", loc:"Bogotá, CO",   time:"Ahora",   current:true,  icon:"💻" },
    { device:"Safari · iPhone 15",ip:"181.55.32.15", loc:"Bogotá, CO",   time:"hace 2h", current:false, icon:"📱" },
    { device:"Chrome · Windows",  ip:"190.24.11.8",  loc:"Medellín, CO", time:"hace 1d", current:false, icon:"🖥️" },
    { device:"App móvil · Android",ip:"200.13.44.2", loc:"Cali, CO",     time:"hace 3d", current:false, icon:"📲" },
  ];
  return (
    <div>
      <SectionHeader title="Sesiones activas" prd="PRD 005" sub="Dispositivos con sesión iniciada en tu cuenta"/>
      <Alert type="warn">Si ves una sesión que no reconoces, ciérrala inmediatamente y cambia tu contraseña.</Alert>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
        <Bt variant="danger" size="sm" onClick={()=>setShowConfirm(true)}>Cerrar todas las demás sesiones</Bt>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {sessions.map((s,i)=>(
          <Cd key={i} style={{ borderLeft:"3px solid "+(s.current?C.ok:C.border) }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              <div style={{ fontSize:28, flexShrink:0 }}>{s.icon}</div>
              <div style={{ flex:1, minWidth:120 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontWeight:600, fontSize:13 }}>{s.device}</span>
                  {s.current&&<Bd color={C.ok}>Sesión actual</Bd>}
                </div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s.ip} · {s.loc} · {s.time}</div>
              </div>
              {!s.current&&<Bt variant="danger" size="sm">Cerrar</Bt>}
            </div>
          </Cd>
        ))}
      </div>
      <Modal show={showConfirm} onClose={()=>setShowConfirm(false)} title="¿Cerrar todas las sesiones?" width={420}>
        <Alert type="warn">Se cerrará la sesión en todos los dispositivos excepto este.</Alert>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Bt variant="ghost" onClick={()=>setShowConfirm(false)}>Cancelar</Bt>
          <Bt variant="danger">Sí, cerrar todas</Bt>
        </div>
      </Modal>
    </div>
  );
}

function HabeasDataScreen() {
  const m = useM(); const C = useC();
  const [tab, setTab] = useState(0);
  const [showConsent, setShowConsent] = useState(false);
  const tabs = ["Mi consentimiento","Mis datos","Solicitudes"];
  return (
    <div>
      <SectionHeader title="Privacidad y Habeas Data" prd="PRD 009 · Ley 1581/2012" sub="Gestión de datos personales conforme a la normativa colombiana"/>
      <div style={{ display:"flex", background:"#fff", borderRadius:"8px 8px 0 0", border:"1px solid "+C.border, borderBottom:"none", overflowX:"auto" }}>
        {tabs.map((t,i)=><div key={t} onClick={()=>setTab(i)} style={{ padding:"10px 16px", fontSize:13, fontWeight:tab===i?700:400, color:tab===i?C.pri:C.muted, borderBottom:"2px solid "+(tab===i?C.pri:"transparent"), cursor:"pointer", whiteSpace:"nowrap" }}>{t}</div>)}
      </div>
      <div style={{ border:"1px solid "+C.border, borderRadius:"0 0 8px 8px", background:"#fff", padding:20 }}>
        {tab===0&&(
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
              <div style={{ fontSize:14, fontWeight:600 }}>Estado de consentimientos</div>
              <Bt variant="outline" size="sm" onClick={()=>setShowConsent(true)}>Ver política completa</Bt>
            </div>
            {[
              { label:"Tratamiento de datos personales",          date:"15/01/2026", status:"Aceptado",    req:true  },
              { label:"Comunicaciones comerciales y marketing",   date:"15/01/2026", status:"Aceptado",    req:false },
              { label:"Transferencia a terceros autorizados",     date:"—",          status:"No aceptado", req:false },
              { label:"Uso de cookies analíticas",                date:"15/01/2026", status:"Aceptado",    req:false },
            ].map((c,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid "+C.border, gap:8, flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ fontSize:13, fontWeight:500 }}>{c.label}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{c.req?"🔒 Obligatorio · ":"Opcional · "}Aceptado: {c.date}</div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <Bd color={c.status==="Aceptado"?C.ok:C.muted}>{c.status}</Bd>
                  {!c.req&&<Bt variant={c.status==="Aceptado"?"danger":"outline"} size="sm">{c.status==="Aceptado"?"Retirar":"Aceptar"}</Bt>}
                </div>
              </div>
            ))}
          </div>
        )}
        {tab===1&&(
          <div>
            <Alert type="info">Datos personales registrados conforme al Art. 8 de la Ley 1581 de 2012.</Alert>
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:0 }}>
              {[["Nombre completo","Cesar Echeverria"],["Email","admin@empresa.com"],["Teléfono","+57 300 123 4567"],["Cargo","Administrador"],["Fecha registro","15/01/2026"],["Última actualización","02/04/2026"]].map(([k,v],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid "+C.border }}>
                  <span style={{ fontSize:12, color:C.muted }}>{k}</span>
                  <span style={{ fontSize:13, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, display:"flex", gap:8, flexWrap:"wrap" }}>
              <Bt variant="outline" size="sm">✏️ Actualizar mis datos</Bt>
              <Bt variant="outline" size="sm">📥 Exportar mis datos</Bt>
            </div>
          </div>
        )}
        {tab===2&&(
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:600 }}>Solicitudes de derechos</div>
              <Bt variant="primary" size="sm">+ Nueva solicitud</Bt>
            </div>
            <div style={{ background:C.inBg, borderRadius:8, padding:12, marginBottom:16, fontSize:12, color:C.muted }}>
              Derechos de <strong>Acceso, Corrección, Supresión, Revocación y Portabilidad</strong> · Respuesta máx. 15 días hábiles.
            </div>
            {[
              { tipo:"Corrección", desc:"Actualizar número de teléfono", fecha:"01/04/2026", estado:"En proceso"  },
              { tipo:"Acceso",     desc:"Exportar historial completo",    fecha:"15/03/2026", estado:"Completado" },
            ].map((s,i)=>(
              <Cd key={i} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                  <div>
                    <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}><Bd color={C.purp}>{s.tipo}</Bd><span style={{ fontSize:13 }}>{s.desc}</span></div>
                    <div style={{ fontSize:11, color:C.muted }}>{s.fecha}</div>
                  </div>
                  <Bd color={s.estado==="Completado"?C.ok:C.warn}>{s.estado}</Bd>
                </div>
              </Cd>
            ))}
          </div>
        )}
      </div>
      <Modal show={showConsent} onClose={()=>setShowConsent(false)} title="Política de Tratamiento de Datos" width={560}>
        <div style={{ background:C.inBg, borderRadius:8, padding:16, fontSize:12, lineHeight:1.7, marginBottom:16 }}>
          <div style={{ fontWeight:700, marginBottom:8 }}>Responsable del tratamiento</div>
          <p style={{ margin:"0 0 8px" }}>Plataforma S.A.S., NIT 900.000.001-1, cumplimiento Ley 1581/2012 y Decreto 1377/2013.</p>
          <div style={{ fontWeight:700, marginBottom:8 }}>Finalidades</div>
          <p style={{ margin:"0 0 8px" }}>Gestión del contrato · Soporte · Facturación · Comunicaciones · Mejora del producto</p>
          <div style={{ fontWeight:700, marginBottom:8 }}>Derechos del titular</div>
          <p style={{ margin:0 }}>Acceso · Corrección · Supresión · Revocación · Portabilidad · Queja ante la SIC</p>
        </div>
        <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Versión 2.1 · Vigente desde 01/01/2026 · Registrada en RNBD</div>
        <div style={{ display:"flex", justifyContent:"flex-end" }}><Bt variant="primary" onClick={()=>setShowConsent(false)}>Entendido</Bt></div>
      </Modal>
    </div>
  );
}

function SupportScreen() {
  const m = useM(); const C = useC();
  const [tab, setTab] = useState(0);
  const [showTicket, setShowTicket] = useState(false);
  const tabs = ["Tickets","Estado del servicio","Base de conocimiento"];
  return (
    <div>
      <SectionHeader title="Soporte" prd="PRD 006-C" sub="Tickets, estado del servicio y documentación"/>
      <div style={{ display:"flex", background:"#fff", borderRadius:"8px 8px 0 0", border:"1px solid "+C.border, borderBottom:"none", overflowX:"auto" }}>
        {tabs.map((t,i)=><div key={t} onClick={()=>setTab(i)} style={{ padding:"10px 16px", fontSize:13, fontWeight:tab===i?700:400, color:tab===i?C.pri:C.muted, borderBottom:"2px solid "+(tab===i?C.pri:"transparent"), cursor:"pointer", whiteSpace:"nowrap" }}>{t}</div>)}
      </div>
      <div style={{ border:"1px solid "+C.border, borderRadius:"0 0 8px 8px", background:"#fff", padding:20 }}>
        {tab===0&&(
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:13, color:C.muted }}>2 tickets abiertos</div>
              <Bt variant="primary" size="sm" onClick={()=>setShowTicket(true)}>+ Nuevo ticket</Bt>
            </div>
            {[
              { id:"TKT-1041", title:"Error al exportar reporte PDF",    cat:"Bug",      prio:"Alta",   estado:"En progreso", fecha:"01/04" },
              { id:"TKT-1038", title:"¿Cómo agregar más usuarios?",      cat:"Consulta", prio:"Normal", estado:"Respondido",  fecha:"28/03" },
              { id:"TKT-1022", title:"Solicitud de factura marzo",        cat:"Facturación",prio:"Normal",estado:"Cerrado",   fecha:"15/03" },
            ].map((t2,i)=>(
              <Cd key={i} style={{ marginBottom:8, cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4, flexWrap:"wrap" }}>
                      <span style={{ fontSize:11, fontFamily:"monospace", color:C.muted }}>{t2.id}</span>
                      <Bd color={t2.cat==="Bug"?C.err:t2.cat==="Facturación"?C.purp:C.pri}>{t2.cat}</Bd>
                      <Bd color={t2.prio==="Alta"?C.err:C.muted}>{t2.prio}</Bd>
                    </div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{t2.title}</div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Abierto: {t2.fecha}</div>
                  </div>
                  <Bd color={t2.estado==="En progreso"?C.warn:t2.estado==="Respondido"?C.pri:C.muted}>{t2.estado}</Bd>
                </div>
              </Cd>
            ))}
          </div>
        )}
        {tab===1&&(
          <div>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:16 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:C.ok }}/>
              <span style={{ fontSize:14, fontWeight:600, color:C.ok }}>Todos los sistemas operativos</span>
            </div>
            {[
              { svc:"API Principal",         uptime:"99.98%", status:"Operativo", color:C.ok   },
              { svc:"Autenticación (Keycloak)",uptime:"99.95%",status:"Operativo", color:C.ok   },
              { svc:"Almacenamiento (S3)",   uptime:"100%",   status:"Operativo", color:C.ok   },
              { svc:"Notificaciones (SES)",  uptime:"99.80%", status:"Degradado", color:C.warn },
              { svc:"Portal web",            uptime:"99.99%", status:"Operativo", color:C.ok   },
            ].map((s,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid "+C.border }}>
                <span style={{ fontSize:13 }}>{s.svc}</span>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:C.muted }}>{s.uptime} 30d</span>
                  <Bd color={s.color}>{s.status}</Bd>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab===2&&(
          <div>
            <div style={{ background:C.inBg, border:"1px solid "+C.border, borderRadius:6, padding:"8px 12px", display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <span style={{ color:C.muted }}>🔍</span>
              <span style={{ fontSize:13, color:C.muted }}>Buscar en la documentación...</span>
            </div>
            {[
              { cat:"Primeros pasos",    arts:["¿Cómo invitar usuarios?","Configurar branding","Subir primer reporte"] },
              { cat:"Gestión de usuarios",arts:["Roles y permisos","Invitaciones pendientes","Desactivar usuarios"] },
              { cat:"Facturación y planes",arts:["¿Cómo actualizar mi plan?","Descargar facturas","Métodos de pago"] },
            ].map((g,i)=>(
              <div key={i} style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", marginBottom:6 }}>{g.cat}</div>
                {g.arts.map((a,j)=>(
                  <div key={j} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid "+C.border, cursor:"pointer" }}>
                    <span style={{ fontSize:13, color:C.pri }}>{a}</span>
                    <span style={{ color:C.muted }}>→</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal show={showTicket} onClose={()=>setShowTicket(false)} title="Nuevo ticket de soporte" width={500}>
        <Inp label="Asunto *" placeholder="Describe brevemente el problema"/>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:4 }}>Categoría *</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {["Bug / Error","Consulta","Facturación","Mejora"].map((c,i)=><div key={c} style={{ padding:"6px 12px", border:"2px solid "+(i===0?C.pri:C.border), borderRadius:6, fontSize:12, cursor:"pointer", background:i===0?C.pri+"08":"#fff", color:i===0?C.pri:C.text, fontWeight:i===0?600:400 }}>{c}</div>)}
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:4 }}>Descripción *</label>
          <div style={{ background:C.inBg, border:"1px solid "+C.border, borderRadius:6, padding:"8px 12px", fontSize:13, color:C.muted, minHeight:80 }}>Describe el problema con detalle...</div>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Bt variant="ghost" onClick={()=>setShowTicket(false)}>Cancelar</Bt>
          <Bt variant="primary">Enviar ticket</Bt>
        </div>
      </Modal>
    </div>
  );
}

function NotificationsScreen() {
  const C = useC();
  return (
    <div>
      <SectionHeader title="Notificaciones" prd="PRD 006-A"/>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}><Bt variant="primary" size="sm">Todas (12)</Bt><Bt variant="ghost" size="sm">No leídas (3)</Bt></div>
      {[{type:"SYSTEM",title:"Tenant aprobado",time:"2h",read:false},{type:"SECURITY",title:"Nuevo login detectado",time:"5h",read:false},{type:"PLAN",title:"Cuota al 80%",time:"1d",read:true}].map((n,i)=>(
        <Cd key={i} style={{ marginBottom:8, borderLeft:"3px solid "+(n.read?C.border:C.pri), background:n.read?"#fff":C.pri+"05" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}><Bd color={n.type==="PLAN"?C.warn:n.type==="SECURITY"?C.err:C.pri}>{n.type}</Bd><span style={{ fontWeight:600, fontSize:13 }}>{n.title}</span></div>
            <span style={{ fontSize:11, color:C.muted }}>{n.time}</span>
          </div>
        </Cd>
      ))}
    </div>
  );
}

function NotifPrefsScreen() {
  const C = useC();
  return (
    <div>
      <SectionHeader title="Preferencias de notificaciones" prd="PRD 006-A"/>
      <Tb headers={["Tipo","Email","SMS","In-App"]} rows={["Seguridad","Mi cuenta","Cuota 80%","Mantenimiento"].map(t=>[t,<input type="checkbox" defaultChecked style={{width:16,height:16}}/>,<input type="checkbox" style={{width:16,height:16}}/>,<input type="checkbox" defaultChecked style={{width:16,height:16}}/>])}/>
      <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}><Bt variant="primary">Guardar</Bt></div>
    </div>
  );
}

function AuditScreen() {
  const C = useC();
  return (
    <div>
      <SectionHeader title="Auditoría" prd="PRD 006-D"/>
      <Tb headers={["Fecha","Usuario","Acción","Detalle"]} rows={[["02/04","admin@emp",<Bd color={C.ok}>CREATE</Bd>,"Invitó carlos"],["01/04","sistema",<Bd color={C.pri}>CREATE</Bd>,"Provisioning tenant"]]}/>
    </div>
  );
}

function MyPlanScreen() {
  const m = useM(); const C = useC();
  const [showUp, setShowUp] = useState(false);
  return (
    <div>
      <SectionHeader title="Mi Plan" prd="PRD 006-H"/>
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        <SC2 label="Plan" value="Starter" color={C.pri}/>
        <SC2 label="Reset" value="29d" color={C.muted}/>
      </div>
      <Cd title="Cuotas" style={{ marginBottom:16 }}>
        <PB label="Usuarios" value={3} max={5}/>
        <PB label="Reportes" value={8} max={10} color={C.warn}/>
      </Cd>
      <Cd title="Planes disponibles">
        <div style={{ display:"flex", gap:10, flexDirection:m?"column":"row" }}>
          {[{n:"Starter",p:"$180",cur:true},{n:"Professional",p:"$580",cur:false},{n:"Enterprise",p:"$1,850+",cur:false}].map(p=>(
            <Cd key={p.n} style={{ flex:1, textAlign:"center", border:p.cur?"2px solid "+C.pri:"1px solid "+C.border }}>
              {p.cur&&<Bd color={C.pri}>ACTUAL</Bd>}
              <div style={{ fontSize:16, fontWeight:700, margin:"8px 0" }}>{p.n}</div>
              <div style={{ fontSize:20, fontWeight:700, color:C.pri }}>{p.p}</div>
              {!p.cur&&<Bt variant="outline" size="sm" style={{ marginTop:8 }} onClick={()=>setShowUp(true)}>Solicitar</Bt>}
            </Cd>
          ))}
        </div>
      </Cd>
      <Modal show={showUp} onClose={()=>setShowUp(false)} title="Solicitar cambio de plan" width={420}>
        <div style={{ background:C.inBg, borderRadius:8, padding:12, marginBottom:16, fontSize:12 }}>
          <div>Actual: <strong>Starter $180</strong></div>
          <div>Nuevo: <strong style={{ color:C.pri }}>Professional $580</strong></div>
        </div>
        <Alert type="warn">Requiere aprobación del administrador (24-48h)</Alert>
        <Inp label="Motivo" placeholder="Necesitamos más usuarios..."/>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Bt variant="ghost" onClick={()=>setShowUp(false)}>Cancelar</Bt>
          <Bt variant="primary">Enviar solicitud</Bt>
        </div>
      </Modal>
    </div>
  );
}

function UsersScreen({ setNav }) {
  const C = useC();
  const [showInv, setShowInv] = useState(false);
  const [showEd,  setShowEd]  = useState(false);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="Usuarios" prd="PRD 003" sub="Gestión de miembros del equipo"/>
        <div style={{ display:"flex", gap:8 }}>
          <Bt variant="outline" size="sm" onClick={()=>setNav("roles")}>🔑 Roles</Bt>
          <Bt variant="primary" onClick={()=>setShowInv(true)}>+ Invitar</Bt>
        </div>
      </div>
      <Tb headers={["Usuario","Rol","Estado",""]} rows={[
        [<span style={{ cursor:"pointer", color:C.pri, fontWeight:500 }} onClick={()=>setNav("user-detail")}>admin@empresa.com</span>, <Bd color={C.pri}>Admin</Bd>, <Bd color={C.ok}>Activo</Bd>, <Bt variant="ghost" size="sm" onClick={()=>setNav("user-detail")}>Ver →</Bt>],
        [<span style={{ cursor:"pointer", color:C.pri, fontWeight:500 }} onClick={()=>setNav("user-detail")}>carlos@empresa.com</span>, <Bd color={C.purp}>Operador</Bd>, <Bd color={C.ok}>Activo</Bd>, <Bt variant="ghost" size="sm" onClick={()=>setNav("user-detail")}>Ver →</Bt>],
        [<span style={{ cursor:"pointer", color:C.pri, fontWeight:500 }} onClick={()=>setNav("user-detail")}>maria@empresa.com</span>, <Bd color={C.muted}>Visor</Bd>, <Bd color={C.warn}>Pendiente</Bd>, <Bt variant="ghost" size="sm">Reenviar</Bt>],
      ]}/>
      <div style={{ fontSize:11, color:C.muted, marginTop:8 }}>3 de 5 · Plan Starter · <span style={{ color:C.pri, cursor:"pointer" }} onClick={()=>setNav("roles")}>Gestionar roles →</span></div>
      <Modal show={showInv} onClose={()=>setShowInv(false)} title="Invitar usuario" width={420}>
        <Inp label="Email *" placeholder="nuevo@empresa.com"/>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:4 }}>Rol *</label>
          <div style={{ display:"flex", gap:8 }}>
            {["Administrador","Operador","Visor"].map((r,i)=><div key={r} style={{ flex:1, padding:"10px 8px", border:"2px solid "+(i===1?C.pri:C.border), borderRadius:6, textAlign:"center", cursor:"pointer", background:i===1?C.pri+"08":"#fff" }}><div style={{ fontSize:12, fontWeight:600, color:i===1?C.pri:C.text }}>{r}</div></div>)}
          </div>
        </div>
        <Alert type="info">Se envía invitación por email. Expira en 48h.</Alert>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Bt variant="ghost" onClick={()=>setShowInv(false)}>Cancelar</Bt>
          <Bt variant="primary">Enviar invitación</Bt>
        </div>
      </Modal>
      <Modal show={showEd} onClose={()=>setShowEd(false)} title="Editar usuario" width={420}>
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:C.pri+"20", color:C.pri, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700 }}>CE</div>
          <div><div style={{ fontSize:14, fontWeight:600 }}>admin@empresa.com</div><div style={{ fontSize:11, color:C.muted }}>Activo · Último login: 1h</div></div>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:4 }}>Rol</label>
          <div style={{ display:"flex", gap:8 }}>
            {["Administrador","Operador","Visor"].map((r,i)=><div key={r} style={{ flex:1, padding:8, border:"2px solid "+(i===0?C.pri:C.border), borderRadius:6, textAlign:"center", cursor:"pointer" }}><div style={{ fontSize:12, fontWeight:600, color:i===0?C.pri:C.text }}>{r}</div></div>)}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"space-between", marginTop:16 }}>
          <Bt variant="danger" size="sm">Desactivar</Bt>
          <div style={{ display:"flex", gap:8 }}>
            <Bt variant="ghost" onClick={()=>setShowEd(false)}>Cancelar</Bt>
            <Bt variant="primary">Guardar</Bt>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ProfileScreen() {
  const C = useC();
  return (
    <div>
      <SectionHeader title="Mi Perfil"/>
      <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:20, flexWrap:"wrap" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:C.pri+"20", color:C.pri, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:700 }}>CE</div>
        <div><div style={{ fontSize:16, fontWeight:700 }}>Cesar Echeverria</div><div style={{ fontSize:12, color:C.muted }}>admin@empresa.com · Admin</div></div>
      </div>
      <Cd title="Datos personales" style={{ marginBottom:16 }}>
        <Inp label="Nombre" placeholder="Cesar Echeverria"/>
        <Inp label="Email" placeholder="admin@empresa.com" note="🔒 No editable"/>
        <Inp label="Teléfono" placeholder="+57 300 123 4567"/>
        <div style={{ display:"flex", justifyContent:"flex-end" }}><Bt variant="primary">Guardar</Bt></div>
      </Cd>
      <Cd title="Seguridad">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid "+C.border }}>
          <div><div style={{ fontSize:13, fontWeight:600 }}>Cambiar contraseña</div><div style={{ fontSize:11, color:C.muted }}>Redirige a Keycloak</div></div>
          <Bt variant="outline" size="sm">Cambiar →</Bt>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0" }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.err }}>Cerrar todas las sesiones</div>
          <Bt variant="danger" size="sm">Cerrar</Bt>
        </div>
      </Cd>
    </div>
  );
}

function RolesScreen() {
  const m = useM(); const C = useC();
  const [showEdit, setShowEdit] = useState(false);
  const [selRole, setSelRole] = useState(null);

  const roles = [
    { name:"Administrador", color:C.pri, users:1, desc:"Control total del tenant. Gestión de usuarios, facturación, configuración y branding.",
      perms:{ dashboard:["ver"], usuarios:["ver","crear","editar","eliminar"], perfil_empresa:["ver","editar"], branding:["ver","editar"], facturacion:["ver","editar"], auditoria:["ver","exportar"], archivos:["ver","subir","eliminar"], config:["ver","editar"], roles:["ver","editar"] }},
    { name:"Operador", color:C.purp, users:1, desc:"Acceso operativo diario. Puede gestionar contenido y archivos, pero no configuración ni facturación.",
      perms:{ dashboard:["ver"], usuarios:["ver"], perfil_empresa:["ver"], branding:[], facturacion:[], auditoria:["ver"], archivos:["ver","subir"], config:[], roles:[] }},
    { name:"Visor", color:C.muted, users:1, desc:"Solo lectura. Puede consultar información pero no modificar nada.",
      perms:{ dashboard:["ver"], usuarios:["ver"], perfil_empresa:["ver"], branding:[], facturacion:[], auditoria:["ver"], archivos:["ver"], config:[], roles:[] }},
  ];

  const modules = [
    { key:"dashboard", label:"Dashboard" },
    { key:"usuarios", label:"Usuarios" },
    { key:"perfil_empresa", label:"Perfil empresa" },
    { key:"branding", label:"Branding" },
    { key:"facturacion", label:"Facturación" },
    { key:"auditoria", label:"Auditoría" },
    { key:"archivos", label:"Archivos" },
    { key:"config", label:"Configuración" },
    { key:"roles", label:"Roles y permisos" },
  ];
  const allPerms = ["ver","crear","editar","eliminar","exportar","subir"];

  const openRole = (r) => { setSelRole(r); setShowEdit(true); };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="Roles y Permisos" prd="PRD 003-B" sub="Define qué puede hacer cada rol dentro del tenant"/>
        <Bt variant="primary">+ Crear rol</Bt>
      </div>
      <Alert type="info">Los roles aplican a todos los usuarios del tenant. Un usuario solo puede tener un rol asignado.</Alert>

      <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {roles.map(r=>(
          <Cd key={r.name} style={{ cursor:"pointer", borderTop:"3px solid "+r.color }} onClick={()=>openRole(r)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ fontSize:15, fontWeight:700 }}>{r.name}</div>
              <Bd color={r.color}>{r.users} usuario{r.users>1?"s":""}</Bd>
            </div>
            <div style={{ fontSize:12, color:C.muted, lineHeight:1.5, marginBottom:12 }}>{r.desc}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {Object.entries(r.perms).filter(([,v])=>v.length>0).map(([k])=>(
                <span key={k} style={{ fontSize:10, background:C.ph, color:C.muted, padding:"2px 6px", borderRadius:4 }}>{modules.find(mm=>mm.key===k)?.label||k}</span>
              ))}
            </div>
          </Cd>
        ))}
      </div>

      {/* Permissions matrix */}
      <Cd title="Matriz de permisos" style={{ marginBottom:16 }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:500 }}>
            <thead>
              <tr>
                <th style={{ textAlign:"left", padding:"8px 10px", borderBottom:"2px solid "+C.border, color:C.muted, fontWeight:600, fontSize:11 }}>Módulo</th>
                {roles.map(r=><th key={r.name} style={{ textAlign:"center", padding:"8px 10px", borderBottom:"2px solid "+C.border, color:r.color, fontWeight:600, fontSize:11 }}>{r.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {modules.map(mod=>(
                <tr key={mod.key} style={{ borderBottom:"1px solid "+C.border }}>
                  <td style={{ padding:"8px 10px", fontWeight:500, whiteSpace:"nowrap" }}>{mod.label}</td>
                  {roles.map(r=>{
                    const p = r.perms[mod.key]||[];
                    return (
                      <td key={r.name} style={{ textAlign:"center", padding:"6px 10px" }}>
                        {p.length===0
                          ? <span style={{ color:C.border, fontSize:16 }}>—</span>
                          : <div style={{ display:"flex", gap:3, justifyContent:"center", flexWrap:"wrap" }}>
                              {p.map(pp=><span key={pp} style={{ fontSize:9, background:r.color+"15", color:r.color, padding:"1px 5px", borderRadius:3, fontWeight:600 }}>{pp}</span>)}
                            </div>
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Cd>

      {/* Edit role modal */}
      <Modal show={showEdit} onClose={()=>setShowEdit(false)} title={selRole?"Editar rol: "+selRole.name:"Editar rol"} width={560}>
        {selRole&&(
          <div>
            <Inp label="Nombre del rol" placeholder={selRole.name}/>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:4 }}>Descripción</label>
              <div style={{ background:C.inBg, border:"1px solid "+C.border, borderRadius:6, padding:"8px 12px", fontSize:13, color:C.muted, minHeight:40 }}>{selRole.desc}</div>
            </div>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>Permisos por módulo</div>
            {modules.map(mod=>{
              const p = selRole.perms[mod.key]||[];
              return (
                <div key={mod.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid "+C.border, gap:8 }}>
                  <span style={{ fontSize:12, fontWeight:500, minWidth:100 }}>{mod.label}</span>
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                    {allPerms.map(perm=>(
                      <div key={perm} style={{ padding:"3px 8px", borderRadius:4, fontSize:10, fontWeight:600, cursor:"pointer", background:p.includes(perm)?selRole.color+"20":"#f1f5f9", color:p.includes(perm)?selRole.color:"#94a3b8", border:"1px solid "+(p.includes(perm)?selRole.color+"40":"#e2e8f0") }}>{perm}</div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div style={{ display:"flex", gap:8, justifyContent:"space-between", marginTop:16 }}>
              {selRole.name!=="Administrador"&&<Bt variant="danger" size="sm">Eliminar rol</Bt>}
              {selRole.name==="Administrador"&&<div/>}
              <div style={{ display:"flex", gap:8 }}>
                <Bt variant="ghost" onClick={()=>setShowEdit(false)}>Cancelar</Bt>
                <Bt variant="primary">Guardar cambios</Bt>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function UserDetailScreen({ setNav }) {
  const m = useM(); const C = useC();
  const [tab, setTab] = useState(0);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const tabs = ["Información","Actividad","Permisos"];

  const user = { name:"Carlos Mendoza", email:"carlos@empresa.com", role:"Operador", roleColor:C.purp, status:"Activo", phone:"+57 310 456 7890", lastLogin:"03/04/2026 09:15", created:"15/01/2026", avatar:"CM", sessions:2 };

  const activity = [
    { date:"03/04/2026", time:"09:15", action:"Inicio de sesión", detail:"Chrome · macOS · Bogotá, CO", icon:"🔑" },
    { date:"03/04/2026", time:"09:20", action:"Descargó archivo", detail:"reporte-marzo-2026.pdf", icon:"📄" },
    { date:"02/04/2026", time:"16:45", action:"Editó registro", detail:"Módulo Auditoría · Registro #1042", icon:"✏️" },
    { date:"02/04/2026", time:"14:30", action:"Subió archivo", detail:"factura-proveedor.pdf · 1.2MB", icon:"📤" },
    { date:"01/04/2026", time:"10:00", action:"Inicio de sesión", detail:"Safari · iPhone 15 · Bogotá, CO", icon:"🔑" },
    { date:"31/03/2026", time:"08:22", action:"Cambió contraseña", detail:"Vía Keycloak", icon:"🔐" },
  ];

  const permModules = [
    { mod:"Dashboard", perms:["ver"], has:true },
    { mod:"Usuarios", perms:["ver"], has:true },
    { mod:"Perfil empresa", perms:["ver"], has:true },
    { mod:"Branding", perms:[], has:false },
    { mod:"Facturación", perms:[], has:false },
    { mod:"Auditoría", perms:["ver"], has:true },
    { mod:"Archivos", perms:["ver","subir"], has:true },
    { mod:"Configuración", perms:[], has:false },
    { mod:"Roles y permisos", perms:[], has:false },
  ];

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:16 }}>
        <span onClick={()=>setNav("users")} style={{ fontSize:12, color:C.pri, cursor:"pointer" }}>← Usuarios</span>
        <span style={{ fontSize:12, color:C.muted }}>/</span>
        <span style={{ fontSize:12, color:C.muted }}>{user.name}</span>
      </div>

      {/* User header card */}
      <Cd style={{ marginBottom:16 }}>
        <div style={{ display:"flex", gap:16, alignItems:m?"flex-start":"center", flexWrap:"wrap" }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:user.roleColor+"20", color:user.roleColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, flexShrink:0 }}>{user.avatar}</div>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
              <span style={{ fontSize:17, fontWeight:700 }}>{user.name}</span>
              <Bd color={C.ok}>{user.status}</Bd>
            </div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:4 }}>{user.email}</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <Bd color={user.roleColor}>{user.role}</Bd>
              <span style={{ fontSize:11, color:C.muted }}>· {user.sessions} sesiones activas · Último login: {user.lastLogin}</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:6, flexShrink:0 }}>
            <Bt variant="outline" size="sm">✏️ Editar</Bt>
            <Bt variant="danger" size="sm" onClick={()=>setShowDeactivate(true)}>Desactivar</Bt>
          </div>
        </div>
      </Cd>

      {/* Tabs */}
      <div style={{ display:"flex", background:"#fff", borderRadius:"8px 8px 0 0", border:"1px solid "+C.border, borderBottom:"none", overflowX:"auto" }}>
        {tabs.map((t,i)=><div key={t} onClick={()=>setTab(i)} style={{ padding:"10px 16px", fontSize:13, fontWeight:tab===i?700:400, color:tab===i?C.pri:C.muted, borderBottom:"2px solid "+(tab===i?C.pri:"transparent"), cursor:"pointer", whiteSpace:"nowrap" }}>{t}</div>)}
      </div>
      <div style={{ border:"1px solid "+C.border, borderRadius:"0 0 8px 8px", background:"#fff", padding:20, marginBottom:16 }}>

        {/* Tab 0: Info */}
        {tab===0&&(
          <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:16 }}>
            <Cd title="Datos personales">
              {[["Nombre completo", user.name],["Email", user.email],["Teléfono", user.phone],["Creado", user.created]].map(([k,v],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<3?"1px solid "+C.border:"none", gap:8 }}>
                  <span style={{ fontSize:12, color:C.muted }}>{k}</span>
                  <span style={{ fontSize:12, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </Cd>
            <Cd title="Seguridad">
              {[["Rol asignado", user.role],["Último login", user.lastLogin],["Sesiones activas", user.sessions],["2FA", "No configurado"]].map(([k,v],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<3?"1px solid "+C.border:"none", gap:8 }}>
                  <span style={{ fontSize:12, color:C.muted }}>{k}</span>
                  <span style={{ fontSize:12, fontWeight:500, color:k==="2FA"?C.warn:C.text }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop:8 }}><Bt variant="outline" size="sm">Cerrar todas las sesiones</Bt></div>
            </Cd>
          </div>
        )}

        {/* Tab 1: Activity */}
        {tab===1&&(
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:13, color:C.muted }}>Últimos 7 días</span>
              <Bt variant="ghost" size="sm">Exportar CSV</Bt>
            </div>
            {activity.map((a,i)=>(
              <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:i<activity.length-1?"1px solid "+C.border:"none", alignItems:"flex-start" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:C.ph, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{a.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{a.action}</div>
                  <div style={{ fontSize:12, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.detail}</div>
                </div>
                <div style={{ fontSize:11, color:C.muted, flexShrink:0, textAlign:"right" }}>
                  <div>{a.date}</div><div>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Permissions */}
        {tab===2&&(
          <div>
            <Alert type="info">Los permisos se heredan del rol <strong>{user.role}</strong>. Para modificarlos, <span onClick={()=>setNav("roles")} style={{ color:C.pri, cursor:"pointer", textDecoration:"underline" }}>edita el rol</span>.</Alert>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:13, fontWeight:600 }}>Cambiar rol</span>
              <div style={{ display:"flex", gap:6 }}>
                {["Administrador","Operador","Visor"].map(r=>(
                  <div key={r} style={{ padding:"5px 12px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", border:"2px solid "+(r===user.role?C.pri:C.border), color:r===user.role?C.pri:C.muted, background:r===user.role?C.pri+"08":"#fff" }}>{r}</div>
                ))}
              </div>
            </div>
            <div style={{ marginTop:16 }}>
              {permModules.map((pm,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:i<permModules.length-1?"1px solid "+C.border:"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:pm.has?C.ok:C.border }}/>
                    <span style={{ fontSize:12, fontWeight:500, color:pm.has?C.text:C.muted }}>{pm.mod}</span>
                  </div>
                  {pm.perms.length>0
                    ? <div style={{ display:"flex", gap:4 }}>{pm.perms.map(p=><span key={p} style={{ fontSize:10, background:user.roleColor+"15", color:user.roleColor, padding:"2px 6px", borderRadius:3, fontWeight:600 }}>{p}</span>)}</div>
                    : <span style={{ fontSize:11, color:C.muted }}>Sin acceso</span>
                  }
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Deactivate modal */}
      <Modal show={showDeactivate} onClose={()=>setShowDeactivate(false)} title="Desactivar usuario" width={420}>
        <Alert type="warn">Esta acción revocará el acceso inmediatamente. El usuario no podrá iniciar sesión hasta que sea reactivado.</Alert>
        <div style={{ background:C.inBg, borderRadius:8, padding:12, marginBottom:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:user.roleColor+"20", color:user.roleColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>{user.avatar}</div>
            <div><div style={{ fontSize:13, fontWeight:600 }}>{user.name}</div><div style={{ fontSize:11, color:C.muted }}>{user.email} · {user.role}</div></div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Bt variant="ghost" onClick={()=>setShowDeactivate(false)}>Cancelar</Bt>
          <Bt variant="danger">Desactivar usuario</Bt>
        </div>
      </Modal>
    </div>
  );
}

function ConfigScreen() {
  const m = useM(); const C = useC();
  return (
    <div>
      <SectionHeader title="Configuración" prd="PRD 009"/>
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:16 }}>
        <Cd title="Empresa"><Inp label="Razón social" placeholder="Empresa S.A.S."/><Inp label="NIT" placeholder="900.123.456-7"/></Cd>
        <Cd title="Regional"><Inp label="Zona horaria" placeholder="América/Bogotá"/><Inp label="Moneda" placeholder="COP"/></Cd>
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16 }}><Bt variant="primary">Guardar</Bt></div>
    </div>
  );
}

function FilesScreen() {
  const C = useC();
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="Archivos" prd="PRD 006-F"/>
        <Bt variant="primary">↑ Subir</Bt>
      </div>
      <Tb headers={["Nombre","Tipo","Tamaño",""]} rows={[
        ["logo.png",      <Bd>png</Bd>,           "245 KB", <Bt variant="ghost" size="sm">↓</Bt>],
        ["reporte.pdf",   <Bd color={C.err}>pdf</Bd>,"1.2 MB",<Bt variant="ghost" size="sm">↓</Bt>],
      ]}/>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN SCREENS — EXISTENTES
// ─────────────────────────────────────────────
function AdminTenantsScreen({ setNav }) {
  const m = useM(); const C = useC();
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="Tenants" prd="PRD 002" sub="Todos los workspaces activos en la plataforma" />
        <div style={{ display:"flex", gap:8 }}>
          <Bt variant="outline" size="sm" onClick={()=>setNav("admin-billing")}>💳 Facturación</Bt>
          <Bt variant="primary">+ Crear tenant</Bt>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        <SC2 label="Activos" value="8" color={C.ok} trend="up" sub="+2 este mes"/>
        <SC2 label="Pendientes" value="2" color={C.warn}/>
        <SC2 label="Suspendidos" value="1" color={C.err}/>
        <SC2 label="Total" value="11" color={C.muted}/>
      </div>
      <Cd style={{ marginBottom:16 }}>
        <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
          <div style={{ background:C.inBg, border:"1px solid "+C.border, borderRadius:6, padding:"6px 12px", fontSize:12, color:C.muted, flex:1, minWidth:120 }}>🔍 Buscar tenant...</div>
          <div style={{ display:"flex", gap:6 }}>{["Todos","Activos","Pendientes","Suspendidos"].map((f,i)=><div key={f} style={{ padding:"4px 10px", borderRadius:9999, fontSize:11, fontWeight:600, background:i===0?C.pri:C.ph, color:i===0?"#fff":C.muted, cursor:"pointer" }}>{f}</div>)}</div>
        </div>
        <Tb headers={["Slug / Empresa","Plan","Usuarios","Storage","Estado",""]}
          rows={[
            [<span style={{ cursor:"pointer", color:C.pri, fontWeight:500 }} onClick={()=>setNav("admin-tenant-detail")}>acme-corp</span>,<Bd color={C.purp}>Pro</Bd>,"12/15","3.2 GB",<Bd color={C.ok}>ACTIVE</Bd>,<Bt variant="ghost" size="sm" onClick={()=>setNav("admin-tenant-detail")}>Ver →</Bt>],
            [<span style={{ cursor:"pointer", color:C.pri, fontWeight:500 }} onClick={()=>setNav("admin-tenant-detail")}>verde-sa</span>,<Bd color={C.pri}>Starter</Bd>,"3/5","0.1 GB",<Bd color={C.ok}>ACTIVE</Bd>,<Bt variant="ghost" size="sm" onClick={()=>setNav("admin-tenant-detail")}>Ver →</Bt>],
            ["nueva-empresa",<Bd>Starter</Bd>,"—","—",<Bd color={C.warn}>PENDING</Bd>,<Bt variant="primary" size="sm">Aprobar</Bt>],
            ["old-corp",<Bd color={C.purp}>Pro</Bd>,"0/15","1.1 GB",<Bd color={C.err}>SUSPENDED</Bd>,<Bt variant="ghost" size="sm">Reactivar</Bt>],
          ]}
        />
      </Cd>
      <div style={{ fontSize:11, color:C.muted }}>4 tenants · <span style={{ color:C.pri, cursor:"pointer" }} onClick={()=>setNav("admin-billing")}>Ver facturación global →</span></div>
    </div>
  );
}

function AdminApprovalScreen() {
  const C = useC();
  const [showDet, setShowDet] = useState(false);
  return (
    <div>
      <SectionHeader title="Aprobaciones" prd="PRD 002" sub="Solicitudes de nuevos tenants pendientes de revisión" />
      {[{c:"Nueva Empresa S.A.",info:"pedro@nueva.com · Starter",nit:"900.444.555-6",fecha:"01/04"},{c:"Green Solutions Ltda.",info:"ana@green.com · Professional",nit:"900.777.888-9",fecha:"02/04"}].map((r,i)=>(
        <Cd key={i} style={{ marginBottom:12, borderLeft:"3px solid "+C.warn }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
            <div><div style={{ fontWeight:600 }}>{r.c}</div><div style={{ fontSize:12, color:C.muted }}>{r.info} · NIT: {r.nit} · {r.fecha}</div></div>
            <div style={{ display:"flex", gap:6 }}><Bt variant="ghost" size="sm" onClick={()=>setShowDet(true)}>Detalle</Bt><Bt variant="success" size="sm">✓ Aprobar</Bt><Bt variant="danger" size="sm">✕ Rechazar</Bt></div>
          </div>
        </Cd>
      ))}
      <Modal show={showDet} onClose={()=>setShowDet(false)} title="Revisar solicitud" width={480}>
        <Cd style={{ background:C.inBg, marginBottom:12 }}>
          <div style={{ fontSize:12 }}>{[["Empresa","Nueva Empresa S.A."],["NIT","900.444.555-6"],["Email","pedro@nueva.com"],["Plan","Starter"],["Sector","Manufactura"],["Ciudad","Bogotá"]].map(([k,v],i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"3px 0" }}><span style={{ color:C.muted }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span></div>)}</div>
        </Cd>
        <Inp label="Motivo de rechazo (si aplica)" placeholder="NIT no válido..."/>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}><Bt variant="danger">Rechazar</Bt><Bt variant="success">Aprobar</Bt></div>
      </Modal>
    </div>
  );
}

function AdminFlagsScreen() {
  const C = useC();
  const [showEdit, setShowEdit] = useState(false);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="Feature Flags" prd="PRD 007" sub="Control granular de funcionalidades por plan y tenant"/>
        <Bt variant="primary">+ Crear flag</Bt>
      </div>
      <Tb headers={["Flag","Descripción","Default","Tier mínimo","Tenants con override",""]}
        rows={[
          ["NOTIFICATIONS_SMS","Notif. por Twilio",<Bd color={C.ok}>ON</Bd>,<Bd>Starter+</Bd>,"2",<Bt variant="ghost" size="sm" onClick={()=>setShowEdit(true)}>Editar</Bt>],
          ["PDF_EXPORT","Exportar reportes PDF",<Bd color={C.ok}>ON</Bd>,<Bd>Starter+</Bd>,"0",<Bt variant="ghost" size="sm">Editar</Bt>],
          ["API_ACCESS","API externa REST",<Bd color={C.err}>OFF</Bd>,<Bd color={C.purp}>Enterprise</Bd>,"1",<Bt variant="ghost" size="sm">Editar</Bt>],
          ["AUDIT_EXPORT","Exportar auditoría",<Bd color={C.ok}>ON</Bd>,<Bd color={C.pri}>Pro+</Bd>,"0",<Bt variant="ghost" size="sm">Editar</Bt>],
          ["CUSTOM_DOMAIN","Dominio personalizado",<Bd color={C.err}>OFF</Bd>,<Bd color={C.pri}>Pro+</Bd>,"0",<Bt variant="ghost" size="sm">Editar</Bt>],
        ]}
      />
      <Modal show={showEdit} onClose={()=>setShowEdit(false)} title="Editar flag · NOTIFICATIONS_SMS" width={460}>
        <Inp label="Nombre del flag" placeholder="NOTIFICATIONS_SMS"/>
        <Inp label="Descripción" placeholder="Permite enviar notificaciones por SMS via Twilio"/>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:6 }}>Tier mínimo</label>
          <div style={{ display:"flex", gap:8 }}>{["Starter","Professional","Enterprise"].map((t,i)=><div key={t} style={{ flex:1, padding:"8px 6px", border:"2px solid "+(i===0?C.pri:C.border), borderRadius:6, textAlign:"center", cursor:"pointer", fontSize:12, fontWeight:i===0?700:400, color:i===0?C.pri:C.muted }}>{t}</div>)}</div>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:6 }}>Estado por defecto</label>
          <div style={{ display:"flex", gap:8 }}>{["ON (activo)","OFF (inactivo)"].map((t,i)=><div key={t} style={{ flex:1, padding:"8px 6px", border:"2px solid "+(i===0?C.ok:C.border), borderRadius:6, textAlign:"center", cursor:"pointer", fontSize:12, fontWeight:i===0?700:400, color:i===0?C.ok:C.muted }}>{t}</div>)}</div>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}><Bt variant="ghost" onClick={()=>setShowEdit(false)}>Cancelar</Bt><Bt variant="primary">Guardar</Bt></div>
      </Modal>
    </div>
  );
}

function AdminPlansScreen() {
  const C = useC();
  const [showEdit, setShowEdit] = useState(false);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="Planes y cuotas" prd="PRD 006-H" sub="Configuración de planes de suscripción"/>
        <Bt variant="primary">+ Crear plan</Bt>
      </div>
      <Tb headers={["Plan","Tier","Precio/mes","Usuarios","Reportes","Storage","Tenants activos",""]}
        rows={[
          ["Starter","1","$180 USD","5","10","5 GB","5",<Bt variant="ghost" size="sm" onClick={()=>setShowEdit(true)}>Editar</Bt>],
          ["Professional","2","$580 USD","15","Ilimitado","50 GB","2",<Bt variant="ghost" size="sm">Editar</Bt>],
          ["Enterprise","3","$1,850+ USD","Ilimitado","Ilimitado","500 GB","1",<Bt variant="ghost" size="sm">Editar</Bt>],
        ]}
      />
      <Modal show={showEdit} onClose={()=>setShowEdit(false)} title="Editar plan · Starter" width={500}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Inp label="Nombre" placeholder="Starter"/>
          <Inp label="Precio USD/mes" placeholder="180"/>
          <Inp label="Máx. usuarios" placeholder="5"/>
          <Inp label="Máx. reportes/mes" placeholder="10"/>
          <Inp label="Storage (GB)" placeholder="5"/>
          <Inp label="Tier (orden)" placeholder="1"/>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:6 }}>Feature flags incluidos</label>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{["NOTIFICATIONS_SMS","PDF_EXPORT","AUDIT_EXPORT"].map(f=><div key={f} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 8px", border:"1px solid "+C.border, borderRadius:6, fontSize:11 }}><input type="checkbox" defaultChecked style={{ width:12, height:12 }}/>{f}</div>)}</div>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}><Bt variant="ghost" onClick={()=>setShowEdit(false)}>Cancelar</Bt><Bt variant="primary">Guardar</Bt></div>
      </Modal>
    </div>
  );
}

function AdminErrorsScreen() {
  const m = useM(); const C = useC();
  return (
    <div>
      <SectionHeader title="Observabilidad y API Logs" prd="PRD 008" sub="Métricas de salud, errores y circuit breakers"/>
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        <SC2 label="Errores 24h" value="7" color={C.err} trend="down" sub="-3 vs ayer"/>
        <SC2 label="Errores 7d" value="23" color={C.warn}/>
        <SC2 label="Uptime" value="99.8%" color={C.ok}/>
        <SC2 label="p95 latencia" value="340ms" color={C.pri}/>
      </div>
      <Cd title="API Logs recientes" style={{ marginBottom:16 }}>
        <Tb headers={["Tiempo","Método","Endpoint","Tenant","Status","ms"]}
          rows={[
            ["14:32","POST","/external/tenants","—",<Bd color={C.ok}>201</Bd>,"120"],
            ["14:30","POST","/external/tenants","—",<Bd color={C.err}>429</Bd>,"8"],
            ["14:28","GET","/api/users","acme-corp",<Bd color={C.ok}>200</Bd>,"45"],
            ["14:25","DELETE","/api/users/12","verde-sa",<Bd color={C.ok}>204</Bd>,"67"],
          ]}
        />
      </Cd>
      <Cd title="Circuit Breakers">
        <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(4,1fr)", gap:8 }}>
          {[["SES","CLOSED",C.ok,"0 fallos"],["Twilio","CLOSED",C.ok,"0 fallos"],["S3","CLOSED",C.ok,"0 fallos"],["Keycloak","HALF-OPEN",C.warn,"2 fallos"]].map(it=>(
            <div key={it[0]} style={{ padding:10, border:"1px solid "+C.border, borderRadius:8, textAlign:"center" }}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{it[0]}</div>
              <Bd color={it[2]}>{it[1]}</Bd>
              <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>{it[3]}</div>
            </div>
          ))}
        </div>
      </Cd>
    </div>
  );
}

function AdminImpersonateScreen() {
  const m = useM(); const C = useC();
  return (
    <div>
      <SectionHeader title="Impersonación / Soporte" prd="PRD 002" sub="Acceder al workspace de un tenant para soporte técnico"/>
      <Alert type="warn">Toda sesión de impersonación queda registrada en el log de auditoría con el motivo y duración.</Alert>
      <Cd style={{ marginBottom:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12, marginBottom:12 }}>
          <Inp label="Tenant *" placeholder="acme-corp"/>
          <Inp label="Usuario a impersonar *" placeholder="admin@acme.com"/>
        </div>
        <Inp label="Motivo (requerido)" placeholder="Cliente reportó error en módulo de reportes..."/>
        <Bt variant="warn">👁 Iniciar sesión de soporte</Bt>
      </Cd>
      <div style={{ background:C.warn+"15", border:"1px solid "+C.warn, borderRadius:8, padding:12, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
        <span style={{ fontSize:18 }}>⚠️</span>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, color:C.warn }}>Sesión activa · acme-corp</div>
          <div style={{ fontSize:12, color:C.muted }}>admin@acme.com · Motivo: Error módulo PDF · 28:42 transcurridos</div>
        </div>
        <Bt variant="danger" size="sm">Terminar sesión</Bt>
      </div>
    </div>
  );
}

function AdminAPIScreen() {
  const C = useC();
  const [showNew, setShowNew] = useState(false);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="API Externa" prd="PRD 007" sub="Claves de acceso para integración con sistemas externos"/>
        <Bt variant="primary" onClick={()=>setShowNew(true)}>+ Generar API key</Bt>
      </div>
      <Tb headers={["Nombre","Key (preview)","Scopes","Creada","Último uso",""]}
        rows={[
          ["CRM Salesforce","sk_live_…a3f7",<Bd>tenants:create</Bd>,"01/01/2026","hace 2h",<Bt variant="ghost" size="sm">Rotar</Bt>],
          ["ERP Interno","sk_live_…c9d1",<><Bd>tenants:read</Bd></>,  "15/02/2026","hace 1d",<Bt variant="ghost" size="sm">Rotar</Bt>],
        ]}
      />
      <Modal show={showNew} onClose={()=>setShowNew(false)} title="Nueva API key" width={440}>
        <Inp label="Nombre / sistema origen" placeholder="CRM Salesforce"/>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:6 }}>Scopes permitidos</label>
          {["tenants:create","tenants:read","tenants:update","webhooks:send"].map(s=><div key={s} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}><input type="checkbox" defaultChecked={s.includes("create")} style={{ width:14, height:14 }}/><span style={{ fontSize:12 }}>{s}</span></div>)}
        </div>
        <Alert type="warn">La clave solo se muestra una vez al crearla. Guárdala en un lugar seguro.</Alert>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}><Bt variant="ghost" onClick={()=>setShowNew(false)}>Cancelar</Bt><Bt variant="primary">Generar</Bt></div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN SCREENS — NUEVAS
// ─────────────────────────────────────────────

// 1. OVERVIEW EJECUTIVO
function AdminOverviewScreen() {
  const m = useM(); const C = useC();
  const mrr = [2100,2400,2800,3100,3400,3800,4200,4580];
  const tenants = [4,5,6,7,8,8,9,11];
  const churn = [0,1,0,0,1,0,0,0];
  return (
    <div>
      <SectionHeader title="Overview ejecutivo" prd="PRD 002" sub="Métricas globales de la plataforma · Abril 2026"/>
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        <SC2 label="MRR" value="$4,580" color={C.ok} trend="up" sub="+12% vs mes ant."/>
        <SC2 label="Tenants activos" value="11" color={C.pri} trend="up" sub="+2 este mes"/>
        <SC2 label="Churn rate" value="0%" color={C.ok} trend="up" sub="0 bajas este mes"/>
        <SC2 label="ARR proyectado" value="$54.9K" color={C.purp}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:16, marginBottom:16 }}>
        <Cd title="MRR — últimos 8 meses">
          <MiniBar data={mrr} color={C.ok} height={60}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            <span style={{ fontSize:10, color:C.muted }}>Sep</span>
            <span style={{ fontSize:10, color:C.muted }}>Abr</span>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:8 }}>
            <div><div style={{ fontSize:10, color:C.muted }}>Este mes</div><div style={{ fontSize:16, fontWeight:700, color:C.ok }}>$4,580</div></div>
            <div><div style={{ fontSize:10, color:C.muted }}>Mes anterior</div><div style={{ fontSize:16, fontWeight:700, color:C.muted }}>$4,200</div></div>
            <div><div style={{ fontSize:10, color:C.muted }}>Crecimiento</div><div style={{ fontSize:16, fontWeight:700, color:C.ok }}>+9.0%</div></div>
          </div>
        </Cd>
        <Cd title="Tenants activos — últimos 8 meses">
          <MiniBar data={tenants} color={C.pri} height={60}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            <span style={{ fontSize:10, color:C.muted }}>Sep</span>
            <span style={{ fontSize:10, color:C.muted }}>Abr</span>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:8 }}>
            <div><div style={{ fontSize:10, color:C.muted }}>Activos</div><div style={{ fontSize:16, fontWeight:700, color:C.pri }}>11</div></div>
            <div><div style={{ fontSize:10, color:C.muted }}>Nuevos (mes)</div><div style={{ fontSize:16, fontWeight:700, color:C.ok }}>+2</div></div>
            <div><div style={{ fontSize:10, color:C.muted }}>Bajas (mes)</div><div style={{ fontSize:16, fontWeight:700, color:C.muted }}>0</div></div>
          </div>
        </Cd>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
        <Cd title="Distribución por plan">
          {[{plan:"Starter",n:5,color:C.pri},{plan:"Professional",n:4,color:C.purp},{plan:"Enterprise",n:2,color:C.ok}].map(p=>(
            <div key={p.plan} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                <span style={{ fontWeight:500 }}>{p.plan}</span>
                <span style={{ color:C.muted }}>{p.n} tenants</span>
              </div>
              <div style={{ background:C.ph, borderRadius:4, height:6 }}>
                <div style={{ background:p.color, width:(p.n/11*100)+"%", height:"100%", borderRadius:4 }}/>
              </div>
            </div>
          ))}
        </Cd>
        <Cd title="MRR por plan">
          {[{plan:"Enterprise",mrr:"$3,700",pct:81,color:C.ok},{plan:"Professional",mrr:"$580",pct:13,color:C.purp},{plan:"Starter",mrr:"$300",pct:7,color:C.pri}].map(p=>(
            <div key={p.plan} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                <span style={{ fontWeight:500 }}>{p.plan}</span>
                <span style={{ color:C.muted }}>{p.mrr}</span>
              </div>
              <div style={{ background:C.ph, borderRadius:4, height:6 }}>
                <div style={{ background:p.color, width:p.pct+"%", height:"100%", borderRadius:4 }}/>
              </div>
            </div>
          ))}
        </Cd>
        <Cd title="Alertas del sistema">
          {[
            {icon:"⚠️",msg:"SES degradado · emails demorados",color:C.warn},
            {icon:"🔔",msg:"2 solicitudes pendientes de aprobación",color:C.pri},
            {icon:"💎",msg:"acme-corp: cuota de usuarios al 80%",color:C.warn},
          ].map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:8, padding:"8px 0", borderBottom:i<2?"1px solid "+C.border:"none", alignItems:"flex-start" }}>
              <span style={{ fontSize:14 }}>{a.icon}</span>
              <span style={{ fontSize:12, color:a.color, lineHeight:1.4 }}>{a.msg}</span>
            </div>
          ))}
        </Cd>
      </div>

      <Cd title="Top tenants por uso">
        <Tb headers={["Tenant","Plan","Usuarios","Storage","MRR","Estado"]}
          rows={[
            ["acme-corp",<Bd color={C.purp}>Pro</Bd>,"12/15","3.2 GB","$580",<Bd color={C.ok}>ACTIVE</Bd>],
            ["industrias-xv",<Bd color={C.ok}>Enterprise</Bd>,"48/∞","120 GB","$1,850",<Bd color={C.ok}>ACTIVE</Bd>],
            ["verde-sa",<Bd color={C.pri}>Starter</Bd>,"3/5","0.1 GB","$180",<Bd color={C.ok}>ACTIVE</Bd>],
          ]}
        />
      </Cd>
    </div>
  );
}

// 2. GESTIÓN DE ADMINS DEL SISTEMA
function AdminSystemUsersScreen() {
  const m = useM(); const C = useC();
  const [showInv, setShowInv] = useState(false);
  const [showEd, setShowEd] = useState(false);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="Administradores del sistema" prd="PRD 003" sub="Usuarios con acceso al panel de administración global"/>
        <Bt variant="primary" onClick={()=>setShowInv(true)}>+ Invitar admin</Bt>
      </div>
      <Alert type="warn">Los administradores del sistema tienen acceso completo a todos los tenants, configuraciones y datos de la plataforma. Otorga este acceso con criterio.</Alert>
      <Cd style={{ marginBottom:16 }}>
        <Tb headers={["Admin","Rol del sistema","Último acceso","2FA","Estado",""]}
          rows={[
            ["cesar@plataforma.com",<Bd color={C.err}>Super Admin</Bd>,"Ahora",<Bd color={C.ok}>✓</Bd>,<Bd color={C.ok}>Activo</Bd>,<Bt variant="ghost" size="sm" onClick={()=>setShowEd(true)}>Editar</Bt>],
            ["alejandra@plataforma.com",<Bd color={C.purp}>Admin</Bd>,"hace 2h",<Bd color={C.ok}>✓</Bd>,<Bd color={C.ok}>Activo</Bd>,<Bt variant="ghost" size="sm" onClick={()=>setShowEd(true)}>Editar</Bt>],
            ["soporte@plataforma.com",<Bd color={C.pri}>Soporte</Bd>,"hace 1d",<Bd color={C.warn}>✗</Bd>,<Bd color={C.ok}>Activo</Bd>,<Bt variant="ghost" size="sm">Editar</Bt>],
            ["auditor@plataforma.com",<Bd color={C.muted}>Solo lectura</Bd>,"hace 5d",<Bd color={C.ok}>✓</Bd>,<Bd color={C.muted}>Inactivo</Bd>,<Bt variant="ghost" size="sm">Editar</Bt>],
          ]}
        />
      </Cd>
      <Cd title="Roles del sistema" style={{ background:C.inBg }}>
        <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"repeat(4,1fr)", gap:10 }}>
          {[
            {rol:"Super Admin",color:C.err,perms:"Acceso total · Sin restricciones"},
            {rol:"Admin",color:C.purp,perms:"Gestión tenants, planes, flags"},
            {rol:"Soporte",color:C.pri,perms:"Impersonación, tickets, logs"},
            {rol:"Solo lectura",color:C.muted,perms:"Visualización sin modificar"},
          ].map(r=>(
            <div key={r.rol} style={{ padding:10, border:"1px solid "+C.border, borderRadius:8, background:"#fff" }}>
              <Bd color={r.color}>{r.rol}</Bd>
              <div style={{ fontSize:11, color:C.muted, marginTop:6, lineHeight:1.4 }}>{r.perms}</div>
            </div>
          ))}
        </div>
      </Cd>
      <Modal show={showInv} onClose={()=>setShowInv(false)} title="Invitar administrador" width={440}>
        <Inp label="Email corporativo *" placeholder="nuevo@plataforma.com"/>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:6 }}>Rol del sistema *</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{["Admin","Soporte","Solo lectura"].map((r,i)=><div key={r} style={{ flex:1, padding:"8px 6px", border:"2px solid "+(i===0?C.pri:C.border), borderRadius:6, textAlign:"center", cursor:"pointer", fontSize:12, fontWeight:i===0?700:400, color:i===0?C.pri:C.muted, minWidth:80 }}>{r}</div>)}</div>
        </div>
        <Alert type="warn">Se enviará invitación con link de 24h. El 2FA será obligatorio al activar la cuenta.</Alert>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}><Bt variant="ghost" onClick={()=>setShowInv(false)}>Cancelar</Bt><Bt variant="primary">Enviar invitación</Bt></div>
      </Modal>
      <Modal show={showEd} onClose={()=>setShowEd(false)} title="Editar admin · alejandra@plataforma.com" width={440}>
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:C.purp+"20", color:C.purp, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700 }}>AR</div>
          <div><div style={{ fontSize:14, fontWeight:600 }}>Alejandra Rodríguez</div><div style={{ fontSize:11, color:C.muted }}>Activa · Último acceso: hace 2h</div></div>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:6 }}>Rol</label>
          <div style={{ display:"flex", gap:8 }}>{["Admin","Soporte","Solo lectura"].map((r,i)=><div key={r} style={{ flex:1, padding:"8px 6px", border:"2px solid "+(i===0?C.pri:C.border), borderRadius:6, textAlign:"center", cursor:"pointer", fontSize:12, fontWeight:i===0?700:400, color:i===0?C.pri:C.muted }}>{r}</div>)}</div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:16 }}>
          <Bt variant="danger" size="sm">Revocar acceso</Bt>
          <div style={{ display:"flex", gap:8 }}><Bt variant="ghost" onClick={()=>setShowEd(false)}>Cancelar</Bt><Bt variant="primary">Guardar</Bt></div>
        </div>
      </Modal>
    </div>
  );
}

// 3. TEMPLATES DE EMAIL
function AdminEmailTemplatesScreen() {
  const C = useC();
  const [sel, setSel] = useState(0);
  const [showPrev, setShowPrev] = useState(false);
  const templates = [
    { id:"tenant_welcome", name:"Bienvenida al tenant", trigger:"Tenant aprobado", vars:["{{tenant_name}}","{{subdomain}}","{{admin_email}}","{{temp_password}}"] },
    { id:"user_invite", name:"Invitación de usuario", trigger:"Admin invita usuario", vars:["{{inviter_name}}","{{tenant_name}}","{{role}}","{{invite_link}}","{{expires_at}}"] },
    { id:"tenant_approved", name:"Solicitud aprobada", trigger:"Admin aprueba solicitud", vars:["{{company_name}}","{{request_id}}","{{subdomain}}"] },
    { id:"tenant_rejected", name:"Solicitud rechazada", trigger:"Admin rechaza solicitud", vars:["{{company_name}}","{{reason}}"] },
    { id:"quota_warning", name:"Alerta de cuota 80%", trigger:"Cuota supera 80%", vars:["{{tenant_name}}","{{resource}}","{{current}}","{{max}}"] },
    { id:"password_reset", name:"Reset de contraseña", trigger:"Usuario solicita reset", vars:["{{user_name}}","{{reset_link}}","{{expires_at}}"] },
    { id:"maintenance", name:"Aviso de mantenimiento", trigger:"Admin programa mantenimiento", vars:["{{start_time}}","{{end_time}}","{{description}}"] },
  ];
  const t = templates[sel];
  return (
    <div>
      <SectionHeader title="Templates de email" prd="PRD 006-E" sub="Plantillas de correos transaccionales del sistema"/>
      <div style={{ display:"flex", gap:16, height:"calc(100vh - 220px)", minHeight:400 }}>
        <div style={{ width:220, flexShrink:0, display:"flex", flexDirection:"column", gap:4 }}>
          {templates.map((tp,i)=>(
            <div key={tp.id} onClick={()=>setSel(i)} style={{ padding:"10px 12px", borderRadius:8, cursor:"pointer", background:sel===i?C.pri+"10":"#fff", border:"1px solid "+(sel===i?C.pri:C.border), borderLeft:"3px solid "+(sel===i?C.pri:C.border) }}>
              <div style={{ fontSize:12, fontWeight:sel===i?700:500, color:sel===i?C.pri:C.text }}>{tp.name}</div>
              <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{tp.trigger}</div>
            </div>
          ))}
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:12, overflow:"auto" }}>
          <Cd style={{ flex:"none" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700 }}>{t.name}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Trigger: <strong>{t.trigger}</strong></div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Bt variant="outline" size="sm" onClick={()=>setShowPrev(true)}>👁 Preview</Bt>
                <Bt variant="primary" size="sm">Guardar</Bt>
              </div>
            </div>
            <Inp label="Asunto del email" placeholder={"Bienvenido a {{tenant_name}} en Plataforma Ambiental"}/>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:4 }}>Cuerpo del email (HTML / texto)</label>
              <div style={{ background:C.inBg, border:"1px solid "+C.border, borderRadius:6, padding:12, minHeight:120, fontSize:12, color:C.muted, fontFamily:"monospace", lineHeight:1.6 }}>
                {"Hola {{admin_email}},\n\nTu espacio en la plataforma ha sido activado.\n\nURL: https://{{subdomain}}.plataforma.com\nContraseña temporal: {{temp_password}}\n\n⚠️ Cambia tu contraseña al primer ingreso."}
              </div>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:500, color:C.muted, marginBottom:6 }}>Variables disponibles</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {t.vars.map(v=><code key={v} style={{ background:C.pri+"15", color:C.pri, padding:"2px 6px", borderRadius:4, fontSize:11 }}>{v}</code>)}
              </div>
            </div>
          </Cd>
        </div>
      </div>
      <Modal show={showPrev} onClose={()=>setShowPrev(false)} title={"Preview · " + t.name} width={520}>
        <div style={{ background:"#f5f5f5", borderRadius:8, padding:16 }}>
          <div style={{ background:"#fff", borderRadius:8, padding:20, maxWidth:440, margin:"0 auto", boxShadow:"0 2px 8px rgba(0,0,0,.08)" }}>
            <div style={{ borderBottom:"1px solid "+C.border, paddingBottom:12, marginBottom:12 }}>
              <div style={{ fontSize:11, color:C.muted }}>De: no-reply@plataforma.com</div>
              <div style={{ fontSize:11, color:C.muted }}>Para: admin@empresa.com</div>
              <div style={{ fontSize:13, fontWeight:700, marginTop:4 }}>Bienvenido a Empresa S.A.S. en Plataforma Ambiental</div>
            </div>
            <div style={{ fontSize:13, color:C.text, lineHeight:1.7, marginBottom:16 }}>
              Hola <strong>admin@empresa.com</strong>,<br/><br/>
              Tu espacio en la plataforma ha sido activado.<br/><br/>
              <strong>URL:</strong> https://mi-empresa.plataforma.com<br/>
              <strong>Contraseña temporal:</strong> Tmp#2026Xk<br/><br/>
              ⚠️ Cambia tu contraseña al primer ingreso.
            </div>
            <div style={{ background:C.pri, color:"#fff", padding:"10px 20px", borderRadius:6, textAlign:"center", fontSize:13, fontWeight:600 }}>Acceder a la plataforma →</div>
            <div style={{ fontSize:10, color:C.muted, textAlign:"center", marginTop:12 }}>Plataforma Ambiental S.A.S. · Política de privacidad</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// 4. MANTENIMIENTO PROGRAMADO
function AdminMaintenanceScreen() {
  const m = useM(); const C = useC();
  const [showNew, setShowNew] = useState(false);
  const [step, setStep] = useState(0);
  return (
    <div>
      <SectionHeader title="Mantenimiento programado" prd="PRD 006-B" sub="Ventanas de mantenimiento y comunicación a tenants"/>
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
        <SC2 label="Estado actual" value="✅" sub="Operativo" color={C.ok}/>
        <SC2 label="Prox. mantenimiento" value="15 días" color={C.muted}/>
        <SC2 label="Histórico" value="4 ventanas" color={C.pri}/>
      </div>

      <Cd title="Próximas ventanas" style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
          <Bt variant="primary" size="sm" onClick={()=>setShowNew(true)}>+ Programar mantenimiento</Bt>
        </div>
        {[
          { fecha:"19/04/2026 02:00–04:00 COT", tipo:"Rutinario", afecta:"Toda la plataforma", estado:"Programado", notif:"Enviada" },
        ].map((mt,i)=>(
          <Cd key={i} style={{ background:C.inBg, border:"1px solid "+C.warn+"40" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
              <div>
                <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}><Bd color={C.warn}>{mt.tipo}</Bd><Bd color={C.pri}>{mt.estado}</Bd></div>
                <div style={{ fontSize:13, fontWeight:600 }}>{mt.fecha}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Afecta: {mt.afecta} · Notificación: {mt.notif}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <Bt variant="ghost" size="sm">Editar</Bt>
                <Bt variant="danger" size="sm">Cancelar</Bt>
              </div>
            </div>
          </Cd>
        ))}
      </Cd>

      <Cd title="Historial">
        <Tb headers={["Fecha","Tipo","Duración real","Afectados","Resultado"]}
          rows={[
            ["05/04/2026 02:00","Rutinario","58 min","11 tenants",<Bd color={C.ok}>Completado</Bd>],
            ["15/03/2026 02:00","Emergencia","2h 10min","11 tenants",<Bd color={C.warn}>Con incidentes</Bd>],
            ["01/03/2026 01:00","Rutinario","45 min","9 tenants",<Bd color={C.ok}>Completado</Bd>],
          ]}
        />
      </Cd>

      <Modal show={showNew} onClose={()=>setShowNew(false)} title="Programar mantenimiento" width={500}>
        <SI steps={["Configurar","Notificar","Confirmar"]} current={step} mobile={m}/>
        {step===0&&<div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Inp label="Fecha y hora inicio *" placeholder="19/04/2026 02:00 COT"/>
            <Inp label="Fecha y hora fin *" placeholder="19/04/2026 04:00 COT"/>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:6 }}>Tipo</label>
            <div style={{ display:"flex", gap:8 }}>{["Rutinario","Emergencia","Mejora"].map((t,i)=><div key={t} style={{ flex:1, padding:"8px 6px", border:"2px solid "+(i===0?C.pri:C.border), borderRadius:6, textAlign:"center", cursor:"pointer", fontSize:12, color:i===0?C.pri:C.muted, fontWeight:i===0?700:400 }}>{t}</div>)}</div>
          </div>
          <Inp label="Descripción (visible para tenants)" placeholder="Actualización de infraestructura para mejorar rendimiento..."/>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:6 }}>Servicios afectados</label>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{["API","Portal web","Auth","Notificaciones","Storage"].map(s=><div key={s} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 8px", border:"1px solid "+C.border, borderRadius:6, fontSize:11, cursor:"pointer" }}><input type="checkbox" defaultChecked={s!=="Storage"} style={{ width:12, height:12 }}/>{s}</div>)}</div>
          </div>
        </div>}
        {step===1&&<div>
          <Alert type="info">Se enviará email de aviso a todos los administradores de tenants activos (11 destinatarios).</Alert>
          <Inp label="Antelación del aviso" placeholder="72 horas antes (recomendado)"/>
          <div style={{ background:C.inBg, borderRadius:8, padding:12, fontSize:12 }}>
            <div style={{ fontWeight:600, marginBottom:6 }}>Preview del email de aviso</div>
            <div style={{ color:C.text, lineHeight:1.6 }}>Asunto: <strong>Mantenimiento programado · 19/04/2026 02:00–04:00 COT</strong><br/>Cuerpo: La plataforma estará en mantenimiento el 19 de abril de 2:00 a 4:00 AM COT. Durante este período los servicios no estarán disponibles.</div>
          </div>
        </div>}
        {step===2&&<div>
          <Alert type="warn">Esta acción programará el mantenimiento y enviará notificaciones a todos los tenants.</Alert>
          <Cd style={{ background:C.inBg }}>
            {[["Inicio","19/04/2026 02:00 COT"],["Fin estimado","19/04/2026 04:00 COT"],["Tipo","Rutinario"],["Tenants afectados","11"],["Notificación","72h antes"]].map(([k,v],i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid "+C.border+"40", fontSize:12 }}><span style={{ color:C.muted }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span></div>)}
          </Cd>
        </div>}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:16 }}>
          <div>{step>0&&<Bt variant="ghost" onClick={()=>setStep(step-1)}>← Anterior</Bt>}</div>
          <Bt variant="primary" onClick={()=>{ if(step<2) setStep(step+1); else setShowNew(false); }}>{step<2?"Siguiente →":"Confirmar y programar"}</Bt>
        </div>
      </Modal>
    </div>
  );
}

// 5. WEBHOOKS GLOBALES
function AdminWebhooksScreen() {
  const C = useC();
  const [showNew, setShowNew] = useState(false);
  const [showLog, setShowLog] = useState(false);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="Webhooks globales" prd="PRD 007" sub="Eventos de la plataforma enviados a sistemas externos"/>
        <Bt variant="primary" onClick={()=>setShowNew(true)}>+ Nuevo webhook</Bt>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
        <SC2 label="Webhooks activos" value="3" color={C.ok}/>
        <SC2 label="Eventos hoy" value="142" color={C.pri}/>
        <SC2 label="Fallos 24h" value="2" color={C.warn}/>
      </div>
      {[
        { url:"https://crm.empresa.com/hooks/tenant", events:["tenant.created","tenant.approved"], status:"Activo", ok:98, last:"hace 2min" },
        { url:"https://erp.corp.co/webhook/platform", events:["tenant.created","plan.changed"], status:"Activo", ok:100, last:"hace 1h" },
        { url:"https://monitor.ops.io/ingest", events:["tenant.suspended","error.critical"], status:"Error", ok:67, last:"hace 3h" },
      ].map((wh,i)=>(
        <Cd key={i} style={{ marginBottom:10, borderLeft:"3px solid "+(wh.status==="Error"?C.err:C.ok) }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}>
                <Bd color={wh.status==="Error"?C.err:C.ok}>{wh.status}</Bd>
                <span style={{ fontSize:11, color:C.muted }}>Último envío: {wh.last} · Tasa éxito: {wh.ok}%</span>
              </div>
              <code style={{ fontSize:12, color:C.text }}>{wh.url}</code>
              <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
                {wh.events.map(ev=><Bd key={ev} color={C.purp}>{ev}</Bd>)}
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <Bt variant="ghost" size="sm" onClick={()=>setShowLog(true)}>Logs</Bt>
              <Bt variant="ghost" size="sm">Editar</Bt>
              {wh.status==="Error"&&<Bt variant="primary" size="sm">Reintentar</Bt>}
            </div>
          </div>
        </Cd>
      ))}
      <Modal show={showNew} onClose={()=>setShowNew(false)} title="Nuevo webhook" width={500}>
        <Inp label="URL de destino *" placeholder="https://tu-sistema.com/webhook"/>
        <Inp label="Secret (HMAC-SHA256)" placeholder="whsec_...  (se genera automáticamente)"/>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:6 }}>Eventos a suscribir</label>
          {["tenant.created","tenant.approved","tenant.rejected","tenant.suspended","plan.changed","user.invited","error.critical"].map(ev=>(
            <div key={ev} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}><input type="checkbox" style={{ width:14, height:14 }}/><code style={{ fontSize:12 }}>{ev}</code></div>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}><Bt variant="ghost" onClick={()=>setShowNew(false)}>Cancelar</Bt><Bt variant="primary">Crear webhook</Bt></div>
      </Modal>
      <Modal show={showLog} onClose={()=>setShowLog(false)} title="Logs · monitor.ops.io" width={540}>
        <Tb headers={["Tiempo","Evento","Status","ms"]}
          rows={[
            ["14:32","tenant.suspended",<Bd color={C.err}>500</Bd>,"—"],
            ["12:15","error.critical",<Bd color={C.err}>timeout</Bd>,"30,000"],
            ["10:40","tenant.suspended",<Bd color={C.ok}>200</Bd>,"320"],
            ["08:22","error.critical",<Bd color={C.ok}>200</Bd>,"280"],
          ]}
        />
        <div style={{ marginTop:12, display:"flex", justifyContent:"flex-end" }}><Bt variant="primary" size="sm">Reintentar fallidos</Bt></div>
      </Modal>
    </div>
  );
}

// 6. CHANGELOG / RELEASES
function AdminChangelogScreen() {
  const C = useC();
  const [showNew, setShowNew] = useState(false);
  const releases = [
    { v:"v1.3.0", date:"02/04/2026", type:"Feature", title:"Habeas Data y RNBD", items:["Módulo de consentimientos Ley 1581","Panel de solicitudes de derechos","Exportación de datos del titular","Integración RNBD API"] },
    { v:"v1.2.1", date:"20/03/2026", type:"Bugfix", title:"Correcciones de estabilidad", items:["Fix: timeout en exports PDF > 10MB","Fix: invitaciones no llegaban con dominios .co","Mejora: velocidad de carga dashboard 40%"] },
    { v:"v1.2.0", date:"01/03/2026", type:"Feature", title:"Soporte multi-idioma", items:["Español Colombia (default)","Inglés USA","Detección automática por timezone"] },
    { v:"v1.1.0", date:"01/02/2026", type:"Feature", title:"Feature flags dinámicos", items:["Panel admin de flags","Override por tenant","Auditoría de cambios de flags"] },
  ];
  const typeColor = { Feature: C.ok, Bugfix: C.warn, Security: C.err, Infra: C.purp };
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="Changelog / Releases" prd="PRD 008" sub="Historial de versiones y comunicación de cambios"/>
        <Bt variant="primary" onClick={()=>setShowNew(true)}>+ Publicar release</Bt>
      </div>
      <Alert type="info">Las notas de release son visibles para todos los tenants desde su panel en "Novedades".</Alert>
      {releases.map((r,i)=>(
        <Cd key={i} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:10 }}>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <code style={{ fontSize:14, fontWeight:700, color:C.text }}>{r.v}</code>
              <Bd color={typeColor[r.type]}>{r.type}</Bd>
              <span style={{ fontSize:12, fontWeight:600 }}>{r.title}</span>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ fontSize:11, color:C.muted }}>{r.date}</span>
              <Bt variant="ghost" size="sm">Editar</Bt>
            </div>
          </div>
          <ul style={{ margin:0, paddingLeft:18 }}>
            {r.items.map((it,j)=><li key={j} style={{ fontSize:12, color:C.muted, marginBottom:3 }}>{it}</li>)}
          </ul>
        </Cd>
      ))}
      <Modal show={showNew} onClose={()=>setShowNew(false)} title="Publicar nuevo release" width={520}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Inp label="Versión *" placeholder="v1.4.0"/>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:6 }}>Tipo *</label>
            <div style={{ display:"flex", gap:6 }}>{["Feature","Bugfix","Security","Infra"].map((t,i)=><div key={t} style={{ flex:1, padding:"6px 4px", border:"2px solid "+(i===0?C.ok:C.border), borderRadius:6, textAlign:"center", cursor:"pointer", fontSize:11, color:i===0?C.ok:C.muted, fontWeight:i===0?700:400 }}>{t}</div>)}</div>
          </div>
        </div>
        <Inp label="Título del release *" placeholder="Nueva funcionalidad: ..."/>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:C.muted, display:"block", marginBottom:4 }}>Notas (una por línea)</label>
          <div style={{ background:C.inBg, border:"1px solid "+C.border, borderRadius:6, padding:"8px 12px", fontSize:12, color:C.muted, minHeight:80, fontFamily:"monospace" }}>- Nueva funcionalidad X&#10;- Fix: problema con Y&#10;- Mejora de rendimiento Z</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
          <input type="checkbox" defaultChecked style={{ width:14, height:14 }}/>
          <span style={{ fontSize:12 }}>Notificar a todos los tenants por email</span>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}><Bt variant="ghost" onClick={()=>setShowNew(false)}>Cancelar</Bt><Bt variant="primary">Publicar release</Bt></div>
      </Modal>
    </div>
  );
}

// 7. DOMINIOS PERSONALIZADOS
function AdminCustomDomainsScreen() {
  const C = useC();
  const [showDet, setShowDet] = useState(false);
  return (
    <div>
      <SectionHeader title="Dominios personalizados" prd="PRD 002" sub="Gestión de custom domains por tenant (plan Pro+)"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
        <SC2 label="Dominios activos" value="2" color={C.ok}/>
        <SC2 label="Verificando" value="1" color={C.warn}/>
        <SC2 label="Disponible en" value="Pro+" color={C.purp}/>
      </div>
      <Tb headers={["Tenant","Dominio personalizado","SSL","Estado DNS",""]}
        rows={[
          ["acme-corp","app.acme-corp.com",<Bd color={C.ok}>✓ Válido</Bd>,<Bd color={C.ok}>Verificado</Bd>,<Bt variant="ghost" size="sm" onClick={()=>setShowDet(true)}>Ver</Bt>],
          ["industrias-xv","portal.industriasxv.co",<Bd color={C.ok}>✓ Válido</Bd>,<Bd color={C.ok}>Verificado</Bd>,<Bt variant="ghost" size="sm">Ver</Bt>],
          ["verde-sa","sistema.verdesa.com",<Bd color={C.warn}>Pendiente</Bd>,<Bd color={C.warn}>Verificando...</Bd>,<Bt variant="primary" size="sm">Re-verificar</Bt>],
        ]}
      />
      <Modal show={showDet} onClose={()=>setShowDet(false)} title="Dominio · app.acme-corp.com" width={500}>
        <Cd style={{ background:C.inBg, marginBottom:12 }}>
          {[["Tenant","acme-corp"],["Dominio","app.acme-corp.com"],["SSL","Let's Encrypt · Vence 01/07/2026"],["DNS verificado","01/02/2026"],["Último chequeo","hace 5min"]].map(([k,v],i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid "+C.border+"40", fontSize:12 }}><span style={{ color:C.muted }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span></div>
          ))}
        </Cd>
        <Cd title="Registros DNS requeridos" style={{ background:C.inBg, marginBottom:12 }}>
          {[{type:"CNAME",name:"app",value:"mi-empresa.plataforma.com"},{type:"TXT",name:"_verify",value:"plataforma-verify=abc123"}].map((r,i)=>(
            <div key={i} style={{ background:"#fff", borderRadius:6, padding:"8px 10px", marginBottom:6, fontFamily:"monospace", fontSize:11 }}>
              <span style={{ color:C.purp, fontWeight:700 }}>{r.type}</span>{"  "}<span style={{ color:C.text }}>{r.name}</span>{"  →  "}<span style={{ color:C.muted }}>{r.value}</span>
            </div>
          ))}
        </Cd>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}><Bt variant="danger" size="sm">Revocar dominio</Bt><Bt variant="primary" size="sm">Re-verificar</Bt></div>
      </Modal>
    </div>
  );
}

function AdminAnalyticsScreen() {
  const m = useM(); const C = useC();
  const [period, setPeriod] = useState("6m");

  const mrrData = [2100,2400,2800,3100,3400,3800,4200,4580];
  const signups = [3,5,4,7,6,8,9,11];
  const churnData = [1,0,1,0,1,0,0,0];
  const activeUsers = [18,25,34,42,51,58,67,74];
  const apiCalls = [8200,12400,18600,22100,28400,31200,35600,38900];
  const storageGB = [1.2,2.1,3.4,5.0,6.8,8.2,9.5,11.1];

  const cohorts = [
    { month:"Ene 2026", total:4, m1:"100%", m2:"100%", m3:"75%", current:"75%" },
    { month:"Feb 2026", total:3, m1:"100%", m2:"100%", m3:"67%", current:"67%" },
    { month:"Mar 2026", total:4, m1:"100%", m2:"75%", m3:"—", current:"75%" },
  ];

  const topTenants = [
    { name:"acme-corp", mrr:"$580K", users:12, storage:"3.2 GB", api:"12.4K", health:95 },
    { name:"tech-solutions", mrr:"$580K", users:10, storage:"4.1 GB", api:"18.2K", health:92 },
    { name:"global-ind", mrr:"$1.2M", users:45, storage:"12.8 GB", api:"45.1K", health:88 },
    { name:"verde-sa", mrr:"$120K", users:3, storage:"0.1 GB", api:"1.2K", health:78 },
    { name:"startup-io", mrr:"$120K", users:4, storage:"0.4 GB", api:"3.8K", health:45 },
  ];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <SectionHeader title="Analytics detallado" prd="PRD 010-B" sub="Métricas de crecimiento, retención y uso de la plataforma"/>
        <div style={{ display:"flex", gap:6 }}>
          {["3m","6m","12m","Todo"].map(p=><div key={p} onClick={()=>setPeriod(p)} style={{ padding:"4px 10px", borderRadius:9999, fontSize:11, fontWeight:600, cursor:"pointer", background:period===p?C.pri:C.ph, color:period===p?"#fff":C.muted }}>{p}</div>)}
        </div>
      </div>

      {/* Top KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(6,1fr)", gap:10, marginBottom:20 }}>
        <SC2 label="MRR" value="$4.58M" color={C.ok} trend="up" sub="+9%"/>
        <SC2 label="Tenants" value="11" color={C.pri} trend="up" sub="+2"/>
        <SC2 label="Usuarios" value="74" color={C.purp} trend="up" sub="+10%"/>
        <SC2 label="Churn" value="0%" color={C.ok} sub="este mes"/>
        <SC2 label="NRR" value="108%" color={C.ok} sub="net revenue"/>
        <SC2 label="LTV prom." value="$6.9M" color={C.purp}/>
      </div>

      {/* Growth charts */}
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
        <Cd title="Crecimiento MRR">
          <MiniBar data={mrrData} color={C.ok} height={50}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:10, color:C.muted }}><span>Sep</span><span>Abr</span></div>
          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            <div><div style={{ fontSize:10, color:C.muted }}>CAGR</div><div style={{ fontSize:14, fontWeight:700, color:C.ok }}>+14.2%</div></div>
            <div><div style={{ fontSize:10, color:C.muted }}>Meta</div><div style={{ fontSize:14, fontWeight:700, color:C.muted }}>$6M</div></div>
          </div>
        </Cd>
        <Cd title="Signups acumulados">
          <MiniBar data={signups} color={C.pri} height={50}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:10, color:C.muted }}><span>Sep</span><span>Abr</span></div>
          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            <div><div style={{ fontSize:10, color:C.muted }}>Total</div><div style={{ fontSize:14, fontWeight:700, color:C.pri }}>53</div></div>
            <div><div style={{ fontSize:10, color:C.muted }}>Conv.</div><div style={{ fontSize:14, fontWeight:700, color:C.ok }}>20.7%</div></div>
          </div>
        </Cd>
        <Cd title="Churn mensual">
          <MiniBar data={churnData.map(v=>v+0.3)} color={C.err} height={50}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:10, color:C.muted }}><span>Sep</span><span>Abr</span></div>
          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            <div><div style={{ fontSize:10, color:C.muted }}>Total bajas</div><div style={{ fontSize:14, fontWeight:700, color:C.err }}>3</div></div>
            <div><div style={{ fontSize:10, color:C.muted }}>Prom. mes</div><div style={{ fontSize:14, fontWeight:700, color:C.muted }}>0.37</div></div>
          </div>
        </Cd>
      </div>

      {/* Usage charts */}
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:16, marginBottom:16 }}>
        <Cd title="Usuarios activos (DAU)">
          <MiniBar data={activeUsers} color={C.purp} height={50}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:10, color:C.muted }}><span>Sep</span><span>Abr</span></div>
        </Cd>
        <Cd title="API calls mensuales">
          <MiniBar data={apiCalls} color={C.pri} height={50}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:10, color:C.muted }}><span>Sep</span><span>Abr</span></div>
        </Cd>
      </div>

      {/* Cohort retention */}
      <Cd title="Retención por cohorte" style={{ marginBottom:16 }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:400 }}>
            <thead>
              <tr>
                {["Cohorte","Tenants","Mes 1","Mes 2","Mes 3","Actual"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 10px", borderBottom:"2px solid "+C.border, color:C.muted, fontWeight:600, fontSize:11 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c,i)=>(
                <tr key={i} style={{ borderBottom:"1px solid "+C.border }}>
                  <td style={{ padding:"8px 10px", fontWeight:500 }}>{c.month}</td>
                  <td style={{ padding:"8px 10px" }}>{c.total}</td>
                  {[c.m1,c.m2,c.m3,c.current].map((v,j)=>{
                    const pct = parseInt(v)||0;
                    const bg = v==="—"?"transparent":pct>=90?C.ok+"20":pct>=70?C.warn+"20":C.err+"20";
                    const color = v==="—"?C.muted:pct>=90?C.ok:pct>=70?C.warn:C.err;
                    return <td key={j} style={{ padding:"8px 10px", background:bg, color, fontWeight:600, textAlign:"center" }}>{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Cd>

      {/* Top tenants health */}
      <Cd title="Health score por tenant" style={{ marginBottom:16 }}>
        {topTenants.map((t,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:i<topTenants.length-1?"1px solid "+C.border:"none" }}>
            <span style={{ fontSize:13, fontWeight:600, minWidth:110 }}>{t.name}</span>
            <div style={{ flex:1 }}>
              <div style={{ background:C.ph, borderRadius:4, height:8 }}>
                <div style={{ background:t.health>=80?C.ok:t.health>=60?C.warn:C.err, width:t.health+"%", height:"100%", borderRadius:4 }}/>
              </div>
            </div>
            <span style={{ fontSize:12, fontWeight:700, color:t.health>=80?C.ok:t.health>=60?C.warn:C.err, minWidth:30, textAlign:"right" }}>{t.health}</span>
            <div style={{ display:"flex", gap:8, fontSize:10, color:C.muted, minWidth:m?0:200 }}>
              {!m&&<><span>{t.users} usr</span><span>{t.storage}</span><span>{t.api} calls</span></>}
            </div>
          </div>
        ))}
        <div style={{ fontSize:11, color:C.muted, marginTop:8 }}>Health = combinación de actividad, pagos al día, uso de features y crecimiento de usuarios</div>
      </Cd>
    </div>
  );
}

function AdminJobsScreen() {
  const m = useM(); const C = useC();
  const [tab, setTab] = useState(0);
  const tabs = ["Activos","Completados","Fallidos","Programados"];

  const activeJobs = [
    { id:"JOB-2041", type:"email_blast", tenant:"acme-corp", started:"03/04 09:15", progress:67, detail:"Envío masivo · 670/1000 emails", priority:"Normal" },
    { id:"JOB-2040", type:"report_gen", tenant:"tech-solutions", started:"03/04 09:10", progress:34, detail:"Generando reporte Q1 · 12 módulos", priority:"Normal" },
    { id:"JOB-2039", type:"data_migration", tenant:"global-ind", started:"03/04 08:00", progress:89, detail:"Migración datos legacy · 89K registros", priority:"Alta" },
  ];

  const completedJobs = [
    { id:"JOB-2038", type:"backup", tenant:"sistema", finished:"03/04 06:00", duration:"12m 34s", detail:"Backup diario completo", size:"4.2 GB" },
    { id:"JOB-2037", type:"email_blast", tenant:"verde-sa", finished:"02/04 18:30", duration:"2m 15s", detail:"Envío masivo · 150 emails", size:"—" },
    { id:"JOB-2036", type:"report_gen", tenant:"acme-corp", finished:"02/04 15:00", duration:"4m 50s", detail:"Reporte auditoría Mar 2026", size:"2.8 MB" },
    { id:"JOB-2035", type:"cleanup", tenant:"sistema", finished:"02/04 03:00", duration:"8m 22s", detail:"Limpieza archivos temporales", size:"1.1 GB liberados" },
  ];

  const failedJobs = [
    { id:"JOB-2034", type:"email_blast", tenant:"old-corp", failed:"02/04 14:00", error:"SMTP connection timeout after 30s", retries:3, detail:"Envío masivo · 0/500 emails" },
    { id:"JOB-2031", type:"data_migration", tenant:"startup-io", failed:"01/04 10:00", error:"Foreign key constraint violation: user_id=445", retries:1, detail:"Migración parcial · 2.3K/10K registros" },
  ];

  const scheduled = [
    { id:"JOB-SCH-1", type:"backup", next:"04/04 03:00", frequency:"Diario", tenant:"sistema", detail:"Backup completo BD + archivos" },
    { id:"JOB-SCH-2", type:"cleanup", next:"05/04 03:00", frequency:"Semanal", tenant:"sistema", detail:"Limpieza temp files + logs rotados" },
    { id:"JOB-SCH-3", type:"report_gen", next:"01/05 00:00", frequency:"Mensual", tenant:"todos", detail:"Reportes mensuales automáticos" },
  ];

  const typeCfg = {
    email_blast:{ icon:"📧", label:"Email masivo", color:C.pri },
    report_gen:{ icon:"📊", label:"Reporte", color:C.purp },
    data_migration:{ icon:"📦", label:"Migración", color:C.warn },
    backup:{ icon:"💾", label:"Backup", color:C.ok },
    cleanup:{ icon:"🧹", label:"Limpieza", color:C.muted },
  };

  return (
    <div>
      <SectionHeader title="Cola de Jobs" prd="PRD 011" sub="Tareas en background, programadas y monitoreo de ejecución"/>

      <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(5,1fr)", gap:10, marginBottom:16 }}>
        <SC2 label="En ejecución" value="3" color={C.pri}/>
        <SC2 label="En cola" value="0" color={C.muted}/>
        <SC2 label="Hoy completados" value="4" color={C.ok}/>
        <SC2 label="Hoy fallidos" value="0" color={C.err}/>
        <SC2 label="Programados" value="3" color={C.warn}/>
      </div>

      <div style={{ display:"flex", background:"#fff", borderRadius:"8px 8px 0 0", border:"1px solid "+C.border, borderBottom:"none", overflowX:"auto" }}>
        {tabs.map((t,i)=><div key={t} onClick={()=>setTab(i)} style={{ padding:"10px 16px", fontSize:13, fontWeight:tab===i?700:400, color:tab===i?C.pri:C.muted, borderBottom:"2px solid "+(tab===i?C.pri:"transparent"), cursor:"pointer", whiteSpace:"nowrap" }}>{t}</div>)}
      </div>
      <div style={{ border:"1px solid "+C.border, borderRadius:"0 0 8px 8px", background:"#fff", padding:20, marginBottom:16 }}>

        {/* Tab 0: Activos */}
        {tab===0&&(
          <div>
            {activeJobs.length===0?<div style={{ textAlign:"center", padding:24, color:C.muted }}>No hay jobs en ejecución</div>:
            activeJobs.map((j,i)=>{
              const tc = typeCfg[j.type]||typeCfg.backup;
              return (
                <Cd key={i} style={{ marginBottom:12, borderLeft:"3px solid "+tc.color }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <span>{tc.icon}</span>
                        <span style={{ fontSize:13, fontWeight:700 }}>{j.detail}</span>
                      </div>
                      <div style={{ display:"flex", gap:8, fontSize:11, color:C.muted }}>
                        <span style={{ fontFamily:"monospace" }}>{j.id}</span>
                        <span>·</span><span>{j.tenant}</span>
                        <span>·</span><span>Inicio: {j.started}</span>
                        {j.priority==="Alta"&&<Bd color={C.err}>Alta</Bd>}
                      </div>
                    </div>
                    <Bt variant="danger" size="sm">Cancelar</Bt>
                  </div>
                  <div style={{ background:C.ph, borderRadius:4, height:8, marginBottom:4 }}>
                    <div style={{ background:tc.color, width:j.progress+"%", height:"100%", borderRadius:4, transition:"width .3s" }}/>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted }}>
                    <span>{j.progress}% completado</span>
                    <span>~{Math.round((100-j.progress)/10)} min restante</span>
                  </div>
                </Cd>
              );
            })}
          </div>
        )}

        {/* Tab 1: Completados */}
        {tab===1&&(
          <div>
            <Tb headers={["ID","Tipo","Tenant","Detalle","Duración","Tamaño","Fin"]}
              rows={completedJobs.map(j=>{
                const tc = typeCfg[j.type]||typeCfg.backup;
                return [
                  <span style={{ fontFamily:"monospace", fontSize:11 }}>{j.id}</span>,
                  <span style={{ display:"flex", alignItems:"center", gap:4 }}><span>{tc.icon}</span><Bd color={tc.color}>{tc.label}</Bd></span>,
                  j.tenant,
                  <span style={{ fontSize:11 }}>{j.detail}</span>,
                  <span style={{ fontFamily:"monospace", fontSize:11, color:C.ok }}>{j.duration}</span>,
                  <span style={{ fontSize:11, color:C.muted }}>{j.size}</span>,
                  <span style={{ fontSize:11, color:C.muted }}>{j.finished}</span>,
                ];
              })}
            />
          </div>
        )}

        {/* Tab 2: Fallidos */}
        {tab===2&&(
          <div>
            {failedJobs.map((j,i)=>{
              const tc = typeCfg[j.type]||typeCfg.backup;
              return (
                <Cd key={i} style={{ marginBottom:12, borderLeft:"3px solid "+C.err }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <span>{tc.icon}</span>
                        <span style={{ fontSize:13, fontWeight:700 }}>{j.detail}</span>
                        <Bd color={C.err}>Fallido</Bd>
                      </div>
                      <div style={{ display:"flex", gap:8, fontSize:11, color:C.muted }}>
                        <span style={{ fontFamily:"monospace" }}>{j.id}</span>
                        <span>·</span><span>{j.tenant}</span>
                        <span>·</span><span>{j.failed}</span>
                        <span>·</span><span>{j.retries} reintentos</span>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <Bt variant="outline" size="sm">🔄 Reintentar</Bt>
                      <Bt variant="ghost" size="sm">Descartar</Bt>
                    </div>
                  </div>
                  <div style={{ background:C.err+"10", border:"1px solid "+C.err+"20", borderRadius:6, padding:"8px 12px", fontFamily:"monospace", fontSize:11, color:C.err, lineHeight:1.5 }}>
                    Error: {j.error}
                  </div>
                </Cd>
              );
            })}
          </div>
        )}

        {/* Tab 3: Programados */}
        {tab===3&&(
          <div>
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
              <Bt variant="primary" size="sm">+ Programar job</Bt>
            </div>
            {scheduled.map((j,i)=>{
              const tc = typeCfg[j.type]||typeCfg.backup;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:i<scheduled.length-1?"1px solid "+C.border:"none", gap:8, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
                    <span style={{ fontSize:18 }}>{tc.icon}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600 }}>{j.detail}</div>
                      <div style={{ fontSize:11, color:C.muted }}><span style={{ fontFamily:"monospace" }}>{j.id}</span> · {j.tenant} · {j.frequency}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:12, fontWeight:500 }}>Próx: {j.next}</div>
                      <Bd color={tc.color}>{j.frequency}</Bd>
                    </div>
                    <Bt variant="ghost" size="sm">⋮</Bt>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminSettingsScreen() {
  const m = useM(); const C = useC();
  const [tab, setTab] = useState(0);
  const tabs = ["General","Email / SMTP","Storage","Límites","Seguridad"];

  const Toggle = ({label, desc, on}) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid "+C.border, gap:12 }}>
      <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:500 }}>{label}</div>{desc&&<div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{desc}</div>}</div>
      <div style={{ width:36, height:20, borderRadius:10, background:on?C.ok:C.border, cursor:"pointer", position:"relative", flexShrink:0 }}>
        <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:on?18:2, boxShadow:"0 1px 3px rgba(0,0,0,.2)" }}/>
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeader title="Configuración global" prd="PRD 012" sub="Settings de infraestructura, providers y límites de la plataforma"/>

      <div style={{ display:"flex", background:"#fff", borderRadius:"8px 8px 0 0", border:"1px solid "+C.border, borderBottom:"none", overflowX:"auto" }}>
        {tabs.map((t,i)=><div key={t} onClick={()=>setTab(i)} style={{ padding:"10px 16px", fontSize:13, fontWeight:tab===i?700:400, color:tab===i?C.pri:C.muted, borderBottom:"2px solid "+(tab===i?C.pri:"transparent"), cursor:"pointer", whiteSpace:"nowrap" }}>{t}</div>)}
      </div>
      <div style={{ border:"1px solid "+C.border, borderRadius:"0 0 8px 8px", background:"#fff", padding:20, marginBottom:16 }}>

        {/* Tab 0: General */}
        {tab===0&&(
          <div>
            <Cd title="Información de la plataforma" style={{ marginBottom:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12 }}>
                <Inp label="Nombre de la plataforma" placeholder="Plataforma Ambiental"/>
                <Inp label="URL base" placeholder="https://plataforma.com"/>
                <Inp label="Dominio para tenants" placeholder="*.plataforma.com"/>
                <Inp label="Email soporte" placeholder="soporte@plataforma.com"/>
              </div>
            </Cd>
            <Cd title="Entorno" style={{ marginBottom:16 }}>
              {[["Versión","v3.2.1 (build 2026.04.03)"],["Entorno","Production"],["Región","us-east-1 (AWS)"],["Base de datos","PostgreSQL 16.2"],["Cache","Redis 7.2"],["Runtime","Node.js 20 LTS"]].map(([k,v],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid "+C.border+"60" }}>
                  <span style={{ fontSize:12, color:C.muted }}>{k}</span>
                  <span style={{ fontSize:12, fontWeight:500, fontFamily:"monospace" }}>{v}</span>
                </div>
              ))}
            </Cd>
            <div style={{ display:"flex", justifyContent:"flex-end" }}><Bt variant="primary">Guardar cambios</Bt></div>
          </div>
        )}

        {/* Tab 1: Email / SMTP */}
        {tab===1&&(
          <div>
            <Alert type="info">La configuración SMTP se usa para todos los emails transaccionales de la plataforma (invitaciones, notificaciones, recuperación de clave).</Alert>
            <Cd title="Proveedor SMTP" style={{ marginBottom:16 }}>
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                {["Amazon SES","SendGrid","SMTP Custom"].map((p,i)=><div key={p} style={{ flex:1, padding:"10px 8px", border:"2px solid "+(i===0?C.pri:C.border), borderRadius:6, textAlign:"center", cursor:"pointer", background:i===0?C.pri+"08":"#fff" }}><div style={{ fontSize:12, fontWeight:600, color:i===0?C.pri:C.muted }}>{p}</div></div>)}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12 }}>
                <Inp label="Región SES" placeholder="us-east-1"/>
                <Inp label="From email" placeholder="noreply@plataforma.com"/>
                <Inp label="From name" placeholder="Plataforma"/>
                <Inp label="Reply-to" placeholder="soporte@plataforma.com"/>
              </div>
            </Cd>
            <Cd title="Estado de verificación" style={{ marginBottom:16 }}>
              {[["Dominio plataforma.com","Verificado","ok"],["DKIM","Configurado","ok"],["SPF","Configurado","ok"],["DMARC","No configurado","warn"]].map(([k,v,s],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid "+C.border+"60" }}>
                  <span style={{ fontSize:12 }}>{k}</span>
                  <Bd color={s==="ok"?C.ok:C.warn}>{v}</Bd>
                </div>
              ))}
            </Cd>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <Bt variant="outline" size="sm">📧 Enviar test</Bt>
              <Bt variant="primary">Guardar</Bt>
            </div>
          </div>
        )}

        {/* Tab 2: Storage */}
        {tab===2&&(
          <div>
            <Cd title="Proveedor de almacenamiento" style={{ marginBottom:16 }}>
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                {["Amazon S3","Google Cloud Storage","Azure Blob","Local (dev)"].map((p,i)=><div key={p} style={{ flex:1, padding:"10px 8px", border:"2px solid "+(i===0?C.pri:C.border), borderRadius:6, textAlign:"center", cursor:"pointer", background:i===0?C.pri+"08":"#fff" }}><div style={{ fontSize:12, fontWeight:600, color:i===0?C.pri:C.muted }}>{p}</div></div>)}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12 }}>
                <Inp label="Bucket name" placeholder="plataforma-prod-files"/>
                <Inp label="Región" placeholder="us-east-1"/>
                <Inp label="Access Key ID" placeholder="AKIA••••••••••••"/>
                <Inp label="Secret Key" placeholder="••••••••••••••••"/>
              </div>
            </Cd>
            <Cd title="Uso actual" style={{ marginBottom:16 }}>
              <PB label="Storage total" value={11.1} max={50} color={C.ok} showPct/>
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr 1fr", gap:12, marginTop:8 }}>
                {[["Total usado","11.1 GB"],["Archivos de tenants","9.8 GB"],["Backups","1.3 GB"],["Capacidad contratada","50 GB"],["Costo estimado/mes","$2.30 USD"]].map(([k,v],i)=>(
                  <div key={i} style={{ padding:8, background:C.inBg, borderRadius:6 }}>
                    <div style={{ fontSize:10, color:C.muted }}>{k}</div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </Cd>
            <div style={{ display:"flex", justifyContent:"flex-end" }}><Bt variant="primary">Guardar</Bt></div>
          </div>
        )}

        {/* Tab 3: Límites */}
        {tab===3&&(
          <div>
            <Alert type="info">Estos límites aplican por defecto a todos los tenants nuevos. Pueden ser sobreescritos individualmente desde el detalle de cada tenant.</Alert>
            <Cd title="Límites por plan" style={{ marginBottom:16 }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:400 }}>
                  <thead>
                    <tr>
                      {["Recurso","Starter","Professional","Enterprise"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 10px", borderBottom:"2px solid "+C.border, color:C.muted, fontWeight:600, fontSize:11 }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Usuarios","5","15","Ilimitado"],
                      ["Storage","1 GB","10 GB","100 GB"],
                      ["API calls/mes","5.000","50.000","500.000"],
                      ["Emails/mes","200","1.000","10.000"],
                      ["Webhooks","2","10","50"],
                      ["Custom domain","No","Sí","Sí"],
                      ["SSO / SAML","No","No","Sí"],
                      ["SLA","—","99.5%","99.9%"],
                    ].map((row,i)=>(
                      <tr key={i} style={{ borderBottom:"1px solid "+C.border }}>
                        {row.map((v,j)=><td key={j} style={{ padding:"8px 10px", fontWeight:j===0?500:400, color:j===0?C.text:v==="No"||v==="—"?C.muted:C.text }}>{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Cd>
            <Cd title="Límites globales">
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12 }}>
                <Inp label="Máx. tenants totales" placeholder="500"/>
                <Inp label="Máx. storage global (GB)" placeholder="500"/>
                <Inp label="Rate limit API (req/min)" placeholder="1000"/>
                <Inp label="Tamaño máx. archivo (MB)" placeholder="50"/>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}><Bt variant="primary">Guardar</Bt></div>
            </Cd>
          </div>
        )}

        {/* Tab 4: Seguridad */}
        {tab===4&&(
          <div>
            <Cd title="Autenticación" style={{ marginBottom:16 }}>
              <Toggle label="Registro público habilitado" desc="Permite que nuevos tenants se registren sin aprobación manual" on={false}/>
              <Toggle label="Aprobación manual de tenants" desc="Requiere que un admin apruebe cada nuevo registro" on={true}/>
              <Toggle label="2FA obligatorio para admins" desc="Todos los admin de tenant deben configurar autenticación de dos factores" on={false}/>
              <Toggle label="Expiración de sesión" desc="Cerrar sesión automáticamente tras 24h de inactividad" on={true}/>
            </Cd>
            <Cd title="Políticas de contraseña" style={{ marginBottom:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:12 }}>
                <Inp label="Longitud mínima" placeholder="8"/>
                <Inp label="Expiración (días)" placeholder="90"/>
              </div>
              <Toggle label="Requiere mayúscula" on={true}/>
              <Toggle label="Requiere número" on={true}/>
              <Toggle label="Requiere carácter especial" on={false}/>
            </Cd>
            <Cd title="IP Allowlist">
              <Alert type="warn">Al activar, solo las IPs listadas podrán acceder al panel admin.</Alert>
              <Toggle label="IP Allowlist activo" desc="Restringir acceso admin a IPs específicas" on={false}/>
              <Inp label="IPs permitidas (una por línea)" placeholder="181.55.32.14&#10;190.24.11.0/24"/>
            </Cd>
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16 }}><Bt variant="primary">Guardar cambios</Bt></div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminBillingScreen() {
  const m = useM(); const C = useC();
  const [tab, setTab] = useState(0);
  const tabs = ["Resumen","Transacciones","Morosos"];

  const mrrData = [3200,3400,3600,3800,4000,4200,4400,4580];
  const cobros = [
    { date:"01/04/2026", tenant:"acme-corp",       plan:"Professional", monto:"$580.000", estado:"Pagado",  metodo:"Tarjeta ****4521" },
    { date:"01/04/2026", tenant:"verde-sa",         plan:"Starter",      monto:"$120.000", estado:"Pagado",  metodo:"PSE Bancolombia" },
    { date:"01/04/2026", tenant:"tech-solutions",   plan:"Professional", monto:"$580.000", estado:"Pagado",  metodo:"Tarjeta ****8877" },
    { date:"01/04/2026", tenant:"old-corp",          plan:"Professional", monto:"$580.000", estado:"Fallido", metodo:"Tarjeta ****1234" },
    { date:"01/04/2026", tenant:"startup-io",        plan:"Starter",      monto:"$120.000", estado:"Fallido", metodo:"PSE Davivienda" },
    { date:"01/03/2026", tenant:"acme-corp",       plan:"Professional", monto:"$580.000", estado:"Pagado",  metodo:"Tarjeta ****4521" },
    { date:"01/03/2026", tenant:"verde-sa",         plan:"Starter",      monto:"$120.000", estado:"Pagado",  metodo:"PSE Bancolombia" },
    { date:"01/03/2026", tenant:"old-corp",          plan:"Professional", monto:"$580.000", estado:"Pagado",  metodo:"Tarjeta ****1234" },
  ];

  const morosos = [
    { tenant:"old-corp", empresa:"Old Corp S.A.S.", plan:"Professional", deuda:"$1.160.000", meses:2, lastPay:"01/02/2026", estado:"Suspendido", contacto:"admin@oldcorp.com" },
    { tenant:"startup-io", empresa:"Startup IO Ltda.", plan:"Starter", deuda:"$120.000", meses:1, lastPay:"01/03/2026", estado:"Activo (gracia)", contacto:"ceo@startup.io" },
  ];

  return (
    <div>
      <SectionHeader title="Facturación global" prd="PRD 010" sub="Revenue, cobros y cuentas morosas de todos los tenants"/>

      <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(5,1fr)", gap:10, marginBottom:16 }}>
        <SC2 label="MRR" value="$4.58M" color={C.ok} trend="up" sub="+9% vs mes ant."/>
        <SC2 label="ARR proyectado" value="$54.9M" color={C.purp}/>
        <SC2 label="Cobros exitosos" value="92%" color={C.ok}/>
        <SC2 label="Cobros fallidos" value="2" color={C.err} trend="down" sub="este mes"/>
        <SC2 label="Cuentas morosas" value="2" color={C.warn}/>
      </div>

      <div style={{ display:"flex", background:"#fff", borderRadius:"8px 8px 0 0", border:"1px solid "+C.border, borderBottom:"none", overflowX:"auto" }}>
        {tabs.map((t,i)=><div key={t} onClick={()=>setTab(i)} style={{ padding:"10px 16px", fontSize:13, fontWeight:tab===i?700:400, color:tab===i?C.pri:C.muted, borderBottom:"2px solid "+(tab===i?C.pri:"transparent"), cursor:"pointer", whiteSpace:"nowrap" }}>{t}</div>)}
      </div>
      <div style={{ border:"1px solid "+C.border, borderRadius:"0 0 8px 8px", background:"#fff", padding:20, marginBottom:16 }}>

        {/* Tab 0: Resumen */}
        {tab===0&&(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:16, marginBottom:16 }}>
              <Cd title="MRR — últimos 8 meses">
                <MiniBar data={mrrData} color={C.ok} height={60}/>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                  <span style={{ fontSize:10, color:C.muted }}>Sep</span><span style={{ fontSize:10, color:C.muted }}>Abr</span>
                </div>
              </Cd>
              <Cd title="Revenue por plan">
                {[
                  { plan:"Enterprise", n:2, mrr:"$2.400.000", pct:52, color:C.ok },
                  { plan:"Professional", n:4, mrr:"$1.740.000", pct:38, color:C.purp },
                  { plan:"Starter", n:5, mrr:"$440.000", pct:10, color:C.pri },
                ].map(p=>(
                  <div key={p.plan} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                      <span style={{ fontWeight:500 }}>{p.plan} <span style={{ color:C.muted, fontWeight:400 }}>({p.n} tenants)</span></span>
                      <span style={{ fontWeight:600 }}>{p.mrr}</span>
                    </div>
                    <div style={{ background:C.ph, borderRadius:4, height:8 }}>
                      <div style={{ background:p.color, width:p.pct+"%", height:"100%", borderRadius:4 }}/>
                    </div>
                  </div>
                ))}
              </Cd>
            </div>
            <Cd title="Métricas de cobro — Abril 2026">
              <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"repeat(4,1fr)", gap:12 }}>
                {[
                  { label:"Total facturado", value:"$4.580.000", color:C.text },
                  { label:"Cobrado exitoso", value:"$3.880.000", color:C.ok },
                  { label:"Cobros fallidos", value:"$700.000", color:C.err },
                  { label:"Tasa de éxito", value:"84.7%", color:C.warn },
                ].map((m2,i)=>(
                  <div key={i} style={{ textAlign:"center", padding:12, background:C.inBg, borderRadius:8 }}>
                    <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{m2.label}</div>
                    <div style={{ fontSize:18, fontWeight:700, color:m2.color }}>{m2.value}</div>
                  </div>
                ))}
              </div>
            </Cd>
          </div>
        )}

        {/* Tab 1: Transacciones */}
        {tab===1&&(
          <div>
            <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
              <div style={{ background:C.inBg, border:"1px solid "+C.border, borderRadius:6, padding:"6px 12px", fontSize:12, color:C.muted, flex:1, minWidth:120 }}>🔍 Buscar tenant...</div>
              <div style={{ display:"flex", gap:6 }}>
                {["Todos","Pagados","Fallidos"].map((f,i)=><div key={f} style={{ padding:"4px 10px", borderRadius:9999, fontSize:11, fontWeight:600, background:i===0?C.pri:C.ph, color:i===0?"#fff":C.muted, cursor:"pointer" }}>{f}</div>)}
              </div>
            </div>
            <Tb headers={["Fecha","Tenant","Plan","Monto","Estado","Método"]}
              rows={cobros.map(c=>[
                c.date,
                <span style={{ fontWeight:500 }}>{c.tenant}</span>,
                c.plan,
                <span style={{ fontWeight:600 }}>{c.monto}</span>,
                <Bd color={c.estado==="Pagado"?C.ok:C.err}>{c.estado}</Bd>,
                <span style={{ fontSize:11, color:C.muted }}>{c.metodo}</span>,
              ])}
            />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
              <span style={{ fontSize:11, color:C.muted }}>8 transacciones</span>
              <Bt variant="ghost" size="sm">Exportar CSV</Bt>
            </div>
          </div>
        )}

        {/* Tab 2: Morosos */}
        {tab===2&&(
          <div>
            <Alert type="warn">Hay {morosos.length} cuentas con pagos vencidos. Revisa y toma acción.</Alert>
            {morosos.map((mo,i)=>(
              <Cd key={i} style={{ marginBottom:12, borderLeft:"3px solid "+(mo.meses>=2?C.err:C.warn) }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:14, fontWeight:700 }}>{mo.empresa}</span>
                      <Bd color={mo.meses>=2?C.err:C.warn}>{mo.estado}</Bd>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, fontSize:12 }}>
                      <div><span style={{ color:C.muted }}>Tenant:</span> {mo.tenant}</div>
                      <div><span style={{ color:C.muted }}>Plan:</span> {mo.plan}</div>
                      <div><span style={{ color:C.muted }}>Deuda:</span> <span style={{ fontWeight:700, color:C.err }}>{mo.deuda}</span></div>
                      <div><span style={{ color:C.muted }}>Meses moroso:</span> <span style={{ fontWeight:700, color:mo.meses>=2?C.err:C.warn }}>{mo.meses}</span></div>
                      <div><span style={{ color:C.muted }}>Último pago:</span> {mo.lastPay}</div>
                      <div><span style={{ color:C.muted }}>Contacto:</span> {mo.contacto}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                    <Bt variant="outline" size="sm">📧 Enviar recordatorio</Bt>
                    <Bt variant="warn" size="sm">⏸ Suspender</Bt>
                    <Bt variant="ghost" size="sm" style={{ color:C.err }}>Eliminar tenant</Bt>
                  </div>
                </div>
              </Cd>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminTenantDetailScreen({ setNav }) {
  const m = useM(); const C = useC();
  const [tab, setTab] = useState(0);
  const [showSuspend, setShowSuspend] = useState(false);
  const tabs = ["General","Usuarios","Uso y límites","Facturación","Auditoría","Feature flags"];

  const tenant = {
    slug:"acme-corp", empresa:"ACME Corp S.A.S.", nit:"900.111.222-3", plan:"Professional", planColor:C.purp,
    estado:"Activo", admin:"admin@acme.com", creado:"01/01/2026", subdominio:"acme-corp.plataforma.com",
    usuarios:12, maxUsuarios:15, storage:3.2, maxStorage:10, mrr:"$580.000", proxFactura:"01/05/2026",
  };

  const users = [
    { name:"Andrés López", email:"admin@acme.com", role:"Admin", status:"Activo", lastLogin:"03/04/2026 09:15" },
    { name:"Laura García", email:"laura@acme.com", role:"Operador", status:"Activo", lastLogin:"03/04/2026 08:30" },
    { name:"Pedro Ruiz", email:"pedro@acme.com", role:"Operador", status:"Activo", lastLogin:"02/04/2026 17:00" },
    { name:"Ana Martínez", email:"ana@acme.com", role:"Visor", status:"Activo", lastLogin:"01/04/2026 10:00" },
    { name:"Carlos Díaz", email:"carlos@acme.com", role:"Visor", status:"Pendiente", lastLogin:"—" },
  ];

  const invoices = [
    { fecha:"01/04/2026", monto:"$580.000", estado:"Pagado", metodo:"Tarjeta ****4521" },
    { fecha:"01/03/2026", monto:"$580.000", estado:"Pagado", metodo:"Tarjeta ****4521" },
    { fecha:"01/02/2026", monto:"$580.000", estado:"Pagado", metodo:"Tarjeta ****4521" },
    { fecha:"01/01/2026", monto:"$435.000", estado:"Pagado", metodo:"PSE Bancolombia" },
  ];

  const auditLog = [
    { date:"03/04 09:15", user:"admin@acme.com", action:"Login exitoso", detail:"Chrome · Bogotá" },
    { date:"03/04 09:20", user:"admin@acme.com", action:"Editó usuario", detail:"laura@acme.com → rol Operador" },
    { date:"02/04 17:10", user:"laura@acme.com", action:"Subió archivo", detail:"reporte-q1.pdf · 2.4MB" },
    { date:"02/04 14:00", user:"pedro@acme.com", action:"Exportó auditoría", detail:"Rango: Mar 2026" },
    { date:"01/04 10:30", user:"admin@acme.com", action:"Cambió plan", detail:"Starter → Professional" },
    { date:"01/04 10:00", user:"admin@acme.com", action:"Login exitoso", detail:"Safari · Medellín" },
  ];

  const flags = [
    { name:"SMS_NOTIFICATIONS", enabled:true, desc:"Envío de SMS a usuarios" },
    { name:"PDF_EXPORT", enabled:true, desc:"Exportar reportes en PDF" },
    { name:"AUDIT_EXPORT", enabled:true, desc:"Exportación de auditoría" },
    { name:"API_ACCESS", enabled:true, desc:"Acceso a API pública v2" },
    { name:"BULK_IMPORT", enabled:false, desc:"Importación masiva de datos" },
    { name:"ADVANCED_ANALYTICS", enabled:false, desc:"Dashboard analítico avanzado" },
    { name:"CUSTOM_BRANDING", enabled:true, desc:"Branding personalizado" },
    { name:"SSO_SAML", enabled:false, desc:"Single Sign-On con SAML" },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:16 }}>
        <span onClick={()=>setNav("admin-tenants")} style={{ fontSize:12, color:C.pri, cursor:"pointer" }}>← Tenants</span>
        <span style={{ fontSize:12, color:C.muted }}>/</span>
        <span style={{ fontSize:12, color:C.muted }}>{tenant.slug}</span>
      </div>

      {/* Tenant header */}
      <Cd style={{ marginBottom:16 }}>
        <div style={{ display:"flex", gap:16, alignItems:m?"flex-start":"center", flexWrap:"wrap" }}>
          <div style={{ width:48, height:48, borderRadius:10, background:tenant.planColor+"20", color:tenant.planColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, flexShrink:0 }}>A</div>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
              <span style={{ fontSize:17, fontWeight:700 }}>{tenant.empresa}</span>
              <Bd color={C.ok}>{tenant.estado}</Bd>
              <Bd color={tenant.planColor}>{tenant.plan}</Bd>
            </div>
            <div style={{ fontSize:12, color:C.muted }}>{tenant.subdominio} · NIT: {tenant.nit} · Admin: {tenant.admin}</div>
          </div>
          <div style={{ display:"flex", gap:6, flexShrink:0, flexWrap:"wrap" }}>
            <Bt variant="outline" size="sm">👁 Impersonar</Bt>
            <Bt variant="ghost" size="sm" style={{ color:C.warn }} onClick={()=>setShowSuspend(true)}>Suspender</Bt>
            <Bt variant="primary" size="sm">Editar</Bt>
          </div>
        </div>
      </Cd>

      {/* Quick stats */}
      <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(5,1fr)", gap:10, marginBottom:16 }}>
        <SC2 label="Usuarios" value={tenant.usuarios+"/"+tenant.maxUsuarios} color={C.pri}/>
        <SC2 label="Storage" value={tenant.storage+" GB"} sub={"de "+tenant.maxStorage+" GB"} color={C.ok}/>
        <SC2 label="MRR" value={tenant.mrr} color={C.purp}/>
        <SC2 label="Creado" value={tenant.creado} color={C.muted}/>
        <SC2 label="Prox. factura" value={tenant.proxFactura} color={C.pri}/>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:"#fff", borderRadius:"8px 8px 0 0", border:"1px solid "+C.border, borderBottom:"none", overflowX:"auto" }}>
        {tabs.map((t,i)=><div key={t} onClick={()=>setTab(i)} style={{ padding:"10px 16px", fontSize:13, fontWeight:tab===i?700:400, color:tab===i?C.pri:C.muted, borderBottom:"2px solid "+(tab===i?C.pri:"transparent"), cursor:"pointer", whiteSpace:"nowrap" }}>{t}</div>)}
      </div>
      <div style={{ border:"1px solid "+C.border, borderRadius:"0 0 8px 8px", background:"#fff", padding:20, marginBottom:16 }}>

        {/* Tab 0: General */}
        {tab===0&&(
          <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:16 }}>
            <Cd title="Datos de la empresa">
              {[["Razón social",tenant.empresa],["NIT",tenant.nit],["Subdominio",tenant.slug],["Plan",tenant.plan],["Creado",tenant.creado],["Admin principal",tenant.admin]].map(([k,v],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid "+C.border+"60", gap:8 }}>
                  <span style={{ fontSize:12, color:C.muted }}>{k}</span>
                  <span style={{ fontSize:12, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </Cd>
            <Cd title="Configuración">
              {[["Zona horaria","América/Bogotá"],["Moneda","COP"],["Idioma","Español"],["2FA obligatorio","No"],["SSO","No configurado"],["Dominio custom","—"]].map(([k,v],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid "+C.border+"60", gap:8 }}>
                  <span style={{ fontSize:12, color:C.muted }}>{k}</span>
                  <span style={{ fontSize:12, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </Cd>
          </div>
        )}

        {/* Tab 1: Usuarios */}
        {tab===1&&(
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:13, color:C.muted }}>{users.length} de {tenant.maxUsuarios} usuarios</span>
              <Bt variant="ghost" size="sm">Exportar</Bt>
            </div>
            <Tb headers={["Nombre","Email","Rol","Estado","Último login"]}
              rows={users.map(u=>[
                <span style={{ fontWeight:500 }}>{u.name}</span>,
                u.email,
                <Bd color={u.role==="Admin"?C.pri:u.role==="Operador"?C.purp:C.muted}>{u.role}</Bd>,
                <Bd color={u.status==="Activo"?C.ok:C.warn}>{u.status}</Bd>,
                <span style={{ fontSize:11, color:C.muted }}>{u.lastLogin}</span>,
              ])}
            />
          </div>
        )}

        {/* Tab 2: Uso y límites */}
        {tab===2&&(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr":"1fr 1fr", gap:16, marginBottom:16 }}>
              <Cd title="Recursos">
                <PB label="Usuarios" value={tenant.usuarios} max={tenant.maxUsuarios}/>
                <PB label="Storage (GB)" value={tenant.storage} max={tenant.maxStorage} color={C.ok}/>
                <PB label="API calls (mes)" value={12400} max={50000} color={C.purp}/>
                <PB label="Emails enviados (mes)" value={340} max={1000} color={C.warn}/>
              </Cd>
              <Cd title="Uso mensual">
                <MiniBar data={[8200,9100,10500,11200,11800,12000,12200,12400]} color={C.pri} height={50}/>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                  <span style={{ fontSize:10, color:C.muted }}>Sep</span><span style={{ fontSize:10, color:C.muted }}>Abr</span>
                </div>
                <div style={{ marginTop:12 }}>
                  {[["Promedio diario","413 API calls"],["Pico máximo","890 calls (15/03)"],["Tendencia","↑ +8% vs mes anterior"]].map(([k,v],i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:12 }}>
                      <span style={{ color:C.muted }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </Cd>
            </div>
            <Alert type="info">Este tenant usa el 80% de su cuota de usuarios. Considera sugerir upgrade a Enterprise.</Alert>
          </div>
        )}

        {/* Tab 3: Facturación */}
        {tab===3&&(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:m?"1fr 1fr":"repeat(3,1fr)", gap:10, marginBottom:16 }}>
              <div style={{ textAlign:"center", padding:12, background:C.inBg, borderRadius:8 }}>
                <div style={{ fontSize:11, color:C.muted }}>MRR actual</div>
                <div style={{ fontSize:20, fontWeight:700, color:C.ok }}>{tenant.mrr}</div>
              </div>
              <div style={{ textAlign:"center", padding:12, background:C.inBg, borderRadius:8 }}>
                <div style={{ fontSize:11, color:C.muted }}>Total facturado</div>
                <div style={{ fontSize:20, fontWeight:700 }}>$2.175.000</div>
              </div>
              <div style={{ textAlign:"center", padding:12, background:C.inBg, borderRadius:8 }}>
                <div style={{ fontSize:11, color:C.muted }}>Método de pago</div>
                <div style={{ fontSize:14, fontWeight:600 }}>Tarjeta ****4521</div>
              </div>
            </div>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>Historial de pagos</div>
            <Tb headers={["Fecha","Monto","Estado","Método"]}
              rows={invoices.map(inv=>[
                inv.fecha,
                <span style={{ fontWeight:600 }}>{inv.monto}</span>,
                <Bd color={inv.estado==="Pagado"?C.ok:C.err}>{inv.estado}</Bd>,
                <span style={{ fontSize:11, color:C.muted }}>{inv.metodo}</span>,
              ])}
            />
          </div>
        )}

        {/* Tab 4: Auditoría */}
        {tab===4&&(
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:13, color:C.muted }}>Últimos 7 días · {tenant.slug}</span>
              <Bt variant="ghost" size="sm">Exportar CSV</Bt>
            </div>
            {auditLog.map((a,i)=>(
              <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:i<auditLog.length-1?"1px solid "+C.border:"none", alignItems:"flex-start" }}>
                <div style={{ fontSize:11, fontFamily:"monospace", color:C.muted, flexShrink:0, minWidth:75 }}>{a.date}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{a.action}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{a.detail}</div>
                </div>
                <span style={{ fontSize:11, color:C.pri, flexShrink:0 }}>{a.user}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Feature flags */}
        {tab===5&&(
          <div>
            <Alert type="info">Los feature flags activos se aplican solo a este tenant. Los cambios son inmediatos.</Alert>
            {flags.map((f,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:i<flags.length-1?"1px solid "+C.border:"none", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:600 }}>{f.name}</span>
                    <Bd color={f.enabled?C.ok:C.muted}>{f.enabled?"ON":"OFF"}</Bd>
                  </div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{f.desc}</div>
                </div>
                <div onClick={()=>{}} style={{ width:36, height:20, borderRadius:10, background:f.enabled?C.ok:C.border, cursor:"pointer", position:"relative", flexShrink:0 }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:f.enabled?18:2, transition:"left .15s", boxShadow:"0 1px 3px rgba(0,0,0,.2)" }}/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suspend modal */}
      <Modal show={showSuspend} onClose={()=>setShowSuspend(false)} title="Suspender tenant" width={440}>
        <Alert type="warn">Al suspender, todos los usuarios de este tenant perderán acceso inmediatamente. Los datos se conservan por 90 días.</Alert>
        <div style={{ background:C.inBg, borderRadius:8, padding:12, marginBottom:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ width:36, height:36, borderRadius:8, background:tenant.planColor+"20", color:tenant.planColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700 }}>A</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{tenant.empresa}</div>
              <div style={{ fontSize:11, color:C.muted }}>{tenant.slug} · {tenant.plan} · {tenant.usuarios} usuarios</div>
            </div>
          </div>
        </div>
        <Inp label="Motivo de suspensión *" placeholder="Ej: Falta de pago, violación de términos..."/>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Bt variant="ghost" onClick={()=>setShowSuspend(false)}>Cancelar</Bt>
          <Bt variant="danger">Suspender tenant</Bt>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVIGATION CONFIG
// ─────────────────────────────────────────────
const TENANT_SCREENS = {
  dashboard:          { label:"Dashboard",        icon:"📊", component: ShellScreen },
  "onboarding-inc":   { label:"Setup pendiente",  icon:"🔧", component: OnboardingIncompleteScreen },
  "company-profile":  { label:"Perfil empresa",   icon:"🏢", component: CompanyProfileScreen },
  users:              { label:"Usuarios",          icon:"👥", component: UsersScreen },
  "user-detail":      { label:"Detalle usuario",   icon:"👤", component: UserDetailScreen },
  roles:              { label:"Roles y Permisos",   icon:"🔑", component: RolesScreen },
  profile:            { label:"Mi Perfil",         icon:"👤", component: ProfileScreen },
  sessions:           { label:"Sesiones activas",  icon:"🔐", component: ActiveSessionsScreen },
  notifications:      { label:"Notificaciones",    icon:"🔔", component: NotificationsScreen },
  "notif-prefs":      { label:"Pref. notif.",      icon:"⚙️", component: NotifPrefsScreen },
  audit:              { label:"Auditoría",          icon:"📋", component: AuditScreen },
  "my-plan":          { label:"Mi Plan",            icon:"💎", component: MyPlanScreen },
  config:             { label:"Config",             icon:"⚙️", component: ConfigScreen },
  files:              { label:"Archivos",           icon:"📁", component: FilesScreen },
  habeas:             { label:"Privacidad / 1581",  icon:"🛡️", component: HabeasDataScreen },
  support:            { label:"Soporte",            icon:"💬", component: SupportScreen },
};

const ADMIN_SCREENS = {
  "admin-overview":    { label:"Overview",         icon:"📈", component: AdminOverviewScreen },
  "admin-states":      { label:"Estados UX",       icon:"🎭", component: StatesGalleryScreen },
  "admin-tenants":     { label:"Tenants",          icon:"🏢", component: AdminTenantsScreen },
  "admin-tenant-detail":{ label:"Detalle tenant",  icon:"🏢", component: AdminTenantDetailScreen },
  "admin-approvals":   { label:"Aprobaciones",     icon:"✅", component: AdminApprovalScreen },
  "admin-billing":     { label:"Facturación",      icon:"💳", component: AdminBillingScreen },
  "admin-sysusers":    { label:"Admins sistema",   icon:"🔑", component: AdminSystemUsersScreen },
  "admin-plans":       { label:"Planes",           icon:"💰", component: AdminPlansScreen },
  "admin-flags":       { label:"Feature flags",    icon:"🚩", component: AdminFlagsScreen },
  "admin-emails":      { label:"Templates email",  icon:"✉️", component: AdminEmailTemplatesScreen },
  "admin-maintenance": { label:"Mantenimiento",    icon:"🔧", component: AdminMaintenanceScreen },
  "admin-webhooks":    { label:"Webhooks",         icon:"🔗", component: AdminWebhooksScreen },
  "admin-changelog":   { label:"Changelog",        icon:"📋", component: AdminChangelogScreen },
  "admin-analytics":   { label:"Analytics",        icon:"📊", component: AdminAnalyticsScreen },
  "admin-jobs":        { label:"Cola de Jobs",      icon:"⚙️", component: AdminJobsScreen },
  "admin-settings":    { label:"Config global",     icon:"🔧", component: AdminSettingsScreen },
  "admin-errors":      { label:"Observabilidad",   icon:"🐛", component: AdminErrorsScreen },
  "admin-impersonate": { label:"Impersonación",    icon:"👁", component: AdminImpersonateScreen },
  "admin-api":         { label:"API externa",      icon:"🔌", component: AdminAPIScreen },
};

const PUBLIC_SCREENS = {
  login:        { label:"Login",         component: LoginScreen },
  register:     { label:"Registro",      component: RegisterScreen },
  onboarding:   { label:"Onboarding",    component: OnboardingScreen },
  "pwd-reset":  { label:"Reset clave",   component: PasswordResetScreen },
  invite:       { label:"Invitación",    component: InvitationAcceptScreen },
  "not-found":  { label:"404 Subdominio",component: SubdomainNotFoundScreen },
  maintenance:  { label:"Mantenimiento", component: MaintenanceScreen },
  "status-page": { label:"Status Page",  component: StatusPageScreen },
  "verify-email":{ label:"Verificar email", component: VerifyEmailScreen },
  emails:       { label:"Emails",        component: EmailPreviewScreen },
  errors:       { label:"Errores",       component: ErrorPages },
};

const ADMIN_GROUPS = [
  { label:"Visión global",  keys:["admin-overview","admin-analytics","admin-states"] },
  { label:"Tenants",        keys:["admin-tenants","admin-approvals","admin-billing"] },
  { label:"Acceso",         keys:["admin-sysusers","admin-impersonate"] },
  { label:"Plataforma",     keys:["admin-plans","admin-flags","admin-webhooks","admin-api"] },
  { label:"Comunicación",   keys:["admin-emails","admin-maintenance","admin-changelog"] },
  { label:"Operaciones",    keys:["admin-errors","admin-jobs","admin-settings"] },
];

const TENANT_GROUPS = [
  { label:"Principal",      keys:["dashboard"] },
  { label:"Mi empresa",     keys:["company-profile","users","roles","profile","sessions"] },
  { label:"Comunicaciones", keys:["notifications","notif-prefs"] },
  { label:"Operación",      keys:["audit","files"] },
  { label:"Cuenta",         keys:["my-plan","config","habeas","support"] },
];

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const mob = useM();
  const [mode, setMode] = useState("admin");
  const [nav, setNav] = useState("admin-overview");
  const [sidebarOpen, setSO] = useState(false);
  const [pc, setPc] = useState(()=>localStorage.getItem("theme_pc")||C.pri);
  const [sc, setSc] = useState(()=>localStorage.getItem("theme_sc")||C.sidebar);
  useEffect(()=>{localStorage.setItem("theme_pc",pc);localStorage.setItem("theme_sc",sc);},[pc,sc]);

  const screens = mode==="tenant" ? TENANT_SCREENS : mode==="admin" ? ADMIN_SCREENS : PUBLIC_SCREENS;
  const cur = screens[nav];
  const SCR = cur ? cur.component : AdminOverviewScreen;
  const isP = mode==="public";
  const light = isLightColor(sc);
  const sideText = light ? "#1E293B" : "#fff";
  const sideMuted = light ? "#64748B" : "#94a3b8";
  const sideGroupLabel = light ? "#475569" : "#475569";
  const sideBorder = light ? "#e2e8f0" : C.sidebarHover;
  const sideHoverBg = light ? "#e2e8f0" : C.sidebarHover;

  function switchMode(m) {
    setMode(m);
    setNav(m==="tenant"?"dashboard":m==="admin"?"admin-overview":"login");
    setSO(false);
  }

  const groups = mode==="admin" ? ADMIN_GROUPS : TENANT_GROUPS;

  const modeBar = (
    <div style={{ background:sc, padding:"8px 12px", display:"flex", gap:6, alignItems:"center", flexShrink:0, flexWrap:"wrap" }}>
      {mob&&!isP&&<div onClick={()=>setSO(!sidebarOpen)} style={{ color:sideText, fontSize:18, cursor:"pointer", padding:"0 8px" }}>☰</div>}
      <span style={{ color:sideText, fontSize:11, fontWeight:600, marginRight:4 }}>VISTA:</span>
      {[["tenant","🏢 Tenant"],["admin","⚡ Admin"],["public","🌐 Público"]].map(it=>(
        <button key={it[0]} onClick={()=>switchMode(it[0])} style={{ padding:"3px 10px", borderRadius:4, fontSize:11, fontWeight:600, border:"none", cursor:"pointer", background:mode===it[0]?pc:"transparent", color:mode===it[0]?"#fff":sideMuted }}>{it[1]}</button>
      ))}
      {!mob&&<><span style={{ flex:1 }}/><span style={{ color:sideMuted, fontSize:10 }}>Wireframes Fase 0 · v3</span></>}
    </div>
  );

  const content = isP ? (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", minHeight:"100vh", background:C.bg }}>
      {modeBar}
      <div style={{ background:"#fff", borderBottom:"1px solid "+C.border, padding:"0 12px", display:"flex", overflowX:"auto" }}>
        {Object.entries(PUBLIC_SCREENS).map(([k,s])=>(
          <button key={k} onClick={()=>setNav(k)} style={{ padding:"10px 14px", fontSize:12, fontWeight:nav===k?700:400, color:nav===k?C.pri:C.muted, borderBottom:"2px solid "+(nav===k?C.pri:"transparent"), background:"none", border:"none", borderBottomWidth:2, borderBottomStyle:"solid", cursor:"pointer", whiteSpace:"nowrap" }}>{s.label}</button>
        ))}
      </div>
      <div style={{ maxWidth:800, margin:"0 auto" }}><SCR nav={nav} setNav={setNav}/></div>
    </div>
  ) : (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>
      {modeBar}
      <div style={{ display:"flex", flex:1, overflow:"hidden", position:"relative" }}>
        {mob&&sidebarOpen&&<div onClick={()=>setSO(false)} style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,.4)", zIndex:10 }}/>}
        <div style={{ width:220, background:sc, display:"flex", flexDirection:"column", flexShrink:0, overflow:"auto", position:mob?"absolute":"relative", top:0, bottom:0, left:mob?(sidebarOpen?0:-240):0, zIndex:11, transition:"left .25s" }}>
          <div style={{ padding:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:6, background:mode==="admin"?"#7f1d1d":pc+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{mode==="admin"?"⚡":"🏢"}</div>
              <div style={{ color:sideText, fontSize:12, fontWeight:600 }}>{mode==="admin"?"Admin Panel":"Mi Empresa"}</div>
            </div>
          </div>
          <div style={{ flex:1, padding:"0 8px", overflow:"auto" }}>
            {(mode==="admin"||mode==="tenant") ? groups.map(g=>(
              <div key={g.label} style={{ marginBottom:8 }}>
                <div style={{ fontSize:9, fontWeight:700, color:sideGroupLabel, textTransform:"uppercase", padding:"6px 12px 2px" }}>{g.label}</div>
                {g.keys.map(k=>{
                  const s = screens[k]; if(!s) return null;
                  return <button key={k} onClick={()=>{setNav(k);setSO(false);}} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"7px 12px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, textAlign:"left", background:nav===k?pc:"transparent", color:nav===k?"#fff":sideMuted, marginBottom:1, fontWeight:nav===k?600:400 }}><span style={{ fontSize:13 }}>{s.icon}</span>{s.label}</button>;
                })}
              </div>
            )) : Object.entries(screens).map(([k,s])=>(
              <button key={k} onClick={()=>{setNav(k);setSO(false);}} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 12px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, textAlign:"left", background:nav===k?pc:"transparent", color:nav===k?"#fff":sideMuted, marginBottom:2, fontWeight:nav===k?600:400 }}><span>{s.icon}</span>{s.label}</button>
            ))}
          </div>
          <div style={{ padding:12, borderTop:"1px solid "+sideBorder }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:sideHoverBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:sideMuted }}>CE</div>
              <div style={{ color:sideMuted, fontSize:11 }}>{mode==="admin"?"Cesar E. · Super Admin":"Cesar E. · Admin"}</div>
            </div>
          </div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:mob?"10px 12px":"12px 24px", background:"#fff", borderBottom:"1px solid "+C.border, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div style={{ fontSize:13, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {!mob&&(mode==="admin"?"⚡ Admin":"mi-empresa")+" / "}
              <span style={{ color:C.text, fontWeight:500 }}>{cur?cur.label:""}</span>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {mode==="admin"&&<div style={{ background:C.err+"20", color:C.err, padding:"2px 8px", borderRadius:9999, fontSize:11, fontWeight:600 }}>ADMIN</div>}
              <div style={{ position:"relative", cursor:"pointer", padding:4, flexShrink:0 }}>
                <span style={{ fontSize:18 }}>🔔</span>
                <span style={{ position:"absolute", top:0, right:0, width:14, height:14, borderRadius:"50%", background:C.err, color:"#fff", fontSize:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>3</span>
              </div>
            </div>
          </div>
          <div style={{ flex:1, overflow:"auto", padding:mob?12:24, background:C.bg }}>
            <SCR nav={nav} setNav={setNav}/>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ThemeCtx.Provider value={{ pc, sc, setPc, setSc }}>
      {content}
    </ThemeCtx.Provider>
  );
}
