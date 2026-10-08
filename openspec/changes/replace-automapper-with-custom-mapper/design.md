# Design

## Context

See [proposal.md](proposal.md) for motivation and [the mapping specification](specs/custom-object-mapping/spec.md) for the behavior contract. The user selected a focused profile API rather than broad AutoMapper compatibility.

The current mapping surface is small and verified in the source:

- `src/EventsHub.Application/Core/MappingProfiles.cs` inherits AutoMapper `Profile` and contains only `CreateMap<Event, Event>()`.
- `src/EventsHub.Application/Events/Commands/EditEvent.cs` injects AutoMapper `IMapper`, finds an event through `AppDbContext`, maps the submitted event onto that tracked instance, and saves it.
- `src/EventsHub.Api/Program.cs` registers profiles from `typeof(MappingProfiles).Assembly` with `AddAutoMapper`.
- `src/EventsHub.Application/Eventshub.Application.csproj` references AutoMapper 13.0.1. Projects target .NET 10.
- `Event` contains ten public writable properties: nine convention-mapped data fields plus the lookup ID. Coordinates are strings, and several string properties use C# required-member declarations.
- There are no existing OpenSpec capability specs. Graphify surfaced the profile, handler, mapper, and persistence connections; the source confirms registration and exact mapping behavior.
- Existing NUnit controller tests target an older controller constructor and omit the current list action's cancellation token. Their missing-event expectation also disagrees with the handler's current exception behavior. These are baseline test-harness issues, not mapper requirements.

## Goals / Non-Goals

**Goals:**

- Keep mapping infrastructure in the application layer, independent of persistence and HTTP handling.
- Compile and validate property assignments once; use immutable plans for mapping calls.
- Provide typed profile extensions with explicit, deterministic member selection and errors.
- Keep the existing event-edit call shape and tracked destination identity.

**Non-Goals:**

- See the proposal's feature exclusions; this is not a general AutoMapper clone.
- No runtime registration, implicit recursive conversion, or constructor-parameter injection.
- No transaction or rollback guarantee for arbitrary user transformation callbacks; event persistence remains the handler's responsibility.
- No broad test-suite rewrite or correction of unrelated API error responses.

## Decisions

### 1. Project-owned mapper contracts and profile declarations

Add a `Core/Mapping/` area under `EventsHub.Application`, with its own namespace `EventsHub.Application.Core.Mapping`. Define `IMapper`, `MappingProfile`, typed map/member builders, an immutable configuration, and the runtime mapper there. Keep the existing `MappingProfiles` class in `Core/MappingProfiles.cs`; change its base type and namespace imports so its `CreateMap<Event, Event>()` declaration remains recognizable.

The runtime contract has two operations for reference types:

```csharp
TDestination Map<TSource, TDestination>(TSource source, TDestination destination);
TDestination Map<TSource, TDestination>(TSource source);
```

Both generic parameters are constrained to `class`. The first returns the supplied destination; the second constructs a new one. Pair lookup uses these declared generic types, not runtime-derived types. A caller mapping a derived instance as a registered base type must explicitly use the base generic type arguments or base-typed variables.

A profile exposes protected `CreateMap<TSource, TDestination>()`. Its fluent builder supports typed member selectors and `MapFrom` or `Ignore` options. A future authoring example, using hypothetical DTOs:

```csharp
CreateMap<SourceDto, DestinationDto>()
    .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Title.Trim()))
    .ForMember(d => d.InternalNote, o => o.Ignore());
```

Require exactly one operation inside each member-options callback. Each destination member has at most one explicit rule, so conflicting declarations fail instead of relying on declaration order.

Alternative considered: a registry of manually authored copy functions. That would preserve today's behavior but require repetitive assignments for every future profile and would not provide the conventions the user selected. Retaining AutoMapper behind a wrapper would retain the dependency being replaced.

### 2. Bounded convention mapping and strict validation

