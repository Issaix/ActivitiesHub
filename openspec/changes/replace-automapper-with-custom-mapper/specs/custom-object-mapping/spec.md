# Spec Delta

## Purpose

Provide predictable profile-based object mapping for EventsHub application developers, with reusable conventions and explicit member rules that preserve existing event editing and support future registered type pairs.

## ADDED Requirements

### Requirement: Extensible profile registration

The mapping service SHALL accept profiles that declare mappings between explicit source and destination reference types. Registration SHALL discover concrete profiles with public parameterless constructors in explicitly supplied assemblies, combine their maps, and make them available through application dependency injection. Adding a valid profile in a registered assembly SHALL require no changes to the mapper engine or existing consumers.

#### Scenario: Discover a future profile
- **WHEN** a new profile declaring a previously unregistered source-to-destination pair is added to an assembly supplied during registration
- **THEN** the application can resolve the mapping service and use that pair without modifying the engine

#### Scenario: Combine supplied assemblies
- **WHEN** registration supplies multiple assemblies containing profiles for different pairs
- **THEN** mappings from every supplied assembly are available
- **AND** scanning the same assembly more than once does not duplicate its profiles

### Requirement: Matching-property conventions

For a registered pair, the service SHALL copy public readable source properties to public writable destination properties with identical case-sensitive names and assignable declared types. An explicit member rule SHALL take precedence over the convention. Every eligible destination property SHALL have a compatible source property, an explicit transformation, or an explicit ignore rule; otherwise configuration SHALL be rejected before requests are served. Static properties, indexers, fields, read-only properties, and initialization-only properties SHALL be excluded from conventional destination mapping.

#### Scenario: Copy compatible matching properties
- **WHEN** a registered source and destination expose matching string, date, Boolean, or nullable-value properties with assignable types
- **THEN** those destination properties receive the source values

#### Scenario: Reject an uncovered destination property
- **WHEN** a destination has an eligible writable property without a compatible same-name source property and without an explicit transformation or ignore rule
- **THEN** configuration fails with the type pair and affected property identified

### Requirement: Explicit member transformations

Profiles SHALL support a typed transformation from a source object to the value of a directly selected destination property. The service SHALL apply the transformation instead of any same-name convention, allowing renaming, computed values, and explicitly authored conversions.

#### Scenario: Rename and compute values
- **WHEN** a profile maps a source title to a differently named destination property and computes another destination value from source fields
- **THEN** mapping assigns both configured results along with the remaining convention-mapped values

#### Scenario: Override a conventional mapping
- **WHEN** a profile explicitly transforms a destination property that also has a compatible same-name source property
- **THEN** the destination receives the transformation result rather than the conventional value

### Requirement: Ignored destination members

Profiles SHALL support ignoring a directly selected destination property. An ignore rule SHALL suppress both conventional assignment and the requirement for a compatible source property. The service SHALL leave ignored members at their existing or constructor-initialized values.

#### Scenario: Preserve an existing ignored value
- **WHEN** mapping onto an existing destination whose property is ignored by its profile
- **THEN** that property's original value is preserved even if the source exposes a same-name property

#### Scenario: Preserve a new destination default
- **WHEN** creating a destination whose constructor initializes an ignored property
- **THEN** the constructor-initialized value is preserved

### Requirement: Mapping onto an existing object

The service SHALL support mapping a registered pair onto a supplied destination, mutate that exact instance, and return the same instance. Mapping SHALL NOT mutate the source. Using the same object as source and destination SHALL be rejected with a clear argument error before mutation so computed mappings cannot depend on partially updated input.

#### Scenario: Preserve destination identity
- **WHEN** a source is mapped onto an existing destination
- **THEN** the returned reference is the supplied destination reference
- **AND** all configured non-ignored values are copied while source values remain unchanged

#### Scenario: Reject identical source and destination references
- **WHEN** the caller supplies the same object as source and destination
- **THEN** mapping fails before any property assignment with an argument error identifying the invalid destination

### Requirement: Creating a destination object

The service SHALL support creating and mapping a destination for a registered pair when the destination is a concrete reference type with a public parameterless constructor. Each call SHALL return a distinct destination instance. An unsupported destination constructor SHALL cause a clear mapping error before construction; it SHALL NOT prevent the same registered pair from being used with an already-created destination.

