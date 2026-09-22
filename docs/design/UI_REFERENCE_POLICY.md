# UI Reference Policy

## Source-of-Truth Order

When implementing a page, use this hierarchy:

1. **Product Analysis** — behavior, features, states, rules.
2. **Reference Screenshot** — structure/layout/content hierarchy.
3. **Repository Design System** — visual component styling.
4. **Technical Architecture / Stack** — implementation boundaries.

## Screenshots Are Structural References

Use screenshots for:

- section order,
- element placement,
- grouping,
- approximate proportions,
- visual hierarchy,
- expected presence of page elements.

Do not copy screenshot styling when the repository already has a Design System equivalent.

## Design System Is the Component Styling Authority

Examples:

- Screenshot has a button → use the project `Button`.
- Screenshot has an input → use/extend the project `Input`.
- Screenshot has an alert/message → use/extend the project `Alert`.
- Screenshot has a card → use/extend the project `Card`.
- Screenshot has a modal → use/extend the project `Dialog`.

## New Components

Before creating a new component:

1. search existing Design System,
2. check whether an existing component supports the need,
3. prefer a safe variant/extension,
4. create a new shared component only when the concept is genuinely new.

## Never

- create page-local button systems,
- hard-code screenshot colors as a new palette,
- duplicate existing cards/inputs,
- copy screenshot border radius/shadow blindly,
- alter global tokens for a single page,
- rewrite shared components only to match one screenshot.

## Required Page States

Where relevant, page implementation must consider:

- default,
- loading,
- empty,
- error,
- disabled,
- authenticated/unauthenticated,
- feature enabled/disabled,
- Arabic RTL,
- English LTR,
- light,
- dark,
- desktop/tablet/mobile.
