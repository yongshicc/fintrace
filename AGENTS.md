# FinTrace Agent Constraints

- Financial calculations belong exclusively in `src/engine`.
- UI components must not duplicate financial formulas.
- Financial numbers must never originate from an LLM.
- Public demos must work without paid API credentials.
- All financial assumptions must be documented.
- Tests must be executed before reporting success.
- Do not fabricate performance or test metrics.
- Do not put credentials in client-side code.
- Do not add unnecessary dependencies.
- Preserve accessibility.
- Use small, understandable functions.
- Do not silently change financial assumptions.
- Do not fabricate human approval or code reviews.