#### Scenario: Create separate mapped instances
- **WHEN** the caller maps a source into a new destination twice for a constructible registered pair
- **THEN** both results contain the configured values and are different object references

#### Scenario: Require an existing destination for a constructor-bound type
- **WHEN** a registered destination requires constructor arguments
- **THEN** new-destination mapping fails with an error identifying the destination and constructor requirement
- **AND** mapping onto a caller-created destination remains available

### Requirement: Null and reference-value semantics

The service SHALL reject a null source or supplied null destination with an argument error identifying the null parameter. Member values, including null reference values, nullable values, Boolean false, and value-type defaults, SHALL be copied without implicit substitution or omission. Assignable reference and collection properties SHALL be assigned shallowly; the service SHALL NOT implicitly traverse nested objects or map collection elements.

#### Scenario: Reject null objects
- **WHEN** a caller supplies a null source or a null destination to the existing-destination operation
- **THEN** mapping fails before mutation and identifies the null argument

#### Scenario: Copy null and default member values
- **WHEN** a valid mapping supplies null reference or nullable members, false, or a value-type default
- **THEN** the corresponding destination members receive those exact values

#### Scenario: Assign references without implicit recursion
- **WHEN** compatible matching properties contain a nested object or collection reference
- **THEN** the destination receives the same reference
- **AND** registered mappings for the referenced element types are not invoked automatically

### Requirement: Deterministic configuration errors

Configuration SHALL reject duplicate type-pair declarations, multiple explicit rules for one destination property, incompatible conventional assignments, and unsupported destination selectors. Selectors SHALL target one direct public instance property with an ordinary public setter; nested paths, methods, fields, indexers, static properties, initialization-only setters, and read-only properties SHALL be rejected. Errors SHALL identify the profile and type pair and, for member errors, the destination member or rejected selector. Conflicts SHALL NOT be resolved silently by registration order.

#### Scenario: Reject duplicate mappings
- **WHEN** two profiles declare the same source-to-destination pair
- **THEN** registration fails with the conflicting pair and profiles identified

#### Scenario: Reject conflicting explicit member rules
- **WHEN** a profile declares more than one explicit rule for the same destination property
- **THEN** configuration fails rather than selecting the last rule

#### Scenario: Reject unsupported member selectors
- **WHEN** a profile selects a nested property, field, method result, indexer, or property without an ordinary public setter
- **THEN** configuration fails before mapping and identifies the rejected selector

### Requirement: Explicit pair lookup and safe reuse

Mapping SHALL require a registered pair selected by the declared source and destination types of the mapping operation. Missing pairs SHALL fail with a clear error naming both types; the service SHALL NOT generate a map or choose a base-type map implicitly. Completed configuration SHALL be immutable and reusable across concurrent calls with independent destination objects, without values leaking between calls.

#### Scenario: Reject an unregistered pair
- **WHEN** a caller requests a pair that was not registered, even if a related base-type pair exists
- **THEN** mapping fails with an error naming the requested source and destination types

#### Scenario: Reuse a service concurrently
- **WHEN** concurrent callers map different source values onto independent destinations using one configured service
- **THEN** each destination receives only its own source values
- **AND** configuration remains unchanged

### Requirement: Preserve event edit behavior

Replacing the mapper SHALL preserve successful event edits: locate the persisted event by the submitted ID, update the existing tracked object with all current submitted event fields, and persist the changes. The event ID, title, date, description, category, cancellation flag, city, venue, latitude, and longitude SHALL retain their current mapping semantics, including string coordinates. The event edit endpoint SHALL continue returning 204 with no response body on success, without changing HTTP contracts or the persistence schema.

#### Scenario: Persist a complete event edit
- **WHEN** a valid edit submits an existing event ID and changed values for the editable event fields
- **THEN** the existing tracked object is updated and saved with those values
- **AND** reading it through a fresh persistence context returns those values and the same ID
- **AND** no replacement entity or additional event is inserted

#### Scenario: Preserve the successful HTTP response
- **WHEN** an edit of an existing event succeeds using the custom mapper
- **THEN** the endpoint returns 204 with no response body
