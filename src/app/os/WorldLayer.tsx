export function WorldLayer() {
  return (
    <div className="os-sky" aria-hidden="true">
      <img className="os-sky-img is-night" src="/world/sky-night.jpg" alt="" />
      <img className="os-sky-img is-day" src="/world/sky-day.jpg" alt="" />
      <div className="os-stars" />
      <img className="os-cloud c1" src="/world/cloud-a.png" alt="" />
      <img className="os-cloud c2" src="/world/cloud-b.png" alt="" />
      <img className="os-cloud c3" src="/world/cloud-a.png" alt="" />
    </div>
  );
}
