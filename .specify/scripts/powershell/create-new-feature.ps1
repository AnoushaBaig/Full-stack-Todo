#\!/usr/bin/env pwsh
param(
    [Parameter(Mandatory=$true)][string]$Json,
    [Parameter(Mandatory=$false)][int]$Number,
    [Parameter(Mandatory=$false)][string]$ShortName
)

# PowerShell script to create new feature
Write-Host "Creating new feature with number: $Number, short name: $ShortName"
Write-Host "Feature description: $Json"

# Create the spec directory
$specDir = Join-Path "specs" "$($Number.ToString(`"000`"))-$ShortName"
New-Item -ItemType Directory -Path $specDir -Force | Out-Null

# Create the spec file
$specFile = Join-Path $specDir "spec.md"
@"# Feature Specification: $ShortName

## Overview

TODO: Add overview of the feature

## User Scenarios & Testing

TODO: Add user scenarios

## Functional Requirements

TODO: Add functional requirements

## Success Criteria

TODO: Add success criteria

## Key Entities

TODO: Add key entities if data is involved

## Assumptions

TODO: Add assumptions

## Dependencies

TODO: Add dependencies

## Scope (In/Out)

TODO: Define what is in/out of scope
"@ | Out-File -FilePath $specFile -Encoding UTF8

# Create the plan file
$planFile = Join-Path $specDir "plan.md"
@"# Implementation Plan: $ShortName

TODO: Add implementation plan
"@ | Out-File -FilePath $planFile -Encoding UTF8

# Create the tasks file
$tasksFile = Join-Path $specDir "tasks.md"
@"# Tasks: $ShortName

TODO: Add implementation tasks
"@ | Out-File -FilePath $tasksFile -Encoding UTF8

# Output JSON with branch name and spec file
$result = @{
    BRANCH_NAME = "$Number-$ShortName"
    SPEC_FILE = $specFile
    PLAN_FILE = $planFile
    TASKS_FILE = $tasksFile
} | ConvertTo-Json

Write-Output $result

