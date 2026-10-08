# Graph Report - EventsHub  (2026-09-29)

## Corpus Check
- Corpus is ~20,661 words - fits in a single context window. You may not need a graph.

## Summary
- 462 nodes · 646 edges · 33 communities (17 shown, 16 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.91)
- Token cost: unavailable. Host-agent extraction usage is not exposed by this session; recorded zeros are placeholders, not measured usage.

## Community Hubs (Navigation)
- Generated RPC clients
- Event commands and queries
- React application dependencies
- Persistence and test setup
- .NET solution packages
- Event controller tests
- Database schema migrations
- Application TypeScript settings
- Vite frontend setup
- API controller infrastructure
- Frontend development tools
- Event domain model
- Node TypeScript settings
- API launch profiles
- OpenAPI launch profiles
- Weather forecast model
- HTTP integration requests
- Social icon assets
- Graph navigation guidance
- OpenAPI client documentation
- TypeScript project references
- Graphify skill registration
- React activity types
- Project overview
- Create event request
- Delete event request
- Edit event request

## God Nodes (most connected - your core abstractions)
1. `Event` - 25 edges
2. `EventsRpcClient` - 20 edges
3. `WeatherForecastRpcClient` - 19 edges
4. `compilerOptions` - 18 edges
5. `compilerOptions` - 15 edges
6. `AppDbContext` - 13 edges
7. `Event` - 13 edges
8. `ApiException` - 13 edges
9. `EventsHub.Persistence` - 10 edges
10. `EventsHub.Domain` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GlobalTestSetup` --references--> `AppDbContext`  [EXTRACTED]
  tests/EventsHub.UnitTests/GlobalTestSetup.cs → src/EventsHub.Persistence/AppDbContext.cs
- `Cyan React atom-shaped SVG logo` --conceptually_related_to--> `React`  [INFERRED]
  web/src/assets/react.svg → web/README.md
- `Vite SVG logo: purple lightning emblem inside parentheses with dark-mode color adaptation` --conceptually_related_to--> `Vite with hot module replacement`  [INFERRED]
  web/src/assets/vite.svg → web/README.md
- `EventsControllerTests` --references--> `EventsController`  [EXTRACTED]
  tests/EventsHub.UnitTests/Controllers/EventsControllerTests.cs → src/EventsHub.Api/Controllers/EventsController.cs
- `Project graph navigation guidance` --references--> `Graph query traversal`  [EXTRACTED]
  CLAUDE.md → .claude/skills/graphify/references/query.md

## Import Cycles
- None detected.

## Communities (33 total, 16 thin omitted)

### Community 0 - "Generated RPC clients"
Cohesion: 0.07
Nodes (20): EventsHub.OpenApi.Client, ApiException, Headers, Response, Result, StatusCode, DateFormatConverter, EventsRpcClient (+12 more)

### Community 1 - "Event commands and queries"
Cohesion: 0.05
Nodes (32): Command, Event, CreateEvent, Handler, Command, Id, DeleteEvent, Handler (+24 more)

### Community 2 - "React application dependencies"
Cohesion: 0.05
Nodes (44): axios, @babel/core, babel-plugin-react-compiler, @emotion/react, @emotion/styled, eslint, @eslint/js, eslint-plugin-react-hooks (+36 more)

### Community 3 - "Persistence and test setup"
Cohesion: 0.08
Nodes (11): EventsHub.Domain, EventsHub.
Persistence, EventsHub.Application.Events.Queries, EventsHub.Application.Events.Commands, EventsHub.UnitTests, EventsHub.Persistence, EventsHub.Application.Core, MappingProfiles (+3 more)

### Community 4 - ".NET solution packages"
Cohesion: 0.07
Nodes (27): AutoMapper (13.0.1), coverlet.collector (6.0.4), MediatR (14.2.0), Microsoft.AspNetCore.Mvc.NewtonsoftJson (10.0.11), Microsoft.AspNetCore.OpenApi (10.0.11), Microsoft.EntityFrameworkCore.Design (10.0.11), Microsoft.EntityFrameworkCore.Sqlite (10.0.11), Microsoft.NET.Test.Sdk (17.14.0) (+19 more)

### Community 6 - "Database schema migrations"
Cohesion: 0.12
Nodes (3): EventsHub.Persistence.Migrations, InitialCreate, AppDbContextModelSnapshot

### Community 7 - "Application TypeScript settings"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 8 - "Vite frontend setup"
Cohesion: 0.13
Nodes (17): Events Hub HTML entry document with responsive viewport, ./src/main.tsx entry module, root DOM mount container, Purple lightning-shaped SVG favicon with cyan highlights, eslint-plugin-react-dom recommended rules, eslint-plugin-react-x recommended TypeScript rules, Oxc, @vitejs/plugin-react (+9 more)

### Community 9 - "API controller infrastructure"
Cohesion: 0.13
Nodes (5): EventsHub.Api.Controllers, EventsHub.UnitTests.Controllers, EventsHubBaseController, Mediator, WeatherForecastController

### Community 10 - "Frontend development tools"
Cohesion: 0.11
Nodes (18): devDependencies, @babel/core, babel-plugin-react-compiler, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+10 more)

### Community 11 - "Event domain model"
Cohesion: 0.12
Nodes (16): Event, Category, City, Date, Description, Id, IsCancelled, Latitude (+8 more)

### Community 12 - "Node TypeScript settings"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 13 - "API launch profiles"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, https (+1 more)

### Community 14 - "OpenAPI launch profiles"
Cohesion: 0.22
Nodes (8): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, environmentVariables, launchBrowser, profiles, EventsHub.OpenApi, $schema

### Community 15 - "Weather forecast model"
Cohesion: 0.25
Nodes (6): EventsHub.Api, WeatherForecast, Date, Summary, TemperatureC, TemperatureF

### Community 16 - "HTTP integration requests"
Cohesion: 0.39
Nodes (8): Local baseUrl: https://localhost:5001/api/v1, GET /events/:eventId expects 200 for seeded event 0ae78c6a-73d5-43a6-9f5f-6056ccc0da6f, GET /events/non-existing-eventId expects 404 and the string The event was not found, GET /events expects 200 and an array, Events request folder with inherited authentication, EventsHub.IntegrationTests OpenCollection 1.0.0 with Bruno exclusions for node_modules and .git, WeatherForecast request folder with inherited authentication, GET /weatherforecast expects 200 and exactly five array elements

### Community 17 - "Social icon assets"
Cohesion: 0.29
Nodes (7): Bluesky butterfly symbol, Discord symbol, Documentation page and code brackets symbol, GitHub symbol, Social profile and star symbol, Reusable SVG symbol sprite, X social network symbol

## Knowledge Gaps
- **185 isolated node(s):** `Mediator`, `net10.0`, `Microsoft.AspNetCore.OpenApi (10.0.11)`, `Microsoft.EntityFrameworkCore.Design (10.0.11)`, `Microsoft.NET.Sdk.Web` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 248 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Event` connect `Event commands and queries` to `Persistence and test setup`, `Event controller tests`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `AppDbContext` connect `Event commands and queries` to `Persistence and test setup`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `EventsController` connect `Event controller tests` to `API controller infrastructure`, `Persistence and test setup`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `Mediator`, `net10.0`, `Microsoft.AspNetCore.OpenApi (10.0.11)` to the rest of the system?**
  _185 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Generated RPC clients` be split into smaller, more focused modules?**
  _Cohesion score 0.07373271889400922 - nodes in this community are weakly interconnected._
- **Should `Event commands and queries` be split into smaller, more focused modules?**
  _Cohesion score 0.05021173623714459 - nodes in this community are weakly interconnected._
- **Should `React application dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05142857142857143 - nodes in this community are weakly interconnected._
## Validation notes
- Raw extraction diagnostic: 37 dangling-endpoint edges; 28 same-endpoint edges collapsed in the default undirected graph (27 in directed simulation). The graph may omit relationship detail.
- The generated client under src/src/EventsHub.OpenApi/Generated/ does not match the configured exclusion src/EventsHub.OpenApi/Generated/.
- Create 200, Delete 200, and Edit 204 request files assert HTTP 404 in their content.
- Semantic extraction token usage was unavailable; no external LLM API was invoked by this pipeline.