Enumerate public instance source properties with public getters and eligible destination properties with ordinary public setters. Skip static members, fields, indexers, read-only properties, and init-only destination properties. Match names with ordinal case-sensitive comparison and require the destination's declared type to be assignable from the source property's declared type. Do not infer string-to-number, enum, narrowing, flattening, or nested conversions. Explicit typed transformations author any needed conversion.

For every eligible destination property, resolve exactly one action: ignore; explicit transformation; or compatible conventional assignment. A missing/incompatible source without an override is a configuration error. Extra source properties have no effect. Validate direct destination-property selectors and reject nested paths, methods, fields, indexers, and unsupported setters. Reject duplicate map pairs, duplicate explicit member rules, and options callbacks that choose no action or both actions.

Errors use project-owned configuration exceptions with profile, source/destination pair, and member or selector context. Null source/destination arguments use `ArgumentNullException`; identical source/destination references use `ArgumentException`. Missing maps and unsupported new-destination construction use clear project-owned mapping exceptions naming the pair and reason. Transformation failures wrap the original exception with pair and member context.

Alternative considered: silently skip unmatched properties or select the last duplicate rule. Strict validation makes a new DTO field or conflicting profile visible before traffic reaches it, reducing silent data loss.

### 3. Compile immutable plans once and use shallow assignment

Build one cached assignment delegate per registered pair using BCL expression trees, with explicit destination setters and source-access/transformation expressions. Use reflection during configuration rather than per-property reflection on every mapping call. Freeze the registry after validation and expose no runtime mutation API. Configuration can be constructed directly from profile instances for isolated tests, as well as through assembly registration.

Evaluate all mapped values into locals before applying destination assignments. This avoids partial updates when a transformation fails during value evaluation; exceptions thrown by destination setters still carry no rollback guarantee. Source objects and transformations are treated as inputs: profile authors must use pure transformations and avoid shared mutable state. Reject the same source/destination object before any assignment, rather than letting computed rules depend on assignment order.

Null member values and value-type defaults are copied as supplied. Nullable reference annotations do not add runtime validation. Compatible object and collection references are assigned shallowly; profile authors must explicitly construct transformed nested values if needed. Thread safety applies to immutable configuration and independent destination objects; it does not make concurrently shared destinations or stateful user lambdas safe.

Alternative considered: reflection-only mapping. It is simpler initially, but cached delegates retain the same bounded property model and remove repetitive reflection work without adding a library or generator. Full source generation or recursive graph traversal is unnecessary for this change.

### 4. Separate object construction from assignment

For the new-destination overload, cache a factory for concrete destinations with a public parameterless constructor. Reflect or compile the constructor call without imposing a generic `new()` constraint, so DTOs and the existing `Event` class with C# required properties can be initialized by a complete mapping plan. Convention/member validation ensures eligible properties are covered; this does not replace application-level validation of actual field values.

Allow registration of a pair whose destination lacks that constructor: it remains valid for an existing destination. Reject only calls to the new-destination operation for that pair, with a construction error before invoking a factory. Do not bypass constructors or allocate uninitialized objects. Ignore rules retain the existing or constructor-initialized values.

Alternative considered: require `new()` on all operations or require constructors during registration. Either would unnecessarily reject valid mapping onto existing entities and make required-member models harder to use.

### 5. Explicit assembly discovery and eager dependency registration

Provide `AddMappingProfiles(params Assembly[] assemblies)` as an application-layer service registration extension. Scan only supplied assemblies, deduplicate assembly and profile types, and discover concrete `MappingProfile` subclasses with public parameterless constructors. Abstract profiles are skipped; a discovered concrete profile with an unsupported constructor or failed construction produces an actionable configuration error. Fail assembly-load errors with assembly context instead of silently accepting partial profile discovery.

