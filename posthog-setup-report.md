# PostHog post-wizard report

The wizard has completed a PostHog JavaScript Web integration for Placements Simplified. The PostHog browser SDK is initialized from Vite environment variables in both browser entry points, preserving default autocapture, pageviews, and session recording. Authenticated visitors are identified on login and returning visits, then reset on logout. A focused set of product events captures roadmap engagement, checklist progress, resume review completions, authentication completions, and project-directory searches. JWT decoding failures are sent to PostHog error tracking.

| Event name | Description | File |
| --- | --- | --- |
| `roadmap_tab_selected` | Tracks when a visitor selects a preparation domain tab. | `src/main.js` |
| `roadmap_checklist_item_toggled` | Tracks progress updates when a learner checks or unchecks a roadmap item. | `src/main.js` |
| `resume_review_completed` | Tracks successful completion of a resume review with non-sensitive outcome details. | `src/main.js` |
| `auth_completed` | Tracks successful account sign-in or registration after user identification. | `src/main.js` |
| `project_search_used` | Tracks when a visitor searches the final-year project directory. | `src/main.js` |

## Next steps

A dashboard is ready for the newly instrumented events:

- [Analytics basics (wizard)](https://us.posthog.com/project/518205/dashboard/1868785)

No event insights were added yet because these newly introduced custom events have not reached the active project schema. After deploying and exercising the flows, create trends and funnel insights using the events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

The project includes an agent skill folder at `.claude/skills/integration-javascript_web`. It can be used for future agent development to keep PostHog integration approaches current.
