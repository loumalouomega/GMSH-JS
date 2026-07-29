# API reference

!!! note
    This page is generated from the Gmsh API definition (version **5.0.0**) by `scripts/gen_docs_api.py` and is regenerated in CI. Every function hides the C `ierr` out-parameter and all manual memory management; see [Marshalling](marshalling.md) for how arguments and return values are converted.

**342 functions** across 14 modules. GUI/visualization functions (`fltk`, `graphics`, `view`) are intentionally excluded.

Conventions:

- Optional parameters (those with a default) are marked `?` and may be omitted.
- Functions with output parameters return an **object** keyed by the output names;
  a function with a single scalar return (e.g. an entity tag) returns that value directly.

## `gmsh (top level)`

### `clear`

```ts
gmsh.clear(): void
```

Clear all loaded models and post-processing data, and add a new empty model.

<small>Gmsh C symbol: `gmshClear`</small>

### `finalize`

```ts
gmsh.finalize(): void
```

Finalize the Gmsh API. This must be called when you are done using the Gmsh API.

<small>Gmsh C symbol: `gmshFinalize`</small>

### `initialize`

```ts
gmsh.initialize(readConfigFiles?: boolean, run?: boolean): void
```

Initialize the Gmsh API. This must be called before any call to the other functions in the API. If `argc' and `argv' (or just `argv' in Python or Julia) are provided, they will be handled in the same way as the command line arguments in the Gmsh app. If `readConfigFiles' is set, read system Gmsh configuration files (gmshrc and gmsh-options). If `run' is set, run in the same way as the Gmsh app, either interactively or in batch mode depending on the command line arguments. If `run' is not set, initializing the API sets the options "General.AbortOnError" to 2 and "General.Terminal" to 1.

| Parameter | Type | Default |
|-----------|------|---------|
| `readConfigFiles` | `boolean` | `true` |
| `run` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshInitialize`</small>

### `isInitialized`

```ts
gmsh.isInitialized(): number
```

Return 1 if the Gmsh API is initialized, and 0 if not.

<small>Gmsh C symbol: `gmshIsInitialized`</small>

### `merge`

```ts
gmsh.merge(fileName: string): void
```

Merge a file. Equivalent to the `File->Merge' menu in the Gmsh app. Handling of the file depends on its extension and/or its contents. Merging a file with model data will add the data to the current model.

| Parameter | Type | Default |
|-----------|------|---------|
| `fileName` | `string` | *required* |

<small>Gmsh C symbol: `gmshMerge`</small>

### `open`

```ts
gmsh.open(fileName: string): void
```

Open a file. Equivalent to the `File->Open' menu in the Gmsh app. Handling of the file depends on its extension and/or its contents: opening a file with model data will create a new model.

| Parameter | Type | Default |
|-----------|------|---------|
| `fileName` | `string` | *required* |

<small>Gmsh C symbol: `gmshOpen`</small>

### `write`

```ts
gmsh.write(fileName: string): void
```

Write a file. The export format is determined by the file extension.

| Parameter | Type | Default |
|-----------|------|---------|
| `fileName` | `string` | *required* |

<small>Gmsh C symbol: `gmshWrite`</small>

## `gmsh.algorithm`

### `refineTetrahedra`

```ts
gmsh.algorithm.refineTetrahedra(coord: number[], sizeAtNode: number[], tetraIn: number[]): { steiner: number[]; tetraOut: number[] }
```

Refine the list of tetrahedra given in the vector `tetraIn', using point coordinates `coord' and nodal size field `sizeAtNode'. The new point coordinates are returned in the `steiner' vector, and the new tetrahedra in the `tetraOut' vector.

| Parameter | Type | Default |
|-----------|------|---------|
| `coord` | `number[]` | *required* |
| `sizeAtNode` | `number[]` | *required* |
| `tetraIn` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshAlgorithmRefineTetrahedra`</small>

### `tetrahedralize`

```ts
gmsh.algorithm.tetrahedralize(coordinates: number[], triangles?: number[]): { tetrahedra: number[]; steiner: number[] }
```

Tetrahedralize the points given in the `coordinates' vector as concatenated triplets of x, y, z coordinates, with (optional) constrained triangles given in the `triangles' vector as triplets of indexes (with numbering starting at 1), and return the tetrahedra as concatenated quadruplets of point indexes (with numbering starting at 1) in `tetrahedra'. Steiner points might be added in the `steiner' vector.

| Parameter | Type | Default |
|-----------|------|---------|
| `coordinates` | `number[]` | *required* |
| `triangles` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshAlgorithmTetrahedralize`</small>

### `triangulate`

```ts
gmsh.algorithm.triangulate(coordinates: number[], edges?: number[]): { triangles: number[] }
```

Triangulate the points given in the `coordinates' vector as concatenated pairs of u, v coordinates, with (optional) constrained edges given in the `edges' vector as pairs of indexes (with numbering starting at 1), and return the triangles as concatenated triplets of point indexes (with numbering starting at 1) in `triangles'.

| Parameter | Type | Default |
|-----------|------|---------|
| `coordinates` | `number[]` | *required* |
| `edges` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshAlgorithmTriangulate`</small>

## `gmsh.logger`

### `get`

```ts
gmsh.logger.get(): { log: string[] }
```

Get logged messages.

<small>Gmsh C symbol: `gmshLoggerGet`</small>

### `getCpuTime`

```ts
gmsh.logger.getCpuTime(): number
```

Return CPU time (in s).

<small>Gmsh C symbol: `gmshLoggerGetCpuTime`</small>

### `getLastError`

```ts
gmsh.logger.getLastError(): { error: string }
```

Return last error message, if any.

<small>Gmsh C symbol: `gmshLoggerGetLastError`</small>

### `getMemory`

```ts
gmsh.logger.getMemory(): number
```

Return memory usage (in MB).

<small>Gmsh C symbol: `gmshLoggerGetMemory`</small>

### `getTotalMemory`

```ts
gmsh.logger.getTotalMemory(): number
```

Return total available memory (in MB).

<small>Gmsh C symbol: `gmshLoggerGetTotalMemory`</small>

### `getWallTime`

```ts
gmsh.logger.getWallTime(): number
```

Return wall clock time (in s).

<small>Gmsh C symbol: `gmshLoggerGetWallTime`</small>

### `start`

```ts
gmsh.logger.start(): void
```

Start logging messages.

<small>Gmsh C symbol: `gmshLoggerStart`</small>

### `stop`

```ts
gmsh.logger.stop(): void
```

Stop logging messages.

<small>Gmsh C symbol: `gmshLoggerStop`</small>

### `write`

```ts
gmsh.logger.write(message: string, level?: string): void
```

Write a `message'. `level' can be "info", "warning" or "error".

| Parameter | Type | Default |
|-----------|------|---------|
| `message` | `string` | *required* |
| `level` | `string` | `"info"` |

<small>Gmsh C symbol: `gmshLoggerWrite`</small>

## `gmsh.model`

### `add`

```ts
gmsh.model.add(name: string): void
```

Add a new model, with name `name', and set it as the current model.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelAdd`</small>

### `addDiscreteEntity`

```ts
gmsh.model.addDiscreteEntity(dim: number, tag?: number, boundary?: number[]): number
```

Add a discrete model entity (defined by a mesh) of dimension `dim' in the current model. Return the tag of the new discrete entity, equal to `tag' if `tag' is positive, or a new tag if `tag' < 0. `boundary' specifies the tags of the entities on the boundary of the discrete entity, if any. Specifying `boundary' allows Gmsh to construct the topology of the overall model.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | `-1` |
| `boundary` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelAddDiscreteEntity`</small>

### `addPhysicalGroup`

```ts
gmsh.model.addPhysicalGroup(dim: number, tags: number[], tag?: number, name?: string): number
```

Add a physical group of dimension `dim', grouping the model entities with tags `tags'. Return the tag of the physical group, equal to `tag' if `tag' is positive, or a new tag if `tag' < 0. Set the name of the physical group if `name' is not empty.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `name` | `string` | `""` |

<small>Gmsh C symbol: `gmshModelAddPhysicalGroup`</small>

### `getAdjacencies`

```ts
gmsh.model.getAdjacencies(dim: number, tag: number): { upward: number[]; downward: number[] }
```

Get the upward and downward adjacencies of the model entity of dimension `dim' and tag `tag'. The `upward' vector returns the tags of adjacent entities of dimension `dim' + 1; the `downward' vector returns the tags of adjacent entities of dimension `dim' - 1.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetAdjacencies`</small>

### `getAttribute`

```ts
gmsh.model.getAttribute(name: string): { values: string[] }
```

Get the values of the attribute with name `name'.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelGetAttribute`</small>

### `getAttributeNames`

```ts
gmsh.model.getAttributeNames(): { names: string[] }
```

Get the names of any optional attributes stored in the model.

<small>Gmsh C symbol: `gmshModelGetAttributeNames`</small>

### `getBoundary`

```ts
gmsh.model.getBoundary(dimTags: number[], combined?: boolean, oriented?: boolean, recursive?: boolean): { outDimTags: number[] }
```

Get the boundary of the model entities `dimTags', given as a vector of (dim, tag) pairs. Return in `outDimTags' the boundary of the individual entities (if `combined' is false) or the boundary of the combined geometrical shape formed by all input entities (if `combined' is true). Return tags multiplied by the sign of the boundary entity if `oriented' is true. Apply the boundary operator recursively down to dimension 0 (i.e. to points) if `recursive' is true.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `combined` | `boolean` | `true` |
| `oriented` | `boolean` | `false` |
| `recursive` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelGetBoundary`</small>

### `getBoundingBox`

```ts
gmsh.model.getBoundingBox(dim: number, tag: number): { xmin: number; ymin: number; zmin: number; xmax: number; ymax: number; zmax: number }
```

Get the bounding box (`xmin', `ymin', `zmin'), (`xmax', `ymax', `zmax') of the model entity of dimension `dim' and tag `tag'. If `dim' and `tag' are negative, get the bounding box of the whole model.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetBoundingBox`</small>

### `getClosestPoint`

```ts
gmsh.model.getClosestPoint(dim: number, tag: number, coord: number[]): { closestCoord: number[]; parametricCoord: number[] }
```

Get the points `closestCoord' on the entity of dimension `dim' (1 or 2) and tag `tag' to the points `coord', by orthogonal projection. `coord' and `closestCoord' are given as x, y, z coordinates, concatenated: [p1x, p1y, p1z, p2x, ...]. `parametricCoord' returns the parametric coordinates t on the curve (if `dim' == 1) or u and v coordinates concatenated on the surface (if `dim' = 2), i.e. [p1t, p2t, ...] or [p1u, p1v, p2u, ...]. The closest points can lie outside the (trimmed) entities: use `isInside()' to check.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `coord` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGetClosestPoint`</small>

### `getColor`

```ts
gmsh.model.getColor(dim: number, tag: number): { r: number; g: number; b: number; a: number }
```

Get the color of the model entity of dimension `dim' and tag `tag'. If no color is specified for the entity, return fully transparent blue, i.e. (0, 0, 255, 0).

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetColor`</small>

### `getCurrent`

```ts
gmsh.model.getCurrent(): { name: string }
```

Get the name of the current model.

<small>Gmsh C symbol: `gmshModelGetCurrent`</small>

### `getCurvature`

```ts
gmsh.model.getCurvature(dim: number, tag: number, parametricCoord: number[]): { curvatures: number[] }
```

Evaluate the (maximum) curvature of the entity of dimension `dim' and tag `tag' at the parametric coordinates `parametricCoord'. Only valid for `dim' equal to 1 (with `parametricCoord' containing parametric coordinates on the curve) or 2 (with `parametricCoord' containing u, v parametric coordinates on the surface, concatenated: [p1u, p1v, p2u, ...]).

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `parametricCoord` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGetCurvature`</small>

### `getDerivative`

```ts
gmsh.model.getDerivative(dim: number, tag: number, parametricCoord: number[]): { derivatives: number[] }
```

Evaluate the derivative of the parametrization of the entity of dimension `dim' and tag `tag' at the parametric coordinates `parametricCoord'. Only valid for `dim' equal to 1 (with `parametricCoord' containing parametric coordinates on the curve) or 2 (with `parametricCoord' containing u, v parametric coordinates on the surface, concatenated: [p1u, p1v, p2u, ...]). For `dim' equal to 1 return the x, y, z components of the derivative with respect to u [d1ux, d1uy, d1uz, d2ux, ...]; for `dim' equal to 2 return the x, y, z components of the derivative with respect to u and v: [d1ux, d1uy, d1uz, d1vx, d1vy, d1vz, d2ux, ...].

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `parametricCoord` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGetDerivative`</small>

### `getDimension`

```ts
gmsh.model.getDimension(): number
```

Return the geometrical dimension of the current model.

<small>Gmsh C symbol: `gmshModelGetDimension`</small>

### `getEntities`

```ts
gmsh.model.getEntities(dim?: number): { dimTags: number[] }
```

Get all the entities in the current model. A model entity is represented by two integers: its dimension (dim == 0, 1, 2 or 3) and its tag (its unique, strictly positive identifier). If `dim' is >= 0, return only the entities of the specified dimension (e.g. points if `dim' == 0). The entities are returned as a vector of (dim, tag) pairs.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGetEntities`</small>

### `getEntitiesForPhysicalGroup`

```ts
gmsh.model.getEntitiesForPhysicalGroup(dim: number, tag: number): { tags: number[] }
```

Get the tags of the model entities making up the physical group of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetEntitiesForPhysicalGroup`</small>

### `getEntitiesForPhysicalName`

```ts
gmsh.model.getEntitiesForPhysicalName(name: string): { dimTags: number[] }
```

Get the model entities (as a vector (dim, tag) pairs) making up the physical group with name `name'.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelGetEntitiesForPhysicalName`</small>

### `getEntitiesInBoundingBox`

```ts
gmsh.model.getEntitiesInBoundingBox(xmin: number, ymin: number, zmin: number, xmax: number, ymax: number, zmax: number, dim?: number): { dimTags: number[] }
```

Get the model entities in the bounding box defined by the two points (`xmin', `ymin', `zmin') and (`xmax', `ymax', `zmax'). If `dim' is >= 0, return only the entities of the specified dimension (e.g. points if `dim' == 0).

| Parameter | Type | Default |
|-----------|------|---------|
| `xmin` | `number` | *required* |
| `ymin` | `number` | *required* |
| `zmin` | `number` | *required* |
| `xmax` | `number` | *required* |
| `ymax` | `number` | *required* |
| `zmax` | `number` | *required* |
| `dim` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGetEntitiesInBoundingBox`</small>

### `getEntityName`

```ts
gmsh.model.getEntityName(dim: number, tag: number): { name: string }
```

Get the name of the entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetEntityName`</small>

### `getEntityProperties`

```ts
gmsh.model.getEntityProperties(dim: number, tag: number): { integers: number[]; reals: number[] }
```

Get the properties of the entity of dimension `dim' and tag `tag'. The `reals' vector contains the 4 coefficients of the cartesian equation for a plane surface; the center coordinates, axis direction, major radius and minor radius for a torus; the center coordinates, axis direction and radius for a cylinder; the center coordinates, axis direction, radius and semi-angle for surfaces of revolution; the center coordinates and the radius for a sphere.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetEntityProperties`</small>

### `getEntityType`

```ts
gmsh.model.getEntityType(dim: number, tag: number): { entityType: string }
```

Get the type of the entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetEntityType`</small>

### `getFileName`

```ts
gmsh.model.getFileName(): { fileName: string }
```

Get the file name (if any) associated with the current model. A file name is associated when a model is read from a file on disk.

<small>Gmsh C symbol: `gmshModelGetFileName`</small>

### `getNormal`

```ts
gmsh.model.getNormal(tag: number, parametricCoord: number[]): { normals: number[] }
```

Get the normal to the surface with tag `tag' at the parametric coordinates `parametricCoord'. The `parametricCoord' vector should contain u and v coordinates, concatenated: [p1u, p1v, p2u, ...]. `normals' are returned as a vector of x, y, z components, concatenated: [n1x, n1y, n1z, n2x, ...].

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `parametricCoord` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGetNormal`</small>

### `getNumberOfPartitions`

```ts
gmsh.model.getNumberOfPartitions(): number
```

Return the number of partitions in the model.

<small>Gmsh C symbol: `gmshModelGetNumberOfPartitions`</small>

### `getParametrization`

```ts
gmsh.model.getParametrization(dim: number, tag: number, coord: number[]): { parametricCoord: number[] }
```

Get the parametric coordinates `parametricCoord' for the points `coord' on the entity of dimension `dim' and tag `tag'. `coord' are given as x, y, z coordinates, concatenated: [p1x, p1y, p1z, p2x, ...]. `parametricCoord' returns the parametric coordinates t on the curve (if `dim' = 1) or u and v coordinates concatenated on the surface (if `dim' == 2), i.e. [p1t, p2t, ...] or [p1u, p1v, p2u, ...].

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `coord` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGetParametrization`</small>

### `getParametrizationBounds`

```ts
gmsh.model.getParametrizationBounds(dim: number, tag: number): { min: number[]; max: number[] }
```

Get the `min' and `max' bounds of the parametric coordinates for the entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetParametrizationBounds`</small>

### `getParent`

```ts
gmsh.model.getParent(dim: number, tag: number): { parentDim: number; parentTag: number }
```

In a partitioned model, get the parent of the entity of dimension `dim' and tag `tag', i.e. from which the entity is a part of, if any. `parentDim' and `parentTag' are set to -1 if the entity has no parent.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetParent`</small>

### `getPartitions`

```ts
gmsh.model.getPartitions(dim: number, tag: number): { partitions: number[] }
```

In a partitioned model, return the tags of the partition(s) to which the entity belongs.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetPartitions`</small>

### `getPhysicalGroups`

```ts
gmsh.model.getPhysicalGroups(dim?: number): { dimTags: number[] }
```

Get the physical groups in the current model. The physical groups are returned as a vector of (dim, tag) pairs. If `dim' is >= 0, return only the groups of the specified dimension (e.g. physical points if `dim' == 0).

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGetPhysicalGroups`</small>

### `getPhysicalGroupsEntities`

```ts
gmsh.model.getPhysicalGroupsEntities(dim?: number): { dimTags: number[]; entities: number[][] }
```

Get the physical groups in the current model as well as the model entities that make them up. The physical groups are returned as the vector of (dim, tag) pairs `dimTags'. The model entities making up the corresponding physical groups are returned in `entities'. If `dim' is >= 0, return only the groups of the specified dimension (e.g. physical points if `dim' == 0).

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGetPhysicalGroupsEntities`</small>

### `getPhysicalGroupsForEntity`

```ts
gmsh.model.getPhysicalGroupsForEntity(dim: number, tag: number): { physicalTags: number[] }
```

Get the tags of the physical groups (if any) to which the model entity of dimension `dim' and tag `tag' belongs.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetPhysicalGroupsForEntity`</small>

### `getPhysicalName`

```ts
gmsh.model.getPhysicalName(dim: number, tag: number): { name: string }
```

Get the name of the physical group of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetPhysicalName`</small>

### `getPrincipalCurvatures`

```ts
gmsh.model.getPrincipalCurvatures(tag: number, parametricCoord: number[]): { curvatureMax: number[]; curvatureMin: number[]; directionMax: number[]; directionMin: number[] }
```