Collect all declarations, validate, and compile the complete registry eagerly inside the registration call, then register the immutable configuration and mapper as singleton services. This catches errors before `builder.Build()` completes and avoids first-request initialization. If required for direct use of the extension types, add a direct reference to the Microsoft dependency injection abstractions already present in the project's dependency graph; do not add another mapping library. Profiles and transformation expressions must not capture scoped services such as `AppDbContext`.

Replace the API registration with:

```csharp
builder.Services.AddMappingProfiles(typeof(MappingProfiles).Assembly);
```

`EditEvent.Handler` imports the custom `IMapper`, retaining `mapper.Map(request.Event, @event)` and the subsequent `SaveChangesAsync`. The application has the mapping abstraction; persistence and domain require no new references. The separate OpenAPI host describes controllers and does not execute event handlers, so its registration behavior does not change.

Alternative considered: lazy configuration through a singleton factory or scanning all loaded assemblies. Eager explicit discovery produces repeatable startup behavior and bounds where future profiles are found.

### 6. Preserve current edits and isolate regression coverage

Keep every property in the existing `Event -> Event` map, including `Id`, as a conventional assignment. The handler already loads the destination by the submitted ID; do not introduce a new ID-ignore policy or change coordinates to numbers. An isolated SQLite regression test loads a tracked event, runs the handler with the custom mapper, verifies the tracked reference and row count, and reads through a fresh context to verify all persisted fields. The controller's successful 204 behavior gets focused regression coverage.

Use NUnit for mapper behavior tests with small dedicated source/destination types and future test profiles. Register real profiles in dependency-registration tests and exercise multiple supplied assemblies with profiles defined in existing application and test assemblies. Verify failure cases during registration, and concurrency with independent destinations.

To make the existing test project executable, repair only the obsolete controller construction, request-services/MediatR setup, cancellation-token call, and expectations that contradict current handlers. Test setup must resolve the actual custom mapper; avoid adding mapper-specific production behavior to satisfy stale tests. Use temporary/in-memory SQLite with a held-open connection for new mapper regression tests rather than the shared seeded file database. No new API exception policy is part of this change.

Alternative considered: put mapper tests in a new project to bypass the stale tests. That leaves the known solution compilation failures untouched; a narrow test-harness repair makes the existing suite usable while keeping functional scope unchanged.

## Risks / Trade-offs

- [Custom infrastructure now needs maintenance] -> Keep the profile contract small, validate configuration eagerly, and test observable mapping behavior rather than duplicating the implementation.
- [Future developers expect unsupported AutoMapper features] -> Document supported operations, shallow reference semantics, constructor limits, and clear unsupported-selector errors.
- [New destination fields break strict configuration validation] -> Require a same-name source, typed transformation, or explicit ignore and report the exact member at startup.
- [Profile callbacks contain shared state or side effects] -> Document pure, service-independent callbacks and test concurrency of the immutable engine.
- [Exceptions during setters leave a destination partly changed] -> Evaluate transformed values before assignment, describe the remaining setter limitation, and keep persistence control with the caller.
- [Existing test harness obscures mapper failures] -> Apply the narrow compatibility repair above and distinguish mapper regression results from any remaining baseline failures.
- [Reflection/expression compilation complicates future trimming or native AOT] -> Treat the current untrimmed .NET 10 host as the deployment target; AOT support is outside this proposal.

## Migration Plan

1. Add mapper contracts, profile builders, validation, compiled plans, construction factories, and dependency registration with isolated behavioral tests.
2. Migrate the existing profile, API registration, and edit handler together; remove the AutoMapper package reference after no consumers remain.
3. Add persisted edit and successful-response coverage, make only the needed test-harness corrections, and run the API/OpenAPI builds and NUnit suite.
4. Update the root README and `docs/Mapping.md` with current usage and a complete future-profile example. Query Graphify before file writes and update the graph after implementation code changes, following repository guidance.
5. Deploy the API through its existing process. No database migration or frontend release is required for the mapper replacement.

Rollback consists of reverting the mapper implementation and integration changes together and restoring the original AutoMapper package, imports, and registration. No data migration reversal is needed.
