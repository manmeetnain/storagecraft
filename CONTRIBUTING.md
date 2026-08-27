# Contributing to StorageCraft

StorageCraft welcomes precise explanations, reproducible experiments, accessible UI improvements, and focused simulators.

## Good first contributions

- Correct an unclear explanation and cite a primary technical source.
- Add a validated example or failure scenario.
- Improve keyboard, screen-reader, mobile, or reduced-motion behavior.
- Propose a simulator with its learning objective and validation method.

## Development

```bash
npm install
npm run dev
npm run check
```

Keep pull requests focused. Explain the user problem, the technical assumptions, how you validated the result, and any limitations. Do not include confidential vendor or customer information.

## Content standard

Every guide should answer:

1. What problem does this mechanism solve?
2. What is the data or control path?
3. What invariant makes it correct?
4. What does it cost?
5. How does it fail?
6. What should an engineer measure?

Use primary specifications, papers, or official documentation where possible. Never present an educational model as vendor-specific production guidance.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
