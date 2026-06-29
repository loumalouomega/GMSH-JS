// Minimal manual marshalling helpers for the raw Gmsh C API, used by the M1/M2
// smoke tests *before* the generated TS wrapper (M3) exists. wasm32: pointers
// and size_t are 4 bytes.

export function makeHelpers(Module) {
  const I32 = 'i32';

  const malloc = (n) => Module._malloc(n);
  const free = (p) => Module._free(p);

  // Allocate an int32 out-param (e.g. ierr), init to 0.
  function outInt() {
    const p = malloc(4);
    Module.setValue(p, 0, I32);
    return p;
  }
  const readInt = (p) => Module.getValue(p, I32);

  // JS string -> NUL-terminated UTF8 in the heap.
  function cstr(s) {
    const n = Module.lengthBytesUTF8(s) + 1;
    const p = malloc(n);
    Module.stringToUTF8(s, p, n);
    return p;
  }

  // JS number[] -> int32 array in the heap.
  function intArray(arr) {
    const p = malloc(arr.length * 4);
    for (let i = 0; i < arr.length; i++) Module.setValue(p + i * 4, arr[i], I32);
    return p;
  }

  // Call fn, throw if ierr != 0. Allocates+frees the ierr slot.
  function checked(name, fn) {
    const ierr = outInt();
    try {
      const r = fn(ierr);
      const code = readInt(ierr);
      if (code !== 0) throw new Error(`${name} failed (ierr=${code})`);
      return r;
    } finally {
      free(ierr);
    }
  }

  return { malloc, free, outInt, readInt, cstr, intArray, checked };
}
