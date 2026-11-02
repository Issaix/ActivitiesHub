# Tasks

## 1. Make the existing test harness executable

- [x] 1.1 Update `tests/EventsHub.UnitTests/Controllers/EventsControllerTests.cs` and its request-services setup for the parameterless controller, registered MediatR handlers, current mapper service, and required cancellation token; align the missing-event assertion with the current thrown exception without changing production HTTP behavior. Verify `dotnet test tests/EventsHub.UnitTests/EventsHub.UnitTests.csproj --filter FullyQualifiedName~EventsControllerTests` compiles and passes.
- [x] 1.2 Correct the root README's stale controller-test compatibility note after the harness passes. Verify the documented test command works and the note reflects any genuinely remaining baseline limitations.

## 2. Build the typed mapping contracts and conventional mapping engine

- [ ] 2.1 Add project-owned `IMapper`, `MappingProfile`, typed `CreateMap` builders, immutable configuration, and mapping/configuration exceptions under `src/EventsHub.Application/Core/Mapping/`. Verify the application project builds and a test profile can declare a typed source/destination pair without AutoMapper types.
- [ ] 2.2 Implement exact declared-pair lookup, strict conventional public-property validation, cached assignment delegates, and mapping onto an existing destination. Add NUnit tests proving case-sensitive conventions, destination identity, unchanged source values, null/default value copying, shallow references, missing-pair errors, null-argument errors, and rejection of identical source/destination references; verify the mapper test filter passes.
- [ ] 2.3 Add cached new-destination factories for public parameterless constructors without a `new()` constraint. Add tests proving distinct results, required-member models can be fully mapped, constructor initialization runs, and a constructor-bound pair still works with an existing destination; verify its unsupported new-destination call reports a clear error.
- [ ] 2.4 Start `docs/Mapping.md` with both mapping overloads, declared-pair selection, conventional property rules, shallow/null semantics, and constructor limits. Verify every basic example is represented by a compiling test profile or behavioral test in this group.

## 3. Add focused custom member rules and configuration validation

- [ ] 3.1 Implement typed `ForMember(... MapFrom(...))` and `ForMember(... Ignore())`, with explicit rules taking precedence over conventions. Add tests for renamed/computed values, an explicit string-to-number conversion, conventional-value override, and ignored existing/constructor values; verify all member-rule scenarios pass.
- [ ] 3.2 Reject duplicate type pairs, repeated explicit member rules, invalid/missing member-option actions, incompatible uncovered properties, and unsupported member selectors. Add tests for fields, nested paths, methods, indexers, static/read-only/init-only members, and diagnostic profile/pair/member context; verify invalid profiles fail during configuration rather than mapping.
- [ ] 3.3 Evaluate mapped values before destination assignments and contextualize transformation errors. Verify a throwing transformation preserves prior destination values during evaluation, preserves its inner exception, and reports the pair/member; add a concurrent mapping test with independent destinations and confirm there is no cross-call value leakage.
- [ ] 3.4 Extend `docs/Mapping.md` with a complete future profile using conventions, a transformation, and an ignore rule; explain strict validation, callback purity, and the supported feature boundary. Verify the example's declarations and expected results are exercised by the member-rule tests.

## 4. Register profiles and replace the AutoMapper integration

- [ ] 4.1 Implement `AddMappingProfiles(params Assembly[] assemblies)` with explicit assembly scanning, deduplication, actionable discovery errors, eager validation/compilation, and singleton mapper/configuration registration. Add dependency-registration tests for future-profile discovery, multiple supplied assemblies, repeated assembly input, invalid concrete profile constructors, and duplicate/conflicting declarations; verify failures occur at registration and valid services resolve.
- [ ] 4.2 Migrate `src/EventsHub.Application/Core/MappingProfiles.cs` to `MappingProfile`, preserving `CreateMap<Event, Event>()`; switch `EditEvent.Handler`, `src/EventsHub.Api/Program.cs`, and the controller test harness to the custom mapper. Verify all ten event properties map correctly and the migrated API/controller tests build and pass with the real custom mapper resolved from services.
- [ ] 4.3 Remove the AutoMapper package reference from `src/EventsHub.Application/Eventshub.Application.csproj`, adding only a direct Microsoft dependency injection abstractions reference if needed by the registration extension. Verify restore and application/API builds succeed and `rg -n 'using AutoMapper|AddAutoMapper|PackageReference.*AutoMapper' src tests --glob '!**/bin/**' --glob '!**/obj/**' finds no active consumers.
- [ ] 4.4 Update root README mapping descriptions and extend `docs/Mapping.md` with dependency registration, supported assembly discovery, adding a future profile, and migration from the previous imports/base type. Verify examples use the implemented namespace and registration call, local links resolve, and registration tests demonstrate adding a profile without changing the engine.

## 5. Prove persisted event edits retain their behavior

- [ ] 5.1 Add an isolated SQLite fixture with explicit connection lifetime and an event-edit handler regression test using the real mapper. Verify the original tracked object is updated, all submitted event fields including the ID and string coordinates persist through a fresh context, and the row count is unchanged.
- [ ] 5.2 Add focused controller success coverage that routes an edit through real request-services/MediatR/custom-mapper setup and asserts 204 with no response body. Verify it passes independently and with the existing controller suite, without changing missing-event HTTP behavior.
- [ ] 5.3 Add a short persisted-edit verification example to `docs/Mapping.md`, including how to run the focused regression tests and why existing-destination mapping preserves tracking. Verify the command selects and passes the new edit tests.

## 6. Run integration checks and refresh the repository graph

- [ ] 6.1 Run `dotnet build src/EventsHub.Api/Eventshub.Api.csproj`, `dotnet build src/EventsHub.OpenApi/EventsHub.OpenApi.csproj`, `dotnet build EventsHub.slnx`, and `dotnet test tests/EventsHub.UnitTests/EventsHub.UnitTests.csproj`. Verify required builds/tests pass, record results, and identify any remaining baseline failures precisely rather than extending the mapper's functional scope.
- [ ] 6.2 After the implementation changes, run `graphify update .` using a working installed interpreter if the launcher remains inaccessible. Verify Graphify queries for how the current profile connects with the custom mapper and edit handler identify the migrated sources; confirm no active AutoMapper dependency remains.
- [ ] 6.3 Run `git diff --check`, review dependency changes, and check the specification scenarios against the implemented behavioral tests. Verify there are no whitespace errors and all mapping, profile-extension, failure, concurrency, registration, and persisted-edit acceptance scenarios are covered.
