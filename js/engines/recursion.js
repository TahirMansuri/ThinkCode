// --- Recursion Step Engine ---
// Each step: {stack:[frames], active, ret, line, msg, tag, var:{...}}
// A frame: {n, label, state:"wait"|"active"|"return"}
function rgen(name,arg){
  const S=[];
  // snapshot helper: freeze the frame list at this moment
  const snap=(frames,active,phase,line,msg,tag)=>S.push({
    stack:frames.map(f=>({...f})),
    active, phase, line, msg, tag
  });

  if(name==="factorial"){
    const F=[];   // call stack of frames
    // A frame: {n, state:"wait"|"compute"|"ret", waiting:null|"factorial(k)", sub:null, pending:null|"n × ?", result:null}
    const rec=(n)=>{
      // entering the function
      F.push({n,state:"wait",waiting:null,sub:null,pending:null,result:null});
      snap(F,F.length-1,"down",0,`entered factorial(${n})`,"call");

      // base check
      snap(F,F.length-1,"down",1,`is n = ${n} ≤ 1 ?`,"check");
      if(n<=1){
        F[F.length-1].state="ret";
        F[F.length-1].result=1;
        snap(F,F.length-1,"up",2,`yes — base case, return 1`,"base");
        return 1;
      }

      // before recursing, remember what we're waiting for
      F[F.length-1].waiting=`factorial(${n-1})`;
      snap(F,F.length-1,"down",3,`n = ${n} > 1 → call factorial(${n-1}) and wait`,"call");

      const sub=rec(n-1);

      // the child has returned — now compute
      F[F.length-1].waiting=null;
      F[F.length-1].sub=sub;
      F[F.length-1].pending=`${n} × ${sub}`;
      F[F.length-1].state="compute";
      snap(F,F.length-1,"up",4,`back in factorial(${n}): ${n} × ${sub} = ${n*sub}`,"compute");

      const v=n*sub;
      F[F.length-1].result=v;
      F[F.length-1].state="ret";
      F[F.length-1].pending=null;
      snap(F,F.length-1,"up",5,`factorial(${n}) returns ${v}`,"ret");
      return v;
    };
    const final=rec(arg);
    snap([],-1,"up",-1,`✔ factorial(${arg}) = ${final}  — the whole stack has unwound`,"done");
    return S;
  }
  return [];
}
