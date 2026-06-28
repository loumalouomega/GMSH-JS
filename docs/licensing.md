# Licensing

!!! danger "This package is GPL-2.0-or-later"
    Gmsh is distributed under the **GNU General Public License, version 2 or
    later**. Because `gmsh-wasm` **statically links** Gmsh (and OpenCASCADE) into
    the `.wasm`, the resulting artifact and this package are likewise governed by
    the **GPL-2.0-or-later**. Any software that distributes this package inherits
    those obligations.

## What this means

- If you distribute software that includes this package (or the `.wasm` it
  produces), that distribution is subject to the GPL — including the requirement
  to make corresponding source available under the same terms.
- Using it privately (e.g. server-side, not distributed) does not trigger
  distribution obligations, but consult the licence and, if needed, a lawyer.

## Commercial license

A separate **commercial license** for Gmsh is available from its authors, which
can remove the GPL obligations for the Gmsh portion. See
<https://gmsh.info>.

## Components

| Component | License |
|-----------|---------|
| Gmsh — C. Geuzaine & J.-F. Remacle, <https://gmsh.info> | GPL-2.0-or-later (with a linking exception for Netgen, METIS, OpenCASCADE, ParaView) |
| OpenCASCADE Technology — <https://dev.opencascade.org> | LGPL-2.1 with an additional exception |
| This packaging | GPL-2.0-or-later |

## Attribution

This is an **independent packaging effort** and is not affiliated with or
endorsed by the Gmsh or OpenCASCADE authors. See the repository `LICENSE` file
and the bundled `gmsh/LICENSE.txt` for the full texts.
