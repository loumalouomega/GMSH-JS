// Generic runtime marshaller for the Gmsh C API. Given a loaded Emscripten
// `Module` and the generated descriptor table, builds the nested, typed JS API.
// This is the single place where pointer/heap marshalling lives; the generator
// emits only data, never marshalling code.
//
// wasm32 layout: pointers and size_t are 4 bytes; double is 8 bytes.

const PTR = 4;

export function buildApi(Module, descriptor) {
  const { _malloc, _free } = Module;
  // Under pthreads, Emscripten refreshes Module.HEAP* lazily per thread: a
  // worker growing memory mid-call would leave this thread's views at the old
  // (shorter) length. Re-derive views whenever the backing buffer changes.
  let buf = null, HEAPU32, HEAP32, HEAPF64;
  const refresh = () => {
    buf = Module.wasmMemory.buffer;
    HEAPU32 = new Uint32Array(buf);
    HEAP32 = new Int32Array(buf);
    HEAPF64 = new Float64Array(buf);
  };
  const u32 = () => (Module.wasmMemory.buffer !== buf && refresh(), HEAPU32);
  const i32 = () => (Module.wasmMemory.buffer !== buf && refresh(), HEAP32);
  const f64 = () => (Module.wasmMemory.buffer !== buf && refresh(), HEAPF64);

  const gmshFree = (p) => { if (p) Module._gmshFree(p); };

  // --- input writers: return the C arguments + register temp frees ----------
  function writeIntArray(values) {
    const n = values.length;
    const p = _malloc(Math.max(n, 1) * 4);
    for (let i = 0; i < n; i++) i32()[(p >> 2) + i] = values[i] | 0;
    return p;
  }
  function writeSizeArray(values) {
    const n = values.length;
    const p = _malloc(Math.max(n, 1) * 4);
    for (let i = 0; i < n; i++) u32()[(p >> 2) + i] = values[i] >>> 0;
    return p;
  }
  function writeDoubleArray(values) {
    const n = values.length;
    const p = _malloc(Math.max(n, 1) * 8);
    for (let i = 0; i < n; i++) f64()[(p >> 3) + i] = +values[i];
    return p;
  }
  function writeCString(s) {
    const len = Module.lengthBytesUTF8(s) + 1;
    const p = _malloc(len);
    Module.stringToUTF8(s, p, len);
    return p;
  }

  // --- output readers --------------------------------------------------------
  function readIntArray(p, n) {
    const out = new Array(n);
    for (let i = 0; i < n; i++) out[i] = i32()[(p >> 2) + i];
    return out;
  }
  function readSizeArray(p, n) {
    const out = new Array(n);
    for (let i = 0; i < n; i++) out[i] = u32()[(p >> 2) + i];
    return out;
  }
  function readDoubleArray(p, n) {
    const out = new Array(n);
    for (let i = 0; i < n; i++) out[i] = f64()[(p >> 3) + i];
    return out;
  }

  function lastError(cname, code) {
    let msg = `${cname} failed (ierr=${code})`;
    if (Module._gmshLoggerGetLastError) {
      const slot = _malloc(PTR);
      const ie = _malloc(4);
      i32()[ie >> 2] = 0;
      try {
        Module._gmshLoggerGetLastError(slot, ie);
        const sp = u32()[slot >> 2];
        if (sp) { msg = `${cname}: ${Module.UTF8ToString(sp)}`; gmshFree(sp); }
      } catch (_) { /* logger not available */ }
      _free(slot); _free(ie);
    }
    return new Error(msg);
  }

  function makeCall(fn) {
    const fptr = Module["_" + fn.c];
    const hasRet = fn.ret !== null && fn.ret !== undefined;
    return function (...jsArgs) {
      if (!fptr) throw new Error(`gmsh: ${fn.c} is not exported in this build`);
      const cargs = [];
      const frees = [];        // heap blocks to _free after the call
      const outputs = [];      // {name, kind, ptrSlots:[...]}
      let ai = 0;              // index into jsArgs (input params only)

      for (const a of fn.args) {
        if (a.output) {
          const slots = [];
          // every output kind needs a primary pointer slot; vectors need a
          // length slot; vectorvectors need an extra outer-count slot.
          const nslots = a.kind.startsWith("ovectorvector") ? 3
            : a.kind.startsWith("ovector") ? 2 : 1;
          for (let s = 0; s < nslots; s++) {
            const slot = _malloc(a.kind === "odouble" && s === 0 ? 8 : PTR);
            (a.kind === "odouble" && s === 0 ? f64() : u32())
              [(slot >> (a.kind === "odouble" && s === 0 ? 3 : 2))] = 0;
            slots.push(slot);
            cargs.push(slot);
          }
          outputs.push({ name: a.name, kind: a.kind, slots });
          continue;
        }
        // input
        if (a.kind === "iargcargv") { cargs.push(0, 0); continue; }
        let v = jsArgs[ai++];
        if (v === undefined) {
          v = a.default !== null && a.default !== undefined
            ? JSON.parse(jsonish(a.default)) : undefined;
        }
        switch (a.kind) {
          case "ibool": cargs.push(v ? 1 : 0); break;
          case "iint": cargs.push(v | 0); break;
          case "isize": cargs.push(v >>> 0); break;
          case "idouble": cargs.push(+v); break;
          case "ivoidstar": cargs.push(v | 0); break;
          case "istring": { const p = writeCString(v == null ? "" : String(v)); frees.push(p); cargs.push(p); break; }
          case "ivectorint": { const p = writeIntArray(v || []); frees.push(p); cargs.push(p, (v || []).length); break; }
          case "ivectorsize": { const p = writeSizeArray(v || []); frees.push(p); cargs.push(p, (v || []).length); break; }
          case "ivectorpair": { const p = writeIntArray(v || []); frees.push(p); cargs.push(p, (v || []).length); break; }
          case "ivectordouble": { const p = writeDoubleArray(v || []); frees.push(p); cargs.push(p, (v || []).length); break; }
          case "ivectorstring": {
            const arr = v || [];
            const pp = _malloc(Math.max(arr.length, 1) * PTR);
            for (let i = 0; i < arr.length; i++) {
              const sp = writeCString(String(arr[i])); frees.push(sp);
              u32()[(pp >> 2) + i] = sp;
            }
            frees.push(pp); cargs.push(pp, arr.length); break;
          }
          case "ivectorvectorint":
          case "ivectorvectorsize":
          case "ivectorvectordouble": {
            const outer = v || [];
            const isD = a.kind === "ivectorvectordouble";
            const pp = _malloc(Math.max(outer.length, 1) * PTR);   // int**/double**
            const pn = _malloc(Math.max(outer.length, 1) * 4);     // size_t* lengths
            for (let i = 0; i < outer.length; i++) {
              const inner = outer[i] || [];
              const ip = isD ? writeDoubleArray(inner) : writeIntArray(inner);
              frees.push(ip);
              u32()[(pp >> 2) + i] = ip;
              u32()[(pn >> 2) + i] = inner.length >>> 0;
            }
            frees.push(pp, pn);
            cargs.push(pp, pn, outer.length); break;
          }
          default: throw new Error(`gmsh: unsupported arg kind ${a.kind} in ${fn.c}`);
        }
      }

      const ierr = _malloc(4);
      i32()[ierr >> 2] = 0;
      cargs.push(ierr);

      let ret;
      try {
        ret = fptr(...cargs);
        const code = i32()[ierr >> 2];
        if (code !== 0) throw lastError(fn.c, code);

        if (outputs.length === 0) {
          return hasRet ? ret : undefined;
        }
        const result = {};
        if (hasRet) result.value = ret;
        for (const o of outputs) result[o.name] = readOutput(o);
        return result;
      } finally {
        for (const p of frees) _free(p);
        for (const o of outputs) for (const s of o.slots) _free(s);
        _free(ierr);
      }
    };

    function readOutput(o) {
      const [s0, s1, s2] = o.slots;
      switch (o.kind) {
        case "oint": return i32()[s0 >> 2];
        case "osize": return u32()[s0 >> 2];
        case "odouble": return f64()[s0 >> 3];
        case "ostring": {
          const sp = u32()[s0 >> 2];
          const str = sp ? Module.UTF8ToString(sp) : "";
          gmshFree(sp); return str;
        }
        case "ovectorint": { const p = u32()[s0 >> 2], n = u32()[s1 >> 2]; const r = readIntArray(p, n); gmshFree(p); return r; }
        case "ovectorpair": { const p = u32()[s0 >> 2], n = u32()[s1 >> 2]; const r = readIntArray(p, n); gmshFree(p); return r; }
        case "ovectorsize": { const p = u32()[s0 >> 2], n = u32()[s1 >> 2]; const r = readSizeArray(p, n); gmshFree(p); return r; }
        case "ovectordouble": { const p = u32()[s0 >> 2], n = u32()[s1 >> 2]; const r = readDoubleArray(p, n); gmshFree(p); return r; }
        case "ovectorstring": {
          const p = u32()[s0 >> 2], n = u32()[s1 >> 2]; const r = new Array(n);
          for (let i = 0; i < n; i++) { const sp = u32()[(p >> 2) + i]; r[i] = sp ? Module.UTF8ToString(sp) : ""; gmshFree(sp); }
          gmshFree(p); return r;
        }
        case "ovectorvectorint":
        case "ovectorvectorsize":
        case "ovectorvectordouble":
        case "ovectorvectorpair": {
          const outerP = u32()[s0 >> 2], sizesP = u32()[s1 >> 2], nn = u32()[s2 >> 2];
          const isD = o.kind === "ovectorvectordouble";
          const isU = o.kind === "ovectorvectorsize";
          const r = new Array(nn);
          for (let i = 0; i < nn; i++) {
            const innerP = u32()[(outerP >> 2) + i];
            const len = u32()[(sizesP >> 2) + i];
            r[i] = isD ? readDoubleArray(innerP, len) : isU ? readSizeArray(innerP, len) : readIntArray(innerP, len);
            gmshFree(innerP);
          }
          gmshFree(outerP); gmshFree(sizesP); return r;
        }
        default: throw new Error(`gmsh: unsupported output kind ${o.kind}`);
      }
    }
  }

  // Build the nested object tree from descriptor paths.
  const root = {};
  for (const fn of descriptor.functions) {
    if (fn.unsupported) continue;
    let node = root;
    for (const p of fn.path) node = (node[p] ||= {});
    node[fn.js] = makeCall(fn);
  }
  return root;
}

// The generator stores defaults as JS-literal source (e.g. "-1", "true", "[]",
// '"info"'); normalise the few non-JSON forms so JSON.parse can read them.
function jsonish(src) {
  if (src === "true" || src === "false") return src;
  return src; // numbers, quoted strings, and [] are already valid JSON
}
