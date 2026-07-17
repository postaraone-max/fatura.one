// app/analytics/page.tsx
// Dynamic analytics page. Zero deps. SVG bar chart. Graceful 501/empty handling.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import React from "react";
type DataPoint = { label: string; value: number };

async function loadData(): Promise<DataPoint[]> {
  try {
    const res = await fetch("/api/postara/analytics/summary", { method: "GET", headers: { "Cache-Control": "no-cache" }});
    if (res.status === 501) return [];
    if (!res.ok) return [];
    const json = await res.json();
    if (Array.isArray(json?.items)) {
      return json.items.map((x:any)=>({label:String(x.label??x.name??""),value:Number(x.value??x.count??0)}))
        .filter((x:DataPoint)=>x.label && Number.isFinite(x.value));
    }
    if (json && typeof json==="object" && !Array.isArray(json)) {
      return Object.entries((json as any).byDay ?? json)
        .map(([k,v])=>({label:String(k),value:Number((v as any)?.value ?? v)}))
        .filter(x=>x.label && Number.isFinite(x.value));
    }
    if (Array.isArray(json)) {
      return json.map((v:any,i:number)=>({label:String(i+1),value:Number(v?.value??v)}))
        .filter((x:DataPoint)=>Number.isFinite(x.value));
    }
    return [];
  } catch { return []; }
}

function BarChart({ data }: { data: DataPoint[] }) {
  if (!data.length) return <div style={{padding:16}}><h1 style={{fontSize:20,marginBottom:8}}>Analytics</h1><p>No data available.</p></div>;
  const values = data.map(d=>d.value); const max = Math.max(...values,1);
  const width=800,height=320,padding=40,innerW=width-padding*2,innerH=height-padding*2,gap=8;
  const barW = Math.max(4, Math.floor((innerW - gap*(data.length-1))/data.length));
  return (
    <div style={{padding:16}}>
      <h1 style={{fontSize:20,marginBottom:8}}>Analytics</h1>
      <svg width={width} height={height} role="img" aria-label="Bar chart">
        <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="currentColor" />
        <line x1={padding} y1={padding} x2={padding} y2={height-padding} stroke="currentColor" />
        {data.map((d,i)=>{ const x=padding+i*(barW+gap); const h=Math.round((d.value/max)*innerH); const y=height-padding-h;
          return (<g key={i} transform={`translate(${x},0)`}>
              <rect x={0} y={y} width={barW} height={h} />
              <text x={barW/2} y={y-4} textAnchor="middle" fontSize="10">{d.value}</text>
              <text x={barW/2} y={height-padding+12} textAnchor="middle" fontSize="10">{d.label}</text>
            </g>);
        })}
        <text x={padding-6} y={padding} textAnchor="end" fontSize="10">{max}</text>
        <text x={padding-6} y={height-padding} textAnchor="end" fontSize="10">0</text>
      </svg>
    </div>
  );
}

export default async function AnalyticsPage() {
  const data = await loadData();
  return <BarChart data={data} />;
}