Evaluate the principal curvatures of the surface with tag `tag' at the parametric coordinates `parametricCoord', as well as their respective directions. `parametricCoord' are given by pair of u and v coordinates, concatenated: [p1u, p1v, p2u, ...].

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `parametricCoord` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGetPrincipalCurvatures`</small>

### `getSecondDerivative`

```ts
gmsh.model.getSecondDerivative(dim: number, tag: number, parametricCoord: number[]): { derivatives: number[] }
```

Evaluate the second derivative of the parametrization of the entity of dimension `dim' and tag `tag' at the parametric coordinates `parametricCoord'. Only valid for `dim' equal to 1 (with `parametricCoord' containing parametric coordinates on the curve) or 2 (with `parametricCoord' containing u, v parametric coordinates on the surface, concatenated: [p1u, p1v, p2u, ...]). For `dim' equal to 1 return the x, y, z components of the second derivative with respect to u [d1uux, d1uuy, d1uuz, d2uux, ...]; for `dim' equal to 2 return the x, y, z components of the second derivative with respect to u and v, and the mixed derivative with respect to u and v: [d1uux, d1uuy, d1uuz, d1vvx, d1vvy, d1vvz, d1uvx, d1uvy, d1uvz, d2uux, ...].

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `parametricCoord` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGetSecondDerivative`</small>

### `getType`

```ts
gmsh.model.getType(dim: number, tag: number): { entityType: string }
```

Get the type of the entity of dimension `dim' and tag `tag'. (This is a deprecated synonym for `getType'.)

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetType`</small>

### `getValue`

```ts
gmsh.model.getValue(dim: number, tag: number, parametricCoord: number[]): { coord: number[] }
```

Evaluate the parametrization of the entity of dimension `dim' and tag `tag' at the parametric coordinates `parametricCoord'. Only valid for `dim' equal to 0 (with empty `parametricCoord'), 1 (with `parametricCoord' containing parametric coordinates on the curve) or 2 (with `parametricCoord' containing u, v parametric coordinates on the surface, concatenated: [p1u, p1v, p2u, ...]). Return x, y, z coordinates in `coord', concatenated: [p1x, p1y, p1z, p2x, ...].

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `parametricCoord` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGetValue`</small>

### `getVisibility`

```ts
gmsh.model.getVisibility(dim: number, tag: number): { value: number }
```

Get the visibility of the model entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGetVisibility`</small>

### `isEntityOrphan`

```ts
gmsh.model.isEntityOrphan(dim: number, tag: number): number
```

Return whether the model entity of dimension `dim' and tag `tag' is an orphan, i.e. is not connected to any entity of the highest dimension in the model.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelIsEntityOrphan`</small>

### `isInside`

```ts
gmsh.model.isInside(dim: number, tag: number, coord: number[], parametric?: boolean): number
```

Check if the coordinates (or the parametric coordinates if `parametric' is set) provided in `coord' correspond to points inside the entity of dimension `dim' and tag `tag', and return the number of points inside. This feature is only available for a subset of entities, depending on the underlying geometrical representation.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `coord` | `number[]` | *required* |
| `parametric` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelIsInside`</small>

### `list`

```ts
gmsh.model.list(): { names: string[] }
```

List the names of all models.

<small>Gmsh C symbol: `gmshModelList`</small>

### `remove`

```ts
gmsh.model.remove(): void
```

Remove the current model.

<small>Gmsh C symbol: `gmshModelRemove`</small>

### `removeAttribute`

```ts
gmsh.model.removeAttribute(name: string): void
```

Remove the attribute with name `name'.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelRemoveAttribute`</small>

### `removeEntities`

```ts
gmsh.model.removeEntities(dimTags: number[], recursive?: boolean): void
```

Remove the entities `dimTags' (given as a vector of (dim, tag) pairs) of the current model, provided that they are not on the boundary of (or embedded in) higher-dimensional entities. If `recursive' is true, remove all the entities on their boundaries, down to dimension 0.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `recursive` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelRemoveEntities`</small>

### `removeEntityName`

```ts
gmsh.model.removeEntityName(name: string): void
```

Remove the entity name `name' from the current model.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelRemoveEntityName`</small>

### `removePhysicalGroups`

```ts
gmsh.model.removePhysicalGroups(dimTags?: number[]): void
```

Remove the physical groups `dimTags' (given as a vector of (dim, tag) pairs) from the current model. If `dimTags' is empty, remove all groups.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelRemovePhysicalGroups`</small>

### `removePhysicalName`

```ts
gmsh.model.removePhysicalName(name: string): void
```

Remove the physical name `name' from the current model.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelRemovePhysicalName`</small>

### `reparametrizeOnSurface`

```ts
gmsh.model.reparametrizeOnSurface(dim: number, tag: number, parametricCoord: number[], surfaceTag: number, which?: number): { surfaceParametricCoord: number[] }
```

Reparametrize the boundary entity (point or curve, i.e. with `dim' == 0 or `dim' == 1) of tag `tag' on the surface `surfaceTag'. If `dim' == 1, reparametrize all the points corresponding to the parametric coordinates `parametricCoord'. Multiple matches in case of periodic surfaces can be selected with `which'. This feature is only available for a subset of entities, depending on the underlying geometrical representation.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `parametricCoord` | `number[]` | *required* |
| `surfaceTag` | `number` | *required* |
| `which` | `number` | `0` |

<small>Gmsh C symbol: `gmshModelReparametrizeOnSurface`</small>

### `setAttribute`

```ts
gmsh.model.setAttribute(name: string, values: string[]): void
```

Set the values of the attribute with name `name'.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `values` | `string[]` | *required* |

<small>Gmsh C symbol: `gmshModelSetAttribute`</small>

### `setColor`

```ts
gmsh.model.setColor(dimTags: number[], r: number, g: number, b: number, a?: number, recursive?: boolean): void
```

Set the color of the model entities `dimTags' (given as a vector of (dim, tag) pairs) to the RGBA value (`r', `g', `b', `a'), where `r', `g', `b' and `a' should be integers between 0 and 255. Apply the color setting recursively if `recursive' is true.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `r` | `number` | *required* |
| `g` | `number` | *required* |
| `b` | `number` | *required* |
| `a` | `number` | `255` |
| `recursive` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelSetColor`</small>

### `setCoordinates`

```ts
gmsh.model.setCoordinates(tag: number, x: number, y: number, z: number): void
```

Set the `x', `y', `z' coordinates of a geometrical point.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelSetCoordinates`</small>

### `setCurrent`

```ts
gmsh.model.setCurrent(name: string): void
```

Set the current model to the model with name `name'. If several models have the same name, select the one that was added first.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelSetCurrent`</small>

### `setEntityName`

```ts
gmsh.model.setEntityName(dim: number, tag: number, name: string): void
```

Set the name of the entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelSetEntityName`</small>

### `setFileName`

```ts
gmsh.model.setFileName(fileName: string): void
```

Set the file name associated with the current model.

| Parameter | Type | Default |
|-----------|------|---------|
| `fileName` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelSetFileName`</small>

### `setPhysicalName`

```ts
gmsh.model.setPhysicalName(dim: number, tag: number, name: string): void
```

Set the name of the physical group of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelSetPhysicalName`</small>

### `setTag`

```ts
gmsh.model.setTag(dim: number, tag: number, newTag: number): void
```

Set the tag of the entity of dimension `dim' and tag `tag' to the new value `newTag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `newTag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelSetTag`</small>

### `setVisibility`

```ts
gmsh.model.setVisibility(dimTags: number[], value: number, recursive?: boolean): void
```

Set the visibility of the model entities `dimTags' (given as a vector of (dim, tag) pairs) to `value'. Apply the visibility setting recursively if `recursive' is true.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `value` | `number` | *required* |
| `recursive` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelSetVisibility`</small>

### `setVisibilityPerWindow`

```ts
gmsh.model.setVisibilityPerWindow(value: number, windowIndex?: number): void
```

Set the global visibility of the model per window to `value', where `windowIndex' identifies the window in the window list.

| Parameter | Type | Default |
|-----------|------|---------|
| `value` | `number` | *required* |
| `windowIndex` | `number` | `0` |

<small>Gmsh C symbol: `gmshModelSetVisibilityPerWindow`</small>

## `gmsh.onelab`

### `clear`

```ts
gmsh.onelab.clear(name?: string): void
```

Clear the ONELAB database, or remove a single parameter if `name' is given.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | `""` |

<small>Gmsh C symbol: `gmshOnelabClear`</small>

### `get`

```ts
gmsh.onelab.get(name?: string, format?: string): { data: string }
```

Get all the parameters (or a single one if `name' is specified) from the ONELAB database, encoded in `format'.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | `""` |
| `format` | `string` | `"json"` |

<small>Gmsh C symbol: `gmshOnelabGet`</small>

### `getChanged`

```ts
gmsh.onelab.getChanged(name: string): number
```

Check if any parameters in the ONELAB database used by the client `name' have been changed.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshOnelabGetChanged`</small>

### `getNames`

```ts
gmsh.onelab.getNames(search?: string): { names: string[] }
```

Get the names of the parameters in the ONELAB database matching the `search' regular expression. If `search' is empty, return all the names.

| Parameter | Type | Default |
|-----------|------|---------|
| `search` | `string` | `""` |

<small>Gmsh C symbol: `gmshOnelabGetNames`</small>

### `getNumber`

```ts
gmsh.onelab.getNumber(name: string): { value: number[] }
```

Get the value of the number parameter `name' from the ONELAB database. Return an empty vector if the parameter does not exist.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshOnelabGetNumber`</small>

### `getString`

```ts
gmsh.onelab.getString(name: string): { value: string[] }
```

Get the value of the string parameter `name' from the ONELAB database. Return an empty vector if the parameter does not exist.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshOnelabGetString`</small>

### `run`

```ts
gmsh.onelab.run(name?: string, command?: string): void
```

Run a ONELAB client. If `name' is provided, create a new ONELAB client with name `name' and executes `command'. If not, try to run a client that might be linked to the processed input files.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | `""` |
| `command` | `string` | `""` |

<small>Gmsh C symbol: `gmshOnelabRun`</small>

### `set`

```ts
gmsh.onelab.set(data: string, format?: string): void
```

Set one or more parameters in the ONELAB database, encoded in `format'.

| Parameter | Type | Default |
|-----------|------|---------|
| `data` | `string` | *required* |
| `format` | `string` | `"json"` |

<small>Gmsh C symbol: `gmshOnelabSet`</small>

### `setChanged`

```ts
gmsh.onelab.setChanged(name: string, value: number): void
```

Set the changed flag to value `value' for all the parameters in the ONELAB database used by the client `name'.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `value` | `number` | *required* |

<small>Gmsh C symbol: `gmshOnelabSetChanged`</small>

### `setNumber`

```ts
gmsh.onelab.setNumber(name: string, value: number[]): void
```

Set the value of the number parameter `name' in the ONELAB database. Create the parameter if it does not exist; update the value if the parameter exists.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `value` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshOnelabSetNumber`</small>

### `setString`

```ts
gmsh.onelab.setString(name: string, value: string[]): void
```

Set the value of the string parameter `name' in the ONELAB database. Create the parameter if it does not exist; update the value if the parameter exists.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `value` | `string[]` | *required* |

<small>Gmsh C symbol: `gmshOnelabSetString`</small>

## `gmsh.option`

### `getColor`

```ts
gmsh.option.getColor(name: string): { r: number; g: number; b: number; a: number }
```

Get the `r', `g', `b', `a' value of a color option. `name' is of the form "Category.Color.Option" or "Category[num].Color.Option". Available categories and options are listed in the "Gmsh options" chapter of the Gmsh reference manual (https://gmsh.info/doc/texinfo/gmsh.html#Gmsh-options). For conciseness "Color." can be ommitted in `name'.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshOptionGetColor`</small>

### `getNumber`

```ts
gmsh.option.getNumber(name: string): { value: number }
```

Get the `value' of a numerical option. `name' is of the form "Category.Option" or "Category[num].Option". Available categories and options are listed in the "Gmsh options" chapter of the Gmsh reference manual (https://gmsh.info/doc/texinfo/gmsh.html#Gmsh-options).

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshOptionGetNumber`</small>

### `getString`

```ts
gmsh.option.getString(name: string): { value: string }
```

Get the `value' of a string option. `name' is of the form "Category.Option" or "Category[num].Option". Available categories and options are listed in the "Gmsh options" chapter of the Gmsh reference manual (https://gmsh.info/doc/texinfo/gmsh.html#Gmsh-options).

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshOptionGetString`</small>

### `restoreDefaults`

```ts
gmsh.option.restoreDefaults(): void
```

Restore all options to default settings.

<small>Gmsh C symbol: `gmshOptionRestoreDefaults`</small>

### `setColor`

```ts
gmsh.option.setColor(name: string, r: number, g: number, b: number, a?: number): void
```

Set a color option to the RGBA value (`r', `g', `b', `a'), where `r', `g', `b' and `a' should be integers between 0 and 255. `name' is of the form "Category.Color.Option" or "Category[num].Color.Option". Available categories and options are listed in the "Gmsh options" chapter of the Gmsh reference manual (https://gmsh.info/doc/texinfo/gmsh.html#Gmsh-options). For conciseness "Color." can be ommitted in `name'.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `r` | `number` | *required* |
| `g` | `number` | *required* |
| `b` | `number` | *required* |
| `a` | `number` | `255` |

<small>Gmsh C symbol: `gmshOptionSetColor`</small>

### `setNumber`

```ts
gmsh.option.setNumber(name: string, value: number): void
```

Set a numerical option to `value'. `name' is of the form "Category.Option" or "Category[num].Option". Available categories and options are listed in the "Gmsh options" chapter of the Gmsh reference manual (https://gmsh.info/doc/texinfo/gmsh.html#Gmsh-options).

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `value` | `number` | *required* |

<small>Gmsh C symbol: `gmshOptionSetNumber`</small>

### `setString`

```ts
gmsh.option.setString(name: string, value: string): void
```

Set a string option to `value'. `name' is of the form "Category.Option" or "Category[num].Option". Available categories and options are listed in the "Gmsh options" chapter of the Gmsh reference manual (https://gmsh.info/doc/texinfo/gmsh.html#Gmsh-options).

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `value` | `string` | *required* |

<small>Gmsh C symbol: `gmshOptionSetString`</small>

## `gmsh.parser`

### `clear`

```ts
gmsh.parser.clear(name?: string): void
```

Clear all the Gmsh parser variables, or remove a single variable if `name' is given.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | `""` |

<small>Gmsh C symbol: `gmshParserClear`</small>

### `getNames`

```ts
gmsh.parser.getNames(search?: string): { names: string[] }
```

Get the names of the variables in the Gmsh parser matching the `search' regular expression. If `search' is empty, return all the names.

| Parameter | Type | Default |
|-----------|------|---------|
| `search` | `string` | `""` |

<small>Gmsh C symbol: `gmshParserGetNames`</small>

### `getNumber`

```ts
gmsh.parser.getNumber(name: string): { value: number[] }
```

Get the value of the number variable `name' from the Gmsh parser. Return an empty vector if the variable does not exist.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshParserGetNumber`</small>

### `getString`

```ts
gmsh.parser.getString(name: string): { value: string[] }
```

Get the value of the string variable `name' from the Gmsh parser. Return an empty vector if the variable does not exist.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshParserGetString`</small>

### `parse`

```ts
gmsh.parser.parse(fileName: string): void
```

Parse the file `fileName' with the Gmsh parser.

| Parameter | Type | Default |
|-----------|------|---------|
| `fileName` | `string` | *required* |

<small>Gmsh C symbol: `gmshParserParse`</small>

### `setNumber`

```ts
gmsh.parser.setNumber(name: string, value: number[]): void
```

Set the value of the number variable `name' in the Gmsh parser. Create the variable if it does not exist; update the value if the variable exists.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `value` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshParserSetNumber`</small>

### `setString`

```ts
gmsh.parser.setString(name: string, value: string[]): void
```

Set the value of the string variable `name' in the Gmsh parser. Create the variable if it does not exist; update the value if the variable exists.

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `value` | `string[]` | *required* |

<small>Gmsh C symbol: `gmshParserSetString`</small>

## `gmsh.plugin`

### `run`

```ts
gmsh.plugin.run(name: string): number
```

Run the plugin `name'. Return the tag of the created view (if any). Plugins available in the official Gmsh release are listed in the "Gmsh plugins" chapter of the Gmsh reference manual (https://gmsh.info/doc/texinfo/gmsh.html#Gmsh-plugins).

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |

<small>Gmsh C symbol: `gmshPluginRun`</small>

### `setNumber`

```ts
gmsh.plugin.setNumber(name: string, option: string, value: number): void
```

Set the numerical option `option' to the value `value' for plugin `name'. Plugins available in the official Gmsh release are listed in the "Gmsh plugins" chapter of the Gmsh reference manual (https://gmsh.info/doc/texinfo/gmsh.html#Gmsh-plugins).

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `option` | `string` | *required* |
| `value` | `number` | *required* |

<small>Gmsh C symbol: `gmshPluginSetNumber`</small>

### `setString`

```ts
gmsh.plugin.setString(name: string, option: string, value: string): void
```

Set the string option `option' to the value `value' for plugin `name'. Plugins available in the official Gmsh release are listed in the "Gmsh plugins" chapter of the Gmsh reference manual (https://gmsh.info/doc/texinfo/gmsh.html#Gmsh-plugins).

| Parameter | Type | Default |
|-----------|------|---------|
| `name` | `string` | *required* |
| `option` | `string` | *required* |
| `value` | `string` | *required* |

<small>Gmsh C symbol: `gmshPluginSetString`</small>

## `gmsh.model.geo`

### `addBSpline`

```ts
gmsh.model.geo.addBSpline(pointTags: number[], tag?: number): number
```

Add a cubic b-spline curve in the built-in CAD representation, with `pointTags' control points. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Creates a periodic curve if the first and last points are the same. Return the tag of the b-spline curve.

| Parameter | Type | Default |
|-----------|------|---------|
| `pointTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddBSpline`</small>

### `addBezier`

```ts
gmsh.model.geo.addBezier(pointTags: number[], tag?: number): number
```

Add a Bezier curve in the built-in CAD representation, with `pointTags' control points. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the Bezier curve.

| Parameter | Type | Default |
|-----------|------|---------|
| `pointTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddBezier`</small>

### `addCircleArc`

```ts
gmsh.model.geo.addCircleArc(startTag: number, centerTag: number, endTag: number, tag?: number, nx?: number, ny?: number, nz?: number): number
```

Add a circle arc (strictly smaller than Pi) in the built-in CAD representation, between the two points with tags `startTag' and `endTag', and with center `centerTag'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. If (`nx', `ny', `nz') != (0, 0, 0), explicitly set the plane of the circle arc. Return the tag of the circle arc.

| Parameter | Type | Default |
|-----------|------|---------|
| `startTag` | `number` | *required* |
| `centerTag` | `number` | *required* |
| `endTag` | `number` | *required* |
| `tag` | `number` | `-1` |
| `nx` | `number` | `0.0` |
| `ny` | `number` | `0.0` |
| `nz` | `number` | `0.0` |

<small>Gmsh C symbol: `gmshModelGeoAddCircleArc`</small>

### `addCompoundBSpline`

```ts
gmsh.model.geo.addCompoundBSpline(curveTags: number[], numIntervals?: number, tag?: number): number
```

Add a b-spline curve in the built-in CAD representation, with control points sampling the curves in `curveTags'. The density of sampling points on each curve is governed by `numIntervals'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the b-spline.

| Parameter | Type | Default |
|-----------|------|---------|
| `curveTags` | `number[]` | *required* |
| `numIntervals` | `number` | `20` |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddCompoundBSpline`</small>

### `addCompoundSpline`

```ts
gmsh.model.geo.addCompoundSpline(curveTags: number[], numIntervals?: number, tag?: number): number
```

Add a spline (Catmull-Rom) curve in the built-in CAD representation, going through points sampling the curves in `curveTags'. The density of sampling points on each curve is governed by `numIntervals'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the spline.

| Parameter | Type | Default |
|-----------|------|---------|
| `curveTags` | `number[]` | *required* |
| `numIntervals` | `number` | `5` |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddCompoundSpline`</small>

### `addCurveLoop`

```ts
gmsh.model.geo.addCurveLoop(curveTags: number[], tag?: number, reorient?: boolean): number
```

Add a curve loop (a closed wire) in the built-in CAD representation, formed by the curves `curveTags'. `curveTags' should contain (signed) tags of model entities of dimension 1 forming a closed loop: a negative tag signifies that the underlying curve is considered with reversed orientation. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. If `reorient' is set, automatically reorient the curves if necessary. Return the tag of the curve loop.

| Parameter | Type | Default |
|-----------|------|---------|
| `curveTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `reorient` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelGeoAddCurveLoop`</small>

### `addCurveLoops`

```ts
gmsh.model.geo.addCurveLoops(curveTags: number[]): { tags: number[] }
```

Add curve loops in the built-in CAD representation based on the curves `curveTags'. Return the `tags' of found curve loops, if any.

| Parameter | Type | Default |
|-----------|------|---------|
| `curveTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGeoAddCurveLoops`</small>

### `addEllipseArc`

```ts
gmsh.model.geo.addEllipseArc(startTag: number, centerTag: number, majorTag: number, endTag: number, tag?: number, nx?: number, ny?: number, nz?: number): number
```

Add an ellipse arc (strictly smaller than Pi) in the built-in CAD representation, between the two points `startTag' and `endTag', and with center `centerTag' and major axis point `majorTag'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. If (`nx', `ny', `nz') != (0, 0, 0), explicitly set the plane of the circle arc. Return the tag of the ellipse arc.

| Parameter | Type | Default |
|-----------|------|---------|
| `startTag` | `number` | *required* |
| `centerTag` | `number` | *required* |
| `majorTag` | `number` | *required* |
| `endTag` | `number` | *required* |
| `tag` | `number` | `-1` |
| `nx` | `number` | `0.0` |
| `ny` | `number` | `0.0` |
| `nz` | `number` | `0.0` |

<small>Gmsh C symbol: `gmshModelGeoAddEllipseArc`</small>

### `addGeometry`

```ts
gmsh.model.geo.addGeometry(geometry: string, numbers?: number[], strings?: string[], tag?: number): number
```

Add a `geometry' in the built-in CAD representation. `geometry' can currently be one of "Sphere" or "PolarSphere" (where `numbers' should contain the x, y, z coordinates of the center, followed by the radius), or "ParametricSurface" (where `strings' should contains three expression evaluating to the x, y and z coordinates in terms of parametric coordinates u and v). If `tag' is positive, set the tag of the geometry explicitly; otherwise a new tag is selected automatically. Return the tag of the geometry.

| Parameter | Type | Default |
|-----------|------|---------|
| `geometry` | `string` | *required* |
| `numbers` | `number[]` | `[]` |
| `strings` | `string[]` | `[]` |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddGeometry`</small>

### `addLine`

```ts
gmsh.model.geo.addLine(startTag: number, endTag: number, tag?: number): number
```

Add a straight line segment in the built-in CAD representation, between the two points with tags `startTag' and `endTag'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the line.

| Parameter | Type | Default |
|-----------|------|---------|
| `startTag` | `number` | *required* |
| `endTag` | `number` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddLine`</small>

### `addPhysicalGroup`

```ts
gmsh.model.geo.addPhysicalGroup(dim: number, tags: number[], tag?: number, name?: string): number
```

Add a physical group of dimension `dim', grouping the entities with tags `tags' in the built-in CAD representation. Return the tag of the physical group, equal to `tag' if `tag' is positive, or a new tag if `tag' < 0. Set the name of the physical group if `name' is not empty.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `name` | `string` | `""` |

<small>Gmsh C symbol: `gmshModelGeoAddPhysicalGroup`</small>

### `addPlaneSurface`

```ts
gmsh.model.geo.addPlaneSurface(wireTags: number[], tag?: number): number
```

Add a plane surface in the built-in CAD representation, defined by one or more curve loops `wireTags'. The first curve loop defines the exterior contour; additional curve loop define holes. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the surface.

| Parameter | Type | Default |
|-----------|------|---------|
| `wireTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddPlaneSurface`</small>

### `addPoint`

```ts
gmsh.model.geo.addPoint(x: number, y: number, z: number, meshSize?: number, tag?: number): number
```

Add a geometrical point in the built-in CAD representation, at coordinates (`x', `y', `z'). If `meshSize' is > 0, add a meshing constraint at that point. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the point. (Note that the point will be added in the current model only after `synchronize' is called. This behavior holds for all the entities added in the geo module.)

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `meshSize` | `number` | `0.0` |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddPoint`</small>

### `addPointOnGeometry`

```ts
gmsh.model.geo.addPointOnGeometry(geometryTag: number, x: number, y: number, z?: number, meshSize?: number, tag?: number): number
```

Add a point in the built-in CAD representation, at coordinates (`x', `y', `z') on the geometry `geometryTag'. If `meshSize' is > 0, add a meshing constraint at that point. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the point. For surface geometries, only the `x' and `y' coordinates are used.

| Parameter | Type | Default |
|-----------|------|---------|
| `geometryTag` | `number` | *required* |
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | `0.0` |
| `meshSize` | `number` | `0.0` |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddPointOnGeometry`</small>

### `addPolyline`

```ts
gmsh.model.geo.addPolyline(pointTags: number[], tag?: number): number
```

Add a polyline curve in the built-in CAD representation, going through the points `pointTags'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Create a periodic curve if the first and last points are the same. Return the tag of the polyline curve.

| Parameter | Type | Default |
|-----------|------|---------|
| `pointTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddPolyline`</small>

### `addSpline`

```ts
gmsh.model.geo.addSpline(pointTags: number[], tag?: number): number
```

Add a spline (Catmull-Rom) curve in the built-in CAD representation, going through the points `pointTags'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Create a periodic curve if the first and last points are the same. Return the tag of the spline curve.

| Parameter | Type | Default |
|-----------|------|---------|
| `pointTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddSpline`</small>

### `addSurfaceFilling`

```ts
gmsh.model.geo.addSurfaceFilling(wireTags: number[], tag?: number, sphereCenterTag?: number): number
```

Add a surface in the built-in CAD representation, filling the curve loops in `wireTags' using transfinite interpolation. Currently only a single curve loop is supported; this curve loop should be composed by 3 or 4 curves only. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the surface.

| Parameter | Type | Default |
|-----------|------|---------|
| `wireTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `sphereCenterTag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddSurfaceFilling`</small>

### `addSurfaceLoop`

```ts
gmsh.model.geo.addSurfaceLoop(surfaceTags: number[], tag?: number): number
```

Add a surface loop (a closed shell) formed by `surfaceTags' in the built-in CAD representation. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the shell.

| Parameter | Type | Default |
|-----------|------|---------|
| `surfaceTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddSurfaceLoop`</small>

### `addVolume`

```ts
gmsh.model.geo.addVolume(shellTags: number[], tag?: number): number
```

Add a volume (a region) in the built-in CAD representation, defined by one or more shells `shellTags'. The first surface loop defines the exterior boundary; additional surface loop define holes. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the volume.

| Parameter | Type | Default |
|-----------|------|---------|
| `shellTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoAddVolume`</small>

### `copy`

```ts
gmsh.model.geo.copy(dimTags: number[]): { outDimTags: number[] }
```

Copy the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation; the new entities are returned in `outDimTags'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGeoCopy`</small>

### `dilate`

```ts
gmsh.model.geo.dilate(dimTags: number[], x: number, y: number, z: number, a: number, b: number, c: number): void
```

Scale the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation by factors `a', `b' and `c' along the three coordinate axes; use (`x', `y', `z') as the center of the homothetic transformation.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `a` | `number` | *required* |
| `b` | `number` | *required* |
| `c` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoDilate`</small>

### `extrude`

```ts
gmsh.model.geo.extrude(dimTags: number[], dx: number, dy: number, dz: number, numElements?: number[], heights?: number[], recombine?: boolean): { outDimTags: number[] }
```

Extrude the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation, using a translation along (`dx', `dy', `dz'). Return extruded entities in `outDimTags'. If the `numElements' vector is not empty, also extrude the mesh: the entries in `numElements' give the number of elements in each layer. If the `height' vector is not empty, it provides the (cumulative) height of the different layers, normalized to 1. If `recombine' is set, recombine the mesh in the layers.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `dx` | `number` | *required* |
| `dy` | `number` | *required* |
| `dz` | `number` | *required* |
| `numElements` | `number[]` | `[]` |
| `heights` | `number[]` | `[]` |
| `recombine` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelGeoExtrude`</small>

### `extrudeBoundaryLayer`

```ts
gmsh.model.geo.extrudeBoundaryLayer(dimTags: number[], numElements?: number[], heights?: number[], recombine?: boolean, second?: boolean, viewIndex?: number): { outDimTags: number[] }
```

Extrude the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation along the normals of the mesh, creating discrete boundary layer entities. Return extruded entities in `outDimTags'. The entries in `numElements' give the number of elements in each layer. If the `height' vector is not empty, it provides the (cumulative) height of the different layers. If `recombine' is set, recombine the mesh in the layers. A second boundary layer can be created from the same entities if `second' is set. If `viewIndex' is >= 0, use the corresponding view to either specify the normals (if the view contains a vector field) or scale the normals (if the view is scalar).

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `numElements` | `number[]` | `[1]` |
| `heights` | `number[]` | `[]` |
| `recombine` | `boolean` | `false` |
| `second` | `boolean` | `false` |
| `viewIndex` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelGeoExtrudeBoundaryLayer`</small>

### `getMaxTag`

```ts
gmsh.model.geo.getMaxTag(dim: number): number
```

Get the maximum tag of entities of dimension `dim' in the built-in CAD representation.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoGetMaxTag`</small>

### `mirror`

```ts
gmsh.model.geo.mirror(dimTags: number[], a: number, b: number, c: number, d: number): void
```

Mirror the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation, with respect to the plane of equation `a' * x + `b' * y + `c' * z + `d' = 0.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `a` | `number` | *required* |
| `b` | `number` | *required* |
| `c` | `number` | *required* |
| `d` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoMirror`</small>

### `remove`

```ts
gmsh.model.geo.remove(dimTags: number[], recursive?: boolean): void
```

Remove the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation, provided that they are not on the boundary of higher-dimensional entities. If `recursive' is true, remove all the entities on their boundaries, down to dimension 0.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `recursive` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelGeoRemove`</small>

### `removeAllDuplicates`

```ts
gmsh.model.geo.removeAllDuplicates(): void
```

Remove all duplicate entities in the built-in CAD representation (different entities at the same geometrical location).

<small>Gmsh C symbol: `gmshModelGeoRemoveAllDuplicates`</small>

### `removePhysicalGroups`

```ts
gmsh.model.geo.removePhysicalGroups(dimTags?: number[]): void
```

Remove the physical groups `dimTags' (given as a vector of (dim, tag) pairs) from the built-in CAD representation. If `dimTags' is empty, remove all groups.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelGeoRemovePhysicalGroups`</small>

### `revolve`

```ts
gmsh.model.geo.revolve(dimTags: number[], x: number, y: number, z: number, ax: number, ay: number, az: number, angle: number, numElements?: number[], heights?: number[], recombine?: boolean): { outDimTags: number[] }
```

Extrude the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation, using a rotation of `angle' radians around the axis of revolution defined by the point (`x', `y', `z') and the direction (`ax', `ay', `az'). The angle should be strictly smaller than Pi. Return extruded entities in `outDimTags'. If the `numElements' vector is not empty, also extrude the mesh: the entries in `numElements' give the number of elements in each layer. If the `height' vector is not empty, it provides the (cumulative) height of the different layers, normalized to 1. If `recombine' is set, recombine the mesh in the layers.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `ax` | `number` | *required* |
| `ay` | `number` | *required* |
| `az` | `number` | *required* |
| `angle` | `number` | *required* |
| `numElements` | `number[]` | `[]` |
| `heights` | `number[]` | `[]` |
| `recombine` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelGeoRevolve`</small>

### `rotate`

```ts
gmsh.model.geo.rotate(dimTags: number[], x: number, y: number, z: number, ax: number, ay: number, az: number, angle: number): void
```

Rotate the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation by `angle' radians around the axis of revolution defined by the point (`x', `y', `z') and the direction (`ax', `ay', `az').

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `ax` | `number` | *required* |
| `ay` | `number` | *required* |
| `az` | `number` | *required* |
| `angle` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoRotate`</small>

### `setMaxTag`

```ts
gmsh.model.geo.setMaxTag(dim: number, maxTag: number): void
```

Set the maximum tag `maxTag' for entities of dimension `dim' in the built-in CAD representation.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `maxTag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoSetMaxTag`</small>

### `splitCurve`

```ts
gmsh.model.geo.splitCurve(tag: number, pointTags: number[]): { curveTags: number[] }
```

Split the curve of tag `tag' in the built-in CAD representation, on the specified control points `pointTags'. This feature is only available for splines and b-splines. Return the tag(s) `curveTags' of the newly created curve(s).

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `pointTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelGeoSplitCurve`</small>

### `symmetrize`

```ts
gmsh.model.geo.symmetrize(dimTags: number[], a: number, b: number, c: number, d: number): void
```

Mirror the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation, with respect to the plane of equation `a' * x + `b' * y + `c' * z + `d' = 0. (This is a deprecated synonym for `mirror'.)

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `a` | `number` | *required* |
| `b` | `number` | *required* |
| `c` | `number` | *required* |
| `d` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoSymmetrize`</small>

### `synchronize`

```ts
gmsh.model.geo.synchronize(): void
```

Synchronize the built-in CAD representation with the current Gmsh model. This can be called at any time, but since it involves a non trivial amount of processing, the number of synchronization points should normally be minimized. Without synchronization the entities in the built-in CAD representation are not available to any function outside of the built-in CAD kernel functions.

<small>Gmsh C symbol: `gmshModelGeoSynchronize`</small>

### `translate`

```ts
gmsh.model.geo.translate(dimTags: number[], dx: number, dy: number, dz: number): void
```

Translate the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation along (`dx', `dy', `dz').

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `dx` | `number` | *required* |
| `dy` | `number` | *required* |
| `dz` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoTranslate`</small>

### `twist`

```ts
gmsh.model.geo.twist(dimTags: number[], x: number, y: number, z: number, dx: number, dy: number, dz: number, ax: number, ay: number, az: number, angle: number, numElements?: number[], heights?: number[], recombine?: boolean): { outDimTags: number[] }
```

Extrude the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD representation, using a combined translation and rotation of `angle' radians, along (`dx', `dy', `dz') and around the axis of revolution defined by the point (`x', `y', `z') and the direction (`ax', `ay', `az'). The angle should be strictly smaller than Pi. Return extruded entities in `outDimTags'. If the `numElements' vector is not empty, also extrude the mesh: the entries in `numElements' give the number of elements in each layer. If the `height' vector is not empty, it provides the (cumulative) height of the different layers, normalized to 1. If `recombine' is set, recombine the mesh in the layers.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `dx` | `number` | *required* |
| `dy` | `number` | *required* |
| `dz` | `number` | *required* |
| `ax` | `number` | *required* |
| `ay` | `number` | *required* |
| `az` | `number` | *required* |
| `angle` | `number` | *required* |
| `numElements` | `number[]` | `[]` |
| `heights` | `number[]` | `[]` |
| `recombine` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelGeoTwist`</small>

## `gmsh.model.mesh`

### `addEdges`

```ts
gmsh.model.mesh.addEdges(edgeTags: number[], edgeNodes: number[]): void
```

Add mesh edges defined by their global unique identifiers `edgeTags' and their nodes `edgeNodes'.

| Parameter | Type | Default |
|-----------|------|---------|
| `edgeTags` | `number[]` | *required* |
| `edgeNodes` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshAddEdges`</small>

### `addElements`

```ts
gmsh.model.mesh.addElements(dim: number, tag: number, elementTypes: number[], elementTags: number[][], nodeTags: number[][]): void
```

Add elements classified on the entity of dimension `dim' and tag `tag'. `types' contains the MSH types of the elements (e.g. `2' for 3-node triangles: see the Gmsh reference manual). `elementTags' is a vector of the same length as `types'; each entry is a vector containing the tags (unique, strictly positive identifiers) of the elements of the corresponding type. `nodeTags' is also a vector of the same length as `types'; each entry is a vector of length equal to the number of elements of the given type times the number N of nodes per element, that contains the node tags of all the elements of the given type, concatenated: [e1n1, e1n2, ..., e1nN, e2n1, ...].

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `elementTypes` | `number[]` | *required* |
| `elementTags` | `number[][]` | *required* |
| `nodeTags` | `number[][]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshAddElements`</small>

### `addElementsByType`

```ts
gmsh.model.mesh.addElementsByType(tag: number, elementType: number, elementTags: number[], nodeTags: number[]): void
```

Add elements of type `elementType' classified on the entity of tag `tag'. `elementTags' contains the tags (unique, strictly positive identifiers) of the elements of the corresponding type. `nodeTags' is a vector of length equal to the number of elements times the number N of nodes per element, that contains the node tags of all the elements, concatenated: [e1n1, e1n2, ..., e1nN, e2n1, ...]. If the `elementTag' vector is empty, new tags are automatically assigned to the elements.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `elementType` | `number` | *required* |
| `elementTags` | `number[]` | *required* |
| `nodeTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshAddElementsByType`</small>

### `addFaces`

```ts
gmsh.model.mesh.addFaces(faceType: number, faceTags: number[], faceNodes: number[]): void
```

Add mesh faces of type `faceType' defined by their global unique identifiers `faceTags' and their nodes `faceNodes'.

| Parameter | Type | Default |
|-----------|------|---------|
| `faceType` | `number` | *required* |
| `faceTags` | `number[]` | *required* |
| `faceNodes` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshAddFaces`</small>

### `addHomologyRequest`

```ts
gmsh.model.mesh.addHomologyRequest(type?: string, domainTags?: number[], subdomainTags?: number[], dims?: number[]): void
```

Add a request to compute a basis representation for homology spaces (if `type' == "Homology") or cohomology spaces (if `type' == "Cohomology"). The computation domain is given in a list of physical group tags `domainTags'; if empty, the whole mesh is the domain. The computation subdomain for relative (co)homology computation is given in a list of physical group tags `subdomainTags'; if empty, absolute (co)homology is computed. The dimensions of the (co)homology bases to be computed are given in the list `dim'; if empty, all bases are computed. Resulting basis representation (co)chains are stored as physical groups in the mesh. If the request is added before mesh generation, the computation will be performed at the end of the meshing pipeline.

| Parameter | Type | Default |
|-----------|------|---------|
| `type` | `string` | `"Homology"` |
| `domainTags` | `number[]` | `[]` |
| `subdomainTags` | `number[]` | `[]` |
| `dims` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshAddHomologyRequest`</small>

### `addNodes`

```ts
gmsh.model.mesh.addNodes(dim: number, tag: number, nodeTags: number[], coord: number[], parametricCoord?: number[]): void
```

Add nodes classified on the model entity of dimension `dim' and tag `tag'. `nodeTags' contains the node tags (their unique, strictly positive identification numbers). `coord' is a vector of length 3 times the length of `nodeTags' that contains the x, y, z coordinates of the nodes, concatenated: [n1x, n1y, n1z, n2x, ...]. The optional `parametricCoord' vector contains the parametric coordinates of the nodes, if any. The length of `parametricCoord' can be 0 or `dim' times the length of `nodeTags'. If the `nodeTags' vector is empty, new tags are automatically assigned to the nodes.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `nodeTags` | `number[]` | *required* |
| `coord` | `number[]` | *required* |
| `parametricCoord` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshAddNodes`</small>

### `affineTransform`

```ts
gmsh.model.mesh.affineTransform(affineTransform: number[], dimTags?: number[]): void
```

Apply the affine transformation `affineTransform' (16 entries of a 4x4 matrix, by row; only the 12 first can be provided for convenience) to the coordinates of the nodes classified on the entities `dimTags', given as a vector of (dim, tag) pairs. If `dimTags' is empty, transform all the nodes in the mesh.

| Parameter | Type | Default |
|-----------|------|---------|
| `affineTransform` | `number[]` | *required* |
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshAffineTransform`</small>

### `classifySurfaces`

```ts
gmsh.model.mesh.classifySurfaces(angle: number, boundary?: boolean, forReparametrization?: boolean, curveAngle?: number, exportDiscrete?: boolean): void
```

Classify ("color") the surface mesh based on the angle threshold `angle' (in radians), and create new discrete surfaces, curves and points accordingly. If `boundary' is set, also create discrete curves on the boundary if the surface is open. If `forReparametrization' is set, create curves and surfaces that can be reparametrized using a single map. If `curveAngle' is less than Pi, also force curves to be split according to `curveAngle'. If `exportDiscrete' is set, clear any built-in CAD kernel entities and export the discrete entities in the built-in CAD kernel.

| Parameter | Type | Default |
|-----------|------|---------|
| `angle` | `number` | *required* |
| `boundary` | `boolean` | `true` |
| `forReparametrization` | `boolean` | `false` |
| `curveAngle` | `number` | `3.141592653589793` |
| `exportDiscrete` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshClassifySurfaces`</small>

### `clear`

```ts
gmsh.model.mesh.clear(dimTags?: number[]): void
```

Clear the mesh, i.e. delete all the nodes and elements, for the entities `dimTags', given as a vector of (dim, tag) pairs. If `dimTags' is empty, clear the whole mesh. Note that the mesh of an entity can only be cleared if this entity is not on the boundary of another entity with a non-empty mesh.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshClear`</small>

### `clearHomologyRequests`

```ts
gmsh.model.mesh.clearHomologyRequests(): void
```

Clear all (co)homology computation requests.

<small>Gmsh C symbol: `gmshModelMeshClearHomologyRequests`</small>

### `computeCrossField`

```ts
gmsh.model.mesh.computeCrossField(): { viewTags: number[] }
```

Compute a cross field for the current mesh. The function creates 3 views: the H function, the Theta function and cross directions. Return the tags of the views.

<small>Gmsh C symbol: `gmshModelMeshComputeCrossField`</small>

### `computeHomology`

```ts
gmsh.model.mesh.computeHomology(): { dimTags: number[] }
```

Perform the (co)homology computations requested by addHomologyRequest(). The newly created physical groups are returned in `dimTags' as a vector of (dim, tag) pairs.

<small>Gmsh C symbol: `gmshModelMeshComputeHomology`</small>

### `computeRenumbering`

```ts
gmsh.model.mesh.computeRenumbering(method?: string, elementTags?: number[]): { oldTags: number[]; newTags: number[] }
```

Compute a renumbering vector `newTags' corresponding to the input tags `oldTags' for a given list of element tags `elementTags'. If `elementTags' is empty, compute the renumbering on the full mesh. If `method' is equal to "RCMK", compute a node renumering with Reverse Cuthill McKee. If `method' is equal to "Hilbert", compute a node renumering along a Hilbert curve. If `method' is equal to "Metis", compute a node renumering using Metis. Element renumbering is not available yet.

| Parameter | Type | Default |
|-----------|------|---------|
| `method` | `string` | `"RCMK"` |
| `elementTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshComputeRenumbering`</small>

### `createEdges`

```ts
gmsh.model.mesh.createEdges(dimTags?: number[]): void
```

Create unique mesh edges for the entities `dimTags', given as a vector of (dim, tag) pairs.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshCreateEdges`</small>

### `createFaces`

```ts
gmsh.model.mesh.createFaces(dimTags?: number[]): void
```

Create unique mesh faces for the entities `dimTags', given as a vector of (dim, tag) pairs.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshCreateFaces`</small>

### `createGeometry`

```ts
gmsh.model.mesh.createGeometry(dimTags?: number[]): void
```

Create a geometry for the discrete entities `dimTags' (given as a vector of (dim, tag) pairs) represented solely by a mesh (without an underlying CAD description), i.e. create a parametrization for discrete curves and surfaces, assuming that each can be parametrized with a single map. If `dimTags' is empty, create a geometry for all the discrete entities.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshCreateGeometry`</small>

### `createOverlaps`

```ts
gmsh.model.mesh.createOverlaps(layers?: number, createBoundaries?: boolean): void
```

Generate node-based overlaps (of highest dimension) for all partitions, with a number of layers equal to `layers'. If `createBoundaries' is set, build the overlaps for the entities bounding the highest-dimensional entities (i.e. "boundary overlaps"), as well as the inner boundaries of the overlaps (i.e. "overlap boundaries").

| Parameter | Type | Default |
|-----------|------|---------|
| `layers` | `number` | `1` |
| `createBoundaries` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshCreateOverlaps`</small>

### `createTopology`

```ts
gmsh.model.mesh.createTopology(makeSimplyConnected?: boolean, exportDiscrete?: boolean): void
```

Create a boundary representation from the mesh if the model does not have one (e.g. when imported from mesh file formats with no BRep representation of the underlying model). If `makeSimplyConnected' is set, enforce simply connected discrete surfaces and volumes. If `exportDiscrete' is set, clear any built-in CAD kernel entities and export the discrete entities in the built-in CAD kernel.

| Parameter | Type | Default |
|-----------|------|---------|
| `makeSimplyConnected` | `boolean` | `true` |
| `exportDiscrete` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshCreateTopology`</small>

### `embed`

```ts
gmsh.model.mesh.embed(dim: number, tags: number[], inDim: number, inTag: number): void
```

Embed the model entities of dimension `dim' and tags `tags' in the (`inDim', `inTag') model entity. The dimension `dim' can 0, 1 or 2 and must be strictly smaller than `inDim', which must be either 2 or 3. The embedded entities should not intersect each other or be part of the boundary of the entity `inTag', whose mesh will conform to the mesh of the embedded entities. With the OpenCASCADE kernel, if the `fragment' operation is applied to entities of different dimensions, the lower dimensional entities will be automatically embedded in the higher dimensional entities if they are not on their boundary.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tags` | `number[]` | *required* |
| `inDim` | `number` | *required* |
| `inTag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshEmbed`</small>

### `generate`

```ts
gmsh.model.mesh.generate(dim?: number): void
```

Generate a mesh of the current model, up to dimension `dim' (0, 1, 2 or 3).

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | `3` |

<small>Gmsh C symbol: `gmshModelMeshGenerate`</small>

### `getAllEdges`

```ts
gmsh.model.mesh.getAllEdges(): { edgeTags: number[]; edgeNodes: number[] }
```

Get the global unique identifiers `edgeTags' and the nodes `edgeNodes' of the edges in the mesh. Mesh edges are created e.g. by `createEdges()', `getKeys()' or addEdges().

<small>Gmsh C symbol: `gmshModelMeshGetAllEdges`</small>

### `getAllFaces`

```ts
gmsh.model.mesh.getAllFaces(faceType: number): { faceTags: number[]; faceNodes: number[] }
```

Get the global unique identifiers `faceTags' and the nodes `faceNodes' of the faces of type `faceType' in the mesh. Mesh faces are created e.g. by `createFaces()', `getKeys()' or addFaces().

| Parameter | Type | Default |
|-----------|------|---------|
| `faceType` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetAllFaces`</small>

### `getBarycenters`

```ts
gmsh.model.mesh.getBarycenters(elementType: number, tag: number, fast: boolean, primary: boolean, task?: number, numTasks?: number): { barycenters: number[] }
```

Get the barycenters of all elements of type `elementType' classified on the entity of tag `tag'. If `primary' is set, only the primary nodes of the elements are taken into account for the barycenter calculation. If `fast' is set, the function returns the sum of the primary node coordinates (without normalizing by the number of nodes). If `tag' < 0, get the barycenters for all entities. If `numTasks' > 1, only compute and return the part of the data indexed by `task' (for C++ only; output vector must be preallocated).

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `tag` | `number` | *required* |
| `fast` | `boolean` | *required* |
| `primary` | `boolean` | *required* |
| `task` | `number` | `0` |
| `numTasks` | `number` | `1` |

<small>Gmsh C symbol: `gmshModelMeshGetBarycenters`</small>

### `getBasisFunctions`

```ts
gmsh.model.mesh.getBasisFunctions(elementType: number, localCoord: number[], functionSpaceType: string, wantedOrientations?: number[]): { numComponents: number; basisFunctions: number[]; numOrientations: number }
```

Get the basis functions of the element of type `elementType' at the evaluation points `localCoord' (given as concatenated u, v, w coordinates in the reference element [g1u, g1v, g1w, ..., gGu, gGv, gGw]), for the function space `functionSpaceType'. Currently supported function spaces include "Lagrange" and "GradLagrange" for isoparametric Lagrange basis functions and their gradient in the u, v, w coordinates of the reference element; "LagrangeN" and "GradLagrangeN", with N = 1, 2, ..., for N-th order Lagrange basis functions; "H1LegendreN" and "GradH1LegendreN", with N = 1, 2, ..., for N-th order hierarchical H1 Legendre functions; "HcurlLegendreN" and "CurlHcurlLegendreN", with N = 1, 2, ..., for N-th order curl-conforming basis functions. `numComponents' returns the number C of components of a basis function (e.g. 1 for scalar functions and 3 for vector functions). `basisFunctions' returns the value of the N basis functions at the evaluation points, i.e. [g1f1, g1f2, ..., g1fN, g2f1, ...] when C == 1 or [g1f1u, g1f1v, g1f1w, g1f2u, ..., g1fNw, g2f1u, ...] when C == 3. For basis functions that depend on the orientation of the elements, all values for the first orientation are returned first, followed by values for the second, etc. `numOrientations' returns the overall number of orientations. If the `wantedOrientations' vector is not empty, only return the values for the desired orientation indices.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `localCoord` | `number[]` | *required* |
| `functionSpaceType` | `string` | *required* |
| `wantedOrientations` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshGetBasisFunctions`</small>

### `getBasisFunctionsOrientation`

```ts
gmsh.model.mesh.getBasisFunctionsOrientation(elementType: number, functionSpaceType: string, tag?: number, task?: number, numTasks?: number): { basisFunctionsOrientation: number[] }
```

Get the orientation index of the elements of type `elementType' in the entity of tag `tag'. The arguments have the same meaning as in `getBasisFunctions'. `basisFunctionsOrientation' is a vector giving for each element the orientation index in the values returned by `getBasisFunctions'. For Lagrange basis functions the call is superfluous as it will return a vector of zeros. If `numTasks' > 1, only compute and return the part of the data indexed by `task' (for C++ only; output vector must be preallocated).

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `functionSpaceType` | `string` | *required* |
| `tag` | `number` | `-1` |
| `task` | `number` | `0` |
| `numTasks` | `number` | `1` |

<small>Gmsh C symbol: `gmshModelMeshGetBasisFunctionsOrientation`</small>

### `getBasisFunctionsOrientationForElement`

```ts
gmsh.model.mesh.getBasisFunctionsOrientationForElement(elementTag: number, functionSpaceType: string): { basisFunctionsOrientation: number }
```

Get the orientation of a single element `elementTag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementTag` | `number` | *required* |
| `functionSpaceType` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetBasisFunctionsOrientationForElement`</small>

### `getBoundaryOverlapParent`

```ts
gmsh.model.mesh.getBoundaryOverlapParent(dim: number, tag: number): { parentTag: number }
```

If the entity of dimension `dim' and tag `tag' is a boundary overlap, get the entity of dimension `dim+1' that created it. Sets `parentTag' to -1 on error.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetBoundaryOverlapParent`</small>

### `getDuplicateNodes`

```ts
gmsh.model.mesh.getDuplicateNodes(dimTags?: number[]): { tags: number[] }
```

Get the `tags' of any duplicate nodes in the mesh of the entities `dimTags', given as a vector of (dim, tag) pairs. If `dimTags' is empty, consider the whole mesh.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshGetDuplicateNodes`</small>

### `getEdges`

```ts
gmsh.model.mesh.getEdges(nodeTags: number[]): { edgeTags: number[]; edgeOrientations: number[] }
```

Get the global unique mesh edge identifiers `edgeTags' and orientations `edgeOrientation' for an input list of node tag pairs defining these edges, concatenated in the vector `nodeTags'. Mesh edges are created e.g. by `createEdges()', `getKeys()' or `addEdges()'. The reference positive orientation is n1 < n2, where n1 and n2 are the tags of the two edge nodes, which corresponds to the local orientation of edge-based basis functions as well.

| Parameter | Type | Default |
|-----------|------|---------|
| `nodeTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetEdges`</small>

### `getElement`

```ts
gmsh.model.mesh.getElement(elementTag: number): { elementType: number; nodeTags: number[]; dim: number; tag: number }
```

Get the type and node tags of the element with tag `elementTag', as well as the dimension `dim' and tag `tag' of the entity on which the element is classified. This function relies on an internal cache (a vector in case of dense element numbering, a map otherwise); for large meshes accessing elements in bulk is often preferable.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementTag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetElement`</small>

### `getElementByCoordinates`

```ts
gmsh.model.mesh.getElementByCoordinates(x: number, y: number, z: number, dim?: number, strict?: boolean): { elementTag: number; elementType: number; nodeTags: number[]; u: number; v: number; w: number }
```

Search the mesh for an element located at coordinates (`x', `y', `z'). This function performs a search in a spatial octree. If an element is found, return its tag, type and node tags, as well as the local coordinates (`u', `v', `w') within the reference element corresponding to search location. If `dim' is >= 0, only search for elements of the given dimension. If `strict' is not set, use a tolerance to find elements near the search location.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `dim` | `number` | `-1` |
| `strict` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelMeshGetElementByCoordinates`</small>

### `getElementEdgeNodes`

```ts
gmsh.model.mesh.getElementEdgeNodes(elementType: number, tag?: number, primary?: boolean, task?: number, numTasks?: number): { nodeTags: number[] }
```

Get the nodes on the edges of all elements of type `elementType' classified on the entity of tag `tag'. `nodeTags' contains the node tags of the edges for all the elements: [e1a1n1, e1a1n2, e1a2n1, ...]. Data is returned by element, with elements in the same order as in `getElements' and `getElementsByType'. If `primary' is set, only the primary (begin/end) nodes of the edges are returned. If `tag' < 0, get the edge nodes for all entities. If `numTasks' > 1, only compute and return the part of the data indexed by `task' (for C++ only; output vector must be preallocated).

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `tag` | `number` | `-1` |
| `primary` | `boolean` | `false` |
| `task` | `number` | `0` |
| `numTasks` | `number` | `1` |

<small>Gmsh C symbol: `gmshModelMeshGetElementEdgeNodes`</small>

### `getElementFaceNodes`

```ts
gmsh.model.mesh.getElementFaceNodes(elementType: number, faceType: number, tag?: number, primary?: boolean, task?: number, numTasks?: number): { nodeTags: number[] }
```

Get the nodes on the faces of type `faceType' (3 for triangular faces, 4 for quadrangular faces) of all elements of type `elementType' classified on the entity of tag `tag'. `nodeTags' contains the node tags of the faces for all elements: [e1f1n1, ..., e1f1nFaceType, e1f2n1, ...]. Data is returned by element, with elements in the same order as in `getElements' and `getElementsByType'. If `primary' is set, only the primary (corner) nodes of the faces are returned. If `tag' < 0, get the face nodes for all entities. If `numTasks' > 1, only compute and return the part of the data indexed by `task' (for C++ only; output vector must be preallocated).

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `faceType` | `number` | *required* |
| `tag` | `number` | `-1` |
| `primary` | `boolean` | `false` |
| `task` | `number` | `0` |
| `numTasks` | `number` | `1` |

<small>Gmsh C symbol: `gmshModelMeshGetElementFaceNodes`</small>

### `getElementProperties`

```ts
gmsh.model.mesh.getElementProperties(elementType: number): { elementName: string; dim: number; order: number; numNodes: number; localNodeCoord: number[]; numPrimaryNodes: number }
```

Get the properties of an element of type `elementType': its name (`elementName'), dimension (`dim'), order (`order'), number of nodes (`numNodes'), local coordinates of the nodes in the reference element (`localNodeCoord' vector, of length `dim' times `numNodes') and number of primary (first order) nodes (`numPrimaryNodes').

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetElementProperties`</small>

### `getElementQualities`

```ts
gmsh.model.mesh.getElementQualities(elementTags: number[], qualityName?: string, task?: number, numTasks?: number): { elementsQuality: number[] }
```

Get the quality `elementQualities' of the elements with tags `elementTags'. `qualityType' is the requested quality measure: "minDetJac" and "maxDetJac" for the adaptively computed minimal and maximal Jacobian determinant, "minSJ" for the sampled minimal scaled jacobien, "minSICN" for the sampled minimal signed inverted condition number, "minSIGE" for the sampled signed inverted gradient error, "gamma" for the ratio of the inscribed to circumcribed sphere radius, "innerRadius" for the inner radius, "outerRadius" for the outerRadius, "minIsotropy" for the minimum isotropy measure, "angleShape" for the angle shape measure, "minEdge" for the minimum straight edge length, "maxEdge" for the maximum straight edge length, "volume" for the volume. If `numTasks' > 1, only compute and return the part of the data indexed by `task' (for C++ only; output vector must be preallocated).

| Parameter | Type | Default |
|-----------|------|---------|
| `elementTags` | `number[]` | *required* |
| `qualityName` | `string` | `"minSICN"` |
| `task` | `number` | `0` |
| `numTasks` | `number` | `1` |

<small>Gmsh C symbol: `gmshModelMeshGetElementQualities`</small>

### `getElementType`

```ts
gmsh.model.mesh.getElementType(familyName: string, order: number, serendip?: boolean): number
```

Return an element type given its family name `familyName' ("Point", "Line", "Triangle", "Quadrangle", "Tetrahedron", "Pyramid", "Prism", "Hexahedron") and polynomial order `order'. If `serendip' is true, return the corresponding serendip element type (element without interior nodes).

| Parameter | Type | Default |
|-----------|------|---------|
| `familyName` | `string` | *required* |
| `order` | `number` | *required* |
| `serendip` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelMeshGetElementType`</small>

### `getElementTypes`

```ts
gmsh.model.mesh.getElementTypes(dim?: number, tag?: number): { elementTypes: number[] }
```

Get the types of elements in the entity of dimension `dim' and tag `tag'. If `tag' < 0, get the types for all entities of dimension `dim'. If `dim' and `tag' are negative, get all the types in the mesh.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | `-1` |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelMeshGetElementTypes`</small>

### `getElements`

```ts
gmsh.model.mesh.getElements(dim?: number, tag?: number): { elementTypes: number[]; elementTags: number[][]; nodeTags: number[][] }
```

Get the elements classified on the entity of dimension `dim' and tag `tag'. If `tag' < 0, get the elements for all entities of dimension `dim'. If `dim' and `tag' are negative, get all the elements in the mesh. `elementTypes' contains the MSH types of the elements (e.g. `2' for 3-node triangles: see `getElementProperties' to obtain the properties for a given element type). `elementTags' is a vector of the same length as `elementTypes'; each entry is a vector containing the tags (unique, strictly positive identifiers) of the elements of the corresponding type. `nodeTags' is also a vector of the same length as `elementTypes'; each entry is a vector of length equal to the number of elements of the given type times the number N of nodes for this type of element, that contains the node tags of all the elements of the given type, concatenated: [e1n1, e1n2, ..., e1nN, e2n1, ...].

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | `-1` |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelMeshGetElements`</small>

### `getElementsByCoordinates`

```ts
gmsh.model.mesh.getElementsByCoordinates(x: number, y: number, z: number, dim?: number, strict?: boolean): { elementTags: number[] }
```

Search the mesh for element(s) located at coordinates (`x', `y', `z'). This function performs a search in a spatial octree. Return the tags of all found elements in `elementTags'. Additional information about the elements can be accessed through `getElement' and `getLocalCoordinatesInElement'. If `dim' is >= 0, only search for elements of the given dimension. If `strict' is not set, use a tolerance to find elements near the search location.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `dim` | `number` | `-1` |
| `strict` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelMeshGetElementsByCoordinates`</small>

### `getElementsByType`

```ts
gmsh.model.mesh.getElementsByType(elementType: number, tag?: number, task?: number, numTasks?: number): { elementTags: number[]; nodeTags: number[] }
```

Get the elements of type `elementType' classified on the entity of tag `tag'. If `tag' < 0, get the elements for all entities. `elementTags' is a vector containing the tags (unique, strictly positive identifiers) of the elements of the corresponding type. `nodeTags' is a vector of length equal to the number of elements of the given type times the number N of nodes for this type of element, that contains the node tags of all the elements of the given type, concatenated: [e1n1, e1n2, ..., e1nN, e2n1, ...]. If `numTasks' > 1, only compute and return the part of the data indexed by `task' (for C++ only; output vectors must be preallocated).

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `tag` | `number` | `-1` |
| `task` | `number` | `0` |
| `numTasks` | `number` | `1` |

<small>Gmsh C symbol: `gmshModelMeshGetElementsByType`</small>

### `getEmbedded`

```ts
gmsh.model.mesh.getEmbedded(dim: number, tag: number): { dimTags: number[] }
```

Get the entities (if any) embedded in the model entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetEmbedded`</small>

### `getFaces`

```ts
gmsh.model.mesh.getFaces(faceType: number, nodeTags: number[]): { faceTags: number[]; faceOrientations: number[] }
```

Get the global unique mesh face identifiers `faceTags' and orientations `faceOrientations' for an input list of a multiple of three (if `faceType' == 3) or four (if `faceType' == 4) node tags defining these faces, concatenated in the vector `nodeTags'. Mesh faces are created e.g. by `createFaces()', `getKeys()' or `addFaces()'.

| Parameter | Type | Default |
|-----------|------|---------|
| `faceType` | `number` | *required* |
| `nodeTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetFaces`</small>

### `getGhostElements`

```ts
gmsh.model.mesh.getGhostElements(dim: number, tag: number): { elementTags: number[]; partitions: number[] }
```

Get the ghost elements `elementTags' and their associated `partitions' stored in the ghost entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetGhostElements`</small>

### `getIntegrationPoints`

```ts
gmsh.model.mesh.getIntegrationPoints(elementType: number, integrationType: string): { localCoord: number[]; weights: number[] }
```

Get the numerical quadrature information for the given element type `elementType' and integration rule `integrationType', where `integrationType' concatenates the integration rule family name with the desired order (e.g. "Gauss4" for a quadrature suited for integrating 4th order polynomials). The "CompositeGauss" family uses tensor-product rules based the 1D Gauss-Legendre rule; the "Gauss" family uses an economic scheme when available (i.e. with a minimal number of points), and falls back to "CompositeGauss" otherwise. Note that integration points for the "Gauss" family can fall outside of the reference element for high-order rules. `localCoord' contains the u, v, w coordinates of the G integration points in the reference element: [g1u, g1v, g1w, ..., gGu, gGv, gGw]. `weights' contains the associated weights: [g1q, ..., gGq].

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `integrationType` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetIntegrationPoints`</small>

### `getJacobian`

```ts
gmsh.model.mesh.getJacobian(elementTag: number, localCoord: number[]): { jacobians: number[]; determinants: number[]; coord: number[] }
```

Get the Jacobian for a single element `elementTag', at the G evaluation points `localCoord' given as concatenated u, v, w coordinates in the reference element [g1u, g1v, g1w, ..., gGu, gGv, gGw]. `jacobians' contains the 9 entries of the 3x3 Jacobian matrix at each evaluation point. The matrix is returned by column: [e1g1Jxu, e1g1Jyu, e1g1Jzu, e1g1Jxv, ..., e1g1Jzw, e1g2Jxu, ..., e1gGJzw, e2g1Jxu, ...], with Jxu = dx/du, Jyu = dy/du, etc. `determinants' contains the determinant of the Jacobian matrix at each evaluation point. `coord' contains the x, y, z coordinates of the evaluation points. This function relies on an internal cache (a vector in case of dense element numbering, a map otherwise); for large meshes accessing Jacobians in bulk is often preferable.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementTag` | `number` | *required* |
| `localCoord` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetJacobian`</small>

### `getJacobians`

```ts
gmsh.model.mesh.getJacobians(elementType: number, localCoord: number[], tag?: number, task?: number, numTasks?: number): { jacobians: number[]; determinants: number[]; coord: number[] }
```

Get the Jacobians of all the elements of type `elementType' classified on the entity of tag `tag', at the G evaluation points `localCoord' given as concatenated u, v, w coordinates in the reference element [g1u, g1v, g1w, ..., gGu, gGv, gGw]. Data is returned by element, with elements in the same order as in `getElements' and `getElementsByType'. `jacobians' contains for each element the 9 entries of the 3x3 Jacobian matrix at each evaluation point. The matrix is returned by column: [e1g1Jxu, e1g1Jyu, e1g1Jzu, e1g1Jxv, ..., e1g1Jzw, e1g2Jxu, ..., e1gGJzw, e2g1Jxu, ...], with Jxu = dx/du, Jyu = dy/du, etc. `determinants' contains for each element the determinant of the Jacobian matrix at each evaluation point: [e1g1, e1g2, ... e1gG, e2g1, ...]. `coord' contains for each element the x, y, z coordinates of the evaluation points. If `tag' < 0, get the Jacobian data for all entities. If `numTasks' > 1, only compute and return the part of the data indexed by `task' (for C++ only; output vectors must be preallocated).

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `localCoord` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `task` | `number` | `0` |
| `numTasks` | `number` | `1` |

<small>Gmsh C symbol: `gmshModelMeshGetJacobians`</small>

### `getKeys`

```ts
gmsh.model.mesh.getKeys(elementType: number, functionSpaceType: string, tag?: number, returnCoord?: boolean): { typeKeys: number[]; entityKeys: number[]; coord: number[] }
```

Generate the pair of keys for the elements of type `elementType' in the entity of tag `tag', for the `functionSpaceType' function space. Each pair (`typeKey', `entityKey') uniquely identifies a basis function in the function space. If `returnCoord' is set, the `coord' vector contains the x, y, z coordinates locating basis functions for sorting purposes. Warning: this is an experimental feature and will probably change in a future release.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `functionSpaceType` | `string` | *required* |
| `tag` | `number` | `-1` |
| `returnCoord` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshGetKeys`</small>

### `getKeysForElement`

```ts
gmsh.model.mesh.getKeysForElement(elementTag: number, functionSpaceType: string, returnCoord?: boolean): { typeKeys: number[]; entityKeys: number[]; coord: number[] }
```

Get the pair of keys for a single element `elementTag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementTag` | `number` | *required* |
| `functionSpaceType` | `string` | *required* |
| `returnCoord` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshGetKeysForElement`</small>

### `getKeysInformation`

```ts
gmsh.model.mesh.getKeysInformation(typeKeys: number[], entityKeys: number[], elementType: number, functionSpaceType: string): { infoKeys: number[] }
```

Get information about the pair of `keys'. `infoKeys' returns information about the functions associated with the pairs (`typeKeys', `entityKey'). `infoKeys[0].first' describes the type of function (0 for vertex function, 1 for edge function, 2 for face function and 3 for bubble function). `infoKeys[0].second' gives the order of the function associated with the key. Warning: this is an experimental feature and will probably change in a future release.

| Parameter | Type | Default |
|-----------|------|---------|
| `typeKeys` | `number[]` | *required* |
| `entityKeys` | `number[]` | *required* |
| `elementType` | `number` | *required* |
| `functionSpaceType` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetKeysInformation`</small>

### `getLastEntityError`

```ts
gmsh.model.mesh.getLastEntityError(): { dimTags: number[] }
```

Get the last entities `dimTags' (as a vector of (dim, tag) pairs) where a meshing error occurred. Currently only populated by the new 3D meshing algorithms.

<small>Gmsh C symbol: `gmshModelMeshGetLastEntityError`</small>

### `getLastNodeError`

```ts
gmsh.model.mesh.getLastNodeError(): { nodeTags: number[] }
```

Get the last node tags `nodeTags' where a meshing error occurred. Currently only populated by the new 3D meshing algorithms.

<small>Gmsh C symbol: `gmshModelMeshGetLastNodeError`</small>

### `getLocalCoordinatesInElement`

```ts
gmsh.model.mesh.getLocalCoordinatesInElement(elementTag: number, x: number, y: number, z: number): { u: number; v: number; w: number }
```

Return the local coordinates (`u', `v', `w') within the element `elementTag' corresponding to the model coordinates (`x', `y', `z'). This function relies on an internal cache (a vector in case of dense element numbering, a map otherwise); for large meshes accessing elements in bulk is often preferable.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementTag` | `number` | *required* |
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetLocalCoordinatesInElement`</small>

### `getMaxElementTag`

```ts
gmsh.model.mesh.getMaxElementTag(): { maxTag: number }
```

Get the maximum tag `maxTag' of an element in the mesh.

<small>Gmsh C symbol: `gmshModelMeshGetMaxElementTag`</small>

### `getMaxNodeTag`

```ts
gmsh.model.mesh.getMaxNodeTag(): { maxTag: number }
```

Get the maximum tag `maxTag' of a node in the mesh.

<small>Gmsh C symbol: `gmshModelMeshGetMaxNodeTag`</small>

### `getNode`

```ts
gmsh.model.mesh.getNode(nodeTag: number): { coord: number[]; parametricCoord: number[]; dim: number; tag: number }
```

Get the coordinates and the parametric coordinates (if any) of the node with tag `tag', as well as the dimension `dim' and tag `tag' of the entity on which the node is classified. This function relies on an internal cache (a vector in case of dense node numbering, a map otherwise); for large meshes accessing nodes in bulk is often preferable.

| Parameter | Type | Default |
|-----------|------|---------|
| `nodeTag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetNode`</small>

### `getNodes`

```ts
gmsh.model.mesh.getNodes(dim?: number, tag?: number, includeBoundary?: boolean, returnParametricCoord?: boolean): { nodeTags: number[]; coord: number[]; parametricCoord: number[] }
```

Get the nodes classified on the entity of dimension `dim' and tag `tag'. If `tag' < 0, get the nodes for all entities of dimension `dim'. If `dim' and `tag' are negative, get all the nodes in the mesh. `nodeTags' contains the node tags (their unique, strictly positive identification numbers). `coord' is a vector of length 3 times the length of `nodeTags' that contains the x, y, z coordinates of the nodes, concatenated: [n1x, n1y, n1z, n2x, ...]. If `dim' >= 0 and `returnParamtricCoord' is set, `parametricCoord' contains the parametric coordinates ([u1, u2, ...] or [u1, v1, u2, ...]) of the nodes, if available. The length of `parametricCoord' can be 0 or `dim' times the length of `nodeTags'. If `includeBoundary' is set, also return the nodes classified on the boundary of the entity (which will be reparametrized on the entity if `dim' >= 0 in order to compute their parametric coordinates).

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | `-1` |
| `tag` | `number` | `-1` |
| `includeBoundary` | `boolean` | `false` |
| `returnParametricCoord` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshGetNodes`</small>

### `getNodesByElementType`

```ts
gmsh.model.mesh.getNodesByElementType(elementType: number, tag?: number, returnParametricCoord?: boolean): { nodeTags: number[]; coord: number[]; parametricCoord: number[] }
```

Get the nodes classified on the entity of tag `tag', for all the elements of type `elementType'. The other arguments are treated as in `getNodes'.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `tag` | `number` | `-1` |
| `returnParametricCoord` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshGetNodesByElementType`</small>

### `getNodesForPhysicalGroup`

```ts
gmsh.model.mesh.getNodesForPhysicalGroup(dim: number, tag: number): { nodeTags: number[]; coord: number[] }
```

Get the nodes from all the elements belonging to the physical group of dimension `dim' and tag `tag'. `nodeTags' contains the node tags; `coord' is a vector of length 3 times the length of `nodeTags' that contains the x, y, z coordinates of the nodes, concatenated: [n1x, n1y, n1z, n2x, ...].

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetNodesForPhysicalGroup`</small>

### `getNumberOfKeys`

```ts
gmsh.model.mesh.getNumberOfKeys(elementType: number, functionSpaceType: string): number
```

Get the number of keys by elements of type `elementType' for function space named `functionSpaceType'.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `functionSpaceType` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetNumberOfKeys`</small>

### `getNumberOfOrientations`

```ts
gmsh.model.mesh.getNumberOfOrientations(elementType: number, functionSpaceType: string): number
```

Get the number of possible orientations for elements of type `elementType' and function space named `functionSpaceType'.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `functionSpaceType` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetNumberOfOrientations`</small>

### `getOverlapBoundary`

```ts
gmsh.model.mesh.getOverlapBoundary(dim: number, tag: number, partition: number): { entityTags: number[] }
```

Get the tags of the entities making up the overlap boundary of partition `partition' inside the (non-partitioned) entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `partition` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetOverlapBoundary`</small>

### `getPartitionEntities`

```ts
gmsh.model.mesh.getPartitionEntities(dim: number, tag: number, partition: number): { entityTags: number[]; overlapEntities: number[] }
```

Get the tags of the partitioned entities of dimension `dim' whose parent has dimension `dim' and tag `tag', and which belong to the partition `partition'. If overlaps are present, fill `overlapEntities' with the tags of the entities that are in the overlap of the partition. Works for entities of the same dimension as the model as well as for entities one dimension below (boundary overlaps).

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `partition` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetPartitionEntities`</small>

### `getPeriodic`

```ts
gmsh.model.mesh.getPeriodic(dim: number, tags: number[]): { tagMaster: number[] }
```

Get master entities `tagsMaster' for the entities of dimension `dim' and tags `tags'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetPeriodic`</small>

### `getPeriodicKeys`

```ts
gmsh.model.mesh.getPeriodicKeys(elementType: number, functionSpaceType: string, tag: number, returnCoord?: boolean): { tagMaster: number; typeKeys: number[]; typeKeysMaster: number[]; entityKeys: number[]; entityKeysMaster: number[]; coord: number[]; coordMaster: number[] }
```

Get the master entity `tagMaster' and the key pairs (`typeKeyMaster', `entityKeyMaster') corresponding to the entity `tag' and the key pairs (`typeKey', `entityKey') for the elements of type `elementType' and function space type `functionSpaceType'. If `returnCoord' is set, the `coord' and `coordMaster' vectors contain the x, y, z coordinates locating basis functions for sorting purposes.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `functionSpaceType` | `string` | *required* |
| `tag` | `number` | *required* |
| `returnCoord` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshGetPeriodicKeys`</small>

### `getPeriodicNodes`

```ts
gmsh.model.mesh.getPeriodicNodes(dim: number, tag: number, includeHighOrderNodes?: boolean): { tagMaster: number; nodeTags: number[]; nodeTagsMaster: number[]; affineTransform: number[] }
```

Get the master entity `tagMaster', the node tags `nodeTags' and their corresponding master node tags `nodeTagsMaster', and the affine transform `affineTransform' for the entity of dimension `dim' and tag `tag'. If `includeHighOrderNodes' is set, include high-order nodes in the returned data.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `includeHighOrderNodes` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelMeshGetPeriodicNodes`</small>

### `getSizes`

```ts
gmsh.model.mesh.getSizes(dimTags: number[]): { sizes: number[] }
```

Get the mesh size constraints (if any) associated with the model entities `dimTags', given as a vector of (dim, tag) pairs. A zero entry in the output `sizes' vector indicates that no size constraint is specified on the corresponding entity.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetSizes`</small>

### `getVisibility`

```ts
gmsh.model.mesh.getVisibility(elementTags: number[]): { values: number[] }
```

Get the visibility of the elements of tags `elementTags'.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshGetVisibility`</small>

### `importStl`

```ts
gmsh.model.mesh.importStl(): void
```

Import the model STL representation (if available) as the current mesh.

<small>Gmsh C symbol: `gmshModelMeshImportStl`</small>

### `optimize`

```ts
gmsh.model.mesh.optimize(method?: string, force?: boolean, niter?: number, dimTags?: number[], quality?: number): void
```

Optimize the mesh of the current model using `method' (empty for default tetrahedral mesh optimizer, "Netgen" for Netgen optimizer, "HighOrder" for direct high-order mesh optimizer, "HighOrderElastic" for high-order elastic smoother, "HighOrderFastCurving" for fast curving algorithm, "Laplace2D" for Laplace smoothing, "Relocate2D" and "Relocate3D" for node relocation, "QuadQuasiStructured" for quad mesh optimization, "UntangleMeshGeometry" for untangling, "HXT" for tetrahedral optimisation). If `force' is set apply the optimization also to discrete entities. If `dimTags' (given as a vector of (dim, tag) pairs) is given, only apply the optimizer to the given entities. For HXT optimizer, the `quality' argument should be specified

| Parameter | Type | Default |
|-----------|------|---------|
| `method` | `string` | `""` |
| `force` | `boolean` | `false` |
| `niter` | `number` | `1` |
| `dimTags` | `number[]` | `[]` |
| `quality` | `number` | `0.0` |

<small>Gmsh C symbol: `gmshModelMeshOptimize`</small>

### `partition`

```ts
gmsh.model.mesh.partition(numPart: number, elementTags?: number[], partitions?: number[]): void
```

Partition the mesh of the current model into `numPart' partitions. Optionally, `elementTags' and `partitions' can be provided to specify the partition of each element explicitly.

| Parameter | Type | Default |
|-----------|------|---------|
| `numPart` | `number` | *required* |
| `elementTags` | `number[]` | `[]` |
| `partitions` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshPartition`</small>

### `preallocateBarycenters`

```ts
gmsh.model.mesh.preallocateBarycenters(elementType: number, tag?: number): { barycenters: number[] }
```

Preallocate data before calling `getBarycenters' with `numTasks' > 1. For C++ only.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelMeshPreallocateBarycenters`</small>

### `preallocateBasisFunctionsOrientation`

```ts
gmsh.model.mesh.preallocateBasisFunctionsOrientation(elementType: number, tag?: number): { basisFunctionsOrientation: number[] }
```

Preallocate data before calling `getBasisFunctionsOrientation' with `numTasks' > 1. For C++ only.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelMeshPreallocateBasisFunctionsOrientation`</small>

### `preallocateElementsByType`

```ts
gmsh.model.mesh.preallocateElementsByType(elementType: number, elementTag: boolean, nodeTag: boolean, tag?: number): { elementTags: number[]; nodeTags: number[] }
```

Preallocate data before calling `getElementsByType' with `numTasks' > 1. For C++ only.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `elementTag` | `boolean` | *required* |
| `nodeTag` | `boolean` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelMeshPreallocateElementsByType`</small>

### `preallocateJacobians`

```ts
gmsh.model.mesh.preallocateJacobians(elementType: number, numEvaluationPoints: number, allocateJacobians: boolean, allocateDeterminants: boolean, allocateCoord: boolean, tag?: number): { jacobians: number[]; determinants: number[]; coord: number[] }
```

Preallocate data before calling `getJacobians' with `numTasks' > 1. For C++ only.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `numEvaluationPoints` | `number` | *required* |
| `allocateJacobians` | `boolean` | *required* |
| `allocateDeterminants` | `boolean` | *required* |
| `allocateCoord` | `boolean` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelMeshPreallocateJacobians`</small>

### `rebuildElementCache`

```ts
gmsh.model.mesh.rebuildElementCache(onlyIfNecessary?: boolean): void
```

Rebuild the element cache.

| Parameter | Type | Default |
|-----------|------|---------|
| `onlyIfNecessary` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshRebuildElementCache`</small>

### `rebuildNodeCache`

```ts
gmsh.model.mesh.rebuildNodeCache(onlyIfNecessary?: boolean): void
```

Rebuild the node cache.

| Parameter | Type | Default |
|-----------|------|---------|
| `onlyIfNecessary` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshRebuildNodeCache`</small>

### `reclassifyNodes`

```ts
gmsh.model.mesh.reclassifyNodes(): void
```

Reclassify all nodes on their associated model entity, based on the elements. Can be used when importing nodes in bulk (e.g. by associating them all to a single volume), to reclassify them correctly on model surfaces, curves, etc. after the elements have been set.

<small>Gmsh C symbol: `gmshModelMeshReclassifyNodes`</small>

### `recombine`

```ts
gmsh.model.mesh.recombine(): void
```

Recombine the mesh of the current model.

<small>Gmsh C symbol: `gmshModelMeshRecombine`</small>

### `refine`

```ts
gmsh.model.mesh.refine(): void
```

Refine the mesh of the current model by uniformly splitting the elements. This resets any high-order elements to order 1.

<small>Gmsh C symbol: `gmshModelMeshRefine`</small>

### `relocateNodes`

```ts
gmsh.model.mesh.relocateNodes(dim?: number, tag?: number, min?: number[], max?: number[]): void
```

Relocate the nodes classified on the entity of dimension `dim' and tag `tag' using their parametric coordinates. If `tag' < 0, relocate the nodes for all entities of dimension `dim'. If `dim' and `tag' are negative, relocate all the nodes in the mesh. Optional `min' and `max' vectors (of length == `dim') can be provided to linearly rescale each parametric coordinate in the new parameter range, based on the provided one.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | `-1` |
| `tag` | `number` | `-1` |
| `min` | `number[]` | `[]` |
| `max` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshRelocateNodes`</small>

### `removeConstraints`

```ts
gmsh.model.mesh.removeConstraints(dimTags?: number[]): void
```

Remove all meshing constraints from the model entities `dimTags', given as a vector of (dim, tag) pairs. If `dimTags' is empty, remove all constraings.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshRemoveConstraints`</small>

### `removeDuplicateElements`

```ts
gmsh.model.mesh.removeDuplicateElements(dimTags?: number[]): void
```

Remove duplicate elements (defined by the same nodes, in the same entity) in the mesh of the entities `dimTags', given as a vector of (dim, tag) pairs. If `dimTags' is empty, consider the whole mesh.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshRemoveDuplicateElements`</small>

### `removeDuplicateNodes`

```ts
gmsh.model.mesh.removeDuplicateNodes(dimTags?: number[]): void
```

Remove duplicate nodes in the mesh of the entities `dimTags', given as a vector of (dim, tag) pairs. If `dimTags' is empty, consider the whole mesh.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshRemoveDuplicateNodes`</small>

### `removeElements`

```ts
gmsh.model.mesh.removeElements(dim: number, tag: number, elementTags?: number[]): void
```

Remove the elements with tags `elementTags' from the entity of dimension `dim' and tag `tag'. If `elementTags' is empty, remove all the elements classified on the entity. To get consistent node classification on model entities, `reclassifyNodes()' should be called afterwards.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `elementTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshRemoveElements`</small>

### `removeEmbedded`

```ts
gmsh.model.mesh.removeEmbedded(dimTags: number[], dim?: number): void
```

Remove embedded entities from the model entities `dimTags', given as a vector of (dim, tag) pairs. if `dim' is >= 0, only remove embedded entities of the given dimension (e.g. embedded points if `dim' == 0).

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `dim` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelMeshRemoveEmbedded`</small>

### `removeSizeCallback`

```ts
gmsh.model.mesh.removeSizeCallback(): void
```

Remove the mesh size callback from the current model.

<small>Gmsh C symbol: `gmshModelMeshRemoveSizeCallback`</small>

### `renumberElements`

```ts
gmsh.model.mesh.renumberElements(oldTags?: number[], newTags?: number[]): void
```

Renumber the element tags in a continuous sequence. If no explicit renumbering is provided through the `oldTags' and `newTags' vectors, renumber the elements in a continuous sequence, taking into account the subset of elements to be saved later on if the option "Mesh.SaveAll" is not set.

| Parameter | Type | Default |
|-----------|------|---------|
| `oldTags` | `number[]` | `[]` |
| `newTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshRenumberElements`</small>

### `renumberNodes`

```ts
gmsh.model.mesh.renumberNodes(oldTags?: number[], newTags?: number[]): void
```

Renumber the node tags. If no explicit renumbering is provided through the `oldTags' and `newTags' vectors, renumber the nodes in a continuous sequence, taking into account the subset of elements to be saved later on if the option "Mesh.SaveAll" is not set.

| Parameter | Type | Default |
|-----------|------|---------|
| `oldTags` | `number[]` | `[]` |
| `newTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshRenumberNodes`</small>

### `reorderElements`

```ts
gmsh.model.mesh.reorderElements(elementType: number, tag: number, ordering: number[]): void
```

Reorder the elements of type `elementType' classified on the entity of tag `tag' according to the `ordering' vector.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementType` | `number` | *required* |
| `tag` | `number` | *required* |
| `ordering` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshReorderElements`</small>

### `reverse`

```ts
gmsh.model.mesh.reverse(dimTags?: number[]): void
```

Reverse the orientation of the elements in the entities `dimTags', given as a vector of (dim, tag) pairs. If `dimTags' is empty, reverse the orientation of the elements in the whole mesh.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshReverse`</small>

### `reverseElements`

```ts
gmsh.model.mesh.reverseElements(elementTags: number[]): void
```

Reverse the orientation of the elements with tags `elementTags'.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshReverseElements`</small>

### `setAlgorithm`

```ts
gmsh.model.mesh.setAlgorithm(dim: number, tag: number, val: number): void
```

Set the meshing algorithm on the model entity of dimension `dim' and tag `tag'. Supported values are those of the `Mesh.Algorithm' option, as listed in the Gmsh reference manual. Currently only supported for `dim' == 2.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `val` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetAlgorithm`</small>

### `setCompound`

```ts
gmsh.model.mesh.setCompound(dim: number, tags: number[]): void
```

Set a compound meshing constraint on the model entities of dimension `dim' and tags `tags'. During meshing, compound entities are treated as a single discrete entity, which is automatically reparametrized.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetCompound`</small>

### `setNode`

```ts
gmsh.model.mesh.setNode(nodeTag: number, coord: number[], parametricCoord: number[]): void
```

Set the coordinates and the parametric coordinates (if any) of the node with tag `tag'. This function relies on an internal cache (a vector in case of dense node numbering, a map otherwise); for large meshes accessing nodes in bulk is often preferable.

| Parameter | Type | Default |
|-----------|------|---------|
| `nodeTag` | `number` | *required* |
| `coord` | `number[]` | *required* |
| `parametricCoord` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetNode`</small>

### `setOrder`

```ts
gmsh.model.mesh.setOrder(order: number): void
```

Change the order of the elements in the mesh of the current model to `order'.

| Parameter | Type | Default |
|-----------|------|---------|
| `order` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetOrder`</small>

### `setOutwardOrientation`

```ts
gmsh.model.mesh.setOutwardOrientation(tag: number): void
```

Set meshing constraints on the bounding surfaces of the volume of tag `tag' so that all surfaces are oriented with outward pointing normals; and if a mesh already exists, reorient it. Currently only available with the OpenCASCADE kernel, as it relies on the STL triangulation.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetOutwardOrientation`</small>

### `setPeriodic`

```ts
gmsh.model.mesh.setPeriodic(dim: number, tags: number[], tagsMaster: number[], affineTransform: number[]): void
```

Set the meshes of the entities of dimension `dim' and tag `tags' as periodic copies of the meshes of entities `tagsMaster', using the affine transformation specified in `affineTransformation' (16 entries of a 4x4 matrix, by row). If used after meshing, generate the periodic node correspondence information assuming the meshes of entities `tags' effectively match the meshes of entities `tagsMaster' (useful for structured and extruded meshes). Currently only available for @code{dim} == 1 and @code{dim} == 2.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tags` | `number[]` | *required* |
| `tagsMaster` | `number[]` | *required* |
| `affineTransform` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetPeriodic`</small>

### `setRecombine`

```ts
gmsh.model.mesh.setRecombine(dim: number, tag: number, angle?: number): void
```

Set a recombination meshing constraint on the model entity of dimension `dim' and tag `tag'. Currently only entities of dimension 2 (to recombine triangles into quadrangles) are supported; `angle' specifies the threshold angle for the simple recombination algorithm..

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `angle` | `number` | `45.0` |

<small>Gmsh C symbol: `gmshModelMeshSetRecombine`</small>

### `setReverse`

```ts
gmsh.model.mesh.setReverse(dim: number, tag: number, val?: boolean): void
```

Set a reverse meshing constraint on the model entity of dimension `dim' and tag `tag'. If `val' is true, the mesh orientation will be reversed with respect to the natural mesh orientation (i.e. the orientation consistent with the orientation of the geometry). If `val' is false, the mesh is left as-is.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `val` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshSetReverse`</small>

### `setSize`

```ts
gmsh.model.mesh.setSize(dimTags: number[], size: number): void
```

Set a mesh size constraint on the model entities `dimTags', given as a vector of (dim, tag) pairs. Currently only entities of dimension 0 (points) are handled.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `size` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetSize`</small>

### `setSizeAtParametricPoints`

```ts
gmsh.model.mesh.setSizeAtParametricPoints(dim: number, tag: number, parametricCoord: number[], sizes: number[]): void
```

Set mesh size constraints at the given parametric points `parametricCoord' on the model entity of dimension `dim' and tag `tag'. Currently only entities of dimension 1 (lines) are handled.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `parametricCoord` | `number[]` | *required* |
| `sizes` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetSizeAtParametricPoints`</small>

### `setSizeCallback`

```ts
gmsh.model.mesh.setSizeCallback(callback: (dim: number, tag: number, x: number, y: number, z: number, lc: number) => number): void
```

Set a mesh size callback for the current model. The callback function should take six arguments as input (`dim', `tag', `x', `y', `z' and `lc'). The first two integer arguments correspond to the dimension `dim' and tag `tag' of the entity being meshed. The next four double precision arguments correspond to the coordinates `x', `y' and `z' around which to prescribe the mesh size and to the mesh size `lc' that would be prescribed if the callback had not been called. The callback function should return a double precision number specifying the desired mesh size; returning `lc' is equivalent to a no-op.

| Parameter | Type | Default |
|-----------|------|---------|
| `callback` | `(dim: number, tag: number, x: number, y: number, z: number, lc: number) => number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetSizeCallback`</small>

### `setSizeFromBoundary`

```ts
gmsh.model.mesh.setSizeFromBoundary(dim: number, tag: number, val: number): void
```

Force the mesh size to be extended from the boundary, or not, for the model entity of dimension `dim' and tag `tag'. Currently only supported for `dim' == 2.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `val` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetSizeFromBoundary`</small>

### `setSmoothing`

```ts
gmsh.model.mesh.setSmoothing(dim: number, tag: number, val: number): void
```

Set a smoothing meshing constraint on the model entity of dimension `dim' and tag `tag'. `val' iterations of a Laplace smoother are applied.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `val` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetSmoothing`</small>

### `setTransfiniteAutomatic`

```ts
gmsh.model.mesh.setTransfiniteAutomatic(dimTags?: number[], cornerAngle?: number, recombine?: boolean): void
```

Set transfinite meshing constraints on the model entities in `dimTags', given as a vector of (dim, tag) pairs. Transfinite meshing constraints are added to the curves of the quadrangular surfaces and to the faces of 6-sided volumes. Quadragular faces with a corner angle superior to `cornerAngle' (in radians) are ignored. The number of points is automatically determined from the sizing constraints. If `dimTag' is empty, the constraints are applied to all entities in the model. If `recombine' is true, the recombine flag is automatically set on the transfinite surfaces.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |
| `cornerAngle` | `number` | `2.35` |
| `recombine` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelMeshSetTransfiniteAutomatic`</small>

### `setTransfiniteCurve`

```ts
gmsh.model.mesh.setTransfiniteCurve(tag: number, numNodes: number, meshType?: string, coef?: number): void
```

Set a transfinite meshing constraint on the curve `tag', with `numNodes' nodes distributed according to `meshType' and `coef'. Currently supported types are "Progression" (geometrical progression with power `coef'), "Bump" (refinement toward both extremities of the curve) and "Beta" (beta law).

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `numNodes` | `number` | *required* |
| `meshType` | `string` | `"Progression"` |
| `coef` | `number` | `1.0` |

<small>Gmsh C symbol: `gmshModelMeshSetTransfiniteCurve`</small>

### `setTransfiniteSurface`

```ts
gmsh.model.mesh.setTransfiniteSurface(tag: number, arrangement?: string, cornerTags?: number[]): void
```

Set a transfinite meshing constraint on the surface `tag'. `arrangement' describes the arrangement of the triangles when the surface is not flagged as recombined: currently supported values are "Left", "Right", "AlternateLeft" and "AlternateRight". `cornerTags' can be used to specify the (3 or 4) corners of the transfinite interpolation explicitly; specifying the corners explicitly is mandatory if the surface has more that 3 or 4 points on its boundary.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `arrangement` | `string` | `"Left"` |
| `cornerTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshSetTransfiniteSurface`</small>

### `setTransfiniteVolume`

```ts
gmsh.model.mesh.setTransfiniteVolume(tag: number, cornerTags?: number[]): void
```

Set a transfinite meshing constraint on the volume `tag'. `cornerTags' can be used to specify the (6 or 8) corners of the transfinite interpolation explicitly.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `cornerTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelMeshSetTransfiniteVolume`</small>

### `setVisibility`

```ts
gmsh.model.mesh.setVisibility(elementTags: number[], value: number): void
```

Set the visibility of the elements of tags `elementTags' to `value'.

| Parameter | Type | Default |
|-----------|------|---------|
| `elementTags` | `number[]` | *required* |
| `value` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshSetVisibility`</small>

### `splitQuadrangles`

```ts
gmsh.model.mesh.splitQuadrangles(quality?: number, tag?: number): void
```

Split (into two triangles) all quadrangles in surface `tag' whose quality is lower than `quality'. If `tag' < 0, split quadrangles in all surfaces.

| Parameter | Type | Default |
|-----------|------|---------|
| `quality` | `number` | `1.0` |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelMeshSplitQuadrangles`</small>

### `unpartition`

```ts
gmsh.model.mesh.unpartition(): void
```

Unpartition the mesh of the current model.

<small>Gmsh C symbol: `gmshModelMeshUnpartition`</small>

## `gmsh.model.occ`

### `addBSpline`

```ts
gmsh.model.occ.addBSpline(pointTags: number[], tag?: number, degree?: number, weights?: number[], knots?: number[], multiplicities?: number[]): number
```

Add a b-spline curve of degree `degree' in the OpenCASCADE CAD representation, with `pointTags' control points. If `weights', `knots' or `multiplicities' are not provided, default parameters are computed automatically. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Create a periodic curve if the first and last points are the same. Return the tag of the b-spline curve.

| Parameter | Type | Default |
|-----------|------|---------|
| `pointTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `degree` | `number` | `3` |
| `weights` | `number[]` | `[]` |
| `knots` | `number[]` | `[]` |
| `multiplicities` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelOccAddBSpline`</small>

### `addBSplineFilling`

```ts
gmsh.model.occ.addBSplineFilling(wireTag: number, tag?: number, type?: string): number
```

Add a BSpline surface in the OpenCASCADE CAD representation, filling the curve loop `wireTag'. The curve loop should be made of 2, 3 or 4 curves. The optional `type' argument specifies the type of filling: "Stretch" creates the flattest patch, "Curved" (the default) creates the most rounded patch, and "Coons" creates a rounded patch with less depth than "Curved". If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the surface.

| Parameter | Type | Default |
|-----------|------|---------|
| `wireTag` | `number` | *required* |
| `tag` | `number` | `-1` |
| `type` | `string` | `""` |

<small>Gmsh C symbol: `gmshModelOccAddBSplineFilling`</small>

### `addBSplineSurface`

```ts
gmsh.model.occ.addBSplineSurface(pointTags: number[], numPointsU: number, tag?: number, degreeU?: number, degreeV?: number, weights?: number[], knotsU?: number[], knotsV?: number[], multiplicitiesU?: number[], multiplicitiesV?: number[], wireTags?: number[], wire3D?: boolean): number
```

Add a b-spline surface of degree `degreeU' x `degreeV' in the OpenCASCADE CAD representation, with `pointTags' control points given as a single vector [Pu1v1, ... Pu`numPointsU'v1, Pu1v2, ...]. If `weights', `knotsU', `knotsV', `multiplicitiesU' or `multiplicitiesV' are not provided, default parameters are computed automatically. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. If `wireTags' is provided, trim the b-spline patch using the provided wires: the first wire defines the external contour, the others define holes. If `wire3D' is set, consider wire curves as 3D curves and project them on the b-spline surface; otherwise consider the wire curves as defined in the parametric space of the surface. Return the tag of the b-spline surface.

| Parameter | Type | Default |
|-----------|------|---------|
| `pointTags` | `number[]` | *required* |
| `numPointsU` | `number` | *required* |
| `tag` | `number` | `-1` |
| `degreeU` | `number` | `3` |
| `degreeV` | `number` | `3` |
| `weights` | `number[]` | `[]` |
| `knotsU` | `number[]` | `[]` |
| `knotsV` | `number[]` | `[]` |
| `multiplicitiesU` | `number[]` | `[]` |
| `multiplicitiesV` | `number[]` | `[]` |
| `wireTags` | `number[]` | `[]` |
| `wire3D` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelOccAddBSplineSurface`</small>

### `addBezier`

```ts
gmsh.model.occ.addBezier(pointTags: number[], tag?: number): number
```

Add a Bezier curve in the OpenCASCADE CAD representation, with `pointTags' control points. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the Bezier curve.

| Parameter | Type | Default |
|-----------|------|---------|
| `pointTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccAddBezier`</small>

### `addBezierFilling`

```ts
gmsh.model.occ.addBezierFilling(wireTag: number, tag?: number, type?: string): number
```

Add a Bezier surface in the OpenCASCADE CAD representation, filling the curve loop `wireTag'. The curve loop should be made of 2, 3 or 4 Bezier curves. The optional `type' argument specifies the type of filling: "Stretch" creates the flattest patch, "Curved" (the default) creates the most rounded patch, and "Coons" creates a rounded patch with less depth than "Curved". If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the surface.

| Parameter | Type | Default |
|-----------|------|---------|
| `wireTag` | `number` | *required* |
| `tag` | `number` | `-1` |
| `type` | `string` | `""` |

<small>Gmsh C symbol: `gmshModelOccAddBezierFilling`</small>

### `addBezierSurface`

```ts
gmsh.model.occ.addBezierSurface(pointTags: number[], numPointsU: number, tag?: number, wireTags?: number[], wire3D?: boolean): number
```

Add a Bezier surface in the OpenCASCADE CAD representation, with `pointTags' control points given as a single vector [Pu1v1, ... Pu`numPointsU'v1, Pu1v2, ...]. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. If `wireTags' is provided, trim the Bezier patch using the provided wires: the first wire defines the external contour, the others define holes. If `wire3D' is set, consider wire curves as 3D curves and project them on the Bezier surface; otherwise consider the wire curves as defined in the parametric space of the surface. Return the tag of the Bezier surface.

| Parameter | Type | Default |
|-----------|------|---------|
| `pointTags` | `number[]` | *required* |
| `numPointsU` | `number` | *required* |
| `tag` | `number` | `-1` |
| `wireTags` | `number[]` | `[]` |
| `wire3D` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelOccAddBezierSurface`</small>

### `addBox`

```ts
gmsh.model.occ.addBox(x: number, y: number, z: number, dx: number, dy: number, dz: number, tag?: number): number
```

Add a parallelepipedic box in the OpenCASCADE CAD representation, defined by a point (`x', `y', `z') and the extents along the x-, y- and z-axes. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the box.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `dx` | `number` | *required* |
| `dy` | `number` | *required* |
| `dz` | `number` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccAddBox`</small>

### `addCircle`

```ts
gmsh.model.occ.addCircle(x: number, y: number, z: number, r: number, tag?: number, angle1?: number, angle2?: number, zAxis?: number[], xAxis?: number[]): number
```

Add a circle of center (`x', `y', `z') and radius `r' in the OpenCASCADE CAD representation. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. If `angle1' and `angle2' are specified, create a circle arc between the two angles. If a vector `zAxis' of size 3 is provided, use it as the normal to the circle plane (z-axis). If a vector `xAxis' of size 3 is provided in addition to `zAxis', use it to define the x-axis. Return the tag of the circle.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `r` | `number` | *required* |
| `tag` | `number` | `-1` |
| `angle1` | `number` | `0.0` |
| `angle2` | `number` | `6.283185307179586` |
| `zAxis` | `number[]` | `[]` |
| `xAxis` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelOccAddCircle`</small>

### `addCircleArc`

```ts
gmsh.model.occ.addCircleArc(startTag: number, middleTag: number, endTag: number, tag?: number, center?: boolean): number
```

Add a circle arc in the OpenCASCADE CAD representation, between the two points with tags `startTag' and `endTag', with middle point `middleTag'. If `center' is true, the middle point is the center of the circle; otherwise the circle goes through the middle point. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the circle arc.

| Parameter | Type | Default |
|-----------|------|---------|
| `startTag` | `number` | *required* |
| `middleTag` | `number` | *required* |
| `endTag` | `number` | *required* |
| `tag` | `number` | `-1` |
| `center` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelOccAddCircleArc`</small>

### `addCone`

```ts
gmsh.model.occ.addCone(x: number, y: number, z: number, dx: number, dy: number, dz: number, r1: number, r2: number, tag?: number, angle?: number): number
```

Add a cone in the OpenCASCADE CAD representation, defined by the center (`x', `y', `z') of its first circular face, the 3 components of the vector (`dx', `dy', `dz') defining its axis and the two radii `r1' and `r2' of the faces (these radii can be zero). If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. `angle' defines the optional angular opening (from 0 to 2*Pi). Return the tag of the cone.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `dx` | `number` | *required* |
| `dy` | `number` | *required* |
| `dz` | `number` | *required* |
| `r1` | `number` | *required* |
| `r2` | `number` | *required* |
| `tag` | `number` | `-1` |
| `angle` | `number` | `6.283185307179586` |

<small>Gmsh C symbol: `gmshModelOccAddCone`</small>

### `addCurveLoop`

```ts
gmsh.model.occ.addCurveLoop(curveTags: number[], tag?: number): number
```

Add a curve loop (a closed wire) in the OpenCASCADE CAD representation, formed by the curves `curveTags'. `curveTags' should contain tags of curves forming a closed loop. Negative tags can be specified for compatibility with the built-in kernel, but are simply ignored: the wire is oriented according to the orientation of its first curve. Note that an OpenCASCADE curve loop can be made of curves that share geometrically identical (but topologically different) points. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the curve loop.

| Parameter | Type | Default |
|-----------|------|---------|
| `curveTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccAddCurveLoop`</small>

### `addCylinder`

```ts
gmsh.model.occ.addCylinder(x: number, y: number, z: number, dx: number, dy: number, dz: number, r: number, tag?: number, angle?: number): number
```

Add a cylinder in the OpenCASCADE CAD representation, defined by the center (`x', `y', `z') of its first circular face, the 3 components (`dx', `dy', `dz') of the vector defining its axis and its radius `r'. The optional `angle' argument defines the angular opening (from 0 to 2*Pi). If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the cylinder.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `dx` | `number` | *required* |
| `dy` | `number` | *required* |
| `dz` | `number` | *required* |
| `r` | `number` | *required* |
| `tag` | `number` | `-1` |
| `angle` | `number` | `6.283185307179586` |

<small>Gmsh C symbol: `gmshModelOccAddCylinder`</small>

### `addDisk`

```ts
gmsh.model.occ.addDisk(xc: number, yc: number, zc: number, rx: number, ry: number, tag?: number, zAxis?: number[], xAxis?: number[]): number
```

Add a disk in the OpenCASCADE CAD representation, with center (`xc', `yc', `zc') and radius `rx' along the x-axis and `ry' along the y-axis (`rx' >= `ry'). If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. If a vector `zAxis' of size 3 is provided, use it as the normal to the disk (z-axis). If a vector `xAxis' of size 3 is provided in addition to `zAxis', use it to define the x-axis. Return the tag of the disk.

| Parameter | Type | Default |
|-----------|------|---------|
| `xc` | `number` | *required* |
| `yc` | `number` | *required* |
| `zc` | `number` | *required* |
| `rx` | `number` | *required* |
| `ry` | `number` | *required* |
| `tag` | `number` | `-1` |
| `zAxis` | `number[]` | `[]` |
| `xAxis` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelOccAddDisk`</small>

### `addEllipse`

```ts
gmsh.model.occ.addEllipse(x: number, y: number, z: number, r1: number, r2: number, tag?: number, angle1?: number, angle2?: number, zAxis?: number[], xAxis?: number[]): number
```

Add an ellipse of center (`x', `y', `z') and radii `r1' and `r2' (with `r1' >= `r2') along the x- and y-axes, respectively, in the OpenCASCADE CAD representation. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. If `angle1' and `angle2' are specified, create an ellipse arc between the two angles. If a vector `zAxis' of size 3 is provided, use it as the normal to the ellipse plane (z-axis). If a vector `xAxis' of size 3 is provided in addition to `zAxis', use it to define the x-axis. Return the tag of the ellipse.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `r1` | `number` | *required* |
| `r2` | `number` | *required* |
| `tag` | `number` | `-1` |
| `angle1` | `number` | `0.0` |
| `angle2` | `number` | `6.283185307179586` |
| `zAxis` | `number[]` | `[]` |
| `xAxis` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelOccAddEllipse`</small>

### `addEllipseArc`

```ts
gmsh.model.occ.addEllipseArc(startTag: number, centerTag: number, majorTag: number, endTag: number, tag?: number): number
```

Add an ellipse arc in the OpenCASCADE CAD representation, between the two points `startTag' and `endTag', and with center `centerTag' and major axis point `majorTag'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the ellipse arc. Note that OpenCASCADE does not allow creating ellipse arcs with the major radius smaller than the minor radius.

| Parameter | Type | Default |
|-----------|------|---------|
| `startTag` | `number` | *required* |
| `centerTag` | `number` | *required* |
| `majorTag` | `number` | *required* |
| `endTag` | `number` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccAddEllipseArc`</small>

### `addLine`

```ts
gmsh.model.occ.addLine(startTag: number, endTag: number, tag?: number): number
```

Add a straight line segment in the OpenCASCADE CAD representation, between the two points with tags `startTag' and `endTag'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the line.

| Parameter | Type | Default |
|-----------|------|---------|
| `startTag` | `number` | *required* |
| `endTag` | `number` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccAddLine`</small>

### `addPipe`

```ts
gmsh.model.occ.addPipe(dimTags: number[], wireTag: number, trihedron?: string): { outDimTags: number[] }
```

Add a pipe in the OpenCASCADE CAD representation, by extruding the entities `dimTags' (given as a vector of (dim, tag) pairs) along the wire `wireTag'. The type of sweep can be specified with `trihedron' (possible values: "DiscreteTrihedron", "CorrectedFrenet", "Fixed", "Frenet", "ConstantNormal", "Darboux", "GuideAC", "GuidePlan", "GuideACWithContact", "GuidePlanWithContact"). If `trihedron' is not provided, "DiscreteTrihedron" is assumed. Return the pipe in `outDimTags'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `wireTag` | `number` | *required* |
| `trihedron` | `string` | `""` |

<small>Gmsh C symbol: `gmshModelOccAddPipe`</small>

### `addPlaneSurface`

```ts
gmsh.model.occ.addPlaneSurface(wireTags: number[], tag?: number): number
```

Add a plane surface in the OpenCASCADE CAD representation, defined by one or more curve loops (or closed wires) `wireTags'. The first curve loop defines the exterior contour; additional curve loop define holes. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the surface.

| Parameter | Type | Default |
|-----------|------|---------|
| `wireTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccAddPlaneSurface`</small>

### `addPoint`

```ts
gmsh.model.occ.addPoint(x: number, y: number, z: number, meshSize?: number, tag?: number): number
```

Add a geometrical point in the OpenCASCADE CAD representation, at coordinates (`x', `y', `z'). If `meshSize' is > 0, add a meshing constraint at that point. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the point. (Note that the point will be added in the current model only after `synchronize' is called. This behavior holds for all the entities added in the occ module.)

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `meshSize` | `number` | `0.0` |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccAddPoint`</small>

### `addRectangle`

```ts
gmsh.model.occ.addRectangle(x: number, y: number, z: number, dx: number, dy: number, tag?: number, roundedRadius?: number): number
```

Add a rectangle in the OpenCASCADE CAD representation, with lower left corner at (`x', `y', `z') and upper right corner at (`x' + `dx', `y' + `dy', `z'). If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Round the corners if `roundedRadius' is nonzero. Return the tag of the rectangle.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `dx` | `number` | *required* |
| `dy` | `number` | *required* |
| `tag` | `number` | `-1` |
| `roundedRadius` | `number` | `0.0` |

<small>Gmsh C symbol: `gmshModelOccAddRectangle`</small>

### `addSphere`

```ts
gmsh.model.occ.addSphere(xc: number, yc: number, zc: number, radius: number, tag?: number, angle1?: number, angle2?: number, angle3?: number): number
```

Add a sphere of center (`xc', `yc', `zc') and radius `r' in the OpenCASCADE CAD representation. The optional `angle1' and `angle2' arguments define the polar angle opening (from -Pi/2 to Pi/2). The optional `angle3' argument defines the azimuthal opening (from 0 to 2*Pi). If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the sphere.

| Parameter | Type | Default |
|-----------|------|---------|
| `xc` | `number` | *required* |
| `yc` | `number` | *required* |
| `zc` | `number` | *required* |
| `radius` | `number` | *required* |
| `tag` | `number` | `-1` |
| `angle1` | `number` | `-1.5707963267948966` |
| `angle2` | `number` | `1.5707963267948966` |
| `angle3` | `number` | `6.283185307179586` |

<small>Gmsh C symbol: `gmshModelOccAddSphere`</small>

### `addSpline`

```ts
gmsh.model.occ.addSpline(pointTags: number[], tag?: number, tangents?: number[]): number
```

Add a spline (C2 b-spline) curve in the OpenCASCADE CAD representation, going through the points `pointTags'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Create a periodic curve if the first and last points are the same. Return the tag of the spline curve. If the `tangents' vector contains 6 entries, use them as concatenated x, y, z components of the initial and final tangents of the b-spline; if it contains 3 times as many entries as the number of points, use them as concatenated x, y, z components of the tangents at each point, unless the norm of the tangent is zero.

| Parameter | Type | Default |
|-----------|------|---------|
| `pointTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `tangents` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelOccAddSpline`</small>

### `addSurfaceFilling`

```ts
gmsh.model.occ.addSurfaceFilling(wireTag: number, tag?: number, pointTags?: number[], degree?: number, numPointsOnCurves?: number, numIter?: number, anisotropic?: boolean, tol2d?: number, tol3d?: number, tolAng?: number, tolCurv?: number, maxDegree?: number, maxSegments?: number): number
```

Add a surface in the OpenCASCADE CAD representation, filling the curve loop `wireTag'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the surface. If `pointTags' are provided, force the surface to pass through the given points. The other optional arguments are `degree' (the degree of the energy criterion to minimize for computing the deformation of the surface), `numPointsOnCurves' (the average number of points for discretisation of the bounding curves), `numIter' (the maximum number of iterations of the optimization process), `anisotropic' (improve performance when the ratio of the length along the two parametric coordinates of the surface is high), `tol2d' (tolerance to the constraints in the parametric plane of the surface), `tol3d' (the maximum distance allowed between the support surface and the constraints), `tolAng' (the maximum angle allowed between the normal of the surface and the constraints), `tolCurv' (the maximum difference of curvature allowed between the surface and the constraint), `maxDegree' (the highest degree which the polynomial defining the filling surface can have) and, `maxSegments' (the largest number of segments which the filling surface can have).

| Parameter | Type | Default |
|-----------|------|---------|
| `wireTag` | `number` | *required* |
| `tag` | `number` | `-1` |
| `pointTags` | `number[]` | `[]` |
| `degree` | `number` | `2` |
| `numPointsOnCurves` | `number` | `15` |
| `numIter` | `number` | `2` |
| `anisotropic` | `boolean` | `false` |
| `tol2d` | `number` | `1e-05` |
| `tol3d` | `number` | `0.0001` |
| `tolAng` | `number` | `0.01` |
| `tolCurv` | `number` | `0.1` |
| `maxDegree` | `number` | `8` |
| `maxSegments` | `number` | `9` |

<small>Gmsh C symbol: `gmshModelOccAddSurfaceFilling`</small>

### `addSurfaceLoop`

```ts
gmsh.model.occ.addSurfaceLoop(surfaceTags: number[], tag?: number, sewing?: boolean): number
```

Add a surface loop (a closed shell) in the OpenCASCADE CAD representation, formed by `surfaceTags'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the surface loop. Setting `sewing' allows one to build a shell made of surfaces that share geometrically identical (but topologically different) curves.

| Parameter | Type | Default |
|-----------|------|---------|
| `surfaceTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `sewing` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelOccAddSurfaceLoop`</small>

### `addThickSolid`

```ts
gmsh.model.occ.addThickSolid(volumeTag: number, excludeSurfaceTags: number[], offset: number, tag?: number): { outDimTags: number[] }
```

Add a hollowed volume in the OpenCASCADE CAD representation, built from an initial volume `volumeTag' and a set of faces from this volume `excludeSurfaceTags', which are to be removed. The remaining faces of the volume become the walls of the hollowed solid, with thickness `offset'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically.

| Parameter | Type | Default |
|-----------|------|---------|
| `volumeTag` | `number` | *required* |
| `excludeSurfaceTags` | `number[]` | *required* |
| `offset` | `number` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccAddThickSolid`</small>

### `addThruSections`

```ts
gmsh.model.occ.addThruSections(wireTags: number[], tag?: number, makeSolid?: boolean, makeRuled?: boolean, maxDegree?: number, continuity?: string, parametrization?: string, smoothing?: boolean): { outDimTags: number[] }
```

Add a volume (if the optional argument `makeSolid' is set) or surfaces in the OpenCASCADE CAD representation, defined through the open or closed wires `wireTags'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. The new entities are returned in `outDimTags' as a vector of (dim, tag) pairs. If the optional argument `makeRuled' is set, the surfaces created on the boundary are forced to be ruled surfaces. If `maxDegree' is positive, set the maximal degree of resulting surface. The optional argument `continuity' specifies the continuity of the resulting shape ("C0", "G1", "C1", "G2", "C2", "C3", "CN"). The optional argument `parametrization' sets the parametrization type ("ChordLength", "Centripetal", "IsoParametric"). The optional argument `smoothing' determines if smoothing is applied.

| Parameter | Type | Default |
|-----------|------|---------|
| `wireTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `makeSolid` | `boolean` | `true` |
| `makeRuled` | `boolean` | `false` |
| `maxDegree` | `number` | `-1` |
| `continuity` | `string` | `""` |
| `parametrization` | `string` | `""` |
| `smoothing` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelOccAddThruSections`</small>

### `addTorus`

```ts
gmsh.model.occ.addTorus(x: number, y: number, z: number, r1: number, r2: number, tag?: number, angle?: number, zAxis?: number[]): number
```

Add a torus in the OpenCASCADE CAD representation, defined by its center (`x', `y', `z') and its 2 radii `r' and `r2'. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. The optional argument `angle' defines the angular opening (from 0 to 2*Pi). If a vector `zAxis' of size 3 is provided, use it to define the z-axis. Return the tag of the torus.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `r1` | `number` | *required* |
| `r2` | `number` | *required* |
| `tag` | `number` | `-1` |
| `angle` | `number` | `6.283185307179586` |
| `zAxis` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelOccAddTorus`</small>

### `addTrimmedSurface`

```ts
gmsh.model.occ.addTrimmedSurface(surfaceTag: number, wireTags?: number[], wire3D?: boolean, tag?: number): number
```

Trim the surface `surfaceTag' with the wires `wireTags', replacing any existing trimming curves. The first wire defines the external contour, the others define holes. If `wire3D' is set, consider wire curves as 3D curves and project them on the surface; otherwise consider the wire curves as defined in the parametric space of the surface. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the trimmed surface.

| Parameter | Type | Default |
|-----------|------|---------|
| `surfaceTag` | `number` | *required* |
| `wireTags` | `number[]` | `[]` |
| `wire3D` | `boolean` | `false` |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccAddTrimmedSurface`</small>

### `addVolume`

```ts
gmsh.model.occ.addVolume(shellTags: number[], tag?: number): number
```

Add a volume (a region) in the OpenCASCADE CAD representation, defined by one or more surface loops `shellTags'. The first surface loop defines the exterior boundary; additional surface loop define holes. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the volume.

| Parameter | Type | Default |
|-----------|------|---------|
| `shellTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccAddVolume`</small>

### `addWedge`

```ts
gmsh.model.occ.addWedge(x: number, y: number, z: number, dx: number, dy: number, dz: number, tag?: number, ltx?: number, zAxis?: number[]): number
```

Add a right angular wedge in the OpenCASCADE CAD representation, defined by the right-angle point (`x', `y', `z') and the 3 extends along the x-, y- and z-axes (`dx', `dy', `dz'). If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. The optional argument `ltx' defines the top extent along the x-axis. If a vector `zAxis' of size 3 is provided, use it to define the z-axis. Return the tag of the wedge.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `dx` | `number` | *required* |
| `dy` | `number` | *required* |
| `dz` | `number` | *required* |
| `tag` | `number` | `-1` |
| `ltx` | `number` | `0.0` |
| `zAxis` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelOccAddWedge`</small>

### `addWire`

```ts
gmsh.model.occ.addWire(curveTags: number[], tag?: number, checkClosed?: boolean): number
```

Add a wire (open or closed) in the OpenCASCADE CAD representation, formed by the curves `curveTags'. Note that an OpenCASCADE wire can be made of curves that share geometrically identical (but topologically different) points. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. Return the tag of the wire.

| Parameter | Type | Default |
|-----------|------|---------|
| `curveTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `checkClosed` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelOccAddWire`</small>

### `affineTransform`

```ts
gmsh.model.occ.affineTransform(dimTags: number[], affineTransform: number[]): void
```

Apply a general affine transformation matrix `affineTransform' (16 entries of a 4x4 matrix, by row; only the 12 first can be provided for convenience) to the entities `dimTags' (given as a vector of (dim, tag) pairs) in the OpenCASCADE CAD representation.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `affineTransform` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelOccAffineTransform`</small>

### `chamfer`

```ts
gmsh.model.occ.chamfer(volumeTags: number[], curveTags: number[], surfaceTags: number[], distances: number[], removeVolume?: boolean): { outDimTags: number[] }
```

Chamfer the volumes `volumeTags' on the curves `curveTags' with distances `distances' measured on surfaces `surfaceTags'. The `distances' vector can either contain a single distance, as many distances as `curveTags' and `surfaceTags', or twice as many as `curveTags' and `surfaceTags' (in which case the first in each pair is measured on the corresponding surface in `surfaceTags', the other on the other adjacent surface). Return the chamfered entities in `outDimTags'. Remove the original volume if `removeVolume' is set.

| Parameter | Type | Default |
|-----------|------|---------|
| `volumeTags` | `number[]` | *required* |
| `curveTags` | `number[]` | *required* |
| `surfaceTags` | `number[]` | *required* |
| `distances` | `number[]` | *required* |
| `removeVolume` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelOccChamfer`</small>

### `chamfer2D`

```ts
gmsh.model.occ.chamfer2D(edgeTag1: number, edgeTag2: number, distance1: number, distance2: number, tag?: number): number
```

Create a chamfer edge between edges `edgeTag1' and `edgeTag2' with distance1 `distance1' and distance2 `distance2'. The modifed edges keep their tag. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically.

| Parameter | Type | Default |
|-----------|------|---------|
| `edgeTag1` | `number` | *required* |
| `edgeTag2` | `number` | *required* |
| `distance1` | `number` | *required* |
| `distance2` | `number` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccChamfer2D`</small>

### `convertToNURBS`

```ts
gmsh.model.occ.convertToNURBS(dimTags: number[]): void
```

Convert the entities `dimTags' to NURBS.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelOccConvertToNURBS`</small>

### `copy`

```ts
gmsh.model.occ.copy(dimTags: number[]): { outDimTags: number[] }
```

Copy the entities `dimTags' in the OpenCASCADE CAD representation; the new entities are returned in `outDimTags'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelOccCopy`</small>

### `cut`

```ts
gmsh.model.occ.cut(objectDimTags: number[], toolDimTags: number[], tag?: number, removeObject?: boolean, removeTool?: boolean): { outDimTags: number[]; outDimTagsMap: number[][] }
```

Compute the boolean difference between the entities `objectDimTags' and `toolDimTags' (given as vectors of (dim, tag) pairs) in the OpenCASCADE CAD representation. Return the resulting entities in `outDimTags', and the correspondance between input and resulting entities in `outDimTagsMap'. If `tag' is positive, try to set the tag explicitly (only valid if the boolean operation results in a single entity). Remove the object if `removeObject' is set. Remove the tool if `removeTool' is set.

| Parameter | Type | Default |
|-----------|------|---------|
| `objectDimTags` | `number[]` | *required* |
| `toolDimTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `removeObject` | `boolean` | `true` |
| `removeTool` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelOccCut`</small>

### `defeature`

```ts
gmsh.model.occ.defeature(volumeTags: number[], surfaceTags: number[], removeVolume?: boolean): { outDimTags: number[] }
```

Defeature the volumes `volumeTags' by removing the surfaces `surfaceTags'. Return the defeatured entities in `outDimTags'. Remove the original volume if `removeVolume' is set.

| Parameter | Type | Default |
|-----------|------|---------|
| `volumeTags` | `number[]` | *required* |
| `surfaceTags` | `number[]` | *required* |
| `removeVolume` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelOccDefeature`</small>

### `dilate`

```ts
gmsh.model.occ.dilate(dimTags: number[], x: number, y: number, z: number, a: number, b: number, c: number): void
```

Scale the entities `dimTags' (given as a vector of (dim, tag) pairs) in the OpenCASCADE CAD representation by factors `a', `b' and `c' along the three coordinate axes; use (`x', `y', `z') as the center of the homothetic transformation.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `a` | `number` | *required* |
| `b` | `number` | *required* |
| `c` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccDilate`</small>

### `extrude`

```ts
gmsh.model.occ.extrude(dimTags: number[], dx: number, dy: number, dz: number, numElements?: number[], heights?: number[], recombine?: boolean): { outDimTags: number[] }
```

Extrude the entities `dimTags' (given as a vector of (dim, tag) pairs) in the OpenCASCADE CAD representation, using a translation along (`dx', `dy', `dz'). Return extruded entities in `outDimTags'. If the `numElements' vector is not empty, also extrude the mesh: the entries in `numElements' give the number of elements in each layer. If the `height' vector is not empty, it provides the (cumulative) height of the different layers, normalized to 1. If `recombine' is set, recombine the mesh in the layers.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `dx` | `number` | *required* |
| `dy` | `number` | *required* |
| `dz` | `number` | *required* |
| `numElements` | `number[]` | `[]` |
| `heights` | `number[]` | `[]` |
| `recombine` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelOccExtrude`</small>

### `fillet`

```ts
gmsh.model.occ.fillet(volumeTags: number[], curveTags: number[], radii: number[], removeVolume?: boolean): { outDimTags: number[] }
```

Fillet the volumes `volumeTags' on the curves `curveTags' with radii `radii'. The `radii' vector can either contain a single radius, as many radii as `curveTags', or twice as many as `curveTags' (in which case different radii are provided for the begin and end points of the curves). Return the filleted entities in `outDimTags' as a vector of (dim, tag) pairs. Remove the original volume if `removeVolume' is set.

| Parameter | Type | Default |
|-----------|------|---------|
| `volumeTags` | `number[]` | *required* |
| `curveTags` | `number[]` | *required* |
| `radii` | `number[]` | *required* |
| `removeVolume` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelOccFillet`</small>

### `fillet2D`

```ts
gmsh.model.occ.fillet2D(edgeTag1: number, edgeTag2: number, radius: number, tag?: number, pointTag?: number, reverse?: boolean): number
```

Create a fillet edge between edges `edgeTag1' and `edgeTag2' with radius `radius'. The modifed edges keep their tag. If `tag' is positive, set the tag explicitly; otherwise a new tag is selected automatically. If `pointTag' is positive, set the point on the edge at which the fillet is created. If `reverse' is set, the normal of the plane through the two planes is reversed before the fillet is created.

| Parameter | Type | Default |
|-----------|------|---------|
| `edgeTag1` | `number` | *required* |
| `edgeTag2` | `number` | *required* |
| `radius` | `number` | *required* |
| `tag` | `number` | `-1` |
| `pointTag` | `number` | `-1` |
| `reverse` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelOccFillet2D`</small>

### `fragment`

```ts
gmsh.model.occ.fragment(objectDimTags: number[], toolDimTags: number[], tag?: number, removeObject?: boolean, removeTool?: boolean): { outDimTags: number[]; outDimTagsMap: number[][] }
```

Compute the boolean fragments (general fuse) resulting from the intersection of the entities `objectDimTags' and `toolDimTags' (given as vectors of (dim, tag) pairs) in the OpenCASCADE CAD representation, making all interfaces conformal. When applied to entities of different dimensions, the lower dimensional entities will be automatically embedded in the higher dimensional entities if they are not on their boundary. In order to preserve entity tags, entities should be provided in ascending dimension order. Return the resulting entities in `outDimTags', and the correspondance between input and resulting entities in `outDimTagsMap'. If `tag' is positive, try to set the tag explicitly (only valid if the boolean operation results in a single entity). Remove the object if `removeObject' is set. Remove the tool if `removeTool' is set.

| Parameter | Type | Default |
|-----------|------|---------|
| `objectDimTags` | `number[]` | *required* |
| `toolDimTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `removeObject` | `boolean` | `true` |
| `removeTool` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelOccFragment`</small>

### `fuse`

```ts
gmsh.model.occ.fuse(objectDimTags: number[], toolDimTags: number[], tag?: number, removeObject?: boolean, removeTool?: boolean): { outDimTags: number[]; outDimTagsMap: number[][] }
```

Compute the boolean union (the fusion) of the entities `objectDimTags' and `toolDimTags' (vectors of (dim, tag) pairs) in the OpenCASCADE CAD representation. Return the resulting entities in `outDimTags', and the correspondance between input and resulting entities in `outDimTagsMap'. If `tag' is positive, try to set the tag explicitly (only valid if the boolean operation results in a single entity). Remove the object if `removeObject' is set. Remove the tool if `removeTool' is set.

| Parameter | Type | Default |
|-----------|------|---------|
| `objectDimTags` | `number[]` | *required* |
| `toolDimTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `removeObject` | `boolean` | `true` |
| `removeTool` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelOccFuse`</small>

### `getBoundingBox`

```ts
gmsh.model.occ.getBoundingBox(dim: number, tag: number): { xmin: number; ymin: number; zmin: number; xmax: number; ymax: number; zmax: number }
```

Get the bounding box (`xmin', `ymin', `zmin'), (`xmax', `ymax', `zmax') of the OpenCASCADE entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccGetBoundingBox`</small>

### `getCenterOfMass`

```ts
gmsh.model.occ.getCenterOfMass(dim: number, tag: number): { x: number; y: number; z: number }
```

Get the center of mass of the OpenCASCADE entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccGetCenterOfMass`</small>

### `getClosestEntities`

```ts
gmsh.model.occ.getClosestEntities(x: number, y: number, z: number, dimTags: number[], n?: number): { outDimTags: number[]; distances: number[]; coord: number[] }
```

Find the `n' closest entities to point (`x', `y', `z') amongst the entities `dimTags'. Return the entities in `outDimTags' sorted by increasing distance, the corresponding distances in `distances', and the correspdonding closest x, y, z coordinates, concatenated, in `coord'.

| Parameter | Type | Default |
|-----------|------|---------|
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `dimTags` | `number[]` | *required* |
| `n` | `number` | `1` |

<small>Gmsh C symbol: `gmshModelOccGetClosestEntities`</small>

### `getCurveLoops`

```ts
gmsh.model.occ.getCurveLoops(surfaceTag: number): { curveLoopTags: number[]; curveTags: number[][] }
```

Get the tags `curveLoopTags' of the curve loops making up the surface of tag `surfaceTag', as well as the tags `curveTags' of the curves making up each curve loop.

| Parameter | Type | Default |
|-----------|------|---------|
| `surfaceTag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccGetCurveLoops`</small>

### `getDistance`

```ts
gmsh.model.occ.getDistance(dim1: number, tag1: number, dim2: number, tag2: number): { distance: number; x1: number; y1: number; z1: number; x2: number; y2: number; z2: number }
```

Find the minimal distance between shape with `dim1' and `tag1' and shape with `dim2' and `tag2' and the according coordinates. Return the distance in `distance' and the coordinates of the points as `x1', `y1', `z1' and `x2', `y2', `z2'. A negative `distance' indicates failure.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim1` | `number` | *required* |
| `tag1` | `number` | *required* |
| `dim2` | `number` | *required* |
| `tag2` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccGetDistance`</small>

### `getEntities`

```ts
gmsh.model.occ.getEntities(dim?: number): { dimTags: number[] }
```

Get all the OpenCASCADE entities. If `dim' is >= 0, return only the entities of the specified dimension (e.g. points if `dim' == 0). The entities are returned as a vector of (dim, tag) pairs.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccGetEntities`</small>

### `getEntitiesInBoundingBox`

```ts
gmsh.model.occ.getEntitiesInBoundingBox(xmin: number, ymin: number, zmin: number, xmax: number, ymax: number, zmax: number, dim?: number): { dimTags: number[] }
```

Get the OpenCASCADE entities in the bounding box defined by the two points (`xmin', `ymin', `zmin') and (`xmax', `ymax', `zmax'). If `dim' is >= 0, return only the entities of the specified dimension (e.g. points if `dim' == 0).

| Parameter | Type | Default |
|-----------|------|---------|
| `xmin` | `number` | *required* |
| `ymin` | `number` | *required* |
| `zmin` | `number` | *required* |
| `xmax` | `number` | *required* |
| `ymax` | `number` | *required* |
| `zmax` | `number` | *required* |
| `dim` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelOccGetEntitiesInBoundingBox`</small>

### `getMass`

```ts
gmsh.model.occ.getMass(dim: number, tag: number): { mass: number }
```

Get the mass of the OpenCASCADE entity of dimension `dim' and tag `tag'. If no density is attached to the entity (the default), the value corresponds respectively to the length, area and volume for `dim' = 1, 2 and 3.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccGetMass`</small>

### `getMatrixOfInertia`

```ts
gmsh.model.occ.getMatrixOfInertia(dim: number, tag: number): { mat: number[] }
```

Get the matrix of inertia (by row) of the OpenCASCADE entity of dimension `dim' and tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccGetMatrixOfInertia`</small>

### `getMaxTag`

```ts
gmsh.model.occ.getMaxTag(dim: number): number
```

Get the maximum tag of entities of dimension `dim' in the OpenCASCADE CAD representation.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccGetMaxTag`</small>

### `getSurfaceLoops`

```ts
gmsh.model.occ.getSurfaceLoops(volumeTag: number): { surfaceLoopTags: number[]; surfaceTags: number[][] }
```

Get the tags `surfaceLoopTags' of the surface loops making up the volume of tag `volumeTag', as well as the tags `surfaceTags' of the surfaces making up each surface loop.

| Parameter | Type | Default |
|-----------|------|---------|
| `volumeTag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccGetSurfaceLoops`</small>

### `healShapes`

```ts
gmsh.model.occ.healShapes(dimTags?: number[], tolerance?: number, fixDegenerated?: boolean, fixSmallEdges?: boolean, fixSmallFaces?: boolean, sewFaces?: boolean, makeSolids?: boolean): { outDimTags: number[] }
```

Apply various healing procedures to the entities `dimTags' (given as a vector of (dim, tag) pairs), or to all the entities in the model if `dimTags' is empty, in the OpenCASCADE CAD representation. Return the healed entities in `outDimTags'.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | `[]` |
| `tolerance` | `number` | `1e-08` |
| `fixDegenerated` | `boolean` | `true` |
| `fixSmallEdges` | `boolean` | `true` |
| `fixSmallFaces` | `boolean` | `true` |
| `sewFaces` | `boolean` | `true` |
| `makeSolids` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelOccHealShapes`</small>

### `importShapes`

```ts
gmsh.model.occ.importShapes(fileName: string, highestDimOnly?: boolean, format?: string): { outDimTags: number[] }
```

Import BREP, STEP or IGES shapes from the file `fileName' in the OpenCASCADE CAD representation. The imported entities are returned in `outDimTags', as a vector of (dim, tag) pairs. If the optional argument `highestDimOnly' is set, only import the highest dimensional entities in the file. The optional argument `format' can be used to force the format of the file (currently "brep", "step" or "iges").

| Parameter | Type | Default |
|-----------|------|---------|
| `fileName` | `string` | *required* |
| `highestDimOnly` | `boolean` | `true` |
| `format` | `string` | `""` |

<small>Gmsh C symbol: `gmshModelOccImportShapes`</small>

### `importShapesNativePointer`

```ts
gmsh.model.occ.importShapesNativePointer(shape: number, highestDimOnly?: boolean): { outDimTags: number[] }
```

Import an OpenCASCADE `shape' by providing a pointer to a native OpenCASCADE `TopoDS_Shape' object (passed as a pointer to void). The imported entities are returned in `outDimTags' as a vector of (dim, tag) pairs. If the optional argument `highestDimOnly' is set, only import the highest dimensional entities in `shape'. In Python, this function can be used for integration with PythonOCC, in which the SwigPyObject pointer of `TopoDS_Shape' must be passed as an int to `shape', i.e., `shape = int(pythonocc_shape.this)'. Warning: this function is unsafe, as providing an invalid pointer will lead to undefined behavior.

| Parameter | Type | Default |
|-----------|------|---------|
| `shape` | `number` | *required* |
| `highestDimOnly` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelOccImportShapesNativePointer`</small>

### `intersect`

```ts
gmsh.model.occ.intersect(objectDimTags: number[], toolDimTags: number[], tag?: number, removeObject?: boolean, removeTool?: boolean): { outDimTags: number[]; outDimTagsMap: number[][] }
```

Compute the boolean intersection (the common parts) of the entities `objectDimTags' and `toolDimTags' (vectors of (dim, tag) pairs) in the OpenCASCADE CAD representation. Return the resulting entities in `outDimTags', and the correspondance between input and resulting entities in `outDimTagsMap'. If `tag' is positive, try to set the tag explicitly (only valid if the boolean operation results in a single entity). Remove the object if `removeObject' is set. Remove the tool if `removeTool' is set.

| Parameter | Type | Default |
|-----------|------|---------|
| `objectDimTags` | `number[]` | *required* |
| `toolDimTags` | `number[]` | *required* |
| `tag` | `number` | `-1` |
| `removeObject` | `boolean` | `true` |
| `removeTool` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelOccIntersect`</small>

### `mirror`

```ts
gmsh.model.occ.mirror(dimTags: number[], a: number, b: number, c: number, d: number): void
```

Mirror the entities `dimTags' (given as a vector of (dim, tag) pairs) in the OpenCASCADE CAD representation, with respect to the plane of equation `a' * x + `b' * y + `c' * z + `d' = 0.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `a` | `number` | *required* |
| `b` | `number` | *required* |
| `c` | `number` | *required* |
| `d` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccMirror`</small>

### `offsetCurve`

```ts
gmsh.model.occ.offsetCurve(curveLoopTag: number, offset: number): { outDimTags: number[] }
```

Create an offset curve based on the curve loop `curveLoopTag' with offset `offset'. Return the offset curves in `outDimTags' as a vector of (dim, tag) pairs.

| Parameter | Type | Default |
|-----------|------|---------|
| `curveLoopTag` | `number` | *required* |
| `offset` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccOffsetCurve`</small>

### `remove`

```ts
gmsh.model.occ.remove(dimTags: number[], recursive?: boolean): void
```

Remove the entities `dimTags' (given as a vector of (dim, tag) pairs) in the OpenCASCADE CAD representation, provided that they are not on the boundary of higher-dimensional entities. If `recursive' is true, remove all the entities on their boundaries, down to dimension 0.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `recursive` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelOccRemove`</small>

### `removeAllDuplicates`

```ts
gmsh.model.occ.removeAllDuplicates(): void
```

Remove all duplicate entities in the OpenCASCADE CAD representation (different entities at the same geometrical location) after intersecting (using boolean fragments) all highest dimensional entities.

<small>Gmsh C symbol: `gmshModelOccRemoveAllDuplicates`</small>

### `revolve`

```ts
gmsh.model.occ.revolve(dimTags: number[], x: number, y: number, z: number, ax: number, ay: number, az: number, angle: number, numElements?: number[], heights?: number[], recombine?: boolean): { outDimTags: number[] }
```

Extrude the entities `dimTags' (given as a vector of (dim, tag) pairs) in the OpenCASCADE CAD representation, using a rotation of `angle' radians around the axis of revolution defined by the point (`x', `y', `z') and the direction (`ax', `ay', `az'). Return extruded entities in `outDimTags'. If the `numElements' vector is not empty, also extrude the mesh: the entries in `numElements' give the number of elements in each layer. If the `height' vector is not empty, it provides the (cumulative) height of the different layers, normalized to 1. When the mesh is extruded the angle should be strictly smaller than 2*Pi. If `recombine' is set, recombine the mesh in the layers.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `ax` | `number` | *required* |
| `ay` | `number` | *required* |
| `az` | `number` | *required* |
| `angle` | `number` | *required* |
| `numElements` | `number[]` | `[]` |
| `heights` | `number[]` | `[]` |
| `recombine` | `boolean` | `false` |

<small>Gmsh C symbol: `gmshModelOccRevolve`</small>

### `rotate`

```ts
gmsh.model.occ.rotate(dimTags: number[], x: number, y: number, z: number, ax: number, ay: number, az: number, angle: number): void
```

Rotate the entities `dimTags' (given as a vector of (dim, tag) pairs) in the OpenCASCADE CAD representation by `angle' radians around the axis of revolution defined by the point (`x', `y', `z') and the direction (`ax', `ay', `az').

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `x` | `number` | *required* |
| `y` | `number` | *required* |
| `z` | `number` | *required* |
| `ax` | `number` | *required* |
| `ay` | `number` | *required* |
| `az` | `number` | *required* |
| `angle` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccRotate`</small>

### `setMaxTag`

```ts
gmsh.model.occ.setMaxTag(dim: number, maxTag: number): void
```

Set the maximum tag `maxTag' for entities of dimension `dim' in the OpenCASCADE CAD representation.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `maxTag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccSetMaxTag`</small>

### `symmetrize`

```ts
gmsh.model.occ.symmetrize(dimTags: number[], a: number, b: number, c: number, d: number): void
```

Mirror the entities `dimTags' (given as a vector of (dim, tag) pairs) in the OpenCASCADE CAD representation, with respect to the plane of equation `a' * x + `b' * y + `c' * z + `d' = 0. (This is a deprecated synonym for `mirror'.)

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `a` | `number` | *required* |
| `b` | `number` | *required* |
| `c` | `number` | *required* |
| `d` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccSymmetrize`</small>

### `synchronize`

```ts
gmsh.model.occ.synchronize(): void
```

Synchronize the OpenCASCADE CAD representation with the current Gmsh model. This can be called at any time, but since it involves a non trivial amount of processing, the number of synchronization points should normally be minimized. Without synchronization the entities in the OpenCASCADE CAD representation are not available to any function outside of the OpenCASCADE CAD kernel functions.

<small>Gmsh C symbol: `gmshModelOccSynchronize`</small>

### `translate`

```ts
gmsh.model.occ.translate(dimTags: number[], dx: number, dy: number, dz: number): void
```

Translate the entities `dimTags' (given as a vector of (dim, tag) pairs) in the OpenCASCADE CAD representation along (`dx', `dy', `dz').

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `dx` | `number` | *required* |
| `dy` | `number` | *required* |
| `dz` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccTranslate`</small>

## `gmsh.model.geo.mesh`

### `setAlgorithm`

```ts
gmsh.model.geo.mesh.setAlgorithm(dim: number, tag: number, val: number): void
```

Set the meshing algorithm on the entity of dimension `dim' and tag `tag' in the built-in CAD kernel representation. Currently only supported for `dim' == 2.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `val` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoMeshSetAlgorithm`</small>

### `setRecombine`

```ts
gmsh.model.geo.mesh.setRecombine(dim: number, tag: number, angle?: number): void
```

Set a recombination meshing constraint on the entity of dimension `dim' and tag `tag' in the built-in CAD kernel representation. Currently only entities of dimension 2 (to recombine triangles into quadrangles) are supported; `angle' specifies the threshold angle for the simple recombination algorithm.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `angle` | `number` | `45.0` |

<small>Gmsh C symbol: `gmshModelGeoMeshSetRecombine`</small>

### `setReverse`

```ts
gmsh.model.geo.mesh.setReverse(dim: number, tag: number, val?: boolean): void
```

Set a reverse meshing constraint on the entity of dimension `dim' and tag `tag' in the built-in CAD kernel representation. If `val' is true, the mesh orientation will be reversed with respect to the natural mesh orientation (i.e. the orientation consistent with the orientation of the geometry). If `val' is false, the mesh is left as-is.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `val` | `boolean` | `true` |

<small>Gmsh C symbol: `gmshModelGeoMeshSetReverse`</small>

### `setSize`

```ts
gmsh.model.geo.mesh.setSize(dimTags: number[], size: number): void
```

Set a mesh size constraint on the entities `dimTags' (given as a vector of (dim, tag) pairs) in the built-in CAD kernel representation. Currently only entities of dimension 0 (points) are handled.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `size` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoMeshSetSize`</small>

### `setSizeFromBoundary`

```ts
gmsh.model.geo.mesh.setSizeFromBoundary(dim: number, tag: number, val: number): void
```

Force the mesh size to be extended from the boundary, or not, for the entity of dimension `dim' and tag `tag' in the built-in CAD kernel representation. Currently only supported for `dim' == 2.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `val` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoMeshSetSizeFromBoundary`</small>

### `setSmoothing`

```ts
gmsh.model.geo.mesh.setSmoothing(dim: number, tag: number, val: number): void
```

Set a smoothing meshing constraint on the entity of dimension `dim' and tag `tag' in the built-in CAD kernel representation. `val' iterations of a Laplace smoother are applied.

| Parameter | Type | Default |
|-----------|------|---------|
| `dim` | `number` | *required* |
| `tag` | `number` | *required* |
| `val` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelGeoMeshSetSmoothing`</small>

### `setTransfiniteCurve`

```ts
gmsh.model.geo.mesh.setTransfiniteCurve(tag: number, nPoints: number, meshType?: string, coef?: number): void
```

Set a transfinite meshing constraint on the curve `tag' in the built-in CAD kernel representation, with `numNodes' nodes distributed according to `meshType' and `coef'. Currently supported types are "Progression" (geometrical progression with power `coef') and "Bump" (refinement toward both extremities of the curve).

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `nPoints` | `number` | *required* |
| `meshType` | `string` | `"Progression"` |
| `coef` | `number` | `1.0` |

<small>Gmsh C symbol: `gmshModelGeoMeshSetTransfiniteCurve`</small>

### `setTransfiniteSurface`

```ts
gmsh.model.geo.mesh.setTransfiniteSurface(tag: number, arrangement?: string, cornerTags?: number[]): void
```

Set a transfinite meshing constraint on the surface `tag' in the built-in CAD kernel representation. `arrangement' describes the arrangement of the triangles when the surface is not flagged as recombined: currently supported values are "Left", "Right", "AlternateLeft" and "AlternateRight". `cornerTags' can be used to specify the (3 or 4) corners of the transfinite interpolation explicitly; specifying the corners explicitly is mandatory if the surface has more that 3 or 4 points on its boundary.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `arrangement` | `string` | `"Left"` |
| `cornerTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelGeoMeshSetTransfiniteSurface`</small>

### `setTransfiniteVolume`

```ts
gmsh.model.geo.mesh.setTransfiniteVolume(tag: number, cornerTags?: number[]): void
```

Set a transfinite meshing constraint on the volume `tag' in the built-in CAD kernel representation. `cornerTags' can be used to specify the (6 or 8) corners of the transfinite interpolation explicitly.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `cornerTags` | `number[]` | `[]` |

<small>Gmsh C symbol: `gmshModelGeoMeshSetTransfiniteVolume`</small>

## `gmsh.model.mesh.field`

### `add`

```ts
gmsh.model.mesh.field.add(fieldType: string, tag?: number): number
```

Add a new mesh size field of type `fieldType'. If `tag' is positive, assign the tag explicitly; otherwise a new tag is assigned automatically. Return the field tag. Available field types are listed in the "Gmsh mesh size fields" chapter of the Gmsh reference manual (https://gmsh.info/doc/texinfo/gmsh.html#Gmsh-mesh-size-fields).

| Parameter | Type | Default |
|-----------|------|---------|
| `fieldType` | `string` | *required* |
| `tag` | `number` | `-1` |

<small>Gmsh C symbol: `gmshModelMeshFieldAdd`</small>

### `getNumber`

```ts
gmsh.model.mesh.field.getNumber(tag: number, option: string): { value: number }
```

Get the value of the numerical option `option' for field `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `option` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelMeshFieldGetNumber`</small>

### `getNumbers`

```ts
gmsh.model.mesh.field.getNumbers(tag: number, option: string): { values: number[] }
```

Get the value of the numerical list option `option' for field `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `option` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelMeshFieldGetNumbers`</small>

### `getString`

```ts
gmsh.model.mesh.field.getString(tag: number, option: string): { value: string }
```

Get the value of the string option `option' for field `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `option` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelMeshFieldGetString`</small>

### `getType`

```ts
gmsh.model.mesh.field.getType(tag: number): { fileType: string }
```

Get the type `fieldType' of the field with tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshFieldGetType`</small>

### `list`

```ts
gmsh.model.mesh.field.list(): { tags: number[] }
```

Get the list of all fields.

<small>Gmsh C symbol: `gmshModelMeshFieldList`</small>

### `remove`

```ts
gmsh.model.mesh.field.remove(tag: number): void
```

Remove the field with tag `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshFieldRemove`</small>

### `setAsBackgroundMesh`

```ts
gmsh.model.mesh.field.setAsBackgroundMesh(tag: number): void
```

Set the field `tag' as the background mesh size field.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshFieldSetAsBackgroundMesh`</small>

### `setAsBoundaryLayer`

```ts
gmsh.model.mesh.field.setAsBoundaryLayer(tag: number): void
```

Set the field `tag' as a boundary layer size field.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshFieldSetAsBoundaryLayer`</small>

### `setNumber`

```ts
gmsh.model.mesh.field.setNumber(tag: number, option: string, value: number): void
```

Set the numerical option `option' to value `value' for field `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `option` | `string` | *required* |
| `value` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelMeshFieldSetNumber`</small>

### `setNumbers`

```ts
gmsh.model.mesh.field.setNumbers(tag: number, option: string, values: number[]): void
```

Set the numerical list option `option' to value `values' for field `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `option` | `string` | *required* |
| `values` | `number[]` | *required* |

<small>Gmsh C symbol: `gmshModelMeshFieldSetNumbers`</small>

### `setString`

```ts
gmsh.model.mesh.field.setString(tag: number, option: string, value: string): void
```

Set the string option `option' to value `value' for field `tag'.

| Parameter | Type | Default |
|-----------|------|---------|
| `tag` | `number` | *required* |
| `option` | `string` | *required* |
| `value` | `string` | *required* |

<small>Gmsh C symbol: `gmshModelMeshFieldSetString`</small>

## `gmsh.model.occ.mesh`

### `setSize`

```ts
gmsh.model.occ.mesh.setSize(dimTags: number[], size: number): void
```

Set a mesh size constraint on the entities `dimTags' (given as a vector of (dim, tag) pairs) in the OpenCASCADE CAD representation. Currently only entities of dimension 0 (points) are handled.

| Parameter | Type | Default |
|-----------|------|---------|
| `dimTags` | `number[]` | *required* |
| `size` | `number` | *required* |

<small>Gmsh C symbol: `gmshModelOccMeshSetSize`</small>
