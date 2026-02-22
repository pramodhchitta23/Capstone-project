export default function Topbar() {
  return (
    <div style={{
      height: 70,
      padding: "0 30px",
      background: "rgba(10,15,30,0.9)",
      borderBottom: "1px solid rgba(0,255,195,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <h3 className="neon-title">
        Security Operations Center
      </h3>
      <span style={{
        color: "#00ffc3",
        textShadow: "0 0 10px #00ffc3"
      }}>
        ● ONLINE
      </span>
    </div>
  );
}