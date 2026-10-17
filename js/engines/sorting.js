// --- Sorting & Searching Step Engine ---
function run(name,arr){
  const n=arr.length,a=arr.slice(),d=arr.map((_,i)=>i),S=[],ok=Array(n).fill(false),lv=Array(n).fill(0);let cmp=0,mv=0,mp=null;
  const yn=r=>r?T("yes"):T("no");
  const sw=(i,j)=>{[a[i],a[j]]=[a[j],a[i]];[d[i],d[j]]=[d[j],d[i]]};
  const P=(l,o={})=>{const p=Array(n);if(mp)mp.forEach((x,i)=>p[i]=x);else d.forEach((id,i)=>p[id]=i);
    if(o.kid!==undefined)p[o.kid]=o.kat;
    const v=Array(n).fill(null);for(let id=0;id<n;id++)if(lv[id]===0)v[p[id]]=arr[id];
    S.push({l,p,v,y:lv.slice(),s:ok.slice(),c:o.c||[],w:o.w||[],h:o.h??-1,r:o.r||null,k:o.kid!==undefined?arr[o.kid]:null,t:o.t||null,pt:o.pt||null,m:o.m||"",x:o.x||[],cmp,mv})};
  if(name==="linear"||name==="binary"){const g=TG;
    if(name==="linear"){
      for(let i=0;i<n;i++){const e=a[i]===g;cmp++;P(0,{c:[i],pt:{i},t:"cmp",m:`i = ${i}`});
        P(1,{c:[i],pt:{i},t:"cmp",m:`a[${i}] == ${g}  →  ${a[i]} == ${g} ? ${yn(e)}`,x:[W(e?"eq":"ne")]});
        if(e){ok[i]=true;P(2,{pt:{i},t:"found",m:W("fnd",g,i)});return S}}
      P(3,{t:"nf",m:W("nf",g)});return S}
    let lo=0,hi=n-1;P(0,{r:[0,n-1],pt:{lo,hi},t:"split",m:`lo = ${lo}, hi = ${hi}`,x:[W("sorted")]});
    while(lo<=hi){const mid=(lo+hi)>>1;P(1,{r:[lo,hi],pt:{lo,hi},t:"split",m:`lo = ${lo} ≤ hi = ${hi}`});
      P(2,{r:[lo,hi],h:mid,pt:{lo,mid,hi},t:"mid",m:`mid = (${lo} + ${hi}) / 2 = ${mid}`,x:[`a[mid] → a[${mid}] = ${a[mid]}`]});cmp++;
      if(a[mid]===g){ok[mid]=true;P(3,{r:[lo,hi],pt:{lo,mid,hi},t:"found",m:W("fnd",g,mid)});return S}
      const lt=a[mid]<g;P(3,{r:[lo,hi],h:mid,c:[mid],pt:{lo,mid,hi},t:"cmp",m:`a[${mid}] == ${g} ? ${yn(false)}  (${a[mid]} ${lt?"<":">"} ${g})`,x:[W(lt?"goR":"goL")]});
      if(lt){lo=mid+1;P(4,{r:[lo,hi],pt:{lo,hi},t:"split",m:`lo = mid + 1 = ${lo}`})}else{hi=mid-1;P(5,{r:[lo,hi],pt:{lo,hi},t:"split",m:`hi = mid - 1 = ${hi}`})}}
    P(6,{t:"nf",m:W("nf",g)});return S}
  if(name==="bubble"){
    for(let i=0;i<n-1;i++){P(0,{t:"pass",m:`i = ${i}`,x:[W("passx")]});
      for(let j=0;j<n-i-1;j++){P(1,{c:[j,j+1],t:"cmp",m:`j = ${j}`,x:[`a[j]   → a[${j}] = ${a[j]}`,`a[j+1] → a[${j+1}] = ${a[j+1]}`]});cmp++;
        const r=a[j]>a[j+1];P(2,{c:[j,j+1],t:"cmp",m:`a[${j}] > a[${j+1}]  →  ${a[j]} > ${a[j+1]} ? ${yn(r)}`,x:[W(r?"bY":"bN")]});
        if(r){const x=a[j],y=a[j+1];sw(j,j+1);mv++;P(3,{w:[j,j+1],t:"swap",m:`a[${j}] ↔ a[${j+1}]`,x:[`a[${j}] : ${x} → ${y}`,`a[${j+1}] : ${y} → ${x}`]});}}
      ok[n-i-1]=true;P(4,{t:"place",m:W("placeIt",a[n-i-1],n-i-1)});}
  }else if(name==="selection"){
    for(let i=0;i<n-1;i++){P(0,{t:"pass",m:`i = ${i}`});let mn=i;P(1,{h:mn,t:"min",m:W("minStart",i),x:[`min = ${mn} → a[${mn}] = ${a[mn]}`]});
      for(let j=i+1;j<n;j++){cmp++;const r=a[j]<a[mn];P(2,{c:[j],h:mn,t:"cmp",m:`j = ${j}`,x:[`a[j]   → a[${j}] = ${a[j]}`,`a[min] → a[${mn}] = ${a[mn]}`]});
        P(3,{c:[j,mn],h:mn,t:"cmp",m:`a[${j}] < a[${mn}]  →  ${a[j]} < ${a[mn]} ? ${yn(r)}`,x:[W(r?"sY":"sN")]});
        if(r){mn=j;P(3,{h:mn,t:"min",m:`min = ${mn}`,x:[`a[${mn}] = ${a[mn]}`]});}}
      const x=a[i],y=a[mn];if(mn!==i){sw(i,mn);mv++;}
      ok[i]=true;P(4,{w:[i,mn],t:"swap",m:`a[${i}] ↔ a[${mn}]`,x:mn!==i?[`a[${i}] : ${x} → ${y}`,`a[${mn}] : ${y} → ${x}`]:[W("self")]});}
  }else if(name==="insertion"){
    ok[0]=true;
    for(let i=1;i<n;i++){const key=a[i],kid=d[i];lv[kid]=-1;const K=(h,x)=>({h,kid,kat:h,...x});
      P(0,K(i,{t:"key",m:`i = ${i}`}));P(1,K(i,{t:"key",m:`key = a[${i}] = ${key}`,x:[W("keyPick")]}));let j=i-1;P(2,K(i,{t:"key",m:`j = ${j}`}));
      while(j>=0){cmp++;const r=a[j]>key;P(3,K(j+1,{c:[j],t:"cmp",m:`a[${j}] > key  →  ${a[j]} > ${key} ? ${yn(r)}`,x:[W(r?"iY":"iN")]}));
        if(r){a[j+1]=a[j];d[j+1]=d[j];mv++;P(4,K(j,{w:[j+1],t:"shift",m:`a[${j+1}] = a[${j}]`,x:[`a[${j+1}] ← ${a[j+1]}  (a[${j}] is now empty)`]}));j--;}else break;}
      a[j+1]=key;d[j+1]=kid;lv[kid]=0;mv++;for(let t=0;t<=i;t++)ok[t]=true;P(5,{w:[j+1],t:"place",m:`a[${j+1}] = key = ${key}`});}
  }else{
    const rec=(l,r)=>{P(0,{r:[l,r],t:"split",m:`mergeSort(${l}, ${r})`,x:[`range a[${l}..${r}]`]});
      if(l>=r){P(1,{r:[l,r],t:"split",m:`l = ${l}, r = ${r}`,x:[W("base")]});return;}
      const m=(l+r)>>1;P(2,{r:[l,r],t:"split",m:`m = (${l} + ${r}) / 2 = ${m}`});
      P(3,{r:[l,r],t:"split",m:W("halves",l,m,r)});rec(l,m);rec(m+1,r);
      mp=Array(n);d.forEach((id,i)=>mp[id]=i);const t=d.slice(l,r+1);t.forEach(id=>lv[id]=1);
      P(4,{r:[l,r],t:"merge",m:W("tmp",l,m,r),x:[`temp = [${t.map(id=>arr[id]).join(", ")}]`]});
      let i=l,j=m+1,k=l;
      const put=(id,ti,x)=>{d[k]=id;mp[id]=k;lv[id]=0;mv++;P(6,{r:[l,r],w:[k],t:"write",m:`a[${k}] = ${arr[id]}`,x:[`← temp[${ti}]`,...x]});k++};
      while(i<=m&&j<=r){cmp++;const A=t[i-l],B=t[j-l],c=arr[A]<=arr[B];P(5,{r:[l,r],c:[i,j],t:"cmp",m:`temp[${i-l}] ≤ temp[${j-l}]  →  ${arr[A]} ≤ ${arr[B]} ? ${yn(c)}`,x:[W(c?"mL":"mR")]});
        if(c){put(A,i-l,[]);i++}else{put(B,j-l,[]);j++}}
      while(i<=m){put(t[i-l],i-l,[W("rest")]);i++}
      while(j<=r){put(t[j-l],j-l,[W("rest")]);j++}
      mp=null;};
    rec(0,n-1);
  }
  ok.fill(true);P(-1,{t:"done",m:W("done")});
  return S;
}
