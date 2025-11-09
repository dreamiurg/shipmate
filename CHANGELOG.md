## [1.3.1](https://github.com/dreamiurg/shipmate/compare/v1.3.0...v1.3.1) (2025-11-09)


### Bug Fixes

* pass script paths from skill to agents to prevent recreation ([c116f90](https://github.com/dreamiurg/shipmate/commit/c116f90d33f727fd6ca433adab1388d29fa516d8))

## [1.3.0](https://github.com/dreamiurg/shipmate/compare/v1.2.3...v1.3.0) (2025-11-09)


### Features

* add fetch-github-activity.sh script to reduce approval prompts ([aa89d90](https://github.com/dreamiurg/shipmate/commit/aa89d907a6fbbefd7ee6b73f297ec22821ace199))


### Bug Fixes

* update claude-analyzer-agent to use bundled script ([cb797ff](https://github.com/dreamiurg/shipmate/commit/cb797ffa750524422cde814a7635a39f8c4c62c2))

## [1.2.3](https://github.com/dreamiurg/shipmate/compare/v1.2.2...v1.2.3) (2025-11-09)


### Bug Fixes

* implement shipmate improvement recommendations ([#22](https://github.com/dreamiurg/shipmate/issues/22)) ([6e0416c](https://github.com/dreamiurg/shipmate/commit/6e0416cbddfabe2f1743ade47537d066610c041f))

## [1.2.2](https://github.com/dreamiurg/shipmate/compare/v1.2.1...v1.2.2) (2025-11-09)


### Bug Fixes

* implement shipmate improvement recommendations ([3728427](https://github.com/dreamiurg/shipmate/commit/372842704b5c42bcc910029a9ac0e8596ee22d24))

## [1.2.1](https://github.com/dreamiurg/shipmate/compare/v1.2.0...v1.2.1) (2025-11-06)


### Bug Fixes

* add mise tooling and resolve markdown linting errors ([#21](https://github.com/dreamiurg/shipmate/issues/21)) ([9f6ad9b](https://github.com/dreamiurg/shipmate/commit/9f6ad9b5e4aa7d21b4167c8532c98e5095b46a18))

## [1.2.0](https://github.com/dreamiurg/shipmate/compare/v1.1.8...v1.2.0) (2025-11-06)


### Features

* Claude Code session integration ([#20](https://github.com/dreamiurg/shipmate/issues/20)) ([aecb75b](https://github.com/dreamiurg/shipmate/commit/aecb75bd94b79acd7e9c5c2bb5c4fd1791123b7e))

## [1.1.8](https://github.com/dreamiurg/shipmate/compare/v1.1.7...v1.1.8) (2025-11-05)


### Bug Fixes

* use inline date substitution to enable command pre-approval ([#18](https://github.com/dreamiurg/shipmate/issues/18)) ([aff4bc6](https://github.com/dreamiurg/shipmate/commit/aff4bc663d269dd5d01654a4c49de14ca001a684))

## [1.1.7](https://github.com/dreamiurg/shipmate/compare/v1.1.6...v1.1.7) (2025-11-05)


### Bug Fixes

* run CI only on pull requests, not on push to main ([#16](https://github.com/dreamiurg/shipmate/issues/16)) ([783f70f](https://github.com/dreamiurg/shipmate/commit/783f70ffb259de178e211f356b2f85cfa700a812))

## [1.1.6](https://github.com/dreamiurg/shipmate/compare/v1.1.5...v1.1.6) (2025-11-05)


### Bug Fixes

* align skill directory name with skill name for proper registration ([#14](https://github.com/dreamiurg/shipmate/issues/14)) ([05d277b](https://github.com/dreamiurg/shipmate/commit/05d277b92db902530682a9550b8aed8f6671d5d1))
* update script path after skill directory rename ([#15](https://github.com/dreamiurg/shipmate/issues/15)) ([7a226b1](https://github.com/dreamiurg/shipmate/commit/7a226b15a4a9ec6a0784edc2aa82025a16e6a78e)), closes [#14](https://github.com/dreamiurg/shipmate/issues/14)

## [1.1.5](https://github.com/dreamiurg/shipmate/compare/v1.1.4...v1.1.5) (2025-11-05)


### Bug Fixes

* remove slash command causing triple invocation ([#13](https://github.com/dreamiurg/shipmate/issues/13)) ([b627318](https://github.com/dreamiurg/shipmate/commit/b6273181ec1582d3e4fe665eb405aa2549f69c19))

## [1.1.4](https://github.com/dreamiurg/shipmate/compare/v1.1.3...v1.1.4) (2025-11-05)


### Bug Fixes

* resolve slash command and skill name collision ([#12](https://github.com/dreamiurg/shipmate/issues/12)) ([6951656](https://github.com/dreamiurg/shipmate/commit/6951656480760769bf2636d3dea6a165381fed7c))

## [1.1.3](https://github.com/dreamiurg/shipmate/compare/v1.1.2...v1.1.3) (2025-11-05)


### Bug Fixes

* enforce mandatory scope selection and todo tracking in eod skill ([#10](https://github.com/dreamiurg/shipmate/issues/10)) ([ee3a264](https://github.com/dreamiurg/shipmate/commit/ee3a264ae8a3291c50a243c342fa0524df880c07))

## [1.1.2](https://github.com/dreamiurg/shipmate/compare/v1.1.1...v1.1.2) (2025-11-05)


### Bug Fixes

* correct skill naming to use plugin auto-prefixing ([#8](https://github.com/dreamiurg/shipmate/issues/8)) ([ebe02a0](https://github.com/dreamiurg/shipmate/commit/ebe02a06c10c5007e6b9a0a6d2df61b9ddd9c354))

## [1.1.1](https://github.com/dreamiurg/shipmate/compare/v1.1.0...v1.1.1) (2025-11-05)


### Bug Fixes

* remove duplicate shipmate namespace from agent names ([#7](https://github.com/dreamiurg/shipmate/issues/7)) ([92b7c27](https://github.com/dreamiurg/shipmate/commit/92b7c27df4bd8276aca06deac9a86b8bf7383d6d))

## [1.1.0](https://github.com/dreamiurg/shipmate/compare/v1.0.3...v1.1.0) (2025-11-05)


### Features

* add pre-commit hooks for gitleaks and markdownlint ([#6](https://github.com/dreamiurg/shipmate/issues/6)) ([7ec3de2](https://github.com/dreamiurg/shipmate/commit/7ec3de2fd002266b8f4c7dd08ef63833a47bb0c3))

## [1.0.3](https://github.com/dreamiurg/shipmate/compare/v1.0.2...v1.0.3) (2025-11-05)


### Bug Fixes

* restore full skill name to end-of-day-summary ([#5](https://github.com/dreamiurg/shipmate/issues/5)) ([2d81835](https://github.com/dreamiurg/shipmate/commit/2d8183587678e5f6fa703f7d55b3eb9dcec210a2))

## [1.0.2](https://github.com/dreamiurg/shipmate/compare/v1.0.1...v1.0.2) (2025-11-05)


### Bug Fixes

* remove duplicate shipmate prefix in skill name ([#3](https://github.com/dreamiurg/shipmate/issues/3)) ([5cd924b](https://github.com/dreamiurg/shipmate/commit/5cd924b6bf8fe21be8bac26e2c69c7db6229dc2f))

## [1.0.1](https://github.com/dreamiurg/shipmate/compare/v1.0.0...v1.0.1) (2025-11-05)


### Bug Fixes

* correct version update in SKILL.md footer ([#2](https://github.com/dreamiurg/shipmate/issues/2)) ([d50101b](https://github.com/dreamiurg/shipmate/commit/d50101b21a37adf66c328d1b88ad28724364039c))

## 1.0.0 (2025-11-05)


### Features

* initial shipmate plugin release ([876ee0c](https://github.com/dreamiurg/shipmate/commit/876ee0ccbb1eefa1ad3d1167b880b662ddc22fc4))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Initial release coming soon!
