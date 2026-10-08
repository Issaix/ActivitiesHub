# Proposal

## Why

EventsHub currently depends on AutoMapper for one `Event -> Event` profile and the event edit handler. Replace that dependency with a project-owned mapper that preserves event editing and gives future profiles a focused, documented API for property conventions, explicit transformations, and ignored members.

## What Changes

- Introduce a custom `IMapper`, `MappingProfile`, and typed fluent profile API supporting `CreateMap<TSource, TDestination>()`, `ForMember(... MapFrom(...))`, and `ForMember(... Ignore())`.
- Support mapping onto an existing destination and creating a new destination for registered reference-type pairs with a public parameterless destination constructor.
- Discover profiles from explicitly supplied assemblies, validate their registrations before serving requests, and reuse immutable mapping plans.
- Define predictable behavior for null arguments and member values, missing maps, duplicate registrations, incompatible properties, and unsupported member expressions.
- Migrate the existing `MappingProfiles` declaration and `EditEvent.Handler` to the custom mapper; preserve the EF Core tracked instance and all current event field values.
- Replace the API's `AddAutoMapper` registration and remove the AutoMapper package reference.
- Add behavioral tests for current event mapping, future profiles, configuration failures, dependency registration, and persisted event edits; document profile authoring.
- **BREAKING (internal C# API):** application imports and profile inheritance move from AutoMapper types to project-owned types. HTTP routes, request/response contracts, and the database schema do not change.

## Capabilities

### New Capabilities

- `custom-object-mapping`: Registered profile-based object mapping with property conventions, typed member transformations, ignore rules, configuration validation, dependency injection, and preserved event edit behavior.

### Modified Capabilities

None. The project has no existing capability specifications.

## Impact

- New mapping infrastructure under `src/EventsHub.Application/Core/Mapping/`.
- Migrate `src/EventsHub.Application/Core/MappingProfiles.cs`, `src/EventsHub.Application/Events/Commands/EditEvent.cs`, and `src/EventsHub.Api/Program.cs`.
- Remove AutoMapper 13.0.1 from `src/EventsHub.Application/Eventshub.Application.csproj`; use .NET and the existing Microsoft dependency injection infrastructure for the replacement.
- Add focused NUnit coverage and an isolated SQLite event edit regression test. Existing controller tests contain constructor/signature mismatches; any repair needed to run these tests must stay limited to the test harness and existing handler behavior.
- Update the root README and add mapper profile documentation during implementation.
- The frontend, OpenAPI host behavior, generated clients, and persistence model require no functional changes.

## Non-goals

Broad AutoMapper compatibility, `ProjectTo`, implicit nested/collection mapping, inheritance-based map selection, reverse-map generation, constructor binding, service-dependent resolvers, and changes to missing-event HTTP behavior.
